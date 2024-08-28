import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';

const PredictScreen = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8001/predict')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <View>
      <Text>{message}</Text>
      <Text>Prediction Screen</Text>
    </View>
  );
};

export default PredictScreen;
