import { View, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "./styles";
import MenuButton from "../../components/MenuButton/MenuButton";

const MenuScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.button_block}>
        {/* <TouchableOpacity>
          <MenuButton title="Register New Device" />
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <MenuButton title="Dashboard" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("View Devices")}>
          <MenuButton title="View Devices" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Raw Data")}>
          <MenuButton title="Raw Data" />
        </TouchableOpacity>
        <TouchableOpacity>
          <MenuButton title="Privacy Policy" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MenuScreen;
