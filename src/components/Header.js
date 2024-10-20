import { StyleSheet, Text, View, TouchableOpacity, Animated, StatusBar, Button } from "react-native";
import React, { useEffect, useState, useRef } from "react"; 
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { useNavigation, useRoute } from '@react-navigation/native';

const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('authToken');
        return token ? JSON.parse(token) : null; // Return parsed token or null
    } catch (error) {
        console.error('Error retrieving token:', error);
        return null;
    }
};

const Header = ({ logout }) => {
    const navigation = useNavigation();
    const route = useRoute();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const menuAnimation = useRef(new Animated.Value(250)).current; // Start off-screen to the right
    const [token, setToken] = useState(null); // State to hold the token

    useEffect(() => {
        const checkLoginStatus = async () => {
            const retrievedToken = await getToken();
            setToken(retrievedToken); // Store the token in the state
            setIsLoggedIn(retrievedToken !== null); // Update login status
        };

        checkLoginStatus();
    }, []);

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
        Animated.timing(menuAnimation, {
            toValue: menuVisible ? 250 : -10, // Slide from right to left
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    return (
        <>
            {/* Ensure content starts after the status bar */}
            <StatusBar barStyle="auto" />
            
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.goBack()}
                >
                    <FontAwesome name="chevron-left" size={16} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerText}>{"CropHealer"}</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={isLoggedIn ? toggleMenu : () => navigation.navigate("Login")}
                >
                    <FontAwesome name={isLoggedIn ? "bars" : "sign-in"} size={16} color="black" />
                </TouchableOpacity>
            </View>

            <Animated.View style={[styles.menuContainer, { transform: [{ translateX: menuAnimation }] }]}>
                <TouchableOpacity style={styles.backButton} onPress={toggleMenu}>
                    <FontAwesome name="chevron-right" size={16} color="black" />
                </TouchableOpacity>
                {token && <Text style={[styles.menuItem, { marginBottom: 50 }]}>{token.email}</Text>}
                <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("Help")}>
                    <FontAwesome name="question-circle" size={24} color="black" />
                    <Text style={styles.menuItem}>Help</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("About")}>
                    <FontAwesome name="info-circle" size={24} color="black" />
                    <Text style={styles.menuItem}>About</Text>
                </TouchableOpacity>
                {route.name == "Login" ? (
                    <TouchableOpacity style={[styles.menuButton, { backgroundColor: "#E7CCCC" }]} onPress={logout}>
                        <FontAwesome name="sign-out" size={24} color="black" />
                        <Text style={styles.menuItem}>Logout</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("Login")}>
                        <FontAwesome name="sign-in" size={24} color="black" />
                        <Text style={styles.menuItem}>Home</Text>
                    </TouchableOpacity>
                )}
            </Animated.View>
        </>
    );
};

export default Header;

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        paddingTop: 20,
        backgroundColor: "#D7E8BF",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        borderRadius: 10,
        elevation: 2,
    },
    headerText: {
        flex: 1,
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
    },
    button: {
        height: 50,
        width: 50,
        justifyContent: "center",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "black",
        backgroundColor: "#A5B68D",
    },
    menuContainer: {
        position: "absolute",
        top: 20, // Adjust this to lift the menu higher
        right: -10, 
        width: 250, 
        backgroundColor: "#f4fff4",
        alignContent: "center",
        alignItems: "center",
        padding: 20,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        elevation: 4,
        zIndex: 1,
    },
    backButton: {
        marginBottom: 10,
        padding: 10,
        alignSelf: "flex-end",
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 8,
    },
    menuItem: {
        fontSize: 22,
        paddingVertical: 10,
        marginLeft: 20,
    },
    menuButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 5,
        paddingHorizontal: 25,
        backgroundColor: "#A5B68D",
        marginVertical: 2,
        width: "100%",
    },
});
