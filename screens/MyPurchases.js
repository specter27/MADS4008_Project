import { useState, useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, View, Pressable } from 'react-native';
//Firebase Imports
import {auth} from "../FirebaseApp";
// get the functions from the Firebase Auth library
import {  onAuthStateChanged } from "firebase/auth";


const MyPurchases = ({navigation}) => {

   // -------------- State Variables -------------------
   const [viewsToRender, setViewsToRender] = useState();

   // -------------- Event Handlers -------------------
   const loginPressed = () => {
      console.log(`Login Button Pressed!`);
      //navigate to login screen
      navigation.navigate("Login");
   }

   // -------------- Use Effect -------------------
   useEffect(()=>{
      // code to check if there is a logged in user
      onAuthStateChanged(auth, user => {
        if (user) {
          console.log(`Checking user status!`); 
          //Logged in user so display tickets list
        } else {
          // logged out user so display login button
          setViewsToRender(
            <View style={{alignItems:"center"}}>
               <Text> You must be logged in to view this feature.</Text>
               <Pressable style={styles.loginButton} onPress={loginPressed}>
                  <Text style={styles.buttonText}> Log in or Create New Account</Text>
               </Pressable>
            </View>
          )
        }
      });
   }, [])


  return (
     <SafeAreaView style={styles.container}>
        <Text style={styles.screenHeading}>Your Tickets</Text>
        {viewsToRender}
     </SafeAreaView>
  )
}

const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#fff',
     alignItems: 'center',
     justifyContent: 'center',
   },
   screenHeading : {
      fontSize: 22,
      marginTop:10,
      fontWeight: "400",
      marginBottom:10,
    },
    loginButton : {
      backgroundColor: "#3330e3",
      alignSelf:"stretch",
      padding:16,
      paddingHorizontal:30,
      marginHorizontal:20,
      marginVertical:20,
      borderRadius:8,
    },
    buttonText : {
      color:"white",
      fontSize: 18,
      fontWeight: "bold"
    },  
 });

export default MyPurchases