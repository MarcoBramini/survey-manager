import "./LoadingOverlay.css";

import { Container } from "react-bootstrap";

import Spinner from "../Spinner/Spinner";

// The container component need to be relative positioned
function LoadingOverlay(props) {
  return (
    <>
      <Container className='loading-overlay'></Container>
      <Container className='loading-spinner'>
        <Spinner variant={props.variant} />
      </Container>
    </>
  );
}

export default LoadingOverlay;
