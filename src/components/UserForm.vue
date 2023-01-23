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
    background-color: var(--bg-dark-color);
    box-shadow:  5px 5px 7px var(--dark-shadow-color),
                -5px -5px 7px var(--dark-shadow-color);
}
.title h1 {
    margin: 0 0 2rem 0;
}
.input-group {
    padding: 0 0 2rem 0;
}
.input {
 color: var(--white-color);
 border: none;
 padding: 1rem;
 border-radius: 1rem;
 background: var(--bg-dark-color);
 box-shadow: 5px 5px 10px var(--dark-shadow-color),
		-5px -5px 10px var(--dark-shadow-color);
 transition: 0.3s;
}

.input:focus {
 color: var(--dark-shadow-color);
 outline-color: #e8e8e8;
 background: #e8e8e8;
 box-shadow: inset 20px 20px 60px #c5c5c5,
		inset -20px -20px 60px var(--white-color);
 transition: 0.3s;
}
.login-btn {
  cursor: pointer;
  color: var(--white-color);
  padding: 0.7em 1.7em;
  font-size: 15px;
  border-radius: 0.5em;
  background: var(--bg-dark-color);
  border: 1px solid var(--bg-dark-color);
  transition: all .3s;
  box-shadow: 5px 5px 10px var(--dark-shadow-color),
             -5px -5px 10px var(--dark-shadow-color);
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