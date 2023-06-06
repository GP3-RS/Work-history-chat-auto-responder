import express from "express";
import slackController from "../controllers/slackController.js";
import chatGPTController from "../controllers/chatGPTController.js";
var router = express.Router();
router.post("/slack", slackController.urlVerification, slackController.filterBotMessages, chatGPTController.generateResponse, function (req, res) {
    return res.status(200).json("OK");
});
router.post("/website", chatGPTController.generateResponse, function (req, res) {
    res.status(200).json(res.locals.payload);
});
export default router;
