import { Text, TextInput } from "react-native";
import React from "react";
import { styles } from "./styles";

const FormInput = (props) => {
  const { label } = props;
  const [focus, setFocus] = React.useState(false);
  const customStyle = focus ? styles.input_focus : styles.input;
  return (
    <>
      <Text style={styles.form_text}>{props.title}</Text>
      <TextInput
        onBlur={() => setFocus(false)}
        onFocus={() => setFocus(true)}
        style={customStyle}
        {...props}
      />
    </>
  );
};

export default FormInput;
