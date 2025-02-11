<template>
	<BaseLayout pageTitle="Packing" :home="'home'" @cartIconClick="handleCartIconClick"   >
		<template #profileButton>
			
			<router-link :to="{ name: 'NewPacking' }" class="flex flex-col items-center">
			  <button class="flex items-center bg-black text-white rounded-full py-1 px-3 focus:outline-none text-xs">
				
				<FeatherIcon name="plus" class="h-4 w-4 mr-1" />
				
				New 
			  </button>
			</router-link>
		  </template>
		<template #body>
			<div class="flex flex-col items-center my-7 p-4 gap-7">
			

				<div class="w-full">
					<TabButtons
					  :buttons="[{ label: 'Pending Packing' }, { label: 'Completed Packing' }]"
					  v-model="activeTab"
					  @tab-clicked="handleTabClicked"
			  
			  
					/>
					<RequestList v-if="activeTab === 'Pending Packing'"  />
					<RequestList
					  v-else-if="activeTab === 'Completed Packing'"
					 
					/>
				  </div>












                






<!-- {{ invoices.data }} -->


				<div class="flex flex-col gap-5 my-4 w-full">
					<!-- <div class="text-lg font-medium text-gray-900">QuickLinks</div> -->
					<div class="flex flex-col bg-white rounded cursor-pointer">
						<div
							class="flex flex-row flex-start p-4 items-center justify-between border-b"
							v-for="link in displayedItems"
							:key="link.title"
							@click="redirectToForm(link)"
						>
							<div class="flex flex-row items-center gap-3 grow">
								<!-- <component :is="link.icon" class="h-5 w-5 text-gray-500" /> -->
								<FeatherIcon name="codesandbox" class="h-6 w-6 text-black-500" />
                               
                                								<div id="fontChange" class=" font-normal text-gray-800 leading-6">
									<p >{{ link.name }} : <span>{{ link.customer_name }}</span></p>
									
									<p >{{link.modified}}</p>
								</div>
								<div id="circlei">{{ link.status }}
									
								</div>
							</div>
							<FeatherIcon name="chevron-right" class="h-5 w-5 text-gray-500" />
						</div>
					</div>
				</div>

				
			</div>
		</template>
       
	</BaseLayout>
</template>

<script setup>
import { markRaw, ref,computed, onMounted, watch, onBeforeUnmount,watchEffect,inject } from "vue"


import { useRouter } from 'vue-router';
import BaseLayout from "@/components/BaseLayout.vue"

import { FeatherIcon,createListResource } from "frappe-ui"

import TabButtons from "@/components/TabButtons.vue";
  import RequestList from "@/components/RequestList.vue";
 


import axios from "axios"



  const activeTab = ref("Pending Packing"); 





const handleTabClicked = (tabValue) => {
  activeTab.value = tabValue;
  emit("tab-clicked", tabValue);
};

 































const handleCartIconClick = () => {
    
    router.push({ name: 'ReceivePage' });
}





let qualityInspectionData = ref([])

const pendingReceiptItems = ref([])
const completedReceiptItems = ref([])

const fetchDataII = async () => {
	const response = await axios.get('/api/method/wms.api.my_api.get_packing_slip_list')
	const data = response.data.message

	pendingReceiptItems.value = data.filter(item => {
		if (item.docstatus === 0) {
			item.status = 'Draft'
			return true
		}
		return false
	})

	completedReceiptItems.value = data.filter(item => {
		if (item.docstatus === 1) {
			item.status = 'Submitted'
			return true
		}
		return false
	})


}

fetchDataII()

const displayedItems = computed(() => {
	if (activeTab.value === 'Pending Packing') {
		return pendingReceiptItems.value
	} else if (activeTab.value === 'Completed Packing') {
		return completedReceiptItems.value
	}
	return []
})

const router = useRouter();


// const handleDivClick = (link) => {
//     if (link.status === 'Draft') {
//         router.push('/FormView' ); 
//     }
// };




const redirectToForm = (link) => {
  router.push({ name: 'NewPacking', query: { linkName: link.name } });
//   window.location.reload()

  
};






</script>

<style>

#btnDiv{
	display: flex;
	justify-content: space-around;

}
#btnDiv > button{
	width:45%;
	font-size:16px;
	font-weight: bold;

}
#btnDiv > :nth-child(1){
	background-color: black;
	color: white;
	height: 40px;
	box-sizing: border-box;
	border-radius: 10px;
}
#btnDiv > :nth-child(2){
	background-color: white;
	color: black;
	height: 40px;
	box-sizing: border-box;
	border-radius: 10px;
}
#fontChange{
    font-size: 11px;
}
#circlei{
	border: 1px solid rgb(207, 200, 200);
	border-radius: 30px;
	width: auto;
	text-align: center;
	height: auto;
	font-size: 11px;
	padding: 2% 2% 2% 2%;
}
</style>