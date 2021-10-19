"use strict";

const dayjs = require("dayjs");

const Survey = require("../models/survey");

// ------------
// CreateSurvey
// ------------

exports.createSurvey = (
  db,
  title,
  description,
  isPublished,
  estCompletionMinutes,
  userID
) => {
  return new Promise((resolve, reject) => {
    const timeNow = dayjs().toISOString();

    db.run(
      createSurveyQuery,
      [
        title,
        description,
        timeNow, // createdAt
        isPublished,
        isPublished ? timeNow : null, // publishedAt
        estCompletionMinutes,
        0,
        userID,
      ],
      async function (err) {
        if (err) {
          reject(err);
        }

        resolve(this.lastID);
      }
    );
  });
};

const createSurveyQuery =
  "INSERT INTO surveys(title,description, createdAt, isPublished, publishedAt, estCompletionMinutes,submitsCount, userID) VALUES(?,?,?,?,?,?,?,?);";

// --------------
// GetOwnedSurvey
// --------------
exports.getOwnedSurvey = (db, surveyID, userID) => {
  return new Promise((resolve, reject) => {
    const [query, params] = buildGetOwnedSurveyQuery(surveyID, userID);

    db.get(query, params, function (err, row) {
      if (err) {
        reject(err);
      }

      if (row) {
        return resolve(Survey.fromJSON(JSON.parse(row.record)));
      }
      resolve(null);
    });
  });
};

const buildGetOwnedSurveyQuery = (surveyID, userID) => {
  let query = `${getSurveysBaseQuery} WHERE s.userID = ?`;
  let params = [userID];

  query = `${query} AND s.id = ?`;
  params.push(surveyID);

  return [query, params];
};

// ---------------
// GetOwnedSurveys
// ---------------

exports.getOwnedSurveys = (db, userID, limit = 0, order = null) => {
  return new Promise((resolve, reject) => {
    const [query, params] = buildGetOwnedSurveysQuery(userID, limit, order);

    db.all(query, params, function (err, rows) {
      if (err) {
        reject(err);
      }

      let surveys = [];
      rows?.forEach((row) => {
        surveys.push(Survey.fromJSON(JSON.parse(row.record)));
      });

      resolve(surveys);
    });
  });
};

const buildGetOwnedSurveysQuery = (userID, limit, order) => {
  let query = `${getSurveysBaseQuery} WHERE userID = $userID`;
  let params = { $userID: userID };

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

// --------------
// GetSurvey
// --------------
exports.getSurvey = (db, surveyID, userID) => {
  return new Promise((resolve, reject) => {
    const [query, params] = buildGetSurveyQuery(surveyID, userID);

    db.get(query, params, function (err, row) {
      if (err) {
        reject(err);
      }

      if (row) {
        return resolve(Survey.fromJSON(JSON.parse(row.record)));
      }
      resolve(null);
    });
  });
};

const buildGetSurveyQuery = (surveyID) => {
  let query = `${getSurveysBaseQuery} WHERE s.id = $surveyID`;
  let params = { $surveyID: surveyID };

  return [query, params];
};

// ---------------
// GetAvailableSurveys
// ---------------

exports.getAvailableSurveys = (db, search = "", limit = 0, order = null) => {
  return new Promise((resolve, reject) => {
    const [query, params] = buildGetAvailableSurveysQuery(search, limit, order);

    db.all(query, params, function (err, rows) {
      if (err) {
        reject(err);
      }

      let surveys = [];
      rows?.forEach((row) => {
        surveys.push(Survey.fromJSON(JSON.parse(row.record)));
      });

      resolve(surveys);
    });
  });
};

const buildGetAvailableSurveysQuery = (search, limit, order) => {
  let query = `${getSurveysBaseQuery} WHERE isPublished`;
  let params = {};

  if (search) {
    query = `${query} AND title LIKE $search OR description LIKE $search`;
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

const getSurveysBaseQuery = `SELECT json_object(
  'id',id,
  'title',title,
  'description',description,
  'createdAt', createdAt,
  'isPublished',isPublished,
  'publishedAt', publishedAt,
  'estCompletionMinutes', estCompletionMinutes,
  'submitsCount', submitsCount,
  'userID',userID,
  'questions', 
  (
    SELECT json_group_array(
      json_object(
        'id',id,
        'surveyID',surveyID,
        'position',position,
        'title',title,
        'type',type,
        'isOptional',isOptional,
        'maxAnswerLength',maxAnswerLength,
        'minChoices',minChoices,
        'maxChoices',maxChoices,
        'options',json_extract(options, '$')
      )
    )
    FROM questions q
    WHERE q.surveyID = s.id
  )
) as record
FROM surveys s`;

// ------------
// UpdateSurvey
// ------------

const updateSurveyQuery =
  "UPDATE surveys SET title=?,description=?, createdAt=?, isPublished=?, publishedAt=?, estCompletionMinutes=?,submitsCount=?, userID=? WHERE id = ? and userID = ?";

exports.updateSurvey = (
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
) => {
  return new Promise(async (resolve, reject) => {
    db.run(
      updateSurveyQuery,
      [
        title,
        description,
        createdAt?.toISOString(),
        isPublished,
        !publishedAt && isPublished ? dayjs().toISOString() : null, // publishedAt
        estCompletionMinutes,
        submitsCount,
        userID,
        surveyID,
        userID,
      ],
      async function (err) {
        if (err) {
          reject(err);
        }
        resolve(surveyID);
      }
    );
  });
};

exports.incrementSurveySubmitsCount = (db, surveyID) => {
  return new Promise(async (resolve, reject) => {
    db.run(incrementSurveySubmitsCountQuery, surveyID, async function (err) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

const incrementSurveySubmitsCountQuery =
  "UPDATE surveys SET submitsCount = submitsCount +1 WHERE id = ?";

//-------------
// DeleteSurvey
//-------------

exports.deleteSurvey = (db, surveyID, userID) => {
  return new Promise(async (resolve, reject) => {
    db.run(
      "DELETE FROM surveys WHERE id = ? AND userID = ?",
      [surveyID, userID],
      async function (err) {
        if (err) {
          reject(err);
        }
        resolve();
      }
    );
  });
};
