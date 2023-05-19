import * as dotenv from 'dotenv';
import fs from "fs";
import path from 'path';
dotenv.config();

import { Configuration, OpenAIApi } from "openai";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const resume = fs.readFileSync(path.resolve(__dirname + '../../../resume'), { encoding: 'utf8', flag: 'r' })

// console.log(resume);

const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_TOKEN,
  }));

const chatGPTController = {};

const messages = [
    {"role": "system", "content": process.env.PROMPT},
    {"role": "user", "content": "I'm going to give you Gahl's resume. I want you to answer questions in the first person as if you are him. Try to keep your responses under 100 words maximum. Here it is: " + resume},
    {"role": "user", "content": "Tell me about your experience working with Node"},
    {"role": "assistant", "content": "Sure. Well, first off I made this ChatGPT resume auto-responder with Node and Express. I love working with Node because it's non-blocking and event-driven, so I can answer questions like this while I'm asleep."},
]

const primedResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0,
    max_tokens: 300,
    })

    console.log(primedResponse.data.choices[0].message.content);

// chatGPTController.prime = async (req, res, next) => {
//     const primedResponse = await openai.create({
//         model: "gpt-3.5-turbo",
//         prompt: process.env.PROMPT + "Limit your responses to a maximum of 2000 characters" + "Gahl's Resume is:" + resume + "My most recent place of employment is Codesmith",
//         temperature: 0,
//         max_tokens: 300,
//         });
// }

chatGPTController.generateResponse = async (req, res, next) => {
    if (!req.body.event.text) return next();
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {"role": "system", "content": process.env.PROMPT},
            {"role": "user", "content": "here is Gahl's resume, answer questions as if you are him, using his resume" + resume},
            {"role": "user", "content": req.body.event.text}
        ],
        temperature: 0,
        max_tokens: 300,
      });

    const text = response.data.choices[0].message.content.trim().replace(/(\r\n|\n|\r)/gm, "");

    res.locals.response = text;
    return next();
}

export default chatGPTController;