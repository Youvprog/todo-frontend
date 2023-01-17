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
                <!------------
                <v-divider></v-divider>
                ------>
                <footer class="footer">
                    <slot name="modal-footer">
                        <button @click="$emit('closeModal')">Close</button>
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
        border-radius: 2px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    }
    .header {
        background-color: #703EFE;
        margin: 0;
        padding: 1rem;
        color: #fff;
    }
    .body {
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
    }
</style>