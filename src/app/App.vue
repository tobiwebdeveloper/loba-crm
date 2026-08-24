<script setup lang="ts">
import {
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";

import {
  RouterView,
  useRoute,
} from "vue-router";

import { useAppearance } from "@/composables/useAppearance";

const sidebarCollapsed = ref(false);
const mobileSidebarOpen = ref(false);

const route = useRoute();

const { loadAppearance } =
  useAppearance();

function updateSidebarState(): void {
  if (window.innerWidth <= 40 * 16) {
    sidebarCollapsed.value = false;
    return;
  }

  sidebarCollapsed.value =
    window.innerWidth <= 56 * 16;
}

function closeMobileSidebar(): void {
  mobileSidebarOpen.value = false;
}

function toggleMobileSidebar(): void {
  mobileSidebarOpen.value =
    !mobileSidebarOpen.value;
}

function handleKeydown(event: KeyboardEvent): void {
  if (
    event.key === "Escape" &&
    mobileSidebarOpen.value
  ) {
    closeMobileSidebar();
  }
}

watch(
  () => route.path,
  () => {
    closeMobileSidebar();
  },
);

onMounted(() => {
  loadAppearance();

  updateSidebarState();

  window.addEventListener(
    "resize",
    updateSidebarState,
  );

  window.addEventListener(
    "keydown",
    handleKeydown,
  );
});

onUnmounted(() => {
  window.removeEventListener(
    "resize",
    updateSidebarState,
  );

  window.removeEventListener(
    "keydown",
    handleKeydown,
  );
});
</script>

<template>
  <div class="app-shell">
    <button
      class="mobile-menu-button"
      type="button"
      aria-label="Open navigation"
      :aria-expanded="mobileSidebarOpen"
      @click="toggleMobileSidebar"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <div
      v-if="mobileSidebarOpen"
      class="sidebar-backdrop"
      aria-hidden="true"
      @click="closeMobileSidebar"
    ></div>

    <Sidebar
      class="sidebar"
      :collapsed="sidebarCollapsed"
      :class="{
        'sidebar--mobile-open':
          mobileSidebarOpen,
      }"
    >
      <template #header>
        <div class="brand">
          <div class="brand-mark">
            L
          </div>

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

.mobile-menu-button {
  display: none;
}



/*
 * Mobile drawer
 */

  .app-shell {
    position: relative;
    width: 100%;
    min-width: 0;
    overflow-x: hidden;
  }

  .app-main {
    width: 100%;
    min-width: 0;
    flex: 1 1 100%;
  }

  /*
   * Mobile menu trigger
   */
  .mobile-menu-button {
    position: fixed;
    top: var(--space-4);
    left: var(--space-4);
    z-index: 1100;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 2.75rem;
    height: 2.75rem;

    gap: 0.25rem;

    padding: 0;

    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);

    background: var(--surface-primary);
    color: var(--text-primary);

    cursor: pointer;
  }

  .mobile-menu-button span {
    display: block;
    width: 1rem;
    height: 2px;

    border-radius: 999px;

    background: currentColor;
  }

  /*
   * Backdrop
   */
  .sidebar-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1200;

    background: rgb(0 0 0 / 0.45);

    backdrop-filter: blur(2px);
  }

  /*
   * Sidebar drawer
   *
   * .sidebar is the class passed directly
   * to the Sidebar component.
   */
  .sidebar {
    position: fixed !important;
    top: 0;
    bottom: 0;
    left: 0;

    z-index: 1300;

    width: 16rem !important;
    max-width: 85vw;

    transform: translateX(-100%);
    transition:
      transform 220ms ease,
      box-shadow 220ms ease;

    box-shadow: none;

    /*
     * Mobile should always use the expanded
     * sidebar rather than the collapsed version.
     */
    overflow-y: auto;
  }

  .sidebar.sidebar--mobile-open {
    transform: translateX(0);

    box-shadow:
      0 1rem 3rem rgb(0 0 0 / 0.18);
  }

</style>