import { useState } from "react";

import { Card, Row } from "react-bootstrap";
import {
  ArrowRightShort,
  QuestionCircleFill,
  CalendarPlusFill,
  ClockFill,
  Check,
  X,
} from "react-bootstrap-icons";

import IconButton from "../Buttons/IconButton";
import LoadingOverlay from "../LoadingOverlay/LoadingOverlay";
import { primaryColor } from "../Colors";

import "./SurveyCard.css";
function UnpublishedSurveyCard(props) {
  const [isLoading, setIsLoading] = useState(false);

  const onPublish = () => {
    setIsLoading(true);
    props.onPublish().catch(() => setIsLoading(false));
  };

  const onDelete = () => {
    setIsLoading(true);
    props.onDelete().catch(() => setIsLoading(false));
  };

  return (
    <>
      <Card className='survey-card font-weight-light'>
        {isLoading ? <LoadingOverlay /> : null}
        <Card.Body className='survey-card-body' onClick={props.onClick}>
          <Card.Title>{props.survey.title}</Card.Title>
          <hr />
          <Card.Text>
            <span>
              <QuestionCircleFill color={primaryColor} className='mr-1' />
              {props.survey.questions.length}
            </span>
            <span className='ml-2'>
              <ClockFill color={primaryColor} className='mr-1' />
              {props.survey.estCompletionMinutes}
              {props.survey.estCompletionMinutes > 1 ? " minutes" : " minute"}
            </span>
          </Card.Text>
          <Card.Text>
            <span>
              <CalendarPlusFill color={primaryColor} className='mr-1' />
              {props.survey.createdAt?.format("dddd, MMMM D, YYYY h:mm A")}
            </span>
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          <Row className='justify-content-between'>
            <span>
              <IconButton
                icon={Check}
                className='ml-2'
                disabled={props.publishDisabled}
                onClick={onPublish}
              />
              <IconButton
                icon={X}
                className='ml-2'
                variant='danger'
                onClick={onDelete}
              />
            </span>
            <IconButton
              icon={ArrowRightShort}
              className='mr-2'
              onClick={props.onClick}
            />
          </Row>
        </Card.Footer>
      </Card>
    </>
  );
}

export default UnpublishedSurveyCard;
