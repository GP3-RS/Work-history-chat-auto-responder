import express from 'express';

import slackController from '../controllers/slackController.js';
import chatGPTController from '../controllers/chatGPTController.js';

const router = express.Router();

router.post('/slack', slackController.urlVerification, slackController.filterBotMessages, chatGPTController.generateResponse, slackController.postMessage, (req, res) => {
  return res.status(200).json(req.body.challenge);
});

router.post('/website', chatGPTController.generateResponse, (req, res) => {
  res.status(200).json(res.locals.payload);
})

export default router;