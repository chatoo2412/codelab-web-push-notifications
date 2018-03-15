const base64UrlToUint8Array = (base64UrlData) => {
  const padding = '='.repeat((4 - base64UrlData.length % 4) % 4);
  const base64 = (base64UrlData + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const buffer = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    buffer[i] = rawData.charCodeAt(i);
  }
  return buffer;
}

const uint8ArrayToBase64Url = (uint8Array, start, end) => {
  start = start || 0;
  end = end || uint8Array.byteLength;

  const base64 = window.btoa(
    String.fromCharCode.apply(null, uint8Array.subarray(start, end)));
  return base64
    .replace(/\=/g, '') // eslint-disable-line no-useless-escape
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

const cryptoKeyToUrlBase64 = (publicKey, privateKey) => {
  const promises = [];
  promises.push(
    window.crypto.subtle.exportKey('jwk', publicKey)
    .then((jwk) => {
      const x = base64UrlToUint8Array(jwk.x);
      const y = base64UrlToUint8Array(jwk.y);

      const publicKey = new Uint8Array(65);
      publicKey.set([0x04], 0);
      publicKey.set(x, 1);
      publicKey.set(y, 33);

      return publicKey;
    })
  );

  promises.push(
    window.crypto.subtle
      .exportKey('jwk', privateKey)
    .then((jwk) => {
      return base64UrlToUint8Array(jwk.d);
    })
  );

  return Promise.all(promises)
  .then((exportedKeys) => {
    return {
      public: uint8ArrayToBase64Url(exportedKeys[0]),
      private: uint8ArrayToBase64Url(exportedKeys[1]),
    };
  });
}

const urlB64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const ls = {
  set: (key, value) => window.localStorage.setItem(key, JSON.stringify(value)),
  get: (key) => JSON.parse(window.localStorage.getItem(key)),
  remove: (key) => window.localStorage.removeItem(key),
}

const CONSTANTS = {
  KEY_PAIR: 'keys',
  SUBSCRIPTION: 'subscription',
}

export {
  base64UrlToUint8Array,
  uint8ArrayToBase64Url,
  cryptoKeyToUrlBase64,
  urlB64ToUint8Array,

  ls,

  CONSTANTS,
}
