import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js' // Import the router
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

createApp(App)
.use(router)
.use(Toast, {
    transition: "Vue-Toastification__bounce",
    maxToasts: 20,
    newestOnTop: true
  })
.mount('#app')


