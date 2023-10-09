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
import qs from "qs"; // Import qs for URL encoding

const Login = () => {
  const [email, setEmail] = useState(""); // Change to email
  const [password, setPassword] = useState(""); // Change to password

  const handleLogin = async () => {
    console.log("Login button pressed");
    console.log("Email: " + email); // Change to email
    console.log("Password: " + password);

    try {
      // Convert the data to URL-encoded format
      const data = qs.stringify({
        email, // Change to email
        password,
      });

      const response = await axios.post("/login", data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      console.log("Login successful. Response:", response.data);
      Alert.alert("Login Successful", response.data.message);

      // Store the token securely
      await AsyncStorage.setItem("token", response.data.token);

      // Navigate to the next screen or perform any other actions here
    } catch (error) {
      console.error("Login failed. Error:", error);
      Alert.alert(
        "Login Failed",
        "Invalid email or password. Please try again."
      );
    }
  };

  const handleRegisterPress = () => {
    Alert.alert(
      "Register Here Pressed",
      "You can navigate to the registration screen here."
    );
    // Add navigation logic to navigate to the registration screen if needed
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
            {/* Title and Sally-44 */}
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

            {/* LOGIN text */}
            <View style={styles.loginTextContainer}>
              <Text style={styles.loginText}>LOGIN</Text>
              <View style={styles.line} />
            </View>

            {/* Input for Email */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholderTextColor="#2196F3"
                style={styles.input}
                value={email} // Change to email
                onChangeText={setEmail} // Change to setEmail
              />
              <Text style={styles.inputLabel}>Email</Text>
            </View>

            {/* Input for Password */}
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

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            {/* "Register Here!" text */}
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
});

export default Login;
