// React Imports
import { useState, useEffect, cloneElement } from 'react';
import { StyleSheet, Text,TextInput, View, SafeAreaView, Pressable, Alert } from 'react-native';

// Import for Firebase: auth service
import { auth } from "../FirebaseApp"
import { db } from "../FirebaseApp"
import { collection, addDoc } from "firebase/firestore" 

const BuyTicketScreen = ({navigation, route}) => {

  // ------------------------ State & Normal Variables -----------------------
  const [currentUserId, setCurrentUserId] = useState("")
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [errors, setErrors] = useState("");
  const [numberOfTickets, setNumberOfTickets] = useState(0)
  const [purchaseSubTotal, setPurchaseSubTotal] = useState(0)
  const [purchaseTax, setPurchaseTax] = useState(0)
  const [purchaseTotal, setPurchaseTotal] = useState(0)

  const ticket_price = 12


  // ------------------------ Route Params -----------------------------
  const {movie_id, movie_title} = route.params;

  // ------------------------ Lifecycle Hooks ---------------------------
  useEffect( () => {
    console.log("BuyTicketScreen Loaded")
    
    // 1. Set the state variables with the email & userId values from the firebase auth variable
    setUserEmail(auth.currentUser.email)
    setCurrentUserId(auth.currentUser.uid)

  }, []);
  // ------------------------ Event Handlers ----------------------------

  const incrementTicketQuantity = () => {

    // 1. Update the value of state variable(numberOfTickets)
    setNumberOfTickets(numberOfTickets+1)
    
    // 2. Update/Re-calculate the Order Pricing
    calculateOrderPrice(numberOfTickets+1)
  }

  const decrementTicketQuantity = () => {
    if(numberOfTickets>0){

        // 1. Update the value of state variable(numberOfTickets)
        setNumberOfTickets(numberOfTickets-1)

        // 2. Update/Re-calculate the Order Pricing
        calculateOrderPrice(numberOfTickets-1)
    }
  }
  const purchasedButtonClicked = async () => {
    console.log("purchasedButton Clicked")
    
    if ( validateInput() ) {

        // 1. Add the purchase in the Firebase (firestore)
        try {
            const purchaseToBeAdded = {
                movieId: movie_id,
                movieName: movie_title,
                nameOnPurchase: userName, 
                numTickets: parseInt(numberOfTickets),   // Int
                total: parseFloat( purchaseTotal.toFixed(2) ), // Int
                userId: currentUserId
            }
            console.log(`Attemping to Add: `)
            console.log(purchaseToBeAdded)
            const insertedDocument =  await addDoc(collection(db, "purchases"), purchaseToBeAdded)
            console.log(`Document created, id is: ${insertedDocument.id}`)

            // 2. Display Alert message for Purchase Success
            Alert.alert("Purchase Success!");

            // 3. Redirect the user to the NowPlayingScreen
            navigation.navigate("NowPlaying");

        }
        catch (err) {
            console.log(`${err.message}`)
        }

    }
   

  }
  // ---------------------- Helper Functions ----------------------------

  const calculateOrderPrice = (ticketQuantity) => {
    console.log(`numberOfTickets: ${ticketQuantity}`)

    let subtotal = ticket_price * parseInt(ticketQuantity)
    let tax = 0.13 * subtotal
    let total = subtotal + tax

    // Updating the state variables
    updateState(subtotal, tax, total)
  
  }

  const updateState = (subtotal, tax, total) => {
    setPurchaseSubTotal(subtotal)
    console.log(`PurchaseSubTotal: ${purchaseSubTotal}`)
    setPurchaseTax(tax)
    setPurchaseTotal(total)
  }

  const validateInput = () => {
    console.log("Validating the userEmail AND userName")
    let result = true
    if(userEmail.trim() === "" || userName.trim() === ""){

        // Set error message
        console.log(`Error Please provide valid values for the fields`)
        // displays errors to the UI
        setErrors("ERROR: Please provide valid values for the fields")
        result = false
    }
    return result
  }


  // ------------------------ View Template -----------------------
  return (
    <SafeAreaView style={styles.container}>

        <Text style={styles.heading}>Buy Tickets</Text>
        <Text style={styles.movieTitle}>{movie_title}</Text>

        <View style={styles.formContainer}>
            <Text style={styles.titleLabel}>Your email address: </Text>
            <TextInput 
                style={styles.inputStyle}
                autoCapitalize="none"
                placeholder="Enter Email"
                value={userEmail}
                onChangeText={setUserEmail}
            /> 
            <Text style={styles.titleLabel}>Your name: </Text>
            <TextInput 
                style={styles.inputStyle}
                autoCapitalize="none"
                value={userName}
                placeholder="Enter Name"
                onChangeText={setUserName}
            /> 
        </View>
        {/* Errors Message Section */}
        { errors ?  
            <View style={styles.errors}>
                <Text style={styles.errorText}>{errors}</Text>
            </View>
            : null 
        }

        {/* Number of Ticket Section */}
        <Text style={styles.titleLabel}>Number of Tickets: </Text>
        <View style={styles.inlineContainer}>
            
            <Pressable style={styles.quantityButton} onPress={decrementTicketQuantity}>
                <Text style={styles.buttonText}>-</Text>
            </Pressable>
            <Text style={styles.ticketQuantity}>{numberOfTickets}</Text>
            <Pressable style={styles.quantityButton} onPress={incrementTicketQuantity}>
                <Text style={styles.buttonText}>+</Text>
            </Pressable>

        </View>

        {/* Conditional Rendering of the Order Summary */}
        { (numberOfTickets>0) && 

            <View style={styles.orderSummaryCard}>
                <Text style={styles.titleLabel}>Order Summary: </Text>

                <View style={styles.orderContainer}>
                    <Text style={styles.orderSummaryElement}>{movie_title}</Text>
                    <Text style={styles.orderSummaryElement}>Number of Tickets: {numberOfTickets}</Text>
                    <Text style={styles.orderSummaryElement}>Subtotal: ${purchaseSubTotal.toFixed(2)}</Text>
                    <Text style={styles.orderSummaryElement}>Tax: ${purchaseTax.toFixed(2)}</Text>
                    <Text style={styles.purchaseTotalElement}>Total: ${purchaseTotal.toFixed(2)}</Text>
                </View>

            </View>
        }

        <View style={styles.purchaseButtonContainer}>
            <Pressable style={styles.purchaseButton} onPress={purchasedButtonClicked}>
                <Text style={styles.buttonText2}>Confirm Purchase</Text>
            </Pressable>
        </View>
           
    </SafeAreaView>
  )

}

export default BuyTicketScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    heading : {
        fontSize: 24,
        fontWeight: "600",
        marginTop: 10
    },
    movieTitle: {
        fontSize: 20,
        fontWeight: "400",
        marginBottom: 20

    },
    formContainer : {
        alignSelf: 'stretch',
        marginHorizontal: 10,
        marginTop:10,
        marginBottom: 30,
    },
    titleLabel : {
        fontSize: 16,
        fontWeight: '400',
        alignSelf: 'stretch',
        marginHorizontal: 10
    },
    inputStyle : {
        marginVertical: 12,
        height:48,
        padding:15,
        borderColor: '#888',
        borderRadius:10,
        borderWidth:1
    },
    errors : {
        alignSelf:"stretch",
        padding:10,
        marginHorizontal:20,
        backgroundColor: "#C63461",
        marginBottom: 20,
    }, 
    errorText: {
        color:"white"
    }, 
    inlineContainer: {
        flexDirection: 'row',
        justifyContent: 'start',
        marginHorizontal: 10,
        marginTop:10,
        alignSelf: 'stretch'
    },
    quantityButton: {
        alignSelf:"stretch",
        marginHorizontal:2,
        alignItems:"center",
        borderColor: "#3330e3",
        borderWidth: 1,
        padding: 16,
        borderRadius:2,

    },
    ticketQuantity: {
        fontSize: 20,
        fontWeight: "400",
        width:30,
        textAlign: 'center',
        paddingTop: 10

    },
    purchaseButton : {
        backgroundColor: "#3330e3",
        alignSelf:'center',
        width:'80%',
        padding:16,
        marginHorizontal:20,
        alignItems:"center",
        marginBottom:30,
        marginTop: 30,
        borderRadius:10,
    },
    purchaseButtonContainer: {
        flex: 1,
        width:'100%',
        justifyContent:'flex-end',
        
    },
    buttonText : {
        color:"#3330e3",
        fontSize: 18,
        fontWeight: "bold"
    },
    buttonText2 : {
        color:"#ffffff",
        fontSize: 18,
        fontWeight: "bold"
    },
    orderContainer:{
        borderWidth: 2,
        borderColor: '#E5E4E2',
        paddingTop: 10,
        paddingBottom: 5,
        marginTop:10

    },
    orderSummaryCard: {
        marginTop: 70,
        marginHorizontal: 10,
        alignSelf: 'stretch'
    },
    orderSummaryElement: {
        fontSize: 16,
        fontWeight: '500',
        marginHorizontal: 10,
        marginVertical: 2
    },
    purchaseTotalElement: {
        fontSize: 16,
        marginVertical: 2,
        fontWeight: '500',
        height: 30,
        textAlign: 'left',
        backgroundColor: '#FAD02C',
        paddingTop: 5,
        paddingHorizontal: 10

    }
  
});