import { StyleSheet, Text, View } from "react-native";
import React from "react";

const DiseaseDetailsScreen = () => {
    return (
        <View
            style  = {{ backgroundColor: "#fff", flex: 1 }}
        >
            <View 
                style={{ 
                    backgroundColor: "fff", 
                    flex: 1, 
                    marginTop: 240,
                    borderTopLeftRadius : 56,
                    borderTopRightRadius : 56,
                    alignItems: "center",
                    }}>

                 <View style = {{
                    backgroundColor: "red",
                    height: 300,
                    width: 300,
                    position: "absolute",
                    top: -150,
                    }}>       
            </View>
        </View>
        </View>
    );
};

export default DiseaseDetailsScreen;

const styles = StyleSheet.create({});