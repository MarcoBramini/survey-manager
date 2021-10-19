import { useState } from "react";
import { Row } from "react-bootstrap";
import { CaretLeftFill, CaretRightFill } from "react-bootstrap-icons";
import { primaryColor } from "../Colors";

import "./RetractableLabel.css";

function RetractableLabel(props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const onLabelClick = () => {
    setIsExpanded((old) => !old);
  };

  const onOutsideClick = () => {
    setIsExpanded(false);
  };

  return (
    <>
      {
        // This container maps the space not occupied by the label in the display.
        // It's used to close the label when the user clicks outside of the label area.
        isExpanded ? (
          <div className='rl-outside-space' onClick={onOutsideClick}></div>
        ) : null
      }
      <div className={`position-fixed ${props.className || ""}`}>
        <Row className='justify-content-end align-items-center '>
          <span
            className='rl-container rounded-left bg-light '
            data-expanded={isExpanded || null}>
            <span onClick={onLabelClick}>
              {isExpanded ? (
                <CaretRightFill color={primaryColor} />
              ) : (
                <CaretLeftFill color={primaryColor} />
              )}
              {props.icon}
            </span>
            {props.children}
          </span>
        </Row>
      </div>
    </>
  );
}

export default RetractableLabel;
