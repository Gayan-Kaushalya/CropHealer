import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, Alert, SafeAreaView, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; // Make sure you have expo-vector-icons installed
import * as ImagePicker from 'expo-image-picker';

const PredictScreen = () => {
  const navigation = useNavigation();
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [plantType, setPlantType] = useState('');
  const [disease, setDisease] = useState('');
  const [confidence, setConfidence] = useState('');
  const [explanationImage, setExplanationImage] = useState('');

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
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setFile(uri);

        // Read the image as base64
        const base64 = await fetch(uri)
          .then(response => response.blob())
          .then(blob => {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            });
          });

        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = base64.split(',')[1];

        try {
          // First call the predict endpoint
          const response = await axios.post('http://localhost:8001/predict', { base64: base64Data });
          console.log('Response from server: ', response.data);
          
          const { crop, class: diseaseClass, confidence: conf } = response.data;
          setPlantType(crop);
          setDisease(diseaseClass);
          setConfidence(conf);

          // Now call the explain endpoint
          const explainResponse = await axios.post('http://localhost:8001/explain', { base64: base64Data });
          console.log('Explanation from server: ', explainResponse.data);
          
          setExplanationImage(`data:image/png;base64,${explainResponse.data.explanation}`);

        } catch (error) {
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
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flexDirection: "row", marginHorizontal: 16, marginTop: 12 }}>
        <Pressable style={{ flex: 1 }} onPress={() => navigation.goBack()}>
          <FontAwesome name={"arrow-circle-left"} size={28} color="black" />
        </Pressable>
      </SafeAreaView>

      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>Pick an Image</Text>
      </TouchableOpacity>

      {file ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: file }} style={styles.image} />
        </View>
      ) : (
        <Text style={styles.errorText}>{error}</Text>
      )}

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

      {explanationImage ? (
        <View style={styles.imageContainer}>
          <Text style={styles.infoText}>Explanation:</Text>
          <Image source={{ uri: explanationImage }} style={styles.explanationImage} />
        </View>
      ) : null}

      <TouchableOpacity
        onPress={() => navigation.navigate("FeedbackForm")}
        style={{ backgroundColor: "#f96163", padding: 10, borderRadius: 5, width: "80%", alignItems: "center" }}>
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
          Report Prediction
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  explanationImage: {
    width: 200,
    height: 200,
    marginTop: 10,
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
  reportButton: {
    backgroundColor: '#f96163',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  reportButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default PredictScreen;
