<script setup lang="ts">
import { ref, computed } from "vue";
import { calls } from "../../data/callData"
import type { Prospect } from "../../data/prospectData";

const props = defineProps<{
    prospect: Prospect;
}>();

const emit = defineEmits<{
    edit: [prospect: Prospect];
    archive: [prospect: Prospect];
}>();

const isMenuOpen = ref(false);
const isExpanded = ref(false);

const callCount = computed(() => {
  return calls.filter(
    (call) => call.prospectId === props.prospect.id
  ).length
})
const prospectCalls = computed(() => {
    return calls.filter(
        call => call.prospectId === props.prospect.id
    )
})
</script>

<template>
    <article class="prospect-card">

        <div class="prospect-main">
            <div class="prospect-info">
                <h2>{{ prospect.business }}</h2>
                <p>{{ prospect.industry }}</p>
                <p>{{ prospect.location }}</p>
            </div>

            <div class="prospect-meta">
                <span>{{ prospect.status }}</span>
                <span>{{ callCount }} calls</span>
                <strong>{{ prospect.opportunityScore }}</strong>
            </div>

            <div class="prospect-actions">
                <button
                    class="details-trigger"
                    type="button"
                    @click="isExpanded = !isExpanded"
                    :aria-expanded="isExpanded"
                >
                    <span>{{ isExpanded ? "Hide details" : "Details" }}</span>
                    <span class="chevron">
                        {{ isExpanded ? "⌃" : "⌄" }}
                    </span>
                </button>

                <button
                    class="actions-trigger"
                    type="button"
                    aria-label="Prospect actions"
                    @click="isMenuOpen = !isMenuOpen"
                >
                    ⋯
                </button>

                <div
                    v-if="isMenuOpen"
                    class="actions-menu"
                >
                    <button
                        type="button"
                        @click="
                            emit('edit', prospect);
                            isMenuOpen = false;
                        "
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="btn-danger"
                        @click="
                            emit('archive', prospect);
                            isMenuOpen = false;
                        "
                    >
                        Archive
                    </button>
                </div>
            </div>
        </div>

        <div
            v-if="isExpanded"
            class="prospect-details"
        >
            <div class="detail-grid">

                <div class="detail">
                    <span>Contact</span>
                    <strong>{{ prospect.contactPerson || "—" }}</strong>
                </div>

                <div class="detail">
                    <span>Source</span>
                    <strong>{{ prospect.source || "—" }}</strong>
                </div>

                <div class="detail">
                    <span>Email</span>
                    <a
                        v-if="prospect.email"
                        :href="`mailto:${prospect.email}`"
                    >
                        {{ prospect.email }}
                    </a>
                    <strong v-else>—</strong>
                </div>

                <div class="detail">
                    <span>Phone</span>
                    <a
                        v-if="prospect.phone"
                        :href="`tel:${prospect.phone}`"
                    >
                        {{ prospect.phone }}
                    </a>
                    <strong v-else>—</strong>
                </div>

                <div class="detail">
                    <span>Website</span>
                    <a
                        v-if="prospect.website && prospect.website !== 'No website'"
                        :href="prospect.website"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Visit website
                    </a>
                    <strong v-else>—</strong>
                </div>

            </div>

            <div class="detail-notes">
                <span>Notes</span>
                <p>{{ prospect.notes || "No notes added." }}</p>
            </div>

            <div
                v-if="prospect.problems.length"
                class="detail-problems"
            >
                <span>Problems identified</span>

                <div class="problem-list">
                    <span
                        v-for="problem in prospect.problems"
                        :key="problem"
                    >
                        {{ problem }}
                    </span>
                </div>
            </div>
                  <div class="detail-calls">
                    <span>Recent Calls</span>

                <div
                    v-if="prospectCalls.length"
                    class="call-list"
                >
                    <div
                        v-for="call in prospectCalls"
                        :key="call.id"
                        class="call-item"
                    >
                        <strong>{{ call.date }}</strong>
                        <span>{{ call.duration }} min</span>
                        <span>{{ call.outcome }}</span>
                    </div>
                </div>

                <p v-else>No calls recorded.</p>
            </div>
        </div>

    </article>
</template>

<style scoped>
.prospect-card {
    position: relative;
    overflow: visible;

    background: var(--gradient-surface);

    transition:
        background 150ms ease,
        transform 150ms ease;
}

.prospect-card:hover {
    background: var(--surface-raised);
}

.prospect-main {
    min-height: 6.5rem;
    padding: var(--space-4) var(--space-5);

    display: flex;
    align-items: center;
    gap: var(--space-5);
}

/* Information */

.prospect-info {
    min-width: 0;
    flex: 1;

    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.prospect-info h2 {
    font-size: 1.05rem;
    font-weight: 600;
}

.prospect-info p {
    font-size: 0.8rem;
}

.prospect-info p:last-child {
    color: var(--text-muted);
}

/* Meta */

.prospect-meta {
    display: flex;
    align-items: center;
    gap: var(--space-4);

    flex-shrink: 0;
}

.prospect-meta span {
    padding: 0.35rem 0.65rem;

    border: 1px solid var(--border);
    border-radius: 999px;

    background: var(--surface);
    color: var(--text-muted);

    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

.prospect-meta strong {
    min-width: 2.5rem;

    font-family: var(--font-display);
    font-size: 1.5rem;
    line-height: 1;
    text-align: right;
}

/* Actions */

.prospect-actions {
    position: relative;

    display: flex;
    align-items: center;
    gap: var(--space-2);

    flex-shrink: 0;
}

.details-trigger,
.actions-trigger {
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);

    background: transparent;
    color: var(--text-muted);

    cursor: pointer;

    transition:
        background 150ms ease,
        color 150ms ease;
}

.details-trigger {
    display: flex;
    align-items: center;
    gap: 0.4rem;

    padding: 0.5rem 0.7rem;

    font-size: 0.75rem;
}

.actions-trigger {
    width: 2rem;
    height: 2rem;

    display: grid;
    place-items: center;

    padding: 0;

    font-size: 1.15rem;
}

.details-trigger:hover,
.actions-trigger:hover {
    background: var(--surface);
    color: var(--text);
}

.chevron {
    font-size: 1rem;
}

/* Action menu */

.actions-menu {
    position: absolute;
    top: calc(100% + var(--space-2));
    right: 0;
    z-index: 20;

    min-width: 8rem;

    display: flex;
    flex-direction: column;

    padding: 0.35rem;

    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);

    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.actions-menu button {
    width: 100%;

    padding: 0.6rem 0.7rem;

    border: 0;
    border-radius: var(--radius-sm);

    background: transparent;
    color: var(--text);

    text-align: left;
    font: inherit;
    font-size: 0.85rem;

    cursor: pointer;
}

.actions-menu button:hover {
    background: var(--surface-raised);
}

.actions-menu .btn-danger {
    color: var(--text-muted);
}

/* Details */

.prospect-details {
    padding: 0 var(--space-5) var(--space-5);

    border-top: 1px solid var(--border);
}

.detail-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-4);

    padding-top: var(--space-5);
}

.detail {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}

.detail > span,
.detail-notes > span,
.detail-problems > span {
    color: var(--text-muted);

    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

.detail strong,
.detail a {
    color: var(--text);
    font-size: 0.85rem;
}

.detail a {
    text-decoration: none;
}

.detail a:hover {
    color: var(--accent);
}

/* Notes */

.detail-notes,
.detail-problems {
    margin-top: var(--space-5);
}

.detail-notes p {
    margin-top: var(--space-2);

    color: var(--text-muted);
    font-size: 0.85rem;
    line-height: 1.6;
}

/* Problems */

.problem-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);

    margin-top: var(--space-2);
}

.problem-list span {
    padding: 0.35rem 0.6rem;

    border: 1px solid var(--border);
    border-radius: 999px;

    color: var(--text-muted);

    font-size: 0.7rem;
}


/* Mobile */

@media (max-width: 640px) {
    .prospect-main {
        align-items: flex-start;
        flex-wrap: wrap;
    }

    .prospect-info {
        min-width: calc(100% - 5rem);
    }

    .prospect-meta {
        order: 3;
    }

    .prospect-actions {
        margin-left: auto;
    }

    .detail-grid {
        grid-template-columns: 1fr;
    }
}
</style>