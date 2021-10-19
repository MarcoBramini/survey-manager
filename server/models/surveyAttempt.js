const { Answer } = require("./answer");
const dayjs = require("dayjs");

class SurveyAttempt {
  constructor(
    id,
    surveyID,
    userFullName,
    startedAt = null, // iso8601 string
    submittedAt = null, // iso8601 string
    answers = []
  ) {
    this.id = id;
    this.surveyID = surveyID;
    this.userFullName = userFullName;
    this.startedAt = startedAt ? dayjs(startedAt) : null;
    this.submittedAt = submittedAt ? dayjs(submittedAt) : null;
    this.answers = answers;
  }

  static fromJSON(json) {
    let sa = new SurveyAttempt(
      json.id,
      json.surveyID,
      json.userFullName,
      json.startedAt,
      json.submittedAt,
      null
    );

    if (json.answers) {
      sa.answers = json.answers.map((answer) => Answer.fromJSON(answer));
    }

    return sa;
  }
}

module.exports = { SurveyAttempt };
