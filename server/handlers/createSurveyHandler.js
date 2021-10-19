"use strict";

const { body, oneOf } = require("express-validator");
const { checkAllowedBodyFields } = require("./customValidators");

const dao = require("../dao/dao");

const Survey = require("../models/survey");
const { QuestionType } = require("../models/Question");

const allowedBodyFields = [
  "title",
  "description",
  "isPublished",
  "estCompletionMinutes",
];

exports.createSurveyValidationChain = [
  body().custom(checkAllowedBodyFields(allowedBodyFields)),

  // Survey
  body("title").exists(),
  body("description").exists(),
  oneOf([
    body("isPublished").optional({ nullable: true }).isBoolean(),
    body("isPublished").optional({ nullable: true }).isInt(),
  ]),
  body("estCompletionMinutes").exists().bail().isInt(),
];

exports.createSurveyHandler = async (req, res) => {
  const newSurvey = Survey.fromJSON(req.body);

  return await dao
    .createSurvey(
      newSurvey.title,
      newSurvey.description,
      newSurvey.isPublished,
      newSurvey.estCompletionMinutes,
      req.user.id
    )
    .then((newSurveyID) => res.status(200).json({ newSurveyID: newSurveyID }))
    .catch((err) => {
      console.error(
        "dao.createSurvey(",
        "\ntitle:",
        newSurvey.title,
        "\ndescription:",
        newSurvey.description,
        "\nisPublished:",
        newSurvey.isPublished,
        "\nestCompletionMinutes:",
        newSurvey.estCompletionMinutes,
        "\nuserID:",
        req.user?.id || 1,
        ") failed with: " + err.message
      );
      return res.status(500).json({ error: "Something wrong happened :(" });
    });
};
