import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row, ProgressBar, Alert, FormControl, Button } from 'react-bootstrap';
import { Redirect, useHistory, useLocation } from 'react-router';
import LoginButton from '../components/LoginButton';
import { PersonBadge } from 'react-bootstrap-icons';
import * as qs from 'qs';
import {
  API_KEY,
  BRAND_NAME,
  CLIENT_ID,
  CLIENT_SECRET,
  LOGIN_PATH,
  SCRIPT_PROD_URL,
  TOKEN_INFO_PATH
} from '../helpers/constants';
import { toast } from 'react-toastify';

const Login = props => {
  const [authCode, setAuthCode] = useState(null);
  const [signInError, setSignInError] = useState(false);
  const [signInErrorMsg, setSignInErrorMsg] = useState(null);
  const [loginCode, setLoginCode] = useState('');
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const params = qs.parse(location.search, { ignoreQueryPrefix: true });

    if (params.loginCode) {
      setLoginCode(params.loginCode);
      setAuthCode(params.loginCode);
      getUserEmailFromAuthCode(params.loginCode, true);
      return;
    }

    if (params.code) {
      //security check
      if (params.state !== localStorage.getItem('session-uid')) {
        setSignInErrorMsg('Oops! Something went wrong');
        setSignInError(true);
        return;
      }

      setAuthCode(params.code);
      getUserEmailFromAuthCode(params.code);
    }
  }, []);

  const getUserEmailFromAuthCode = async (code, isLoginCode) => {
    try {
      let email = '';
      if (!isLoginCode) {
        const postBody = {
          code: code,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: 'authorization_code',
          redirect_uri: LOGIN_PATH
        };

        const tokenJSON = await (await fetch(localStorage.getItem('token_endpoint'), {
          method: 'post',
          body: JSON.stringify(postBody)
        })).json();
        const idToken = tokenJSON['id_token'];
        //get email from token
        const userJSON = await (await fetch(TOKEN_INFO_PATH + idToken)).json();
        email = userJSON['email'];
      }

      const authResult = await (await fetch(SCRIPT_PROD_URL, {
        method: 'post',
        body: JSON.stringify({
          email: email,
          loginCode: isLoginCode ? code : '',
          requestType: 'auth',
          clientId: API_KEY
        })
      })).json();

      if (authResult['success']) {
        localStorage.setItem('user-email', email);
        localStorage.setItem('user-code', isLoginCode ? code : '');
        localStorage.setItem('user-name', authResult['userName']);

        history.push('/');
      } else {
        setAuthCode('');
        setSignInErrorMsg('Oops! Could not authorize you.');
        setSignInError(true);
      }
    } catch (e) {
      console.error(e);
      setAuthCode('');
      setSignInErrorMsg('Oops! Something went wrong');
      setSignInError(true);
    }
  };

  const email = localStorage.getItem('user-email');
  if (email) {
    return <Redirect from="/login" to="/" />;
  }

  const loginByID = () => {
    if (!loginCode) {
      return toast.error('Please provide your login code!');
    }

    setAuthCode(loginCode);
    getUserEmailFromAuthCode(loginCode, true);
  };

  return (
    <Container fluid className="h-100">
      <Row className="h-100">
        <Col xs={1} md={2} className="bg-primary"></Col>
        <Col xs={11} md={10} className="p-0">
          <Row className="justify-content-center h-100">
            <Col xs={10} md={5} className="align-self-center">
              <div className="p-2 mb-2">
                <h2 className="text-center text-dark">{BRAND_NAME}</h2>
              </div>
              <Card className="">
                <Card.Body>
                  <h4 className="text-primary mb-1">
                    <PersonBadge className="mr-2 align-text-bottom" />
                    Login
                  </h4>
                  <p className="text-secondary mb-0">Please sign in to continue:</p>

                  <hr className="my-2" />

                  <div className="text-center p-3">
                    {authCode ? (
                      <ProgressBar
                        className="mt-1"
                        striped
                        animated
                        variant="primary"
                        now={100}
                        label="Logging in..."
                      />
                    ) : (
                      <div className="px-2 px-lg-4">
                        <LoginButton className="mt-1" />
                        <h6 className="my-2 text-muted">OR</h6>
                        <FormControl
                          size="sm"
                          placeholder="Type your login code..."
                          type="text"
                          value={loginCode}
                          onChange={e => setLoginCode(e.target.value)}
                        />
                        <Button onClick={loginByID} size="sm" variant="outline-info" block className="mt-2">
                          Login By Code
                        </Button>

                        {signInError && (
                          <Alert variant="danger" className="mt-4 mb-0 p-2 smallFont">
                            {signInErrorMsg}
                          </Alert>
                        )}
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
