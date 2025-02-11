<template>
	<ion-page>
	  <ion-content class="ion-padding">
		<div class="flex h-screen w-screen flex-col justify-center bg-white">
		  <div class="flex flex-col mx-auto gap-3 items-center">
			<FrappeHRLogo class="h-8 w-8" />
			<div class="text-3xl font-semibold text-gray-900 text-center">
			  Login to WMS App
			</div>
		  </div>
  
		  <div class="mx-auto mt-10 w-full px-8 sm:w-96">
			<form class="flex flex-col space-y-4" @submit.prevent="submit">
			  <Input
				label="Email"
				placeholder="johndoe@mail.com"
				v-model="email"
				:type="'email'"
			  />
			  <Input
				label="Password"
				type="password"
				placeholder="••••••"
				v-model="password"
			  />
			  <ErrorMessage :message="session.login.error" />
			  <Button
				:loading="session.login.loading"
				variant="solid"
				class="disabled:bg-gray-700 disabled:text-white !mt-6"
			  >
				Login
			  </Button>
			</form>
  
			<div class="mt-2 text-center">
			  New user?
			  <span class="cursor-pointer text-cyan-600" @click="goToRegister">
				Create an account here
			  </span>
			</div>
		  </div>
		</div>
  
		<!-- Custom Install Prompt Dialog -->
		<!-- <Dialog v-model="showInstallPrompt">
		  <template #body-title>
			<h2 class="text-lg font-bold">Install WMS App</h2>
		  </template>
		  <template #body-content>
			<p>Follow these steps to add the WMS App to your device:</p>
			<ul class="list-disc list-inside">
			  <li>Open your browser's menu.</li>
			  <li>Tap "Add to Home Screen" or "Install App" option.</li>
			  <li>Follow the prompts to complete installation.</li>
			</ul>
		  </template>
		  <template #actions>
			<Button variant="solid" @click="closePrompt" class="py-5 w-full mt-2">
			  <template #prefix><FeatherIcon name="x" class="w-4" /></template>
			  Close
			</Button>
		  </template>
		</Dialog> -->
	  </ion-content>
	</ion-page>
  </template>
  
  <script setup>
  import { IonPage, IonContent } from "@ionic/vue"
  import { inject, ref } from "vue"
  import { Input, Button, ErrorMessage, Dialog, FeatherIcon } from "frappe-ui"
  import FrappeHRLogo from "@/components/icons/FrappeHRLogo.vue"
  import { useRouter } from "vue-router"
  
  const email = ref(null)
  const password = ref(null)
  const session = inject("$session")
  const router = useRouter()
  
//   const showInstallPrompt = ref(false)
  
  // Always show the install prompt on page load
//   showInstallPrompt.value = true;
  
  function submit() {
	session.login.submit({
	  email: email.value,
	  password: password.value,
	})
  }
  
  function goToRegister() {
	router.push({ name: 'Register' }) 
  }
  
//   function closePrompt() {
// 	showInstallPrompt.value = false
//   }
  </script>
  