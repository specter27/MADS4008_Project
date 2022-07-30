import { useState, useEffect } from 'react';
// Navigation imports
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, SafeAreaView } from 'react-native';
// Screens imports
import NowPlayingScreen from './screens/NowPlayingScreen';
import MyPurchases from './screens/MyPurchases';

const Tab = createBottomTabNavigator();

export default function App() {
  // state variable to track if there is a logged in user
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  
  useEffect(()=>{
  // code to check if there is a logged in user
  },[])

  return (
    <NavigationContainer>
       <Tab.Navigator>
         <Tab.Screen name="NowPlaying" component={NowPlayingScreen} />
         <Tab.Screen name="MyPurchases" component={MyPurchases} />
         {/* { (userLoggedIn === true )
           // User has logged in so display another tab for Logout
          && <Tab.Screen name="Logout" component={Logout} /> } */}
       </Tab.Navigator>
    </NavigationContainer>
  );
}