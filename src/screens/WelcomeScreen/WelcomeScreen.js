import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "./styles";

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Image
          style={styles.image}
          source={require("../../components/images/hello.png")}
        />
      </View>

      <View style={styles.button_container}>
        <View style={styles.text_block}>
          <Text style={styles.title_text}>Welcome to </Text>
          <Text style={styles.title_text}>Black Box Controls</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.text_button}>Login</Text>
        </TouchableOpacity>
        <View style={styles.text_info_block}>
          <View style={styles.line}></View>
          <Text style={styles.text_info}>Or New Account</Text>
          <View style={styles.line}></View>
        </View>
        <TouchableOpacity
          style={styles.button_new}
          onPress={() => navigation.navigate("New Account")}
        >
          <Text style={styles.text_button_new}>New Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeScreen;
