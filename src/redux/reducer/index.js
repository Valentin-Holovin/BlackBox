import { combineReducers } from "redux";
import loginReducer from "./loginReducer";
import registerReducer from "./registerReducer";
import { persistReducer } from "redux-persist";
import { AsyncStorage } from "react-native";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["login"],
};

const rootReducer = combineReducers({
  login: loginReducer,
  register: registerReducer,
});

export default persistReducer(persistConfig, rootReducer);
