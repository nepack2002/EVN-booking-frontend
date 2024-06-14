import './assets/css/satoshi.css'
import './assets/css/style.css'
import 'jsvectormap/dist/css/jsvectormap.min.css'
import 'flatpickr/dist/flatpickr.min.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'
import axios from 'axios';
import piniaPersist from 'pinia-plugin-persist'
import router from '../src/router/index.js'
import {useUserStore} from "@/stores/auth.js";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
// axios.interceptors.request.use(config => {
//     const at = useUserStore(); // Get token from store
//     if (at && at.token) {
//         config.headers['Authorization'] = `Bearer ${at.token}`;
//     }
//     return config;
// }, error => {
//     return Promise.reject(error);
// });

axios.interceptors.response.use(response => {
    return response;
}, async error => {
    const originalRequest = error.config;
    const at = useUserStore(); // Get token from store

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
        if (originalRequest.url === '/refresh-token') {
            // If the request to refresh token fails, clear token and redirect
            at.setToken('');
            at.setRefreshToken('');
            window.location.href = '/login';
            return Promise.reject(error);
        }

        originalRequest._retry = true;
        try {
            // Call your refresh token endpoint
            const refreshToken = at.refreshToken; // Get refresh token from store
            const response = await axios.post('/refresh-token', {}, {
                headers: {
                    'Authorization': `Bearer ${refreshToken}`
                }
            });

            const newAccessToken = response.data.access_token;
            const newRefreshToken = response.data.refresh_token;
            // Update the token in your store or localStorage
            at.setToken(newAccessToken)
            at.setRefreshToken(newRefreshToken)

            // Retry the original request with the new token
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
        } catch (refreshError) {
            at.setToken('');
            at.setRefreshToken('');
            window.location.href = '/login';
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
});

const pinia = createPinia()
pinia
    .use(piniaPersist)

const app = createApp(App);

app.use(pinia).use(router).mount('#app')










