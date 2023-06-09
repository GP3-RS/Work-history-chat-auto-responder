const slackController = {};
slackController.urlVerification = (req, res, next) => {
    console.log("hitting slackController.urlVerification");
    if (req.body.challenge && req.body.type === "url_verification") {
        return res.status(200).json(req.body.challenge);
    }
    else
        return next();
};
slackController.filterBotMessages = (req, res, next) => {
    console.log("hitting slackController.filterBotMessages");
    if (req.body.event.client_msg_id && req.body.event.bot_id === undefined) {
        res.locals.platform = "slack";
        res.locals.question = req.body.event.text;
        return next();
    }
    else
        return res.status(200).json("OK");
};
export default slackController;
