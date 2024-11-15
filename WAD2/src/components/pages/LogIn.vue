<template>
    <div class="firebaseui-auth-container login" style="margin-top: 5%">
    <img class="cat-icon" src="../../assets/cat_icon_2.png">
    <h1>Log In</h1>
    <form @submit.prevent="login">
    <div class="form-group ">
        <label for="email">Email:</label>
        <input type="text" id="email" class="form-control address" v-model='email' value="">
        <label for="password">Password</label>
        <input type="password" id="password" class="form-control contact-number" v-model='password' value="">
        <div class="log-in">
      <button class="button log-in" type="submit" value="login">Log in!</button>
        </div>
    </div>
    </form>
    <p v-if="errorMessage" class='errorMessage' >{{ errorMessage }}</p>
    </div>
</template>

<style>
label{
    color:  #545454;
}
.errorMessage{
    color:red
}
.login{
    text-align: center;
    align-items: center;
    width: 60%;
    margin: 0 auto;
    color:#545454;
}
.form-group{
    margin-top: 5%;
    text-align: left;
    background-color: #fae1ae;
    padding: 2%;
    border-radius: 10px;
    margin-bottom: 10%;
}
.cat-icon{
    width: 30%;
}
.form-group{
    display:block;
}
.form-control{
    margin-bottom: 2%;
    margin-top:1%;
}
.next-button-container{
    text-align: right;
}

.log-in {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    width: 100%;
    font-size: 20px;
}

</style>
    
<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { signIn } from "../../../firebase";  // Firebase auth method
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";  // Firestore methods

export default {
  name: "LogIn",
  setup() {
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const errorMessage = ref("");
    const userName = ref(""); // To store the user's name
    const db = getFirestore(); // Initialize Firestore

    const login = async () => {
      if (!email.value) {
        errorMessage.value = "Email is required.";
        return;
      }
      if (!password.value) {
        errorMessage.value = "Password is required.";
        return;
      }

      try {
        // Authenticate the user
        await signIn(email.value, password.value);

        // After successful login, retrieve the user's name
        await retrieveUserNameByEmail(email.value);

        // Redirect to the home page
        await router.push("/");
      } catch (error) {
        errorMessage.value = "Login failed: " + error.message;
        console.log("Login failed:", error);
      }
    };

    // Function to retrieve the user's name based on email
    const retrieveUserNameByEmail = async (userEmail) => {
      try {
        // Query the Firestore 'users' collection where 'email' equals the user's email
        const userQuery = query(
          collection(db, "users"), // Assuming 'users' is your collection name
          where("email", "==", userEmail)
        );

        const querySnapshot = await getDocs(userQuery);

        // If a matching document is found, extract the user's name
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            userName.value = userData.name; // Assuming 'name' is the field for the user's name
            console.log(userName.value)
            localStorage.setItem('name',userName.value)
          });
        } else {
          console.log("No user found with this email.");
          errorMessage.value = "No user found with this email.";
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
        errorMessage.value = "Error retrieving user data: " + error.message;
      }
    };

    return { email, password, errorMessage, userName, login };
  },
};
    

</script>
