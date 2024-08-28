import React, { useState } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';


const model = await tf.loadLayersModel("src/models/potatoModel.json");

//const modelJson = require('../models/potatoModel.json');
//const modelWeights = require('../models/potatoModel.weights.h5');





export async function predict(inputTensor) {
    if (!model) {
      throw new Error("Model not loaded yet. Call loadModel() first.");
    }
  
    const reshapedTensor = inputTensor.reshape([1, 34]); 
    try {
      const prediction = model.predict(reshapedTensor);
      const predictionArray = await prediction.array(); 
      return predictionArray[0]; 
    } catch (error) {
      console.error("Error during prediction:", error);
      throw new Error("Prediction failed");
}}

  

const PredictionScreen = () => {
    const [image, setImage] = useState('');
    const [prediction, setPrediction] = useState('');
    const [label, setLabel] = useState('');
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    const plantModel = async (image) => {
        await tf.ready();
       // const modelJson = require('./path/to/model.json');
       // const modelWeights = require('./path/to/weights.bin');
       // const model = await tf.loadGraphModel(bundleResourceIO(modelJson, modelWeights));
  //     model = 

        // Preprocess the image and make predictions
        const processedImage = preprocessImage(image);
        const predictions = model.predict(processedImage);
        setPrediction(predictions);
    };



    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>Prediction Screen</Text>
            {/* Add UI elements to display image and predictions */}
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
      alignSelf: 'center',
      position: 'absolute',
      top: 10,
      fontSize: 30,
      ...fonts.Bold,
      color: '#FFF',
    },
    clearImage: {height: 40, width: 40, tintColor: '#FFF'},
    mainOuter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      position: 'absolute',
      top: height / 1.6,
      alignSelf: 'center',
    },
    outer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btn: {
      position: 'absolute',
      bottom: 40,
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    btnStyle: {
      backgroundColor: '#FFF',
      opacity: 0.8,
      marginHorizontal: 30,
      padding: 20,
      borderRadius: 20,
    },
    imageStyle: {
      marginBottom: 50,
      width: width / 1.5,
      height: width / 1.5,
      borderRadius: 20,
      position: 'absolute',
      borderWidth: 0.3,
      borderColor: '#FFF',
      top: height / 4.5,
    },
    clearStyle: {
      position: 'absolute',
      top: 100,
      right: 30,
      tintColor: '#FFF',
      zIndex: 10,
    },
    space: {marginVertical: 10, marginHorizontal: 10},
    labelText: {color: '#FFF', fontSize: 20, ...fonts.Bold},
    resultText: {fontSize: 32, ...fonts.Bold},
    imageIcon: {height: 40, width: 40, tintColor: '#000'},
    emptyText: {
      position: 'absolute',
      top: height / 1.6,
      alignSelf: 'center',
      color: '#FFF',
      fontSize: 20,
      maxWidth: '70%',
      ...fonts.Bold,
    },
  });

export default PredictionScreen;