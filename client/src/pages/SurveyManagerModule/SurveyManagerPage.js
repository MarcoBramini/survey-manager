import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { Container, Accordion, Card, Row } from "react-bootstrap";
import {
  CalendarPlusFill,
  CardHeading,
  CaretDownFill,
  PersonCircle,
  PersonPlusFill,
} from "react-bootstrap-icons";

import CreateSurveyCard from "../../ui-components/SurveyCardGrid/CreateSurveyCard";
import ErrorToast from "../../ui-components/ErrorToast/ErrorToast";
import IconButton from "../../ui-components/Buttons/IconButton";
import OrderBar from "../../ui-components/OrderBar/OrderBar";
import Navbar from "../../ui-components/Navbar/Navbar";
import Spinner from "../../ui-components/Spinner/Spinner";
import SurveySummaryCard from "../../ui-components/SurveyCardGrid/SurveySummaryCard";
import SurveyCardGrid from "../../ui-components/SurveyCardGrid/SurveyCardGrid";
import UnpublishedSurveyCard from "../../ui-components/SurveyCardGrid/UnpublishedSurveyCard";
import PromptModal from "../../ui-components/PromptModal/PromptModal";

import {
  deleteSurvey,
  getOwnedSurveys,
  updateSurvey,
} from "../../services/SurveyManagerAPIClient";
import SurveyService from "../../services/SurveyService";

import { AuthContext } from "../../context-providers/AuthContext/AuthContextProvider";

import dayjs from "dayjs";

import "./SurveyManagerPage.css";
function SurveyManagerPage() {
  const history = useHistory();
  const authContext = useContext(AuthContext);

  const [isInitialized, setIsInitialized] = useState(false);
  const [isStateDirty, setIsStateDirty] = useState(true);

  const [orderByValue, setOrderByValue] = useState("-publishedAt");

  const [unpublishedSurveys, setUnpublishedSurveys] = useState([]);
  const [ownedSurveys, setOwnedSurveys] = useState([]);

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState("");

  const [showPrompt, setShowPrompt] = useState(false);
  const [promptConfirmCallback, setPromptConfirmCallback] = useState(null);
  const [promptCancelCallback, setPromptCancelCallback] = useState(null);
  const [promptTitle, setPromptTitle] = useState("");
  const [promptMessage, setPromptMessage] = useState("");

  useEffect(() => {
    const refreshTimerID = setInterval(() => setIsStateDirty(true), 5000);
    return () => clearInterval(refreshTimerID);
  }, []);

  useEffect(() => {
    const loadSurveys = () =>
      getOwnedSurveys(null, orderByValue)
        .then((surveys) => {
          setUnpublishedSurveys([
            ...surveys.filter((survey) => !survey.isPublished),
          ]);
          setOwnedSurveys([...surveys.filter((survey) => survey.isPublished)]);
          setIsStateDirty(false);
          setIsInitialized(true);
        })
        .catch((err) => {
          setErrorToastMessage(err.message);
          setShowErrorToast(true);
        });

    if (isStateDirty) loadSurveys();
  }, [isStateDirty, orderByValue]);

  const onShowUserPanelClick = () => {
    authContext.showUserPanel();
  };

  const onCreateSurvey = () => {
    history.push("/manager/surveys/create/");
  };

  const onEditSurvey = (survey) => {
    history.push(`/manager/surveys/create/${survey.id}`);
  };

  const onDeleteSurvey = (survey) =>
    new Promise((resolve, reject) => {
      setPromptTitle("Delete");
      setPromptMessage("Are you sure you want to delete this survey?");

      const promptConfirmCallback = () => {
        setShowPrompt(false);
        return deleteSurvey(survey.id)
          .then(() => {
            // Delete item from local state
            if (survey.isPublished) {
              setOwnedSurveys((old) => old.filter((s) => s.id !== survey.id));
            } else {
              setUnpublishedSurveys((old) =>
                old.filter((s) => s.id !== survey.id)
              );
            }
            setIsStateDirty(true);
            resolve();
          })
          .catch((err) => {
            setErrorToastMessage("An error occurred deleting the survey");
            showErrorToast(true);
            reject(err);
          });
      };

      const promptCancelCallback = () => {
        setShowPrompt(false);
        setPromptConfirmCallback(null);
        setPromptCancelCallback(null);
        reject();
      };

      setPromptConfirmCallback(() => promptConfirmCallback);

      setPromptCancelCallback(() => promptCancelCallback);

      setShowPrompt(true);
    });

  const onPublishSurvey = (survey) =>
    new Promise((resolve, reject) => {
      setPromptTitle("Publish");
      setPromptMessage("Are you sure you want to publish this survey?");

      const promptConfirmCallback = () => {
        setShowPrompt(false);
        survey.isPublished = true;
        survey.publishedAt = dayjs();

        return updateSurvey(survey)
          .then(() => {
            // Move item from local state (unpublished -> owned)
            setUnpublishedSurveys((old) =>
              old.filter((s) => s.id !== survey.id)
            );
            setOwnedSurveys((old) => [...old, survey]);

            setIsStateDirty(true);
            resolve();
          })
          .catch((err) => {
            setErrorToastMessage("An error occurred publishing the survey");
            showErrorToast(true);
            reject(err);
          });
      };

      const promptCancelCallback = () => {
        setShowPrompt(false);
        setPromptConfirmCallback(null);
        setPromptCancelCallback(null);
        reject();
      };

      setPromptConfirmCallback(() => promptConfirmCallback);

      setPromptCancelCallback(() => promptCancelCallback);

      setShowPrompt(true);
    });

  const onViewSurveyReport = (survey) => {
    history.push(`/manager/surveys/${survey.id}/report`);
  };

  const onOrderByChange = (value) => {
    setOrderByValue(value);
    setIsStateDirty(true);
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
          <Container>
            <Accordion defaultActiveKey='0' className='mt-2'>
              <Card>
                <Accordion.Toggle
                  className='cursor-pointer'
                  as={Card.Header}
                  variant='link'
                  eventKey='0'>
                  <h3 className='mt-3 text-center font-weight-light'>
                    Unpublished Surveys
                    <CaretDownFill size='15' className='ml-2' />
                  </h3>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey='0'>
                  <SurveyCardGrid>
                    <CreateSurveyCard onClick={onCreateSurvey} />
                    {unpublishedSurveys.map((survey) => (
                      <UnpublishedSurveyCard
                        key={"unpublished-survey-card-" + survey.id}
                        survey={survey}
                        onClick={() => onEditSurvey(survey)}
                        onDelete={() => onDeleteSurvey(survey)}
                        publishDisabled={
                          !!SurveyService.validateForPublish(survey)
                        }
                        onPublish={() => onPublishSurvey(survey)}
                      />
                    ))}
                  </SurveyCardGrid>
                </Accordion.Collapse>
              </Card>
            </Accordion>{" "}
            <Accordion defaultActiveKey='1' className='mt-2'>
              <Card>
                <Accordion.Toggle
                  className='cursor-pointer'
                  as={Card.Header}
                  variant='link'
                  eventKey='1'>
                  <h3 className='mt-3 text-center font-weight-light'>
                    Owned Surveys
                    <CaretDownFill size='15' className='ml-2' />
                  </h3>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey='1'>
                  <>
                    <OrderBar
                      className='mt-2 pr-5'
                      subjectIconMap={{
                        publishedAt: CalendarPlusFill,
                        title: CardHeading,
                        submitsCount: PersonPlusFill,
                      }}
                      onChange={onOrderByChange}
                    />
                    {ownedSurveys.length === 0 ? (
                      <Container>
                        <Row className='justify-content-center my-5'>
                          <h4 className='font-weight-light text-muted'>
                            You didn't publish any survey yet
                          </h4>
                        </Row>
                      </Container>
                    ) : (
                      <SurveyCardGrid>
                        {ownedSurveys.map((survey) => (
                          <SurveySummaryCard
                            key={"survey-summary-card-" + survey.id}
                            survey={survey}
                            onClick={() => onViewSurveyReport(survey)}
                            onDelete={() => onDeleteSurvey(survey)}
                          />
                        ))}
                      </SurveyCardGrid>
                    )}
                  </>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Container>

          <PromptModal
            showPrompt={showPrompt}
            promptTitle={promptTitle}
            promptMessage={promptMessage}
            promptCancelCallback={promptCancelCallback}
            promptConfirmCallback={promptConfirmCallback}
          />
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

export default SurveyManagerPage;
