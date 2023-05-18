import fetch from "node-fetch";
import * as dotenv from 'dotenv';
dotenv.config();
import express from "express";

const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

const apiRouter = require('./routes/api');

app.use('/api', apiRouter)

app.use('/', apiRouter)

app.use((req, res) => res.sendStatus(404));

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign(defaultErr, err);
  console.log(errorObj.log);

  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;