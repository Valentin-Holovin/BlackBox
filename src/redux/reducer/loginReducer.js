import {
  SET_USER_NAME,
  SET_PASSWORD,
  SET_TOKEN,
} from "../actions/loginAction";

const initialState = {
  userName: "",
  password: "",
  token: null,
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_NAME:
      return {
        ...state,
        userName: action.payload,
      };
    case SET_PASSWORD:
      return {
        ...state,
        password: action.payload,
      };
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    
    default:
      return state;
  }
};

export default loginReducer;
