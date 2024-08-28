import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, PermissionsAndroid, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { launchCamera } from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';

const PredictScreen = ({navigation}) => {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState('');

  const [file, setFile] = useState(null);

    // Stores any error message
    const [error, setError] = useState(null);

    // Function to pick an image from 
    //the device's media library
    const pickImage = async () => {
        const { status } = await ImagePicker.
            requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {

            // If permission is denied, show an alert
            Alert.alert(
                "Permission Denied",
                `Sorry, we need camera 
                 roll permission to upload images.`
            );
        } else {

            // Launch the image library and get
            // the selected image
            const result =
                await ImagePicker.launchImageLibraryAsync();

            if (!result.canceled) {

                // If an image is selected (not cancelled), 
                // update the file state variable
                setFile(result.uri);

                // Clear any previous errors
                setError(null);
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

    axios.post('http://192.168.64.103:8001/predict', formData, {
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
    axios.get('http://192.168.64.103:8001/predict')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Error fetching initial message: ', error);
      });
  }, []);

  return (
    <View style={styles.container}>
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