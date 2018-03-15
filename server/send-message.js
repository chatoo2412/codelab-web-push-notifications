import { ls, CONSTANTS } from '../common/index.js';

const privateElement = document.querySelector('.js-private-key');
const publicElement = document.querySelector('.js-public-key');

const subscriptionTextArea = document.querySelector('#push-subscription');
const textToSendTextArea = document.querySelector('#push-data');
const getSubscriptionBtn = document.querySelector('#get-subscription-btn');
const sendBtn = document.querySelector('.js-send-push');

function sendPushMessage() {
  const subscriptionString = subscriptionTextArea.value.trim();
  const dataString = textToSendTextArea.value;

  if (subscriptionString.length === 0 ) {
    return Promise.reject(new Error('Please provide a push subscription.'));
  }

  let subscriptionObject = null;
  try {
    subscriptionObject = JSON.parse(subscriptionString);
  } catch (err) {
    return Promise.reject(new Error('Unable to parse subscription as JSON'));
  }

  if (!subscriptionObject.endpoint) {
    return Promise.reject(new Error('The subscription MUST have an endpoint'));
  }

  if (subscriptionObject.endpoint.indexOf('…') !== -1) {
    return Promise.reject(new Error('The subscription endpoint appears to be ' +
      'truncated (It has \'...\' in it).\n\nDid you copy it from the console ' +
      'in Chrome?')
    );
  }


  return fetch('/api/send-push-msg', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      subscription: subscriptionObject,
      data: dataString,
      applicationKeys: {
        public: publicElement.textContent,
        private: privateElement.textContent,
      }
    })
  })
  .then((response) => {
    if (response.status !== 200) {
      return response.text()
      .then((responseText) => {
        throw new Error(responseText);
      });
    }
  });
}

function initialiseUI() {
  getSubscriptionBtn.addEventListener('click', () => {
    subscriptionTextArea.value = JSON.stringify(ls.get(CONSTANTS.SUBSCRIPTION));
  });

  sendBtn.addEventListener('click', () => {
    sendBtn.disabled = true;

    sendPushMessage()
    .catch((err) => {
      console.error(err);
      window.alert(err.message);
    })
    .then(() => {
      sendBtn.disabled = false;
    });
  });

  subscriptionTextArea.value = JSON.stringify(ls.get(CONSTANTS.SUBSCRIPTION));

  sendBtn.disabled = false;
}

window.addEventListener('load', () => {
  initialiseUI();
});
