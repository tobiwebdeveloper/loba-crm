<script setup lang="ts">
import TaskCard from "../components/tasks/TaskCard.vue"
import { tasks } from "../data/taskData"
import type { Task } from "../data/taskData";


const handleComplete = (task: Task) => {
    task.status = task.status === "Completed"
        ? "Pending"
        : "Completed";

};

</script>

<template>
    <main class="tasks">
        <div class="container">

            <header class="section-header">
                <span class="eyebrow">Workflow</span>
                <h1>Follow-ups & Tasks</h1>
                <p>Manage your upcoming work and follow-ups.</p>
            </header>

            <section class="task-list">
                <TaskCard
                v-for="task in tasks"
                :key="task.id"
                :task="task"
                @complete="handleComplete"
            />
            </section>

        </div>
    </main>
</template>

<style scoped>
.tasks {
    width: 100%;
}

.task-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
}
</style>