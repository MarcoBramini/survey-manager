import { Container, Row, Col, Modal } from "react-bootstrap";
import {
  EnvelopeFill,
  PersonBadgeFill,
  PersonFill,
  BoxArrowRight,
} from "react-bootstrap-icons";

import Button from "../../ui-components/Buttons/Button";
import { primaryColor } from "../../ui-components/Colors";
function UserPanelModal(props) {
  return (
    <Modal centered show={props.show} onHide={props.onHide}>
      <Modal.Header>
        <Modal.Title>User Panel</Modal.Title>
      </Modal.Header>
      <Modal.Body className='font-weight-light'>
        <Container>
          Hi! Here you can find the information associated to your account.
          <hr />
          <Row>
            <Col xs='3'>
              <PersonFill color={primaryColor} />
              <span className='ml-2 align-middle'>{"Name: "}</span>
            </Col>
            <Col>
              <span className='align-middle'>
                <b> {props.user.name}</b>
              </span>
            </Col>
          </Row>
          <Row className='mt-2'>
            <Col xs='3'>
              <EnvelopeFill color={primaryColor} />
              <span className='ml-2 align-middle'>{"Email: "}</span>
            </Col>
            <Col>
              <span className='align-middle'>
                <b>{props.user.email}</b>
              </span>
            </Col>
          </Row>
          <Row className='mt-2'>
            <Col xs='3'>
              <PersonBadgeFill color={primaryColor} />
              <span className='ml-2 align-middle'>{"Role: "}</span>
            </Col>
            <Col>
              <span className='align-middle'>
                <b> {props.user.role}</b>
              </span>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onLogout}>
          <BoxArrowRight /> <span className='ml-1'>Logout</span>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UserPanelModal;
