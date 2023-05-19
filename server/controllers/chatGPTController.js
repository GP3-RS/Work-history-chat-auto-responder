import * as dotenv from 'dotenv';
import fs from "fs";
import path from 'path';
dotenv.config();

import { Configuration, OpenAIApi } from "openai";

import { fileURLToPath } from 'url';

import messages from '../../messages';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const resume = fs.readFileSync(path.resolve(__dirname + '../../../resume'), { encoding: 'utf8', flag: 'r' })

// console.log(resume);

const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_TOKEN,
  }));

const chatGPTController = {};

chatGPTController.generateResponse = async (req, res, next) => {
    if (!req.body.event.text) return next();
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {"role": "system", "content": process.env.PROMPT},
            {"role": "user", "content": "here is Gahl's resume, answer questions as if you are him, using his resume" + resume},
            {"role": "user", "content": req.body.event.text}
        ],
        temperature: 0.1,
        max_tokens: 300,
      });

    const text = response.data.choices[0].message.content.trim().replace(/(\r\n|\n|\r)/gm, "");

    res.locals.response = text;
    return next();
}

export default chatGPTController;