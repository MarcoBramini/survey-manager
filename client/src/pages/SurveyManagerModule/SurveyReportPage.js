import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { Row } from "react-bootstrap";
import { XCircleFill, PersonCircle } from "react-bootstrap-icons";

import Button from "../../ui-components/Buttons/Button";
import ErrorToast from "../../ui-components/ErrorToast/ErrorToast";
import IconButton from "../../ui-components/Buttons/IconButton";
import InlineSearchForm from "../../ui-components/InlineSearchForm/InlineSearchForm";
import Navbar from "../../ui-components/Navbar/Navbar";
import Spinner from "../../ui-components/Spinner/Spinner";
import SurveyAttemptList from "../../ui-components/SurveyAttemptList/SurveyAttemptList";
import SurveyDetailsCard from "../../ui-components/SurveyDetailsCard/SurveyDetailsCard";
import SurveyAttemptDetailsModal from "../../ui-components/SurveyAttemptDetailsModal/SurveyAttemptDetailsModal";

import {
  getOwnedSurvey,
  getOwnedSurveyAttempts,
} from "../../services/SurveyManagerAPIClient";

import { AuthContext } from "../../context-providers/AuthContext/AuthContextProvider";
function SurveyReportPage() {
  const params = useParams();
  const history = useHistory();
  const authContext = useContext(AuthContext);

  const [isInitialized, setIsInitialized] = useState(false);
  const [isStateDirty, setIsStateDirty] = useState(true);

  const [searchValue, setSearchValue] = useState("");

  const [survey, setSurvey] = useState();
  const [surveyAttempts, setSurveyAttempts] = useState();

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState("");

  const [showSurveyAttemptDetail, setShowSurveyAttemptDetail] = useState(false);
  const [currentSurveyAttempt, setCurrentSurveyAttempt] = useState(null);
  const [currentSurveyAttemptIndex, setCurrentSurveyAttemptIndex] =
    useState(null);

  useEffect(() => {
    const loadData = () =>
      Promise.all([
        getOwnedSurvey(params.surveyID),
        getOwnedSurveyAttempts(params.surveyID, searchValue),
      ])
        .then((values) => {
          setSurvey(values[0]);
          setSurveyAttempts(values[1]);
          setIsStateDirty(false);
          setIsInitialized(true);
        })
        .catch((err) => {
          setErrorToastMessage(err.message);
          setShowErrorToast(true);
        });

    if (isStateDirty) loadData();
  }, [params.surveyID, isStateDirty, searchValue]);

  const onShowUserPanelClick = () => {
    authContext.showUserPanel();
  };

  const onSearchSubmit = (searchValue) => {
    setSearchValue(searchValue);
    setIsStateDirty(true);
  };

  const onSurveyAttemptClick = (surveyAttempt) => {
    setCurrentSurveyAttempt(surveyAttempt);
    setCurrentSurveyAttemptIndex(
      surveyAttempts.findIndex((sa) => sa.id === surveyAttempt?.id)
    );
    setShowSurveyAttemptDetail(true);
  };

  const isPreviousAttemptNavigationDisabled = () =>
    currentSurveyAttemptIndex === 0;

  const isNextAttemptNavigationDisabled = () =>
    currentSurveyAttemptIndex === surveyAttempts.length - 1;

  const onPreviousAttemptNavigation = () => {
    if (currentSurveyAttemptIndex === 0) return;
    setCurrentSurveyAttempt(surveyAttempts[currentSurveyAttemptIndex - 1]);
    setCurrentSurveyAttemptIndex((old) => old - 1);
  };

  const onNextAttemptNavigation = () => {
    if (currentSurveyAttemptIndex === surveyAttempts.length - 1) return;
    setCurrentSurveyAttempt(surveyAttempts[currentSurveyAttemptIndex + 1]);
    setCurrentSurveyAttemptIndex((old) => old + 1);
  };

  const onGoBack = () => {
    history.push("/manager");
  };

  return (
    <>
      {!isInitialized ? (
        <Spinner fullPage />
      ) : (
        <>
          <Navbar>
            <IconButton
              className='py-2'
              icon={PersonCircle}
              size='45'
              onClick={onShowUserPanelClick}
            />
          </Navbar>
          <SurveyDetailsCard survey={survey}>
            <Row className='justify-content-center'>
              <InlineSearchForm onSubmit={onSearchSubmit} />
            </Row>
            <div className='mt-3'>
              <SurveyAttemptList
                survey={survey}
                surveyAttempts={surveyAttempts}
                onClick={onSurveyAttemptClick}
              />
            </div>
            <Row className='justify-content-center mt-2'>
              <Button onClick={onGoBack} variant='danger'>
                Back <XCircleFill className='ml-1' />
              </Button>
            </Row>
          </SurveyDetailsCard>

          {currentSurveyAttempt ? (
            <SurveyAttemptDetailsModal
              show={showSurveyAttemptDetail}
              onHide={() => setShowSurveyAttemptDetail(false)}
              previousAttemptNavigationDisabled={isPreviousAttemptNavigationDisabled()}
              nextAttemptNavigationDisabled={isNextAttemptNavigationDisabled()}
              onPreviousAttemptNavigation={onPreviousAttemptNavigation}
              onNextAttemptNavigation={onNextAttemptNavigation}
              survey={survey}
              surveyAttempt={currentSurveyAttempt}
            />
          ) : null}
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

export default SurveyReportPage;
