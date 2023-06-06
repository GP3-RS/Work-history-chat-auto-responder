import * as dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import path from "path";
import fetch from "node-fetch";

import { Configuration, OpenAIApi } from "openai";
import { fileURLToPath } from "url";

import cache from "./cache.js";

//Import our series of messages to help train chatGPT before each response so that it answers correctly
import { messages } from "../messages.js";
console.log("messages import: ", messages ? "PASS" : "FAIL");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Import resume file for ChatGPT to know my work history
const resume = fs.readFileSync(path.resolve(__dirname + "../../../resume"), {
  encoding: "utf8",
  flag: "r",
});
console.log("resume import: ", resume ? "PASS" : "FAIL");

//Initialize and configure OpenAI API
const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_TOKEN,
  })
);
console.log("openai configuration: ", openai ? "PASS" : "FAIL");
import { responseData, resLocals } from "../types.js";

const responseHelper = {

generateAndPost: (data: resLocals): Promise<void> => {
  console.log("hitting responseHelper.generateAndPost");

  return new Promise((resolve, reject): void => {
    (async (): Promise<void> => {
      try {
        let responseMessage: string
        let responseObj: responseData | null | undefined
        let cacheResults: string | null | undefined;

        try {
          if (process.env.CACHE === 'Redis') cacheResults = await cache.get(data.question);
          else if (process.env.CACHE === 'DynamoDB') cacheResults = (await cache.get(data.question)).props?.value;
        } catch (err) {
          console.log("Error with cache.get(data.question): ", err);
          reject(err);
        }

        if (!cacheResults) {
          console.log(process.env.CACHE + " cache miss");

          try {
            responseObj = await openai.createChatCompletion({
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
              top_p: 0.5,
            });
          } catch (err) {
              console.log("Error with openai.createChatCompletion: ", err);
              reject(err);
              return;
          }

          if (!responseObj) {
            console.log("No response from openai.generate response invocation");
            reject(new Error("no response"));
            return;
          } else if (responseObj?.data?.error) {
            console.log(
              "ERROR with generating a response: ",
              responseObj.data.error
            );
            reject(new Error(responseObj.data.error));
            return;
          } else {
            responseMessage = responseObj.data.choices[0].message.content
              .trim()
              .replace(/(\r\n|\n|\r)/gm, "");

            try {
              await cache.set(
                data.question,
                process.env.CACHE === "Redis"
                  ? responseMessage
                  : { value: responseMessage }
              );
            } catch (err) {
              console.log("Error with cache.set method: ", err);
              reject(err);
              return;
            }
          }
        } else {
          responseMessage =
            "Someone has asked this question before (i.e. it's a cache hit). The previously generated response was: \n" +
            cacheResults;

          console.log(process.env.CACHE + " cache hit");
        }

        if (data.platform === "slack") {
          responseHelper.postToSlack(responseMessage);
        } else if (data.platform === "website") {
          responseHelper.postToWebsite(responseMessage);
        }

        resolve(); // Resolve the Promise when the operation is complete
      } catch (err) {
        reject(err); // Reject the Promise if there's an error
        return;
      }
    })().catch((e) => console.log("Caught error in promise: " + e));
  });
},

  postToSlack: (text: string): void => {
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
        if (!resp?.ok) {
          console.log("Response not OK: ", resp);
          throw new Error("Response not OK: " + resp.status);
        }
      })
      .catch((error) => {
        console.log("ERROR IN POSTMESSAGE:", error);
      });

    return;
  },

  postToWebsite: (text: string): void => {
    return
  }
}

export default responseHelper;