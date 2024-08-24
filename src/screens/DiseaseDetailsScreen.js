import { StyleSheet, Text, View, Image, SafeAreaView, Pressable } from "react-native";
import React from "react";
import {FontAwesome} from "@expo/vector-icons"

const DiseaseDetailsScreen = ({navigation, route }) => {
    const { disease } = route.params;

    console.log(disease);

    return (
        <View style  = {{ backgroundColor: "#6f4e37", flex: 1 }}>
            <SafeAreaView style={{flexDirection: "row", marginHorizontal: 16}}>
                <Pressable style={{flex: 1}} onPress={() => navigation.goBack()}>
                    <FontAwesome name = {"arrow-circle-left"} size={28} color="black" />
                </Pressable>
                
                <FontAwesome name = {"heart-o"} size={28} color="black"/>
            </SafeAreaView>
            <View 
                style={{ 
                    backgroundColor: "#fff", 
                    flex: 1, 
                    marginTop: 240,
                    borderTopLeftRadius : 56,
                    borderTopRightRadius : 56,
                    alignItems: "center",
                    }}>

                 <View style = {{
                  //  backgroundColor: "black",
                    height: 300,
                    width: 300,
                    position: "absolute",
                    top: -150,
                
                    }}>      
                <Image source={require("../../assets/diseases/anthracnose.png")} style={{ height: "100%", width: "100%", resizeMode: "contain" }} /> 
            </View>
        </View>
        </View>
    );
};

export default DiseaseDetailsScreen;

const styles = StyleSheet.create({});