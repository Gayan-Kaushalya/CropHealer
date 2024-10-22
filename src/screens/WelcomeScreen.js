import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Image
        source={require("./../../assets/CropHealer Logo.jpg")}
        style={{ width: 200, height: 200 }}
      />

      <Text style={{ color: "green", fontSize: 42, fontWeight: "bold" }}>
        Welcome to CropHealer!
      </Text>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginTop: 20,
          marginBottom: 20,
          alignContent: "center",
          color: "black",
        }}
      >
        Your AI Powered Plant Disease Identifier
      </Text>

      {/* Add a button to navigate to the Prediction screen */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Predict")}
        style={{
          backgroundColor: "green",
          padding: 10,
          borderRadius: 5,
          width: "80%",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Diagnose
        </Text>
      </TouchableOpacity>



      <TouchableOpacity
        onPress={() => navigation.navigate("Article List")}
        style={{
          backgroundColor: "green",
          padding: 10,
          borderRadius: 5,
          width: "80%",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Explore
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={{
          backgroundColor: "green",
          padding: 10,
          borderRadius: 5,
          width: "80%",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({});
