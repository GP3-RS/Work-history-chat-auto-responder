import express from "express";

import slackController from "../controllers/slackController.js";
import chatGPTController from "../controllers/chatGPTController.js";
import websiteController from "../controllers/websiteController.js";

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

router.post("/website", websiteController.validateQuestion, chatGPTController.generateResponse, (req, res) => {
  res.status(200).json(res.locals.payload);
});

export default router;
