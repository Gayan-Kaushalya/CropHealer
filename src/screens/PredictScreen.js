import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, PermissionsAndroid, StyleSheet, TouchableOpacity, Alert, SafeAreaView, Pressable } from 'react-native';
import axios from 'axios';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; // Make sure you have expo-vector-icons installed
import * as ImagePicker from 'expo-image-picker';
import { cos } from '@tensorflow/tfjs';

const PredictScreen = ({navigation}) => {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState('');

  const [file, setFile] = useState(null);

    // Stores any error message
    const [error, setError] = useState(null);

    // Function to pick an image from 
    //the device's media library
 

  function uploadImage(file) {
      const formData = new FormData();
      formData.append('file', file);
    
      fetch('http://localhost:8001/predict', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }    

const pickImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== "granted") {
    // If permission is denied, show an alert
    Alert.alert(
      "Permission Denied",
      "Sorry, we need camera roll permission to upload images."
    );
  } else {
    // Launch the image library and get the selected image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,}
    );

    if (!result.canceled) {
      // If an image is selected (not cancelled), update the file state variable
      const uri = result.assets[0].uri;
      console.log(uri)
      const formData = new FormData();
      formData.append('file', {
        uri : uri,
        name: 'Image.jpg',
        type: 'image/jpeg'
      });
      console.log(formData.get('file').name)
      try {
        // Send the image to the prediction endpoint
        const response = await axios.post('http://localhost:8001/predict', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Handle the response from the server
        console.log('Response from server: ', response.data);
        setMessage(response.data.message);
      } catch (error) {
        if (error.response) {
          // Server responded with a status other than 2xx
          console.error('Server Error: ', error.response.data);
        } else if (error.request) {
          // Request was made but no response received
          console.error('Network Error: No response received', error.request);
        } else {
          // Something else caused the error
          console.error('Error: ', error.message);
        }
      }
    }
  }
};

    

  {/*
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs camera access to take photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const launchCameraFunction = async (setImage) => {
    try {
      const response = await launchCamera({ mediaType: 'photo' });
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        console.log('Image URI: ', response.uri);
        setImage(response.uri);
      }
    } catch (error) {
      console.error('Error launching camera: ', error);
    }
  };
*/}
  const uploadPicture = () => {
    console.log('Upload Picture button pressed');
    const formData = new FormData();
    formData.append('image', {
      uri: image,
      type: 'image/jpeg',
      name: 'image.jpg',
    });

    axios.post('http://localhost:8001/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        console.log('Response from server: ', response.data);
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Error uploading image: ', error);
      });
  };

  useEffect(() => {
    axios.get('http://localhost:8001/predict')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Error fetching initial message: ', error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flexDirection: "row", marginHorizontal: 16 , marginTop: 12}}>
                <Pressable style={{ flex: 1 }} onPress={() => navigation.goBack()}>
                    <FontAwesome name={"arrow-circle-left"} size={28} color="black" />
                </Pressable>
                {/*<FontAwesome name={"heart-o"} size={28} color="black" />*/}
            </SafeAreaView>
      {/*
      <Button title="Take Photo" onPress={() => launchCameraFunction(setImage)} />
      */}

      <TouchableOpacity style={styles.button}
                onPress={pickImage}>
                <Text style={styles.buttonText}>
                    Choose Image
                </Text>
            </TouchableOpacity>

            {/* Conditionally render the image 
            or error message */}
            {file ? (
                // Display the selected image
                <View style={styles.imageContainer}>
                    <Image source={{ uri: file }}
                        style={styles.image} />
                </View>
            ) : (
                // Display an error message if there's 
                // an error or no image selected
                <Text style={styles.errorText}>{error}</Text>
            )}

      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      {/*
        <Button title="Upload Photo" onPress={uploadPicture} disabled={!image} />
      */}
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
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
},
header: {
    fontSize: 20,
    marginBottom: 16,
},
button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
},
buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
},
imageContainer: {
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
},
image: {
    width: 200,
    height: 200,
    borderRadius: 8,
},
errorText: {
    color: "red",
    marginTop: 16,
},
});

export default PredictScreen;