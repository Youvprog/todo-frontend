<template>
    <div class="wrapper">
        <form @submit.prevent="addTodo">
            <label>Todo name</label>
            <input type="text" required v-model="todo.name">
            <br>
            <label>Due date</label>
            <input type="datetime" v-model="todo.date">
            <br>
            <label>description</label>
            <textarea cols="30" rows="10" v-model="todo.description"></textarea>
            <input type="submit" value="">
        </form>
    </div>
</template>

<script setup>
const props = defineProps(['props'])
</script>

<style scoped>

</style>