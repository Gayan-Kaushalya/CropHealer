import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage"; 

const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('authToken');
        return token ? JSON.parse(token) : null; // Return parsed token or null
    } catch (error) {
        console.error('Error retrieving token:', error);
        return null;
    }
};

const HistoryScreen = () => {
    const route = useRoute();
    const [reports, setReports] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');

    // Fetch the email from AsyncStorage
    useEffect(() => {
        const fetchEmail = async () => {
            const tokenData = await getToken();
            if (tokenData) {
                setEmail(tokenData.email);
            }
        };
        fetchEmail();
    }, []);

    // Fetch reports when email is set
    useEffect(() => {
        const fetchReports = async () => {
            if (!email) return; // Do not fetch reports if email is not set

            try {
                const url = 'http://192.168.8.165:8001/'; // Adjust to your server IP
                console.log("Email:", email);
                const response = await axios.get(`${url}getreports`, {
                    params: { email }  // This will append ?email=your_email to the URL
                });
    
                const data = response.data; // Directly access data
                console.log(data);

                if (data && data.reports) {
                    setReports(data.reports);
                } else {
                    setReports([]);
                }
            } catch (error) {
                console.error('Error:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [email]); // Trigger when email changes

    const renderReport = ({ item }) => (
        <View style={styles.reportRow}>
            <Text style={styles.reportText}>{item.date}</Text>
            <Text style={styles.reportText}>{item.actPlant || 'N/A'}</Text>
            <Text style={styles.reportText}>{item.actDisease || 'N/A'}</Text>
            <Text style={styles.reportText}>{item.predPlant}</Text>
            <Text style={styles.reportText}>{item.predDisease}</Text>
            <Text style={styles.reportText}>{item.pred_prob}</Text>
        </View>
    );

    const renderHeader = () => (
        <View style={styles.headerRow}>
            <Text style={styles.headerText}>Date</Text>
            <Text style={styles.headerText}>Act Plant</Text>
            <Text style={styles.headerText}>Act Disease</Text>
            <Text style={styles.headerText}>Pred Plant</Text>
            <Text style={styles.headerText}>Pred Disease</Text>
            <Text style={styles.headerText}>Pred Prob</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#387478" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header />
            <Text style={styles.title}>Report List</Text>
            {error ? (
                <Text style={styles.errorText}>Error fetching reports: {error}</Text>
            ) : (
                <FlatList
                    data={reports}
                    renderItem={renderReport}
                    keyExtractor={(item, index) => index.toString()}
                    ListHeaderComponent={renderHeader}
                    ListEmptyComponent={<Text>No reports found</Text>}
                    contentContainerStyle={styles.list}
                    style={styles.flatList} // Style applied to FlatList
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        marginVertical: 20, // Adjust this margin as necessary
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    reportRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    reportText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
    },
    list: {
        flexGrow: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#d5d5d5', // Light gray background for header
        borderBottomWidth: 2,
        borderBottomColor: '#ccc',
    },
    headerText: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    flatList: {
        marginTop: 0, // Ensure no margin at the top of the FlatList
    },
});

export default HistoryScreen;
