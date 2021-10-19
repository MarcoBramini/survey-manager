"use strict";

const dayjs = require("dayjs");

// -------------------
// CreateAnswers
// -------------------

exports.createAnswers = (db, surveyAttemptID, answers) => {
  return new Promise((resolve, reject) => {
    const [query, params] = buildCreateAnswersQuery(surveyAttemptID, answers);

    db.run(query, params, async function (err) {
      if (err) {
        reject(err);
      }

      resolve();
    });
  });
};

function buildCreateAnswersQuery(surveyAttemptID, answers) {
  let query = "INSERT INTO answers(surveyAttemptID, questionID, value) VALUES";
  let params = [];

  for (let answer of answers) {
    query = `${query} (?,?,?),`;
    params.push(
      surveyAttemptID,
      answer.questionID,
      JSON.stringify(answer.value)
    );
  }

  return [query.slice(0, -1) + ";", params];
}
