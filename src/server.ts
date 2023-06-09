import express from "express";
import apiRouter from "./server/routes/api.js";
import { ErrObj } from "./types.js";
import cors from "cors";

const app = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(cors({ 
  origin: [
    'http://localhost:5173', 
    'http://api.slack.com',
    'https://api.slack.com',
    'http://slack.com',
    'https://slack.com',
  ], 
  credentials: true }))

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//All requests sent to api router
app.use("/api", apiRouter);

//404 catch-all route handler
app.use((req, res) => res.sendStatus(404));

//Global error handler
app.use((err: ErrObj, req, res, next) => {
  const defaultErr: ErrObj = {
    log: "Express error handler caught unknown middleware error",
    status: 400,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign(defaultErr, err);
  console.log(errorObj.log);

  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
