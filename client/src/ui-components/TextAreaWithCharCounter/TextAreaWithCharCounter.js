import { Row, Form } from "react-bootstrap";

import "./TextAreaWithCharCounter.css";

function TextAreaWithCharCounter(props) {
  const getMaxLength = () => {
    return props.maxLength || 200;
  };

  const getCurrentCharCount = () => {
    let charCount = 0;
    if (props.value) charCount = props.value.length;
    return charCount + "/" + getMaxLength();
  };

  return (
    <>
      <Form.Control
        className='pb-4'
        as='textarea'
        rows={props.initialRows || "5"}
        maxLength={getMaxLength()}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
      />
      <Row className='justify-content-end char-counter-container'>
        <span className='rounded px-1 bg-light char-counter'>
          {getCurrentCharCount()}
        </span>
      </Row>
    </>
  );
}

export default TextAreaWithCharCounter;
