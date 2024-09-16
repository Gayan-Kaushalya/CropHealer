import React, { useState } from "react";
import { View } from "react-native";
import DiseaseCard from "../components/DiseaseCard";
import SearchFilter from "../components/SearchFilter";
import { diseaseList } from "../Diseases";

const data = diseaseList;

const ArticleListScreen = () => {
  const [filteredData, setFilteredData] = useState(data);

  const handleSearch = (text) => {
    const filtered = data.filter((item) =>
      item.disease.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <SearchFilter
        icon="search"
        placeholder="Search..."
        onSearch={handleSearch}
      />

      <DiseaseCard data={filteredData} />
    </View>
  );
};

export default ArticleListScreen;