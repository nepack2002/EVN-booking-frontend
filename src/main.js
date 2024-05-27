import './assets/css/satoshi.css'
import './assets/css/style.css'
import 'jsvectormap/dist/css/jsvectormap.min.css'
import 'flatpickr/dist/flatpickr.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

import router from '../src/router/index.js'
const pinia = createPinia()
createApp(App).use(pinia).use(router).mount('#app')
    
