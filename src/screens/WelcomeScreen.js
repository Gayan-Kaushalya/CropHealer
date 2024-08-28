import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";

const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Image source={require("./../../assets/favicon.png")} />

            <Text style={{ color: "#f96163", fontSize: 42, fontWeight: "bold" }}>
                Welcome to the CropHealer!
            </Text>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 20, marginBottom: 20 }}>
                Your AI Powered Plant Disease Identifier
            </Text>

            <TouchableOpacity
                onPress={() => navigation.navigate("Article List")}
                style={{ backgroundColor: "#f96163", padding: 10, borderRadius: 5, width: "80%", alignItems: "center" }}>
                <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
                    Explore
                </Text>
            </TouchableOpacity>

            {/* Add a button to navigate to the Prediction screen */}
            <TouchableOpacity
                onPress={() => navigation.navigate("Predict")}
                style={{ backgroundColor: "#f96163", padding: 10, borderRadius: 5, width: "80%", alignItems: "center", marginTop: 10 }}>
                <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
                    Diagnose
                </Text>
            </TouchableOpacity>
            

        </View>
    );
};

export default WelcomeScreen;

const styles = StyleSheet.create({});