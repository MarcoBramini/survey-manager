"use strict";

const morgan = require("morgan");

const express = require("express");
const session = require("express-session"); // enable sessions

const passport = require("passport"); // auth middleware
const LocalStrategy = require("passport-local").Strategy; // username and password for login

const {
  checkValidationResults,
} = require("./custom-middlewares/checkValidationResults");
const { checkAdminUser } = require("./custom-middlewares/checkAdminUser");

const {
  createSurveyHandler,
  createSurveyValidationChain,
} = require("./handlers/createSurveyHandler");

const {
  createQuestionHandler,
  createQuestionValidationChain,
} = require("./handlers/createQuestionHandler");

const {
  updateSurveyHandler,
  updateSurveyValidationChain,
} = require("./handlers/updateSurveyHandler");

const {
  loginUserStrategy,
  buildSessionUserData,
  getUserDataFromSession,
  loginUserHandler,
  loginUserValidationChain,
  getCurrentUserHandler,
  logoutUserHandler,
} = require("./handlers/authHandlers");
const {
  getOwnedSurveysHandler,
  getOwnedSurveysValidationChain,
} = require("./handlers/getOwnedSurveysHandler");
const {
  getOwnedSurveyValidationChain,
  getOwnedSurveyHandler,
} = require("./handlers/getOwnedSurveyHandler");
const {
  deleteSurveyHandler,
  deleteSurveyValidationChain,
} = require("./handlers/deleteSurveyHandler");
const {
  checkSurveyOwnership,
} = require("./custom-middlewares/checkSurveyOwnership");
const {
  updateQuestionValidationChain,
  updateQuestionHandler,
} = require("./handlers/updateQuestionHandler");
const {
  deleteQuestionValidationChain,
  deleteQuestionHandler,
} = require("./handlers/deleteQuestionHandler");
const {
  positionUpQuestionValidationChain,
  positionUpQuestionHandler,
} = require("./handlers/positionUpQuestionHandler");
const {
  positionDownQuestionValidationChain,
  positionDownQuestionHandler,
} = require("./handlers/positionDownQuestionHandler");
const {
  getAvailableSurveysHandler,
  getAvailableSurveysValidationChain,
} = require("./handlers/getAvailableSurveysHandler");
const {
  getSurveyHandler,
  getSurveyValidationChain,
} = require("./handlers/getSurveyHandler");
const {
  submitSurveyAttemptHandler,
  submitSurveyAttemptValidationChain,
} = require("./handlers/submitSurveyAttemptHandler");
const {
  getOwnedSurveyAttemptsValidationChain,
  getOwnedSurveyAttemptsHandler,
} = require("./handlers/getOwnedSurveyAttemptsHandler");

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(loginUserStrategy));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser(buildSessionUserData);

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser(getUserDataFromSession);

const serverPort = 3001;
const basePath = "/survey-manager/apis";
const adminBasePath = "/survey-manager/apis/admin";

// Initialize server
const app = new express();

app.use(morgan("dev"));

app.use(express.json());
app.use(
  session({
    secret: "very-secret-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.listen(serverPort, () =>
  console.log(`Server running on http://localhost:${serverPort}/`)
);

/*** Auth APIs ***/

const fakeServerError = (req, res) => {
  res.status(500).end();
};
const fakeAuthError = (req, res) => {
  res
    .status(401)
    .json({ error: "not authenticated or insufficient privileges" });
};

/* LoginUser */
app.post(
  basePath + "/sessions",
  loginUserValidationChain,
  checkValidationResults,
  loginUserHandler(passport)
);

/* GetCurrentUser */
app.get(basePath + "/sessions/current", getCurrentUserHandler);

/* LogoutUser */
app.delete(basePath + "/sessions/current", logoutUserHandler);

/*** SurveyManager APIs ***/

//-------
// Survey
//-------

/* CreateSurvey */
app.post(
  adminBasePath + "/surveys",
  checkAdminUser,
  createSurveyValidationChain,
  checkValidationResults,
  createSurveyHandler
);

/* GetAvailableSurveys */
app.get(
  basePath + "/surveys",
  getAvailableSurveysValidationChain,
  checkValidationResults,
  getAvailableSurveysHandler
);

/* GetSurvey */
app.get(
  basePath + "/surveys/:surveyID",
  getSurveyValidationChain,
  checkValidationResults,
  getSurveyHandler
);

/* GetOwnedSurveys */
app.get(
  adminBasePath + "/surveys",
  checkAdminUser,
  getOwnedSurveysValidationChain,
  checkValidationResults,
  getOwnedSurveysHandler
);

/* GetOwnedSurvey */
app.get(
  adminBasePath + "/surveys/:surveyID",
  checkAdminUser,
  getOwnedSurveyValidationChain,
  checkValidationResults,
  getOwnedSurveyHandler
);

/* UpdateSurvey */
app.put(
  adminBasePath + "/surveys/:surveyID",
  checkAdminUser,
  updateSurveyValidationChain,
  checkValidationResults,
  updateSurveyHandler
);

/* DeleteSurvey */
app.delete(
  adminBasePath + "/surveys/:surveyID",
  checkAdminUser,
  deleteSurveyValidationChain,
  checkValidationResults,
  deleteSurveyHandler
);

//---------
// Question
//---------

/* CreateQuestion */
app.post(
  adminBasePath + "/surveys/:surveyID/questions",
  checkAdminUser,
  createQuestionValidationChain,
  checkValidationResults,
  checkSurveyOwnership,
  createQuestionHandler
);

/* UpdateQuestion */
app.put(
  adminBasePath + "/surveys/:surveyID/questions/:questionID",
  checkAdminUser,
  updateQuestionValidationChain,
  checkValidationResults,
  checkSurveyOwnership,
  updateQuestionHandler
);

/* PositionUpQuestion */
app.post(
  adminBasePath + "/surveys/:surveyID/questions/:questionID/positionUp",
  checkAdminUser,
  positionUpQuestionValidationChain,
  checkValidationResults,
  checkSurveyOwnership,
  positionUpQuestionHandler
);

/* PositionDownQuestion */
app.post(
  adminBasePath + "/surveys/:surveyID/questions/:questionID/positionDown",
  checkAdminUser,
  positionDownQuestionValidationChain,
  checkValidationResults,
  checkSurveyOwnership,
  positionDownQuestionHandler
);

/* DeleteQuestion */
app.delete(
  adminBasePath + "/surveys/:surveyID/questions/:questionID",
  checkAdminUser,
  deleteQuestionValidationChain,
  checkValidationResults,
  checkSurveyOwnership,
  deleteQuestionHandler
);

//--------------
// SurveyAttempt
//--------------

/* GetOwnedSurveyAttempts */
app.get(
  adminBasePath + "/surveys/:surveyID/attempts",
  checkAdminUser,
  getOwnedSurveyAttemptsValidationChain,
  checkValidationResults,
  checkSurveyOwnership,
  getOwnedSurveyAttemptsHandler
);

/* SubmitSurveyAttempt */
app.post(
  basePath + "/surveys/:surveyID/attempts",
  submitSurveyAttemptValidationChain,
  checkValidationResults,
  submitSurveyAttemptHandler
);
