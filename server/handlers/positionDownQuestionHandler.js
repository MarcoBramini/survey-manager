"use strict";

const { param } = require("express-validator");

const dao = require("../dao/dao");

exports.positionDownQuestionValidationChain = [
  param("surveyID").exists().bail().isInt().toInt(),
  param("questionID").exists().bail().isInt().toInt(),
];

exports.positionDownQuestionHandler = async (req, res) => {
  return await dao
    .positionDownQuestion(req.params["questionID"], req.params["surveyID"])
    .then((updatedQuestionID) =>
      res.status(200).json({ updatedQuestionID: updatedQuestionID })
    )
    .catch((err) => {
      console.error(
        "dao.positionDownQuestion(",
        "\nquestionID:",
        req.params["questionID"],
        "\nsurveyID:",
        req.params["surveyID"],
        ") failed with: " + err.message
      );
      return res.status(500).json({ error: "Something wrong happened :(" });
    });
};
