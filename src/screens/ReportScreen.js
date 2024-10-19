import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { send, EmailJSResponseStatus } from '@emailjs/react-native';
import BackButton from '../components/BackButton';

const ReportScreen = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const onSubmit = async () => {
    try {
      await send(
        'service_fhlmfnl',
        'template_62sm405',
        {
          name,
          email,
          message: 'This is a static message',
        },
        {
          publicKey: '92_D5O9PJy86nc9jd',
        },
      );

      console.log('SUCCESS!');
    } catch (err) {
      if (err instanceof EmailJSResponseStatus) {
        console.log('EmailJS Request Failed...', err);
      }

      console.log('ERROR', err);
    }
  };

  return (
    <View>
      <TextInput
        inputMode="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        inputMode="text"
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <Button title="Submit" onPress={onSubmit} />
      <BackButton />
    </View>
  );
};

export default ReportScreen;