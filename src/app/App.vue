
<script setup lang="ts">
import { ref } from "vue";
import { RouterView, useRoute } from "vue-router";

const sidebarCollapsed = ref(false);
const route = useRoute();
</script>

<template>
  <div class="app-shell">
    <!-- sidebar -->
  <Sidebar :collapsed="sidebarCollapsed">
  <template #header>
    <div class="brand">
      <div class="brand-mark">L</div>

      <div
        v-if="!sidebarCollapsed"
        class="brand-copy"
      >
        <strong>Loba</strong>
        <span>CRM</span>
      </div>
    </div>
  </template>

  <SidebarGroup label="Workspace">
    <SidebarItem
      :active="$route.path === '/dashboard'"
      href="/dashboard"
    >
      Dashboard
    </SidebarItem>

    <SidebarItem
      :active="$route.path === '/prospects'"
      href="/prospects"
    >
      Prospects
    </SidebarItem>

    <SidebarItem>
      Sales

      <template #children>
        <SidebarItem
          :active="$route.path === '/calls'"
          href="/calls"
        >
          Calls
        </SidebarItem>

        <SidebarItem
          :active="$route.path === '/follow-ups'"
          href="/follow-ups"
        >
          Follow-ups
        </SidebarItem>
      </template>
    </SidebarItem>
  </SidebarGroup>

  <SidebarGroup label="Management">
    <SidebarItem>
      Clients
    </SidebarItem>

    <SidebarItem>
      Reports
    </SidebarItem>
  </SidebarGroup>

  <template #footer>
    <SidebarItem
      :active="$route.path === '/settings'"
      href="/settings"
    >
      Settings
    </SidebarItem>
  </template>
</Sidebar>
    <main class="app-main">
      <component :is="RouterView" />
    </main>
  </div>
</template>
<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
 
}

.app-main {
  flex: 1 1 auto;
  min-width: 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 2rem;
  height: 2rem;

  flex: 0 0 auto;

  border-radius: var(--radius-md);

  background: var(--brand-primary);
  color: var(--text-on-brand);

  font-weight: var(--font-weight-bold);
}

.brand-copy {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.brand-copy strong {
  color: var(--text-primary);
}

.brand-copy span {
  color: var(--text-muted);
  font-size: var(--font-size-xs);
}
</style>