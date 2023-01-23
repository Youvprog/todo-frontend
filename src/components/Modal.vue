<template>
    <div class="modal-mask" v-if="open">
        <div class="modal-container">
            <div class="modal">
                <header class="header">
                    <slot name="modal-header">
                        <h2>Modal's Title</h2>
                    </slot>
                </header>
                <section class="body">
                    <slot name="modal-body">
                        modal body
                    </slot> 
                </section>
                <footer class="footer">
                    <slot name="modal-footer">
                        <button class="close-button" @click="$emit('closeModal')">Close</button>
                    </slot>
                </footer>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['open', 'width'])
</script>

<style scoped>
.modal-mask {
      position: fixed;
      z-index: 9999;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: table;
      transition: opacity 0.3s ease;
    }
    .modal-container {
        display: table-cell;
        vertical-align: middle;
    }
    .modal {
        width: v-bind(width);
        margin: auto;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    }
    .header {
        background-color: var(--red-color);
        margin: 0;
        padding: 1.5rem;
        color: #fff;
        border-radius: 10px 10px 0 0;
    }
    .body {
        background-color: var(--bg-dark-color);
        padding: 2rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    .footer {
        padding: 1rem;
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        background-color: var(--bg-dark-color);
        border-top: 2px solid var(--border-footer-color);
        border-radius: 0 0 10px 10px;
    }
    .close-button {
        color: var(--white-color);
        padding: 0.7em 1.7em;
        border-radius: 10px;
        background: var(--red-color);
        transition: all .3s;
        cursor: pointer;
    }
    .close-button:active{
        box-shadow: 4px 4px 12px var(--dark-shadow-color),
                    -4px -4px 12px var(--dark-shadow-color);
    }
   
</style>