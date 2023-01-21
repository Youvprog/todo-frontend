<template>
    <div class="wrapper">
        <div class="form">
            <form class="todo-form" @submit.prevent="addTodo">
                <h3>File to add your todo</h3>
                <input placeholder="Todo Title" type="text" class="input" v-model="title" required>
                <br>
                <v-date-picker v-model="due_date" :model-config="modelConfig">
                    <template v-slot="{ inputValue, togglePopover }">
                        <div>
                            <input placeholder="Click to chose a date" class="input" :value="inputValue" readonly @click.prevent="togglePopover"/>
                        </div>
                    </template>
                </v-date-picker>
    
                <br>
                <textarea class="input" cols="50" rows="10" v-model="description" ></textarea>
                <br>
                <br>
                <input type="submit" class="button" value="Add">
                <br> <br>
            </form>
        </div>

        <div class="todos-container">
            <div class="title-todos-container">
                <h2>Your Todos</h2>
            </div>
            <div class="todo" v-for="(todo, i) in todos" :key="i">
                <span class="todo-title" :class="{'finished': todo.completed }" @click="updateTodo(todo.id)">{{ todo.title }}</span>
                <div class="btn-group">
                    <button @click="openModalWithData(i)" class="details">
                        <svg style="width:26px;height:26px" viewBox="0 0 24 24">
                            <path fill="#fff" d="M6 20H11V22H6C4.89 22 4 21.11 4 20V4C4 2.9 4.89 2 6 2H18C19.11 2 20 2.9 20 4V10.3C19.78 10.42 19.57 10.56 19.39 10.74L18 12.13V4H13V12L10.5 9.75L8 12V4H6V20M22.85 13.47L21.53 12.15C21.33 11.95 21 11.95 20.81 12.15L19.83 13.13L21.87 15.17L22.85 14.19C23.05 14 23.05 13.67 22.85 13.47M13 19.96V22H15.04L21.17 15.88L19.13 13.83L13 19.96Z" />
                        </svg>
                    </button>
                    <button @click="deleteTodo(todo.id)" class="delete">
                        <svg style="width:26px;height:26px" viewBox="0 0 24 24">
                            <path fill="#fff" d="M14.12,10.47L12,12.59L9.87,10.47L8.46,11.88L10.59,14L8.47,16.12L9.88,17.53L12,15.41L14.12,17.53L15.53,16.12L13.41,14L15.53,11.88L14.12,10.47M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <Modal :open="openModal" @close-modal="openModal = !openModal" width="50%">
            <template v-slot:modal-header>
                <h2>Edit todo </h2>
            </template>
            <template v-slot:modal-body>
                <form @submit.prevent="updateTodo">
                    <input type="text" class="input" v-model="updatedTitle">
                    <v-date-picker v-model="updatedDue_date" :model-config="modelConfig">
                        <template v-slot="{ inputValue, togglePopover }">
                            <div>
                                <input :value="inputValue" class="input" @click.prevent="togglePopover" readonly/>
                            </div>
                        </template>
                    </v-date-picker>
                    <textarea cols="30" rows="10" class="input" v-model="updatedDescription"></textarea>
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
import { ref, onBeforeMount, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import axios from 'axios'
import Modal from '../components/Modal.vue'
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';

const router = useRouter()
const store = useTodoStore()
const userStore = useUserStore()

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
const updatedCompletion = ref(null)


let openModal = ref(false)


async function fetchTodo() {
    store.isLoading = true
    await axios.get('http://localhost:3000/todos', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
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
        id: crypto.randomUUID(),
        title: title.value,
        due_date: due_date.value,
        description: description.value,
    }
    await axios.post('http://localhost:3000/todos', todo, {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
                .then(res=>{
                    title.value = ''
                    due_date.value = ''
                    description.value = ''
                    store.addTodo(todo)
                })
                .catch(err=>{
                    if(err.response.status === 401){
                        axios.defaults.headers.common['Authorization'] = ''
                        userStore.removeToken()
                        router.push('/')
                    }
                })
    store.isLoading = false

}

function openModalWithData(index) {
    openModal.value = !openModal.value
    todoId.value = todos.value[index].id

    updatedTitle.value =  todos.value[index].title
    updatedDue_date.value = todos.value[index].due_date
    updatedDescription.value = todos.value[index].description
    updatedCompletion.value = todos.value[index].completed === 1 ? true: false
}


async function updateTodo(id) {
    store.isLoading = true
    const index = todos.value.findIndex(item => item.id === todoId.value || id)
    const updatedTodo = {
        ...(updatedTitle.value !== '' && {title: updatedTitle.value}),
        ...(updatedDue_date.value !== '' && {due_date: updatedDue_date.value}),
        ...(updatedDescription.value !== '' && {description: updatedDescription.value}),
    }
    if(!openModal.value) {
        todos.value[index].completed = !todos.value[index].completed
        updatedTodo.completed = todos.value[index].completed
    }

    await axios.patch(`http://localhost:3000/todos/${todoId.value || id}`, updatedTodo, {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
                .then(res =>{
                    console.log(res)
                    store.updateTodo(index, updatedTitle.value || todos.value[index].title,
                                    updatedDue_date.value || todos.value[index].due_date,
                                    updatedDescription.value || todos.value[index].description, 
                                    todos.value[index].completed)
                })
                .catch(err =>{
                    console.log(err)
                    if(err.response.status === 401){
                        axios.defaults.headers.common['Authorization'] = ''
                        userStore.removeToken()
                        router.push('/')
                    }
                })
    store.isLoading = false
    openModal.value = false
}


async function deleteTodo(id) {
    store.isLoading = true
    await axios.delete(`http://localhost:3000/todos/${id}`, {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
                .then(res=>{
                    console.log(res)
                    store.deleteTodo(id)
                })
                .catch(err=>{
                    console.log(err)
                    if(err.response.status === 401){
                        axios.defaults.headers.common['Authorization'] = ''
                        userStore.removeToken()
                        router.push('/')
                    }
                })
    store.isLoading = true
}

onBeforeMount(()=>{
    watchEffect(() => {
        fetchTodo()
    })
})

</script>

<style scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.finished {
    text-decoration: line-through;
}
.input {
 border: none;
 border-radius: 15px;
 padding: 15px;
 background-color: #2A2D34;
 box-shadow: 6px 6px 12px #20232A,
             -6px -6px 12px #20232A;
 font-size: medium;
 font-weight: bold;
 max-width: 200px;
 color: #fff
}

.input:focus {
 outline-color: white;
 place-content: "Enter your message!";
}
textarea {
    resize: none;
}

.todo-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.button {
  padding: 1.3em 3em;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 500;
  color: #000;
  background-color: #fff;
  border: none;
  border-radius: 45px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
}

.button:hover {
  background-color: #23c483;
  box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
  color: #fff;
  transform: translateY(-7px);
}

.button:active {
  transform: translateY(-1px);
}
.todos-container{
    width: 350px;
    margin: 2rem 0 2rem 0;
    border-radius: 10px;
    background: #2A2D34;
    box-shadow:  5px 5px 10px #111215,
                -5px -5px 10px #434853;
    z-index: 999;
}

.title-todos-container {
    display: flex;
    justify-content: center;
    background-color: #F90403;
    border-radius: 10px 10px 0 0;
}
.title-todos-container h2 {
    margin: 0;
    padding: 1rem;
}
.todo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    margin: 1rem 1rem 1rem 1rem;
    border-radius: 10px;
    background: linear-gradient(145deg, #2d3038, #26292f);
    box-shadow:  5px 5px 23px #111215,
                -5px -5px 23px #434853;
}
.todo-title {
    cursor: pointer;
}
.btn-group {
    display: flex;
    gap: 5px;
}
.details {
    cursor: pointer;
    border: 0;
    border-radius: 5px;
    background-color: #23c483;
}
.delete {
    cursor: pointer;
    border: 0;
    border-radius: 5px;
    background-color: #F90403;
}
</style>