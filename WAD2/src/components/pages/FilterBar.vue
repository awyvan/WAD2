<template>
  <div class="container-fluid m-0">
    <div class="row">

      <div class="col-sm-1 my-auto">
        <label for="">Filter</label>
      </div>

      <div class="col-xl-3 col-lg-4 col-md-5 d-flex align-items-center">
        <div class="d-inline-block d-flex align-items-center">
          <label style="margin-right: 10px;">Search: </label>
          <input class="shop-filterbar-search mt-1 w-75" type="text" id="shop-filter-searchbar" @input="updateFilter">
        </div>
      </div>

      <div class="col-xl-2 col-sm-4 mt-2">
        <!-- Min Price -->
        <div class="mb-1">
          <label class="filter-label" for="min-price">Min Price:</label>
          <input id="min-price" type="number" :value="minPrice" step="0.01" class="min-price" placeholder="0"
            @input="updateFilter" min="0" />
        </div>
        <!-- Min Price -->
        <!-- Max Price -->
        <div class="">
          <label class="filter-label" for="max-price">Max Price:</label>
          <input id="max-price" type="number" :value="maxPrice" step="0.1" class="max-price" placeholder="0"
            @input="updateFilter" min="0" />
        </div>
        <!-- Max Price -->
      </div>

      <div class="col-lg-2 col-md-3 col-3 mt-2 d-flex align-items-center">
        <!-- Rating -->
        <!-- <div class="d-inline-block d-flex align-items-center">
          <label class="filter-label" for="shop-filter-rating-input" style="margin-right:10px;">Rating:</label>
          <label for="">1</label><span class="fa fa-star checked"></span>
          <input id="shop-filter-rating-input" type="range" class="" value=1 @input="updateFilter" min="1" max="5" />
          <label for="">5</label><span class="fa fa-star checked"></span>
        </div> -->

        <select id="shop-filter-rating-input" class="form-select" @input="updateFilter" style="width: fit-content; background-color: #ecdfcc;border:black solid 1px">
          <option value="1">1 star & Up</option>
          <option value="2">2 star & Up</option>
          <option value="3">3 star & Up</option>
          <option value="4">4 star & Up</option>
          <option value="5">5 star only</option>     
        </select>
        <!-- Rating -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    maxPrice: Number,
    minPrice: Number
  },
  data() {
    return {
      // minPrice: 0,
      // maxPrice: 1000,
      // currentPriceRange: 500,
    }
  },
  methods: {
    updateFilter() {
      this.$emit("updateShopCards", {
        minPrice: Number(document.getElementById('min-price').value),
        maxPrice: Number(document.getElementById('max-price').value),
        minRating: Number(document.getElementById('shop-filter-rating-input').value),
        search: document.getElementById('shop-filter-searchbar').value,
      });
      console.log("FilterBar.vue > updatePriceFilter()", document.getElementById('shop-filter-searchbar').value)
    }
  }
}

window.onmousedown = function (e) {
  var el = e.target;
  if (el.tagName.toLowerCase() == 'option' && el.parentNode.hasAttribute('multiple')) {
    e.preventDefault();

    // toggle selection
    if (el.hasAttribute('selected')) el.removeAttribute('selected');
    else el.setAttribute('selected', '');

    // hack to correct buggy behavior
    var select = el.parentNode.cloneNode(true);
    el.parentNode.parentNode.replaceChild(select, el.parentNode);
  }
}
</script>

<style scoped>
/* Container for the filter bar */
.price-filter {
  padding: 10px;
}

.filter-title {
  margin: 0 10px 10px 10px;
  text-align: center;
}

/* Style for the labels */
.filter-label {}

/* Style for the min and max input boxes */
.min-price,
.max-price {
  width: 60px;
  margin: 0 0 0 10px;
  /* display: block;
  
  padding: 5px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  text-align: center; */
}

#shop-filter-rating-input {
  width: 4em;
  background-color: #ecdfcc;
}

.stars {
  font-size: 1em;
  margin-bottom: 1em;
}

.shop-filterbar-search,
.min-price,
.max-price {
  background-color: #ecdfcc;
  border: black solid 1px;
  color: black;
}
</style>
