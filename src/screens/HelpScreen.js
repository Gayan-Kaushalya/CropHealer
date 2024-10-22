import {Text,Image, View, TouchableOpacity, Button} from "react-native";
import { useNavigation } from "@react-navigation/native";


const HelpScreen = () => {
    const navigation = useNavigation();
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Image source={require("./../../assets/help.png")} style={{ flex: 0.8, width: "100%", height: "100%" }} />
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ backgroundColor: "green", padding: 10, borderRadius: 5, width: "80%", alignItems: "center", margin:10 }}>
                <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
                    Got it
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default HelpScreen;