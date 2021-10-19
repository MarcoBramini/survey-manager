import { useHistory, useLocation } from "react-router";

import { Col, Container, Row } from "react-bootstrap";
import { CheckCircleFill, XCircleFill } from "react-bootstrap-icons";

import Button from "../../ui-components/Buttons/Button";
import Logo from "../../ui-components/Logo/Logo";
import UserIdentificationForm from "../../ui-components/UserIdentificationForm/UserIdentificationForm";

import { AuthContext } from "../../context-providers/AuthContext/AuthContextProvider";

function UserIdentificationPage(props) {
  const history = useHistory();
  const location = useLocation();

  const followRedirect = () => {
    let redirectPath = location.state.redirectPath;
    if (!redirectPath) {
      redirectPath = "/";
      console.log("no redirect path set");
    }

    history.push(redirectPath);
  };

  const onUserIdentificationFormSubmit = (authContext) => (userFullName) => {
    authContext.setUserFullName(userFullName);
    followRedirect();
  };

  const onRecoveredUserContinue = (authContext) => followRedirect();

  const onRecoveredUserCancel = (authContext) =>
    authContext.unsetUserFullName();

  const getFirstName = (userFullName) => userFullName.split(" ")[0];

  return (
    <>
      <Container
        fluid
        className='vh-100 d-flex align-items-center justify-content-center'>
        <Row className='justify-content-center'>
          <Col>
            <Logo medium />
            <hr className='mt-4' />
            <Container className='mt-2'>
              <AuthContext.Consumer>
                {(value) =>
                  value.userFullName ? (
                    <>
                      <h5 className='font-weight-light text-center'>
                        Nice to see you again,{" "}
                        {getFirstName(value.userFullName)}!
                      </h5>
                      <Container className='mt-4 d-flex justify-content-center'>
                        <Button
                          variant='danger'
                          className='float-center '
                          onClick={() => onRecoveredUserCancel(value)}>
                          It's not me <XCircleFill className='ml-1' />
                        </Button>
                        <Button
                          variant='primary'
                          className='ml-2 float-center'
                          onClick={() => onRecoveredUserContinue(value)}>
                          Continue <CheckCircleFill className='ml-1' />
                        </Button>
                      </Container>
                    </>
                  ) : (
                    <>
                      <h5 className='font-weight-light'>Nice to meet you!</h5>
                      <Container className='mt-4 px-0'>
                        <UserIdentificationForm
                          onSubmit={onUserIdentificationFormSubmit(value)}
                        />
                      </Container>
                    </>
                  )
                }
              </AuthContext.Consumer>
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default UserIdentificationPage;
