import express from "express";
var app = express();
var PORT = Number(process.env.PORT) || 3000;
app.use(express.json());
import apiRouter from "./server/routes/api.js";
//All requests sent to api router
app.use("/api", apiRouter);
//404 catch-all route handler
app.use(function (req, res) { return res.sendStatus(404); });
//Global error handler
app.use(function (err, req, res, next) {
    var defaultErr = {
        log: "Express error handler caught unknown middleware error",
        status: 400,
        message: { err: "An error occurred" },
    };
    var errorObj = Object.assign(defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
});
app.listen(PORT, function () {
    console.log("Server listening on port: ".concat(PORT));
});
