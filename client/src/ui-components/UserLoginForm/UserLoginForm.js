import { useState } from "react";

import { Form, Row, Container, Spinner, Alert } from "react-bootstrap";
import { CheckCircleFill, XCircleFill } from "react-bootstrap-icons";

import Button from "../../ui-components/Buttons/Button";

import "./UserLoginForm.css";
function UserLoginForm(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onEmailChange = (event) => {
    const newVal = event.target.value;

    setErrorMessage("");

    // We don't want an email made by only spaces
    if (newVal.trim() === "") {
      setEmail(() => "");
      return;
    }

    setEmail(() => newVal);
  };

  const onPasswordChange = (event) => {
    const newVal = event.target.value;

    setErrorMessage("");

    // We don't want a password made by only spaces
    if (newVal.trim() === "") {
      setPassword(() => "");
      return;
    }

    setPassword(() => newVal);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    props.onSubmit(email, password).catch((err) => {
      setErrorMessage(err);
      setIsLoading(false);
    });
  };

  return (
    <>
      <Container>
        <Row className='justify-content-center'>
          <Form onSubmit={onSubmit} className='user-login-form'>
            <Form.Label className='font-weight-light'>
              Insert your email:
            </Form.Label>
            <Form.Control
              type='email'
              className='font-weight-light'
              placeholder='Email'
              onChange={onEmailChange}
              value={email}
              required
            />
            <Form.Label className='mt-2 font-weight-light'>
              Insert your password:
            </Form.Label>
            <Form.Control
              type='password'
              className='font-weight-light'
              placeholder='Password'
              onChange={onPasswordChange}
              value={password}
              required
            />

            <Row className='mt-3 justify-content-center'>
              <Button
                type='submit'
                variant={errorMessage ? "danger" : "primary"}>
                Continue{" "}
                {isLoading ? (
                  <Spinner
                    animation='border'
                    variant='light'
                    size='sm'
                    className='ml-1'
                  />
                ) : (
                  <>
                    {errorMessage ? (
                      <XCircleFill className='ml-1' />
                    ) : (
                      <CheckCircleFill className='ml-1' />
                    )}
                  </>
                )}
              </Button>
            </Row>
          </Form>
        </Row>
      </Container>
      {errorMessage ? (
        <Row className='justify-content-center'>
          <Alert variant='danger' className='mt-3 mb-0 py-1'>
            {errorMessage}
          </Alert>
        </Row>
      ) : null}
    </>
  );
}

export default UserLoginForm;
