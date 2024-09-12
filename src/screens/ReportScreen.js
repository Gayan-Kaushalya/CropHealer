import React from "react";
import  useSendEmail  from "../components/useSendEmail";
import { TouchableOpacity } from "react-native";

const ReportScreen = () => {
    const { sendEmail } = useSendEmail({ prediction: "prediction", reality: "reality" });

    return (
        <>
         <TouchableOpacity 
            style = {styles.row}
            onPress = { async () => {
                try {
                    const event = await sendEmail();

                    if (event !== 'cancelled') {
                        alert('Email sent successfully');
                    }
                } catch (error) {
                    alert('An error occurred while sending the email');
                }
            }}>
            <Text >Report</Text>
            </TouchableOpacity>
        </>
    )
}

export default ReportScreen;
