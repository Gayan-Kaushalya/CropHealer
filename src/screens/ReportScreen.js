import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Function to get the authentication token from AsyncStorage
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (token !== null) {
      const tokenObj = JSON.parse(token);
      const currentTime = new Date().getTime();
      if (tokenObj.expiration > currentTime) {
        return tokenObj;
      } else {
        await AsyncStorage.removeItem("authToken");
      }
    }
    return null;
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

const ReportScreen = ({ route }) => {
  const { plantType, disease, probability, photo } = route.params;
  const date = new Date();

  const navigation = useNavigation();

  const [reportDetails, setReportDetails] = useState({
    email: null, // Initialize userId as null
    predPlant: plantType,
    predDisease: disease,
    pred_prob: probability,
    actPlant: "",
    actDisease: "",
    details: "",
    date: date.toDateString(),
  });

  useEffect(() => {
    const fetchEmail = async () => {
      const tokenData = await getToken();
      if (tokenData) {
        console.log(tokenData.email);
        setReportDetails((prev) => ({
          ...prev,
          email: tokenData.email,
        }));
      }
    };

    fetchEmail();
  }, []);

  function updateReportDetails(name, value) {
    setReportDetails((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  }

  async function handleReport() {
    // const url = 'http://10.0.2.2:8001/';          // For Android Emulator
    // const url = 'http://192.168.8.165:8001/';   // For Android Device (My Router IP)
    // const url = 'http://10.10.16.65:8001/';   // For Android Device (Campus Wi-Fi)
    const url = "http://localhost:8001/"; // For Web

    try {
      console.log(reportDetails);
      const response = await axios.post(url + "report", reportDetails);

      if (response.data.message) {
        Alert.alert("Success", response.data.message);
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", "Failed to submit report.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      Alert.alert("Error", "Something went wrong while submitting the report.");
    }
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Report Form</Text>

        <Image
          source={{ uri: `data:image/jpg;base64,${photo}` }}
          style={{
            width: 200,
            height: 200,
            marginBottom: 16,
            borderWidth: 2,
            borderColor: "#000",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Predicted Plant</Text>
          <TextInput
            style={styles.input}
            value={reportDetails.predPlant}
            editable={false} // Disable editing
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Predicted Disease</Text>
          <TextInput
            style={styles.input}
            value={reportDetails.predDisease}
            editable={false} // Disable editing
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Actual Plant</Text>
          <TextInput
            style={styles.input}
            value={reportDetails.actPlant}
            onChangeText={(value) => updateReportDetails("actPlant", value)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Actual Disease</Text>
          <TextInput
            style={styles.input}
            value={reportDetails.actDisease}
            onChangeText={(value) => updateReportDetails("actDisease", value)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Details</Text>
          <TextInput
            style={[styles.textArea, { textAlignVertical: "top" }]}
            value={reportDetails.details}
            onChangeText={(value) => updateReportDetails("details", value)}
            multiline={true}
          />
        </View>

        <Button title="Submit" onPress={handleReport} color="#28a745" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#21a141",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    height: 100, // Set height for text area
  },
});

export default ReportScreen;
