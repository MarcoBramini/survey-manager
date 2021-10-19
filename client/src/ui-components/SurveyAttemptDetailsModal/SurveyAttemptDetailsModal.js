import { Row, Modal, Container, Col } from "react-bootstrap";
import {
  QuestionCircleFill,
  ClockFill,
  PersonFill,
  ClockHistory,
  ArrowRightShort,
  ArrowLeftShort,
  XCircleFill,
} from "react-bootstrap-icons";

import Button from "../Buttons/Button";
import IconButton from "../Buttons/IconButton";
import { primaryColor } from "../Colors";

import SurveyAttemptService from "../../services/SurveyAttemptService";
import SurveyService from "../../services/SurveyService";

function SurveyAttemptDetailsModal(props) {
  return (
    <Modal centered show={props.show} onHide={props.onHide}>
      <Modal.Header>
        <Col xs='2' className='align-self-center text-left'>
          <IconButton
            disabled={props.previousAttemptNavigationDisabled}
            icon={ArrowLeftShort}
            size='30'
            onClick={props.onPreviousAttemptNavigation}
          />
        </Col>
        <Col className='align-self-center text-center'>
          <Modal.Title>{props.survey.title}</Modal.Title>
        </Col>
        <Col xs='2' className='align-self-center text-right'>
          <IconButton
            disabled={props.nextAttemptNavigationDisabled}
            icon={ArrowRightShort}
            size='30'
            onClick={props.onNextAttemptNavigation}
          />
        </Col>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <PersonFill color={primaryColor} className='mr-1' />
            <span className='font-weight-light'>Name: </span>
            <span>{props.surveyAttempt.userFullName}</span>
          </Col>
        </Row>
        <Row className='mt-2'>
          <Col>
            <QuestionCircleFill color={primaryColor} className='mr-1' />
            <span className='font-weight-light'>Answers: </span>
            <span>
              {SurveyAttemptService.getAnswersQuestionsRatioString(
                props.surveyAttempt,
                props.survey
              )}
            </span>
          </Col>
        </Row>
        <Row className='mt-2'>
          <Col>
            <ClockFill color={primaryColor} className='mr-1' />
            <span className='font-weight-light'>Submitted: </span>
            <span>
              {SurveyAttemptService.getSubmittedAtFormattedString(
                props.surveyAttempt
              )}
            </span>
          </Col>
        </Row>
        <Row className='mt-2'>
          <Col>
            <ClockHistory color={primaryColor} className='mr-1' />
            <span className='font-weight-light'>Completion time: </span>
            <span>
              {SurveyAttemptService.getCompletionTimeString(
                props.surveyAttempt
              )}
            </span>
          </Col>
        </Row>

        <hr />

        {SurveyService.getSortedQuestionsByPosition(props.survey).map(
          (question) => (
            <SurveyAttemptAnswer
              key={`question-answer-${question.id}`}
              question={question}
              answerValue={SurveyAttemptService.getQuestionAnswerString(
                props.surveyAttempt,
                question.id,
                question.type
              )}
            />
          )
        )}
        <hr />
        <Row className='justify-content-center mt-2'>
          <Button onClick={props.onHide} variant='danger'>
            Close <XCircleFill className='ml-1' />
          </Button>
        </Row>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}

function SurveyAttemptAnswer(props) {
  return (
    <Container className='mt-3 '>
      <Row className='border bg-info text-white rounded-top p-2 font-weight-light'>
        {props.question.position}. {props.question.title}
      </Row>
      <Row className='border border-top-0 rounded-bottom p-2'>
        {props.answerValue || (
          <span className='text-muted'>No answer provided</span>
        )}
      </Row>
    </Container>
  );
}

export default SurveyAttemptDetailsModal;
