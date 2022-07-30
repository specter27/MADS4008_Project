import { useState, useEffect } from 'react';
// Navigation imports
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, SafeAreaView } from 'react-native';
// Screens imports
import NowPlayingScreen from './screens/NowPlayingScreen';
import MyPurchases from './screens/MyPurchases';
import LogoutScreen from './screens/LogoutScreen';
import LoginScreen from './screens/LoginScreen';
// Vector Icons
import Icon from 'react-native-vector-icons/FontAwesome';
//Firebase Imports
import {auth} from "./FirebaseApp";
// get the functions from the Firebase Auth library
import {  onAuthStateChanged } from "firebase/auth";



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  // state variable to track if there is a logged in user
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  
  // ----------- Bottom tabs Component ---------
  function BottomTabs (){
    //returns the tab navigator to stack
    return (
      <Tab.Navigator screenOptions={{ 
          "tabBarActiveTintColor": "#3330e3", 
          "tabBarInactiveTintColor": "gray",
         }}>
           <Tab.Screen name="NowPlaying" component={NowPlayingScreen}
               options={{
                tabBarIcon: ({ color, size }) => (
                  <Icon name="list-ul" color={color} size={size} />
                ),
              }}
           />
           <Tab.Screen name="MyPurchases" component={MyPurchases}
             options={{
                tabBarIcon: ({ color, size }) => (
                  <Icon name="ticket" color={color} size={size} />
                ),
              }}
           />
           { (userLoggedIn === true )
             // User has logged in so display another tab for Logout
             && <Tab.Screen name="Logout" component={LogoutScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Icon name="user-o" color={color} size={size} />
                  ),
              }}/>
            }
        </Tab.Navigator>
    );
  }

  useEffect(()=>{
  // code to check if there is a logged in user
  onAuthStateChanged(auth, user => {
    if (user) {
      console.log('Authenticated now!');
      setUserLoggedIn(true); //log the user 
    } else {
      setUserLoggedIn(false); //log out
    }
  });
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
            name="BottomNavBar"
            component={BottomTabs}
            options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}