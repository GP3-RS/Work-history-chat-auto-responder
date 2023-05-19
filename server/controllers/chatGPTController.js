import * as dotenv from 'dotenv';
dotenv.config();

import { Configuration, OpenAIApi } from "openai";

const resume = `
Gahl Peled Resume 
Skills: 
    TypeScript, JavaScript, React, Redux, Node.js, Express, SQL, PostgreSQL, MongoDB, Redis, HTML5, Sass/SCSS, CSS, testing (Jest, Puppeteer, React Testing Library, Cypress), Webpack, Electron, Material-UI, Tailwind, Kubernetes, Docker, AWS, OAuth 2.0, WebSockets, WebRTC, RESTful API, GraphQL, Travis CI, Git/GitHub, Object-Oriented Programming. 
Work Experience: 
    Company: Codesmith 
        Title: Software Engineer 
        Dates of Employment: January 2023 - May 2023
        Reason for Leaving: Contract-based role. Contract ended.
        Developed features and components with React/Redux, including an RSVP management feature to view and cancel
        users workshop RSVPs, resulting in an immediate increase in workshop attendance and a decrease in no-shows
        Designed an approach to integration tests for write features by creating functions to mock various app states and http
        requests within Jest, increasing test coverage by about 20% and serving as a template for future write-based tests
        Improved the reliability, data validation, and error handling of the authorization API by replacing query utils with
        models in PostgreSQL queries, resulting in reduced vulnerability to SQL injection attacks
        Used Cypress for end-to end tests to ensure compatibility, improve code quality, increase scalability, and make it
        easier to onboard newer developers who can start contributing without merging breaking changes
        Mentored junior engineers through code reviews, pair programming, and knowledge transfers, working on algorithmic
        best practices for the given technical requirements and optimal time/space complexity
        Led Scrum meetings to help reprioritize targets and facilitate launch for open source tooling
    Company: Chronos (Open Source Product)
        Title: Software Engineer
        Dates of Employment: October 2022 - January 2023
        Utilized Kubernetes DNS to query Prometheus monitoring server, gathering data on K8s clusters and exporting data
        to user-specified SQL or NoSQL database, enabling engineers to make data-driven decisions about their microservices
        Scaled app by adding a tab to the React/Redux frontend, allowing users to select which metrics they would like to
        record to their database, resulting in significantly reduced database bloat for users from interval-based database writes
        Migrated to TypeScript for its strict, automated type-checking for faster debugging, enhancing future development by
        making code more predictable, and because our product prioritized scalability over development speed
        Audited all dependencies and removed or updated node modules to eliminate vulnerabilities and technical debt,
        resulting in a lighter app with 50% faster compilation and more responsive hot module replacement
        Rebuilt Chronos’s front-end data-visualization app to enable compatibility with ARM-64 Apple “M” architecture
        Chronos is an open source product developed under tech accelerator OS Labs
    Company: CliniConnects
        Title: Operations and Product Manager
        Worked with lead engineer and CTO to ideate, test, and deploy new features for enterprise-grade, HIPAA-compliant
        remote workforce management application that was built with Angular and deployed on Microsoft Azure
        Led scrum meetings with the engineering team to guide the development of clinician credentialing and staff
        auto-assignment features that enabled higher compliance rates and faster scheduling, reducing wait times for patients
INTERESTS:
    Motorcycles, Scuba diving, Rock climbing, escape rooms, travel, dancing (bachata, salsa), formula one
`

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
        prompt: process.env.PROMPT + "Gahl's Resume is:" + resume + "here's the question:" + req.body.event.text,
        temperature: 1,
        max_tokens: 1000,
      });

    console.log('RESPONSE FROM CHATGPT IS', response.data.choices[0].text.trim())

    res.locals.response = response.data.choices[0].text.trim();
    next();
}

export default chatGPTController;