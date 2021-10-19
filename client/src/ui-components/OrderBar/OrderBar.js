import { useState } from "react";

import { Container } from "react-bootstrap";
import { CaretDownFill, CaretUpFill } from "react-bootstrap-icons";

import Button from "../Buttons/Button";
function OrderBar(props) {
  const [orderBySubject, setOrderBySubject] = useState(
    props.initialValue?.slice(1) || "publishedAt"
  );
  const [orderByDirection, setOrderByDirection] = useState(
    props.initialValue ? props.initialValue[0] : "-"
  );

  const onOrderByClick = (subject) => {
    let value;
    if (orderBySubject !== subject) {
      setOrderBySubject(subject);
      setOrderByDirection("-");
      value = "-" + subject;
    } else {
      let direction;
      setOrderByDirection((old) => {
        direction = old === "-" ? "+" : "-";
        return direction;
      });

      value = direction + orderBySubject;
    }

    props.onChange(value);
  };

  return (
    <Container className={`d-flex justify-content-end ${props.className}`}>
      {Object.entries(props.subjectIconMap).map(([subject, icon]) => (
        <OrderBarItem
          key={`order-button-${subject}`}
          icon={icon}
          active={orderBySubject === subject}
          direction={orderByDirection}
          onClick={() => onOrderByClick(subject)}
        />
      ))}
    </Container>
  );
}

function OrderBarItem(props) {
  return (
    <Button className='ml-2 px-1 py-0' onClick={props.onClick}>
      <props.icon />
      {props.active ? (
        <span className='ml-1'>
          {props.direction === "+" ? (
            <CaretUpFill size='10' />
          ) : (
            <CaretDownFill size='10' />
          )}
        </span>
      ) : null}
    </Button>
  );
}

export default OrderBar;
