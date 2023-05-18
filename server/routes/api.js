const express = require('express');

const slackController = require('../controllers/slackController');

const router = express.Router();

// ADD STARTER DATA REQUEST ROUTE HANDLER HERE
router.post('/', slackController.postMessage, (req, res) => {
  return res.status(200).json('OK');
});

module.exports = router;