import { Card } from "react-bootstrap";
import {
  ClockFill,
  QuestionCircleFill,
  PersonCheckFill,
} from "react-bootstrap-icons";

import { primaryColor } from "../Colors";

function SurveyDetailsCard(props) {
  return (
    <Card className='text-center mt-4 mx-4 font-weight-light'>
      <Card.Header>Survey</Card.Header>
      <Card.Body>
        <Card.Title>{props.survey.title}</Card.Title>
        <Card.Text>{props.survey.description}</Card.Text>
        <hr />
        <Card.Text className='text-left'>
          <QuestionCircleFill color={primaryColor} className='mr-1' />
          Questions: {props.survey.questions.length}
        </Card.Text>
        <Card.Text className='text-left'>
          <ClockFill color={primaryColor} className='mr-1' />
          Estimated time required: {props.survey.estCompletionMinutes}
          {props.survey.estCompletionMinutes > 1 ? " minutes" : " minute"}
        </Card.Text>

        <Card.Text className='text-left'>
          <PersonCheckFill color={primaryColor} className='mr-1' />
          Submits: {props.survey.submitsCount}
        </Card.Text>
        <hr />
        {props.children}
      </Card.Body>
      <Card.Footer>Published {props.survey.publishedAt?.fromNow()}</Card.Footer>
    </Card>
  );
}

export default SurveyDetailsCard;
