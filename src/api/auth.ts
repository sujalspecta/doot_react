import { APIClient } from "./apiCore";
import * as url from "./urls";

const api = new APIClient();

// postForgetPwd
const postFakeForgetPwd = (data: any) =>
  api.create(url.POST_FAKE_PASSWORD_FORGET, data);

// postForgetPwd
const postJwtForgetPwd = (data: any) =>
  api.create(url.POST_FAKE_JWT_PASSWORD_FORGET, data);

// Replace your old postFakeLogin line with this local interceptor:
const postFakeLogin = (data: any) => {
  return Promise.resolve({
    id: 1,
    name: "Admin User",
    email: data.email,
    token: "mock-jwt-token-string",
  });
};

const postJwtLogin = (data: any) => api.create(url.POST_FAKE_JWT_LOGIN, data);

// Register Method
const postFakeRegister = (data: any) => {
  return api.create(url.POST_FAKE_REGISTER, data);
};

// Register Method
const postJwtRegister = (data: any) => {
  return api.create(url.JWT_REGISTER, data);
};
const changePassword = (data: object) => {
  return api.update(url.USER_CHANGE_PASSWORD, data);
};

// postSocialLogin
const postSocialLogin = (data: any) => api.create(url.SOCIAL_LOGIN, data);

export {
  postFakeForgetPwd,
  postJwtForgetPwd,
  postFakeLogin,
  postJwtLogin,
  postFakeRegister,
  postJwtRegister,
  changePassword,
  postSocialLogin,
};
