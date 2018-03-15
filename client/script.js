import { urlB64ToUint8Array, ls, CONSTANTS } from '../common/index.js'

const getApplicationServerPublicKey = () => ls.get(CONSTANTS.KEY_PAIR).public

const getKeyButton = document.querySelector('#get-key-btn')
const keyJson = document.querySelector('#application-server-public-key')
const pushButton = document.querySelector('#push-btn')
const subscriptionJson = document.querySelector('#subscription-json')

let isSubscribed = false
let swRegistration = null

function updateBtn() {
  if (Notification.permission === 'denied') {
    pushButton.textContent = 'Push Messaging Blocked.'
    pushButton.disabled = true
    updateSubscriptionOnServer(null)
    return
  }

  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging'
  } else {
    pushButton.textContent = 'Enable Push Messaging'
  }

  pushButton.disabled = false
}

function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server
  ls.set(CONSTANTS.SUBSCRIPTION, subscription)

  subscriptionJson.textContent = JSON.stringify(subscription)
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(getApplicationServerPublicKey())
  swRegistration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    })
    .then(function(subscription) {
      console.log('User is subscribed.')

      updateSubscriptionOnServer(subscription)

      isSubscribed = true

      updateBtn()
    })
    .catch(function(err) {
      console.log('Failed to subscribe the user: ', err)
      updateBtn()
    })
}

function unsubscribeUser() {
  swRegistration.pushManager
    .getSubscription()
    .then(function(subscription) {
      if (subscription) {
        return subscription.unsubscribe()
      }
    })
    .catch(function(error) {
      console.log('Error unsubscribing', error)
    })
    .then(function() {
      updateSubscriptionOnServer(null)

      console.log('User is unsubscribed.')
      isSubscribed = false

      updateBtn()
    })
}

function initializeUI() {
  getKeyButton.addEventListener('click', () => {
    keyJson.textContent = getApplicationServerPublicKey()
  })

  pushButton.addEventListener('click', () => {
    pushButton.disabled = true
    if (isSubscribed) {
      unsubscribeUser()
    } else {
      subscribeUser()
    }
  })

  // Set the initial application sever public key value
  keyJson.textContent = getApplicationServerPublicKey()

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription().then(function(subscription) {
    isSubscribed = !(subscription === null)

    updateSubscriptionOnServer(subscription)

    if (isSubscribed) {
      console.log('User IS subscribed.')
    } else {
      console.log('User is NOT subscribed.')
    }

    updateBtn()
  })
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported')

  navigator.serviceWorker
    .register('sw.js')
    .then(function(swReg) {
      console.log('Service Worker is registered', swReg)

      swRegistration = swReg
      initializeUI()
    })
    .catch(function(error) {
      console.error('Service Worker Error', error)
    })
} else {
  console.warn('Push messaging is not supported')
  pushButton.textContent = 'Push Not Supported'
}
