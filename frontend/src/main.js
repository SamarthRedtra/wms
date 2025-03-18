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
import { translationsPlugin } from "./plugins/translationsPlugin.js"

import { IonicVue } from "@ionic/vue";

import { session } from "@/data/session";
import { userResource } from "@/data/user";
import { employeeResource } from "@/data/employee";

import dayjs from "@/utils/dayjs";
import getIonicConfig from "@/utils/ionicConfig";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

import FrappePushNotification from "../public/frappe-push-notification"

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


const registerServiceWorker = async () => {
	// window.frappePushNotification = new FrappePushNotification("wms")

	if ("serviceWorker" in navigator) {
		let serviceWorkerURL = "/assets/wms/frontend/sw.js"

		navigator.serviceWorker
			.register(serviceWorkerURL, {
				type: "classic",
			})
			.then((registration) => {
				
					console.log("Service worker registered", registration)
			})
			.catch((err) => {
				console.error("Failed to register service worker", err)
			})
	} else {
		console.error("Service worker not enabled/supported by the browser")
	}
}





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
	console.log("Vue App is mounting...");
	registerServiceWorker();
	app.mount("#app");
	console.log("Vue App Mounted!");
  });
