<script>
export default {
  methods: {

  },
  props: {
    itemObject:Object,
    // itemName: String,
    // itemPrice: Number,
    // itemRating: Number,
    // itemImageSource:String,
  }
}
</script>

<template>
  <a href="#" class="text-decoration-none" @click="this.$emit('toggleShop')">
    <div class="card">
      <img :src="itemObject.images" class="card-img" alt="...">
      <div class="card-body">
        <h5 v-if="itemObject.title.length < 40" class="card-title">{{ itemObject.title }}</h5>
        <h5 v-else class="card-title">{{ itemObject.title.slice(0,40)+"..." }}</h5>
        <p class="card-text">$ {{ itemObject.price }}</p>
        <div class="stars">
          <!-- Do math and display no. of stars. No rating above 5 stars -->
          <span class="fa fa-star" v-for="n in Math.min(5, Math.floor(itemObject.rating))"></span>
          <span class="fa fa-star unchecked" v-for="n in 5-Math.min(5, Math.floor(itemObject.rating))"></span>
        </div>
      </div>
    </div>
  </a>
</template>

<style scoped>
a {
  width: 250px;
  display:inline-block;
  margin: 10px 5px 10px 5px;
}

.card-body {
  padding: 12px 0px 0px 0px;
}

.card-img {
  height: 11em;
  object-fit: cover;
}

/* .card-title,.card-text,.stars {
  font-size: 1em;
} */

.fa-star.unchecked {
    color: #d6d6d6;
  }
</style>