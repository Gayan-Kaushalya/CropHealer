import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import ArticleListScreen from "../screens/ArticleListScreen";
import DiseaseDetailsScreen from "../screens/DiseaseDetailsScreen";
//import App  from "../screens/IdentificationScreen";
import PredictScreen from "../screens/PredictScreen";
import FeedbackForm from "../screens/Report";

const Stack = createNativeStackNavigator();  

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/*    <Stack.Screen name="Welcome" component={WelcomeScreen} /> */}
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
               {/**/}
                <Stack.Screen name="Predict" component={PredictScreen} />
                
                <Stack.Screen name="Article List" component={ArticleListScreen} />
                <Stack.Screen name="DiseaseDetails" component={DiseaseDetailsScreen} />
                <Stack.Screen name="FeedbackForm" component={FeedbackForm} />
            </Stack.Navigator>
        </ NavigationContainer> 
    );
};

export default AppNavigator;

const styles = StyleSheet.create({});