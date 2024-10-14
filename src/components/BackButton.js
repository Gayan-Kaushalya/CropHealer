import React from 'react';
import { Pressable, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const BackButton = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flexDirection: "row", marginHorizontal: 16 , marginTop: 12}}>
            <Pressable style={{ flex: 1 }} onPress={() => navigation.goBack()}>
                <FontAwesome name={"arrow-circle-left"} size={28} color="black" />
            </Pressable>
        </SafeAreaView>
    );
}

export default BackButton;