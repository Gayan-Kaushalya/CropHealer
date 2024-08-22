import { StyleSheet, Text, ScrollView, View } from "react-native"
import React from "react";
import { categories, colors } from "../Constant";

const CategoriesFilter = () => {
    return (
        <View>
            <ScrollView horizontal showsHorizontalScrollIndicator = {false}>
                {
                    categories.map((category, index) => {
                        return (<View 
                            key = { index }
                            style = {{ 
                            backgroundColor: index === 0? colors.primary : "#fff000", 
                            marginRight: 36, 
                            borderRadius: 8,
                            paddingHorizontal: 16,
                            paddingVertical: 8,

                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 4,
                            },

                            shadowOpacity: 0.30,
                            shadowRadius: 7,

                            marginVertical: 7
                            }}>
                            <Text
                                style = {{ color : index === 0 && colors.light, fontSize: 16, fontWeight: "bold" }}
                            >{ category.category }</Text>
                        </View>);
                    })
                }
            </ScrollView>
        </View>
    );
}

export default CategoriesFilter;

const styles = StyleSheet.create({});