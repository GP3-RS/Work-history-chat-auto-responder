import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();
import fetch from "node-fetch";

import { Configuration, OpenAIApi } from "openai";
import { fileURLToPath } from "url";

import cache from "./cache.js";

//Import our series of messages to help train chatGPT before each response so that it answers correctly
import messages from "../messages.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Import resume file for ChatGPT to know my work history
const resume = fs.readFileSync(path.resolve(__dirname + "../../resume"), {
  encoding: "utf8",
  flag: "r",
});

//Initialize and configure OpenAI API
const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_TOKEN,
  })
);

import EventEmitter from "events";
const eventEmitter = new EventEmitter();

const responseHelper = {};

responseHelper.generateAndPost = (data) => {
  console.log("hitting responseHelper.generateAndPost");

  eventEmitter.emit("generateAndPost", data);
};

eventEmitter.on("generateAndPost", async (data) => {
  console.log("hitting eventEmitter");
  let responseMessage;

  let cacheResults = await cache.get(data.question);

  cacheResults =
    process.env.CACHE === "Redis" ? cacheResults : cacheResults?.props?.value;

  if (!cacheResults) {
    console.log(process.env.CACHE + " cache miss");

    const responseObj = await openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: process.env.PROMPT },
          {
            role: "user",
            content:
              "Do not lie and make things up. If you don't have 100% confidence in the truthfulness of your response, ask the user to email Gahl.",
          },
          {
            role: "user",
            content:
              "here is Gahl's resume, answer questions as if you are him, using his resume: " +
              resume,
          },
          ...messages,
          { role: "user", content: data.question },
        ],
        temperature: 0.1,
        max_tokens: 400,
      })
      .catch((err) =>
        console.log("error with openai.createchatcompleteion ", err)
      );

    if (!responseObj) throw new Error("no response");
    else if (responseObj?.data?.error) throw new Error(response.data.error);

    responseMessage = responseObj.data.choices[0].message.content
      .trim()
      .replace(/(\r\n|\n|\r)/gm, "");

    process.env.CACHE === "Redis"
      ? cache.set(data.question, responseMessage)
      : cache.set(data.question, { value: responseMessage });
  } else {
    responseMessage =
      "Cache hit! Someone has asked this question before. Response: " +
      cacheResults;

    console.log(process.env.CACHE + " cache hit");
  }

  if (data.platform === "slack") {
    responseHelper.postToSlack(responseMessage);
  } else if (data.platform === "website") {
    responseHelper.postToWebsite(responseMessage);
  }

  return;
});

responseHelper.postToSlack = (text) => {
  console.log("SENDING RESPONSE TO SLACK");

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
        throw new Error(`Server error: 500`);
      }
      return resp.json();
    })
    .catch((error) => {
      console.log("ERROR IN POSTMESSAGE:", error);
    });
};

export default responseHelper;
