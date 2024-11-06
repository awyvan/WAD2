//accessing database
import { getFirestore, collection, doc, setDoc, getDocs } from "@firebase/firestore"; 
import { app } from "./firebase.js"

//init database
const db = getFirestore(app)

//accessing users in database
//collection of users, each user is a document
//under each document(user), user has different properties
const usercolRef = collection(db, 'users')
getDocs(usercolRef)
    .then((snapshot) =>{
        let users= []
        snapshot.docs.forEach((doc) => {
            users.push({...doc.data(),id: doc.id})
        })
    })

    
    const petOwnerscolRef = collection(db, 'petowners')
    getDocs(petOwnerscolRef)
        .then((snapshot) =>{
            let petOwners= []
            snapshot.docs.forEach((doc) => {
                petOwners.push({...doc.data(),id: doc.id})
                //doc.data() will find the e
                
            })
            //this one prints out each owner 
            console.log(petOwners)
        })
        

export default db
