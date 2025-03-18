<template>
	<ion-app>
		<ion-router-outlet id="main-content" />
		<Toasts />

		<InstallPrompt />
		
	</ion-app>
</template>

<script setup>
import { IonApp, IonRouterOutlet } from "@ionic/vue"

import { Toasts } from "frappe-ui"

import InstallPrompt from "@/components/InstallPrompt.vue"
import { showNotification } from "@/utils/pushNotifications"
import { onMounted } from "vue"

onMounted(() => {
	window?.frappePushNotification?.onMessage((payload) => {
		showNotification(payload)
	})
})

</script>
