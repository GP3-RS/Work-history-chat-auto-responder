import fetch from "node-fetch";
import * as dotenv from 'dotenv';
dotenv.config();

const slackController = {};

let payload = {
    channel: process.env.CHANNEL_NAME,
    text: 'hello world!'
  }

slackController.testServer = (req, res, next) => {
    console.log('SERVER IS LIVE AND RESPONDING TO REQUESTS')
    return next();
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