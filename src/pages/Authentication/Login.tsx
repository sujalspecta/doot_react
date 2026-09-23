import React, { useEffect, useState } from "react";
import {
  Alert,
  Row,
  Col,
  Form,
  Label,
  Button,
  UncontrolledTooltip,
} from "reactstrap";

// Social Media Imports
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

// Router
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

// Validations
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

// Config
import config from "../../config";

// Hooks
import { useProfile, useRedux } from "../../hooks/index";
import { createSelector } from "reselect";

// Actions
import { loginUser, socialLogin } from "../../redux/actions";

// Components
import NonAuthLayoutWrapper from "../../components/NonAutnLayoutWrapper";
import AuthHeader from "../../components/AuthHeader";
import FormInput from "../../components/FormInput";
import Loader from "../../components/Loader";

interface LoginProps {}

const Login = (props: LoginProps) => {
  // Global store
  const { dispatch, useAppSelector } = useRedux();

  const errorData = createSelector(
    (state: any) => state.Login,
    (state) => ({
      isUserLogin: state.isUserLogin,
      error: state.error,
      loginLoading: state.loading,
      isUserLogout: state.isUserLogout,
    })
  );

  // Inside your component
  const { isUserLogin, error, loginLoading, isUserLogout } = useAppSelector(errorData);

  const navigate = useNavigate();
  const location = useLocation();
  const [redirectUrl, setRedirectUrl] = useState("/");

  useEffect(() => {
    const url =
      location.state && location.state.from
        ? location.state.from.pathname
        : "/";
    setRedirectUrl(url);
  }, [location]);

  useEffect(() => {
    if (isUserLogin && !loginLoading && !isUserLogout) {
      navigate(redirectUrl);
    }
  }, [isUserLogin, navigate, loginLoading, isUserLogout, redirectUrl]);

  const resolver = yupResolver(
    yup.object().shape({
      email: yup.string().required("Please Enter E-mail."),
      password: yup.string().required("Please Enter Password."),
    })
  );

  const defaultValues: any = {
    email: "admin@themesbrand.com",
    password: "123456",
  };

  const methods = useForm({ defaultValues, resolver });
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = methods;

  const onSubmitForm = async (values: object) => {
    // Pass clean parameters straight to the updated Saga (no history needed anymore)
    dispatch(loginUser({ user: values }));
  };

  const { userProfile, loading } = useProfile();

  if (userProfile && !loading) {
    return <Navigate to={{ pathname: redirectUrl }} />;
  }

  const signIn = (res: any, type: "google" | "facebook") => {
    if (type === "google" && res) {
      const postData = {
        name: res.profileObj?.name,
        email: res.profileObj?.email,
        token: res.tokenObj?.access_token,
        idToken: res.tokenId,
      };
      dispatch(socialLogin({ data: postData, type }));
    } else if (type === "facebook" && res) {
      const postData = {
        name: res.name,
        token: res.accessToken,
      };
      dispatch(socialLogin({ data: postData, type }));
    }
  };

  // HandleFacebookLoginResponse
  const facebookResponse = (response: object) => {
    signIn(response, "facebook");
  };

  // HandleGoogleLoginResponse
  const googleResponse = (response: object) => {
    signIn(response, "google");
  };

  return (
    <NonAuthLayoutWrapper>
      <Row className="justify-content-center my-auto">
        <Col sm={8} lg={6} xl={5} className="col-xxl-4">
          <div className="py-md-5 py-4">
            <AuthHeader
              title="Welcome Back !"
              subtitle="Sign in to continue to Doot."
            />

            {error && (
              <Alert color="danger">
                {typeof error === "object" ? error.message || JSON.stringify(error) : String(error)}
              </Alert>
            )}

            <Form onSubmit={handleSubmit(onSubmitForm)} className="position-relative">
              {loginLoading && <Loader />}
              <div className="mb-3">
                <FormInput
                  label="Username"
                  type="text"
                  name="email"
                  register={register}
                  errors={errors}
                  control={control}
                  labelClassName="form-label"
                  placeholder="Enter username"
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <FormInput
                  label="Password"
                  type="password"
                  name="password"
                  register={register}
                  errors={errors}
                  control={control}
                  labelClassName="form-label"
                  className="form-control pe-5"
                  placeholder="Enter Password"
                />
              </div>

              <div className="form-check form-check-info font-size-16">
                <input className="form-check-input" type="checkbox" id="remember-check" />
                <Label className="form-check-label font-size-14" htmlFor="remember-check">
                  Remember me
                </Label>
              </div>

              <div className="text-center mt-4">
                <Button color="primary" className="w-100" type="submit">
                  Log In
                </Button>
              </div>

              <div className="mt-4 text-center">
                <div className="signin-other-title">
                  <h5 className="font-size-14 mb-4 title">Sign in with</h5>
                </div>
                <Row className="">
                  <div className="col-4">
                    <div>
                      <FacebookLogin
                        appId={config.FACEBOOK.APP_ID}
                        autoLoad={false}
                        callback={facebookResponse}
                        render={(renderProps: any) => (
                          <button
                            type="button"
                            className="btn btn-light w-100"
                            id="facebook"
                            onClick={renderProps.onClick}
                          >
                            <i className="mdi mdi-facebook text-indigo"></i>
                          </button>
                        )}
                      />
                    </div>
                    <UncontrolledTooltip placement="top" target="facebook" fade={false} transition={{ timeout: 150 }}>
                      Facebook
                    </UncontrolledTooltip>
                  </div>
                  <div className="col-4">
                    <div>
                      <button type="button" className="btn btn-light w-100" id="twitter">
                        <i className="mdi mdi-twitter text-info"></i>
                      </button>
                    </div>
                    <UncontrolledTooltip placement="top" target="twitter" fade={false} transition={{ timeout: 150 }}>
                      Twitter
                    </UncontrolledTooltip>
                  </div>
                  <div className="col-4">
                    <div>
                      <GoogleLogin
                        clientId={config.GOOGLE.CLIENT_ID ? config.GOOGLE.CLIENT_ID : ""}
                        onSuccess={googleResponse}
                        onFailure={googleResponse}
                        render={(renderProps) => (
                          <button
                            type="button"
                            className="btn btn-light w-100"
                            id="google"
                            onClick={renderProps.onClick}
                            disabled={renderProps.disabled}
                          >
                            <i className="mdi mdi-google text-danger"></i>
                          </button>
                        )}
                      />
                    </div>
                    <UncontrolledTooltip placement="top" target="google" fade={false} transition={{ timeout: 150 }}>
                      Google
                    </UncontrolledTooltip>
                  </div>
                </Row>
              </div>
            </Form>

            <div className="mt-5 text-center">
              <p>
                Don't have an account ?{" "}
                <Link to="/register" className="font-weight-medium text-primary">
                  Signup now
                </Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </NonAuthLayoutWrapper>
  );
};

export default Login;
