<template>
  <head>
    <!-- Link to Font Awesome icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <!-- Add the viewport meta tag for responsive design -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <div class="container-fluid box" style="margin-top: 5%">
    <div class="row">
      <!-- Profile Bar: Column with fixed width on large screens and full width on small screens -->
      <div class="col-md-3 profile-bar">
        <img class="profile_pic img-fluid" src="../../assets/service_provider_avatar.png" alt="Profile Picture">
        <strong><h1 class="profile-name">{{ name }}</h1></strong>
        <h2 class="profile-tagline">I love cats</h2>
        <div class="profile-location">
          <svg xmlns="http://www.w3.org/2000/svg" width="10%" height="10%" fill="#9e4632" class="bi bi-geo-alt" viewBox="0 0 16 16">
            <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
            <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
          </svg>
          <p>City Hall</p>
        </div>
        <div class="more-description">
          <h6>Years of Experience: 8 Years</h6>
          <h6>Volunteer & Pet Owner</h6>
          <h6>Completed Orders: 8</h6>
        </div>
      </div>

      <!-- Profile Contents: Larger content section for profile details -->
      <div class="col-md-9 profile-contents">
        <h1>More About {{ name }}</h1>
        <p>I am a big fan of cats. I have experience of up to 10 years with cats. Currently, I have 4 cats at home, and this is my retirement job. yada yada yada yada</p>
        <h2>Preferences</h2>
        <p>&#128054; <b>Animals:</b> 10-20kg dogs, cats</p><br>
        <p>&#128168; <b>Willing to travel:</b> 10km radius</p><br>
        <p><b>&#128176; Rates:</b></p><br>
        <p>&#127968; Pet Sitting: $30/h</p><br>
        <p>&#128694; Pet Walking: $40/h</p><br>
        <p>&#128663; Pet Transport: $50</p><br>

        <div class="reviews">
          <h1>What Customers Say</h1>
          <h3>Average: 5/5 &#127775; ratings</h3>
          <div class="card-container">
            <ul class="cards">
              <div class="cardforscroll">
                <li class="review-card card" v-for="(review, index) in reviews" :key="index">
                  <div class="card-div">
                    <div class="card-body">
                      <div class="card-top" style="display: flex; justify-content: space-between; align-items: center;">
                        <h1 class="reviewer-name">{{ review.reviewerName }}</h1>
                        <img :src="review.reviewerImage" class="reviewer-pic">
                      </div>
                      <div class="stars">
                        <span v-for="n in review.stars" class="fa fa-star checked"></span>
                        <span v-for="n in (5 - review.stars)" class="fa fa-star"></span>
                      </div>
                      <div class="review-text">
                        <p>{{ review.text }}</p>
                      </div>
                      <div class="review-photos">
                        <img :src="review.photo" class="review-photo">
                      </div>
                    </div>
                  </div>
                </li>
              </div>
            </ul>
          </div>
        </div>

        <div class="pets" style="margin-top: 10%">
          <h1>Pets</h1>
          <!-- Bootstrap Cards for pets -->
          <div v-for="(pet, index) in petDetailsArray" :key="index" class="card" style="width: 18rem;">
            <img src="../../assets/fatcat.jpg" class="card-img-top" alt="pet-image">
            <div class="card-body">
              <h5 class="card-title">{{ pet[0] }}</h5>
              <p class="card-text">{{ pet[1] }}</p>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">{{ pet[3] }}</li>
              <li v-if="pet[4] !== ''" class="list-group-item">{{ pet[4] }}</li>
              <li v-if="pet[5] !== ''" class="list-group-item">{{ pet[5] }}</li>
              <li class="list-group-item">Very cool</li>
            </ul>
          </div>
          <!-- End of pet cards -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import db from '../../../database'
import {collection, getDocs} from 'firebase/firestore'

export default {
    name: 'profile',
    data(){
        return{
            petDetailsArray : [],
            petDetails: [],
            name: '',
            reviews: [
        {
          reviewerName: "DogLover",
          reviewerImage: "https://avatar.iran.liara.run/public/33",
          stars: 4,
          text: "I got CatWoman to dogsit my puppy for 2 weeks. My pup was very well taken care of. 10/10 service provided.",
          photo: "https://images.unsplash.com/photo-1730991336267-0c3672605f42?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
          reviewerName: "CryingEveryday",
          reviewerImage: "https://avatar.iran.liara.run/public/12",
          stars: 1,
          text: "CatWoman ate my dog",
          photo: "https://images.unsplash.com/photo-1727466443374-06d2bf46f721?q=80&w=2020&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
          reviewerName: "IamVerySad",
          reviewerImage: "https://avatar.iran.liara.run/public/89",
          stars: 4,
          text: "CatWoman gave my dog the best treats and now shes loves her more than me. I donated my pet to catwoman",
          photo: "https://images.unsplash.com/photo-1701445175220-1f485a27fb41?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
          reviewerName: "IloveWAD2",
          reviewerImage: "https://avatar.iran.liara.run/public/92",
          stars: 4,
          text: "Catwoman stole my cats. Now they are fatter than me",
          photo: "https://images.unsplash.com/photo-1671468158308-e0ea743c46de?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }

        ],
    
    }
      
    },
    methods: {
        async fetchPetDetails() {
    try {
    const ownerName = localStorage.getItem('name');
    this.name = ownerName;
    const petsCollectionRef = collection(db, `petowners/${ownerName}/pets`);
    const querySnapshot = await getDocs(petsCollectionRef);

    if (querySnapshot.empty) {
      console.log('No pets found for this owner!');
      return;
    }

    this.petDetails = querySnapshot.docs.map(doc => doc.data());
    const petDetailsArray = []; 
    console.log('Fetched Pet Details:', this.petDetails[0]); // Check if details are being fetched
    for (const pet of this.petDetails){
      petDetailsArray.push([pet.pet_name, pet.pet_type, pet.size, pet.breed, pet.dietary_restrictions, pet.medical_conditions, pet.picture_link])
    }
    console.log(petDetailsArray)
    this.showModal = true;
    this.petDetailsArray = petDetailsArray
  } catch (error) {
    console.log('Error fetching pet details:', error);
  }
}, 
    
    },
    mounted() {
    // Fetch pet details when the component is mounted
    this.fetchPetDetails();

    // Auto scroll to bottom when reviews are loaded
    this.$nextTick(() => {
      const container = this.$refs.cardContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  }

}
</script>


<style>

.card-body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 10px;
}

.reviewer-name {
    margin-right: auto;
    text-align: left;
}

.reviewer-pic {
    height: 50px;
    width: 50px;
    border-radius: 50%;
}

.stars {
    display: flex;
}

.fa-star {
    color: gold;
}

.fa-star.checked {
    color: #ffd700;
}

h1, h2, h3, h6 {
    color: #ff9f48 !important;
    text-align: center;
}

.box {
    margin-top: 10px;
}

.profile-bar {
    display: block;
    align-items: center;
    text-align: center;
}

.review-text {
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: normal;
}

.profile_pic {
    width: 70%;
    height: auto;
}

.profile-name {
    color: #9e4632;
    padding-top: 10%;
}

.profile-tagline, svg {
    color: #9e4632;
}

.profile-location p, .profile-location svg {
    display: inline;
    color: #9e4632;
}

svg {
    height: 10%;
}

.bi-star {
    fill: yellow;
}

.more-description {
    margin-top: 5%;
}

.profile-buttons {
    margin-top: 5%;
}

.button {
    color: #9e4632;
    border: solid white 1px;
    border-radius: 5px;
    font-size: 70%;
}

/* Card layout adjustments for two-column grid */
.card-container {
    display: flex;
    flex-wrap: wrap;
    max-width: 1000px;
    flex-wrap: wrap; /* Allows wrapping of the cards */
    justify-content: center; /* Centers the cards horizontally */
    gap: 16px; /* Adjust gap between cards */
    padding: 10px;
}



.cards {
    display: flex;
    flex-wrap: wrap; /* Allow cards to wrap into rows */
    width: 60%;
}
.card-top {
    display: flex;
    text-align: left;
}

.reviewer-pic {
    display: inline;
}

.reviewer-name {
    display: inline;
    margin-left: 20px;
    margin: 0;
}

.review-photo {
    width: 30%;
    border-radius: 2px;
}

.stars {
    margin-top: 5px;
}

.checked {
    color: orange;
}

/* Scroll behavior for mobile or limited-width views */
.card-container {
    display: flex;
    flex-wrap: wrap; /* Ensure the cards can wrap if there's not enough space */
    justify-content: center; /* Center the cards */
    max-width: 1000px; /* Set a max width for the container to ensure space for 2 cards */
    margin: 0 auto; /* Center the container horizontally */
    gap: 16px; /* Space between the cards */
    padding: 10px;
}



</style>