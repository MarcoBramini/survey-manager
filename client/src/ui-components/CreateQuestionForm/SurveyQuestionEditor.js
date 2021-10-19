import { Container, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Plus, InputCursorText, Check2Circle } from "react-bootstrap-icons";

import Button from "../Buttons/Button";
import SurveyQuestionEntry from "./SurveyQuestionEntry";

import "./SurveyQuestionEditor.css";

function SurveyQuestionsEditor(props) {
  return (
    <>
      <Container className='border rounded-top survey-question-form-field overflow-auto'>
        {props.disabled ? (
          <Container className='h-100 d-flex justify-content-center align-items-center'>
            <span className='font-weight-light'>
              Create the survey you are working on to be able to edit its
              questions.
            </span>
          </Container>
        ) : (
          <>
            {props.questions?.length === 0 ? (
              <Container className='h-100 d-flex justify-content-center align-items-center'>
                <span className='font-weight-light'>No questions set</span>
              </Container>
            ) : (
              <>
                {props.questions.map((question) => (
                  <SurveyQuestionEntry
                    key={`survey-question-${question.id}`}
                    question={question}
                    isMoveUpQuestionDisabled={props.isMoveUpQuestionDisabled(
                      question
                    )}
                    onMoveUpQuestion={() => props.onMoveUpQuestion(question)}
                    isMoveDownQuestionDisabled={props.isMoveDownQuestionDisabled(
                      question
                    )}
                    onMoveDownQuestion={() =>
                      props.onMoveDownQuestion(question)
                    }
                    onEditQuestion={() => props.onEditQuestion(question)}
                    onDeleteQuestion={() => props.onDeleteQuestion(question)}
                  />
                ))}
              </>
            )}
          </>
        )}
      </Container>
      <Container className='border border-top-0 rounded-bottom p-1'>
        <OverlayTrigger
          placement='top'
          trigger={["hover", "hover"]}
          delay={{ show: 150, hide: 300 }}
          overlay={(props) => (
            <Tooltip {...props}>Add an open question</Tooltip>
          )}>
          <span>
            <Button
              disabled={props.disabled}
              className='p-1'
              onClick={props.onCreateOpenQuestion}>
              <Plus size='20' />
              <InputCursorText size='20' />
            </Button>
          </span>
        </OverlayTrigger>
        <OverlayTrigger
          placement='top'
          trigger={["hover", "hover"]}
          delay={{ show: 150, hide: 300 }}
          overlay={(props) => (
            <Tooltip {...props}>Add a multiple choice question</Tooltip>
          )}>
          <span>
            <Button
              disabled={props.disabled}
              className='p-1 ml-2'
              onClick={props.onCreateMultipleChoiceQuestion}>
              <Plus size='20' />
              <Check2Circle size='20' />
            </Button>{" "}
          </span>
        </OverlayTrigger>
      </Container>
    </>
  );
}

export default SurveyQuestionsEditor;
