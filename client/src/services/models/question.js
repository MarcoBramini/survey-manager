const QuestionType = {
  OPEN: "OPEN",
  MULTIPLE_CHOICE: "MULTIPLE_CHOICE",
};

const QuestionUIStatus = {
  OK: 0,
  CREATING: 1,
  UPDATING: 2,
  DELETING: 3,
};

class Question {
  constructor(
    id,
    surveyID,
    position,
    title,
    type,
    // Only populated for open questions
    isOptional = null,
    maxAnswerLength = null,
    // Only populated for multiple choise questions
    minChoices = null,
    maxChoices = null,
    options = null,
    uiStatus = QuestionUIStatus.OK
  ) {
    this.id = id;
    this.surveyID = surveyID;
    this.position = position !== null ? parseInt(position) : null;
    this.title = title;
    this.type = type;
    this.isOptional = isOptional;
    this.maxAnswerLength =
      maxAnswerLength !== null ? parseInt(maxAnswerLength) : null;
    this.minChoices = minChoices !== null ? parseInt(minChoices) : null;
    this.maxChoices = maxChoices !== null ? parseInt(maxChoices) : null;
    this.options = options;
    this.uiStatus = QuestionUIStatus.OK;
  }

  static fromJSON(json) {
    return new Question(
      json.id,
      json.surveyID,
      json.position,
      json.title,
      json.type,
      json.isOptional,
      json.maxAnswerLength,
      json.minChoices,
      json.maxChoices,
      json.options
    );
  }
}

export { Question as default, QuestionType, QuestionUIStatus };
