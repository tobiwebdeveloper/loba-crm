<script setup lang="ts">
import { computed } from "vue";
import { prospects } from "vue";
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

    return counts;
});
</script>
<template>
    <section class="pipeline-section">
        <div class="section-header">
            <span class="eyebrow">Sales</span>
            <h2>Pipeline</h2>
        </div>

        <div class="pipeline">
            <div class="pipeline-stage">
                <div class="stage-header">
                    <span>New</span>
                    <strong>8</strong>
                </div>

                <div class="stage-bar">
                    <span style="width: 100%"></span>
                </div>
            </div>

            <div class="pipeline-stage">
                <div class="stage-header">
                    <span>Contacted</span>
                    <strong>6</strong>
                </div>

                <div class="stage-bar">
                    <span style="width: 75%"></span>
                </div>
            </div>

            <div class="pipeline-stage">
                <div class="stage-header">
                    <span>Qualified</span>
                    <strong>4</strong>
                </div>

                <div class="stage-bar">
                    <span style="width: 50%"></span>
                </div>
            </div>

            <div class="pipeline-stage">
                <div class="stage-header">
                    <span>Meeting</span>
                    <strong>3</strong>
                </div>

                <div class="stage-bar">
                    <span style="width: 38%"></span>
                </div>
            </div>

            <div class="pipeline-stage">
                <div class="stage-header">
                    <span>Proposal</span>
                    <strong>1</strong>
                </div>

                <div class="stage-bar">
                    <span style="width: 13%"></span>
                </div>
            </div>

            <div class="pipeline-stage">
                <div class="stage-header">
                    <span>Won</span>
                    <strong>2</strong>
                </div>

                <div class="stage-bar">
                    <span style="width: 25%"></span>
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