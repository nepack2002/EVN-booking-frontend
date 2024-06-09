import { defineStore } from "pinia";
import axios from "axios";


export const useUserStore = defineStore("userStore", {
    state: () => ({
        token: '',
        user: null,
        errorMessage: {},
        error : null,
        refreshToken: ''
    }),
    persist: {
        enabled: true,
        strategies: [
            {storage: localStorage, paths: ['at']},
        ],
    },
    getters: {
        getToken: (state) => state.token,
        getUser: (state) => state.user,
        getErrorMessage: (state) => state.errorMessage,
        getError: (state) => state.error,

    },
    actions: {
        setToken(token) {
          this.token = token;
        },
        async login(username, password) {
            try {
                const response = await axios.post(
                    "/login",
                    {
                        username,
                        password,
                    }
                );
                this.token = response.data.access_token;
                this.refreshToken = response.data.refresh_token;

                await this.fetchUser();
                this.errorMessage = null;
                this.error = null;
                return true;
            } catch (error) {
                this.errorMessage = error.response.data.errors || {};
                this.error = error.response.data.messages;
            }
        },
        async fetchUser() {
            
            if (!this.token) return;
            
            try {


                const response = await axios.get('/user', {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
                this.user = response.data;
            } catch (error) {
                console.error('Failed to fetch user information:', error.message);
            }
        },
        async logout() {
            try {
                await axios.get("/logout", {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
                localStorage.removeItem("token");
                this.token = null;
                this.user = null;
            } catch (error) {
                console.error('Logout error:', error);
            }
        },
    },
});
