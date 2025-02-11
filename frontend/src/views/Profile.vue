<template>
	<ion-page>
		<ion-content class="ion-padding">
			<div class="flex flex-col h-screen w-screen">
				<div class="w-full sm:w-96">
					<header
						class="flex flex-row bg-white shadow-sm py-4 px-3 items-center justify-between border-b sticky top-0 z-10"
					>
						<div class="flex flex-row items-center">
							<Button
								variant="ghost"
								class="!pl-0 hover:bg-white"
								@click="router.back()"
							>
								<FeatherIcon name="chevron-left" class="h-5 w-5" />
							</Button>
							<h2 class="text-xl font-semibold text-gray-900">Profile</h2>
						</div>
					</header>
<!-- {{user.data}} -->
					<div class="flex flex-col items-center mt-5 p-4">
						<template v-if="user.data">
							<img
								v-if="user.data.user_image"
								class="h-24 w-24 rounded-full object-cover"
								:src="user.data.user_image"
								:alt="user.data.full_name"
							/>
							<div
								v-else
								class="flex items-center justify-center bg-gray-200 uppercase text-gray-600 h-24 w-24 rounded-full object-cover"
							>
								{{ user.data.full_name[0] }} 
							</div>

							<div class="flex flex-col gap-1.5 items-center mt-2 mb-5">
								<span class="text-lg font-bold text-gray-900">{{ user.data.full_name }} {{ user.data.last_name }}</span>
								<span class="font-normal text-sm text-gray-500">{{ user.data.name }}</span>
							</div>

							<Button
								@click="logout"
								variant="outline"
								theme="red"
								class="w-full shadow py-4 mt-5"
							>
								<template #prefix>
									<FeatherIcon name="log-out" class="w-4" />
								</template>
								Log Out
							</Button>
						</template>
						<template v-else>
							<p>Loading user data...</p>
						</template>
					</div>
				</div>
			</div>
		</ion-content>
	</ion-page>
</template>

<script setup>
import { inject } from "vue"
import { useRouter } from "vue-router"
import { IonPage, IonContent } from "@ionic/vue"

import { showErrorAlert } from "@/utils/dialogs"
import { FeatherIcon } from "frappe-ui"

const session = inject("$session")
const user = inject("$user") // Assuming $user is provided with user information

const router = useRouter()

const logout = async () => {
	try {
		await session.logout.submit()
		router.push({ name: "Login" }) 
	} catch (e) {
		const msg = "An error occurred while attempting to log out!"
		console.error(msg, e)
		showErrorAlert(msg)
	}
}
</script>

<style scoped>

</style>
