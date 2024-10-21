import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import DiseaseCard from "../components/DiseaseCard";
import SearchFilter from "../components/SearchFilter";
import { diseaseList } from "../Diseases";

import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from "../components/Header";


const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (token !== null) {
      const tokenObj = JSON.parse(token);
      const currentTime = new Date().getTime();
      if (tokenObj.expiration > currentTime) {
        return tokenObj;
      } else {
        await AsyncStorage.removeItem('authToken');
      }
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
    <View style={{ width: '100%', height: '100%'}}>
      <Header />
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 32, textAlign: 'center' }}>
          Disease List
        </Text>
        <SearchFilter
          icon="search"
          placeholder="Search..."
          onSearch={handleSearch}
        />

        <DiseaseCard data={filteredData} />
      </View>
    </View>
  );
};

export default ArticleListScreen;