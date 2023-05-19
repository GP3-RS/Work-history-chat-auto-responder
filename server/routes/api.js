import express from 'express';

import slackController from '../controllers/slackController.js';
import chatGPTController from '../controllers/chatGPTController.js';

const router = express.Router();

router.post('/', (req, res) => {
  if (req.body.challenge && req.body.type === "url_verification") return res.status(200).json(req.body.challenge);
})

router.get('/', slackController.testServer, (req,res) => {
  return res.status(200).json("OK")
})

router.post('/', slackController.filterBotMessages, chatGPTController.generateResponse, slackController.postMessage, (req, res) => {
  return res.status(200).json(req.body.challenge);
});

export default router;