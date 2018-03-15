const bodyParser = require('body-parser')
const express = require('express')
const webPush = require('web-push')

const router = express.Router()

router.use(bodyParser.json())

router.post('/send-push-msg', (req, res) => {
  const options = {
    vapidDetails: {
      subject: 'mailto:chatoo2412@gmail.com',
      publicKey: req.body.applicationKeys.public,
      privateKey: req.body.applicationKeys.private,
    },
    TTL: 60 * 60, // 1 hour in seconds.
  }

  webPush
    .sendNotification(req.body.subscription, req.body.data, options)
    .then(() => {
      res.status(200).send({ success: true })
    })
    .catch((err) => {
      if (err.statusCode) {
        res.status(err.statusCode).send(err.body)
      } else {
        res.status(400).send(err.message)
      }
    })
})

module.exports = router
