import React from "react";
import "react-native-gesture-handler";
import Navigation from "./src/components/Navigation";
import { Provider } from "react-redux";
import store, { persistor } from "./src/redux/store";
import { PersistGate } from "redux-persist/integration/react";

const App = () => {
  return (
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <Navigation />
      </Provider>
    </PersistGate>
  );
};

export default App;
