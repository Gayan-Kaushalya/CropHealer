import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import { FlatList } from "react-native";
import { diseaseList } from "../Diseases";
import { colors } from "../Constant";
import { useNavigation } from "@react-navigation/native";

const DiseaseCard = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <FlatList
                data={diseaseList}
                renderItem={({ item }) => (
                    <Pressable
                        // onPress={() => alert("hi")}
                        onPress={() => navigation.navigate("DiseaseDetails", { disease: item })}
                        style={styles.card}
                    >
                        <Image source={item.image} style={styles.image} />
                        <Text>{item.disease}</Text>
                    </Pressable>
                )}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator = {false}
            />
        </View>
    );
};

export default DiseaseCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    card: {
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 7,
        borderRadius: 8,
        marginVertical: 7,
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: "center",
    },
    columnWrapper: {
        justifyContent: "space-between",
    },
});