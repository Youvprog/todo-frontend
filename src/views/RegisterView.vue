<template>
    <div class="wrapper">
        <UserForm v-model="userEmail" form-type="Register" @submit-form="registerUser" :errors="errors"/>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router'
import UserForm from '../components/UserForm.vue';
import { useUserStore } from '../stores/user';

const router = useRouter()
const userEmail = ref('')
const store = useUserStore()
const errors = ref({})


async function registerUser() {
    if(userEmail.value === '') return
    if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail.value)) {
        errors.value.data = 'Invalid Email'
        return 
    }
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
                    errors.value = err.response
                })
}

onBeforeMount(() => {
    if(store.isAuthenticated) router.push('/todos')
})

</script>

<style scoped>
.wrapper {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>