---
title: "Web Push API"
date: 2026-06-22
tags: [tech]
---

# Повний гайд по Web Push API: Від архітектури до практичної реалізації

_Олександр Блажейко · IT Friday · Червень 2026_

---

Технологія Web Push змінила правила гри для сучасного вебу. Вона дає можливість вебсайтам надсилати сповіщення користувачам навіть тоді, коли вкладка з сайтом закрита, а сам браузер працює у фоновому режимі. Це наближає можливості вебдодатків (PWA) до нативних мобільних застосунків.

У цій статті ми детально розберемо, як працює екосистема Web Push, з яких компонентів вона складається та як реалізувати її на практиці.

## 1. Як працює Web Push: Три головні кити

Технологія Web Push тримається на взаємодії трьох основних компонентів:

- **Клієнтська частина (ваш вебсайт):** працює в браузері користувача, відповідає за підписку та взаємодію з інтерфейсом.
- **Ваш сервер (Application Server):** зберігає дані підписок та ініціює надсилання повідомлень.
- **Push-служба (Push Service):** проміжний сервер, який керується розробником браузера (наприклад, FCM від Google для Chrome чи сервери Mozilla для Firefox). Вона приймає запит від вашого сервера і доставляє його на пристрій користувача.

Схема життєвого циклу повідомлення:

1. **Крок 1: Підписка.** Користувач дає дозвіл. Браузер генерує об'єкт підписки (`PushSubscription`), який містить унікальний URL (`endpoint`) push-служби та ключі шифрування.
2. **Крок 2: Збереження.** Ваш вебсайт відправляє цей об'єкт `PushSubscription` на ваш бекенд-сервер, де ви зберігаєте його в базі даних.
3. **Крок 3: Тригер.** Коли потрібно надіслати сповіщення, ваш сервер бере підписку з БД, шифрує корисне навантаження (`payload`) і робить `POST`-запит до push-служби за отриманим URL.
4. **Крок 4: Доставка.** Push-служба тримає постійне з'єднання з пристроєм користувача. Вона приймає повідомлення та передає його в браузер. Браузер «будить» ваш Service Worker, який обробляє подію та показує сповіщення.

## 2. Роль Service Worker

Web Push не може існувати без Service Worker — спеціального JavaScript-файлу, який браузер виконує у фоновому потоці, ізольовано від конкретної вебсторінки. Оскільки Service Worker не прив'язаний до вкладки, браузер може активувати його у будь-який момент, коли push-служба надішле сигнал.

**Важливо:** через високі вимоги до безпеки, Service Workers, а отже, і Web Push, працюють виключно через захищений протокол HTTPS (за винятком `localhost` для розробки).

## 3. Практична реалізація: Крок за кроком

### Крок 1: Реєстрація Service Worker та підписка користувача

Спочатку потрібно перевірити підтримку технології та зареєструвати Service Worker на клієнтській стороні:

```js
// Перевірка підтримки в браузері
if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register('/sw.js')
    .then(function(swReg) {
      console.log('Service Worker зареєстровано успішно', swReg);
      initialiseUI(swReg);
    })
    .catch(function(error) {
      console.error('Помилка реєстрації Service Worker', error);
    });
}
```

Після реєстрації ми можемо підписати користувача за допомогою методу `pushManager.subscribe()`:

```js
function subscribeUser(swReg) {
  // Ключ VAPID вашого сервера (у форматі UInt8Array)
  const applicationServerKey = urlB64ToUint8Array('ВАШ_ПУБЛІЧНИЙ_VAPID_КЛЮЧ');

  swReg.pushManager.subscribe({
    // Обов'язковий параметр: обіцянка завжди показувати сповіщення користувачу
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
    .then(function(subscription) {
      console.log('Користувача успішно підписано:', JSON.stringify(subscription));

      // Відправляємо об'єкт subscription на свій сервер через fetch/axios
      sendSubscriptionToServer(subscription);
    })
    .catch(function(err) {
      console.log('Не вдалося підписати користувача: ', err);
    });
}
```

### Крок 2: Протокол Web Push та VAPID ключі

Щоб push-служба розуміла, хто саме надсилає повідомлення, і не дозволяла спамерам шлюзувати спам через ваші ендпоінти, використовується специфікація VAPID (Voluntary Application Server Identification).

Ви генеруєте пару ключів: Public (публічний) та Private (приватний). Публічний ключ використовується під час підписки в браузері, а приватний ключ залишається на вашому сервері та використовується для підписання JWT-токенів при кожному запиті до push-служби.

```js
const webpush = require('web-push');

const vapidKeys = {
  publicKey: 'ВАШ_ПУБЛІЧНИЙ_КЛЮЧ',
  privateKey: 'ВАШ_ПРИВАТНИЙ_КЛЮЧ'
};

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Об'єкт підписки, отриманий від клієнта з БД
const pushSubscription = { ... };

const payload = JSON.stringify({
  title: 'Нове повідомлення!',
  body: 'Привіт, це пуш-сповіщення з нашого сервера.'
});

webpush.sendNotification(pushSubscription, payload)
  .then(response => console.log('Сповіщення надіслано'))
  .catch(err => console.error('Помилка відправки', err));
```

### Крок 3: Обробка події Push у Service Worker (`sw.js`)

Коли повідомлення доходить до пристрою, воно викликає подію `push` всередині вашого `sw.js`. Тут ми розшифровуємо дані та показуємо нативне вікно за допомогою `self.registration.showNotification()`.

```js
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Отримано Push-повідомлення.');

  let data = {
    title: 'За замовчуванням',
    body: 'Нова подія.'
  };

  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.body,
    icon: '/images/icon.png', // Маленька іконка бренду
    image: '/images/big-image.png', // Велике зображення в тілі сповіщення
    badge: '/images/badge.png', // Іконка для сервісного рядка Android
    tag: 'unique-message-tag', // Дозволяє заміняти попередні пуші з цим тегом
    renotify: true, // Змушує телефон вібрувати знову, якщо тег повторюється
    actions: [
      { action: 'explore', title: 'Переглянути деталі' },
      { action: 'close', title: 'Закрити' }
    ]
  };

  // Очікуємо виконання асинхронної операції відображення
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
```

## 4. Поведінка сповіщень: Кліки та взаємодія

Просто показати сповіщення замало — потрібно обробити клік користувача по ньому. За замовчуванням, якщо натиснути на пуш, нічого не відбудеться. Для обробки взаємодії використовується подія `notificationclick`:

```js
self.addEventListener('notificationclick', function(event) {
  const notification = event.notification;
  const action = event.action;

  notification.close(); // Обов'язково закриваємо сповіщення

  if (action === 'close') {
    return;
  }

  // Відкриваємо сайт або фокусуємося на вже відкритій вкладці
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

## 5. Досвід користувача (UX Permissions)

Один із найважливіших аспектів — це правильний UX запиту дозволу.

- **Антипаттерн:** запитувати дозвіл одразу при першому завантаженні сторінки. Це дратує користувачів, і більшість натискає «Блокувати».
- **Best Practice:** використовуйте підхід «двоетапного запиту» (Double-prompt / Soft-ask). Спочатку покажіть кастомне інтерактивне вікно або плашку на сайті: "Хочете отримувати сповіщення про нові статті?". Тільки після того, як користувач натисне «Так» у вашому інтерфейсі, викликайте системний запит браузера.

## Висновок

Технологія Web Push API — це потужний інструмент маркетингу та залучення користувачів (Retention). Вона вимагає чіткої синхронізації між клієнтом (Service Worker), вашим сервером (через VAPID) та Push-службами. Правильна технічна реалізація разом із повагою до приватного простору користувача дозволить створити надійний міст комунікації між вашим вебресурсом та його аудиторією.
