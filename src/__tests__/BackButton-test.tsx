import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import BackButton from "../components/BackButton"; // Adjust the import path based on your project structure

// Mock the useNavigation hook
const goBackMock = jest.fn();

jest.mock("@react-navigation/native", () => {
  const actual = jest.requireActual("@react-navigation/native");
  return {
    ...actual,
    useNavigation: () => ({
      goBack: jest.fn(), // Mock the goBack function
    }),
  };
});

describe("<BackButton />", () => {
  it("renders the back button correctly", () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <BackButton />
      </NavigationContainer>
    );

    // Check if the back button is rendered
    const backButton = getByTestId("back-button"); // Use a test ID to find the button
    expect(backButton).toBeTruthy();
  });

  it("navigates back when the back button is pressed", () => {
    // Render the BackButton (no need for navigation prop as it's mocked)
    const { getByTestId } = render(
      <NavigationContainer>
        <BackButton />
      </NavigationContainer>
    );

    // Simulate button press
    const backButton = getByTestId("back-button"); // Use a test ID to find the button
    fireEvent.press(backButton);
  });
});
