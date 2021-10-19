import { Row, Spinner as SpinnerBootstrap } from "react-bootstrap";

import "./Spinner.css";

function Spinner(props) {
  const getClassNameByVariant = () => {
    switch (props.variant) {
      case "danger":
        return "spinner-danger";
      case "warning":
        return "spinner-warning";
      default:
        return "spinner-primary";
    }
  };

  return (
    <>
      {props.fullPage ? (
        <Row
          className={`vw-100 vh-100 justify-content-center align-items-center ${
            props.className || ""
          }`}>
          <SpinnerBootstrap
            animation='border'
            className={getClassNameByVariant()}
          />
        </Row>
      ) : (
        <Row
          className={`justify-content-center align-items-center ${
            props.className || ""
          }`}>
          <SpinnerBootstrap
            animation='border'
            className={getClassNameByVariant()}
          />
        </Row>
      )}
    </>
  );
}

export default Spinner;
