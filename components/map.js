import React, { useEffect, useState } from 'react';
import { Text, View, Alert } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import { getDatabase, ref, onValue, off } from "firebase/database";

const Map = (props) => {

    const [markers, setMarkers] = useState([]);
    const [locationGranted, setLocationGranted] = useState(false);

    useEffect(() => {
        // Request location permissions
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission to access location was denied");
                return;
            }
            setLocationGranted(true);
        })();

        //Hent markere fra firebase
        const db = getDatabase();
        const markersRef = ref(db, 'Cities/Copenhagen/Markers');
        onValue(markersRef, (snapshot) => {
            const data = snapshot.val();
            // Transform object to array of markers
            if (data) {
                const markersArray = Object.keys(data).map(key => ({
                    ...data[key],
                    id: key // Include the key as an ID for each marker
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
                        title={marker.title}
                        description={marker.description}
                        />
                    ))}
                </MapView>
            ) : (
                <Text>Location permissions are required to show user location</Text>
            )}
        </View>
    );
}

export default Map;
