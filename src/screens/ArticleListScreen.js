import { StyleSheet, SafeAreaView, Text, View, ScrollView  } from "react-native";
import React from "react";
import Header from "../components/Header";
import SearchFilter from "../components/SearchFilter";
import CategoriesFilter from "../components/CategoriesFilter";
import DiseaseCard from "../components/DiseaseCard";

const ArticleListScreen = () => {
    return (
        <SafeAreaView style = {{flex: 1, marginHorizontal: 16}}>
            {/*  render header  */}
            <Header headerText={"Article List"}  headerIcon={"list"} />

            {/*  search filter  */}
            < SearchFilter icon="search" placeholder={"Search Disease"} />

            {/* Categories filter */}
            <View style = {{marginTop: 20}}>
                <Text style = {{fontSize: 24, fontWeight: "bold", marginTop: 20, marginBottom: 20}}>
                   Categories 
                </Text>
                < CategoriesFilter />
            </View>

            {/* Disease List filter */}
            <View style = {{marginTop: 20, flex: 1}}  >
                <Text style = {{fontSize: 24, fontWeight: "bold", marginTop: 20, marginBottom: 20}}>
                    Diseases
                </Text>
                <DiseaseCard />
            </View>


        </SafeAreaView >
    );
};

export default ArticleListScreen;

const styles = StyleSheet.create({});