import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import axios from "../api/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import qs from "qs";
import { useNavigation } from "@react-navigation/native";
import RegisterScreen from "./RegisterScreen"; // Adjust the path as needed

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const data = qs.stringify({ email, password });
      console.log(data);

      const response = await axios.post("/login", data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.data && response.data.message === "Login successful") {
        console.log(response.data);
        Alert.alert("Login Successful", "User logged in successfully!");
        // Navigate to MapsScreen
        navigation.navigate("MapsScreen");
      } else {
        Alert.alert(
          "Login Failed",
          "Invalid email or password. Please try again."
        );
      }
    } catch (error) {
      Alert.alert(
        "Login Failed",
        "An error occurred during login. Please try again."
      );
    }
  };

  const handleRegisterPress = () => {
    navigation.navigate("RegisterScreen"); // Correct navigation to RegisterScreen
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View style={styles.backgroundImageContainer}>
          <Image
            source={require("../../assets/Saly-6.png")}
            style={styles.backgroundImage}
          />
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.titleContainer}>
              <Image
                source={require("../../assets/Title.png")}
                style={styles.titleImage}
              />
              <Image
                source={require("../../assets/Saly-44.png")}
                style={styles.salyImage}
              />
            </View>
            <View style={styles.loginTextContainer}>
              <Text style={styles.loginText}>LOGIN</Text>
              <View style={styles.line} />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholderTextColor="#2196F3"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
              />
              <Text style={styles.inputLabel}>Email</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholderTextColor="#2196F3"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <Text style={styles.inputLabel}>Password</Text>
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.registerContainer}
              onPress={handleRegisterPress}
            >
              <Text style={styles.registerText}>Register</Text>
              <Text style={styles.boldText}> Here!</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginLeft: 40,
  },
  titleImage: {
    marginRight: 20,
    marginTop: -60,
  },
  salyImage: {
    width: 200,
    height: 200,
  },
  inputContainer: {
    width: "80%",
    marginBottom: 20,
    position: "relative",
  },
  inputLabel: {
    color: "#2196F3",
    fontSize: 14,
    position: "absolute",
    top: -12,
    left: 15,
    zIndex: 1,
    backgroundColor: "#FFFFFF",
    paddingLeft: 5,
    paddingRight: 5,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "transparent",
    borderColor: "#2196F3",
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 5,
    borderRadius: 10,
  },
  loginButton: {
    width: "80%",
    height: 60,
    backgroundColor: "#FFA500",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginTextContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  loginText: {
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#59597C",
  },
  saly6Image: {
    width: 600,
    height: 600,
    marginTop: -120,
  },
  registerContainer: {
    position: "relative",
    top: 5,
    right: 0,
    height: 50,
    flexDirection: "row",
    marginTop: 10,
  },
  registerText: {
    color: "#2196F3",
  },
  boldText: {
    fontWeight: "bold",
  },
  line: {
    width: 350,
    height: 2,
    backgroundColor: "#9E9E9E",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    position: "absolute", // Use absolute positioning
    bottom: -450, // Position at the bottom
  },
  registerButton: {
    width: "100%",
    height: 60,
    backgroundColor: "#FFA500",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Login;
