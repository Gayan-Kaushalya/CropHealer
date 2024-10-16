import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import DiseaseCard from "../components/DiseaseCard"; // Adjust the path as needed
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";

// Mock Navigation
const Stack = createNativeStackNavigator();
const MockNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="DiseaseCard"
          component={() => <DiseaseCard data={sampleData} />} // Pass sampleData here
        />
        <Stack.Screen
          name="DiseaseDetails"
          component={() => <Text>Details</Text>}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const sampleData = [
  {
    id: 1,
    disease: "Bacterial Spot",
    image: require("../../assets/diseases/bacterial_spot.png"), // Corrected path
  },
  {
    id: 2,
    disease: "Late Blight",
    image: require("../../assets/diseases/late_blight.png"), // Corrected path
  },
];

describe("<DiseaseCard />", () => {
  it("renders correctly with given data and navigates on press", () => {
    const { getByText, getByRole } = render(
      <MockNavigator /> // Now we use MockNavigator directly
    );
    console.log("DiseaseCard", DiseaseCard);

    // Check if each disease is rendered
    sampleData.forEach((disease) => {
      expect(getByText(disease.disease)).toBeTruthy();
    });

    // Simulate pressing the first disease card
    const firstDiseaseCard = getByText("Bacterial Spot").parent;
    fireEvent.press(firstDiseaseCard);

    // Check if navigation to DiseaseDetails occurs
    expect(getByText("Details")).toBeTruthy(); // Ensure the Details text is rendered
  });
});
