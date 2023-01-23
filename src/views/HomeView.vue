<script setup>
import axios from 'axios';
import { useUserStore } from '../stores/user';
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import UserForm from '../components/UserForm.vue';


const router = useRouter()
const store = useUserStore()
const loggedEmail = ref('')


async function loginUser() {
    if(loggedEmail.value === '' ) return
    store.isLoading = true
    axios.defaults.headers.common['Authorization'] = ''
    store.removeToken()
    localStorage.removeItem('token')
    const user = {
        email: loggedEmail.value
    }
    await axios.post('http://localhost:3000/login', user)
                .then(res => {
                    store.setToken(res.data.token)
                    axios.defaults.headers.common['Authorization'] = 'jwt' + res.data.token
                    localStorage.setItem('token', res.data.token)
                    loggedEmail.value = ''
                    router.push('/todos')
                })
                .catch(err => {
                    console.log(err)
                })
    store.isLoading = false
}

onBeforeMount(() => {
    if(store.isAuthenticated) router.push('/todos')
})

</script>

<template>
    <div class="wrapper">
        <UserForm v-model="loggedEmail" form-type="Login" @submit-form="loginUser"/>
    </div>
</template>


<style scoped>
.wrapper {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>