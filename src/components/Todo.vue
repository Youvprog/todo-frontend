<template>
    <li class="todo">
        <span class="todo-title" :class="{'finished': todo.completed }" @click="$emit('updateTodo', todo.id)">{{ todo.title }}</span>
        <div class="btn-group">
            <button @click="$emit('editAllInfo', todo.id)" class="details">
                <svg style="width:26px;height:26px" viewBox="0 0 24 24">
                    <path fill="#fff" d="M6 20H11V22H6C4.89 22 4 21.11 4 20V4C4 2.9 4.89 2 6 2H18C19.11 2 20 2.9 20 4V10.3C19.78 10.42 19.57 10.56 19.39 10.74L18 12.13V4H13V12L10.5 9.75L8 12V4H6V20M22.85 13.47L21.53 12.15C21.33 11.95 21 11.95 20.81 12.15L19.83 13.13L21.87 15.17L22.85 14.19C23.05 14 23.05 13.67 22.85 13.47M13 19.96V22H15.04L21.17 15.88L19.13 13.83L13 19.96Z" />
                </svg>
            </button>
            <button @click="$emit('deleteTodo', todo.id)" class="delete">
                <svg style="width:26px;height:26px" viewBox="0 0 24 24">
                    <path fill="#fff" d="M14.12,10.47L12,12.59L9.87,10.47L8.46,11.88L10.59,14L8.47,16.12L9.88,17.53L12,15.41L14.12,17.53L15.53,16.12L13.41,14L15.53,11.88L14.12,10.47M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9Z" />
                </svg>
            </button>
        </div>
    </li>
</template>

<script setup>

const props = defineProps(['todo'])

</script>

<style scoped>
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
.finished {
    text-decoration: line-through;
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