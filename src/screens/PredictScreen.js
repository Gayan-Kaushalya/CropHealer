import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { diseaseList } from '../Diseases';
import Header from '../components/Header';

const PredictScreen = () => {
  const navigation = useNavigation();
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [plantType, setPlantType] = useState('');
  const [disease, setDisease] = useState('');
  const [confidence, setConfidence] = useState('');
  const [limeHeatmap, setLimeHeatmap] = useState('');
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [heatMapLoading, setHeatMapLoading] = useState(false);
  const [base64Image, setBase64Image] = useState('');

  // Pick an image from the gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log(status);

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permission to access your photos."
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        handleImageSelection(result.assets[0]);
      }
    }
  };

  // Handle image selection
  const handleImageSelection = async (asset) => {
    const base64Image = asset.base64;
    setBase64Image(base64Image);
    setFile(asset.uri);
    setPredictionLoading(true); 
    setHeatMapLoading(false);

    try {
      // const url = 'http://10.0.2.2:8001/';          // For Android Emulator
      const url = 'http://192.168.8.165:8001/';   // For Android Device (My Router IP)
      // const url = 'http://10.10.16.65:8001/';   // For Android Device (Sysco Wi-Fi)
      // const url = 'http://localhost:8001/';         // For Web

      console.log('Sending image to server for prediction...');

      // Sending the base64 image to the backend for prediction
      const response = await axios.post(url+'predict', { base64: base64Image });
      console.log('Response from server: ', response.data);

      const { crop, class: diseaseClass, confidence: conf} = response.data;
      setPlantType(crop);
      setDisease(diseaseClass);
      setConfidence(conf);
      setPredictionLoading(false); 
      setHeatMapLoading(true);
    //  setLimeHeatmap(lime_heatmap);

      // Now request the LIME explanation using the same image
      const limeResponse = await axios.post(url+'lime', { base64: base64Image });
      setLimeHeatmap(limeResponse.data.lime_heatmap);

    } catch (error) {
      handleError(error);
    } finally {
      setHeatMapLoading(false); 
    }
  };

  // Take a picture using the camera
  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera permission to take pictures."
      );
    } else {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 3],
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        handleImageSelection(result.assets[0]);
      }
    }
  };

  // Handle errors
  const handleError = (error) => {
    if (error.response) {
      console.error('Server Error: ', error.response.data);
      setError('Server Error: ' + error.response.data.message);
    } else if (error.request) {
      console.error('Network Error: No response received', error.request);
      setError('Network Error: No response received');
    } else {
      console.error('Error: ', error.message);
      setError('Error: ' + error.message);
    }
  };

  const diseaseDetails = disease !== "Healthy" ? diseaseList.find(detail => detail.disease === disease) : null;

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Image selection buttons */}
        <TouchableOpacity onPress={pickImage} style={styles.button} disabled={ predictionLoading || heatMapLoading }>
          <Text style={styles.buttonText}>Pick an Image</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={takePicture} style={styles.button} disabled={ predictionLoading || heatMapLoading }>
          <Text style={styles.buttonText}>Take a Picture</Text>
        </TouchableOpacity>

        {/* Display uploaded/taken image */}
        {file && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: file }} style={styles.image} />
          </View>
        )}

        {/* Display loading indicator */}
        {predictionLoading && (
          <ActivityIndicator size="large" color="#0000ff" />
        )}

        {/* Display error message */}
        {!file && error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {/* Display plant type, disease, and confidence */}
        {file && !predictionLoading && (
          <View style={styles.infoContainer}>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>Plant Type: {plantType}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>Disease: {disease}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>Probability: {confidence}</Text>
            </View>


            {/* Display link to view details */}
            {diseaseDetails && !predictionLoading && (
              <TouchableOpacity onPress={() => navigation.navigate('DiseaseDetails', { disease: diseaseDetails })} style={styles.linkContainer}>
                <Text style={styles.linkText}>View Details</Text>
              </TouchableOpacity>
            )}

            {/* Display loading indicator for LIME heatmap */}
            {heatMapLoading && ( 
              <ActivityIndicator size="large" color="#0000ff" />
            )}

            {/* Display the LIME heatmap */}
            {limeHeatmap && !heatMapLoading && !predictionLoading &&   (
              <View style={styles.imageContainer}>
                <Text style={styles.infoText}>Explanation (LIME):</Text>
                <Image
                  source={{ uri: `data:image/png;base64,${limeHeatmap}` }} // Display heatmap as an image
                  style={styles.image}
                />
              </View>
            )}
          </View>
        )}

        {/* Report Prediction Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("FeedbackForm", {
            plantType: plantType,
            disease: disease,
            probability: confidence,
            photo: base64Image,
          })}
          style={{ backgroundColor: "#f96163", padding: 10, borderRadius: 5, width: "80%", alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
            Report Prediction
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  infoContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkContainer: {
    marginBottom: 20,
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 18,
  },
});

export default PredictScreen;
