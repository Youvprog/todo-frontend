import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {

    state: () =>({
        isLoading: false,
        accessToken: null,
        isAuthenticated: false
    }),
    getters: {

    },
    actions: {
        initStore() {
            if(localStorage.getItem('token')) {
                this.setToken(localStorage.getItem('token'))
            } else {
                this.removeToken()
            }
        },
        setToken(token) {
            if(token) {
                this.accessToken = token
                this.isAuthenticated = true
            }
        },
        removeToken() {
            this.accessToken = null
            this.isAuthenticated = false
        }
    }
})