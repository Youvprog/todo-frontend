<template>
    <div class="login-form">
        <div class="title">
            <h1>{{ props.formType }}</h1>
        </div>
        <form class="form" @submit.prevent="$emit('submitForm')">
            <div class="input-group">
                <input type="text" class="input" placeholder="Email Address" v-model="loggedEmail" @input="$emit('update:modelValue', $event.target.value)">
            </div>
            <div class="btn">
                <input class="login-btn" type="submit" value="Login">
            </div>
        </form>
        <p class="link-register" v-if="props.formType === 'Login'">
            You dont have an account? <RouterLink to='/register' class="link">click here</RouterLink> to register
        </p>
        <p class="link-register" v-else>
            You have an account? <RouterLink to='/' class="link">click here</RouterLink> to login
        </p>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    modelValue: String,
    formType: String
})

const emit = defineEmits(['update:modelValue', 'submitForm'])

const loggedEmail = ref('')


</script>

<style scoped>
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