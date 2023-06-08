import express from "express";

import slackController from "../controllers/slackController.js";
import chatGPTController from "../controllers/chatGPTController.js";

const router = express.Router();

router.get('/ping', (req, res) => {
  return res.status(200).json("Ready");
})

router.post(
  "/slack",
  slackController.urlVerification,
  slackController.filterBotMessages,
  chatGPTController.generateResponse,
  (req, res) => {
    return res.status(200).json("OK");
  }
);

router.post("/website", chatGPTController.generateResponse, (req, res) => {
  res.status(200).json(res.locals.payload);
});

export default router;
