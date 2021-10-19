import { useContext } from "react";

import { Col, Container, Row } from "react-bootstrap";

import Logo from "../../ui-components/Logo/Logo";
import UserLoginForm from "../../ui-components/UserLoginForm/UserLoginForm";

import { AuthContext } from "../../context-providers/AuthContext/AuthContextProvider";
function AdminLoginPage() {
  const authContext = useContext(AuthContext);

  const onAdminLoginFormSubmit = (email, password) =>
    new Promise((resolve, reject) => {
      authContext
        .loginUser(email, password)
        .then(() => {
          resolve();
        })
        .catch(reject);
    });

  return (
    <Container
      fluid
      className='vh-100 d-flex align-items-center justify-content-center'>
      <Row className='justify-content-center'>
        <Col>
          <Logo medium />
          <hr className='mt-4' />
          <Container className='mt-2'>
            <UserLoginForm onSubmit={onAdminLoginFormSubmit} />
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminLoginPage;
