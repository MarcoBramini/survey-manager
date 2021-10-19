import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import {
  Form,
  Card,
  Container,
  Row,
  Col,
  Modal,
  Alert,
  Spinner as SpinnerBootstrap,
} from "react-bootstrap";
import {
  XCircleFill,
  CheckCircleFill,
  PersonCircle,
} from "react-bootstrap-icons";

import Button from "../../ui-components/Buttons/Button";
import CreateSurveyForm from "../../ui-components/CreateSurveyForm/CreateSurveyForm";
import CreateQuestionForm from "../../ui-components/CreateQuestionForm/CreateQuestionForm";
import ErrorToast from "../../ui-components/ErrorToast/ErrorToast";
import IconButton from "../../ui-components/Buttons/IconButton";
import LoadingOverlay from "../../ui-components/LoadingOverlay/LoadingOverlay";
import Navbar from "../../ui-components/Navbar/Navbar";
import Spinner from "../../ui-components/Spinner/Spinner";
import SurveyQuestionsEditor from "../../ui-components/CreateQuestionForm/SurveyQuestionEditor";

import {
  createSurvey,
  createQuestion,
  deleteQuestion,
  getOwnedSurvey,
  updateQuestion,
  updateSurvey,
  positionDownQuestion,
  positionUpQuestion,
} from "../../services/SurveyManagerAPIClient";
import Question, {
  QuestionType,
  QuestionUIStatus,
} from "../../services/models/question";
import Survey from "../../services/models/survey";

import { AuthContext } from "../../context-providers/AuthContext/AuthContextProvider";
import SurveyService from "../../services/SurveyService";
function CreateSurveyPage() {
  const authContext = useContext(AuthContext);
  const history = useHistory();
  const params = useParams();

  const [isInitialized, setIsInitialized] = useState(false);
  const [isPublishSurveyLoading, setIsPublishSurveyLoading] = useState(false);
  const [isStateReloading, setIsStateReloading] = useState(false);
  const [isStateDirty, setIsStateDirty] = useState(true);

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState("");

  const [survey, setSurvey] = useState({ questions: [] });

  const [formErrorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!params.surveyID) {
      setIsInitialized(true);
      setIsStateDirty(false);
      return;
    }

    const loadSurvey = () => {
      getOwnedSurvey(params.surveyID)
        .then((survey) => {
          setSurvey(survey);
          setIsInitialized(true);
          setIsStateDirty(false);
          setIsStateReloading(false);
        })
        .catch((err) => {
          setErrorToastMessage(err.message);
          setShowErrorToast(true);
        });
    };

    if (isStateDirty) loadSurvey();
  }, [params.surveyID, isStateDirty]);

  const onShowUserPanelClick = () => {
    authContext.showUserPanel();
  };

  /* CreateSurvey Form */
  const onCreateSurveyFormSubmit = (createdOrEditedSurveyObject) => {
    return new Promise((resolve, reject) => {
      const createdOrEditedSurvey = Survey.fromJSON(
        createdOrEditedSurveyObject
      );

      if (!createdOrEditedSurvey.id) {
        // Handle survey create
        createSurvey(
          createdOrEditedSurvey.title,
          createdOrEditedSurvey.description,
          createdOrEditedSurvey.isPublished,
          createdOrEditedSurvey.estCompletionMinutes
        )
          .then((newSurveyID) => {
            history.replace("/manager/surveys/create/" + newSurveyID);
            setIsStateDirty(true);

            // This is used to prevent showing a flash loading screen for faster connections
            setTimeout(() => {
              setIsStateDirty((old) => {
                if (old) setIsStateReloading(true);
                return old;
              });
            }, 100);
            resolve();
          })
          .catch((err) => {
            setErrorMessage(err.message);
            reject(err);
          });
      } else {
        // Handle survey update
        updateSurvey(createdOrEditedSurvey)
          .then(() => {
            setIsStateDirty(true);

            // This is used to prevent showing a flash loading screen for faster connections
            setTimeout(() => {
              setIsStateDirty((old) => {
                if (old) setIsStateReloading(true);
                return old;
              });
            }, 100);
            resolve();
          })
          .catch((err) => {
            setErrorMessage(err.message);
            reject(err);
          });
      }
    });
  };

  /* CreateQuestion Form */
  const [showCreateQuestionModal, setShowCreateQuestionModal] = useState(false);
  const [questionType, setQuestionType] = useState(null);
  const [questionToEdit, setQuestionToEdit] = useState(null);

  const onMoveUpQuestion = (questionToMove) => {
    if (SurveyService.isAnyQuestionUpdating(survey)) {
      return;
    }
    setSurvey((old) => {
      let questions = [...old.questions];
      SurveyService.positionUpQuestion(questions, questionToMove.id);
      SurveyService.setQuestionUIStatusByID(
        questions,
        questionToMove.id,
        QuestionUIStatus.UPDATING
      );
      SurveyService.setQuestionUIStatusByPosition(
        questions,
        questionToMove.position + 1,
        QuestionUIStatus.UPDATING
      );

      return {
        ...old,
        questions: questions,
      };
    });

    positionUpQuestion(survey.id, questionToMove.id)
      .then(() => {
        setIsStateDirty(true);
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
  };

  const onMoveDownQuestion = (questionToMove) => {
    if (SurveyService.isAnyQuestionUpdating(survey)) return;
    setSurvey((old) => {
      let questions = [...old.questions];
      SurveyService.positionDownQuestion(questions, questionToMove.id);
      SurveyService.setQuestionUIStatusByID(
        questions,
        questionToMove.id,
        QuestionUIStatus.UPDATING
      );
      SurveyService.setQuestionUIStatusByPosition(
        questions,
        questionToMove.position - 1,
        QuestionUIStatus.UPDATING
      );

      return {
        ...old,
        questions: questions,
      };
    });

    positionDownQuestion(survey.id, questionToMove.id)
      .then(() => {
        setIsStateDirty(true);
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
  };

  const onEditQuestion = (question) => {
    if (SurveyService.isAnyQuestionUpdating(survey)) return;

    setQuestionToEdit(question);
    setQuestionType(question.type);
    setShowCreateQuestionModal(true);
    setErrorMessage("");
  };

  const onDeleteQuestion = (questionToDelete) => {
    if (SurveyService.isAnyQuestionUpdating(survey)) return;

    setSurvey((old) => {
      let questions = [...old.questions];
      SurveyService.setQuestionUIStatusByID(
        questions,
        questionToDelete.id,
        QuestionUIStatus.DELETING
      );

      return {
        ...old,
        questions: questions,
      };
    });

    deleteQuestion(questionToDelete.id, survey.id)
      .then(() => setIsStateDirty(true))
      .catch((err) => {
        setErrorMessage(err.message);
      });
  };

  const onCreateOpenQuestion = () => {
    setQuestionType(QuestionType.OPEN);
    setShowCreateQuestionModal(true);
    setErrorMessage("");
  };

  const onCreateMultipleChoiceQuestion = () => {
    setQuestionType(QuestionType.MULTIPLE_CHOICE);
    setShowCreateQuestionModal(true);
    setErrorMessage("");
  };

  const onCreateQuestionModalClose = () => {
    setShowCreateQuestionModal(false);
    setQuestionToEdit(null);
  };

  const onCreateQuestionModalSubmit = (createdOrEditedQuestionObject) => {
    const createdOrEditedQuestion = Question.fromJSON(
      createdOrEditedQuestionObject
    );

    if (!createdOrEditedQuestion.id) {
      // Handle question creation
      createdOrEditedQuestion.uiStatus = QuestionUIStatus.CREATING;
      setSurvey((old) => {
        let questions = [...old.questions, createdOrEditedQuestion];

        return {
          ...old,
          questions: questions,
        };
      });

      createQuestion(
        survey.id,
        createdOrEditedQuestion.title,
        createdOrEditedQuestion.type,
        createdOrEditedQuestion.isOptional,
        createdOrEditedQuestion.maxAnswerLength,
        createdOrEditedQuestion.minChoices,
        createdOrEditedQuestion.maxChoices,
        createdOrEditedQuestion.options
      )
        .then(() => setIsStateDirty(true))
        .catch((err) => setErrorMessage(err.message));
    } else {
      // Handle question update
      setSurvey((old) => {
        let questions = [...old.questions];
        SurveyService.setQuestionUIStatusByID(
          questions,
          createdOrEditedQuestion.id,
          QuestionUIStatus.UPDATING
        );

        return {
          ...old,
          questions: questions,
        };
      });

      updateQuestion(survey.id, createdOrEditedQuestion)
        .then(() => setIsStateDirty(true))
        .catch((err) => setErrorMessage(err.message));
    }
    setShowCreateQuestionModal(false);
    setQuestionToEdit(null);
  };

  const onCancel = () => {
    history.push("/manager");
  };

  const onSurveyPublish = () => {
    const errorMessage = SurveyService.validateForPublish(survey);
    if (errorMessage) {
      setErrorMessage(errorMessage);
      return;
    }

    setIsPublishSurveyLoading(true);
    updateSurvey({ ...survey, isPublished: true })
      .then(() => {
        history.push("/manager");
      })
      .catch((err) => setErrorMessage(err.message));
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
          <Container className='mt-2'>
            <Row className='justify-content-center'>
              <Col md='9' lg='8'>
                <Card>
                  {isStateReloading ? <LoadingOverlay /> : null}

                  <Card.Header className='text-center'>
                    <h3 className='font-weight-light'>Create your survey</h3>
                  </Card.Header>
                  <Card.Body>
                    <CreateSurveyForm
                      survey={survey}
                      onSubmit={onCreateSurveyFormSubmit}
                    />
                    <hr />
                    <Form.Group className='justify-content-center'>
                      <Form.Label className='font-weight-light'>
                        Questions
                      </Form.Label>
                      <SurveyQuestionsEditor
                        disabled={!survey.id}
                        questions={SurveyService.getSortedQuestionsByPosition(
                          survey
                        )}
                        isMoveUpQuestionDisabled={(question) =>
                          !SurveyService.canPositionUpQuestion(question)
                        }
                        onMoveUpQuestion={onMoveUpQuestion}
                        isMoveDownQuestionDisabled={(question) =>
                          !SurveyService.canPositionDownQuestion(
                            survey,
                            question
                          )
                        }
                        onMoveDownQuestion={onMoveDownQuestion}
                        onEditQuestion={onEditQuestion}
                        onDeleteQuestion={onDeleteQuestion}
                        onCreateOpenQuestion={onCreateOpenQuestion}
                        onCreateMultipleChoiceQuestion={
                          onCreateMultipleChoiceQuestion
                        }
                      />
                    </Form.Group>

                    <Container>
                      <Alert
                        variant='danger'
                        className={`mt-3 py-1 text-center 
                          ${formErrorMessage ? " visible" : " invisible"}`}>
                        {formErrorMessage || "errorPlaceholder"}
                      </Alert>
                    </Container>

                    <Container className='px-3 mt-2 '>
                      <Row className='justify-content-around'>
                        <Button
                          className='m-1'
                          variant='danger'
                          onClick={onCancel}>
                          Back
                          <XCircleFill className='ml-1' />
                        </Button>
                        <Button
                          className='m-1'
                          onClick={onSurveyPublish}
                          variant={formErrorMessage ? "danger" : "primary"}>
                          Publish Survey and Exit
                          {isPublishSurveyLoading ? (
                            <SpinnerBootstrap
                              animation='border'
                              variant='light'
                              size='sm'
                              className='ml-1'
                            />
                          ) : (
                            <CheckCircleFill className='ml-1' />
                          )}
                        </Button>
                      </Row>
                    </Container>
                  </Card.Body>
                  <Card.Footer />
                </Card>
              </Col>
            </Row>
          </Container>

          <Container>
            <Modal centered show={showCreateQuestionModal} onHide={() => {}}>
              <Modal.Header>
                <Modal.Title>{`${questionToEdit ? "Update" : "Create"} ${
                  questionType === QuestionType.OPEN
                    ? "Open"
                    : "Multiple Choice"
                } Question`}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <CreateQuestionForm
                  questionType={questionType}
                  questionToEdit={questionToEdit}
                  onSubmit={onCreateQuestionModalSubmit}
                  onCancel={onCreateQuestionModalClose}
                  maxMultipleChoiceQuestionOptions={10}
                />
              </Modal.Body>
            </Modal>
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

export default CreateSurveyPage;
