import express from 'express';

import slackController from '../controllers/slackController.js';
import chatGPTController from '../controllers/chatGPTController.js';

const router = express.Router();

router.get('/', slackController.testServer, (req,res) => {
  return res.status(200).json("OK")
})

router.post('/', slackController.filterBotMessages, chatGPTController.generateResponse, slackController.postMessage, (req, res) => {
  return res.status(200).json(req.body.challenge);
});

export default router;