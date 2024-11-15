<template>
    <div>

        <!-- Back Button & Cart -->
        <div class="container-fluid">
            <div class="row">
                <!-- Back Button -->
                <div class="col d-flex justify-content-start">
                    <button v-if="['item', 'cart'].includes(shopPage)" type="button" class="shop-item-backbutton"
                        @click="toggleShop('shop')">
                        Back to Shop
                    </button>
                </div>

                <!-- Cart Button -->
                <div class="col d-flex justify-content-end">
                    <button v-if="['shop', 'item'].includes(shopPage)" type="button" class="shop-item-backbutton"
                        @click="toggleShop('cart')">
                        <img src="../../assets/cart.png" class="shop-item-backbutton-img mx-2">
                        Cart ({{ cartItemCount }})
                    </button>
                </div>
            </div>
        </div>
        <!-- Back Button & Cart -->

        <div v-if="shopPage === 'shop'">

            <!-- Filter Panel Start -->
            <div class="filterpanel p-3">
                <FilterBar @updateShopCards="updateShopCards" :maxPrice="filter.maxPrice" :minPrice="0" />
            </div>
            <!-- Filter Panel End -->

            <!-- Cards -->
            <div class="shop-cards-container py-3 mx-5 d-flex justify-content-center flex-wrap">
                <div v-for="item in filteredItems" class="d-inline-block justify-content-center">
                    <ShopCard @toggleShop="toggleShop('item')" @click="setcurrItem(item)" :itemObject=item />
                </div>
            </div>
            <!-- Cards -->
        </div>

        <div v-if="shopPage === 'item'">
            <ShopItem @addToCart="addToCart" @toggleShop="toggleShop" @addQuantity="addQuantity"
                @minusQuantity="minusQuantity" @showPopup="showPopup" :itemObject="currItem" />
        </div>

        <div v-if="shopPage === 'cart'">
            <ShopCart @toggleShop="toggleShop" @checkout="checkout()" :shopcartCart="cart" />
        </div>

        <!-- POP UP -->
        <div v-if="confirmPopup" class="cfmPopup" style="display:flex;">
            <div class="popupContent">
                <p style="color:#ECDFCC">Item added to Cart</p>
                <div style="display:flex;">
                    <!-- <button type="submit" class="col-3"
                    @click="showButton = false; confirmPopup = false; addService(); getIndivEventsService();"
                    style="border-radius:8px; border: 3px solid #697565;">Yes</button> -->
                    <div class="col-9"></div>
                    <button class="col-3" @click="clearPopup()"
                        style="border-radius:8px; border: 3px solid #697565;">OK</button>
                </div>
            </div>
        </div>
        <!-- POP UP -->

    </div>

    <!-- <div v-if="shopPage === 'item'">
            <ShopItem @addToCart="addToCart" @toggleShop="toggleShop" @addQuantity="addQuantity"
                @minusQuantity="minusQuantity" :itemId="currItemId" :quantity="currQuantity" :itemObject="currItem"
                :imageSource="currImageSource" />
        </div> -->

    <div v-if="shopPage === 'checkout'">
        <ShopCheckOut @toggleShop="toggleShop" />
    </div>
</template>

<script>
import ShopCard from './ShopCard.vue'
import ShopItem from './ShopItem.vue'
import ShopCart from './ShopCart.vue'
import FilterBar from './FilterBar.vue'
import ShopCheckOut from './ShopCheckOut.vue'

import data from '../../assets/amazon_pet_supplies_dataset_sample_small.json'
// console.log(data[0])

export default {
    components: {
        ShopCard,
        ShopItem,
        ShopCart,
        FilterBar,
        ShopCheckOut,
    },
    data() {
        return {
            confirmPopup: false,
            shopPage: 'shop',
            currItem: {},
            currQuantity: 1,
            currImageSource: "../../assets/dog_sitting.jpg",
            filter: {
                minPrice: 0,
                maxPrice: 1000,
                minRating: 1,
                search: '',
            },
            cart: {},
            items: data,
            items2: {
                1: {
                    name: 'Dog Food',
                    price: 1.01,
                    rating: 1.1,
                    shipping: 'Free',
                    types: ['Small', 'Medium', 'Large'],
                    description: 'Desc 1',
                    reviews: {
                        '1': { name: 'Abe', rating: 1, reviewText: 'Taste good! Yes I ate it.' },
                        '2': { name: 'Ben', rating: 2, reviewText: 'Taste bad! I\'m a dog' }
                    },
                },
                2: {
                    name: 'Kitty Litter',
                    price: 2.02,
                    rating: 2.2,
                    shipping: '$2.00',
                    types: ['Small', 'Medium', 'Large'],
                    description: 'Desc 2',
                    reviews: {
                        '3': { name: 'Cathryn', rating: 4, reviewText: 'Taste good! Yes I ate it.' }
                    },
                },
                3: {
                    name: 'Cat Food',
                    price: 3.03,
                    rating: 3.3,
                    shipping: 'Free',
                    types: ['Small', 'Medium', 'Large'],
                    description: 'Desc 3',
                    reviews: {
                        '4': { name: 'David', rating: 5, reviewText: 'Works very good' },
                    },
                },
            },
        }
    },
    methods: {
        toggleShop(shopPage) {
            // Toggle shop from cards to item
            this.shopPage = shopPage
            this.currQuantity = 1
            // console.log('Shop.vue > toggleShop()', shopPage)
        },
        setcurrItem(item) {
            this.currItem = item
            // console.log(this.currItem)
        },
        addQuantity() {
            this.currQuantity += 1
            // console.log('Shop.vue > addQuantity()', this.currQuantity)
        },
        minusQuantity() {
            this.currQuantity -= 1
            if (this.currQuantity < 1) {
                this.currQuantity = 1
            }
            // console.log('Shop.vue > minusQuantity()', this.currQuantity)
        },
        addToCart(itemObj) {
            if (itemObj.id in this.cart) {
                this.cart[itemObj.id].quantity += itemObj.quantity
            } else {
                this.cart[itemObj.id] = {}
                this.cart[itemObj.id].quantity = itemObj.quantity
                this.cart[itemObj.id].name = itemObj.name
                this.cart[itemObj.id].type = itemObj.type
                this.cart[itemObj.id].imageSource = itemObj.imageSource
            }
            // console.log('Shop.vue > addToCart()', this.cart)
        },
        checkout() {
            // console.log('checkout')
            this.cart = {}
            this.currItemId = ''
            this.currQuantity = 1
        },
        updateShopCards(filter) {
            this.filter.minPrice = filter.minPrice
            this.filter.maxPrice = filter.maxPrice
            this.filter.minRating = filter.minRating
            this.filter.search = filter.search
            // console.log("Shop.vue > updateShopCards()", filter)
        },
        clearPopup() {
            this.confirmPopup = false
            // console.log('clearPopup')
        },
        showPopup() {
            this.confirmPopup = true
        },
    },
    computed: {
        cartItemCount() {
            return Object.keys(this.cart).length
        },
        filteredItems() {
            let filtered = []
            // console.log("Total items: ",Object.keys(this.items).length)
            for (const item of this.items) {
                // console.log("Shop.vue > computed > filteredItems", this.filter)
                if (
                    Number(item.price) >= Number(this.filter.minPrice)
                    && Number(item.price) <= Number(this.filter.maxPrice)
                    && Number(item.rating) >= Number(this.filter.minRating)
                    && (item.title.toLowerCase().includes(this.filter.search.toLowerCase()) || this.filter.search === '')
                ) {
                    filtered.push(item)
                } else {
                    // console.log(item.price)
                }
            }
            // console.log("Filtered items",Object.keys(filtered).length)
            return filtered
        },
        highestPrice() {
            let highest = 0
            for (const item of this.items) {
                if (Number(item.price) > Number(highest)) {
                    highest = item.price
                }
            }
            // console.log(highest)
            return highest
        },
        // lowestItemPrice(){
        //     let lowest = Infinity
        //     for (const [id, item] of Object.entries(this.items)) {
        //         if (Number(item.price) < Number(lowest)){
        //             lowest = item.price
        //         }
        //     }
        //     return lowest
        // }
    },
    beforeRouteLeave(to, from) {
        this.clearPopup()
        // console.log('beforeRouteLeave')
    }
}
</script>

<style scoped>
.filterpanel {
    /* width: 20%; */
    height: auto;
    /* display: inline-block; */
    color: #ecdfcc;
    border: 1px solid #545454;
    margin: 0 15px 0 15px;
}

div.shop-cards-container {
    display: inline-block;
    width: fit-content;
    margin: auto;
}

.shop-item-backbutton {
    margin: 10px 0 10px 0;
    font-size: 0.75em;
}


.shop-item-backbutton {
    margin: 10px 0 10px 0;
    font-size: 0.75em;
}

.shop-item-backbutton-img {
    width: 1.5em;
    height: 1.5em;
}

/* POPUP */
.cfmPopup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgb(0, 0, 0, 0.5);
}

.popupContent {
    background-color: #242424;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    border: 3px solid #f29040;
    margin: auto;
    width: 20%;
}

/* POPUP */
</style>