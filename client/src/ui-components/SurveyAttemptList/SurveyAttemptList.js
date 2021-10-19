import { Container } from "react-bootstrap";

import SurveyAttemptListHeader from "./SurveyAttemptListHeader";
import SurveyAttemptListEntry from "./SurveyAttemptListEntry";

import "./SurveyAttemptList.css";
function SurveyAttemptList(props) {
  return (
    <>
      <Container className=' border rounded p-2'>
        <SurveyAttemptListHeader />
        <Container className='survey-attempt-list overflow-auto p-0'>
          {props.surveyAttempts.map((surveyAttempt) => (
            <SurveyAttemptListEntry
              key={`survey-attempt-${surveyAttempt.id}`}
              className='mt-1 '
              survey={props.survey}
              surveyAttempt={surveyAttempt}
              onClick={() => props.onClick(surveyAttempt)}
            />
          ))}
        </Container>
      </Container>
    </>
  );
}

export default SurveyAttemptList;
