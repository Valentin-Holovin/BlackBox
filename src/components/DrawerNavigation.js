import React from "react";
import {
  createDrawerNavigator,
  DrawerItem,
  DrawerItemList,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import DashboardScreen from "../screens/DashboardScreen/DashboardScreen";
import ViewDevicesScreen from "../screens/ViewDevicesScreen/ViewDevicesScreen";
import RawDataScreen from "../screens/RawDataScreen/RawDataScreen";
import DevicesScreen from "../screens/DevicesScreen/DevicesScreen";
import AboutScreen from "../screens/AboutScreen/AboutScreen";
import OtherDevicesScreen from "../screens/OtherDevicesScreen/OtherDevicesScreen";
import { View, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import {
  setPassword,
  setToken,
  setUserName,
} from "../redux/actions/loginAction";

const RCTNetworking = require("react-native/Libraries/Network/RCTNetworking");

const bbc_logo_blue = require("../../assets/bbc-logo-blue.png");

const Drawer = createDrawerNavigator();

const ImageView = () => {
  return (
    <View
      style={{
        height: 140,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        style={{ width: 240, height: 90, marginTop: 40 }}
        source={bbc_logo_blue}
      />
    </View>
  );
};

const CustomDrawer = (props) => {
  const dispatch = useDispatch();

  return (
    <View style={{ flex: 1 }}>
      <ImageView />
      <DrawerContentScrollView>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <DrawerItem
        label="Logout"
        style={{ marginBottom: 20 }}
        onPress={() => {
          RCTNetworking.clearCookies(() => {});
          dispatch(setToken(null));
          dispatch(setUserName(null));
          dispatch(setPassword(null));
        }}
        icon={(size, color) => {
          <MaterialCommunityIcons name="logout" size={size} color="color" />;
        }}
      />
    </View>
  );
};

const MyDrawer = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Devices" component={DevicesScreen} />
      <Drawer.Screen name="Raw Data" component={RawDataScreen} />
      <Drawer.Screen name="GDPR" component={AboutScreen} />

      <Drawer.Screen
        name="Other Devices"
        component={OtherDevicesScreen}
        options={{
          drawerLabel: () => null,
          title: null,
          drawerItemStyle: { height: 0 },
        }}
      />
      <Drawer.Screen
        name="View Devices"
        component={ViewDevicesScreen}
        options={{
          drawerLabel: () => null,
          title: null,
          drawerItemStyle: { height: 0 },
        }}
      />
    </Drawer.Navigator>
  );
};

const DrawerNavigation = () => {
  return <MyDrawer />;
};

export default DrawerNavigation;
