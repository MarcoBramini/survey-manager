import { useEffect, useState } from "react";
import { useHistory } from "react-router";

import { Container, Row } from "react-bootstrap";
import {
  CalendarPlusFill,
  CardHeading,
  GearFill,
  PersonPlusFill,
} from "react-bootstrap-icons";

import Button from "../../ui-components/Buttons/Button";
import ErrorToast from "../../ui-components/ErrorToast/ErrorToast";
import Navbar from "../../ui-components/Navbar/Navbar";
import OrderBar from "../../ui-components/OrderBar/OrderBar";
import Spinner from "../../ui-components/Spinner/Spinner";
import SurveyCardGrid from "../../ui-components/SurveyCardGrid/SurveyCardGrid";
import SurveySummaryCard from "../../ui-components/SurveyCardGrid/SurveySummaryCard";
import RetractableLabel from "../../ui-components/RetractableLabel/RetractableLabel";
import { primaryColor } from "../../ui-components/Colors";

import { getAvailableSurveys } from "../../services/SurveyManagerAPIClient";

import "./SurveyDiscoverPage.css";
function SurveyDiscoverPage() {
  const history = useHistory();

  const [isInitialized, setIsInitialized] = useState(false);
  const [isStateDirty, setIsStateDirty] = useState(true);

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState("");

  const [availableSurveys, setAvailableSurveys] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [orderByValue, setOrderByValue] = useState("-publishedAt");

  useEffect(() => {
    const refreshTimerID = setInterval(() => setIsStateDirty(true), 5000);
    return () => clearInterval(refreshTimerID);
  }, []);

  useEffect(() => {
    // Get survey list
    const loadAvailableSurveys = () =>
      getAvailableSurveys(searchValue, null, orderByValue)
        .then((surveys) => {
          setAvailableSurveys(surveys);
          setIsInitialized(true);
          setIsStateDirty(false);
        })
        .catch((err) => {
          setErrorToastMessage(err.message);
          setShowErrorToast(true);
        });

    if (isStateDirty) loadAvailableSurveys();
  }, [searchValue, isStateDirty, orderByValue]);

  const onSearchSubmit = (searchValue) => {
    setSearchValue(searchValue);
    setIsStateDirty(true);
  };

  const onSurveyCardClick = (survey) => {
    history.push("/user-id", { redirectPath: "/surveys/" + survey.id });
  };

  const onManageSurveysClick = () => {
    history.push("/admin-login");
  };

  const onOrderByChange = (value) => {
    setOrderByValue(value);
    setIsStateDirty(true);
  };

  return (
    <>
      {!isInitialized ? (
        <Spinner fullPage />
      ) : (
        <>
          <Navbar search onSearchSubmit={onSearchSubmit} />

          <h3 className='mt-3 text-center font-weight-light'>
            Available Surveys
          </h3>

          <OrderBar
            className='pr-5'
            subjectIconMap={{
              publishedAt: CalendarPlusFill,
              title: CardHeading,
              submitsCount: PersonPlusFill,
            }}
            onChange={onOrderByChange}
          />

          <RetractableLabel
            className='retractable-label-manage-surveys'
            icon={<GearFill color={primaryColor} size='25' className='mr-2' />}>
            <Button className='my-3' onClick={onManageSurveysClick}>
              Manage your surveys
            </Button>
          </RetractableLabel>
          {availableSurveys.length === 0 ? (
            <Container>
              <Row className='justify-content-center my-5'>
                <h4 className='font-weight-light text-muted'>
                  No available survey found :(
                  <br />
                  Come back later!
                </h4>
              </Row>
            </Container>
          ) : (
            <SurveyCardGrid>
              {availableSurveys.map((survey) => (
                <SurveySummaryCard
                  key={"survey-card-" + survey.id}
                  survey={survey}
                  onClick={() => onSurveyCardClick(survey)}
                />
              ))}
            </SurveyCardGrid>
          )}
          <Container className='bottom-padding' />
        </>
      )}

      <ErrorToast
        show={showErrorToast}
        onClose={() => setShowErrorToast(false)}
        title='Error'
        message={errorToastMessage}
      />
    </>
  );
}

export default SurveyDiscoverPage;
