import fetch from "node-fetch";
import * as dotenv from 'dotenv';
dotenv.config();

const slackController = {};

slackController.logMessage = (req, res, next) => {
    return next();
}

slackController.filterBotMessages = (req, res, next) => {
    if (!req.body.event.client_msg_id || req.body.event.bot_id) {
        return res.status(200).json(req.body.challenge);
    }
    else if (req.body.event.client_msg_id && req.body.event.bot_id === undefined) {
        return next();
    }
    else {
        return next({
            log: "error in slackController.filterBotMessages",
            message: { err: 'There was an error with your post request' },
        });
    }
};

slackController.postMessage = (req, res, next) => {
    if (!res.locals.response) return next();

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
    .then(data => {
        return next();
    })
    .catch((error) => {
        console.log('ERROR IN POSTMESSAGE:', error);
    })
}

export default slackController;