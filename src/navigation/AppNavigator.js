import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import ArticleListScreen from "../screens/ArticleListScreen";
import DiseaseDetailsScreen from "../screens/DiseaseDetailsScreen";
import PredictionScreen from "../screens/PredictionScreen";

const Stack = createNativeStackNavigator();  

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/*    <Stack.Screen name="Welcome" component={WelcomeScreen} /> */}
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="Predict" component={PredictionScreen} />
                <Stack.Screen name="Article List" component={ArticleListScreen} />
                <Stack.Screen name="Disease Details" component={DiseaseDetailsScreen} />
            </Stack.Navigator>
        </ NavigationContainer> 
    );
};

export default AppNavigator;

const styles = StyleSheet.create({});