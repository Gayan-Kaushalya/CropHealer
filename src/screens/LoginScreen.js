import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { View, Text, Button, StyleSheet, KeyboardAvoidingView, TextInput, Platform, Touchable } from "react-native";

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry
        />
      </View>

      <View
        style = {styles.buttonContainer}
      >
            <TouchableOpacity
                onPress = {() => {}}
                style = {styles.button}
            >
                <Text style = {styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress = {() => {}}
                style = {[styles.button, styles.buttonOutline]}
            >
                <Text style = {styles.buttonOutlineText}>Register</Text>
            </TouchableOpacity>
            
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },

  buttonContainer: {
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
   // color: 'blue',
   marginTop: 10,
  },

  button: {
    backgroundColor: '#6495ed',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 5,
    borderRadius: 10,
  },

  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: 'blue',
    borderWidth: 2,

  },

  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },

  buttonOutlineText: {
    color: 'blue',
    fontSize: 15,
    fontWeight: 'bold',
  },
  
});