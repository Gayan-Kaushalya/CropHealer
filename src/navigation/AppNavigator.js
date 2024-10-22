import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import ArticleListScreen from "../screens/ArticleListScreen";
import DiseaseDetailsScreen from "../screens/DiseaseDetailsScreen";
import PredictScreen from "../screens/PredictScreen";
import ReportScreen from "../screens/ReportScreen";
import LoginScreen from "../screens/LoginScreen";
import HelpScreen from "../screens/HelpScreen";
import AboutScreen from "../screens/AboutScreen";
import HistoryScreen from "../screens/HistoryScreen";

const Stack = createNativeStackNavigator();  

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/*    <Stack.Screen name="Welcome" component={WelcomeScreen} /> 
                <Stack.Screen options = {{headerShown: false}} name="Login" component={LoginScreen} />*/}
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
               {/**/}
                <Stack.Screen name="Predict" component={PredictScreen} />
                
                <Stack.Screen name="Article List" component={ArticleListScreen} />
                <Stack.Screen name="DiseaseDetails" component={DiseaseDetailsScreen} />
                <Stack.Screen name="Help" component={HelpScreen} />
                <Stack.Screen name="About" component={AboutScreen} />
                <Stack.Screen name="FeedbackForm" component={ReportScreen} />
                <Stack.Screen name="History" component={HistoryScreen} />
            </Stack.Navigator>
        </ NavigationContainer> 
    );
};

export default AppNavigator;

const styles = StyleSheet.create({});