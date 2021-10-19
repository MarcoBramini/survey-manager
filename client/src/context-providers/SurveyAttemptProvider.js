import * as dayjs from "dayjs";
import { createContext, useState } from "react";

import Answer from "../services/models/answer";
import SurveyAttempt from "../services/models/surveyAttempt";
import SurveyAttemptService from "../services/SurveyAttemptService";

const SurveyAttemptContext = createContext();

function SurveyAttemptContextProvider(props) {
  const [surveyAttemptState, setSurveyAttemptState] = useState({
    currentSurvey: null,
    currentSurveyAttempt: null,

    startSurveyAttempt: function (survey, userFullName) {
      let answers = [];
      survey.questions.forEach((question) =>
        answers.push(new Answer(null, question.id))
      );

      setSurveyAttemptState((old) => {
        return {
          ...old,
          currentSurvey: survey,
          currentSurveyAttempt: new SurveyAttempt(
            null,
            survey.id,
            userFullName,
            dayjs(),
            null,
            answers
          ),
        };
      });
    },

    canResumePreviousAttempt: function (surveyID, userFullName) {
      let currentSurveyAttempt;
      setSurveyAttemptState((old) => {
        currentSurveyAttempt = old.currentSurveyAttempt;
        return old;
      });

      return (
        userFullName === currentSurveyAttempt?.userFullName &&
        currentSurveyAttempt?.surveyID === parseInt(surveyID)
      );
    },

    addOrUpdateAnswer: function (questionID, value) {
      setSurveyAttemptState((old) => {
        return {
          ...old,
          currentSurveyAttempt: {
            ...old.currentSurveyAttempt,
            answers: SurveyAttemptService.addOrUpdateAnswer(
              old.currentSurveyAttempt,
              questionID,
              value
            ),
          },
        };
      });
    },

    resetSurveyAttempt: function () {
      setSurveyAttemptState((old) => {
        return {
          ...surveyAttemptState,
          currentSurvey: null,
          currentSurveyAttempt: null,
        };
      });
    },
  });

  return (
    <SurveyAttemptContext.Provider value={surveyAttemptState}>
      {props.children}
    </SurveyAttemptContext.Provider>
  );
}

export { SurveyAttemptContextProvider as default, SurveyAttemptContext };
