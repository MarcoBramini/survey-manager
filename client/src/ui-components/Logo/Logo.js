import { Container } from "react-bootstrap";

import { surveyManagerLogo } from "../Icons";

import "./Logo.css";

const surveyManagerTitle = "SurveyManager";

function Logo(props) {
  const buildLogoIconFromProps = () => {
    if (props.large) {
      return surveyManagerLogo("160", "200");
    } else if (props.medium) {
      return surveyManagerLogo("120", "150");
    }
    return surveyManagerLogo("36", "45");
  };

  const getLogoClassFromProps = () => {
    if (props.large) {
      return "logo-large";
    } else if (props.medium) {
      return "logo-medium";
    }
    return "";
  };

  return (
    <Container
      className={
        "d-flex align-items-center justify-content-center logo " +
        getLogoClassFromProps()
      }>
      {buildLogoIconFromProps()}
      <span className='mx-2'>{surveyManagerTitle}</span>
    </Container>
  );
}

export default Logo;
