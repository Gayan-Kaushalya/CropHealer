import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const AboutScreen = () => {
    const navigation = useNavigation();
    return (
        <ScrollView contentContainerStyle={styles.container}>
        <Image source={require('./../../assets/CropHealer Logo.png')} style={styles.logo} />
        <Text style={styles.title}>About CropHealer</Text>
        <Text style={styles.paragraph}>
            CropHealer is an innovative app designed to help farmers and gardeners identify and manage plant diseases. 
            Using state-of-the-art machine learning models, the app provides accurate disease detection by analyzing plant images, 
            offering treatment recommendations, and ensuring optimal crop health.
        </Text>
        <Text style={styles.title}>Our Vision</Text>
        <Text style={styles.paragraph}>
            We envision a future where technology bridges the gap between small-scale farmers and advanced agricultural knowledge. 
            CropHealer is a step towards that future, where anyone can maintain a healthy farm and contribute to the global food supply.
        </Text>
        <Text style={styles.title}>Contact Us</Text>
        <Text style={styles.paragraph}>
            For inquiries or support, feel free to reach us at: <Text style={{fontWeight:'600'}}>support@crophealer.com</Text>
        </Text>

        <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ backgroundColor: "green", padding: 10, borderRadius: 5, width: "80%", alignItems: "center", margin:10 }}>
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
                Go Back
            </Text>
        </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
});

export default AboutScreen;