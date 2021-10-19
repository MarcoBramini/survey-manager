import { useState } from "react";
import { Row, Col, Alert, Form, Container } from "react-bootstrap";
import { CheckCircleFill, Circle } from "react-bootstrap-icons";

import Button from "../../ui-components/Buttons/Button";
import { primaryColor } from "../Colors";

import "./SurveyMultipleChoiceQuestionForm.css";

function SurveyMultipleChoiceQuestionForm(props) {
  const [selectedValues, setSelectedValues] = useState(
    props.initialValue || []
  );

  const [errorMessage, setErrorMessage] = useState("");

  const onOptionSelection = (option) => {
    setErrorMessage("");
    if (selectedValues.includes(option)) {
      setSelectedValues([...selectedValues.filter((o) => o !== option)]);
      return;
    }
    setSelectedValues([...selectedValues, option]);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    let err = checkErrors();
    if (err) {
      setErrorMessage(err);
      return;
    }

    props.onSubmit(selectedValues);
  };

  const checkErrors = () => {
    if (
      props.minChoices === props.maxChoices &&
      (selectedValues.length < props.minChoices ||
        selectedValues.length > props.minChoices)
    ) {
      return (
        "You must select " +
        props.minChoices +
        (props.minChoices === 1 ? " answer" : " answers")
      );
    }
    if (props.minChoices && selectedValues.length < props.minChoices) {
      return (
        "You must select at least " +
        props.minChoices +
        (props.minChoices === 1 ? " answer" : " answers")
      );
    }
    if (props.maxChoices && selectedValues.length > props.maxChoices) {
      return (
        "You must select at most " +
        props.maxChoices +
        (props.maxChoices === 1 ? " answer" : " answers")
      );
    }
  };

  const getChoiceBoundariesDescription = () => {
    let description = "";
    if (props.minChoices === 0) {
      description += "This is an optional question.  ";
    }

    if (props.minChoices === 0) {
      description +=
        "You must select at most " +
        props.maxChoices +
        (props.maxChoices === 1 ? " answer" : " answers");
    } else if (props.minChoices === props.maxChoices) {
      description +=
        "You must select " +
        props.minChoices +
        (props.maxChoices === 1 ? " answer" : " answers");
    } else {
      description +=
        "You must select between " +
        props.minChoices +
        " and " +
        props.maxChoices +
        (props.maxChoices === 1 ? " answer" : " answers");
    }

    return description + ".";
  };

  const getSubmitButtonLabel = () => {
    if (props.initialValue) {
      return "Update";
    }

    if (
      props.minChoices === 0 &&
      (!selectedValues || selectedValues.length === 0)
    ) {
      return "Skip";
    }

    return "Submit";
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group>
        <Form.Label className='text-center '>
          {getChoiceBoundariesDescription()}
          <br />
          Select between the following options:
        </Form.Label>
        <Container className='font-weight-normal'>
          <Row className='justify-content-center'>
            {props.options.map((option) => (
              <QuestionOption
                key={"question-option-" + props.options.indexOf(option)}
                value={option}
                selected={selectedValues.includes(option) || null}
                onClick={() => onOptionSelection(option)}
              />
            ))}
          </Row>
          <Alert
            variant='danger'
            className={
              " mt-2 mb-0 py-1" + (errorMessage ? " visible" : " invisible")
            }>
            {errorMessage || "errorPlaceholder"}
          </Alert>
        </Container>
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

export default SurveyMultipleChoiceQuestionForm;

function QuestionOption(props) {
  return (
    <Container
      className='question-option rounded'
      data-selected={props.selected}
      onClick={props.onClick}>
      <Row className='ml-1 align-items-center'>
        <Col xs='1' className='p-0'>
          {props.selected ? (
            <CheckCircleFill />
          ) : (
            <Circle color={primaryColor} />
          )}
        </Col>
        <Col xs='9' className='p-0'>
          <div className='ml-2 py-2'>{props.value}</div>
        </Col>
      </Row>
    </Container>
  );
}
