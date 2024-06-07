
import './assets/css/satoshi.css'
import './assets/css/style.css'
import 'jsvectormap/dist/css/jsvectormap.min.css'
import 'flatpickr/dist/flatpickr.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import axios from 'axios';
// import OneSignalVue from '@onesignal/onesignal-vue3';
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

import router from '../src/router/index.js'

const pinia = createPinia()

const app = createApp(App);

app.use(pinia).use(router).mount('#app')










