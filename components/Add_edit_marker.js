import { Text, View, StyleSheet, SafeAreaView, ScrollView, TextInput, Alert } from 'react-native';
import {useEffect, useState} from "react"; 
import { getDatabase, ref, push, update  } from "firebase/database";
import Colors from '../constants/Colors';
import { TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';

const Add_edit_marker = ({navigation, route}) => {
    const db = getDatabase();
    const initialState = {
        latlng: {
            latitude: 0,
            longitude: 0
        },
        title: '',
        type: '',
        description: '',
        address: ''
    }

    const [newMarker, setNewMarker] = useState(initialState);

    useEffect(() => {
        return () => {
            setNewMarker(initialState);
        }
    },[]);

    const changeTextInput = (key, value) => {
        setNewMarker({...newMarker, [key]: value});
    };

    //Denne funktion bruges til at omdanne en adresse til koordinater.
    const geoCode = async () => {
        const geocodedLocation = await Location.geocodeAsync(newMarker.address);
        console.log('Geocoded location:', geocodedLocation);
    
        if (geocodedLocation.length > 0) {
            const { latitude, longitude } = geocodedLocation[0];
            return { latitude, longitude }; // Return new coordinates
        } else {
            Alert.alert('Address not found');
            return null; // Indicate failure
        }
    };
    
    
    //Denne funktion bruges til at gemme en markør
    const saveMarker = async () => {
        const {title, type, description, address} = newMarker;
        if (title === '' || type === '' || description === ''|| address === '') {
            Alert.alert('Please fill out all fields');
            return;
        }

        //Her geoCoder vi adressen til latlng
        const newLatLng = await geoCode(); // Get new coordinates
        if (!newLatLng) {
            Alert.alert('Address not found');
            return;
        }

        const { latitude, longitude } = newLatLng;

        // Marker opdateres med de nyfundne koordinater
        setNewMarker((prev) => ({
            ...prev,
            latlng: { latitude, longitude }
        }));

        // Hvis der ikke er fundet koordinater, må adressen være ugyldig
        if (latitude === 0 && longitude === 0) {
            Alert.alert('Address not found');
            return;
        }
        
        const markerRef = ref(db, 'Cities/Copenhagen/Markers');

        const newMarkerRef = {
            title,
            type,
            description,
            latlng: {latitude, longitude},
            address
        };

        await push(markerRef, newMarkerRef)
            .then(() => {
                Alert.alert('Marker added');
                setNewMarker(initialState);
            })
            .catch((error) => {
                Alert.alert('Error adding marker', error.message);
            });
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={[styles.container, {borderBottomWidth: 0}]}>
                <View style={styles.card}>
                    <Text style={{font: 'bold', fontSize: 30, marginBottom: 10}}>Make a marker</Text>
                    <View style={styles.section}>
                        <Text style={styles.label}>Title</Text>
                        <TextInput style={styles.input} value={newMarker.title} onChangeText={(e) => changeTextInput('title',e)}></TextInput>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.label}>Type</Text>
                        <TextInput style={styles.input} value={newMarker.type} onChangeText={(e) => changeTextInput('type',e)}></TextInput>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput style={[styles.input, {height: 100}]} editable multiline value={newMarker.description} onChangeText={(e) => changeTextInput('description',e)}></TextInput>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.label}>Adress</Text>
                        <TextInput style={[styles.input, {height: 100}]} editable multiline value={newMarker.address} onChangeText={(e) => changeTextInput('address',e)}></TextInput>
                    </View>
                    <TouchableOpacity style={{backgroundColor: Colors.primary, padding: 10, borderRadius: 10, marginTop: 20}} onPress={saveMarker}>
                        <Text style={{color: 'white', fontWeight: 'bold'}}>Save marker</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.secondary,
    },
    input: {
        height: 40,
        width: 200,
        marginTop: 10,
        borderBottomWidth: 1,
        borderRadius: 10,
        backgroundColor: '#e9ecef',
        padding: 10,
    },
    label: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: 'white',
        padding: 20,
        margin: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    section: {
        marginBottom: 20,
    },
})

export default Add_edit_marker; 
