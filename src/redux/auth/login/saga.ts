import { takeEvery, fork, put, all, call } from "redux-saga/effects";

// ✅ Correctly imports Login action types from its local folder structure
import { AuthLoginActionTypes } from "./types";
import {
  authLoginApiResponseSuccess,
  authLoginApiResponseError,
} from "./actions";

import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import { postFakeLogin, postJwtLogin, postSocialLogin } from "../../../api/index";
import config from "../../../config";

const fireBaseBackend: any = getFirebaseBackend();

function* loginUser({ payload: { user } }: any) {
  try {
    const defaultAuth = config.DEFAULTAUTH;
    let response: any;

    if (defaultAuth === "firebase") {
      response = yield call(fireBaseBackend.loginUser, user.email, user.password);
    } else if (defaultAuth === "jwt") {
      response = yield call(postJwtLogin, { email: user.email, password: user.password });
    } else {
      response = yield call(postFakeLogin, { email: user.email, password: user.password });
    }

    // Save user session locally for layout auth route checking
    localStorage.setItem("authUser", JSON.stringify(response));
    
    yield put(authLoginApiResponseSuccess(AuthLoginActionTypes.LOGIN_USER, response));
    
    // ✅ REMOVED history.push to prevent the crash. The component will handle redirection natively.

  } catch (error: any) {
    const errorMessage = error?.message || error?.description || "Invalid email or password.";
    yield put(authLoginApiResponseError(AuthLoginActionTypes.LOGIN_USER, errorMessage));
  }
}

function* logoutUser() {
  try {
    const defaultAuth = config.DEFAULTAUTH;
    if (defaultAuth === "firebase") {
      yield call(fireBaseBackend.logout);
    }
    localStorage.removeItem("authUser");
    yield put(authLoginApiResponseSuccess(AuthLoginActionTypes.LOGOUT_USER, "User Logged Out Successfully"));
  } catch (error: any) {
    const errorMessage = error?.message || "Failed to log out cleanly.";
    yield put(authLoginApiResponseError(AuthLoginActionTypes.LOGOUT_USER, errorMessage));
  }
}

function* socialLogin({ payload: { data, type } }: any) {
  try {
    const defaultAuth = config.DEFAULTAUTH;
    let response: any;
    if (defaultAuth === "firebase") {
      response = yield call(fireBaseBackend.socialLoginUser, data, type);
    } else {
      response = yield call(postSocialLogin, data);
    }
    localStorage.setItem("authUser", JSON.stringify(response));
    yield put(authLoginApiResponseSuccess(AuthLoginActionTypes.SOCIAL_LOGIN, response));
    
    // ✅ REMOVED history.push from here as well to protect social auth routines.
    
  } catch (error: any) {
    const errorMessage = error?.message || "Social login initialization failed.";
    yield put(authLoginApiResponseError(AuthLoginActionTypes.SOCIAL_LOGIN, errorMessage));
  }
}

export function* watchUserLogin() { yield takeEvery(AuthLoginActionTypes.LOGIN_USER, loginUser); }
export function* watchUserLogout() { yield takeEvery(AuthLoginActionTypes.LOGOUT_USER, logoutUser); }
export function* watchSocialLogin() { yield takeEvery(AuthLoginActionTypes.SOCIAL_LOGIN, socialLogin); }

function* loginSaga() {
  yield all([fork(watchUserLogin), fork(watchUserLogout), fork(watchSocialLogin)]);
}

export default loginSaga;
