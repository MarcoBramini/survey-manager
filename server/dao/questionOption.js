"use strict";

exports.createQuestionOption = (db, questionID, position, value) => {
  return new Promise((resolve, reject) => {
    db.run(
      createQuestionOptionQuery,
      [questionID, position, value],
      function (err) {
        if (err) {
          reject(err);
        }
        resolve(this.lastID);
      }
    );
  });
};

const createQuestionOptionQuery =
  "INSERT INTO question_options(questionID, position, value) VALUES (?,?,?);";

exports.deleteAllQuestionOptions = (db, questionID) => {
  return new Promise((resolve, reject) => {
    db.run(deleteAllQuestionOptionsQuery, [questionID], function (err) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

const deleteAllQuestionOptionsQuery =
  "DELETE FROM question_options WHERE questionID = ?";
