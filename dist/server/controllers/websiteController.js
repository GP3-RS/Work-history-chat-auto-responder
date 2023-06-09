const websiteController = {};
websiteController.validateQuestion = (req, res, next) => {
    console.log("hitting websiteController.validateQuestion");
    const { question } = req.body;
    if (question === undefined || typeof question !== "string") {
        return next({
            log: "User question is invalid",
            status: 400,
            message: {
                err: "Error occured with question validation. It's possible that the question's length is 0, or undefined",
            },
        });
    }
    else {
        res.locals.platform = "website";
        res.locals.question = question;
        return next();
    }
};
export default websiteController;
