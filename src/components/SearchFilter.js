import { StyleSheet, TextInput, View } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";

const SearchFilter = ({ icon , placeholder }) => {
    return (
        <View style = {{ backgroundColor: "white", flexDirection: "row", paddingVertical: 16, paddingHorizontal:16, borderRadius: 8, marginTop: 16 , marginVertical: 16,

            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 4,
            },

            shadowOpacity: 0.30,
            shadowRadius: 7,
        }}>
            <FontAwesome name={icon} size={20} color="black" />
            < TextInput
                style = {{ paddingLeft: 8, fontSize: 16, color: "#000" }} placeholder = {placeholder} >
                    
            </TextInput>
        </View>
    );
};

export default SearchFilter;

const styles = StyleSheet.create({});