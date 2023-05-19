import * as dotenv from 'dotenv';
dotenv.config();

import { Configuration, OpenAIApi } from "openai";

const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_TOKEN,
  }));

const chatGPTController = {};

// const messages = [
//     {"role": "system", "content": process.env.PROMPT},
//     {"role": "user", "content": "I'm going to give you Gahl's resume. I want you to answer questions in the first person as if you are him. Try to keep your responses under 100 words maximum. Here it is: " + process.env.RESUME},
//     {"role": "user", "content": "Tell me about your experience working with Node"},
//     {"role": "assistant", "content": "Sure. Well, first off I made this ChatGPT resume auto-responder with Node and Express. I love working with Node because it's non-blocking and event-driven, so I can answer questions like this while I'm asleep."},
//     {"role": "user", "content": req.body.event.text}
// ]

chatGPTController.generateResponse = async (req, res, next) => {

    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: process.env.PROMPT + "Gahl's Resume is:" + process.env.RESUME + "here's the question:" + req.body.event.text,
        temperature: 1,
        max_tokens: 1000,
      });

    console.log('RESPONSE FROM CHATGPT IS', response.data.choices[0].text.trim())

    res.locals.response = response.data.choices[0].text.trim();
    next();
}

export default chatGPTController;