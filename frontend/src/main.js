import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { initSocket } from "./socket";

import {
  Button,
  Input,
  setConfig,
  frappeRequest,
  resourcesPlugin,
  FormControl,
} from "frappe-ui";
import EmptyState from "@/components/EmptyState.vue";

import { IonicVue } from "@ionic/vue";

import { session } from "@/data/session";
import { userResource } from "@/data/user";
import { employeeResource } from "@/data/employee";

import dayjs from "@/utils/dayjs";
import getIonicConfig from "@/utils/ionicConfig";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Theme variables */
import "./theme/variables.css";

import "./main.css";

const app = createApp(App);
const socket = initSocket();

setConfig("resourceFetcher", frappeRequest);
app.use(resourcesPlugin);

app.component("Button", Button);
app.component("Input", Input);
app.component("FormControl", FormControl);
app.component("EmptyState", EmptyState);

app.use(router);
app.use(IonicVue, getIonicConfig());

app.provide("$session", session);
app.provide("$user", userResource);
app.provide("$employee", employeeResource);
app.provide("$socket", socket);
app.provide("$dayjs", dayjs);

router.beforeEach(async (to, from, next) => {
  let isLoggedIn = session.isLoggedIn;

  try {
    if (isLoggedIn) await userResource.reload();
  } catch (error) {
    isLoggedIn = false;
  }

  const publicPages = ['Login', 'Register']; 
  const authRequired = !publicPages.includes(to.name);

  if (authRequired && !isLoggedIn) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

router.isReady().then(() => {
  app.mount("#app");
});
