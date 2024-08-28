import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, PermissionsAndroid, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { launchCamera } from 'react-native-image-picker';

const PredictScreen = ({navigation}) => {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState('');

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
      <Button title="Take Photo" onPress={() => launchCameraFunction(setImage)} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <Button title="Upload Photo" onPress={uploadPicture} disabled={!image} />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PredictScreen;