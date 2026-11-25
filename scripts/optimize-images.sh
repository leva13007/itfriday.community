#!/usr/bin/env bash
# Image optimisation for the site (QA #16). Idempotent: run after adding a cover or a speaker photo.
#   pnpm images
#
# - Stream covers: public/streams/NNN.png → NNN.webp, max 1380 px wide (2× the ~690 px content column).
#   The page shows the WebP; the PNG stays as og:image (Telegram/LinkedIn previews are safest with PNG/JPG).
# - Speaker photos: public/speakers/*.jpg resized in place so the SHORT side is ≤ 240 px
#   (2× the largest display size, the 120 px profile photo; cards crop to a square with object-fit).
# - Speaker photos: EXIF/XMP metadata stripped (lossless).
#
# Needs: cwebp + jpegtran (brew install webp jpeg) and sips (built into macOS).
set -euo pipefail
cd "$(dirname "$0")/.."

COVER_MAX=1380
AVATAR_MIN_SIDE=240

for png in public/streams/[0-9][0-9][0-9].png; do
  webp="${png%.png}.webp"
  [[ -f "$webp" && "$webp" -nt "$png" ]] && continue
  w=$(sips -g pixelWidth "$png" | awk '/pixelWidth/ {print $2}')
  resize=()
  (( w > COVER_MAX )) && resize=(-resize "$COVER_MAX" 0)
  cwebp -quiet -q 80 -m 6 ${resize[@]+"${resize[@]}"} "$png" -o "$webp"
  echo "cover  $webp  $(( $(stat -f%z "$png") / 1024 )) KB → $(( $(stat -f%z "$webp") / 1024 )) KB"
done

for jpg in public/speakers/*.jpg; do
  read -r w h < <(sips -g pixelWidth -g pixelHeight "$jpg" | awk '/pixelWidth/ {w=$2} /pixelHeight/ {h=$2} END {print w, h}')
  short=$(( w < h ? w : h ))
  (( short <= AVATAR_MIN_SIDE )) && continue
  before=$(stat -f%z "$jpg")
  if (( w <= h )); then
    sips -s formatOptions 82 --resampleWidth "$AVATAR_MIN_SIDE" "$jpg" >/dev/null
  else
    sips -s formatOptions 82 --resampleHeight "$AVATAR_MIN_SIDE" "$jpg" >/dev/null
  fi
  echo "avatar $jpg  $(( before / 1024 )) KB → $(( $(stat -f%z "$jpg") / 1024 )) KB"
done

# Strip EXIF/XMP (phone model, capture date, GPS, face regions) — lossless, the pixels are not re-encoded.
# Skipped when the photo relies on an EXIF orientation tag, since dropping it would rotate the image.
for jpg in public/speakers/*.jpg; do
  grep -qaE 'Exif|xmpmeta' "$jpg" || continue
  orient=$(sips -g orientation "$jpg" | awk '/orientation/ {print $2}')
  if [[ "$orient" != "<nil>" && "$orient" != "1" ]]; then
    echo "skip   $jpg  (EXIF orientation $orient — rotate it first)"; continue
  fi
  jpegtran -copy none -optimize -outfile "$jpg.tmp" "$jpg" && mv "$jpg.tmp" "$jpg"
  echo "strip  $jpg  metadata removed"
done
