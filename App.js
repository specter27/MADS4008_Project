import { useState, useEffect } from 'react';
// Navigation imports
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, SafeAreaView } from 'react-native';
// Screens imports
import NowPlayingScreen from './screens/NowPlayingScreen';
import MyPurchases from './screens/MyPurchases';
// Vector Icons
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

export default function App() {
  // state variable to track if there is a logged in user
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  
  useEffect(()=>{
  // code to check if there is a logged in user
  },[])

  return (
    <NavigationContainer>
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
         {/* { (userLoggedIn === true )
           // User has logged in so display another tab for Logout
          && <Tab.Screen name="Logout" component={Logout} /> } */}
       </Tab.Navigator>
    </NavigationContainer>
  );
}