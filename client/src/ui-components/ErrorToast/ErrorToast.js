import { Toast } from "react-bootstrap";
import { XCircleFill } from "react-bootstrap-icons";
import { dangerColor } from "../Colors";

import "./ErrorToast.css";

function ErrorToast(props) {
  return (
    <Toast
      className='error-toast'
      show={props.show}
      delay={5000}
      autohide
      onClose={props.onClose}>
      <Toast.Header className='bg-light'>
        <XCircleFill size='20' color={dangerColor} className='mr-2' />
        <strong className='mr-auto error-toast-title'>{props.title}</strong>
      </Toast.Header>
      <Toast.Body className='error-toast-body font-weight-light'>
        {props.message}
      </Toast.Body>
    </Toast>
  );
}

export default ErrorToast;
