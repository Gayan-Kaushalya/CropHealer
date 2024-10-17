import React from "react";
import { render } from "@testing-library/react-native";
import ArticleListScreen from "../../screens/ArticleListScreen"; // Adjust the path as necessary
import { NavigationContainer } from "@react-navigation/native";

// Mock data for testing
jest.mock("../../components/DiseaseCard", () => (props) => (
  <div data-testid="mock-disease-card">{JSON.stringify(props.data)}</div>
));

jest.mock("../../components/BackButton", () => () => <button>Back</button>);

jest.mock("../../components/SearchFilter", () => ({ onSearch }) => (
  <input
    data-testid="mock-search-filter"
    placeholder="Search..."
    onChange={(e) => onSearch(e.target.value)}
  />
));

describe("<ArticleListScreen />", () => {
  it("renders correctly", () => {
    const { toJSON } = render(
      <NavigationContainer>
        <ArticleListScreen />
      </NavigationContainer>
    );

    // Create a snapshot of the rendered component
    expect(toJSON()).toMatchSnapshot();
  });
});
