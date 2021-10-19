"use strict";

const { body, param, oneOf } = require("express-validator");
const { checkAllowedBodyFields } = require("./customValidators");

const dao = require("../dao/dao");

const { QuestionType, Question } = require("../models/Question");

const allowedBodyFields = [
  "title",
  "type",
  "isOptional",
  "maxAnswerLength",
  "minChoices",
  "maxChoices",
  "options",
];

exports.updateQuestionValidationChain = [
  param("surveyID").exists().bail().isInt().toInt(),
  param("questionID").exists().bail().isInt().toInt(),

  body().custom(checkAllowedBodyFields(allowedBodyFields)),

  // Question
  body("title").exists(),
  body("type").exists().bail().isIn(Object.values(QuestionType)),
  /*
  That would be the right way to check for optional question fields. 
  This doesn't work due to a bug with oneOf that will be fixed in express-validator v7. 
  https://github.com/express-validator/express-validator/issues/950

  oneOf([
    body("isOptional").exists(),
    [
      body("minChoices").exists(),
      body("maxChoices").exists(),
      body("options").exists(),
    ],
  ]),*/
  oneOf([
    body("isOptional").optional({ nullable: true }).isBoolean(),
    body("isOptional").optional({ nullable: true }).isInt(),
  ]),
  body(["maxAnswerLength", "minChoices", "maxChoices"])
    .optional({ nullable: true })
    .isInt(),
  body("options").optional({ nullable: true }).isArray({ min: 0 }),
  body("options.*").isString(),
];

exports.updateQuestionHandler = async (req, res) => {
  const updatedQuestion = Question.fromJSON(req.body);

  return await dao
    .updateQuestion(
      req.params["questionID"],
      req.params["surveyID"],
      updatedQuestion.title,
      updatedQuestion.type,
      updatedQuestion.isOptional,
      updatedQuestion.maxAnswerLength,
      updatedQuestion.minChoices,
      updatedQuestion.maxChoices,
      updatedQuestion.options
    )
    .then((updatedQuestionID) =>
      res.status(200).json({ updatedQuestionID: updatedQuestionID })
    )
    .catch((err) => {
      console.error(
        "dao.updateQuestion(",
        "\nquestionID:",
        req.params["questionID"],
        "\nsurveyID:",
        req.params["surveyID"],
        "\ntitle:",
        updatedQuestion.title,
        "\ntype:",
        updatedQuestion.type,
        "\nisOptional:",
        updatedQuestion.isOptional,
        "\nmaxAnswerLength:",
        updatedQuestion.maxAnswerLength,
        "\nminChoices:",
        updatedQuestion.minChoices,
        "\nmaxChoices:",
        updatedQuestion.maxChoices,
        "\noptions:",
        updatedQuestion.options,
        ") failed with: " + err.message
      );
      return res.status(500).json({ error: "Something wrong happened :(" });
    });
};
