import {
  base64UrlToUint8Array,
  uint8ArrayToBase64Url,
  cryptoKeyToUrlBase64,

  ls,

  CONSTANTS,
} from '../common/index.js';

function generateNewKeys() {
  return window.crypto.subtle.generateKey({name: 'ECDH', namedCurve: 'P-256'},
    true, ['deriveBits'])
  .then((keys) => {
    return cryptoKeyToUrlBase64(keys.publicKey, keys.privateKey);
  });
}

function displayKeys(keys) {
  const publicElement = document.querySelector('.js-public-key');
  const privateElement = document.querySelector('.js-private-key');
  const refreshBtn = document.querySelector('.js-refresh-keys');

  publicElement.textContent = keys.public;
  privateElement.textContent = keys.private;

  refreshBtn.disabled = false;
}

function updateKeys() {
  let storedKeys = ls.get(CONSTANTS.KEY_PAIR);
  let promiseChain = Promise.resolve(storedKeys);
  if (!storedKeys) {
    promiseChain = generateNewKeys()
    .then((newKeys) => {
      ls.set(CONSTANTS.KEY_PAIR, newKeys);

      return newKeys;
    });
  }

  return promiseChain.then((keys) => {
    displayKeys(keys);
  });
}

function initialiseKeys() {
  const refreshBtn = document.querySelector('.js-refresh-keys');
  refreshBtn.addEventListener('click', function() {
    refreshBtn.disabled = true;

    ls.remove(CONSTANTS.KEY_PAIR);

    updateKeys();
  });

  updateKeys();
}

window.addEventListener('load', () => {
  initialiseKeys();
});
