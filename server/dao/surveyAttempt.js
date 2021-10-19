"use strict";

const dayjs = require("dayjs");
const { SurveyAttempt } = require("../models/surveyAttempt");
const { createAnswers } = require("./answer");

// -------------------
// CreateSurveyAttempt
// -------------------

exports.createSurveyAttempt = (
  db,
  surveyID,
  userFullName,
  startedAt,
  answers
) => {
  return new Promise((resolve, reject) => {
    db.run(
      createSurveyAttemptQuery,
      [
        surveyID,
        userFullName,
        startedAt.toISOString(),
        dayjs().toISOString(), // submittedAt
      ],
      async function (err) {
        if (err) {
          reject(err);
        }
        const newSurveyAttemptID = this.lastID;

        await createAnswers(db, newSurveyAttemptID, answers)
          .then(() => resolve(newSurveyAttemptID))
          .catch((err) => {
            exports.deleteSurveyAttempt(db, newSurveyAttemptID);
            reject("error occurred persisting answers: " + err);
          });
      }
    );
  });
};

const createSurveyAttemptQuery =
  "INSERT INTO survey_attempts(surveyID, userFullName, startedAt, submittedAt) VALUES (?,?,?,?);";

// -----------------
// GetSurveyAttempts
// -----------------

exports.getSurveyAttempts = (
  db,
  surveyID,
  search = "",
  limit = 0,
  order = null
) => {
  return new Promise((resolve, reject) => {
    const [query, params] = buildGetSurveyAttemptsQuery(
      surveyID,
      search,
      limit,
      order
    );

    db.all(query, params, function (err, rows) {
      if (err) {
        reject(err);
      }

      let surveyAttempts = [];
      rows?.forEach((row) => {
        surveyAttempts.push(SurveyAttempt.fromJSON(JSON.parse(row.record)));
      });

      resolve(surveyAttempts);
    });
  });
};

const buildGetSurveyAttemptsQuery = (surveyID, search, limit, order) => {
  let query = `${getSurveyAttemptsBaseQuery}`;
  let params = { $surveyID: surveyID };

  if (search) {
    query = `${query} AND att.userFullName LIKE $search`;
    params = { ...params, $search: `%${search}%` };
  }

  if (order) {
    // Column name cannot be parametrized.
    // The content of the order variable has already been
    // tested during the validation, that makes this safe.
    query = `${query} ORDER BY ${order.slice(1)} ${
      order[0] === "+" ? "ASC" : "DESC"
    }`;
  }

  if (limit) {
    query = `${query} LIMIT $limit`;
    params = {
      ...params,
      $limit: limit,
    };
  }

  return [query, params];
};

const getSurveyAttemptsBaseQuery = `SELECT json_object(
  'id',id,
  'surveyID',surveyID,
  'userFullName',userFullName,
  'startedAt', startedAt,
  'submittedAt', submittedAt,
  'answers', 
  (
    SELECT json_group_array(
      json_object(
        'surveyAttemptID',surveyAttemptID,
        'questionID',questionID,
        'value',json_extract(value, '$')
      )
    )
    FROM answers ans
    WHERE ans.surveyAttemptID = att.id
  )
) as record
FROM survey_attempts att 
WHERE att.surveyID = $surveyID`;

// -------------------
// DeleteSurveyAttempt
// -------------------

exports.deleteSurveyAttempt = (db, surveyAttemptID) => {
  return new Promise((resolve, reject) => {
    db.run(deleteSurveyAttemptQuery, [surveyAttemptID], async function (err) {
      if (err) {
        reject(err);
      }

      resolve(this.lastID);
    });
  });
};

const deleteSurveyAttemptQuery = "DELETE FROM survey_attempts WHERE id = ?";
