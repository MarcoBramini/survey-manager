class Answer {
  constructor(surveyAttemptID = null, questionID, value = null) {
    this.surveyAttemptID = surveyAttemptID ? parseInt(surveyAttemptID) : null;
    this.questionID = parseInt(questionID);
    this.value = value; // "answer" or ["ans", "ans"] or null
  }

  static fromJSON(json) {
    return new Answer(json.surveyAttemptID, json.questionID, json.value);
  }
}

module.exports = { Answer };
