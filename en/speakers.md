---
title: Speakers
---

<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const profileIcon = { svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0zM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695z" clip-rule="evenodd" /></svg>' }

const speakers = [
  {
    avatar: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=oleh-levchenko',
    name: 'Oleh Levchenko',
    title: 'Senior Full Stack Developer · IT Friday Founder',
    org: 'The AA',
    desc: 'React, Node.js, TypeScript, AWS. 7+ years in web development. Founder of IT Friday.',
    links: [
      { icon: 'youtube', link: 'https://youtube.com/@zloyleva' },
      { icon: profileIcon, link: '/en/speakers/oleh-levchenko' },
    ]
  },
  {
    avatar: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=oleksandr-blazheiko',
    name: 'Oleksandr Blazheiko',
    title: 'Software Development Engineer',
    org: 'itvibe.party',
    orgLink: 'https://itvibe.party',
    desc: 'Fullstack, 7+ years. Building an AI language learning platform: chat, real-time translator, AI teacher.',
    links: [
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/%D0%BE%D0%BB%D0%B5%D0%BA%D1%81%D0%B0%D0%BD%D0%B4%D1%80-%D0%B1%D0%BB%D0%B0%D0%B6%D0%B5%D0%B9%D0%BA%D0%BE-63410965/' },
      { icon: profileIcon, link: '/en/speakers/oleksandr-blazheiko' },
    ]
  },
]
</script>

# Speakers

Everyone who has appeared on IT Friday.

<VPTeamMembers size="small" :members="speakers" />
