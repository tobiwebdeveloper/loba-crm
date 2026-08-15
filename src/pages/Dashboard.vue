<script setup lang="ts">
import StatCard from "../components/dashboard/StatCard.vue";
import TodayActions from "../components/dashboard/TodayActions.vue";
import PipelineOverview from "../components/dashboard/PipelineOverview.vue";

import { computed } from "vue";
import { prospects }  from "../data/prospectData.ts"
import { tasks } from "../data/taskData.ts"
import { calls } from "../data/callData.ts";

const totalCalls = computed(() => {
  return calls.length;
});
const todayTasks = computed(() => {
  const today = new Date().toISOString().split("T")[0] ?? "";
  return tasks.filter((task) => task.dueDate === today)
})
const totalProspects = computed(() => {
  return prospects.length
})
const newProspects = computed(() => {
  return prospects.filter((prospect) => prospect.status === "New").length
})
const wonProspects = computed(() => {
  return prospects.filter((prospect) => prospect.status === "Won").length
})
const meetingProspects = computed(() => {
  return prospects.filter((prospect) => prospect.status === "Meeting").length
})

</script>

<template>
  <div class="dashboard">
    <div class="container">

      <header class="section-header">
        <span class="eyebrow">Overview</span>
        <h1>Dashboard</h1>
        <p class="subtitle">Your sales command centre.</p>
    </header>
    
    <section class="overview">
      <StatCard label="Total prospects" :value="String(totalProspects)" />
      <StatCard label="New prospects" :value="String(newProspects)" />
      <StatCard label="Calls made" :value="String(totalCalls)" />
      <StatCard label="Meetings booked" :value="String(meetingProspects)" />
      <StatCard label="Clients won" :value="String(wonProspects)" />
    </section>
  <hr>
    <TodayActions :tasks="todayTasks"/>
    
    <PipelineOverview />
  </div>
</div>
</template>

<style scoped>


.overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 3rem;
}
</style>