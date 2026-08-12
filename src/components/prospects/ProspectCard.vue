<script setup lang="ts">

const props = defineProps<{
    prospect: {
        id: number;
        business: string;
        industry: string;
        location: string;
        website: string;
        phone: string;
        email: string;
        contactPerson: string;
        source: string;
        status: string;
        opportunityScore: number;
        problems: string[];
        notes: string;
    };
}>();


</script>

<template>
    <div
        class="prospect-card"
    >
        <div class="prospect-info">
            <h2>{{ prospect.business }}</h2>
            <p>{{ prospect.industry }}</p>
            <p>{{ prospect.location }}</p>
        </div>

        <div class="prospect-meta">
            <span>{{ prospect.status }}</span>
            <strong>{{ prospect.opportunityScore }}</strong>
        </div>
    </div>
</template>

<style scoped>
.prospect-card {
    position: relative;
    overflow: hidden;

    min-height: 6.5rem;
    padding: var(--space-4) var(--space-5);

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-5);

    background: var(--gradient-surface);

    transition:
        background 150ms ease,
        transform 150ms ease;
}

.prospect-card::after {
    content: "";

    position: absolute;
    width: 21rem;
    height: 21rem;

    top: -4rem;
    right: -3rem;

    background: var(--text);
    opacity: 0.01;

    border-radius: 50%;
    pointer-events: none;
}

.prospect-card:hover {
    background: var(--surface-raised);
}

/* Information */

.prospect-info {
    min-width: 0;

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
</style>