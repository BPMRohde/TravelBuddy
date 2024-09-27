import { Text, View, StyleSheet, SafeAreaView, ScrollView, TextInput, Alert } from 'react-native';
import {useEffect, useState} from "react"; 
import { getDatabase, ref, child, push, update  } from "firebase/database";
import Colors from '../constants/Colors';

const Add_edit_marker = ({navigation, route}) => {
    const db = getDatabase();
    const initialState = {
        latlng: {
            latitude: 0,
            longitude: 0
        },
        title: '',
        type: '',
        description: ''
    }

    const [newMarker, setNewMarker] = useState(initialState);
    const isEditMarker = route.name === 'Edit marker';

    useEffect(() => {
        if(isEditMarker){
            setNewMarker(route.params.marker[1]);
        }
        /*Fjern data, når vi går væk fra screenen*/
        return () => {
            setNewMarker(initialState);
        }
    },[]);

    const changeTextInput = (key, value) => {
        setNewMarker({...newMarker, [key]: value});
    };

    const saveMarker = async () => {
        const {latlng, title, type, description} = newMarker;
        if (title === '' || type === '' || description === ''|| latlng.latitude === 0 || latlng.longitude === 0) {
            Alert.alert('Please fill out all fields');
            return;
        }

        if(isEditMarker){
            const id = route.params.marker[0];
            const markerRef = ref(db, `Cities/Copenhagen/Markers/${id}`);

            const updateFields = {
                title,
                type,
                description,
                latlng
            };

            await update(markerRef, updateFields)
                .then(() => {
                    Alert.alert('Marker updated');
                    const marker = newMarker;
                    navigation.navigate('Map');
                })
                .catch((error) => {
                    Alert.alert('Error updating marker', error.message);
                });
            } else{
                const markerRef = ref(db, 'Cities/Copenhagen/Markers');

                const newMarkerRef = {
                    title,
                    type,
                    description,
                    latlng
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
        width: 450,
    },
    section: {
        marginBottom: 20,
    },
})

export default Add_edit_marker; 