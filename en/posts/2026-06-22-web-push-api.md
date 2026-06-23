---
title: "Web Push API"
date: 2026-06-22
tags: [tech]
---

# The Complete Guide to the Web Push API: From Architecture to Practical Implementation

_Oleksandr Blazheiko · IT Friday · June 2026_

---

Remember the days when a website could only shout at you while you kept its tab open? 🙃 Web Push put an end to that. Now a site can send you a notification even when the tab was closed long ago and the browser is peacefully dozing in the background. In effect, PWAs gained a superpower that previously belonged only to native mobile apps. 💪

In this article we'll take a detailed look at how the Web Push ecosystem works, what components it's made of, and how to put it into practice — no magic, but a couple of tricks. 🎩

## 1. How Web Push Works: The Three Pillars 🐳

Web Push rests on the interaction of three core components. Picture them as a triangle where everyone is friends, but each does their own job:

- **The client side (your website):** runs in the user's browser and is responsible for the subscription and the UI interaction. This is the one that says "I want notifications!".
- **Your server (Application Server):** stores the subscription data and triggers the sending of messages. The brain of the operation. 🧠
- **The Push Service:** an intermediary server operated by the browser vendor (for example, Google's FCM for Chrome or Mozilla's servers for Firefox). It receives the request from your server and delivers it to the user's device. A kind of mail carrier who never sleeps. 📮

The lifecycle of a message:

1. **Step 1: Subscription.** The user grants permission (a sacred moment — don't blow it 😉, more on that below). The browser generates a subscription object (`PushSubscription`) containing a unique URL (`endpoint`) of the push service and encryption keys.
2. **Step 2: Storing.** Your website sends this `PushSubscription` object to your backend server, where you carefully save (or overwrite) it in the database.
3. **Step 3: Trigger.** When it's time to send a notification, your server takes the subscription from the database, encrypts the payload, and makes a `POST` request to the push service at that endpoint URL.
4. **Step 4: Delivery.** The browser maintains communication with the push service. The push service receives the message and passes it to the browser, which gently "wakes up" your Service Worker (☕ nobody offers it coffee), and the worker handles the event and shows the notification.

## 2. The Role of the Service Worker 👷

Web Push can't exist without a Service Worker — a special JavaScript file that the browser runs in a background thread, isolated from any specific web page. Think of it as a background worker that waits quietly until the browser needs it. Since it isn't tied to a tab, the browser can wake it up at any moment, the instant the push service sends a signal.

**Important:** because of the high security requirements, Service Workers — and therefore Web Push — work exclusively over the secure HTTPS protocol, except for `localhost` during development — because we do trust ourselves 😎.

## 3. Browser Support and iOS Limitations 🍏

As of June 2026, Web Push is no longer an experimental feature: modern versions of Chrome, Edge, Firefox, and Safari support the Push API along with the Service Worker and the Notifications API. On desktop this means it works properly in the major browsers, and on Android — in browsers that support Service Workers and push subscriptions.

But "supports" doesn't mean "behaves the same way." Different browsers may differ in permission UX, power-saving policies, background-activity restrictions, icon behavior, `badge`, `actions`, and message delivery in modes like Do Not Disturb or Focus. Classic scenario: everything works perfectly in Chrome, then you open Safari and start believing in fate all over again. 🤷 That's exactly why, in a real product, it's better to do feature detection rather than browser detection:

```js
const isPushSupported =
  'serviceWorker' in navigator &&
  'PushManager' in window &&
  'Notification' in window;
```

### iOS and iPadOS specifics

And now about Apple — well, how could it be without special conditions (they're true to themselves). 🍎 On iPhone and iPad, Web Push has an important limitation: it doesn't work for a regular Safari tab, only for a web app that the user has manually added to the Home Screen. Support arrived only in iOS and iPadOS 16.4 for Home Screen web apps (yes, we waited a long time for it too).

Practical implications:

- the site must be installed on the Home Screen as a web app;
- it's advisable to have a correct Web App Manifest with `display: "standalone"` or `display: "fullscreen"`;
- the notification permission request must happen only after a direct user action, for example after tapping a "Subscribe" button;
- the user can manage permissions for such a web app in the system Notifications Settings, just like for native apps;
- notifications may fall under Focus / Do Not Disturb rules;
- for delivery, Apple uses the Apple Push Notification service, but a separate Apple Developer Program account is not required for standard Web Push;
- if your server or infrastructure has an allowlist for push-endpoint URLs, you need to allow `*.push.apple.com`.

The main takeaway for iOS is simple: Web Push there should be designed as a PWA scenario (the PWA talk is already on the channel), not as a feature of a regular browser page. If the user just opened the site in Safari and didn't add it to the Home Screen, the push subscription may be unavailable, and no dancing with a tambourine will help. 🥁

## 4. Practical Implementation: Step by Step 🛠️

Enough theory — let's get our hands on the keyboard. 👨‍💻

### Step 1: Registering the Service Worker and subscribing the user

First, you need to check for technology support and register the Service Worker on the client side:

```js
// Checking browser support
if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register('/sw.js')
    .then(function(swReg) {
      console.log('Service Worker registered successfully', swReg);
      initialiseUI(swReg);
    })
    .catch(function(error) {
      console.error('Service Worker registration error', error);
    });
}
```

After registration (once the user has performed some action on your site), we can subscribe the user using the `pushManager.subscribe()` method:

```js
function subscribeUser(swReg) {
  // Your server's VAPID key (in UInt8Array format)
  const applicationServerKey = urlB64ToUint8Array('YOUR_PUBLIC_VAPID_KEY');

  swReg.pushManager.subscribe({
    // Required parameter: a promise to always show a notification to the user
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
    .then(function(subscription) {
      console.log('User subscribed successfully:', JSON.stringify(subscription));

      // Send the subscription object to your server via fetch/axios
      sendSubscriptionToServer(subscription);
    })
    .catch(function(err) {
      console.log('Failed to subscribe the user: ', err);
    });
}
```

### Step 2: The Web Push protocol and VAPID keys 🔐

To let the push service identify which application server is sending the message, Web Push uses VAPID (Voluntary Application Server Identification). It helps push services associate requests with your server and reduces abuse, but your subscription endpoints should still be treated as secrets.

You generate a key pair: public and private. The public key is used during the subscription in the browser, while the private key stays on your server and signs JWT tokens on every request to the push service. The rule is simple: the private key is like a toothbrush — don't give it to anyone and don't commit it to Git. 🪥

```js
const webpush = require('web-push');

const vapidKeys = {
  publicKey: 'YOUR_PUBLIC_KEY',
  privateKey: 'YOUR_PRIVATE_KEY'
};

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// The subscription object received from the client, taken from the DB
const pushSubscription = { ... };

const payload = JSON.stringify({
  title: 'New message!',
  body: 'Hi, this is a push notification from our server.'
});

webpush.sendNotification(pushSubscription, payload)
  .then(response => console.log('Notification sent'))
  .catch(err => console.error('Sending error', err));
```

### Step 3: Handling the Push event in the Service Worker (`sw.js`)

When the message reaches the device, it triggers the `push` event inside your `sw.js`. This is where our background worker 👷 finally wakes up: the browser delivers the decrypted payload to it, and it shows a native notification using `self.registration.showNotification()`.

```js
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push message received.');

  let data = {
    title: 'Default',
    body: 'New event.'
  };

  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.body,
    icon: '/images/icon.png', // Small brand icon
    image: '/images/big-image.png', // Large image in the body of the notification
    badge: '/images/badge.png', // Icon for the Android status bar
    tag: 'unique-message-tag', // Allows replacing previous pushes with this tag
    renotify: true, // Makes the phone vibrate again if the tag repeats
    actions: [
      { action: 'explore', title: 'View details' },
      { action: 'close', title: 'Close' }
    ]
  };

  // Wait for the asynchronous display operation to complete
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
```

## 5. Notification Behavior: Clicks and Interaction 🖱️

Just showing a notification isn't enough — you need to handle the user's click on it. By default, if you tap a push, exactly nothing happens (a bit inconvenient, you'll agree 😅). To react to the interaction, we use the `notificationclick` event:

```js
self.addEventListener('notificationclick', function(event) {
  const notification = event.notification;
  const action = event.action;

  notification.close(); // Always close the notification

  if (action === 'close') {
    return;
  }

  // Open the site or focus an already open tab
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(function(windowClients) {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];

        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow('/news-page');
      }
    })
  );
});
```

## 6. User Experience (UX Permissions) 🤝

And here we've reached the most important — and most frequently botched — aspect: the UX of the permission request.

- **Anti-pattern:** firing off a permission request right away on the first page load. This is a very bad strategy — most users will instinctively hit "Block," and there's no second chance (never do this).
- **Best Practice:** use the "double-prompt" (soft-ask) approach. First show your own polite banner on the site: "Want to receive notifications about new articles?" (and even better, after the user takes active actions on your site). And only after the user clicks "Yes" themselves, trigger the browser's system request. Build trust first — then ask for permission. 😉

## Conclusion 🎯

The Web Push API is a powerful tool for engagement and retention. It requires a well-coordinated trio: the client (Service Worker), your server (via VAPID), and the push services. Put this puzzle together correctly and you get a reliable bridge of communication with your audience, plus an extra chance to raise your retention rate.

But remember the golden rule: with great power comes great responsibility. 🕷️ Notifications are a privilege, not a right. Send only what truly matters, and users will love your app. Bury them in spam — and the "Block" button will be hit faster than your `POST` request reaches the push service. 🚫

Now go and push responsibly! 🚀

---

Sources:

- [Web Push Book](https://web-push-book.gauntface.com/) — highly recommended, just 12 pages and you'll have a full understanding of how it works.
- [MDN: Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [WebKit: Web Push for Web Apps on iOS and iPadOS](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/)
