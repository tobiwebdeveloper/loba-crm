<script setup lang="ts">
import type { Task } from "../../data/taskData";
const props = defineProps<{
  tasks: Task[];
}>()

</script>

<template>
    <div class="section-header">
        <h1>Today's Actions</h1>
    </div>
    <div class="action-list">
        <div
            v-for="task in props.tasks"
            :key="task.id"
            class="action-item"
        >
            <span class="action-time">
                {{ task.dueTime }}
            </span>

            <div class="action-content">
                <h3>{{ task.title }}</h3>
                <p>{{ task.description }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.action-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
}

.action-item {
    position: relative;

    display: flex;
    align-items: center;
    gap: var(--space-4);

    padding: var(--space-4) var(--space-5);

    background: var(--gradient-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);

    box-shadow: rgba(255, 255, 255, 0.12) 3px 3px;
}

.action-time {
    min-width: 4rem;

    color: var(--accent);
    font-family: var(--font-display);
    font-size: 0.85rem;
    font-weight: 700;
}

.action-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
}

.action-content h3 {
    font-size: 1rem;
    font-weight: 600;
}

.action-content p {
    font-size: 0.875rem;
}
</style>