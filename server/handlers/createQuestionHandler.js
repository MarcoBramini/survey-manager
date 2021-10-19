"use strict";

const { body, oneOf } = require("express-validator");
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

exports.createQuestionValidationChain = [
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

exports.createQuestionHandler = async (req, res) => {
  const newQuestion = Question.fromJSON(req.body);

  return await dao
    .createQuestion(
      req.params["surveyID"],
      newQuestion.title,
      newQuestion.type,
      newQuestion.isOptional,
      newQuestion.maxAnswerLength,
      newQuestion.minChoices,
      newQuestion.maxChoices,
      newQuestion.options
    )
    .then((newQuestionID) =>
      res.status(200).json({ newQuestionID: newQuestionID })
    )
    .catch((err) => {
      console.error(
        "dao.createQuestion(",
        "\nsurveyID:",
        req.params["surveyID"],
        "\ntitle:",
        newQuestion.title,
        "\ntype:",
        newQuestion.type,
        "\nisOptional:",
        newQuestion.isOptional,
        "\nmaxAnswerLength:",
        newQuestion.maxAnswerLength,
        "\nminChoices:",
        newQuestion.minChoices,
        "\nmaxChoices:",
        newQuestion.maxChoices,
        "\noptions:",
        newQuestion.options,
        ") failed with: " + err.message
      );
      return res.status(500).json({ error: "Something wrong happened :(" });
    });
};
