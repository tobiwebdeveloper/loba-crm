import { createApp } from "vue";

import App from "./app/App.vue";
import router from "./app/router";
import '@paraxe/design/style.css'
import "./styles/theme.css"
import '@paraxe/design/presets/corporate.css'
import "./style.css";

createApp(App)
  .use(router)
  .mount("#app");