"use strict";

const { param } = require("express-validator");

const dao = require("../dao/dao");

exports.getSurveyValidationChain = [param("surveyID").exists().bail().isInt()];

exports.getSurveyHandler = async (req, res) => {
  return await dao
    .getSurvey(req.params["surveyID"])
    .then((survey) => {
      if (survey) return res.status(200).json(survey);

      res.status(404).json({ error: "not found" });
    })
    .catch((err) => {
      console.error(
        "dao.getSurvey(",
        "\nsurveyID:",
        req.params["surveyID"],
        ") failed with: " + err.message
      );
      return res.status(500).json({ error: "Something wrong happened :(" });
    });
};
