<script setup lang="ts">
const props = defineProps<{
    label: string;
    value: string;
}>();
</script>

<template>
    <div class="stat-card">
        <h3 class="label">{{ label }}</h3>
        <strong>{{ value }}</strong>
    </div>
</template>

<style scoped>
.stat-card {
    min-height: 9rem;
    padding: var(--space-5);

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    background: var(--gradient-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);

    box-shadow: rgba(255, 255, 255, 0.18) 4px 4px;

    position: relative;
    overflow: hidden;
}

.stat-card::after {
    content: "";
    position: absolute;
    width: 21rem;
    height: 21rem;
    top: -3.5rem;
    right: -3.5rem;

    background: var(--text);
    opacity: 0.01;
    border-radius: 50%;
}

.label {
    color: var(--text-muted);
    font-family: var(--font-body);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

strong {
    color: var(--text);
    font-family: var(--font-display);
    font-size: 2.75rem;
    line-height: 1;
    letter-spacing: -0.04em;
}
</style>