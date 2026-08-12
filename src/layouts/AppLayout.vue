<script setup lang="ts">
import AppSidebar from "../components/app/AppSidebar.vue"
</script>
<template>
    <div class="app-layout">
        <AppSidebar />
        <main class="main-content">
            <slot />
        </main>
    </div>
</template>
<style scoped>
.app-layout {
    display: flex;
    min-height: 100vh;
}
.main-content {
    flex: 1;
    min-width: 0;
    padding: var(--space-6);
}
</style>