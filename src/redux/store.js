import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducer/index";
import thunkMiddleware from "redux-thunk";
import { persistStore } from "redux-persist";

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
export const persistor = persistStore(store);

export default store;
