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
            <span :class="{'finished': todo.completed }">{{ todo.title }}</span>
            <input type="checkbox" v-model="todo.completed">
            <button @click="openModalWithData(i)">Details</button>
            <button @click="deleteTodo(i)">DELETE</button>
        </div>

        <Modal :open="openModal" @close-modal="openModal = !openModal" width="50%">
            <template v-slot:modal-header>
                <h2>Edit todo </h2>
            </template>
            <template v-slot:modal-body>
                <form @submit.prevent="updateTodo">
                    <input type="text" v-model="updatedTitle">
                    <v-date-picker v-model="updatedDue_date" :model-config="modelConfig">
                        <template v-slot="{ inputValue, togglePopover }">
                            <div>
                                <button @click.prevent="togglePopover">pick</button>
                                <input :value="inputValue" readonly/>
                            </div>
                        </template>
                    </v-date-picker>
                    <textarea cols="30" rows="10" v-model="updatedDescription"></textarea>
                    <input type="checkbox" v-model="updatedCompletion">
                    <div>
                        <input type="submit">
                    </div>
                </form>
            </template>
            <template v-slot:modal-footer>
                <button @click="openModal = !openModal">Close</button>
            </template>

        </Modal>


    </div>
</template>

<script setup>
import { useTodoStore } from '../stores/todo';
import { ref, onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import axios from 'axios'
import Modal from '../components/Modal.vue'


const store = useTodoStore()


const title = ref('')
const due_date = ref('')
const description = ref('')
const todoId = ref(null)
const modelConfig = {
    type: 'string',
    mask: 'YYYY-MM-DD',
}
const { todos } = storeToRefs(store)

const updatedTitle = ref('')
const updatedDue_date = ref('')
const updatedDescription = ref('')
const updatedCompletion = ref(false)


let openModal = ref(false)


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
    await axios.post(import.meta.env.VITE_API, todo)
                .then(res=>{
                    console.log(res)
                    title.value = ''
                    due_date.value = ''
                    description.value = ''
                    store.addTodo(todo)
                })
                .catch(err=>{
                    console.log(err)
                })
    store.isLoading = false

}

function openModalWithData(index) {
    openModal.value = !openModal.value
    todoId.value = todos.value[index].id

    updatedTitle.value =  todos.value[index].title
    updatedDue_date.value = todos.value[index].due_date
    updatedDescription.value = todos.value[index].description
    updatedCompletion.value = todos.value[index].completed
}

async function updateTodo() {
    store.isLoading = true
    const index = todos.value.findIndex(item => item.id === todoId.value)
    store.updateTodo(index, updatedTitle.value, updatedDue_date.value, updatedDescription.value, updatedCompletion.value )
    const updatedTodo = {
        title: updatedTitle.value,
        due_date: updatedDue_date.value,
        description: updatedDescription.value,
        completed: updatedCompletion.value
    }
    await axios.put(`http://127.0.0.1:8000/api/v1/todos/${todoId.value}`, updatedTodo)
                .then(res =>{
                    console.log(res)
                })
                .catch(err =>{
                    console.log(err)
                })
    store.isLoading = false
    openModal.value = !openModal.value
}

async function deleteTodo(index) {
    todoId.value = todos.value[index].id
    store.isLoading = true
    store.deleteTodo(todoId.value)
    await axios.delete(`http://127.0.0.1:8000/api/v1/todos/${todoId.value}`)
                .then(res=>{
                    console.log(res)
                })
                .catch(err=>{
                    console.log(err)
                })
    store.isLoading = true
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