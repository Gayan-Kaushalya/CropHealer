import { StyleSheet, Text, View, Image, SafeAreaView, Pressable, ScrollView } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";

const DiseaseDetailsScreen = ({ navigation, route }) => {
    const { disease } = route.params || {};

    console.log("Route Params:", route.params);
    console.log("Disease:", disease);

    return (
        <ScrollView style={{ backgroundColor: disease.color, flex: 1 }} showsVerticalScrollIndicator={false}>
            <SafeAreaView style={{ flexDirection: "row", marginHorizontal: 16 , marginTop: 12}}>
                <Pressable style={{ flex: 1 }} onPress={() => navigation.goBack()}>
                    <FontAwesome name={"arrow-circle-left"} size={28} color="black" />
                </Pressable>
            </SafeAreaView>
            <View
                style={{
                    backgroundColor: "#fff",
                    flex: 1,
                    marginTop: 240,
                    borderTopLeftRadius: 56,
                    borderTopRightRadius: 56,
                    alignItems: "center",
                    paddingHorizontal: 16,
                }}>
                <View style={{
                    height: 300,
                    width: 300,
                    position: "absolute",
                    top: -150,
                }}>
                    <Image source={disease.image} style={{ height: "100%", width: "100%", resizeMode: "contain" }} />
                </View>

                {/* Disease Name */}
                <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 160 }}>{disease.disease}</Text>

                {/* Description */}    
                <Text style={{ marginHorizontal: 16, textAlign: "center", marginTop: 16 }}>{disease.description}</Text>

                {/* Extra Details */}
                <View style={{ alignSelf: "flex-start", marginHorizontal: 22, marginBottom: 16}}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>Crops:</Text>
                    <Text>{disease.crops.join(", ")}</Text>

                    <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>Symptoms:</Text>
                    {disease.symptoms.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', marginVertical: 2 }}>
                            <Text style={{ marginRight: 8 }}>{'\u2022'}</Text>
                            <Text style={{ flex: 1 }}>{item}</Text>
                        </View>
                    ))}

                    <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>Causes:</Text>
                    {disease.causes.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', marginVertical: 2 }}>
                            <Text style={{ marginRight: 8 }}>{'\u2022'}</Text>
                            <Text style={{ flex: 1 }}>{item}</Text>
                        </View>
                    ))}

                    <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>Cures:</Text>
                    {disease.cures.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', marginVertical: 2 }}>
                            <Text style={{ marginRight: 8 }}>{'\u2022'}</Text>
                            <Text style={{ flex: 1 }}>{item}</Text>
                        </View>
                    ))}

                    <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>Preventive Measures:</Text>
                    {disease.preventive_measures.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', marginVertical: 2 }}>
                            <Text style={{ marginRight: 8 }}>{'\u2022'}</Text>
                            <Text style={{ flex: 1 }}>{item}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

export default DiseaseDetailsScreen;

const styles = StyleSheet.create({});