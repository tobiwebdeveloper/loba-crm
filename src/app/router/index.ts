import {
  createRouter,
  createWebHistory,
} from "vue-router";

import Dashboard from "@/pages/Dashboard.vue";
import Prospects from "@/pages/Prospects.vue";
import ProspectDetail from "@/pages/ProspectDetail.vue";
import Calls from "@/pages/Calls.vue";
import CallDetail from "@/pages/CallDetail.vue";
import FollowUps from "@/pages/FollowUps.vue";
import FollowUpDetail from "@/pages/FollowUpDetail.vue";
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
    path: "/prospects/:id",
    component: ProspectDetail,
    },
    {
      path: "/calls",
      component: Calls,
    },
    {
      path: "/calls/:id",
      component: CallDetail,
    },
    {
      path: "/follow-ups",
      component: FollowUps,
    },
    {
      path: "/follow-ups/:id",
      component: FollowUpDetail,
    },
    {
      path: "/settings",
      component: Settings,
    },
  ],
});

export default router;