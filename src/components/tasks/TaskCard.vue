<script setup lang="ts">
import type { Task } from "../../data/taskData"
import { computed } from "vue"




const props = defineProps<{
    task: Task
}>()
const emit = defineEmits<{
    complete: [task: Task]
}>()

const taskClasses = computed(() => {
  if ( props.task.priority === "Low"){
    return "task-card--low";
  }
  if ( props.task.priority === "Medium"){
    return "task-card--medium";
  }
  if ( props.task.priority === "High"){
    return "task-card--high";
  }

  return "";
})

</script>

<template>
   <article class="task-card"
   :class="taskClasses">

    <input
        type="checkbox"
        :checked="task.status === 'Completed'"
        @change="emit('complete', task)"
    >

    <div class="task-content">

        <div class="task-header">
            <div>
                <h2>{{ task.title }}</h2>
                <p>{{ task.description }}</p>
            </div>

            <span
                class="task-priority"
                
            >
                {{ task.priority }}
            </span>
        </div>

        <div class="task-meta">
            <span>{{ task.dueDate }}</span>
            <span>{{ task.dueTime }}</span>
            <span>{{ task.type }}</span>
        </div>

    </div>

</article>
</template>

<style scoped>
.task-card {
    padding: var(--space-5);

    border: 1px solid var(--border);
    border-radius: var(--radius-md);

    background: var(--gradient-surface);
}

.task-header {
    display: flex;
    justify-content: space-between;
    gap: var(--space-4);
}

.task-header h2 {
    margin: 0;
}

.task-content p {
    color: var(--text-muted);
}

.task-meta {
    display: flex;
    gap: var(--space-4);

    color: var(--text-muted);
    font-size: 0.85rem;
}

.task-card--low {
    border-left: 3px solid var(--priority-low);
}

.task-card--medium {
    border-left: 3px solid var(--priority-medium);
}

.task-card--high {
    border-left: 3px solid var(--priority-high);
}
</style>