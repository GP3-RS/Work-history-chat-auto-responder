const express = require('express');

const slackController = require('../controllers/slackController');

const router = express.Router();

router.get('/', slackController.testServer, (req,res) => {
  return res.status(200).json("OK");
})

router.post('/', slackController.postMessage, (req, res) => {
  return res.status(200).json('OK');
});

module.exports = router;