import { urlB64ToUint8Array, ls, CONSTANTS } from '../common/index.js'

const elServerPublicKey = document.querySelector('#server-public-key')
const elPushButton = document.querySelector('#push-btn')
const elSubscription = document.querySelector('#subscription')

let serverPublicKey
let subscription
let swRegistration

const getServerPublicKey = () => {
  // TODO: Request to application server
  const keys = ls.get(CONSTANTS.KEYS)

  if (!keys) {
    elPushButton.disabled = true

    return 'Please visit `/server` page and create a key pair.'
  }

  return keys.public
}

const updateSubscriptionOnServer = () => {
  // TODO: Send subscription to application server
  ls.set(CONSTANTS.SUBSCRIPTION, subscription)
}

const updateUI = () => {
  elSubscription.textContent = JSON.stringify(subscription)

  if (Notification.permission === 'denied') {
    elPushButton.textContent = 'Push Messaging Blocked. Please enable again.'
    elPushButton.disabled = true

    return
  }

  elPushButton.textContent = subscription ? 'Disable Push Messaging' : 'Enable Push Messaging'
}

const subscribe = async () => {
  subscription = await swRegistration.pushManager.subscribe({
    userVisibleOnly: true, // https://developers.google.com/web/fundamentals/push-notifications/subscribing-a-user#uservisibleonly_options
    applicationServerKey: urlB64ToUint8Array(getServerPublicKey()),
  })

  await updateSubscriptionOnServer()

  console.log('User is subscribed.')
}

const unsubscribe = async () => {
  await subscription.unsubscribe()

  subscription = null

  await updateSubscriptionOnServer()

  console.log('User is unsubscribed.')
}

const initializeUI = async () => {
  elPushButton.addEventListener('click', async () => {
    if (subscription) {
      await unsubscribe()
    } else {
      await subscribe()
    }

    updateUI()
  })

  // Set the initial values
  ;[serverPublicKey, subscription] = await Promise.all([
    getServerPublicKey(),
    swRegistration.pushManager.getSubscription(), // returns subscription or null
  ])

  elServerPublicKey.textContent = JSON.stringify(serverPublicKey)
  elSubscription.textContent = JSON.stringify(subscription)

  console.log(subscription ? 'User is subscribed.' : 'User is not subscribed.')

  updateUI()
}

const init = async () => {
  if (!('serviceWorker' in navigator && 'PushManager' in window)) {
    console.warn('Push messaging is not supported.')

    elPushButton.textContent = 'Push Not Supported'

    return
  }

  swRegistration = await navigator.serviceWorker.register('sw.js')

  console.log('Service Worker is registered', swRegistration)

  initializeUI()
}

window.addEventListener('load', () => {
  init()
})
