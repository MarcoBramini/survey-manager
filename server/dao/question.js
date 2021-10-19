"use strict";

//---------------
// CreateQuestion
//---------------

exports.createQuestion = (
  db,
  surveyID,
  title,
  type,
  isOptional = null,
  maxAnswerLength = null,
  minChoices = null,
  maxChoices = null,
  options = null
) => {
  return new Promise((resolve, reject) => {
    db.run(
      createQuestionQuery,
      {
        $surveyID: surveyID,
        $title: title,
        $type: type,
        $isOptional: isOptional,
        $maxAnswerLength: maxAnswerLength,
        $minChoices: minChoices,
        $maxChoices: maxChoices,
        $options: JSON.stringify(options),
      },
      async function (err) {
        if (err) {
          reject(err);
        }
        resolve(this.lastID);
      }
    );
  });
};

const createQuestionQuery =
  "INSERT INTO questions(surveyID, position, title, type, isOptional, maxAnswerLength, minChoices, maxChoices,options) VALUES($surveyID, (SELECT count(*)+1 FROM questions WHERE surveyID=$surveyID), $title, $type, $isOptional, $maxAnswerLength, $minChoices, $maxChoices,$options);";

//---------------
// UpdateQuestion
//---------------

exports.updateQuestion = (
  db,
  questionID,
  surveyID,
  title,
  type,
  isOptional = null,
  maxAnswerLength = null,
  minChoices = null,
  maxChoices = null,
  options = null
) => {
  return new Promise(async (resolve, reject) => {
    db.run(
      updateQuestionQuery,
      {
        $surveyID: surveyID,
        $title: title,
        $type: type,
        $isOptional: isOptional,
        $maxAnswerLength: maxAnswerLength,
        $minChoices: minChoices,
        $maxChoices: maxChoices,
        $options: JSON.stringify(options),
        $questionID: questionID,
      },
      async function (err) {
        if (err) {
          reject(err);
        }
        resolve(questionID);
      }
    );
  });
};

const updateQuestionQuery =
  "UPDATE questions SET surveyID=$surveyID, title=$title, type=$type, isOptional=$isOptional, maxAnswerLength=$maxAnswerLength, minChoices=$minChoices, maxChoices=$maxChoices, options=$options WHERE id = $questionID";

//---------------
// DeleteQuestion
//---------------

exports.deleteQuestion = (db, questionID, surveyID) => {
  return new Promise(async (resolve, reject) => {
    db.serialize(() => {
      const params = { $questionID: questionID, $surveyID: surveyID };

      db.run(updateQuestionsPositionQuery, params, async function (err) {
        if (err) {
          reject(err);
        }
      });

      db.run(deleteQuestionQuery, params, async function (err) {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  });
};

const updateQuestionsPositionQuery = `UPDATE questions
SET position=position-1
WHERE surveyID = $surveyID
AND position>(
  SELECT position
  FROM questions
  WHERE id = $questionID AND surveyID = $surveyID
  );`;

const deleteQuestionQuery = `DELETE FROM questions 
  WHERE id = $questionID AND surveyID = $surveyID;`;

//---------------
// PositionUpQuestion
//---------------

exports.positionUpQuestion = (db, questionID, surveyID) => {
  return new Promise(async (resolve, reject) => {
    db.serialize(() => {
      const params = { $questionID: questionID, $surveyID: surveyID };

      db.run(positionDownOtherQuestionQuery, params, async function (err) {
        if (err) {
          reject(err);
        }
      });

      db.run(positionUpQuestionQuery, params, async function (err) {
        if (err) {
          reject(err);
        }
        resolve(questionID);
      });
    });
  });
};

const positionDownOtherQuestionQuery = `UPDATE questions 
SET position = position +1 
WHERE id = (
  SELECT id
  FROM questions
  WHERE surveyID = $surveyID AND position = (
    SELECT position 
    FROM questions
    WHERE id = $questionID AND surveyID = $surveyID AND position >1)-1
);`;
const positionUpQuestionQuery = `UPDATE questions
SET position = position -1
WHERE id = $questionID AND surveyID = $surveyID AND position >1;`;

//---------------
// PositionDownQuestion
//---------------

exports.positionDownQuestion = (db, questionID, surveyID) => {
  return new Promise(async (resolve, reject) => {
    db.serialize(() => {
      const params = { $questionID: questionID, $surveyID: surveyID };

      db.run(positionUpOtherQuestionQuery, params, async function (err) {
        if (err) {
          reject(err);
        }
      });

      db.run(positionDownQuestionQuery, params, async function (err) {
        if (err) {
          reject(err);
        }
        resolve(questionID);
      });
    });
  });
};

const positionUpOtherQuestionQuery = `UPDATE questions 
SET position = position -1 
WHERE id = (
  SELECT id
  FROM questions
  WHERE surveyID = $surveyID AND position = (
    SELECT position 
    FROM questions
    WHERE id = $questionID AND surveyID = $surveyID AND position < (
      SELECT count(*)
      FROM questions
      WHERE surveyID = $surveyID
    )
  )+1
);`;
const positionDownQuestionQuery = `UPDATE questions
SET position = position +1
WHERE id = $questionID AND surveyID = $surveyID AND position < (
  SELECT count(*)
  FROM questions
  WHERE surveyID = $surveyID
);`;
