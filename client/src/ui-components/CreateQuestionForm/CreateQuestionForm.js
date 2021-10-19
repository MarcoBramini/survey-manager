import { useEffect, useRef, useState } from "react";

import { Form, Row } from "react-bootstrap";
import { CheckCircleFill, XCircleFill } from "react-bootstrap-icons";

import Button from "../Buttons/Button";
import MultipleChoiceOptionsFormField from "./MultipleChoiceOptionsFormField";

import { QuestionType } from "../../services/models/question";
function CreateQuestionForm(props) {
  const autofocusRef = useRef(null);

  useEffect(() => {
    if (!props.questionToEdit?.id) {
      autofocusRef.current.focus();
    }
  }, [props.questionToEdit?.id]);

  const [title, setTitle] = useState(props.questionToEdit?.title || "");

  const onTitleChange = (event) => {
    const newVal = event.target.value;

    // We don't want a title made by only spaces
    if (newVal.trim() === "") {
      setTitle(() => "");
      return;
    }

    setTitle(() => newVal);
  };

  /* Open Questions */
  const [isOptional, setIsOptional] = useState(
    props.questionToEdit?.isOptional || false
  );

  const onIsOptionalChange = (event) => setIsOptional(event.target.checked);

  const [maxAnswerLength, setMaxAnswerLength] = useState(
    props.questionToEdit !== null ? props.questionToEdit.maxAnswerLength : 200
  );

  const getMaxAnswerLengthOptions = () => {
    return Array.from({ length: 10 }, (v, i) => parseInt((i + 1) * 50));
  };

  const onMaxAnswerLengthChange = (event) => {
    setMaxAnswerLength(event.target.value);
  };

  /* Multiple Choice Questions */
  const [options, setOptions] = useState(props.questionToEdit?.options || []);

  const onOptionsChange = (value) => setOptions(value);

  const [minChoices, setMinChoices] = useState(
    props.questionToEdit !== null ? props.questionToEdit.minChoices : 1
  );

  const onMinChoicesChange = (event) => {
    setMinChoices(() => {
      if (maxChoices < event.target.value) setMaxChoices(event.target.value);
      return event.target.value;
    });
  };

  const getMinChoicesOptions = () => {
    return Array.from({ length: options.length + 1 }, (v, i) => parseInt(i));
  };

  const [maxChoices, setMaxChoices] = useState(
    props.questionToEdit !== null ? props.questionToEdit.maxChoices : 1
  );

  const onMaxChoicesChange = (event) => {
    setMaxChoices(event.target.value);
  };

  const getMaxChoicesOptions = () => {
    let o = [];
    for (let i = parseInt(minChoices) || 1; i < options.length + 1; i++)
      o.push(i);
    return o;
  };

  const onSubmit = (event) => {
    event.preventDefault();
    props.onSubmit({
      id: props.questionToEdit?.id || undefined,
      surveyID: props.questionToEdit?.surveyID || undefined,
      position: props.questionToEdit?.position || undefined,
      title: title,
      type: props.questionType,
      isOptional: props.questionType === QuestionType.OPEN ? isOptional : null,
      maxAnswerLength:
        props.questionType === QuestionType.OPEN ? maxAnswerLength : null,
      minChoices:
        props.questionType === QuestionType.MULTIPLE_CHOICE ? minChoices : null,
      maxChoices:
        props.questionType === QuestionType.MULTIPLE_CHOICE ? maxChoices : null,
      options:
        props.questionType === QuestionType.MULTIPLE_CHOICE ? options : null,
    });
  };

  const onCancel = () => {
    props.onCancel();
  };

  return (
    <>
      <Form
        onSubmit={onSubmit}
        onKeyPress={(event) => {
          if (
            event.key === "Enter" &&
            props.questionType === QuestionType.MULTIPLE_CHOICE
          ) {
            event.preventDefault();
          }
        }}>
        <Form.Group>
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

        {props.questionType === QuestionType.OPEN ? (
          <>
            <Form.Group className='justify-content-center'>
              <Form.Label className='font-weight-light'>
                Maximum answer length
              </Form.Label>
              <Form.Control
                custom
                as='select'
                value={maxAnswerLength}
                onChange={onMaxAnswerLengthChange}>
                {getMaxAnswerLengthOptions().map((i) => (
                  <option key={`max-answer-length-${i}`}>{i}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Check
                type='checkbox'
                label='Optional'
                checked={isOptional}
                onChange={onIsOptionalChange}
              />
            </Form.Group>
          </>
        ) : (
          <>
            <Form.Group className='justify-content-center'>
              <Form.Label className='font-weight-light'>Options</Form.Label>
              <MultipleChoiceOptionsFormField
                maxOptions={props.maxMultipleChoiceQuestionOptions}
                options={options}
                onChange={onOptionsChange}
              />
            </Form.Group>
            <Form.Group className='justify-content-center'>
              <Form.Label className='font-weight-light'>
                Minimum accepted choices
              </Form.Label>
              <Form.Control
                custom
                as='select'
                value={minChoices}
                onChange={onMinChoicesChange}>
                {getMinChoicesOptions().map((i) => (
                  <option key={`min-choices-${i}`}>{i}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className='justify-content-center'>
              <Form.Label className='font-weight-light'>
                Maximum accepted choices
              </Form.Label>
              <Form.Control
                custom
                as='select'
                value={maxChoices}
                onChange={onMaxChoicesChange}>
                {getMaxChoicesOptions().map((i) => (
                  <option key={`max-choices-${i}`}>{i}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </>
        )}
        <Row className='justify-content-center'>
          <Button className='m-1' variant='danger' onClick={onCancel}>
            Cancel
            <XCircleFill className='ml-1' />
          </Button>
          <Button className='m-1' type='submit'>
            {props.questionToEdit ? "Update" : "Create"}
            <CheckCircleFill className='ml-1' />
          </Button>
        </Row>
      </Form>
    </>
  );
}

export default CreateQuestionForm;
