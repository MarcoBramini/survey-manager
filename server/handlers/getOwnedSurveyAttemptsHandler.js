"use strict";

const { query, param } = require("express-validator");

const dao = require("../dao/dao");

exports.getOwnedSurveyAttemptsValidationChain = [
  param("surveyID").exists().bail().isInt(),
  query("search").optional({ nullable: true }).isString(),
  query("limit").optional({ nullable: true }).isInt(),
  query("order")
    .optional({ nullable: true })
    .isIn(["+submittedAt", "-submittedAt"]),
];

exports.getOwnedSurveyAttemptsHandler = async (req, res) => {
  return await dao
    .getSurveyAttempts(
      req.params["surveyID"],
      req.query.search,
      req.query.limit,
      req.query.order
    )
    .then((surveyAttempts) => res.status(200).json(surveyAttempts))
    .catch((err) => {
      console.error(
        "dao.getSurveyAttempts(",
        "\nsurveyID:",
        req.params["surveyID"],
        "\nlimit:",
        req.query.limit,
        "\norder:",
        req.query.order,
        ") failed with: " + err.message
      );
      return res.status(500).json({ error: "Something wrong happened :(" });
    });
};
