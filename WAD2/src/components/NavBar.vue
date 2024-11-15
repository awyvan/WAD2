<template>
  <div>
      <!-- Navbar -->
      <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
          <div class="container-fluid d-flex align-items-center">
              <router-link class="navbar-brand" to="/">
                  <img src="../assets/cat_icon_2.png" width="50" height="50" class="d-inline-block align-top" alt="">
              </router-link>
              <span class="ms-2 site-title">
                  <router-link to="/" class="nav-link">PawPal</router-link>
              </span>

              <button
                  class="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarNav"
                  aria-controls="navbarNav"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
              >
                  <span class="navbar-toggler-icon"></span>
              </button>

              <div class="collapse navbar-collapse" id="navbarNav">
                  <ul class="navbar-nav ms-auto align-items-center">
                      <li v-if="uid" class="nav-item mx-2">
                          <router-link class="nav-link" to="/profile">Profile</router-link>
                      </li>
                      <li class="nav-item mx-2">
                          <router-link class="nav-link" to="/services">Services</router-link>
                      </li>
                      <li class="nav-item mx-2">
                          <router-link class="nav-link" to="/map">Map</router-link>
                      </li>
                      <li class="nav-item mx-2">
                          <router-link class="nav-link" to="/chat">Chatbot</router-link>
                      </li>
                      <li class="nav-item mx-2">
                          <router-link class="nav-link" to="/shop">Shop</router-link>
                      </li>
                      <li v-if="uid" class="nav-item mx-2">
                          <router-link class="nav-link" to="/messaging">Messaging</router-link>
                      </li>
                      <li class="nav-item mx-2">
                          <router-link class="nav-link" to="/emergency">Emergency</router-link>
                      </li>
                      <li v-if="!uid" class="nav-item mx-2">
                          <router-link class="btn btn-auth" to="/login">Log In</router-link>
                      </li>
                      <li v-if="!uid" class="nav-item mx-2">
                          <router-link class="btn btn-auth" to="/register">Register</router-link>
                      </li>
                      <li v-if="uid" class="nav-item mx-2">
                          <a class="btn btn-auth" @click.prevent="logout">Log Out</a>
                      </li>
                  </ul>
              </div>
          </div>
      </nav>

      <!-- Main Content Container with Top Margin -->
      <main class="content">
      </main>
  </div>
</template>


<script>
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

export default {
  data() {
    return {
      uid: null, // Store the user ID if logged in
    };
  },
  methods: {
    logout() {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          this.uid = null;
          this.$router.push('/'); // Redirect to home after logout
        })
        .catch((error) => {
          console.error("Error logging out:", error);
        });
    },
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.uid = user.uid; // Store the user ID when authenticated
      } else {
        this.uid = null; // Reset if user is not authenticated
      }
    });
  },
};
</script>

<style>
/* Navbar styles */

.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: #f2ebdd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1030;
}

/* Adjust site title */
.site-title {
  color: #ecdfcc;
  font-weight: bold;
  font-size: 1.2em;
}

/* Styles for authentication buttons */
.btn-auth {
  background-color: #e59551 !important;
  color: white !important;
  border-radius: 20px;
  padding: 6px 16px;
  font-weight: 500;
  transition: background-color 0.3s ease;
  text-align: center;
}

.btn-auth:hover {
  background-color: #d48441;
}

/* Main content margin to prevent overlap */
.content {
  margin-top: 73px; /* Adjust this to match the navbar height */
}

/* Other navbar and item styling */
.nav-item {
  border-radius: 10px;
  transition: all 0.3s ease;
}

.nav-item:hover {
  box-shadow: 0 4px 8px rgba(33, 33, 33, 0.2);
}

.nav-link {
  color: #545454 !important;
}

.navbar-brand {
  font-weight: bold;
  color: #545454;
}
</style>
