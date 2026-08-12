<script setup lang="ts">
import { prospects } from "../data/prospectData"
import ProspectCard from "../components/prospects/ProspectCard.vue"
import { computed, ref } from "vue";
const searchQuery = ref("");
const selectedStatus = ref("");

const filteredProspects = computed(() => {
  return prospects.filter((prospect) => {
    const matchesSearch =
    prospect.business
    .toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = !selectedStatus.value || 
    prospect.status === selectedStatus.value;

    return matchesSearch && matchesStatus;

  })
})
</script>

<template>
    <main class="prospects">
        <div class="container">
            <header class="section-header">
                <span class="eyebrow">Sales</span>
                <h1>Prospects</h1>
                <p>Your prospect database</p>
            </header>
            <section class="toolbar">
                <div class="toolbar-controls">
                    <input type="text" v-model="searchQuery" placeholder="Search prospects">
                    <select v-model="selectedStatus" id="">
                        <option value="">All statuses</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Proposal">Proposal</option>
                        <option value="Won">Won</option>
                    </select>
                </div>
                <button>Add Prospect</button>
            </section>
           <div class="prospect-list">
                <ul>
                    <li
                        v-for="prospect in filteredProspects"
                        :key="prospect.id"
                    >
                        <ProspectCard :prospect="prospect" />
                    </li>
                </ul>
            </div>
        </div>
    </main>
</template>

<style scoped>
.prospects {
    width: 100%;
}


/* Header */


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

.toolbar-controls select {
    min-width: 10rem;
}

/* Prospect list */

.prospect-list {
    overflow: hidden;

    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: rgba(255,255,255,0.15) 4px 4px;
    background: var(--gradient-surface);
}

.prospect-list ul {
    margin: 0;
    padding: 0;

    list-style: none;
}
.prospect-list li {
    margin: 0;
}


.prospect-list li + li {
    border-top: 1px solid var(--border);
}

/* Button */

.toolbar button {
    white-space: nowrap;

    padding: 0.7rem 1.1rem;

    border: 1px solid transparent;
    border-radius: var(--radius-sm);

    background: var(--accent);
    color: #09090b;

    font-weight: 700;

    transition:
        transform 150ms ease,
        opacity 150ms ease;
}

.toolbar button:hover {
    opacity: 0.9;
}

.toolbar button:active {
    transform: translateY(1px);
}
</style>