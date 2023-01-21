<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onBeforeMount } from 'vue';
import axios from 'axios';
import { useUserStore } from './stores/user';

const store = useUserStore()

onBeforeMount(() => {
store.initStore()
const token = store.accessToken
if(token) {
  axios.defaults.headers.common['Authorization'] = 'jwt' + token
} else {
  axios.defaults.headers.common['Authorization'] = ''
}
})


</script>

<template>
  <main class="main">
    <RouterView />
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inconsolata&family=Montserrat&display=swap');

body {
  margin: 0;
}

*{
    box-sizing: border-box;
}
.main {
  color: #fff;
  background-color: #2A2D34;
  font-family: 'Montserrat', sans-serif;
}
</style>
