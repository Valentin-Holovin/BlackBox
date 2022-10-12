import { View, Text, TextInput, Pressable } from "react-native";
import React from "react";
import { styles } from "./styles";
import { useTogglePasswordVisibility } from "../../hooks/useTogglePasswordVisibility";
import { Feather } from "@expo/vector-icons";

const PasswordInput = (props) => {
  const { label } = props;
  const [focus, setFocus] = React.useState(false);

  const customStyle = focus ? styles.input_focus : styles.input;

  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();
  return (
    <View>
      <Text style={styles.form_text}>{props.title}</Text>
      <TextInput
        onBlur={() => setFocus(false)}
        onFocus={() => setFocus(true)}
        secureTextEntry={passwordVisibility}
        style={customStyle}
        autoCapitalize="none"
        {...props}
      />
      <Pressable
        style={styles.password_icon}
        onPress={handlePasswordVisibility}
      >
        <Feather name={rightIcon} size={24} color="#9DA4AE" />
      </Pressable>
    </View>
  );
};

export default PasswordInput;
