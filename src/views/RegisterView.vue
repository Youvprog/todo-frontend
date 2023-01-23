<template>
    <div class="wrapper">
        <UserForm v-model="userEmail" form-type="Register" @submit-form="registerUser"/>
    </div>
</template>

<script setup>
import axios from 'axios';
import { storeToRefs } from 'pinia';
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router'
import UserForm from '../components/UserForm.vue';
import { useUserStore } from '../stores/user';

const router = useRouter()
const userEmail = ref('')
const store = useUserStore()

async function registerUser() {
    if(userEmail.value === '') return
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