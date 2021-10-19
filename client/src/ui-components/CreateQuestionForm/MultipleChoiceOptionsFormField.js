import { useState } from "react";

import { Container, Form, Row, Col } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";

import IconButton from "../Buttons/IconButton";
import QuestionOptionEntry from "./QuestionOptionEntry";

function MultipleChoiceOptionsFormField(props) {
  const [value, setValue] = useState("");

  const onValueChange = (event) => {
    const newVal = event.target.value;

    // We don't want an option made by only spaces
    if (newVal.trim() === "") {
      setValue(() => "");
      return;
    }

    setValue(() => newVal);
  };

  const onAddOption = () => {
    if (
      !value ||
      props.options.includes(value) ||
      props.options.length >= props.maxOptions
    )
      return;
    props.onChange([...props.options, value]);
    setValue("");
  };

  const onDeleteOption = (optionToDelete) => {
    props.onChange(props.options.filter((option) => option !== optionToDelete));
  };

  const onMoveUpOption = (option) => {
    const oldPosition = props.options.indexOf(option);
    if (oldPosition === 0) return;
    const newPosition = oldPosition - 1;

    let options = [...props.options];
    options[oldPosition] = options[newPosition];
    options[newPosition] = option;
    props.onChange(options);
  };

  const onMoveDownOption = (option) => {
    const oldPosition = props.options.indexOf(option);
    if (oldPosition === props.options.length - 1) return;
    const newPosition = oldPosition + 1;

    let options = [...props.options];
    options[oldPosition] = options[newPosition];
    options[newPosition] = option;
    props.onChange(options);
  };

  return (
    <>
      <Container className='border rounded-top survey-question-form-field overflow-auto'>
        {props.options?.length === 0 ? (
          <Container className='h-100 d-flex justify-content-center align-items-center'>
            <span className='font-weight-light'>No options set</span>
          </Container>
        ) : (
          <>
            {props.options.map((option) => (
              <QuestionOptionEntry
                key={`question-option-${option}`}
                option={option}
                onDeleteOption={() => onDeleteOption(option)}
                onMoveUpOption={
                  props.options.indexOf(option) !== 0
                    ? () => onMoveUpOption(option)
                    : null
                }
                onMoveDownOption={
                  props.options.indexOf(option) !== props.options.length - 1
                    ? () => onMoveDownOption(option)
                    : null
                }
              />
            ))}
          </>
        )}
      </Container>
      <Container className='border border-top-0 rounded-bottom p-1'>
        <Form.Group
          as={Row}
          className='justify-content-center align-items-center m-0'>
          <Form.Label xs='0' column className='font-weight-light'>
            Option
          </Form.Label>
          <Col>
            <Form.Control
              type='text'
              placeholder='Option'
              value={value}
              onChange={onValueChange}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  onAddOption();
                }
              }}
            />
          </Col>
          <Col xs='0'>
            <IconButton
              icon={Plus}
              onClick={onAddOption}
              disabled={props.options.length >= props.maxOptions}
            />
          </Col>
        </Form.Group>
      </Container>
    </>
  );
}

export default MultipleChoiceOptionsFormField;
