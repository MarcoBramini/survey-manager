import { Container, Row, Col } from "react-bootstrap";

import SurveyAttemptService from "../../services/SurveyAttemptService";

import "./SurveyAttemptListEntry.css";
function SurveyAttemptListEntry(props) {
  return (
    <>
      <Container
        className={`border rounded survey-attempt-list-entry ${props.className}`}
        onClick={props.onClick}>
        <Row className='p-2'>
          <Col
            xs='5'
            md='3'
            className='border-right d-flex align-items-center justify-content-center'>
            {props.surveyAttempt.userFullName}
          </Col>
          <Col
            xs='5'
            md='4'
            className='d-flex align-items-center justify-content-center'>
            {SurveyAttemptService.getSubmittedAtFormattedString(
              props.surveyAttempt
            )}
          </Col>
          <Col
            md='2'
            className='border-left border-right d-none align-items-center justify-content-center d-md-flex'>
            {SurveyAttemptService.getAnswersQuestionsRatioString(
              props.surveyAttempt,
              props.survey
            )}
          </Col>
          <Col
            md='3'
            className='d-none align-items-center justify-content-center d-md-flex'>
            {SurveyAttemptService.getCompletionTimeString(props.surveyAttempt)}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default SurveyAttemptListEntry;
