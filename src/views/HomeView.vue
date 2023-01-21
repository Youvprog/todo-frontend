<script setup>
import axios from 'axios';
import { useUserStore } from '../stores/user';
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';



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
        <div class="login-form">
            <div class="title">
                <h1>Login</h1>
            </div>
            <form class="form" @submit.prevent="loginUser">
                <div class="input-group">
                    <input type="text" class="input" placeholder="Email Address" v-model="loggedEmail">
                </div>
                <div class="btn">
                    <input class="login-btn" type="submit" value="Login">
                </div>
            </form>
        </div>
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
    background: linear-gradient(145deg, #dddddd, #ffffff);
    box-shadow:  10px 10px 61px #c9c9c9,
                -10px -10px 61px #ffffff;
}
.title h1 {
    margin: 0 0 2rem 0;
}
.input-group {
    padding: 0 0 2rem 0;
}
.input {
 border: none;
 padding: 1rem;
 border-radius: 1rem;
 background: #e8e8e8;
 box-shadow: 5px 5px 10px #c5c5c5,
		-5px -5px 10px #ffffff;
 transition: 0.3s;
}

.input:focus {
 outline-color: #e8e8e8;
 background: #e8e8e8;
 box-shadow: inset 20px 20px 60px #c5c5c5,
		inset -20px -20px 60px #ffffff;
 transition: 0.3s;
}
.login-btn {
  cursor: pointer;
  color: #090909;
  padding: 0.7em 1.7em;
  font-size: 15px;
  border-radius: 0.5em;
  background: #e8e8e8;
  border: 1px solid #e8e8e8;
  transition: all .3s;
  box-shadow: 5px 5px 10px #c5c5c5,
             -5px -5px 10px #ffffff;
}

.login-btn:hover {
  border: 1px solid white;
}

.login-btn:active {
  box-shadow: 4px 4px 12px #c5c5c5,
             -4px -4px 12px #fff;
}
</style>