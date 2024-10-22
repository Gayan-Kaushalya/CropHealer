import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import SearchFilter from "../components/SearchFilter"; // Adjust the import based on the file location

describe("<SearchFilter />", () => {
  it("renders correctly with provided icon and placeholder", () => {
    const placeholderText = "Search...";
    const { getByPlaceholderText } = render(
      <SearchFilter icon="search" placeholder={placeholderText} />
    );

    // Check if the placeholder text is rendered correctly
    const input = getByPlaceholderText(placeholderText);
    expect(input).toBeTruthy(); // Ensure the input field is present
  });

  it("calls onSearch with the correct text when input changes", () => {
    const mockOnSearch = jest.fn(); // Create a mock function
    const { getByPlaceholderText } = render(
      <SearchFilter
        icon="search"
        placeholder="Search..."
        onSearch={mockOnSearch}
      />
    );

    // Simulate typing in the search input
    const input = getByPlaceholderText("Search...");
    fireEvent.changeText(input, "apple");

    // Check if onSearch was called with the correct argument
    expect(mockOnSearch).toHaveBeenCalledWith("apple");
  });
});
