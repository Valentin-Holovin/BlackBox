import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import { styles } from "./styles";
import FormInput from "../../components/FormInput/FormInput";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import { connect } from "react-redux";
import {
  setFirstName,
  setLastName,
  setEmail,
  setPassword,
  setConfirmPassword,
  registration,
} from "../../redux/actions/registerAction";
import { useNavigation } from "@react-navigation/native";

const NewAccount = (props) => {
  const [userInfo, setUserInfo] = React.useState({
    fullName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const isValidObjField = (obj) => {
    return Object.values(obj).every((value) => value.trim());
  };

  const updateError = (error, stateUpdater) => {
    stateUpdater(error);
    setTimeout(() => {
      stateUpdater("");
    }, 2500);
  };

  const isValidEmail = (value) => {
    const regx =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regx.test(value);
  };

  const { fullName, lastName, email, password, confirmPassword } = userInfo;

  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({ ...userInfo, [fieldName]: value });
  };

  const isValidForm = () => {
    if (!isValidObjField(userInfo))
      return updateError("Require all fields", setError);
    if (!fullName.trim() || fullName.length < 3)
      return updateError("Invalid full name!", setError);
    if (!lastName.trim() || lastName.length < 3)
      return updateError("Invalid last name!", setError);
    if (!isValidEmail(email)) return updateError("Invalid email!", setError);
    if (!password.trim() || password.length < 5)
      return updateError("Password is less then 5 characters!", setError);
    if (password !== confirmPassword)
      return updateError("Password does not match!", setError);
    // if (!postcode.trim() || postcode.length < 2)
    //   return updateError("Invalid Postcode", setError);

    return true;
  };

  const navigation = useNavigation();

  const submitForm = () => {
    if (isValidForm()) {
      setLoading(true);
      props.registration(
        () => {
          navigation.replace(" New Account ");
        },
        (error) => {
          setError(error);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.text_error}>{error}</Text> : null}
      <View style={styles.form_container}>
        <View style={styles.form_block}>
          <FormInput
            value={props.firstName}
            onChangeText={(text) => {
              props.setFirstName(text);
              handleOnChangeText(text, "fullName");
            }}
            title="Full Name"
          />
        </View>
        <View style={styles.form_block}>
          <FormInput
            value={props.lastName}
            onChangeText={(text) => {
              props.setLastName(text);
              handleOnChangeText(text, "lastName");
            }}
            title="Last Name"
          />
        </View>
        <View style={styles.form_block}>
          <FormInput
            value={props.email}
            onChangeText={(text) => {
              props.setEmail(text);
              handleOnChangeText(text, "email");
            }}
            title="Email"
          />
        </View>
        <View style={styles.form_block}>
          <PasswordInput
            value={props.password}
            onChangeText={(text) => {
              props.setPassword(text);
              handleOnChangeText(text, "password");
            }}
            title="Password"
          />
        </View>

        <View style={styles.form_block}>
          <FormInput
            onChangeText={(text) => {
              props.setConfirmPassword(text);
              handleOnChangeText(text, "confirmPassword");
            }}
            value={props.confirmPassword}
            title="Confirm Password"
            secureTextEntry={true}
          />
        </View>
        {/* <View style={styles.form_block}>
          <FormInput
            value={postcode}
            onChangeText={(value) => handleOnChangeText(value, "postcode")}
            title="Postcode"
          />
        </View> */}
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
  firstName: state.register.firstName,
  lastName: state.register.lastName,
  email: state.register.email,
  password: state.register.password,
  confirmPassword: state.register.confirmPassword,
});

const mapDispatchToProps = {
  setFirstName: setFirstName,
  setLastName: setLastName,
  setEmail: setEmail,
  setPassword: setPassword,
  setConfirmPassword: setConfirmPassword,
  registration: registration,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewAccount);
