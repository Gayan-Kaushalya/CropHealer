import React from "react";
import { Pressable, SafeAreaView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const BackButton = () => {
  const navigation = useNavigation(); // Use the prop if provided, otherwise use the hook

  return (
    <SafeAreaView
      style={{ flexDirection: "row", marginHorizontal: 16, marginTop: 12 }}
    >
      <Pressable
        testID="back-button" // added for testing
        style={{ flex: 1 }}
        onPress={() => navigation.goBack()} // navigation is changed to nav
      >
        <FontAwesome name={"arrow-circle-left"} size={36} color="#DFF6E3" />
      </Pressable>
    </SafeAreaView>
  );
};

export default BackButton;
