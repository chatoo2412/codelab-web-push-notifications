import { ls, CONSTANTS } from '../common/index.js'

const elTextToSend = document.querySelector('#push-data')
const elSendBtn = document.querySelector('#send-push-btn')

const sendPush = async () => {
  const subscription = ls.get(CONSTANTS.SUBSCRIPTION)
  const data = elTextToSend.value
  const applicationKeys = ls.get(CONSTANTS.KEYS)

  const response = await fetch('/api/send-push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subscription,
      data,
      applicationKeys,
    }),
  })

  if (response.status !== 200) {
    const responseText = await response.text()

    throw new Error(responseText)
  }

  return response
}

const initialiseUI = () => {
  elSendBtn.addEventListener('click', async () => {
    try {
      await sendPush()
    } catch (error) {
      console.error(error)
      window.alert(error.message)
    }
  })
}

window.addEventListener('load', () => {
  initialiseUI()
})
