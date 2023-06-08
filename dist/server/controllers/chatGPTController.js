import responseHelper from "../response-helper.js";
const chatGPTController = {};
chatGPTController.generateResponse = async (req, res, next) => {
    console.log("hitting chatGPTController.generateResponse");
    if (res.locals.question.length === 0)
        return next();
    else if (res.locals.platform === "slack") {
        responseHelper.generateAndPost(res.locals);
        return next();
    }
    else if (res.locals.platform === "website") {
        res.locals.payload = await responseHelper.generateAndPost(res.locals);
        return next();
    }
};
export default chatGPTController;
