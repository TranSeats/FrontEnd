import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import LoginScreen from './src/Screens/LoginScreen'; // Correct import statement for LoginScreen
import RegisterScreen from './src/Screens/RegisterScreen'; // Correct import statement for RegisterScreen

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
  },
};

export default class App extends React.Component {

  render() {
    return (
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="LoginScreen" // Change the initial route to LoginScreen
        >
          {/* ... other screens ... */}
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          {/* ... other screens ... */}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
