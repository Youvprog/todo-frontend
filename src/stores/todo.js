import { defineStore } from 'pinia'


export const useTodoStore = defineStore('todo', {
    state: ()=>({
        isLoading: false,
        todos: [],
    }),
    getters: {
        todosCount: (state) => state.todos.length,
    },
    actions: {
        addTodo(todo){
            this.todos.push(todo)
        },
        toggleCompleted(id) {
            const todo = this.todos.find(item => item.id === id)
            if(todo) {
                todo.completed = !todo.completed
            }
        },
        deleteTodo(id) {
            this.todos = this.todos.filter(item => item.id !== id)
        }
    }
})