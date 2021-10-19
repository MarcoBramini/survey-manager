import { Container } from "react-bootstrap";

function SurveyCardGrid(props) {
  return (
    <>
      <Container className='d-flex flex-row flex-wrap'>
        {/* This component takes as children only components of type SurveySummaryCard, UnpublishedSurveyCard, CreateSurveyCard */}
        {props.children}
      </Container>
    </>
  );
}

export default SurveyCardGrid;
