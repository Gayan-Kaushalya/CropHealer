import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

const FeedbackForm = () => {
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
        <View>
            <TextInput
                placeholder="Enter your feedback"
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
