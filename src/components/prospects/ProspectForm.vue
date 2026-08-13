<script setup lang="ts">
import { ref, watch } from "vue";
import type { Prospect } from "../../data/prospectData";

const emit = defineEmits<{
    close: [];
    save: [prospect: Omit<Prospect, "id">];
}>();

const props = defineProps<{
    prospect: Prospect | null;
}>();

const business = ref("");
const industry = ref("");
const location = ref("");
const website = ref("");
const phone = ref("");
const email = ref("");
const contactPerson = ref("");
const source = ref("Manual");
const status = ref("New");
const opportunityScore = ref(50);
const notes = ref("");

watch(
    () => props.prospect,
    (prospect) => {
        if (!prospect) {
            business.value = "";
            industry.value = "";
            location.value = "";
            website.value = "";
            phone.value = "";
            email.value = "";
            contactPerson.value = "";
            source.value = "Manual";
            status.value = "New";
            opportunityScore.value = 50;
            notes.value = "";

            return;
        }

        business.value = prospect.business;
        industry.value = prospect.industry;
        location.value = prospect.location;
        website.value = prospect.website;
        phone.value = prospect.phone;
        email.value = prospect.email;
        contactPerson.value = prospect.contactPerson;
        source.value = prospect.source;
        status.value = prospect.status;
        opportunityScore.value = prospect.opportunityScore;
        notes.value = prospect.notes;
    },
    { immediate: true }
);

const saveProspect = () => {
    const data = {
        business: business.value,
        industry: industry.value,
        location: location.value,
        website: website.value,
        phone: phone.value,
        email: email.value,
        contactPerson: contactPerson.value,
        source: source.value,
        status: status.value,
        opportunityScore: opportunityScore.value,
        problems: [],
        notes: notes.value,
        archived: false,
    };

    if (props.prospect) {
        Object.assign(props.prospect, data);
        emit("close");
        return;
    }

    emit("save", data);
};
</script>

<template>
    <div class="modal-backdrop">
        <div class="modal">
            <button
                class="modal-close"
                type="button"
                @click="emit('close')"
            >
                ×
            </button>

            <div class="modal-header">
                <span class="eyebrow">Sales</span>
                <h2>{{ props.prospect ? "Edit Prospect" : "Add Prospect" }}</h2>
                <p>
                    {{
                        props.prospect
                            ? "Update this prospect."
                            : "Add a new business to your pipeline."
                    }}
                </p>
             
            </div>

            <form class="prospect-form" @submit.prevent="saveProspect">

                <label>
                    Business
                    <input v-model="business" type="text" required />
                </label>

                <label>
                    Contact person
                    <input v-model="contactPerson" type="text" />
                </label>

                <label>
                    Industry
                    <input v-model="industry" type="text" />
                </label>

                <label>
                    Location
                    <input v-model="location" type="text" />
                </label>

                <label>
                    Email
                    <input v-model="email" type="email" />
                </label>

                <label>
                    Phone
                    <input v-model="phone" type="tel" />
                </label>

                <label>
                    Website
                    <input v-model="website" type="url" />
                </label>

                <label>
                    Status
                    <select v-model="status">
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Proposal">Proposal</option>
                        <option value="Won">Won</option>
                    </select>
                </label>

                <label>
                    Opportunity score
                    <input
                        v-model.number="opportunityScore"
                        type="number"
                        min="0"
                        max="100"
                    />
                </label>

                <label class="full-width">
                    Notes
                    <textarea v-model="notes"></textarea>
                </label>

                <div class="form-actions">
                    <button
                        type="button"
                        class="btn-secondary"
                        @click="emit('close')"
                    >
                        Cancel
                    </button>

                    <button type="submit">
                        {{ props.prospect ? "Save Changes" : "Save Prospect" }}
                    </button>
                </div>

            </form>
        </div>
    </div>
</template>

<style scoped>
/* Backdrop */

.modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 100;

    display: grid;
    place-items: center;

    padding: var(--space-5);

    background: rgba(0, 0, 0, 0.68);
    backdrop-filter: blur(6px);
}

/* Modal */

.modal {
    position: relative;

    width: min(100%, 38rem);
    max-height: min(90vh, 52rem);

    display: flex;
    flex-direction: column;

    padding: var(--space-6);

    overflow-y: auto;

    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);

    box-shadow:
        0 24px 80px rgba(0, 0, 0, 0.45),
        rgba(255, 255, 255, 0.08) 4px 4px;
}

/* Close */

.modal-close {
    position: absolute;
    top: var(--space-4);
    right: var(--space-4);

    width: 2rem;
    height: 2rem;

    display: grid;
    place-items: center;

    padding: 0;

    border: 1px solid var(--border);
    border-radius: 50%;

    background: transparent;
    color: var(--text-muted);

    font-size: 1.25rem;
    line-height: 1;

    cursor: pointer;

    transition:
        background 150ms ease,
        color 150ms ease,
        border-color 150ms ease;
}

.modal-close:hover {
    background: var(--surface-raised);
    color: var(--text);
    border-color: var(--text-muted);
}

/* Header */

.modal-header {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);

    padding-right: var(--space-6);
    margin-bottom: var(--space-5);
}

.modal-header h2 {
    font-family: var(--font-display);
    font-size: 1.5rem;
    line-height: 1.1;
}

.modal-header p {
    color: var(--text-muted);
    font-size: 0.875rem;
}

/* Form */

.prospect-form {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-4);
}

.prospect-form label {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);

    color: var(--text-muted);

    font-size: 0.8rem;
    font-weight: 600;
}

.prospect-form input,
.prospect-form select,
.prospect-form textarea {
    width: 100%;

    padding: 0.7rem 0.8rem;

    border: 1px solid var(--border);
    border-radius: var(--radius-sm);

    background: var(--surface-raised);
    color: var(--text);

    font: inherit;

    outline: none;

    transition:
        border-color 150ms ease,
        box-shadow 150ms ease;
}

.prospect-form input:focus,
.prospect-form select:focus,
.prospect-form textarea:focus {
    border-color: var(--accent);

    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.06);
}

.prospect-form textarea {
    min-height: 7rem;
    resize: vertical;
}

.full-width {
    grid-column: 1 / -1;
}

/* Actions */

.form-actions {
    grid-column: 1 / -1;

    display: flex;
    justify-content: flex-end;
    gap: var(--space-2);

    padding-top: var(--space-3);

    border-top: 1px solid var(--border);
}

/* Buttons */

.form-actions button {
    border: 0;
    border-radius: var(--radius-sm);

    padding: 0.7rem 1rem;

    background: var(--accent);
    color: #09090b;

    font-weight: 600;
    cursor: pointer;

    transition:
        transform 150ms ease,
        opacity 150ms ease;
}

.form-actions button:hover {
    opacity: 0.9;
}

.form-actions button:active {
    transform: translateY(1px);
}

.form-actions .btn-secondary {
    background: var(--surface-raised);
    border: 1px solid var(--border);
    color: var(--text);
}

.form-actions .btn-secondary:hover {
    background: var(--surface);
}

/* Mobile */

@media (max-width: 640px) {
    .modal-backdrop {
        padding: var(--space-3);
    }

    .modal {
        width: 100%;
        max-height: 94vh;

        padding: var(--space-5);
    }

    .prospect-form {
        grid-template-columns: 1fr;
    }

    .full-width {
        grid-column: auto;
    }

    .form-actions {
        grid-column: auto;
        flex-direction: column-reverse;
    }

    .form-actions button {
        width: 100%;
    }
}
</style>