import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();

import fetch from "node-fetch";

import EventEmitter from "events";

const eventEmitter = new EventEmitter();

import { Configuration, OpenAIApi } from "openai";

import { fileURLToPath } from "url";

import messages from "../../messages.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const resume = fs.readFileSync(path.resolve(__dirname + "../../../resume"), {
  encoding: "utf8",
  flag: "r",
});

// console.log(resume);

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_TOKEN,
  })
);

const chatGPTController = {};

chatGPTController.generateResponse = (req, res, next) => {
  console.log("hitting chatGPTController.generateResponse");
  console.log("res.locals is", res.locals);

  if (res.locals.question.length === 0) return next();

  eventEmitter.emit("generateAndPost", res.locals);
  return next();
};

eventEmitter.on("generateAndPost", async (data) => {
  console.log("data is", data);

  const response = await openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: process.env.PROMPT },
        {
          role: "user",
          content:
            "here is Gahl's resume, answer questions as if you are him, using his resume" +
            resume,
        },
        ...messages,
        { role: "user", content: data.question },
      ],
      temperature: 0.1,
      max_tokens: 1000,
    })
    .catch((err) =>
      console.log("error with openai.createchatcompleteion ", err)
    );

  if (!response.ok) console.log("ERROR, Response NOT OK ", response);
  console.log("response is", response);

  if (!response) throw new Error("no response");
  else if (response?.data?.error) throw new Error(response.data.error);

  const text = response.data.choices[0].message.content
    .trim()
    .replace(/(\r\n|\n|\r)/gm, "");

  console.log("text is", text);
  console.log(data);
  console.log(data.platform === "slack");

  if (data.platform === "slack") {
    console.log("GENERATING RESPONSE");

    let payload = {
      channel: process.env.CHANNEL_NAME,
      text,
    };

    fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
        Accept: "application/json",
      },
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(`Server error ${res.status}`);
        }
        return resp.json();
      })
      .catch((error) => {
        console.log("ERROR IN POSTMESSAGE:", error);
      });
  }

  return;
});

export default chatGPTController;
