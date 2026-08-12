import { createRouter, createWebHistory } from "vue-router";

import Dashboard from "../pages/Dashboard.vue";
import Prospects from "../pages/Prospects.vue";
import Calls from "../pages/Calls.vue";
import FollowUps from "../pages/FollowUps.vue";
import Pipeline from "../pages/Pipeline.vue";
import Clients from "../pages/Clients.vue";
import Projects from "../pages/Projects.vue";
import Tasks from "../pages/Tasks.vue";
import Settings from "../pages/Settings.vue";


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: Dashboard,
    },
    {
      path: "/prospects",
      name: "prospects",
      component: Prospects,
    },
    {
      path: "/calls",
      name: "calls",
      component: Calls,
    },
    {
      path: "/follow-ups",
      name: "followUps",
      component: FollowUps,
    },
   
    {
      path: "/pipeline",
      name: "pipeline",
      component: Pipeline,
    },
    {
      path: "/clients",
      name: "clients",
      component: Clients,
    },
    {
      path: "/projects",
      name: "projects",
      component: Projects,
    },
    {
      path: "/tasks",
      name: "tasks",
      component: Tasks,
    },
    {
      path: "/settings",
      name: "settings",
      component: Settings,
    },
  ],
});

export default router;