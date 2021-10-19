import { QuestionType, QuestionUIStatus } from "./models/question";

export default class SurveyService {
  static getSortedQuestionsByPosition(survey) {
    const questions = survey?.questions || [];
    questions.sort((q1, q2) => q1.position - q2.position);
    return questions;
  }

  static getQuestionByPosition(survey, position) {
    return survey.questions.filter(
      (question) => parseInt(question.position) === parseInt(position)
    )[0];
  }

  static getPreviousQuestion(survey, position) {
    return survey.questions.filter(
      (question) => parseInt(question.position) === parseInt(position) - 1
    )[0];
  }

  static getNextQuestion(survey, position) {
    return survey.questions.filter(
      (question) => parseInt(question.position) === parseInt(position) + 1
    )[0];
  }

  static canPositionUpQuestion(questionToMove) {
    return questionToMove.position > 1;
  }

  static canPositionDownQuestion(survey, questionToMove) {
    return questionToMove.position < survey.questions.length;
  }

  static positionUpQuestion(questions, questionID) {
    let q1 = questions.find((q) => q.id === questionID);
    if (q1.position === 1) return;
    questions.find((q2) => q2.position === q1.position - 1).position =
      q1.position;
    q1.position -= 1;
  }

  static positionDownQuestion(questions, questionID) {
    let q1 = questions.find((q) => q.id === questionID);
    if (q1.position === questions.length) return;
    questions.find((q2) => q2.position === q1.position + 1).position =
      q1.position;
    q1.position += 1;
  }

  static isAnyQuestionUpdating(survey) {
    return (
      survey?.questions.filter((q) => q.uiStatus !== QuestionUIStatus.OK)
        .length > 0
    );
  }

  static setQuestionUIStatusByID(questions, questionID, uiStatus) {
    let q = questions.find((q) => q.id === questionID);
    if (q) q.uiStatus = uiStatus;
  }

  static setQuestionUIStatusByPosition(questions, position, uiStatus) {
    let q = questions.find((q) => q.position === position);
    if (q) q.uiStatus = uiStatus;
  }

  static validateForPublish(survey) {
    if (survey.questions.length === 0) {
      return "Can't publish a survey without any question set";
    }

    for (let question of survey.questions) {
      if (
        (question.type =
          QuestionType.MULTIPLE_CHOICE && question.options?.length === 0)
      ) {
        return `Question n° ${question.position} doesn't have any option set`;
      }
    }
  }
}
