import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View } from 'react-native';
import { getApps, initializeApp } from "firebase/app"; 
import {createStackNavigator} from "@react-navigation/stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {NavigationContainer} from "@react-navigation/native";
import Map from "./components/map";
import Add_edit_marker from './components/Add_edit_marker';
import { Ionicons } from '@expo/vector-icons';
import Colors from './constants/Colors';
import View_marker from './components/View_marker';

const firebaseConfig = {
  apiKey: "AIzaSyDcOzVB8EXfwDtLlnN5p4bKcscC_ZOOLgE",
  authDomain: "fir-test-b3f66.firebaseapp.com",
  databaseURL: "https://fir-test-b3f66-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fir-test-b3f66",
  storageBucket: "fir-test-b3f66.appspot.com",
  messagingSenderId: "896839969752",
  appId: "1:896839969752:web:e655fe02166110def720ad",
  measurementId: "G-ELVNEG5Y1L"
};


    // Vi kontrollerer at der ikke allerede er en initialiseret instans af firebase
    // Så undgår vi fejlen Firebase App named '[DEFAULT]' already exists (app/duplicate-app).
    if (getApps().length < 1) {
      initializeApp(firebaseConfig);
      console.log("Firebase On!");
  // Initialize other firebase products here
  }

export default function App() {

 const Stack = createStackNavigator();
 const Tab = createBottomTabNavigator();
 const StackNavigation = () => {
    return(
        <Stack.Navigator
          screenOptions={{
            headerTintColor: 'black',
            headerStyle: { backgroundColor: Colors.primary },
            headerTitle: () => (
              <Image source={require('./assets/logo.png')} style={{width: 50, height: 50}} />
            ),
          }}
        >
          <Stack.Screen name="Map" component={Map} />
          <Stack.Screen name="Add_edit_marker" component={Add_edit_marker} />
          <Stack.Screen name="View_marker" component={View_marker} />
        </Stack.Navigator>
    )
  }

  const BottomNavigation = () => { 
    return(
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            "tabBarActiveTintColor": "black",
            "tabBarInactiveTintColor": "black",
            "tabBarActiveBackgroundColor": Colors.activeNavigation,
            "tabBarInactiveBackgroundColor": Colors.primary,
            "tabBarStyle": [
              {
                "display": "flex"
              },
              null
            ]
          }}
        >
        <Tab.Screen name={'Home'} component={StackNavigation} options={{tabBarLabel: () => null, tabBarIcon: ({focused}) => ( <Image source={require('./assets/map2.png')} style={{width: 30, height: 30}} />),headerShown:null}}/>
        <Tab.Screen name={'Add Marker'} component={Add_edit_marker} options={{tabBarIcon: ({focused}) => ( <Image source={require('./assets/add.png')} style={{width: 30, height: 30}} />),headerShown:null}}/>
        </Tab.Navigator>
      </NavigationContainer>
    )
  }

 return (
   <BottomNavigation/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
