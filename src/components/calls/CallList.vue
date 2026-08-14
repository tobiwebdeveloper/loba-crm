<script setup lang="ts">
import type { Call } from "../../data/callData"
import { prospects } from "../../data/prospectData"

const props = defineProps<{
    calls: Call[]
}>()

const getProspectName = (prospectId: number) => {
    const prospect = prospects.find(
        (prospect) => prospect.id === prospectId
    )

    return prospect?.business ?? "Unknown prospect"
}
</script>

<template>
    <section class="call-list">
        <div class="call-list__header">
            <span>Prospect</span>
            <span>Date</span>
            <span>Duration</span>
            <span>Outcome</span>
            <span>Notes</span>
        </div>

        <div
            v-if="props.calls.length === 0"
            class="call-list__empty"
        >
            <h2>No calls yet</h2>
            <p>
                Log your first call to start building your call history.
            </p>
        </div>

        <div v-else class="call-list__rows">
            <div
                v-for="call in props.calls"
                :key="call.id"
                class="call-row"
            >
                <span>{{ getProspectName(call.prospectId) }}</span>
                <span>{{ call.date }}</span>
                <span>{{ call.duration }} min</span>
                <span>{{ call.outcome }}</span>
                <span>{{ call.notes }}</span>
            </div>
        </div>
    </section>
</template>

<style scoped>
.call-list {
    overflow: hidden;

    border: 1px solid var(--border);
    border-radius: var(--radius-lg);

    background: var(--gradient-surface);
    box-shadow: rgba(255, 255, 255, 0.15) 4px 4px;
}

.call-list__header {
    display: grid;

    grid-template-columns:
        1.5fr
        1fr
        0.8fr
        1fr
        2fr;

    gap: var(--space-4);

    padding: var(--space-4);

    border-bottom: 1px solid var(--border);

    color: var(--text-muted);

    font-size: 0.8rem;
    font-weight: 700;

    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.call-list__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    min-height: 20rem;

    padding: var(--space-6);

    text-align: center;
}

.call-list__empty h2 {
    margin: 0 0 var(--space-2);
}

.call-list__empty p {
    margin: 0;

    color: var(--text-muted);
}

.call-list__rows {
    display: flex;
    flex-direction: column;
}

.call-row {
    display: grid;

    grid-template-columns:
        1.5fr
        1fr
        0.8fr
        1fr
        2fr;

    gap: var(--space-4);
    align-items: center;

    padding: var(--space-4);

    border-bottom: 1px solid var(--border);
}

.call-row:last-child {
    border-bottom: none;
}

.call-row span {
    min-width: 0;
}

.call-row span:last-child {
    color: var(--text-muted);

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>