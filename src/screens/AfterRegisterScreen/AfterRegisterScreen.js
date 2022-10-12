import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "./styles";

const AfterRegisterScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.block_info}>
        <View style={styles.title_text_block}>
          <Text style={styles.title_text}>Please check your email to</Text>
          <Text style={styles.title_text}>confirm registration</Text>
        </View>
        <View style={styles.circle}>
          <Image
            style={styles.image}
            source={require("../../components/images/box.png")}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.text_button}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AfterRegisterScreen;
