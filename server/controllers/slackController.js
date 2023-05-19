import fetch from "node-fetch";
import * as dotenv from 'dotenv';
dotenv.config();

const slackController = {};

let payload = {
    channel: process.env.CHANNEL_NAME,
    text: 'new generic message'
  }

slackController.testServer = (req, res, next) => {
    console.log('SERVER IS LIVE AND RESPONDING TO REQUESTS')
    return next();
}

slackController.logMessage = (req, res, next) => {
    return next();
}

slackController.filterBotMessages = (req, res, next) => {
    // if (req.body?.authorizations[0]?.is_bot === false && !req.body.bot_profile) return next();
    console.log(req.body);
    return next({
        log: "error in slackController.filterBotMessages",
        message: { err: 'There was an error with your post request' },
    });
}

slackController.postMessage = (req, res, next) => {
  fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": payload.length,
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
    .then(data => {
        return next();
    })
    .catch((error) => {
        console.log('ERROR IN POSTMESSAGE:', error);
    })
}

export default slackController;