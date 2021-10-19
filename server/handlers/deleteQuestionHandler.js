"use strict";

const { param } = require("express-validator");

const dao = require("../dao/dao");

exports.deleteQuestionValidationChain = [
  param("surveyID").exists().bail().isInt().toInt(),
  param("questionID").exists().bail().isInt().toInt(),
];

exports.deleteQuestionHandler = async (req, res) => {
  return await dao
    .deleteQuestion(req.params["questionID"], req.params["surveyID"])
    .then(() => res.status(204).json())
    .catch((err) => {
      console.error(
        "dao.deleteQuestion( ",
        "\nquestionID:",
        req.params["questionID"],
        "\nsurveyID:",
        req.params["surveyID"],
        "\nuserID:",
        req.user.id,
        " ) failed with: " + err.message
      );
      return res.status(500).json({ error: "Something wrong happened :(" });
    });
};
