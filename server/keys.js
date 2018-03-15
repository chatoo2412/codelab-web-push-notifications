import { generateNewKeys, ls, CONSTANTS } from '../common/index.js'

const elPublicElement = document.querySelector('#public-key')
const elPrivateElement = document.querySelector('#private-key')
const elRefreshBtn = document.querySelector('#refresh-keys-btn')

const updateUI = () => {
  const keys = ls.get(CONSTANTS.KEYS) || { public: null, private: null }

  elPublicElement.textContent = JSON.stringify(keys.public)
  elPrivateElement.textContent = JSON.stringify(keys.private)
}

const refreshKeys = async () => {
  const keys = await generateNewKeys()

  ls.set(CONSTANTS.KEYS, keys)
}

const initialiseUI = () => {
  elRefreshBtn.addEventListener('click', async () => {
    await refreshKeys()

    updateUI()
  })

  updateUI()
}

window.addEventListener('load', () => {
  initialiseUI()
})
