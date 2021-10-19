import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { Container, Row, Alert } from "react-bootstrap";
import { CheckCircleFill, XCircleFill } from "react-bootstrap-icons";

import SurveyAttemptDetailsCard from "../../ui-components/SurveyAttemptDetailsCard/SurveyAttemptDetailsCard";
import Navbar from "../../ui-components/Navbar/Navbar";
import Button from "../../ui-components/Buttons/Button";
import Spinner from "../../ui-components/Spinner/Spinner";

import { submitSurveyAttempt } from "../../services/SurveyManagerAPIClient";
import SurveyAttemptService from "../../services/SurveyAttemptService";
import SurveyService from "../../services/SurveyService";

import { AuthContext } from "../../context-providers/AuthContext/AuthContextProvider";
import { SurveyAttemptContext } from "../../context-providers/SurveyAttemptProvider";
function SurveySubmitPage() {
  const history = useHistory();

  const authContext = useContext(AuthContext);
  const surveyAttemptContext = useContext(SurveyAttemptContext);

  const [isInitialized, setIsInitialized] = useState(false);

  const [survey, setSurvey] = useState();
  const [surveyAttempt, setSurveyAttempt] = useState();

  const [errorMessage, setErrorMessage] = useState("");

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
      setSurvey(surveyAttemptContext.currentSurvey);
      setSurveyAttempt(surveyAttemptContext.currentSurveyAttempt);
      setIsInitialized(true);
    };

    loadData();
  }, [
    authContext.userFullName,
    history,
    surveyAttemptContext.currentSurvey,
    surveyAttemptContext.currentSurveyAttempt,
  ]);

  const onSubmitSurveyAttempt = () => {
    const errorMessage = SurveyAttemptService.validateAttemptForSubmit(
      SurveyService.getSortedQuestionsByPosition(survey),
      surveyAttempt
    );
    if (errorMessage) {
      setErrorMessage(errorMessage);
      return;
    }

    submitSurveyAttempt(
      surveyAttempt.surveyID,
      surveyAttempt.userFullName,
      surveyAttempt.startedAt,
      surveyAttempt.answers
    )
      .then(() => {
        history.push("/discover");
        surveyAttemptContext.resetSurveyAttempt();
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
  };

  const onGoBack = () => {
    history.goBack();
  };

  return (
    <>
      {!isInitialized ? (
        <Spinner fullPage />
      ) : (
        <>
          <Navbar />
          <Container>
            <Row className='justify-content-center'>
              <SurveyAttemptDetailsCard
                userFullName={authContext.userFullName}
                survey={survey}
                surveyAttempt={surveyAttempt}>
                <Alert
                  variant='danger'
                  className={
                    " mt-2 mb-0 py-1" +
                    (errorMessage ? " visible" : " invisible")
                  }>
                  {errorMessage || "errorPlaceholder"}
                </Alert>
                <Button className='mt-3' variant='danger' onClick={onGoBack}>
                  Back <XCircleFill className='ml-1' />
                </Button>
                <Button className='mt-3 ml-2' onClick={onSubmitSurveyAttempt}>
                  Submit <CheckCircleFill className='ml-1' />
                </Button>
              </SurveyAttemptDetailsCard>
            </Row>
          </Container>
        </>
      )}
    </>
  );
}

export default SurveySubmitPage;
