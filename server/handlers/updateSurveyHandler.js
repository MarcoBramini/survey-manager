"use strict";

const { param, body, oneOf } = require("express-validator");
const { checkAllowedBodyFields } = require("./customValidators");

const dao = require("../dao/dao");

const Survey = require("../models/survey");

const allowedBodyFields = [
  "title",
  "description",
  "createdAt",
  "isPublished",
  "publishedAt",
  "estCompletionMinutes",
  "submitsCount",
  "userID",
];

exports.updateSurveyValidationChain = [
  param("surveyID").exists().bail().isInt().toInt(),

  body().custom(checkAllowedBodyFields(allowedBodyFields)),

  // Survey
  body("title").exists(),
  body("description").exists(),
  body("createdAt")
    .exists()
    .bail()
    .isISO8601({ strict: true, strictSeparator: true }),
  oneOf([
    body("isPublished").optional({ nullable: true }).isBoolean(),
    body("isPublished").optional({ nullable: true }).isInt(),
  ]),
  body("publishedAt")
    .optional({ nullable: true })
    .isISO8601({ strict: true, strictSeparator: true }),
  body("estCompletionMinutes").exists().bail().isInt(),
];

exports.updateSurveyHandler = async (req, res) => {
  const updatedSurvey = Survey.fromJSON(req.body);

  if (req.user.id !== updatedSurvey.userID) {
    console.log(
      `updateSurveyHandler: detected userID not matching between param (${req.user.id}) and body (${updatedSurvey.userID})`
    );
    return res.status(500).json({ error: "Something wrong happened :(" });
  }

  return await dao
    .updateSurvey(
      req.params["surveyID"],
      updatedSurvey.title,
      updatedSurvey.description,
      updatedSurvey.createdAt,
      updatedSurvey.isPublished,
      updatedSurvey.publishesAt,
      updatedSurvey.estCompletionMinutes,
      updatedSurvey.submitsCount,
      req.user.id
    )
    .then((updatedSurveyID) =>
      res.status(200).json({ updatedSurveyID: updatedSurveyID })
    )
    .catch((err) => {
      console.error(
        "dao.updateSurvey( " + updatedSurvey + " ) failed with: " + err.message
      );
      return res.status(500).json({ error: "Something wrong happened :(" });
    });
};
