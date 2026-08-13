<script setup lang="ts">
import { computed } from "vue";
import { prospects } from "../../data/prospectData";

const stages = [
    "New",
    "Contacted",
    "Qualified",
    "Meeting",
    "Proposal",
    "Won"
];

const pipelineStages = computed(() => {
    const counts = stages.map((stage) => {
        return {
            name: stage,
            count: prospects.filter(
                (prospect) => prospect.status === stage
            ).length
        };
    });

    const maxCount = Math.max(
        ...counts.map((stage) => stage.count)
    );

    return counts.map((stage) => {
        return {
            ...stage,
            width: maxCount
                ? `${(stage.count / maxCount) * 100}%`
                : "0%"
        };
    });
});
</script>
<template>
    <section class="pipeline-section">
        <div class="section-header">
            <span class="eyebrow">Sales</span>
            <h2>Pipeline</h2>
        </div>

        <div class="pipeline">
           <div v-for="stage in pipelineStages" :key="stage.name" class="pipeline-stage">
            <div class="stage-header">
                <span>{{ stage.name }}</span>
                <strong>{{ stage.count }}</strong>
            </div>
            <div class="stage-bar">
                <span :style="{ width: stage.width}"></span>
            </div>
           </div>
        </div>
    </section>
</template>
<style scoped>
.pipeline-section {
    margin-bottom: var(--space-6);
    padding: var(--space-7) 0;

    display: flex;
    flex-direction: column;
    gap: var(--space-4);
}

.pipeline {
    display: grid;
    grid-template-columns: repeat(6, 1fr);

    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;

    background: var(--gradient-surface);
    box-shadow: rgba(255, 255, 255, 0.15) 4px 4px;
}

.pipeline-stage {
    min-height: 8rem;
    padding: var(--space-4);

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    border-right: 1px solid var(--border);
}

.pipeline-stage:last-child {
    border-right: none;
}

.stage-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-3);
}

.stage-header span {
    color: var(--text-muted);
    font-size: 0.8rem;
    font-weight: 600;
}

.stage-header strong {
    font-family: var(--font-display);
    font-size: 1.5rem;
    line-height: 1;
}

.stage-bar {
    height: 3px;
    overflow: hidden;

    background: var(--border);
    border-radius: 999px;
}

.stage-bar span {
    display: block;
    height: 100%;

    background: var(--accent);
    border-radius: inherit;
}
</style>