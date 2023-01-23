<template>
    <div class="wrapper">
        <div class="form">
            <form class="todo-form" @submit.prevent="addTodo">
                <h3>File to add your todo</h3>
                <input placeholder="todo title" type="text" class="input" v-model="title" required>
                <v-date-picker v-model="due_date" :model-config="modelConfig">
                    <template v-slot="{ inputValue, togglePopover }">
                        <div>
                            <input placeholder="click to chose a date" class="input" :value="inputValue" readonly @click.prevent="togglePopover"/>
                        </div>
                    </template>
                </v-date-picker>
                <textarea class="input" cols="50" rows="10" v-model="description" placeholder="description (optional)" ></textarea>
                <input type="submit" class="button" value="Add">
            </form>
        </div>

        <div v-if="store.todosCount" class="todos-container">
            <div class="title-todos-container">
                <h2>Your Todos</h2>
            </div>
            <draggable
                v-model="todos"
                group="todos"
                item-key="id"
                class="todos-list"
                tag="ul"
                drag-class="drag"
                ghost-class="ghost"
                @change="onChange"
            >
                <template #item="{element}">
                    <Todo
                        :todo="element"
                        @update-todo="updateTodo" 
                        @delete-todo="deleteTodo" 
                        @edit-all-info="openModalWithData"
                    />
                </template>
            </draggable>
        </div>
        <div v-else>
            No Todos left
        </div>

        <Modal :open="openModal" @close-modal="openModal = !openModal" width="30%">
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
                    <textarea  cols="30" rows="10" class="input" v-model="updatedDescription"></textarea>
                    <div>
                        <input class="button" type="submit" value="Save">
                    </div>
                </form>
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
import Todo from '../components/Todo.vue';
import draggable from 'vuedraggable'

const router = useRouter()
const store = useTodoStore()
const userStore = useUserStore()

const todoID = ref(null)
const title = ref('')
const due_date = ref('')
const description = ref('')
const modelConfig = {
    type: 'string',
    mask: 'YYYY-MM-DD',
}
const { todos } = storeToRefs(store)

const updatedTitle = ref('')
const updatedDue_date = ref('')
const updatedDescription = ref('')


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
            if(err.response.status === 404) {
                    axios.defaults.headers.common['Authorization'] = ''
                    userStore.removeToken()
                    router.push('/')
            }
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
                    store.addTodo(res.data.todo)
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

function openModalWithData(id) {
    openModal.value = !openModal.value

    const todo = todos.value.find(item => item.id === id)
    todoID.value = todo.id
    
    updatedTitle.value = todo.title
    updatedDue_date.value = todo.due_date
    updatedDescription.value = todo.description
    
}


async function updateTodo(id) {
    store.isLoading = true
    const index = todos.value.findIndex(function(item) {
        if(typeof id === 'string') {
            if(item.id === id) return true
        } else {
            if(item.id === todoID.value) return true
        }
    })
    let updatedTodo = {}
    if(!openModal.value) {
        todos.value.forEach(element => {
            if(element.id === id) {
                element.completed = element.completed === 0 ? 1 : 0
                updatedTodo.completed = element.completed
            }
        });
    } else {
        updatedTodo = {
            ...(updatedTitle.value !== '' && {title: updatedTitle.value}),
            ...(updatedDue_date.value !== '' && {due_date: updatedDue_date.value}),
            ...(updatedDescription.value !== '' && {description: updatedDescription.value}),
        }
    }
    await axios.patch(`http://localhost:3000/todos/${todoID.value || id}`,updatedTodo, {
        
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
                .then(res =>{
                    if(!openModal.value) {
                        store.updateTodo(index, todos.value[index].title,
                                        todos.value[index].due_date,
                                        todos.value[index].description,
                                        todos.value[index].completed)
                    } else {
                        store.updateTodo(index, updatedTitle.value, 
                                        updatedDue_date.value,
                                        updatedDescription.value,
                                        todos.value[index].completed)
                    }
                })
                .catch(err =>{
                    if(err.response.status === 401){
                        axios.defaults.headers.common['Authorization'] = ''
                        userStore.removeToken()
                        router.push('/')
                    } else {
                        console.log(err)
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

async function onChange(e) {
    let item = e.moved
    if(!item) return
    
    let index = item.newIndex
    let prevTodo = todos.value[index - 1]
    let currentTodo = todos.value[index]
    let nextTodo = todos.value[index + 1]

    let position = currentTodo.position

    if(prevTodo && nextTodo) {
        position = (prevTodo.position + nextTodo.position) / 2
        
    } else if(nextTodo) {
        position = nextTodo.position + (nextTodo.position / 2)
        
    } else if(prevTodo) {
        position = prevTodo.position / 2
        
    }

    await axios.patch(`http://localhost:3000/todos/${currentTodo.id}`, { position },{
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
    })          .then(res => {
                    console.log(res)
                    store.todos[index].position = position
                })
                .catch(err => {
                    if(err.response.status === 401){
                        axios.defaults.headers.common['Authorization'] = ''
                        userStore.removeToken()
                        router.push('/')
                    } else {
                        console.log(err)
                    }
                })

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
.input {
 margin: 0 0 1rem 0;
 border: none;
 border-radius: 15px;
 padding: 15px;
 background-color: var(--bg-dark-color);
 box-shadow: 6px 6px 12px var(--dark-shadow-color),
             -6px -6px 12px var(--dark-shadow-color);
 font-size: medium;
 font-weight: bold;
 max-width: 200px;
 color: var(--white-color);
}

.input:focus {
 outline-color: var(--white-color);
 place-content: "Enter your message!";
}


.todo-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 0 2rem 0;
}

.button {
  padding: 1.3em 3em;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 500;
  color: var(--black-color);
  background-color: var(--white-color);
  border: none;
  border-radius: 45px;
  box-shadow: 0px 8px 15px var(--btn-add-shadow-color);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
}

.button:hover {
  background-color: var(--btn-add-bg-hover-color);
  box-shadow: 0px 15px 20px var(--btn-add-shadow-hover);
  color: var(--white-color);
  transform: translateY(-7px);
}

.button:active {
  transform: translateY(-1px);
}
.todos-container{
    width: 350px;
    margin: 2rem 0 2rem 0;
    border-radius: 10px;
    background: var(--bg-dark-color);
    box-shadow:  5px 5px 10px var(--todos-container-sd),
                -5px -5px 10px var(--todos-container-sd2);
    z-index: 999;
}

.title-todos-container {
    display: flex;
    justify-content: center;
    background-color: var(--red-color);
    border-radius: 10px 10px 0 0;
}
.title-todos-container h2 {
    margin: 0;
    padding: 1rem;
}
.todos-list {
    margin: 2rem 0 2rem 0;
}

</style>