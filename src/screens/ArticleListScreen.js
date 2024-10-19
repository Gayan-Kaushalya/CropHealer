import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import DiseaseCard from "../components/DiseaseCard";
import SearchFilter from "../components/SearchFilter";
import { diseaseList } from "../Diseases";
import BackButton from "../components/BackButton";

import AsyncStorage from '@react-native-async-storage/async-storage';


const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (token !== null) {
      return JSON.parse(token);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

const data = diseaseList;


const ArticleListScreen = () => {
  const [filteredData, setFilteredData] = useState(data);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Fetch the token on component mount
    const fetchToken = async () => {
      const retrievedToken = await getToken();
      setToken(retrievedToken);  // Set the token in the state
    };
    fetchToken();
  }, []);

  const handleSearch = (text) => {
    const filtered = data.filter((item) =>
      item.disease.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 32, textAlign: 'center' }}>
        {token ? `${token.email}` : <Button title="Login" onPress={() => navigation.navigate("Login")} />}
      </Text>
      <BackButton />
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