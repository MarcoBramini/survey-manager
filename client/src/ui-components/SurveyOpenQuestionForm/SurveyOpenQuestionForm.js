import { useState } from "react";
import { Form, Container, Alert } from "react-bootstrap";
import { CheckCircleFill } from "react-bootstrap-icons";

import Button from "../Buttons/Button";
import TextAreaWithCharCounter from "../TextAreaWithCharCounter/TextAreaWithCharCounter";

function SurveyOpenQuestionForm(props) {
  const [value, setValue] = useState(props.initialValue || "");
  const [errorMessage, setErrorMessage] = useState("");

  const onValueChange = (event) => {
    const newVal = event.target.value;

    setErrorMessage("");

    // We don't want a value made by only spaces
    if (newVal.trim() === "") {
      setValue(() => "");
      return;
    }

    setValue(() => newVal);
  };

  const checkErrors = () => {
    if (!props.isOptional && value.length === 0) {
      return "This question is mandatory.";
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();

    let err = checkErrors();
    if (err) {
      setErrorMessage(err);
      return;
    }

    props.onSubmit(value);
  };

  const getSubmitButtonLabel = () => {
    if (props.initialValue) {
      return "Update";
    }

    if (props.isOptional && !value) {
      return "Skip";
    }

    return "Submit";
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group>
        <Form.Label>
          {props.isOptional ? (
            <>
              This is an optional question.
              <br />
            </>
          ) : null}
          Write your answer here:
        </Form.Label>
        <TextAreaWithCharCounter
          value={value}
          maxLength={props.maxAnswerLength}
          onChange={onValueChange}
        />
        <Alert
          variant='danger'
          className={
            "mt-2 mb-0 py-1" + (errorMessage ? " visible" : " invisible")
          }>
          {errorMessage || "errorPlaceholder"}
        </Alert>
      </Form.Group>
      <Container className='px-3'>
        <Button type='submit' variant={errorMessage ? "danger" : "primary"}>
          {getSubmitButtonLabel()}
          <CheckCircleFill className='ml-1' />
        </Button>
      </Container>
    </Form>
  );
}

export default SurveyOpenQuestionForm;
