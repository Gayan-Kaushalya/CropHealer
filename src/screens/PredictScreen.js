import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, PermissionsAndroid, StyleSheet, TouchableOpacity, Alert, SafeAreaView, Pressable } from 'react-native';
import axios from 'axios';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; // Make sure you have expo-vector-icons installed
import * as ImagePicker from 'expo-image-picker';
import { diseaseList } from '../Diseases';
import { cos } from '@tensorflow/tfjs';

const PredictScreen = () => {
  const navigation = useNavigation();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState(null);
  const [plantType, setPlantType] = useState('');
  const [disease, setDisease] = useState('');
  const [confidence, setConfidence] = useState('');

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

        const formData = new FormData();
        formData.append('file', {
          uri: uri,
          name: 'Image.jpg',
          type: 'image/jpeg',
        });

        try {
          console.log(result.assets[0].base64)
          const response = await axios.post('http://localhost:8001/predict', {base64:result.assets[0].uri.split(",")[1]});

          // Handle the response from the server
          console.log('Response from server: ', response.data);
          setMessage(response.data.message);

          const { crop, class: diseaseClass, confidence: conf } = response.data;
          setPlantType(crop);
          setDisease(diseaseClass);
          setConfidence(conf);
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

  const diseaseDetails = disease !== "Healthy" ? diseaseList.find(detail => detail.disease === disease) : null;

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flexDirection: "row", marginHorizontal: 16 , marginTop: 12}}>
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

      {diseaseDetails && (
        <TouchableOpacity onPress={() => navigation.navigate('DiseaseDetails', { disease: diseaseDetails })} style={styles.linkContainer}>
          <Text style={styles.linkText}>View Details</Text>
        </TouchableOpacity>
      )}

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