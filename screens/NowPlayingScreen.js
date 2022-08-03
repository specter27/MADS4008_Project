// React Imports
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, ActivityIndicator, Pressable } from 'react-native';

// Import for the API Configration 
import  APIConfig  from "../config/api-config"
// Import for the FontAwesome Icons
import Icon from 'react-native-vector-icons/FontAwesome';

const NowPlayingScreen = ({navigation}) => {


  // ------------------------ State Variables -----------------------
  const [isLoading, setLoading] = useState(true);
  const [nowPlayingList, setNowPlayingList] = useState([]);

  // ------------------------ Route Params -----------------------------


  // ------------------------ Lifecycle Hooks ---------------------------
  useEffect( () => {

    console.log("NowPlayingScreen Loaded")
    getNowPlayingMovies()
  }, []);


  // ------------------------ Event Handlers ----------------------------
  const navigateToNextScreen = (selectedMovie) => {

    console.log(`Navigating to the Movie details screen for Movie_Name: ${selectedMovie.title}`)

    // # Setting the route params that are required on the MovieDetailScreen
    navigation.navigate("MovieDetail", 
    { selectedMovie: 
      { id: selectedMovie.id, name: selectedMovie.title,
        poster_image: selectedMovie.backdrop_path, rating: selectedMovie.vote_average,
        overview: selectedMovie.overview, releaseDate: selectedMovie.release_date
      }
    });
    
  }

  
  // ---------------------- Helper Functions ----------------------------
  const getNowPlayingMovies = () => {
    
      console.log("Getting the NowPlayingMovies")
      console.log(`baseURL: ${APIConfig.baseURL}`)

      // 1. Generating the apiURL
      const queryString = "3/movie/now_playing"
      const optionalQueryString = "language=en-US&page=1&region=CA"
      const apiURL = `${APIConfig.baseURL}/${queryString}?api_key=${APIConfig.apiKey}&${optionalQueryString}`
      console.log(apiURL);

      return fetch(apiURL)
      .then( (response) => response.json()
                          .then( (jsonData) => {
                            // 2. Setting the state variable (nowPlayingList)
                            setNowPlayingList(jsonData.results); 
                              console.log(`Response JSON Data : ${jsonData.results.length}`);
                          })
                          .catch( (error) => {
                            console.log(`Error while getting json from response : ${error}`)
                          })
                          .finally( () => 
                            // 3. Setting the state variable (isLoading)
                            setLoading(false)
                          )
      )
      .catch( (error) => {
        console.log(`Error while getting response from server : ${error}`)
      })
      .finally( () => 
        // 3. Setting the state variable (isLoading)
        setLoading(false)
      );
  }
  

  const renderItem = ( {item} ) => (
    <Pressable onPress={() => navigateToNextScreen(item)}>

        <View style={styles.listItem}>
          <View>
            <Text style={styles.movieTitle}>{item.original_title}</Text>
            <Text style={styles.releaseDate}>Release Date: {item.release_date}</Text>
          </View>
          <Icon name="angle-right" color='#3330e3' size={24} />
        </View>

    </Pressable>
);


  // ------------------------ View Template -----------------------
  return (
    <SafeAreaView>
            
          {isLoading ? (
              <ActivityIndicator animating={true} size="large" />
          ) : (

              <FlatList 
                data={nowPlayingList}
                keyExtractor={ (item) => {return item.id}}
                renderItem={ renderItem }
              />

          )}

    </SafeAreaView>
  )
}

export default NowPlayingScreen

const styles = StyleSheet.create({
  listItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 20,
      borderBottomColor: '#dddddd',
      borderBottomWidth: 1
  },
  separator:{
      height: 15,
      backgroundColor: '#dddddd',
  },
  movieTitle:{
    fontSize: 18,
    fontWeight: '400',
  },
  releaseDate: {

  }
});