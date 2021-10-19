import { Card } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";

import IconButton from "../Buttons/IconButton";
function CreateSurveyCard(props) {
  return (
    <Card className='survey-card create-survey-card justify-content-center align-items-center'>
      <IconButton icon={Plus} size='50' onClick={props.onClick} />
      <span className='font-weight-light mt-4'>Create New Survey</span>
    </Card>
  );
}

export default CreateSurveyCard;
