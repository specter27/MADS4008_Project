import { StyleSheet, Text, View, Pressable } from 'react-native';
// Firebase imports
import {auth} from "../FirebaseApp";
// get the functions from the Firebase Auth library
import { signOut } from "firebase/auth";
const LogoutScreen = () => {

  // ---------  Event listeners ------------
  const logoutPressed = async() => {
    //handles logging out
    console.log(`Logout Button Pressed!`)
    try {
      await signOut(auth)
      console.log("User signed out")
    }
    catch (err) {
      Alert.alert(`Signout failed, error occurred: ${err.message}`)
    }
  }

  return (
    <View style={styles.container}>
        <Text style={styles.screenHeading}>Are you ready to logout?</Text>
        <Pressable style={styles.logoutButton} onPress={logoutPressed}>
          <Text style={styles.buttonText}>Logout</Text>
        </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenHeading : {
    fontSize: 22,
    fontWeight: "400",
    marginBottom:30,
  },
  logoutButton : {
    backgroundColor: "#3330e3",
    alignSelf:"stretch",
    padding:16,
    marginHorizontal:20,
    alignItems:"center",
    marginBottom:30,
    borderRadius:10,
  },
  buttonText : {
    color:"white",
    fontSize: 18,
    fontWeight: "bold"
  },    
});

export default LogoutScreen