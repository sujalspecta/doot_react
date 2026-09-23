import { takeEvery, fork, put, all, call } from "redux-saga/effects";

// Import Forget Password Redux States
import { AuthForgetPassActionTypes } from "./types";
import {
  authForgetPassApiResponseSuccess,
  authForgetPassApiResponseError,
} from "./actions";

// Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";

import {
  postFakeForgetPwd,
  postJwtForgetPwd,
  changePassword as changePasswordApi,
} from "../../../api/index";

// Clean Vite configuration variable parsing
import config from "../../../config";

const fireBaseBackend: any = getFirebaseBackend();

function* forgetUser({ payload: user }: any) {
  try {
    const defaultAuth = config.DEFAULTAUTH;

    if (defaultAuth === "firebase") {
      yield call(fireBaseBackend.forgetPassword, user.email);
      yield put(
        authForgetPassApiResponseSuccess(
          AuthForgetPassActionTypes.FORGET_PASSWORD,
          "Reset link are sended to your mailbox, check there first"
        )
      );
    } else if (defaultAuth === "jwt") {
      yield call(postJwtForgetPwd, { email: user.email });
      yield put(
        authForgetPassApiResponseSuccess(
          AuthForgetPassActionTypes.FORGET_PASSWORD,
          "Reset link are sended to your mailbox, check there first"
        )
      );
    } else {
      yield call(postFakeForgetPwd, { email: user.email });
      yield put(
        authForgetPassApiResponseSuccess(
          AuthForgetPassActionTypes.FORGET_PASSWORD,
          "Reset link are sended to your mailbox, check there first"
        )
      );
    }
  } catch (error: any) {
    const errorMessage = error?.message || error?.description || "Something went wrong. Please try again.";
    yield put(
      authForgetPassApiResponseError(
        AuthForgetPassActionTypes.FORGET_PASSWORD,
        errorMessage
      )
    );
  }
}

function* changePassword({ payload: newPassword }: any) {
  try {
    yield call(changePasswordApi, newPassword);
    yield put(
      authForgetPassApiResponseSuccess(
        AuthForgetPassActionTypes.CHANGE_PASSWORD,
        "Your Password is Changed"
      )
    );
  } catch (error: any) {
    const errorMessage = error?.message || error?.description || "Failed to update password.";
    yield put(
      authForgetPassApiResponseError(
        AuthForgetPassActionTypes.CHANGE_PASSWORD,
        errorMessage
      )
    );
  }
}

export function* watchUserPasswordForget() {
  yield takeEvery(AuthForgetPassActionTypes.FORGET_PASSWORD, forgetUser);
}

export function* watchUserChangePassword() {
  yield takeEvery(AuthForgetPassActionTypes.CHANGE_PASSWORD, changePassword);
}

function* forgetPasswordSaga() {
  yield all([fork(watchUserPasswordForget), fork(watchUserChangePassword)]);
}

export default forgetPasswordSaga;
