
import './assets/css/satoshi.css'
import './assets/css/style.css'
import 'jsvectormap/dist/css/jsvectormap.min.css'
import 'flatpickr/dist/flatpickr.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import axios from 'axios';
import {useUserStore} from "@/stores/auth.js";

// import OneSignalVue from '@onesignal/onesignal-vue3';
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.interceptors.request.use(config => {
    const at = useUserStore(); // Get token from store
    if (at && at.token) {
        config.headers['Authorization'] = `Bearer ${at.token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});
import router from '../src/router/index.js'

const pinia = createPinia()

const app = createApp(App);

app.use(pinia).use(router).mount('#app')










