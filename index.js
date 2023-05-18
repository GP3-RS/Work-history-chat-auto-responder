import fetch from "node-fetch";
import * as dotenv from 'dotenv';
dotenv.config();

console.log(process.env.CHANNEL_NAME);

let payload = {
  channel: process.env.CHANNEL_NAME,
  text: 'hello world!'
}

const f = () => fetch("https://slack.com/api/chat.postMessage", {
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
  .then(data => console.log(data))
  .catch((error) => {
    console.log(error);
  });

f();