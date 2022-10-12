import axiosInstance from "../axios/axios";

export const register = (
  FirstName,
  LastName,
  Email,
  Password,
  ConfirmPassword
) => {
  return axiosInstance.post("accounts/register", {
    FirstName,
    LastName,
    Email,
    Password,
    ConfirmPassword,
  });
};
