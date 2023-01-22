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
.login-form{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 400px;
    height: 300px;
    border-radius: 25px;
    background-color: #2A2D34;
    box-shadow:  5px 5px 7px #20232A,
                -5px -5px 7px #20232A;
}
.title h1 {
    margin: 0 0 2rem 0;
}
.input-group {
    padding: 0 0 2rem 0;
}
.input {
 color: #fff;
 border: none;
 padding: 1rem;
 border-radius: 1rem;
 background: #2A2D34;
 box-shadow: 5px 5px 10px #20232A,
		-5px -5px 10px #20232A;
 transition: 0.3s;
}

.input:focus {
 color: #20232A;
 outline-color: #e8e8e8;
 background: #e8e8e8;
 box-shadow: inset 20px 20px 60px #c5c5c5,
		inset -20px -20px 60px #ffffff;
 transition: 0.3s;
}
.login-btn {
  cursor: pointer;
  color: #fff;
  padding: 0.7em 1.7em;
  font-size: 15px;
  border-radius: 0.5em;
  background: #2A2D34;
  border: 1px solid #2A2D34;
  transition: all .3s;
  box-shadow: 5px 5px 10px #20232A,
             -5px -5px 10px #20232A;
}

.login-btn:hover {
    border: 1px solid #fff;
}
.link-register {
    margin: 2rem 0 0 0;
    font-size: 13px;
}
.link {
    text-decoration: none;
    color: aqua;
}
</style>