import {
  Button as BootstrapButton,
  Container,
  Row,
  Col,
} from "react-bootstrap";

import "./Button.css";

function Button(props) {
  return (
    <BootstrapButton
      className={`font-weight-light ${props.className || ""}`}
      variant={props.variant}
      onClick={props.onClick}
      form={props.form || null}
      id={props.id || null}
      type={props.type}
      disabled={props.disabled}>
      <Container>
        <Row className='align-items-center'>
          <Col className='p-0 d-flex justify-content-center align-items-center'>
            {props.children}
          </Col>
        </Row>
      </Container>
    </BootstrapButton>
  );
}

export default Button;
