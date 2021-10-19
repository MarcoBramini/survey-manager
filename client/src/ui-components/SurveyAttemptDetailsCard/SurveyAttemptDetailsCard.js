import { Card } from "react-bootstrap";
import { QuestionCircleFill, ClockFill } from "react-bootstrap-icons";

import { primaryColor } from "../Colors";

import SurveyAttemptService from "../../services/SurveyAttemptService";

function SurveyAttemptDetailsCard(props) {
  const getUserFirstName = (userFullName) => {
    return userFullName.split(" ")[0];
  };

  return (
    <Card className='text-center mt-4 mx-4 font-weight-light'>
      <Card.Header>Survey</Card.Header>
      <Card.Body>
        <Card.Title>
          Great job, {getUserFirstName(props.userFullName)}! This is the end!
        </Card.Title>
        <Card.Text>
          Survey title:{" "}
          <span className='font-weight-normal'>{props.survey.title}</span>
        </Card.Text>
        <Card.Text>
          Check if you are done and submit your attempt.
          <br />
          You will be redirected to the survey list.
          <br />
          Pick another one, what are you waiting for!
        </Card.Text>
        <hr />
        <Card.Text className='text-left'>
          <QuestionCircleFill color={primaryColor} className='mr-1' />
          Answered questions:{" "}
          {SurveyAttemptService.getAnswersQuestionsRatioString(
            props.surveyAttempt,
            props.survey
          )}
        </Card.Text>
        <Card.Text className='text-left'>
          <ClockFill color={primaryColor} className='mr-1' />
          Elapsed time:{" "}
          {SurveyAttemptService.getTimeElapsedFromStartString(
            props.surveyAttempt
          )}
        </Card.Text>
        <hr />

        {props.children}
      </Card.Body>
      <Card.Footer></Card.Footer>
    </Card>
  );
}

export default SurveyAttemptDetailsCard;
