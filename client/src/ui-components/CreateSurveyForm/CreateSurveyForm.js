import { useEffect, useRef, useState } from "react";

import { Container, Row, Form, Alert, Spinner } from "react-bootstrap";
import { CheckCircleFill } from "react-bootstrap-icons";

import Button from "../Buttons/Button";
import TextAreaWithCharCounter from "../TextAreaWithCharCounter/TextAreaWithCharCounter";

function CreateSurveyForm(props) {
  const autofocusRef = useRef(null);

  useEffect(() => {
    if (!props.survey.id) {
      autofocusRef.current.focus();
    }
  }, [props.survey.id]);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [title, setTitle] = useState(props.survey.title || "");
  const onTitleChange = (event) => {
    const newVal = event.target.value;
    setErrorMessage("");
    // We don't want a title made by only spaces
    if (newVal.trim() === "") {
      setTitle(() => "");
      return;
    }

    setTitle(() => newVal);
  };

  const [description, setDescription] = useState(
    props.survey.description || ""
  );
  const onDescriptionChange = (event) => {
    const newVal = event.target.value;
    setErrorMessage("");
    // We don't want a description made by only spaces
    if (newVal.trim() === "") {
      setDescription(() => "");
      return;
    }

    setDescription(() => newVal);
  };

  const estCompletionMinutesOptions = [3, 5, 7, 10, 15, 20, 25, 30];
  const [estCompletionMinutes, setEstCompletionMinutes] = useState(
    props.survey.estCompletionMinutes || estCompletionMinutesOptions[0]
  );
  const onEstCompletionMinutesChange = (event) => {
    setErrorMessage("");
    setEstCompletionMinutes(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setSubmitLoading(true);
    props
      .onSubmit({
        id: props.survey.id || undefined,
        title: title,
        description: description,
        createdAt: props.survey.createdAt || undefined,
        isPublished: props.survey.isPublished || undefined,
        publishedAt: props.survey.publishedAt || undefined,
        estCompletionMinutes: estCompletionMinutes,
        submitsCount: props.survey.submitsCount || undefined,
        userID: props.survey.userID || undefined,
      })
      .catch((err) => setErrorMessage(err))
      .finally(() => setSubmitLoading(false));
  };

  return (
    <>
      <Form onSubmit={onSubmit} id={props.formID}>
        <Form.Group className='justify-content-center'>
          <Form.Label className='font-weight-light'>Title</Form.Label>
          <Form.Control
            ref={autofocusRef}
            required
            type='text'
            placeholder='Title'
            value={title}
            onChange={onTitleChange}
          />
        </Form.Group>

        <Form.Group className='justify-content-center'>
          <Form.Label className='font-weight-light'>Description</Form.Label>
          <TextAreaWithCharCounter
            initialRows='2'
            maxChars='100'
            placeholder='Description'
            value={description}
            onChange={onDescriptionChange}
          />
        </Form.Group>

        <Form.Group className='justify-content-center'>
          <Form.Label className='font-weight-light'>
            Estimated Completion Minutes
          </Form.Label>
          <Form.Control
            as='select'
            custom
            value={estCompletionMinutes}
            onChange={onEstCompletionMinutesChange}>
            {estCompletionMinutesOptions.map((t) => (
              <option key={`est-minutes-${t}`}>{t}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Container>
          <Alert
            variant='danger'
            className={`mt-3 py-1 text-center 
                          ${errorMessage ? " visible" : " invisible"}`}>
            {errorMessage || "errorPlaceholder"}
          </Alert>
        </Container>

        <Container className='px-3 mt-2 '>
          <Row className='justify-content-around'>
            <Button
              className='m-1'
              type='submit'
              variant={errorMessage ? "danger" : "primary"}>
              {props.survey.id ? "Update Survey Details" : "Create Survey"}
              {submitLoading ? (
                <Spinner
                  animation='border'
                  variant='light'
                  size='sm'
                  className='ml-1'
                />
              ) : (
                <CheckCircleFill className='ml-1' />
              )}
            </Button>
          </Row>
        </Container>
      </Form>
    </>
  );
}

export default CreateSurveyForm;
