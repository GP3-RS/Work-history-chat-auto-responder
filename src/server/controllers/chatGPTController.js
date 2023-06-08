import responseHelper from "../response-helper.js";

const chatGPTController = {};

chatGPTController.generateResponse = async (req, res, next) => {
  console.log("hitting chatGPTController.generateResponse");

  if (res.locals.question.length === 0) return next();
  else if (res.locals.platform === "slack") {
    try {
      responseHelper.generateAndPost(res.locals);
    } catch (err) {
      console.log("Generate response failed");
    }
    return next();
  } else if (res.locals.platform === "website") {
    try {
      res.locals.payload = await responseHelper.generateAndPost(res.locals);
    } catch (err) {
      console.log("Generate response failed");
    }
    return next();
  }
};

export default chatGPTController;
