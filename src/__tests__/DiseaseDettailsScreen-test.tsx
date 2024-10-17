import React from "react";
import { render } from "@testing-library/react-native";
import DiseaseDetailsScreen from "../screens/DiseaseDetailsScreen"; // Adjust the path as necessary
import { NavigationContainer } from "@react-navigation/native";

// Sample disease data for testing
const mockDisease = {
  disease: "Bacterial Spot",
  description: "Bacterial Spot is a common disease in plants.",
  color: "#ffcccb",
  image: require("../../assets/diseases/bacterial_spot.png"), // Adjust the path as needed
  crops: ["Tomato", "Pepper", "Eggplant"],
  symptoms: ["Leaf spots", "Wilting", "Fruit rot"],
  causes: ["Bacteria", "Poor drainage"],
  cures: ["Remove infected plants", "Use resistant varieties"],
  preventive_measures: ["Proper irrigation", "Crop rotation"],
};

describe("<DiseaseDetailsScreen />", () => {
  it("renders correctly with given disease data", () => {
    const { toJSON } = render(
      <NavigationContainer>
        <DiseaseDetailsScreen route={{ params: { disease: mockDisease } }} />
      </NavigationContainer>
    );

    // Create a snapshot of the rendered component
    expect(toJSON()).toMatchSnapshot();
  });
});
