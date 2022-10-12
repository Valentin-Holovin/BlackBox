import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "./styles";

const MenuButton = ({ title }) => {
  return (
    <View style={styles.button}>
      <Text style={styles.text_button}>{title}</Text>
    </View>
  );
};

export default MenuButton;
