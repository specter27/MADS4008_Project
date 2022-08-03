// React Imports
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, Pressable } from 'react-native';

// Import for the API Configration 
import  APIConfig  from "../config/api-config"

// Import for Firebase: auth service
import { auth } from "../FirebaseApp"
import { onAuthStateChanged } from "firebase/auth"

// Import for the FontAwesome Icons
import Icon from 'react-native-vector-icons/FontAwesome';

const MovieDetailScreen = ({navigation, route}) => {

  // ------------------------ State Variables -----------------------
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const infoMessage = "You must be loggedIn to use this feature."

  // ------------------------ Route Params -----------------------------
  const {selectedMovie} = route.params;

  // ------------------------ Lifecycle Hooks ---------------------------
  useEffect( () => {

    console.log("MovieDetailScreen Loaded")

    // add an observer to the auth variable
    // this function will automatically run anytime the state of the auth variable changes
    const listener = onAuthStateChanged(auth, (userFromFirebaseAuth) => {
        if (userFromFirebaseAuth) {
            console.log(userFromFirebaseAuth)
            console.log(`A user is logged in: ${userFromFirebaseAuth.email}`)
            setUserLoggedIn(true)      
        }
        else {
            console.log("There is no user logged in");
            setUserLoggedIn(false)
        }
    })
    return listener
  }, []);
  // ------------------------ Event Handlers ----------------------------

  const navigateToNextScreen = () => {

    console.log(`Navigating to the Buy Ticket screen`)

    // # Setting the route params that are required on the MovieDetailScreen
    navigation.navigate("BuyTicket", {movie_id: selectedMovie.id, movie_title: selectedMovie.name});
    
  }

  const navigateToLoginScreen = () => {
    console.log(`Navigating to the Login screen from the Movie Detail Screen`)

    // # Setting the route params that are required on the LoginScreen
    navigation.navigate("Login", 
      { selectedMovie: selectedMovie });

  }

  
  // ---------------------- Helper Functions ----------------------------

  const generateImageURL = () => {

    // # Generating the imageURL using the backdrop_path from the API response
    console.log(`Generating poster image for the = ${selectedMovie.name} `)
    const fileSize = "w500"
    const imageURL = `${APIConfig.imageBaseURL}/${fileSize}${selectedMovie.poster_image}`
    console.log(`Image URL: ${imageURL}`);

    return imageURL
  }

  // ------------------------ View Template -----------------------
  return (
    <SafeAreaView>

      <Image source={ {uri: generateImageURL()} } style={styles.posterImage}/>
     
      <View style={styles.inlineContainer}>
        <Text style={styles.movieTitle}>{selectedMovie.name}</Text>
        <View style={styles.movieRating}>
          <Text style={styles.votingAvg}>{parseFloat(selectedMovie.rating)*10}%</Text>
          <Icon name="star" color='#FAD02C' size={26} />
        </View>   
      </View>
      <Text style={styles.releaseDate}>{selectedMovie.releaseDate}</Text>

      {/* Plot Section */}
      <View style={styles.plotSummary}>
        <Text style={styles.plotHeading}> Plot Summary </Text>
        <Text style={styles.overview}>{selectedMovie.overview}</Text>
      </View>
      
      {/* Buttons Section */}
      <View style={styles.buttonsContainer}>
          {/* Conditional Rendering for the Info Message for logging In */}
          { (!userLoggedIn) && 
              <Text style={styles.info}>{infoMessage}</Text>
          }
          <Pressable disabled={!userLoggedIn} 
            style={[styles.buyTicketButton, { backgroundColor: !userLoggedIn ? '#A9A9A9' : '#3330e3' }]}
            onPress={ navigateToNextScreen }>
              <Text style={styles.buttonText}>Buy Tickets</Text>
          </Pressable>
        
          {/* Conditional Rendering for the Login & SignUp Button */}
          {(!userLoggedIn) && 
            <Pressable style={styles.loginButton} onPress={ navigateToLoginScreen }>
              <Text style={styles.buttonText} >Login or Create New Account</Text>
            </Pressable>
          }

      </View>
      
            
    </SafeAreaView>
  )

}

export default MovieDetailScreen

const styles = StyleSheet.create({

  posterImage:{
    width: '100%',
    height: '30%',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10

  },
  inlineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10
  },
  movieTitle:{
    fontSize: 24,
    fontWeight: '600',
  },
  movieRating: {
    flexDirection: 'row',
    justifyContent: 'start',
  },
  votingAvg:{
    fontSize: 24,
    fontWeight: '400',
  },
  releaseDate:{
    fontSize: 18,
    fontWeight: '300',
    marginHorizontal: 10

  },
  plotSummary: {
    marginTop: 30,
    marginBottom: 30,
    marginHorizontal: 10

  },
  plotHeading:{
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 5
  },
  overview:{
    fontSize: 18,
    fontWeight: '300'
  },
  buttonsContainer:{
    
  },
  info:{
    fontSize: 18,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 10
  },

  buyTicketButton: {
    backgroundColor: "#3330e3",
    alignSelf:"stretch",
    padding:16,
    marginHorizontal:20,
    alignItems:"center",
    marginBottom:20,
    borderRadius:10,
  },

  loginButton : {
    backgroundColor: "#3330e3",
    alignSelf:"stretch",
    padding:16,
    marginHorizontal:20,
    alignItems:"center",
    marginBottom:30,
    borderRadius:10
  },
  buttonText:{
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
  
});