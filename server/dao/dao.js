"use strict";

const sqlite = require("sqlite3");
const { getUserByEmail, getUserByID } = require("./user");
const {
  createSurvey,
  getOwnedSurveys,
  getOwnedSurvey,
  updateSurvey,
  deleteSurvey,
  getAvailableSurveys,
  getSurvey,
  incrementSurveySubmitsCount,
} = require("./survey");
const {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  positionUpQuestion,
  positionDownQuestion,
} = require("./question");
const { createAnswers } = require("./answer");
const {
  createSurveyAttempt,
  deleteSurveyAttempt,
  getSurveyAttempts,
} = require("./surveyAttempt");

// Initialize database
const db = new sqlite.Database("database.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  db.run("PRAGMA foreign_keys = ON"); // Enable foreign keys
});

// DAO methods

//-------
// Survey
//-------
exports.createSurvey = (
  title,
  description,
  isPublished,
  estCompletionMinutes,
  userID
) =>
  createSurvey(
    db,
    title,
    description,
    isPublished,
    estCompletionMinutes,
    userID
  );

exports.getAvailableSurveys = (search, limit, order) =>
  getAvailableSurveys(db, search, limit, order);

exports.getSurvey = (surveyID) => getSurvey(db, surveyID);

exports.getOwnedSurveys = (userID, limit, order) =>
  getOwnedSurveys(db, userID, limit, order);

exports.getOwnedSurvey = (surveyID, userID) =>
  getOwnedSurvey(db, surveyID, userID);

exports.updateSurvey = (
  surveyID,
  title,
  description,
  createdAt,
  isPublished,
  publishedAt,
  estCompletionMinutes,
  submitsCount,
  userID
) =>
  updateSurvey(
    db,
    surveyID,
    title,
    description,
    createdAt,
    isPublished,
    publishedAt,
    estCompletionMinutes,
    submitsCount,
    userID
  );

exports.incrementSurveySubmitsCount = (surveyID) =>
  incrementSurveySubmitsCount(db, surveyID);

exports.deleteSurvey = (surveyID, userID) => deleteSurvey(db, surveyID, userID);

//---------
// Question
//---------

exports.createQuestion = (
  surveyID,
  title,
  type,
  isOptional,
  maxAnswerLength,
  minChoices,
  maxChoices,
  options
) =>
  createQuestion(
    db,
    surveyID,
    title,
    type,
    isOptional,
    maxAnswerLength,
    minChoices,
    maxChoices,
    options
  );

exports.updateQuestion = (
  questionID,
  surveyID,
  title,
  type,
  isOptional,
  maxAnswerLength,
  minChoices,
  maxChoices,
  options
) =>
  updateQuestion(
    db,
    questionID,
    surveyID,
    title,
    type,
    isOptional,
    maxAnswerLength,
    minChoices,
    maxChoices,
    options
  );

exports.positionUpQuestion = (questionID, surveyID) =>
  positionUpQuestion(db, questionID, surveyID);

exports.positionDownQuestion = (questionID, surveyID) =>
  positionDownQuestion(db, questionID, surveyID);

exports.deleteQuestion = (questionID, surveyID) =>
  deleteQuestion(db, questionID, surveyID);

//--------------
// SurveyAttempt
//--------------

exports.createSurveyAttempt = (surveyID, userFullName, startedAt, answers) =>
  createSurveyAttempt(db, surveyID, userFullName, startedAt, answers);

exports.getSurveyAttempts = (surveyID, search, limit, order) =>
  getSurveyAttempts(db, surveyID, search, limit, order);

exports.deleteSurveyAttempt = (surveyAttemptID) =>
  deleteSurveyAttempt(db, surveyAttemptID);

//-------
// Answer
//-------

exports.createAnswers = (surveyAttemptID, answers) =>
  createAnswers(db, surveyAttemptID, answers);

//-----
// User
//-----

exports.getUserByEmail = (email) => getUserByEmail(db, email);

exports.getUserByID = (userId) => getUserByID(db, userId);
