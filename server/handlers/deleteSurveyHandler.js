"use strict";

const { param } = require("express-validator");

const dao = require("../dao/dao");

exports.deleteSurveyValidationChain = [
  param("surveyID").exists().bail().isInt().toInt(),
];

exports.deleteSurveyHandler = async (req, res) => {
  return await dao
    .deleteSurvey(req.params["surveyID"], req.user.id)
    .then(() => res.status(204).json())
    .catch((err) => {
      console.error(
        "dao.deleteSurvey( ",
        "\nsurveyID:",
        req.params["surveyID"],
        "\nuserID:",
        req.user.id,
        " ) failed with: " + err.message
      );
      return res.status(500).json({ error: "Something wrong happened :(" });
    });
};
