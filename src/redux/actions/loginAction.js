import { login } from "../../api/login/login";

export const SET_USER_NAME = "SET_USER_NAME";
export const SET_PASSWORD = "SET_PASSWORD";
export const SET_TOKEN = "SET_TOKEN";

export const setUserName = (userName) => ({
  type: SET_USER_NAME,
  payload: userName,
});

export const setPassword = (password) => ({
  type: SET_PASSWORD,
  payload: password,
});

export const setToken = (token) => ({
  type: SET_TOKEN,
  payload: token,
});

export const signIn =
  (callback, errorCallback) => async (dispatch, getState) => {
    try {
      const userName = getState().login.userName;
      const password = getState().login.password;

      if (!userName || !password) {
        return;
      }
      const response = await login(userName, password);
      if (response.data.JwtToken) {
        dispatch(setToken(response.data.JwtToken));
        callback();
      }
    } catch (e) {
      if (errorCallback) {
        errorCallback("Invalid login attempt.");
      }
    }
  };
