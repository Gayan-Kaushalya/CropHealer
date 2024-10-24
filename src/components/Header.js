import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  StatusBar,
  Button,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (token !== null) {
      const tokenObj = JSON.parse(token);
      const currentTime = new Date().getTime();
      if (tokenObj.expiration > currentTime) {
        return tokenObj;
      } else {
        await AsyncStorage.removeItem("authToken");
      }
    }
    return null;
  } catch (error) {
    console.error("Error retrieving token:", error);
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
          <FontAwesome
            name={isLoggedIn ? "bars" : "sign-in"}
            size={16}
            color="black"
          />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          styles.menuContainer,
          { transform: [{ translateX: menuAnimation }] },
        ]}
      >
        <TouchableOpacity style={styles.backButton} onPress={toggleMenu}>
          <FontAwesome name="chevron-right" size={16} color="black" />
        </TouchableOpacity>
        {token && (
          <Text style={[styles.menuItem, { marginBottom: 50, fontSize: 18 }]}>
            {token.email}
          </Text>
        )}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate("Help")}
        >
          <FontAwesome name="question-circle" size={24} color="black" />
          <Text style={styles.menuItem}>Help</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate("About")}
        >
          <FontAwesome name="info-circle" size={24} color="black" />
          <Text style={styles.menuItem}>About Us</Text>
        </TouchableOpacity>
        {route.name == "Login" ? (
          <TouchableOpacity
            style={[styles.menuButton, { backgroundColor: "#922141" }]}
            onPress={logout}
          >
            <FontAwesome name="sign-out" size={24} color="white" />
            <Text style={[styles.menuItem, {color:'white'}]}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate("Login")}
          >
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
      backgroundColor: "#365E32",
      borderBottomWidth: 5,
      borderBottomColor: "#254336",
      elevation: 2,
  },
  headerText: {
      flex: 1,
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "center",
      color: "#BFF6C3",
  },
  button: {
      height: 50,
      width: 50,
      justifyContent: "center",
      paddingVertical: 10,
      paddingHorizontal: 15,
      backgroundColor: "#ACE1AF",
      borderWidth: 2,
      borderColor: "#BFF6C3",
  },
  menuContainer: {
      position: "absolute",
      top: 20, // Adjust this to lift the menu higher
      right: -10, 
      width: 250, 
      backgroundColor: "#BAFAB8",
      alignContent: "center",
      alignItems: "center",
      padding: 20,
      elevation: 10,
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
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
      backgroundColor: "#8ACA88",
      marginVertical: 2,
      elevation: 2,
      width: "100%",
      borderRadius: 10,
  },
});