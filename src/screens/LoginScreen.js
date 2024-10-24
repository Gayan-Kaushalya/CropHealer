import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';

const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token !== null) {
        const tokenObj = JSON.parse(token);
        const currentTime = new Date().getTime();
        if (tokenObj.expiration > currentTime) {
          return tokenObj;
        } else {
          await AsyncStorage.removeItem('authToken');
        }
      }
      return null;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };

const AuthScreen = ({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication }) => {
    return (
        <View style={styles.authContainer}>
            <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>

            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
            />
            <View style={styles.buttonContainer}>
                <Button title={isLogin ? 'Sign In' : 'Sign Up'} onPress={handleAuthentication} color="#3498db" />
            </View>

            <View style={styles.bottomContainer}>
                <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
                </Text>
            </View>
        </View>
    );
};

const AuthenticatedScreen = ({ user, handleLogout, navigation }) => {
    return (
        <View style={{ width: '100%', height: '100%'}}>
            <Header logout={handleLogout} />
            <View style={styles.container}>

                <Image source={require("./../../assets/cover-crops.png")} style={{ width: 350, height: 350, marginBottom: 20 }} />
                <Text style={{ fontSize: 20, marginBottom: 30, textAlign: 'center', width: '80%' }}>
                    Identify and diagnose plant diseases
                    instantly with <Text style={{fontWeight:'bold'}}>CropHeaIer</Text>,
                    and ensure your crops stay healthy
                    and thriving.
                </Text>
                
                <TouchableOpacity
                    onPress={() => navigation.navigate("Predict")}
                    style={{ backgroundColor: "green", padding: 10, borderRadius: 5, width: "80%", alignItems: "center"}}>
                    <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
                    Diagnose
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Article List")}
                    style={{ backgroundColor: "green", padding: 10, borderRadius: 5, width: "80%", alignItems: "center" , marginTop: 10 }}>
                    <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
                    Explore
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate("History")}
                    style={{ backgroundColor: "green", padding: 10, borderRadius: 5, width: "80%", alignItems: "center" , marginTop: 10 }}>
                    <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
                    Report History
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const App = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null); // Track user authentication state
    const [isLogin, setIsLogin] = useState(true);

    // navigate directly to the AuthenticatedScreen if the user is already logged in
    const [token, setToken] = useState(null);
    useEffect(() => {
        // Fetch the token on component mount
        const fetchToken = async () => {
          const retrievedToken = await getToken();
          setToken(retrievedToken);  // Set the token in the state
        };
        fetchToken();
    }, []);
    useEffect(() => {
        if (token) {
            // If the token exists, set the user state
            setUser(token);
        }
    }, [token]);

    const handleAuthentication = async () => {
        try {
            // const url = isLogin ? 'http://10.0.2.2:8001/login/' : 'http://10.0.2.2:8001/register/';          // For Android Emulator
           // const url = isLogin ? 'http://192.168.8.165:8001/login/' : 'http://192.168.8.165:8001/register/';   // For Android Device (My Router IP)
            // const url = isLogin ? 'http://10.10.16.65:8001/login/' : 'http:/10.10.16.65:8001/register/';   // For Android Device (Sysco Wi-Fi)
             const url = isLogin ? 'http://51.20.133.77/login/' : 'http://51.20.133.77/register/';          // For Web
            console.log(email, password);
            const response = await axios.post(url, { email, password });
            if (isLogin) {
                // If login is successful, set the user object
                setUser(response.data); // Assuming your backend returns user info
                console.log(response.data);
                // Store the Token in AsyncStorage
                const token = response.data;
                const expirationTime = new Date().getTime() + (30 * 24 * 60 * 60 * 1000); // 30 days from now
                const tokenWithExpiration = { ...token, expiration: expirationTime };
                await AsyncStorage.setItem('authToken', JSON.stringify(tokenWithExpiration));
                // Alert.alert('Success', 'Logged in successfully!', [{ text: 'OK' }]);
            } else {
                setUser(response.data);
                console.log(response.data);
                // Store the Token in AsyncStorage
                const token = response.data;
                const expirationTime = new Date().getTime() + (30 * 24 * 60 * 60 * 1000); // 30 days from now
                const tokenWithExpiration = { ...token, expiration: expirationTime };
                await AsyncStorage.setItem('authToken', JSON.stringify(tokenWithExpiration));
                Alert.alert('Success', 'User created successfully!', [{ text: 'OK' }]);
            }
        } catch (error) {
            console.error('Authentication error:', error.response.data.detail);
            Alert.alert('Error', error.response.data.detail, [{ text: 'OK' }]);
        }
    };

    const handleLogout = () => {
        setUser(null); // Reset user state on logout
        // Remove the Token from AsyncStorage
        AsyncStorage.removeItem('authToken');
        Alert.alert('Logged out', 'You have been logged out.', [{ text: 'OK' }]);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {user ? (
                <AuthenticatedScreen user={user} handleLogout={handleLogout} navigation={navigation} />
            ) : (
                <AuthScreen
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    isLogin={isLogin}
                    setIsLogin={setIsLogin}
                    handleAuthentication={handleAuthentication}
                />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    authContainer: {
        flex: 1,
        width: 300,
        maxHeight: 300,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 16,
        padding: 8,
        borderRadius: 4,
    },
    buttonContainer: {
        marginBottom: 16,
    },
    toggleText: {
        color: '#3498db',
        textAlign: 'center',
    },
    bottomContainer: {
        marginTop: 20,
    },
    emailText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
});

export default App;
