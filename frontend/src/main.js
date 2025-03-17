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


const registerServiceWorker = async () => {
	window.frappePushNotification = new FrappePushNotification("hrms")

	if ("serviceWorker" in navigator) {
		let serviceWorkerURL = "/assets/wms/frontend/sw.js"
		let config = ""

		try {
			config = await window.frappePushNotification.fetchWebConfig()
			serviceWorkerURL = `${serviceWorkerURL}?config=${encodeURIComponent(
				JSON.stringify(config)
			)}`
		} catch (err) {
			console.error("Failed to fetch FCM config", err)
		}

		navigator.serviceWorker
			.register(serviceWorkerURL, {
				type: "classic",
				scope: "/wms/",
			})
			.then((registration) => {
				if (config) {
					window.frappePushNotification.initialize(registration).then(() => {
						console.log("Frappe Push Notification initialized")
					})
				}
			})
			.catch((err) => {
				console.error("Failed to register service worker", err)
			})
	} else {
		console.error("Service worker not enabled/supported by the browser")
	}
}

router.isReady().then(async () => {
	if (import.meta.env.DEV) {
		await frappeRequest({
			url: "/api/method/wms.www.wms.get_context_for_dev",
		}).then(async (values) => {
			if (!window.frappe) window.frappe = {}
			window.frappe.boot = values
		})
	}

	await translationsPlugin.isReady();
	registerServiceWorker()
	app.mount("#app")
})



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
