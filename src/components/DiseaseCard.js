import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";

const DiseaseCard = ({ data }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate("DiseaseDetails", { disease: item })}
            style={styles.card}
          >
            <Image source={item.image} style={styles.image} />
            <Text style={styles.txt}>{item.disease}</Text>
          </Pressable>
        )}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
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
    backgroundColor: "#AFE6B3",
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
    width: "48%",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "center",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  txt: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
});