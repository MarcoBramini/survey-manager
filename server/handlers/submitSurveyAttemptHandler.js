"use strict";

const { body, param, oneOf } = require("express-validator");
const { checkAllowedBodyFields } = require("./customValidators");

const dao = require("../dao/dao");

const { QuestionType } = require("../models/Question");
const { SurveyAttempt } = require("../models/surveyAttempt");

const allowedBodyFields = ["userFullName", "startedAt", "answers"];

exports.submitSurveyAttemptValidationChain = [
  param("surveyID").exists().bail().isInt().toInt(),

  body().custom(checkAllowedBodyFields(allowedBodyFields)),

  // Question
  body("userFullName").exists().bail().isString(),
  body("startedAt")
    .exists()
    .bail()
    .isISO8601({ strict: true, strictSeparator: true }),

  body("answers").exists().bail().isArray({ min: 1 }),
  body("answers.*.questionID").exists().bail().isInt(),
  body("answers.*.value").optional({ nullable: true }),
  /*oneOf([
    body("answers.*.value").isArray(),
    body("answers.*.value").isString(),
  ]),*/
  body("answers.*.value.*").exists().bail().isString(),
];

function checkErrorsSurveyAttempt(surveyAttempt, survey) {
  if (surveyAttempt.answers.length !== survey.questions.length) {
    return `Expected ${survey.questions.length} answers but received ${surveyAttempt.answers.length}`;
  }

  for (let question of survey.questions) {
    // Obtain answer for current question
    let answer = surveyAttempt.answers.filter(
      (answer) => answer.questionID === question.id
    )[0];

    // Check if answer exists for current question
    if (!answer) {
      return `Answer not provided for question ${question.id}`;
    }

    if (question.type === QuestionType.OPEN) {
      // Check answer value is a string
      if (answer.value !== null && typeof answer.value !== "string") {
        return `Question n°${
          question.position
        } provided answer is not valid (type: ${typeof answer.value} value: ${
          answer.value
        })`;
      }

      // Check if answer is not null for mandatory questions
      if (!question.isOptional && !answer.value) {
        return `Question n°${question.position} answer is required`;
      }

      // Check answer max length
      if (answer.value && answer.value.length > question.maxAnswerLength) {
        return `Question n°${question.position} answer exceeds maximum length`;
      }
    }

    if (question.type === QuestionType.MULTIPLE_CHOICE) {
      // Check answer value is an array
      if (answer.value !== null && !Array.isArray(answer.value)) {
        return `Question n°${
          question.position
        } provided answer is not valid (type: ${typeof answer.value} value: ${
          answer.value
        })`;
      }

      // Check if answer is not null for mandatory questions
      if (answer.value === null && question.minChoices !== 0) {
        return `Question n°${question.position} answer is required`;
      }

      // Check if every answer provided is within the accepted answers list
      for (let value of answer.value) {
        if (!question.options.includes(value)) {
          return `Question n°${
            question.position
          } provided answer is unknown (type: ${typeof answer.value} value: ${
            answer.value
          })`;
        }
      }

      // Check if the number of answers provided is between the boundaries
      if (
        answer.value.length < question.minChoices ||
        answer.value.length > question.maxChoices
      ) {
        return `Question n°${question.position} answer doesn't respect min and max choices boundaries`;
      }
    }
  }
}

exports.submitSurveyAttemptHandler = async (req, res) => {
  const newSurveyAttempt = SurveyAttempt.fromJSON(req.body);

  const survey = await dao.getSurvey(req.params["surveyID"]).catch((err) => {
    console.error(
      "dao.getSurvey(",
      "\nsurveyID:",
      req.params["surveyID"],
      ") failed with: " + err.message
    );
    return res.status(500).json({ error: "Something wrong happened :(" });
  });

  const err = checkErrorsSurveyAttempt(newSurveyAttempt, survey);
  if (err) {
    console.error(`submitSurveyAttemptHandler: ${err}`);
    return res.status(422).json({ error: err });
  }

  const newSurveyAttemptID = await dao
    .createSurveyAttempt(
      req.params["surveyID"],
      newSurveyAttempt.userFullName,
      newSurveyAttempt.startedAt,
      newSurveyAttempt.answers
    )
    .catch((err) => {
      console.error(
        "dao.createSurveyAttempt(",
        "\nsurveyID:",
        req.params["surveyID"],
        "\nuserFullName:",
        newSurveyAttempt.userFullName,
        "\nstartedAt:",
        newSurveyAttempt.startedAt,
        "\nanswers:",
        newSurveyAttempt.answers,
        ") failed with: " + err.message
      );
      return res.status(500).json({ error: "Something wrong happened :(" });
    });

  await dao.incrementSurveySubmitsCount(req.params["surveyID"]).catch((err) => {
    console.error(
      "dao.incrementSurveySubmitsCount(",
      "\nsurveyID:",
      req.params["surveyID"],
      ") failed with: " + err.message
    );
  });

  return res.status(200).json({ newSurveyAttemptID: newSurveyAttemptID });
};
