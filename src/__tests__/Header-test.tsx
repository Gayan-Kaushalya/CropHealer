import React from "react";
import { render } from "@testing-library/react-native";
import Header from "../components/Header"; // Adjust the path as needed
import { FontAwesome } from "@expo/vector-icons"; // Import if needed

describe("<Header />", () => {
  it("renders correctly with given headerText and headerIcon", () => {
    const { getByText, getByTestId } = render(
      <Header headerText="Test Header" headerIcon="star" />
    );

    // Check if the header text is rendered
    expect(getByText("Test Header")).toBeTruthy();

    // Check if the FontAwesome icon is rendered
    const iconView = getByTestId("header-icon");
    expect(iconView).toBeTruthy(); // Ensure the icon View is rendered

    // Check if the FontAwesome icon is rendered and verify the icon name
    const icon = iconView.findByType(FontAwesome);
    expect(icon).toBeTruthy(); // Ensure the FontAwesome component is rendered
    expect(icon.props.name).toBe("star"); // Verify the icon name
  });
});
