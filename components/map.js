import React, { useEffect, useState } from 'react';
import { Text, View, Alert, Image, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, {Marker, Callout} from 'react-native-maps';
import * as Location from 'expo-location';
import { getDatabase, ref, onValue, off } from "firebase/database";
import { useNavigation } from '@react-navigation/native';

const Map = (props) => {
    const navigation = useNavigation();
    const [markers, setMarkers] = useState([]);
    const [locationGranted, setLocationGranted] = useState(false);

    useEffect(() => {
        //Der bedes om tilladelse til at bruge lokalitets information.
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission to access location was denied");
                return;
            }
            setLocationGranted(true);
        })();

        //Her hentes markører fra databasen.
        const db = getDatabase();
        const markersRef = ref(db, 'Cities/Copenhagen/Markers');
        onValue(markersRef, (snapshot) => {
            const data = snapshot.val();
            //Det objekt som kommer fra databasen omdannes til et array af markører. Derudover konverteres lat/lng fra strings til floats, dette er nødvendigt for android kompatibilitet.
            if (data) {
                const markersArray = Object.keys(data).map(key => ({
                    ...data[key],
                    id: key, // Include the key as an ID for each marker
                    latlng: {
                        latitude: parseFloat(data[key].latlng.latitude),  // Ensure latitude is a float
                        longitude: parseFloat(data[key].latlng.longitude) // Ensure longitude is a float
                    }
                }));
                setMarkers(markersArray);
            }
        });

        return () => {
            off(markersRef);
        };
    }, []);

    return (
        <View style={{flex: 1}}>
            {locationGranted ? (
                <MapView style={{flex: 1}}
                    initialRegion={
                        {
                            latitude: 55.676098,
                            longitude: 12.568337,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421
                        }
                    }
                    showsUserLocation
                    showsMyLocationButton
                    showsCompass
                    showsScale
                >
                    {markers.map((marker) => (
                        <Marker
                        key={marker.id}
                        coordinate={marker.latlng}
                        >
                            <Image source={require('../assets/marker.png')} style={{width: 30, height: 30}} />
                            <Callout onPress={() => navigation.navigate('View_marker', {marker})}>
                                <View style={styles.callout}>
                                    <Text style={styles.title}>{marker.title}</Text>
                                    <Text style={styles.type}>{marker.type}</Text>
                                    <Text style={styles.description}>{marker.description}</Text>
                                    <View style={styles.button}>
                                        <Text >See more</Text>
                                    </View>
                                </View>
                            </Callout>
                        </Marker>
                    ))}
                </MapView>
            ) : (
                <Text>Location permissions are required to show user location</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    callout: {
        width: 200,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16
    },
    type: {
        fontStyle: 'italic'
    },
    description: {
        fontSize: 12,
        marginTop: 5
    },
    button: {
        backgroundColor: '#7AE3BB',
        padding: 10,
        borderRadius: 5,
        marginTop: 5
    },
});

export default Map;
