<template>


    <div class='container-fluid'>

        <div class='row'>

            <!-- Image Column -->
            <div class='col-3 d-flex justify-content-center'>
                <img :src="itemObject.images" class="item-img shop-item-img-margin
" alt="Item Image">
            </div>
            <!-- Image Column -->

            <!-- Item Info Column -->
            <div class='col-6'>

                <!-- Item Info Container -->
                <div class='container-fluid'>
                    <div class='row'>
                        <div class='col'>
                            <h5><label>{{ itemObject.title }}</label></h5>
                        </div>
                    </div>
                    <div class='row pb-4'>
                        <div class='col'>
                            <h5 class="mt-3"><label>${{ itemObject.price }}</label></h5>
                        </div>
                    </div>
                    <div class='row pb-2'>
                        <div class='col-3'>
                            <label>Shipping</label>
                        </div>
                        <div class='col'>
                            <label>
                                <p>Free</p>
                            </label>
                        </div>
                    </div>
                    <div class='row pb-2'>
                        <!-- TYPE INPUT -->
                        <div class='col-3'>
                            <label>Type</label>
                        </div>
                        <div class='col-9' v-if="itemObject.types !== undefined">
                            <select id="type-input" class="form-select shop-item-type-select">
                                <option value="" selected hidden>Select Type</option>
                                <option v-for="type in itemObject.types">{{ type }}</option>
                            </select>
                        </div>
                        <div class="col-9" v-else>
                            <p>Normal</p>
                            <input type="text" id="type-input" value="Normal" hidden>
                        </div>
                        <!-- TYPE INPUT -->
                    </div>
                    <div class='row pb-2'>
                        <!-- QUANTITY INPUT -->
                        <div class='col-3 d-flex align-items-center'>
                            <label>Quantity</label>
                        </div>
                        <div class='col-sm'>
                            <button type="button" class="shop-item-quantity-button d-sm-inline d-none"
                                @click="changeQuantityInput(-1)">-</button>
                            <input id="shop-item-quantity-input" type="number" min="1"
                                class="form-control w-25 d-inline shop-item-quantity-input" value=1>
                            <button type="button" class="shop-item-quantity-button d-sm-inline d-none"
                                @click="changeQuantityInput(1)">+</button>
                        </div>
                    </div>
                    <div class='row'>
                        <!-- ADD TO CART -->
                        <div class='col'>
                            <button type="button" class="shop-item-cart-button" @click="addToCart(),showPopup()">Add to Cart</button>
                        </div>
                    </div>
                    <div class='row pt-5'>
                        <div class='col'>
                            <h4><label>Item Description</label></h4>
                            <p>{{ itemObject.description }}</p>
                        </div>
                    </div>
                    <div class='row pt-5'>
                        <div class='col'>
                            <h4><label>Product Ratings</label></h4>
                        </div>
                    </div>
                    <div class='row' v-if="itemObject.reviews !== undefined">
                        <div class='col'>
                            <Review v-for="review in itemObject.reviews" :name="review.name" :rating="review.rating"
                                :reviewText="review.reviewText"></Review>
                        </div>
                    </div>
                    <div v-else>
                        <p>No ratings yet</p>
                    </div>
                </div>
                <!-- Item Info Container -->

            </div>
            <!-- Item Info Column -->

        </div>
        END OF TEMPLATE
    </div>
</template>

<script scoped>
import Review from './Review.vue'

export default {
    name: 'ShopItem',
    components: {
        Review,
    },
    props: {
        itemObject: Object,
        // cartItemCount: Number,
        // type: String,
    },
    data() {
        return {
        }
    },
    methods: {
        getImageUrl(imageSource) {
            // This path must be correct for your file
            return new URL(`${imageSource}`, import.meta.url)
        },
        addToCart() {
            let t = document.getElementById('type-input').value
            // console.log(t)   
            if (t !== '') {
                let cartItem = {
                    id: this.itemObject.uniq_id + "-" + t,
                    name: this.itemObject.title,
                    type: t,
                    quantity: Number(document.getElementById('shop-item-quantity-input').value),
                    imageSource: this.getImageUrl(this.itemObject.images),
                }
                // console.log("ShopItem > addTOCart() > cartItem", cartItem)
                this.$emit('addToCart', cartItem)
            } else {
                alert("Please select a type!") // Change to display modal
            }
        },
        changeQuantityInput(amount) {
            let quantityInputEle = document.getElementById('shop-item-quantity-input')
            quantityInputEle.value = Number(quantityInputEle.value) + amount
            if (Number(quantityInputEle.value) < 1) {
                quantityInputEle.value = 1
            }
        },
        showPopup(){
            this.$emit('showPopup')
        }
    }
}

</script>

<style>
.shop-item-img-margin {
    width: 70%;
    height: fit-content;
    margin: 50px 0px 0px 0px;
}

.shop-item-type-select {
    background-color: #1a1a1a;
    color: #ecdfcc;
    border: #ecdfcc solid 1px;
    width: fit-content;
    max-width: 100%;
}

.shop-item-quantity-button {
    font-size: 0.82em;
    margin: 0 5px 0 5px;
    border-radius: 5px;
    border: #ecdfcc solid 1px;
}

.shop-item-quantity-input,
input[type="number"].shop-item-quantity-input:focus {
    background-color: #1a1a1a;
    color: #ecdfcc;
    border: #ecdfcc solid 1px;
    text-align: center;
}

input[type="number"].shop-item-quantity-input::-webkit-inner-spin-button,
input[type="number"].shop-item-quantity-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.shop-item-cart-button {
    margin-top: 10px;
}
</style>