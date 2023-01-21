<template>
    <div class="wrapper">
        <form @submit.prevent="registerUser">
            <input type="email" v-model="userEmail">
            <input type="submit">
        </form>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()
const userEmail = ref('')

async function registerUser() {
    const user = {
        email: userEmail.value
    }
    await axios.post('http://localhost:3000/register', user)
                .then(res=> {
                    console.log(res)
                    userEmail.value = ''
                    router.push('/')
                })
                .catch(err => {
                    console.log(err)
                })
}

</script>

<style scoped>

</style>