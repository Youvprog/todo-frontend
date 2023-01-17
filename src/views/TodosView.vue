<template>
    <div class="wrapper">
        <h1>Todos</h1>
        <form @submit.prevent="addTodo">
            <label>Todo name</label>
            <input type="text" required v-model="title">
            <br>
            <label>Due date</label>
            <v-date-picker v-model="due_date" :model-config="modelConfig">
                <template v-slot="{ inputValue, togglePopover }">
                    <div>
                        <button @click.prevent="togglePopover">pick</button>
                        <input :value="inputValue" readonly/>
                    </div>
                </template>
            </v-date-picker>

            <br>
            <label>description</label>
            <textarea cols="30" rows="10" v-model="description"></textarea>
            <br>
            <input type="submit">
        </form>

        <div v-for="(todo, i) in todos" :key="i">
            <h3 :class="{'finished': todo.completed }">{{ todo.title }}</h3>
        </div>
               
    </div>
</template>

<script setup>
import { useTodoStore } from '../stores/todo';
import { ref, onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import axios from 'axios'


const store = useTodoStore()
const title = ref('')
const due_date = ref('')
const description = ref('')


const modelConfig = {
        type: 'string',
        mask: 'YYYY-MM-DD', // Uses 'iso' if missing
      }

const { todos } = storeToRefs(store)



async function fetchTodo() {
    store.isLoading = true
    await axios.get(import.meta.env.VITE_API)
        .then(response=>{
            todos.value = response.data
        })
        .catch(err=>{
            console.log(err)
        })
    store.isLoading = false
}

async function addTodo() {
    store.isLoading = true
    const todo = {
        title:title.value,
        due_date: due_date.value,
        description: description.value,
        completed: false
    }
    store.addTodo(todo)
    await axios.post(import.meta.env.VITE_API, todo)
                .then(res=>{
                    console.log(res)
                    title.value = ''
                    due_date.value = ''
                    description.value = ''
                })
                .catch(err=>{
                    console.log(err)
                })
    store.isLoading = false

}

onBeforeMount(()=>{
    fetchTodo()
})

</script>

<style scoped>
.finished {
    text-decoration: line-through;
}
</style>