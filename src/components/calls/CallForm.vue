<script setup lang="ts">
import { ref } from "vue";
import type { Call } from "../../data/callData"
import { prospects } from "../../data/prospectData"
const selectedProspect = ref<number | "">("")
const date = ref("")
const duration = ref("")
const outcome = ref<"Completed" | "No-Answer" | "Callback" | "">("")
const notes = ref("")
 
const handleSubmit = () => {

    if (!outcome.value) {
        return
    }

    const newCall: Call = {
        id: Date.now(),
        prospectId: Number(selectedProspect.value),
        date: date.value,
        duration: Number(duration.value),
        outcome: outcome.value,
        notes: notes.value,
    }
    emit("save", newCall )
}
const emit = defineEmits<{
  close: [];
  save: [call: Call]
}>()

</script>
<template>
    <div class="modal-backdrop" @click.self="emit('close')">
        <div class="modal">
            <form class="call-form" @submit.prevent="handleSubmit">
                <header class="call-header">
                    <div>
                        <span class="eyebrow">Sales</span>
                        <h2>Log a Call</h2>
                        <p>Record a conversation with a prospect.</p>
                    </div>

                    <button
                        type="button"
                        class="close-button"
                        aria-label="Close"
                        @click="emit('close')"
                    >
                        ×
                    </button>
                </header>

                <div class="fields">
                    <div class="field">
                        <label for="prospect">Prospect</label>

                        <select
                            id="prospect"
                            name="prospect"
                            v-model="selectedProspect"
                        >
                            <option 
                            v-for="prospect in prospects"
                            :key="prospect.id"
                            :value="prospect.id">{{ prospect.business }}</option>
                        </select>
                    </div>

                    <div class="form-row">
                        <div class="field">
                            <label for="date">Date</label>

                            <input
                                id="date"
                                type="date"
                                v-model="date"
                            />
                        </div>

                        <div class="field">
                            <label for="duration">Duration</label>

                            <input
                                id="duration"
                                type="number"
                                min="1"
                                v-model="duration"
                                placeholder="Minutes"
                            />
                        </div>
                    </div>

                    <div class="field">
                        <label for="outcome">Outcome</label>

                        <select
                            id="outcome"
                            name="outcome"
                            v-model="outcome"
                        >
                            <option value="">Select outcome</option>
                            <option value="Completed">Completed</option>
                            <option value="No-Answer">No-Answer</option>
                            <option value="Callback">Callback</option>
                        </select>
                    </div>

                    <div class="field">
                        <label for="notes">Notes</label>

                        <textarea
                            id="notes"
                            name="notes"
                            v-model="notes"
                            placeholder="What happened on the call?"
                        ></textarea>
                    </div>

                    <div class="call-actions">
                        <button
                            type="button"
                            class="btn-secondary"
                            @click="emit('close')"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            class="btn-primary"
                        >
                            Log Call
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>


/* Header */

.call-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    gap: var(--space-4);

    margin-bottom: var(--space-6);
}

.call-header h2 {
    margin: var(--space-2) 0;

    font-size: 1.5rem;
}

.call-header p {
    margin: 0;

    color: var(--text-muted);
}

.close-button {
    display: grid;
    place-items: center;

    width: 2rem;
    height: 2rem;

    border: 1px solid var(--border);
    border-radius: var(--radius-sm);

    background: transparent;
    color: var(--text);

    font-size: 1.4rem;
    line-height: 1;

    cursor: pointer;
}

.close-button:hover {
    background: var(--surface);
}

/* Fields */

.fields {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
}

.field {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;

    gap: var(--space-4);
}

.field label {
    font-size: 0.85rem;
    font-weight: 600;
}

.field input,
.field select,
.field textarea {
    width: 100%;

    padding: 0.75rem 0.85rem;

    border: 1px solid var(--border);
    border-radius: var(--radius-sm);

    background: var(--surface);
    color: var(--text);

    font: inherit;

    outline: none;

    transition:
        border-color 150ms ease,
        box-shadow 150ms ease;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
    border-color: var(--accent);
}

.field textarea {
    min-height: 8rem;

    resize: vertical;
}

/* Actions */

.call-actions {
    display: flex;
    justify-content: flex-end;

    gap: var(--space-3);

    padding-top: var(--space-2);
}

.call-actions button {
    padding: 0.7rem 1.1rem;

    border-radius: var(--radius-sm);

    font: inherit;
    font-weight: 700;

    cursor: pointer;
}

.btn-secondary {
    border: 1px solid var(--border);

    background: transparent;
    color: var(--text);
}

.btn-primary {
    border: 1px solid transparent;

    background: var(--accent);
    color: #09090b;
}

/* Animation */

@keyframes modal-in {
    from {
        opacity: 0;
        transform: translateY(8px) scale(0.98);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* Mobile */

@media (max-width: 600px) {
    .call-form {
        padding: var(--space-4);
    }

    .form-row {
        grid-template-columns: 1fr;
    }

    .call-actions {
        flex-direction: column-reverse;
    }

    .call-actions button {
        width: 100%;
    }
}
</style>