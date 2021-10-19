import { Container, Row, Col } from "react-bootstrap";

import "./SurveyAttemptListHeader.css";
function SurveyAttemptListHeader() {
  return (
    <>
      <Container className='survey-attempt-list-header border rounded text-white'>
        <Row className='p-3'>
          <Col
            xs='5'
            md='3'
            className='border-right d-flex align-items-center justify-content-center'>
            Full Name
          </Col>
          <Col
            xs='5'
            md='4'
            className='d-flex align-items-center justify-content-center'>
            Submission Time
          </Col>
          <Col
            md='2'
            className='border-left border-right d-none align-items-center justify-content-center d-md-flex'>
            Answers
          </Col>
          <Col
            md='3'
            className='d-none align-items-center justify-content-center d-md-flex'>
            Completion Time
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default SurveyAttemptListHeader;
