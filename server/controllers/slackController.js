import fetch from "node-fetch";
import * as dotenv from 'dotenv';
dotenv.config();

const slackController = {};

slackController.logMessage = (req, res, next) => {
    return next();
}

slackController.urlVerification = (req, res, next) => {
    if (req.body.challenge && req.body.type === "url_verification") return res.status(200).json(req.body.challenge);
    else return next();
}

slackController.filterBotMessages = (req, res, next) => {
    res.status(200).json('OK');
    if (req.body.event.client_msg_id && req.body.event.bot_id === undefined) {
        res.locals.question = req.body.event.text;
        return next();
    }
};

slackController.postMessage = (req, res) => {
    if (!res.locals.response) return;

    let payload = {
        channel: process.env.CHANNEL_NAME,
        text: res.locals.response
      }

  fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
        Accept: "application/json",
    },
    })
    .then((res) => {
        if (!res.ok) {
        throw new Error(`Server error ${res.status}`);
        }
        return res.json();
    })
    .catch((error) => {
        console.log('ERROR IN POSTMESSAGE:', error);
    })
}

export default slackController;