import Answer from "./models/answer";
import { QuestionType } from "./models/question";

export default class SurveyAttemptService {
  // ----------
  // Formatters
  // ----------

  static getCompletionTimeString(surveyAttempt) {
    return surveyAttempt.submittedAt.to(surveyAttempt?.startedAt, true);
  }

  static getSubmittedAtFormattedString(surveyAttempt) {
    return surveyAttempt.submittedAt.format("DD/MM/YYYY HH:mm");
  }

  static getAnswersQuestionsRatioString(surveyAttempt, survey) {
    return `${surveyAttempt.answers.filter((a) => !!a.value).length}/${
      survey.questions.length
    }`;
  }

  static getTimeElapsedFromStartString(surveyAttempt) {
    return surveyAttempt.startedAt.toNow(true);
  }

  static getQuestionAnswerString(surveyAttempt, questionID, questionType) {
    let answer = surveyAttempt.answers.filter(
      (answer) => answer.questionID === questionID
    )[0]?.value;

    if (answer && questionType === QuestionType.MULTIPLE_CHOICE) {
      answer = answer.join(", ");
    }
    return answer;
  }

  // ---------------
  // Support methods
  // ---------------

  static getQuestionAnswer(surveyAttempt, questionID) {
    return surveyAttempt.answers.filter((a) => a.questionID === questionID)[0];
  }

  static addOrUpdateAnswer(surveyAttempt, questionID, value) {
    let answers = [...surveyAttempt.answers];
    let answerIndex = answers.findIndex((a) => a.questionID === questionID);
    if (answerIndex === -1) {
      answers.push(new Answer(null, questionID, value));
    } else {
      answers[answerIndex].value = value;
    }
    return answers;
  }

  static validateAttemptForSubmit(surveyQuestions, surveyAttempt) {
    for (let question of surveyQuestions) {
      // Obtain answer for current question
      let answer = this.getQuestionAnswer(surveyAttempt, question.id);

      if (question.type === QuestionType.OPEN) {
        // Check if answer is not null for mandatory questions
        if (!question.isOptional && answer.value === null) {
          return `Question n°${question.position} answer is required`;
        }

        // Check answer max length
        if (answer.value && answer.value.length > question.maxAnswerLength) {
          return `Question n°${question.position} answer exceeds maximum length`;
        }
      }

      if (question.type === QuestionType.MULTIPLE_CHOICE) {
        // Check if answer is not null for mandatory questions
        if (answer.value === null && question.minChoices !== 0) {
          return `Question n°${question.position} answer is required`;
        }

        // Check if every answer provided is within the accepted answers list
        answer.value.forEach((v) => {
          if (!question.options.includes(v)) {
            return `Question n°${question.position} provided answer is not valid`;
          }
        });
      }
    }
  }
}
