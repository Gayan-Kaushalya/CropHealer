import React from "react";
import { render } from "@testing-library/react-native";
import WelcomeScreen from "../screens/WelcomeScreen"; // Adjust the path as necessary
import { NavigationContainer } from "@react-navigation/native";

// Mocking the navigation object
const mockNavigate = jest.fn();

describe("<WelcomeScreen />", () => {
  it("renders correctly", () => {
    const { toJSON } = render(
      <NavigationContainer>
        <WelcomeScreen navigation={{ navigate: mockNavigate }} />
      </NavigationContainer>
    );

    // Create a snapshot of the rendered component
    expect(toJSON()).toMatchSnapshot();
  });
});
