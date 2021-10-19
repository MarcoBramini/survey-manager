import { Container, Row, Col } from "react-bootstrap";
import { X, Check2Circle, ChevronUp, ChevronDown } from "react-bootstrap-icons";

import IconButton from "../Buttons/IconButton";

function QuestionOptionEntry(props) {
  return (
    <Row>
      <Container className='m-1 py-2 px-0 border rounded d-flex align-items-center justify-content-between'>
        <Col xs='1' className='pl-2'>
          <Check2Circle />
        </Col>
        <Col className='pl-2 pr-2'>
          <span>{props.option}</span>
        </Col>
        <Col className='p-0 text-center ' xs='1' sm='3'>
          <IconButton
            icon={ChevronUp}
            disabled={!props.onMoveUpOption}
            className='m-1'
            onClick={props.onMoveUpOption}
          />
          <IconButton
            icon={ChevronDown}
            disabled={!props.onMoveDownOption}
            className='m-1'
            onClick={props.onMoveDownOption}
          />
        </Col>
        <Col className='p-0 text-right' xs='2' sm='1'>
          <IconButton
            icon={X}
            variant='danger'
            className='m-1'
            onClick={props.onDeleteOption}
          />
        </Col>
      </Container>
    </Row>
  );
}

export default QuestionOptionEntry;
