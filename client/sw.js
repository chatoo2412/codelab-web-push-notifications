/* eslint-env serviceworker */
/* eslint-disable no-restricted-globals */

self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received.', event)

  const title = 'Web Push Notifications Codelab'
  const options = {
    body: (event.data && event.data.text()) || 'Push without text.',
    icon: 'icon.png',
    badge: 'badge.png',
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click Received.', event)

  event.notification.close()

  event.waitUntil(clients.openWindow('https://github.com/chatoo2412/codelab-web-push-notifications'))
})

// TODO: I'm not sure when this event fired.
// https://developers.google.com/web/updates/2016/09/options-of-a-pushsubscription
// https://w3c.github.io/push-api/#the-pushsubscriptionchange-event
self.addEventListener('pushsubscriptionchange', (event) => {
  console.log("[Service Worker]: 'pushsubscriptionchange' event fired.", event)

  event.waitUntil(
    (async () => {
      const newSubscription = await self.registration.pushManager.subscribe(event.oldSubscription.options)

      // TODO: Send subscription to application server
      console.log(newSubscription)
    })(),
  )
})
