import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, SafeAreaView, Pressable, ScrollView, BackHandler, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { diseaseList } from '../Diseases';
import BackButton from '../components/BackButton';

const PredictScreen = () => {
  const navigation = useNavigation();
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [plantType, setPlantType] = useState('');
  const [disease, setDisease] = useState('');
  const [confidence, setConfidence] = useState('');
  const [limeHeatmap, setLimeHeatmap] = useState(''); // Add state to store the heatmap
  const [loading, setLoading] = useState(false); // Add state to manage loading

  // Pick an image from the gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permission to upload images."
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true, // Request base64 image directly
      });

      if (!result.canceled) {
        const base64Image = result.assets[0].base64; // Store the base64 string
        setFile(result.assets[0].uri); // Store URI for display
        setLoading(true); // Start loading

        try {
          // Sending the base64 image to the backend
          const response = await axios.post('http://10.0.0.2:8001/predict', {
            base64: base64Image
          });

          console.log('Response from server: ', response.data);

          // Extract data from response
          const { crop, class: diseaseClass, confidence: conf, lime_heatmap } = response.data;
          setPlantType(crop);
          setDisease(diseaseClass);
          setConfidence(conf);
          setLimeHeatmap(lime_heatmap); // Set the heatmap

        } catch (error) {
          handleError(error);
        } finally {
          setLoading(false); // Stop loading
        }
      }
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
        aspect: [4, 3],
        quality: 1,
        base64: true, // Request base64 image directly
      });

      if (!result.canceled) {
        const base64Image = result.assets[0].base64; // Store the base64 string
        setFile(result.assets[0].uri); // Store URI for display
        setLoading(true); // Start loading

        try {
          // Sending the base64 image to the backend
          const response = await axios.post('http://10.0.0.2:8001/predict', {
            base64: base64Image
          });

          console.log('Response from server: ', response.data);

          // Extract data from response
          const { crop, class: diseaseClass, confidence: conf, lime_heatmap } = response.data;
          setPlantType(crop);
          setDisease(diseaseClass);
          setConfidence(conf);
          setLimeHeatmap(lime_heatmap); // Set the heatmap

        } catch (error) {
          handleError(error);
        } finally {
          setLoading(false); // Stop loading
        }
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
    <ScrollView contentContainerStyle={styles.container}>
      <BackButton />
      
      {/* Image selection buttons */}
      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>Pick an Image</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={takePicture} style={styles.button}>
        <Text style={styles.buttonText}>Take a Picture</Text>
      </TouchableOpacity>

      {/* Display uploaded/taken image */}
      {file && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: file }} style={styles.image} />
        </View>
      )}

      {/* Display loading indicator */}
      {loading && (
        <ActivityIndicator size="large" color="#0000ff" />
      )}

      {/* Display error message */}
      {!file && error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {/* Display plant type, disease, and confidence */}
      {!loading && file && (
        <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Plant Type: {plantType}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Disease: {disease}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Confidence: {confidence}</Text>
          </View>
        </View>
      )}

      {/* Display link to view details */}
      {!loading && diseaseDetails && (
        <TouchableOpacity onPress={() => navigation.navigate('DiseaseDetails', { disease: diseaseDetails })} style={styles.linkContainer}>
          <Text style={styles.linkText}>View Details</Text>
        </TouchableOpacity>
      )}

      {/* Display the LIME heatmap */}
      {!loading && limeHeatmap && (
        <View style={styles.imageContainer}>
          <Text style={styles.infoText}>Explanation (LIME):</Text>
          <Image
            source={{ uri: `data:image/png;base64,${limeHeatmap}` }} // Display heatmap as an image
            style={styles.image}
          />
        </View>
      )}

      {/* Report Prediction Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("FeedbackForm")}
        style={{ backgroundColor: "#f96163", padding: 10, borderRadius: 5, width: "80%", alignItems: "center" }}>
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
          Report Prediction
        </Text>
      </TouchableOpacity>
    </ScrollView>
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
