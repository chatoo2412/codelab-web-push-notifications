const bodyParser = require('body-parser')
const express = require('express')
const webPush = require('web-push')

const router = express.Router()

router.use(bodyParser.json())

router.post('/send-push', async (req, res) => {
  const { applicationKeys, subscription, data } = req.body

  const options = {
    vapidDetails: {
      subject: 'mailto:chatoo2412@gmail.com',
      publicKey: applicationKeys.public,
      privateKey: applicationKeys.private,
    },
    TTL: 60 * 60, // 1 hour in seconds.
  }

  try {
    const result = await webPush.sendNotification(subscription, data, options)

    res.status(200).send(result)
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).send(error.body)
    } else {
      res.status(400).send(error.message)
    }
  }
})

module.exports = router
