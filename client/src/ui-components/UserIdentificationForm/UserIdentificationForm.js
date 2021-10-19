import { useState } from "react";

import { Container, Form } from "react-bootstrap";
import { CheckCircleFill } from "react-bootstrap-icons";

import Button from "../../ui-components/Buttons/Button";

function UserIdentificationForm(props) {
  const [fullName, setFullName] = useState("");

  const onFullNameChange = (event) => {
    const newVal = event.target.value;

    // We don't want a description made by only spaces
    if (newVal.trim() === "") {
      setFullName(() => "");
      return;
    }

    setFullName(() => newVal);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    props.onSubmit(fullName);
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Label className='font-weight-light'>
        Insert your full name to proceed:
      </Form.Label>
      <Form.Control
        type='text'
        className='font-weight-light'
        placeholder='Mario Biondi'
        onChange={onFullNameChange}
        value={fullName}
        required
      />
      <Container className='mt-4  d-flex justify-content-center'>
        <Button type='submit' variant='primary' className='float-center'>
          Continue <CheckCircleFill className='ml-1' />
        </Button>
      </Container>
    </Form>
  );
}

export default UserIdentificationForm;
