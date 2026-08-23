import {
  createRouter,
  createWebHistory,
} from "vue-router";

import Dashboard from "@/pages/Dashboard.vue";
import Prospects from "@/pages/Prospects.vue";
import Calls from "@/pages/Calls.vue";
import FollowUps from "@/pages/FollowUps.vue";
import Settings from "@/pages/Settings.vue";

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: "/",
      redirect: "/dashboard",
    },
    {
      path: "/dashboard",
      component: Dashboard,
    },
    {
      path: "/prospects",
      component: Prospects,
    },
    {
      path: "/calls",
      component: Calls,
    },
    {
      path: "/follow-ups",
      component: FollowUps,
    },
    {
      path: "/settings",
      component: Settings,
    },
  ],
});

export default router;