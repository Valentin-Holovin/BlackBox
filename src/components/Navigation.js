import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/WelcomeScreen/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen/LoginScreen";
import NewAccount from "../screens/NewAccount/NewAccount";
import AfterRegisterScreen from "../screens/AfterRegisterScreen/AfterRegisterScreen";
import DrawerNavigation from "./DrawerNavigation";

import OtherDevicesScreen from "../screens/OtherDevicesScreen/OtherDevicesScreen";
import ViewDevicesScreen from "../screens/ViewDevicesScreen/ViewDevicesScreen";
import { useSelector } from "react-redux";

const AuthStackNavigator = () => {
  const AuthStack = createNativeStackNavigator();

  return (
    <AuthStack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerTitleAlign: "center",
        headerShadowVisible: false,
      }}
    >
      <AuthStack.Screen
        component={WelcomeScreen}
        name="Welcome"
        options={{ headerShown: false }}
      />
      <AuthStack.Screen component={LoginScreen} name="Login" />
      <AuthStack.Screen component={NewAccount} name="New Account" />
      <AuthStack.Screen component={AfterRegisterScreen} name=" New Account " />
    </AuthStack.Navigator>
  );
};

const AppStackNavigator = () => {
  const AppStack = createNativeStackNavigator();

  return (
    <AppStack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerShadowVisible: false,
      }}
    >
      <AppStack.Screen
        component={DrawerNavigation}
        name="Drawer"
        options={{ headerShown: false }}
      />
    </AppStack.Navigator>
  );
};

const Navigation = () => {
  const Stack = createNativeStackNavigator();
  const token = useSelector((state) => state.login.token);

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      >
        {token ? (
          <Stack.Screen
            name="App"
            options={{
              headerShown: false,
            }}
            component={AppStackNavigator}
          />
        ) : (
          <Stack.Screen
            name="Auth"
            options={{
              headerShown: false,
            }}
            component={AuthStackNavigator}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
