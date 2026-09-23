import { takeEvery, fork, put, all, call } from "redux-saga/effects";

// Account Redux states
import { AuthRegisterActionTypes } from "./types";
import {
  authRegisterApiResponseSuccess,
  authRegisterApiResponseError,
} from "./actions";

// Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import { postFakeRegister, postJwtRegister } from "../../../api/index";

// Clean Vite configuration variable parsing
import config from "../../../config";

// initialize relavant method of both Auth
const fireBaseBackend = getFirebaseBackend();

// Is user register successfull then direct plot user in redux.
function* registerUser({ payload: { user } }: any) {
  try {
    // 1. Fixed configuration parsing to use our safe Vite config import
    const defaultAuth = config.DEFAULTAUTH;

    if (defaultAuth === "firebase") {
      const response: Promise<any> = yield call(
        fireBaseBackend.registerUser,
        user.email,
        user.password
      );
      yield put(
        authRegisterApiResponseSuccess(
          AuthRegisterActionTypes.REGISTER_USER,
          response
        )
      );
    } else if (defaultAuth === "jwt") {
      const response: Promise<any> = yield call(postJwtRegister, user);
      yield put(
        authRegisterApiResponseSuccess(
          AuthRegisterActionTypes.REGISTER_USER,
          response
        )
      );
    } else if (defaultAuth === "fake" || !defaultAuth) {
      const response: Promise<any> = yield call(postFakeRegister, user);
      yield put(
        authRegisterApiResponseSuccess(
          AuthRegisterActionTypes.REGISTER_USER,
          response
        )
      );
    }
  } catch (error: any) {
    // 2. Extracts the text string instead of sending the raw Error object to prevent UI crashes
    const errorMessage = error?.message || error?.description || "Registration failed. Please try again.";
    yield put(
      authRegisterApiResponseError(AuthRegisterActionTypes.REGISTER_USER, errorMessage)
    );
  }
}

export function* watchUserRegister() {
  yield takeEvery(AuthRegisterActionTypes.REGISTER_USER, registerUser);
}

function* registerSaga() {
  yield all([fork(watchUserRegister)]);
}

export default registerSaga;
