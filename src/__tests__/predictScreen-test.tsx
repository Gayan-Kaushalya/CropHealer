import React from "react";
import { render } from "@testing-library/react-native";
import PredictScreen from "../screens/PredictScreen"; // Adjust the path as necessary
import { NavigationContainer } from "@react-navigation/native";

// Mocking navigation
const mockNavigate = jest.fn();

describe("<PredictScreen />", () => {
  it("renders correctly", () => {
    const { toJSON } = render(
      <NavigationContainer>
        <PredictScreen navigation={{ navigate: mockNavigate }} />
      </NavigationContainer>
    );

    // Create a snapshot of the rendered component
    expect(toJSON()).toMatchSnapshot();
  });
});
