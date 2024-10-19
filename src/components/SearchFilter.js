import { StyleSheet, TextInput, View } from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";

const SearchFilter = ({ icon, placeholder, onSearch }) => {
  const [searchText, setSearchText] = useState("");
  const handleSearch = (text) => {
    setSearchText(text);
    if (onSearch) {
      onSearch(text);
    }
  };

  return (
    <View style={styles.container}>
      <FontAwesome name={icon} size={20} color="black" />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={searchText}
        onChangeText={handleSearch}
      />
    </View>
  );
};

export default SearchFilter;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 7,
  },
  input: {
    paddingLeft: 8,
    fontSize: 16,
    color: "#000",
    flex: 1,
  },
});