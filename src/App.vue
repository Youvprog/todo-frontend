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
    <RouterView />
</template>

<style scoped>
</style>
