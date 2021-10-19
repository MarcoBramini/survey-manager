import { Card, Row, Col } from "react-bootstrap";
import {
  PersonCheckFill,
  ClockFill,
  QuestionCircleFill,
  X,
  ArrowRightShort,
} from "react-bootstrap-icons";

import IconButton from "../Buttons/IconButton";
import LoadingOverlay from "../LoadingOverlay/LoadingOverlay";
import { primaryColor } from "../../ui-components/Colors";

import "./SurveyCard.css";
import { useState } from "react";

function SurveySummaryCard(props) {
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = () => {
    setIsLoading(true);
    props.onDelete().catch(() => setIsLoading(false));
  };

  return (
    <Card className='survey-card font-weight-light'>
      {isLoading ? <LoadingOverlay /> : null}
      <Card.Body className='survey-card-body' onClick={props.onClick}>
        <Card.Title>{props.survey.title}</Card.Title>
        <hr />
        <Card.Text>{props.survey.description}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <Row className='justify-content-between'>
          <Col>
            <Row>
              <div>
                <QuestionCircleFill
                  color={primaryColor}
                  className='ml-2 mr-1'
                />
                <span className='align-middle'>
                  {props.survey.questions.length}
                </span>
              </div>
              <div>
                <ClockFill color={primaryColor} className='ml-2 mr-1' />
                <span className='align-middle'>
                  {props.survey.estCompletionMinutes}
                  {props.survey.estCompletionMinutes > 1
                    ? " minutes"
                    : " minute"}
                </span>
              </div>
              <div>
                <PersonCheckFill color={primaryColor} className='ml-2 mr-1' />
                <span className='align-middle'>
                  {props.survey.submitsCount}
                </span>
              </div>
            </Row>
          </Col>
          <span>
            {props.onDelete ? (
              <IconButton icon={X} variant='danger' onClick={onDelete} />
            ) : null}

            <IconButton
              icon={ArrowRightShort}
              className='ml-2 mr-2'
              onClick={props.onClick}
            />
          </span>
        </Row>
      </Card.Footer>
    </Card>
  );
}

export default SurveySummaryCard;
