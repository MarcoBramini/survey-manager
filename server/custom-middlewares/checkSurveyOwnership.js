const dao = require("../dao/dao");

// Checks if a user has control over the resources associated to a given survey
exports.checkSurveyOwnership = async (req, res, next) => {
  const survey = await dao.getOwnedSurvey(req.params["surveyID"], req.user.id);
  if (!survey) {
    return res
      .status(401)
      .json({ error: "insufficient permissions to access the resource" });
  }

  return next();
};
