import { Container, Row, Col } from "react-bootstrap";
import {
  X,
  InputCursorText,
  Check2Circle,
  Gear,
  ChevronUp,
  ChevronDown,
} from "react-bootstrap-icons";

import IconButton from "../Buttons/IconButton";
import { QuestionType, QuestionUIStatus } from "../../services/models/question";

import "./SurveyQuestionEntry.css";
import LoadingOverlay from "../LoadingOverlay/LoadingOverlay";
function SurveyQuestionEntry(props) {
  return (
    <Row>
      <Container className='m-1 py-2 px-0 border rounded d-flex align-items-center justify-content-between position-relative'>
        {props.question.uiStatus === QuestionUIStatus.CREATING ? (
          <LoadingOverlay />
        ) : null}
        {props.question.uiStatus === QuestionUIStatus.UPDATING ? (
          <LoadingOverlay variant='warning' />
        ) : null}
        {props.question.uiStatus === QuestionUIStatus.DELETING ? (
          <LoadingOverlay variant='danger' />
        ) : null}

        <Col xs='0' className='pl-2'>
          {props.question.type === QuestionType.OPEN ? (
            <InputCursorText />
          ) : (
            <Check2Circle />
          )}
        </Col>
        <Col className='pl-2 pr-2'>
          <span className='sqe-question-title'>{props.question.title}</span>
        </Col>
        <Col xs='2' className='p-0 text-right '>
          <span className=' p-0'>
            <IconButton
              icon={ChevronUp}
              disabled={props.isMoveUpQuestionDisabled}
              className='m-1'
              onClick={props.onMoveUpQuestion}
            />
            <IconButton
              icon={ChevronDown}
              disabled={props.isMoveDownQuestionDisabled}
              className='m-1'
              onClick={props.onMoveDownQuestion}
            />
          </span>
        </Col>
        <Col xs='2' className='p-0 text-right '>
          <IconButton
            icon={Gear}
            className='m-1'
            onClick={props.onEditQuestion}
          />
          <IconButton
            icon={X}
            variant='danger'
            className='m-1'
            onClick={props.onDeleteQuestion}
          />
        </Col>
      </Container>
    </Row>
  );
}

export default SurveyQuestionEntry;
