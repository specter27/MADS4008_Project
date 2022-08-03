import { useState, useEffect } from 'react';
// Navigation imports
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screens imports
import NowPlayingScreen from './screens/NowPlayingScreen';
import MyPurchases from './screens/MyPurchases';
import LogoutScreen from './screens/LogoutScreen';
import LoginScreen from './screens/LoginScreen';
import MovieDetailScreen from './screens/MovieDetaliScreen';
import BuyTicketScreen from './screens/BuyTicketScreen';

// Vector Icons
import Icon from 'react-native-vector-icons/FontAwesome';
//Firebase Imports
import {auth} from "./FirebaseApp";
// get the functions from the Firebase Auth library
import {  onAuthStateChanged } from "firebase/auth";



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {

  // ------------------------ State Variables -----------------------
  // state variable to track if there is a logged in user
  const [userLoggedIn, setUserLoggedIn] = useState(false)

  // ---------------------- Helper Functions ----------------------------


  function Home() {
    return (
      <Stack.Navigator initialRouteName="NowPlaying">
          <Stack.Screen
              name="NowPlaying"
              component={NowPlayingScreen}
          />
          <Stack.Screen name="Login"
              component={LoginScreen}
              options={() => ({
                headerBackTitle: "Back",
              })} />
          <Stack.Screen 
              component={MovieDetailScreen}
              name="MovieDetail" 
              options={() => ({
                headerBackTitle: "Back",
              })}
            />
          <Stack.Screen 
              component={BuyTicketScreen} 
              name="BuyTicket"
              options={() => ({
                headerBackTitle: "Back",
              })}
            />

        </Stack.Navigator>
    );
  }

  // ------------------------ Lifecycle Hooks ---------------------------
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


  // ------------------------ View Template -----------------------
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ 
          "tabBarActiveTintColor": "#3330e3", 
          "tabBarInactiveTintColor": "gray",
         }} >
           <Tab.Screen component={Home} name="Home"
               options={{
                tabBarIcon: ({ color, size }) => (
                  <Icon name="list-ul" color={color} size={size} />
                ),
                headerShown: false
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

    </NavigationContainer>
  );
}