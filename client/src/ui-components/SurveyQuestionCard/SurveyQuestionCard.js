import { Card, Row, Col } from "react-bootstrap";
import { ArrowLeftShort, ArrowRightShort, Check } from "react-bootstrap-icons";

import IconButton from "../Buttons/IconButton";

import "./SurveyQuestionCard.css";
function SurveyQuestionCard(props) {
  const onNextQuestionNavigation = () => {
    props.onNextQuestionNavigation();
  };

  const onPreviousQuestionNavigation = () => {
    props.onPreviousQuestionNavigation();
  };

  return (
    <Card className='text-center font-weight-light'>
      <Card.Header>Question n°{props.question.position}</Card.Header>
      <Card.Body>
        <Card.Title>{props.question.title}</Card.Title>
        <hr />
        <Row>
          <Col xs='1' className='d-none d-sm-block align-self-center px-0'>
            <IconButton
              className='navigation-button '
              icon={ArrowLeftShort}
              size='40'
              onClick={onPreviousQuestionNavigation}
            />
          </Col>
          {/* SurveyQuestionCard must have as child one between SurveyOpenQuestionForm
           and SurveyMultipleChoiceQuestionForm. */}
          <Col>{props.children}</Col>

          <Col xs='1' className='d-none d-sm-block  align-self-center px-0'>
            <IconButton
              className='navigation-button '
              icon={props.isLastQuestion ? Check : ArrowRightShort}
              size='40'
              onClick={onNextQuestionNavigation}
            />
          </Col>
        </Row>
        <Row className='d-sm-none justify-content-around '>
          <IconButton
            className='navigation-button '
            icon={ArrowLeftShort}
            size='40'
            onClick={onPreviousQuestionNavigation}
          />

          <IconButton
            className='navigation-button '
            icon={props.isLastQuestion ? Check : ArrowRightShort}
            size='40'
            onClick={onNextQuestionNavigation}
          />
        </Row>
      </Card.Body>
      <Card.Footer>{props.footer}</Card.Footer>
    </Card>
  );
}

export default SurveyQuestionCard;
