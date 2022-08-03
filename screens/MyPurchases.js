import { useState, useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, View, Pressable, FlatList } from 'react-native';
//Firebase Imports
import {auth, db} from "../FirebaseApp";

// get the functions from the Firebase Auth library
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
// Vector Icons
import Icon from 'react-native-vector-icons/FontAwesome';


const MyPurchases = ({navigation}) => {

   // -------------- State Variables -------------------
   const [currentUser, setCurrentUserId] = useState("");
   const [loading, setLoading] = useState(false);
   const [viewsToRender, setViewsToRender] = useState();
   const [purchasesList, setPurchasesList] = useState([]);

   // --------------  Helper/methods -------------------
   const renderItem = ( {item} ) => {
    return(
    <View style={styles.listItem}>
      <View>
        {/* Icon */}
        <Icon name="ticket" color={"gray"} size={30} />
      </View>
      <View style={{marginLeft:20}}>
         {/* Movie Details */}
         <Text style={styles.movieName}>{item.movieName}</Text>
         <Text>Num Tickets: {item.numTickets}</Text>
         <Text style={styles.total}>Total Paid: ${item.total}</Text>
      </View>
    </View>
    )
  }

  const getPurchasesFromFirestore = async() => {
    const purchasesCollectionRef = collection(db, "purchases");
    const q = query(purchasesCollectionRef, where("userId", "==", currentUser));
    try{
        console.log(`user: ${currentUser}`);
        await onSnapshot(q, (snapshot) => {
          console.log(`user: ${currentUser}`);
            if(snapshot.size === 0){
              setViewsToRender(
                <View style={{alignItems:"center", justifyContent:"center", flex:1}}>
                  <Text style={styles.screenHeading}> No tickets found! 🕵️</Text>
                  <Text>Once you buy your tickets, they'll appear here. </Text>
                </View>
              )
          } else {
            setViewsToRender();
            setPurchasesList(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id}))); 
          }
      });
    } catch(err){
      console.log(`Error while fetching data from Firestore: ${err.message}`);
    }
  };



   // -------------- Event Handlers -------------------
   const loginPressed = () => {
      console.log(`Login Button Pressed!`);
      //navigate to login screen
      navigation.navigate("Login");
   }

   // -------------- Use Effect -------------------
   let count = 0;
   useEffect(()=>{
      // code to check if there is a logged in user
      onAuthStateChanged(auth, user => {
        if (user) {
          console.log(`Checking user status!`); 
          //Logged in user so display tickets list
          // - 1. Get current user's ID 
         // CURRENT_USER_ID = user.uid;
          //console.log(`ID: ${CURRENT_USER_ID}`);
          setCurrentUserId(user.uid);
   
          getPurchasesFromFirestore();

          setLoading(true);

        } else {
          // logged out user so display login button
          setLoading(false);
          setViewsToRender(
            <View style={{alignItems:"center", justifyContent:"center", flex:1}}>
               <Text> You must be logged in to view this feature.</Text>
               <Pressable style={styles.loginButton} onPress={loginPressed}>
                  <Text style={styles.buttonText}> Login or Create New Account</Text>
               </Pressable>
            </View>
          )
        }
      });
    
      return () => {
        setViewsToRender(); // To clear out the "Can't perform a React state update on an unmounted component." error
      };
   }, [loading])


  return (
     <SafeAreaView style={styles.container}>
        <Text style={styles.screenHeading}>Your Tickets</Text>
        {viewsToRender}
        {
          loading ?  
          <FlatList 
            data={purchasesList}
            keyExtractor={ (item) => item.id}
            renderItem={renderItem}
        />  : null
        }
     </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  screenHeading : {
     fontSize: 22,
     marginTop:10,
     fontWeight: "400",
     alignSelf:"center",
     marginBottom:10,
   },
   loginButton : {
     backgroundColor: "#3330e3",
     alignSelf:"stretch",
     alignItems:"center",
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
   listItem: {
     flexDirection:"row",
     justifyContent:"flex-start",
     alignItems:"center",
     padding:16,
     marginHorizontal:10,
     marginBottom:8,
     borderBottomColor: "#ddd",
     borderBottomWidth:1,
   },
   movieName : {
     fontSize:20,
     marginBottom:2,
   },
   total: {
     color: "#3330e3",
     marginTop:2,
   }
});

export default MyPurchases