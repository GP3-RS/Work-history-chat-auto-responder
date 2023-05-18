import express from 'express';

import slackController from '../controllers/slackController.js';

const router = express.Router();

router.get('/', slackController.testServer, (req,res) => {
  return res.status(200).json("OK");
})

router.post('/', slackController.readMessage, (req, res) => {
  return res.status(200).json(req.body.challenge);
});

export default router;