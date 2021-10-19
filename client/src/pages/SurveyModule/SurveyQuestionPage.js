import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";

import { Container, Row } from "react-bootstrap";

import Navbar from "../../ui-components/Navbar/Navbar";
import Spinner from "../../ui-components/Spinner/Spinner";
import SurveyQuestionCard from "../../ui-components/SurveyQuestionCard/SurveyQuestionCard";
import SurveyOpenQuestionForm from "../../ui-components/SurveyOpenQuestionForm/SurveyOpenQuestionForm";
import SurveyMultipleChoiceQuestionForm from "../../ui-components/SurveyMultipleChoiceQuestionForm/SurveyMultipleChoiceQuestionForm";
import Paginator from "../../ui-components/Paginator/Paginator";

import { QuestionType } from "../../services/models/question";
import SurveyService from "../../services/SurveyService";
import SurveyAttemptService from "../../services/SurveyAttemptService";

import { AuthContext } from "../../context-providers/AuthContext/AuthContextProvider";
import { SurveyAttemptContext } from "../../context-providers/SurveyAttemptProvider";
function SurveyQuestionPage() {
  const params = useParams();
  const history = useHistory();
  const authContext = useContext(AuthContext);
  const surveyAttemptContext = useContext(SurveyAttemptContext);

  const [isInitialized, setIsInitialized] = useState(true);

  const [question, setQuestion] = useState();
  const [submittedAnswer, setSubmittedAnswer] = useState();

  useEffect(() => {
    window.onbeforeunload = function () {
      return true;
    };

    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  useEffect(() => {
    if (!authContext.userFullName) {
      console.log("unidentified user");
      history.push("/discover");
      return;
    }

    if (!surveyAttemptContext.currentSurveyAttempt) {
      console.log("no attempt in progress");
      history.push("/discover");
      return;
    }

    const loadData = () => {
      let currentQuestion = SurveyService.getQuestionByPosition(
        surveyAttemptContext.currentSurvey,
        params.questionPosition
      );
      setQuestion(currentQuestion);

      let submittedAnswer = SurveyAttemptService.getQuestionAnswer(
        surveyAttemptContext.currentSurveyAttempt,
        currentQuestion.id
      );
      setSubmittedAnswer(submittedAnswer);

      setIsInitialized(false);
    };

    loadData();
  }, [
    authContext.userFullName,
    history,
    params.questionPosition,
    surveyAttemptContext,
  ]);

  const onQuestionAnswerSubmit = (value) => {
    surveyAttemptContext.addOrUpdateAnswer(question.id, value);

    onNextQuestionNavigation();
  };

  const onPreviousQuestionNavigation = () => {
    const previousQuestion = SurveyService.getPreviousQuestion(
      surveyAttemptContext.currentSurvey,
      params.questionPosition
    );
    if (!previousQuestion) return;
    history.push(
      "/surveys/" + params.surveyID + "/questions/" + previousQuestion.position
    );
  };

  const onNextQuestionNavigation = () => {
    const nextQuestion = SurveyService.getNextQuestion(
      surveyAttemptContext.currentSurvey,
      params.questionPosition
    );
    if (!nextQuestion) {
      history.push("/surveys/" + params.surveyID + "/submit");
      return;
    }
    history.push(
      "/surveys/" + params.surveyID + "/questions/" + nextQuestion.position
    );
  };

  const onQuestionNavigation = (questionPosition) => {
    const question = SurveyService.getQuestionByPosition(
      surveyAttemptContext.currentSurvey,
      questionPosition
    );
    history.push(
      "/surveys/" + params.surveyID + "/questions/" + question.position
    );
  };

  return (
    <>
      {isInitialized ? (
        <Spinner fullPage />
      ) : (
        <>
          <Navbar />
          <Container className='mt-4'>
            <SurveyQuestionCard
              key={"survey-question-card-" + question.id}
              question={question}
              onPreviousQuestionNavigation={onPreviousQuestionNavigation}
              onNextQuestionNavigation={onNextQuestionNavigation}
              isLastQuestion={
                question.position ===
                surveyAttemptContext.currentSurvey.questions.length
              }
              footer={
                <Row className='justify-content-center'>
                  <Paginator
                    pageCount={
                      surveyAttemptContext.currentSurvey.questions.length
                    }
                    initialPage={question.position}
                    onPageChange={onQuestionNavigation}
                  />
                </Row>
              }>
              {question.type === QuestionType.OPEN ? (
                <SurveyOpenQuestionForm
                  key={"survey-open-question-form-" + question.id}
                  isOptional={question.isOptional}
                  maxAnswerLength={question.maxAnswerLength}
                  initialValue={submittedAnswer?.value || null}
                  onSubmit={onQuestionAnswerSubmit}
                />
              ) : (
                <SurveyMultipleChoiceQuestionForm
                  key={"survey-multiple-choice-question-form-" + question.id}
                  minChoices={question.minChoices}
                  maxChoices={question.maxChoices}
                  initialValue={submittedAnswer?.value || null}
                  options={question.options}
                  onSubmit={onQuestionAnswerSubmit}
                />
              )}
            </SurveyQuestionCard>
          </Container>
        </>
      )}
    </>
  );
}

export default SurveyQuestionPage;
