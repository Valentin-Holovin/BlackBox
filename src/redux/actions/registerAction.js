import { register } from "../../api/register/register";

export const SET_FIRST_NAME = "SET_FIRST_NAME";
export const SET_LAST_NAME = "SET_LAST_NAME";
export const SET_EMAIL = "SET_EMAIL";
export const SET_PASSWORD = "SET_PASSWORD";
export const SET_CONFIRM_PASSWORD = "SET_CONFIRM_PASSWORD";

export const setFirstName = (firstName) => ({
  type: SET_FIRST_NAME,
  payload: firstName,
});

export const setLastName = (lastName) => ({
  type: SET_LAST_NAME,
  payload: lastName,
});

export const setEmail = (email) => ({
  type: SET_EMAIL,
  payload: email,
});

export const setPassword = (password) => ({
  type: SET_PASSWORD,
  payload: password,
});

export const setConfirmPassword = (confirmPassword) => ({
  type: SET_CONFIRM_PASSWORD,
  payload: confirmPassword,
});

export const registration =
  (callback, errorCallback) => async (dispatch, getState) => {
    try {
      const firstName = getState().register.firstName;
      const lastName = getState().register.lastName;
      const email = getState().register.email;
      const password = getState().register.password;
      const confirmPassword = getState().register.confirmPassword;
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return;
      }
      const response = await register(
        firstName,
        lastName,
        email,
        password,
        confirmPassword
      );

      if (response) {
        callback();
      }
    } catch (e) {
      if (errorCallback) {
        errorCallback("Invalid login attempt.");
      }
    }
  };
