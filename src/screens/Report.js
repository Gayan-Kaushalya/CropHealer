import React, { useState } from 'react';
import { View, TextInput, Button, Alert, SafeAreaView, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const FeedbackForm = ({navigation}) => {
    const [feedback, setFeedback] = useState('');

    const handleSubmit = () => {
        // Perform any necessary validation or API calls here
        if (feedback.trim() === '') {
            Alert.alert('Error', 'Please enter your feedback');
        } else {
            // Submit the feedback
            Alert.alert('Success', 'Thank you for your feedback');
            setFeedback('');
        }
    };

    return (
        <View style={{ padding: 20, marginTop: 25 }}>
            <SafeAreaView style={{ flexDirection: "row", marginHorizontal: 16 , marginTop: 12}}>
                <Pressable style={{ flex: 1 }} onPress={() => navigation.goBack()}>
                    <FontAwesome name={"arrow-circle-left"} size={28} color="black" />
                </Pressable>
                {/*<FontAwesome name={"heart-o"} size={28} color="black" />*/}
            </SafeAreaView>
            <TextInput
                placeholder="Provide information about the wrong prediction."
                value={feedback}
                onChangeText={text => setFeedback(text)}
                multiline
                style={{ height: 100, borderWidth: 1, padding: 10 }}
            />
            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
};

export default FeedbackForm;
