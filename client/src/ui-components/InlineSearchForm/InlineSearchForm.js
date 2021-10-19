import { useState } from "react";

import { Form, FormControl, InputGroup } from "react-bootstrap";
import { XCircleFill } from "react-bootstrap-icons";

import Button from "../Buttons/Button";
import { dangerColor } from "../Colors";

function InlineSearchForm(props) {
  const [value, setValue] = useState("");

  const onValueChange = (event) => {
    const newVal = event.target.value;

    // We don't want a value made by only spaces
    if (newVal.trim() === "") {
      setValue(() => "");
      return;
    }

    setValue(() => newVal);
  };

  const onValueClear = () => {
    setValue("");
    props.onSubmit("");
  };

  const onSubmit = (event) => {
    event.preventDefault();
    props.onSubmit(value);
  };

  return (
    <Form inline className='flex-nowrap' onSubmit={onSubmit}>
      <InputGroup>
        <FormControl
          type='text'
          placeholder='Search'
          value={value}
          onChange={onValueChange}
        />
        <InputGroup.Append>
          <InputGroup.Text onClick={onValueClear}>
            <XCircleFill color={dangerColor} size='20'></XCircleFill>
          </InputGroup.Text>

          <Button type='submit' variant='primary'>
            Search
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </Form>
  );
}

export default InlineSearchForm;
