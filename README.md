# Web Push Notifications Codelab

A simple implement of web push notifications.

## Prerequisites

* Node.js 8+
* One of these:
  * Google Chrome 65+
  * Firefox 59+ (enable `dom.moduleScripts.enabled` flag)

## Install

```sh
npm install
```

## Usage

```sh
npm run dev
```

1.  Visit `http://localhost:3000/server` and create a key pair.
1.  Open another tab and visit `http://localhost:3000/client`.
1.  Push the button and grant the permission.
1.  Return to the first page, the server, and push the send button.

## How It Works

Read these first: [How Push Works], [Google's codelab][adding push notifications to a web app]

### Summary

![Make sure you send the PushSubscription to your backend.][step1]<br>
![When your server wishes to send a push message, it makes a web push protocol request to a
push service.][step2]<br>
![When a push message is sent from a push service to a user's device, your service worker
receives a push event.][step3]<br>

0.  Server Side
    1.  Create and store `application server keys`.
1.  Client Side
    1.  Retrieve `application server public key` from the server.
    1.  Subscribe to the push service using `application server public key`.
        1.  Get a permission from the user.
        1.  Get a [`PushSubscription`][pushsubscription] from the push service.
    1.  Send the [`PushSubscription`][pushsubscription] to the server.
1.  Server Side
    1.  Save the [`PushSubscription`][pushsubscription] to the DB.
    1.  Generate the data that you want to send to the user.
    1.  Make an API call to the push service using [a library][web-push-libs]. The user's [`PushSubscription`][pushsubscription] and `application server keys` are needed.
        1.  Encrypt the data with the user public key.
        1.  Send the data to the endpoint URL with a payload of encrypted data.
1.  Push Service
    1.  The push service routes the message to the user's device.
1.  User's Device
    1.  User's device wakes up the browser, which finds the correct service worker and invokes a push event.
    1.  The service worker wakes up just long enough to display the notification and then goes back to sleep.

## Cautions

This implement uses [`localStorage`][localstorage] to share data between server and client. That's a major - and maybe the only - difference from [Google's codelab][adding push notifications to a web app].

```js
// client-side
const updateSubscriptionOnServer = (subscription) => {
  // TODO: Send subscription to application server
  window.localStorage.setItem('subscription', JSON.stringify(subscription))
}
```

```js
// server-side
const subscription = JSON.parse(window.localStorage.getItem('subscription'))
// ...
const result = await webPush.sendNotification(subscription, data, options)
```

## To Do

* Handle exceptions: I didn't handle exceptions on purpose to clarify my intentions.
* Replace `localStorage` with a database: We have to use databases for real world applications.
* Handle `pushsubscriptionchange` event: I'm still confused with this. Please help me if you can.

## Useful Links

### Documents

#### Basic

* [Web Push Notifications: Timely, Relevant, and Precise] (Everything you need to know is here.)
* [Adding Push Notifications to a Web App]
* [Introduction to Push Notifications]
* [The Service Worker Lifecycle]
* [Debugging Service Workers]

#### Advanced

* [Icons, Close Events, Renotify Preferences and Timestamps]
* [Notification Actions]
* [Application Server Keys and Web Push]

### Libraries and Implements

* [web-push-libs]
* [ServiceWorker Cookbook]
* [Notification Generator]

[web push notifications: timely, relevant, and precise]: https://developers.google.com/web/fundamentals/push-notifications/
[adding push notifications to a web app]: https://codelabs.developers.google.com/codelabs/push-notifications/
[introduction to push notifications]: https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications
[web-push-libs]: https://github.com/web-push-libs
[serviceworker cookbook]: https://serviceworke.rs/push-payload_demo.html
[the service worker lifecycle]: https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle
[how push works]: https://developers.google.com/web/fundamentals/push-notifications/how-push-works
[debugging service workers]: https://developers.google.com/web/fundamentals/codelabs/debugging-service-workers/
[notification generator]: https://tests.peter.sh/notification-generator/
[localstorage]: https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage
[icons, close events, renotify preferences and timestamps]: https://developers.google.com/web/updates/2016/03/notifications
[notification actions]: https://developers.google.com/web/updates/2016/01/notification-actions
[application server keys and web push]: https://developers.google.com/web/updates/2016/07/web-push-interop-wins
[pushsubscription]: https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription
[step1]: https://developers.google.com/web/fundamentals/push-notifications/images/svgs/browser-to-server.svg
[step2]: https://developers.google.com/web/fundamentals/push-notifications/images/svgs/server-to-push-service.svg
[step3]: https://developers.google.com/web/fundamentals/push-notifications/images/svgs/push-service-to-sw-event.svg
