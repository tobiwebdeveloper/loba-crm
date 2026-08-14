<script setup lang="ts">
import { ref } from "vue";
import CallList from "../components/calls/CallList.vue"
import CallForm from "../components/calls/CallForm.vue";
import { calls } from "../data/callData";
import type { Call } from "../data/callData"
import { prospects } from "../data/prospectData"
const searchQuery = ref("")
const isCallFormOpen = ref(false);
const handleSave = (call: Call) => {
calls.push(call)
isCallFormOpen.value = false
}
const getProspectName = (prospectId: number) => {
    const prospect = prospects.find(
        (prospect) => prospect.id === prospectId
    )

    return prospect?.business ?? "Unknown prospect"
}
</script>

<template>
    <main class="calls">
        <div class="container">

            <header class="section-header">
                <span class="eyebrow">Sales</span>
                <h1>Calls</h1>
                <p>Track your conversations with prospects.</p>
            </header>

            <section class="toolbar">
                <div class="toolbar-controls">
                    <input
                        type="text"
                        v-model="searchQuery"
                        placeholder="Search calls..."
                    />
                </div>

                <button
                    type="button"
                    class="btn-primary"
                    @click="isCallFormOpen = true"
                >
                    Log Call
                </button>
            </section>
            <CallForm
    v-if="isCallFormOpen"
    @close="isCallFormOpen = false"
    @save="handleSave"
/>

           <CallList :calls="calls"/>

        </div>
    </main>
</template>

<style scoped>
.calls {
    width: 100%;
}

/* Toolbar */

.toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);

    padding: var(--space-3);

    background: var(--gradient-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);

    margin-bottom: var(--space-5);
}

.toolbar-controls {
    display: flex;
    align-items: center;
    gap: var(--space-3);

    flex: 1;
}

.toolbar-controls input {
    width: min(100%, 24rem);
}

/* Buttons */

.btn-primary {
    white-space: nowrap;

    padding: 0.7rem 1.1rem;

    border: 1px solid transparent;
    border-radius: var(--radius-sm);

    background: var(--accent);
    color: #09090b;

    font-weight: 700;

    cursor: pointer;

    transition:
        transform 150ms ease,
        opacity 150ms ease;
}

.btn-primary:hover {
    opacity: 0.9;
}

.btn-primary:active {
    transform: translateY(1px);
}

/* Call list */

.call-list {
    overflow: hidden;

    border: 1px solid var(--border);
    border-radius: var(--radius-lg);

    background: var(--gradient-surface);
    box-shadow: rgba(255, 255, 255, 0.15) 4px 4px;
}

/* Table header */

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

/* Empty state */

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
    margin: 0 0 var(--space-4);

    color: var(--text-muted);
}
/* Call rows */

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

    color: var(--text);
}

.call-row span:last-child {
    color: var(--text-muted);

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>