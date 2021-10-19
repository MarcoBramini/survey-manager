"use strict";

const { param } = require("express-validator");

const dao = require("../dao/dao");

exports.getOwnedSurveyValidationChain = [
  param("surveyID").exists().bail().isInt(),
];

exports.getOwnedSurveyHandler = async (req, res) => {
  return await dao
    .getOwnedSurvey(req.params["surveyID"], req.user.id)
    .then((survey) => {
      if (survey) return res.status(200).json(survey);

      res.status(404).json({ error: "not found" });
    })
    .catch((err) => {
      console.error(
        "dao.getOwnedSurvey(",
        "\nsurveyID:",
        req.params["surveyID"],
        "\nuserID:",
        req.user.id,
        ") failed with: " + err.message
      );
      return res.status(500).json({ error: "Something wrong happened :(" });
    });
};
