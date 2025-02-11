<template>
	<ion-page>
		<ion-header class="ion-no-border">
			<div class="w-full sm:w-96">
				<div class="flex flex-col bg-white shadow-sm p-4">
					<div class="flex flex-row justify-between items-center">
						<div class="flex flex-row items-center gap-2">
							<router-link
							:to="{ name: computedRoute }"
														v-slot="{ navigate }"
							class="flex flex-col items-center"
						>
							<span class="relative inline-block" @click="navigate">
								<FeatherIcon :name="home" class="h-6 w-6" />
								<span
									v-if="unreadNotificationsCount.data"
									class="absolute top-0 right-0.5 inline-block w-2 h-2 bg-red-600 rounded-full border border-white"
								>
								</span>
							</span>
						</router-link>		
						<FeatherIcon name="chevron-right" class="h-6 w-6" />

						    <h2 class="text-base font-bold text-gray-900">
								{{ props.pageTitle }}
							</h2>
						</div>
						<div class="flex flex-row items-center gap-3 ml-auto">

							<FeatherIcon @click="refresh" name="refresh-cw" class="h-6 w-6 cursor-pointer" />
							<router-link
								:to="{ name: 'Notifications' }"
								v-slot="{ navigate }"
								class="flex flex-col items-center"
							>
								<span class="relative inline-block" @click="navigate">
									<FeatherIcon name="bell" class="h-6 w-6" />
									<span
										v-if="unreadNotificationsCount.data"
										class="absolute top-0 right-0.5 inline-block w-2 h-2 bg-red-600 rounded-full border border-white"
									>
									</span>
								</span>
							</router-link>
							<slot name="profileButton">
								<!-- Default profile avatar if slot is not provided -->
								<router-link :to="{ name: 'Profile' }" class="flex flex-col items-center">
								  <Avatar :image="user.data.user_image" :label="user.data.first_name" size="xl" />
								</router-link>
							  </slot>
						</div>
					</div>
				</div>
			</div>
		</ion-header>

		<ion-content class="ion-no-padding">
			<div class="flex flex-col h-screen w-screen sm:w-96">
				<slot name="body"></slot>
			</div>
		</ion-content>
	</ion-page>
</template>

<script setup>
import { IonHeader, IonContent, IonPage } from "@ionic/vue"
import { FeatherIcon, Avatar } from "frappe-ui"

import { unreadNotificationsCount } from "@/data/notifications"

import { inject, ref, provide, computed } from "vue"

const user = inject("$user")

const props = defineProps({
	pageTitle: {
		type: String,
		required: false,
		default: "WMS",
	},
	home: {
        type: String,
        required: false,
        default: "home",
    },

})




const refresh = () => {
	window.location.reload()
}

const computedRoute = computed(() => {
	if (props.home === 'shopping-cart') {
		return 'ReceivePage'
	} else if (props.home === 'shopping-bag') {
		return 'MaterialRequest'
	}
 else if (props.home === 'edit') {
		return 'StockCount'
	} else if (props.home === 'award') {
		return 'QualityInspection'
	} 
 else if (props.home === 'codesandbox') {
		return 'Packing'
	}
 else if (props.home === 'layers') {
		return 'StockEntryList'
	}else {
		return 'Home'
	}
})


</script>
