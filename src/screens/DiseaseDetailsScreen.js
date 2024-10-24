import { StyleSheet, Text, View, Image, SafeAreaView, Pressable, ScrollView } from "react-native";
import React from "react";
import BackButton from "../components/BackButton";



const DiseaseDetailsScreen = ({ route }) => {
    const { disease } = route.params || {};

    return (
        <ScrollView style={{ backgroundColor: '#1C511F', flex: 1 }} showsVerticalScrollIndicator={false}>
            <BackButton />
            <View
                style={{
                    backgroundColor: "#DFF6E3",
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
                    <Image source={disease.image} style={{ height: "100%", width: "100%", borderRadius: 150, borderWidth: 5, borderColor: "white" }} />
                </View>

                {/* Disease Name */}
                <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 160 }}>{disease.disease}</Text>

                {/* Description */}    
                <Text style={{ marginHorizontal: 16, textAlign: "center", marginTop: 16 }}>{disease.description}</Text>

                {/* Extra Details */}
                <View style={{ alignSelf: "flex-start", marginHorizontal: 22, marginBottom: 16, width: '100%', paddingRight: 16 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>Crops:</Text>
                    <Text style={{ marginLeft: 16 }}>{disease.crops.join(", ")}</Text>

                    <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>Symptoms:</Text>
                    {disease.symptoms.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', marginVertical: 2, marginLeft: 16 }}>
                            <Text style={{ marginRight: 8 }}>{'\u2022'}</Text>
                            <Text style={{ flex: 1 }}>{item}</Text>
                        </View>
                    ))}

                    <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>Causes:</Text>
                    {disease.causes.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', marginVertical: 2, marginLeft: 16 }}>
                            <Text style={{ marginRight: 8 }}>{'\u2022'}</Text>
                            <Text style={{ flex: 1 }}>{item}</Text>
                        </View>
                    ))}

                    <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>Cures:</Text>
                    {disease.cures.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', marginVertical: 2, marginLeft: 16 }}>
                            <Text style={{ marginRight: 8 }}>{'\u2022'}</Text>
                            <Text style={{ flex: 1 }}>{item}</Text>
                        </View>
                    ))}

                    <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>Preventive Measures:</Text>
                    {disease.preventive_measures.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', marginVertical: 2, marginLeft: 16 }}>
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