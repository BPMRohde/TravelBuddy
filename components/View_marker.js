import { Text, View, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {useEffect, useState} from "react"; 
import Colors from '../constants/Colors';

const View_marker = ({navigation, route}) => {
    const [marker, setMarker] = useState('');

    useEffect(() => {
        setMarker(route.params.marker);

        /*Fjern data, når vi går væk fra screenen*/
        return () => {
            setMarker('');
        }
    },[route.params.marker]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={[styles.container, {borderBottomWidth: 0}]}>
                {marker === '' ? 
                (<Text>Loading...</Text>) :
                (<View>
                    <View style={styles.card}>
                        <Text style={{font: 'bold', fontSize: 30, marginBottom: 10}}>{marker.title}</Text>
                        <Text style={{fontSize: 20, marginBottom: 10}}>Type: {marker.type}</Text>
                        <Text style={{fontSize: 20, marginBottom: 10}}>{marker.description}</Text>
                        <Text style={{fontSize: 20, marginBottom: 10}}>Latitude: {marker.latlng.latitude}</Text>
                        <Text style={{fontSize: 20, marginBottom: 10}}>Longitude: {marker.latlng.longitude}</Text>
                    </View>
                </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.secondary,
        borderBottomColor: 'black',
        borderBottomWidth: 2,
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

export default View_marker; 