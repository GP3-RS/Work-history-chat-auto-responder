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
    console.log('is bot? ', req.body.authorizations[0].is_bot);
    return next();
}

slackController.filterBotMessages = (req, res, next) => {
    console.log(req.body);
    console.log(req.body.authorizations[0].is_bot)
    if (req.body.authorizations[0].is_bot || req.body?.message?.bot_id || req.body?.message?.bot_profile) return next({
        log: "error in slackController.filterBotMessages",
        message: { err: 'There was an error with your post request' },
    });
    return next();
}

slackController.postMessage = (req, res, next) => {

    console.log('slack token', process.env.SLACK_BOT_TOKEN)
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
        console.log(process.env.SLACK_BOT_TOKEN)
        console.log(res.body);
        if (!res.ok) {
        throw new Error(`Server error ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        console.log(data);
        return next()
    })
    .catch((error) => {
        console.log(error);
    })
}

export default slackController;