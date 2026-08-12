<script setup lang="ts">
import { ref } from "vue";
const searchQuery = ref("");
</script>

<template>
<main class="calls">
    <div class="container">
        <div class="section-header">
            <span class="eyebrow"></span>
            <h1>Calls</h1>
            <p>Calls</p>
        </div>
        <div class="toolbar">
            <input type="text" v-model="searchQuery">
        </div>
    </div>
</main>  
</template>

<style scoped>
</style>