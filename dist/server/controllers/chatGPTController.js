import responseHelper from "../response-helper.js";
var chatGPTController = {};
chatGPTController.generateResponse = function (req, res, next) {
    console.log("hitting chatGPTController.generateResponse");
    if (res.locals.question.length === 0)
        return next();
    responseHelper.generateAndPost(res.locals);
    return next();
};
export default chatGPTController;
