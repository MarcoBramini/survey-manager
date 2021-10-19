import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";

import { Container, Row } from "react-bootstrap";
import {
  StopCircleFill,
  CheckCircleFill,
  XCircleFill,
} from "react-bootstrap-icons";

import Button from "../../ui-components/Buttons/Button";
import ErrorToast from "../../ui-components/ErrorToast/ErrorToast";
import Navbar from "../../ui-components/Navbar/Navbar";
import Spinner from "../../ui-components/Spinner/Spinner";
import SurveyDetailsCard from "../../ui-components/SurveyDetailsCard/SurveyDetailsCard";

import { getSurvey } from "../../services/SurveyManagerAPIClient";

import { AuthContext } from "../../context-providers/AuthContext/AuthContextProvider";
import { SurveyAttemptContext } from "../../context-providers/SurveyAttemptProvider";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

function SurveyPage() {
  const params = useParams();
  const history = useHistory();
  const authContext = useContext(AuthContext);
  const surveyAttemptContext = useContext(SurveyAttemptContext);

  const [isInitialized, setIsInitialized] = useState(true);

  const [survey, setSurvey] = useState();

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState("");

  useEffect(() => {
    // Go back to user identification if no user name is set
    if (!authContext.userFullName) {
      history.push("/user-id", { redirectPath: "/surveys/" + params.surveyID });
    }

    const loadSurvey = () =>
      getSurvey(params.surveyID)
        .then((survey) => {
          setSurvey(survey);
          setIsInitialized(false);
        })
        .catch((err) => {
          setErrorToastMessage(err.message);
          setShowErrorToast(true);
        });

    loadSurvey();
  }, [params.surveyID, authContext.userFullName, history]);

  const onStartSurveyAttempt = () => {
    surveyAttemptContext.startSurveyAttempt(survey, authContext.userFullName);

    history.push("/surveys/" + survey.id + "/questions/1");
  };

  const onResumeSurveyAttempt = () => {
    history.push("/surveys/" + survey.id + "/questions/1");
  };

  const onGoBack = () => {
    history.push("/discover");
  };

  return (
    <>
      {isInitialized ? (
        <Spinner fullPage />
      ) : (
        <>
          <Navbar />
          <Container>
            <Row className='justify-content-center'>
              <SurveyDetailsCard survey={survey}>
                {surveyAttemptContext.canResumePreviousAttempt(
                  params.surveyID,
                  authContext.userFullName
                ) ? (
                  <>
                    <Row className='justify-content-center'>
                      <span>
                        A previous attempt is still in progress.
                        <br /> Do you want to resume it?
                      </span>
                    </Row>
                    <Row className='justify-content-center mt-2'>
                      <Button
                        onClick={onStartSurveyAttempt}
                        className='mr-2'
                        variant='danger'>
                        Start Over <StopCircleFill className='ml-1' />
                      </Button>
                      <Button onClick={onResumeSurveyAttempt} className='mr-2'>
                        Resume <CheckCircleFill className='ml-1' />
                      </Button>
                    </Row>
                  </>
                ) : (
                  <Button onClick={onStartSurveyAttempt}>
                    Start <CheckCircleFill className='ml-1' />
                  </Button>
                )}
                <hr />
                <Row className='justify-content-center mt-2'>
                  <Button onClick={onGoBack} variant='danger'>
                    Back <XCircleFill className='ml-1' />
                  </Button>
                </Row>
              </SurveyDetailsCard>
            </Row>
          </Container>
        </>
      )}

      <ErrorToast
        show={showErrorToast}
        onClose={() => setShowErrorToast(false)}
        title='Error'
        message={errorToastMessage}
      />
    </>
  );
}

export default SurveyPage;
