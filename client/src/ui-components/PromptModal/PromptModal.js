import { Modal } from "react-bootstrap";

import Button from "../Buttons/Button";

import "./PromptModal.css";

function PromptModal(props) {
  return (
    <Modal
      className='prompt-modal'
      centered
      show={props.showPrompt}
      onHide={props.promptCancelCallback}>
      <Modal.Header closeButton>
        <Modal.Title>{props.promptTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.promptMessage}</Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={props.promptCancelCallback}>
          Cancel
        </Button>
        <Button variant='danger' onClick={props.promptConfirmCallback}>
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PromptModal;
