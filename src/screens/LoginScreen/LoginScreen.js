import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import { styles } from "./styles";
import FormInput from "../../components/FormInput/FormInput";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import { connect } from "react-redux";
import {
  setPassword,
  setUserName,
  signIn,
} from "../../redux/actions/loginAction";

const LoginScreen = ({
  navigation,
  userName,
  password,
  setUserName,
  setPassword,
  signIn,
}) => {
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const updateError = (error, stateUpdater) => {
    stateUpdater(error);
    setTimeout(() => {
      stateUpdater("");
    }, 2500);
  };

  const isValidForm = () => {
    if (!userName && !password)
      return updateError("Required all fields", setError);
    if (!userName || userName.length < 3)
      return updateError("Invalid email!", setError);
    if (!password || password.length < 5)
      return updateError("Password is less then 5 characters!", setError);
    return true;
  };

  const submitForm = () => {
    if (isValidForm()) {
      setLoading(true);
      signIn(() => {
        navigation.replace("App");
        setLoading(false)
      }, (error) => {
        setError(error)
        setLoading(false)
      });
    } else {
      // setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.text_error}>{error}</Text> : null}
      <View style={styles.login_form}>
        <View>
          <FormInput
            value={userName}
            onChangeText={(value) => {
              setUserName(value);
              setError("");
            }}
            title="Email"
          />
        </View>
        <View style={styles.password_input_block}>
          <PasswordInput
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              setError("");
            }}
            title="Enter Password"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={submitForm}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFFFFF" />
        ) : (
          <Text style={styles.text_button}>Submit</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const mapStateToProps = (state) => ({
  userName: state.login.userName,
  password: state.login.password,
  loading: state.login.loading
});

const mapDispatchToProps = {
  setUserName: setUserName,
  setPassword: setPassword,
  signIn: signIn,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
