<template>
    <div class="registration" style="margin-top: 5%">
      <img class="cat-icon" src="../../assets/cat_icon_2.png" />
      <div id="firebaseui-auth-container"></div>
      <h1>Getting Started</h1>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <!-- Form fields for name, email, password, etc. -->
          <label for="name">Name:</label>
          <input type="text" v-model="name" id="name" class="form-control name" />
  
          <label for="email">Email:</label>
          <input type="email" v-model="email" id="email" class="form-control email" />
  
          <label for="password">Password:</label>
          <input type="password" v-model="password" id="password" class="form-control password" />
  
          <label for="cpassword">Confirm Password:</label>
          <input type="password" v-model="confirmPassword" id="cpassword" class="form-control password" />
  
          <label for="account_type">Account Type:</label><br />
          <input
            type="checkbox"
            class="form-check-input account_type"
            v-model="accountType"
            id="pet-owner"
            value="pet-owner"
          />Pet Owner
          <input
            type="checkbox"
            class="form-check-input account_type"
            v-model="accountType"
            id="service-provider"
            value="service-provider"
            style="margin-left: 8px;"
          />Service Provider
  
          <!-- Other form fields for address, contact number, etc. -->
  
          <div class="next-button-container">
            <button type="submit" class="button">Register Account
            </button>
          </div>
          <p v-if="errorMessage" class="errorMessage">{{ errorMessage }}</p>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
  import { setDoc, doc } from 'firebase/firestore';
  import db from '../../../database.js';
  import { ref } from 'vue';
  
  export default {
    name: 'Register',
    data() {
      return {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        accountType: [],
        address: '',
        contactNumber: '',
        petNumber: '',
        errorMessage: ''
      };
    },
    setup() {
      const email = ref('');
      const password = ref('');
      const errorMessage = ref('');
  
      // Define the Firebase sign-up function
      const signUp = async (email, password) => {
        const auth = getAuth();
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  
          return userCredential.user; // Return the user object upon successful registration
        } catch (error) {
          console.error('Error signing up:', error);
          errorMessage.value = error.message;
          return null;
        }
      };
  
      return { email, password, errorMessage, signUp };
    },
    methods: {
      // Handle form submission
      async handleSubmit() {
        if (!this.validateForm()) return;
  
        const user = await this.signUp(this.email, this.password); // Use signUp method
  
        if (user) {
          // Update profile with the user's name
          await updateProfile(user, { displayName: this.name });
          await this.createUserdb();
        } else {
          this.errorMessage = 'User registration failed. Please try again.';
        }
      },
  
      // Create user data in Firestore
      async createUserdb() {
        try {
          await setDoc(doc(db, 'users', this.name), {
            name: this.name,
            email: this.email,
            accountType: this.accountType,
            address: this.address,
            contactNumber: this.contactNumber,
            petNumber: this.petNumber
          }
        );
        localStorage.setItem('name', this.name)

  
          // Navigate based on account type
          if (this.accountType.includes('service-provider')) {
            await this.$router.push('/GettingStartedServiceProvider');
          } else if (this.accountType.includes('pet-owner')) {
            await this.$router.push('/GettingStartedPetOwner');
          }
        } catch (error) {
          console.error('Error saving user to Firestore:', error);
        }
      },
  
      validateForm() {
        if (!this.name) {
          alert('Name is required');
          return false;
        }
        if (!this.email) {
          alert('Email is required');
          return false;
        }
        if (!this.password) {
          alert('Password is required');
          return false;
        }
        if (this.password !== this.confirmPassword) {
          alert('Passwords do not match');
          return false;
        }
        if (!this.accountType.length) {
          alert('Please select an account type');
          return false;
        }
        return true;
      }
    }
  };
  </script>
  

<style>
label{
    color:  #545454;
}
.errorMessage{
    color:red;
}
.registration{
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
.button{
  display: flex;
  justify-content: center;
  margin-top: 10px;
  width: 100%;
  font-size: 20px;
}

</style>
