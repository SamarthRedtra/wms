<template>
	<BaseLayout pageTitle="Receive">
		<template #body>
			<div class="flex flex-col items-center my-7 p-4 gap-7">
				<!-- <CheckInPanel /> -->
				
                <PurchaceSummary />
				<QuickLinks :items="quickLinks" title="Quick Links" />

<!-- {{ invoices.data.length }} -->
 
				<div class="w-full">
					<router-link
						:to="{ name: 'FormView' }"
						v-slot="{ navigate }"
					>
						<Button
							@click="navigate"
							variant="solid"
							class="w-full py-5 text-base font-bold"
						>
							New Purchase Receipt
						</Button>
					</router-link>
				</div>


				<!-- <RequestPanel/> -->

				
				<div class="w-full">
					<TabButtons
					  :buttons="[{ label: 'Pending Receipt' }, { label: 'Completed Receipt' }]"
					  v-model="activeTab"
					
					  @tab-clicked="handleTabClicked"
			  
			  
					/>
					<RequestList v-if="activeTab === 'Pending Receipt'"  />
					<RequestList
					  v-else-if="activeTab === 'Completed Receipt'"
					  
					/>
				  </div>



<!-- 
				  <div class="w-full flex items-center justify-end my-4">
					<div class="relative w-full">
						<input
							v-model="searchQuery"
							placeholder="Search Purchase Receipt"
							class="p-2 border rounded-md w-full"
						/>
						<div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
							<FeatherIcon name="search" class="h-5 w-5 text-gray-500" />
						</div>
					</div>
				</div> -->






				<div id="receiptDetail" class="flex flex-col gap-5 my-4 py-5 w-full ">
					<!-- <div class="text-lg font-medium text-gray-900">QuickLinks</div> -->
					<div class="flex flex-col bg-white rounded ">
						<div id="basedOnActiveTabs"
							class="flex flex-row flex-start p-4 items-center justify-between border-b"
							v-for="link in paginatedData"
							:key="link.id"
							
							@click="handleDivClick(link)"
							
						>
							<div class="flex flex-row items-center gap-3 grow">
								<!-- <component :is="link.icon" class="h-5 w-5 text-gray-500" /> -->
								<FeatherIcon name="shopping-cart" class="h-5 w-5 text-gray-500" />
								<div class="text-xs font-normal text-gray-800 leading-6">
									<p>{{ link.name }}</p>
									
									<p >{{ link.posting_date }}</p>
								</div>
								<div id="circle">{{ link.status }}
									
								</div>
							</div>
							<FeatherIcon name="chevron-right" class="h-5 w-5 text-gray-500" />
						</div>
					</div>
				</div>

				<div class="flex justify-center gap-2">
					<button class="paginationButton" @click="prevPage" :disabled="currentPage === 1">Prev</button>
					<span > {{ currentPage }} of {{ totalPages }}</span>
					<button class="paginationButton" @click="nextPage" :disabled="currentPage === totalPages">Next</button>
				</div>
			</div>
		</template>
       
	</BaseLayout>
</template>

<script setup>
import { markRaw, ref,computed, onMounted, watch, onBeforeUnmount,watchEffect,inject } from "vue"
import { useRouter } from 'vue-router';

import PurchaceSummary from "@/components/PurchaceSummary.vue"
import BottomTabs from "@/components/BottomTabs.vue"

import QuickLinks from "@/components/QuickLinks.vue"
import BaseLayout from "@/components/BaseLayout.vue"

import { FeatherIcon, createListResource } from "frappe-ui"
import TabButtons from "@/components/TabButtons.vue";
  import RequestList from "@/components/RequestList.vue";
  
 
  

import axios from "axios"





  const activeTab = ref("Pending Receipt");



  
onMounted(() => {
  console.log("RequestPanel.vue is mounted");
});

const handleTabClicked = (tabValue) => {
  activeTab.value = tabValue;
  emit("tab-clicked", tabValue);
};

  
  



  



  







const updateActiveTab = (tabValue) => {
  activeTab.value = tabValue;
  console.log("Received tabValue:", tabValue);
};












const currentPage = ref(1);
const itemsPerPage = 6;













 const quickLinks = [
	
    {
		//icon: markRaw(LeaveIcon),
		title: "Print Stock Labels",
		route: "PrintLab",
	},
	{
		//icon: markRaw(ExpenseIcon),
		title: "Quality Inspection List",
		route: "QualityInspection",
	},
	{
		//icon: markRaw(EmployeeAdvanceIcon),
		title: "Stock Entry List",
		route: "StockEntryList",
	},
	
]













let purchaseReceiptData = ref([])

const fetchData = async () => {

	try{

		const response = await axios.get('/api/method/wms.api.my_api.get_purchase_receiptIII', {

})

purchaseReceiptData.value = response.data.message;
// console.log('dataaaaaaa', purchaseReceiptData.value)

	}
	catch{
		console.log('error while fetching data',error.response)
	}
}


fetchData()










const getFilteredInvoices = computed(() => {
  const data = purchaseReceiptData.value || [];

  console.log('activeTab', activeTab.value)
  if (activeTab.value === 'Pending Receipt') {
    return data.filter((item) => item.status === 'Draft');
  } else if (activeTab.value === 'Completed Receipt') {
    return data.filter(
      (item) => item.status === 'To Bill'
    );
  } else {
    return data;
  }
});



const paginatedData = computed(() => {
	const start = (currentPage.value - 1) * itemsPerPage;
	const end = start + itemsPerPage;
	return getFilteredInvoices.value.slice(start, end).sort((a, b) => b.name.localeCompare(a.name));

});

const totalPages = computed(() => {
	return Math.ceil(getFilteredInvoices.value.length / itemsPerPage);
});

const nextPage = () => {
	if (currentPage.value < totalPages.value) {
		currentPage.value++;
	}
};

const prevPage = () => {
	if (currentPage.value > 1) {
		currentPage.value--;
	}
};








const router = useRouter();


// const handleDivClick = (link) => {
//     if (link.status === 'Draft') {
//         router.push('/FormView' ); 
//     }
// };




const handleDivClick = (link) => {
  router.push({ name: 'FormView', query: { linkName: link.name } });
//   window.location.reload()

  
};





</script>






<style>

.clickable-div {
    cursor: pointer;
}


#circle{
	border: 1px solid rgb(207, 200, 200);
	border-radius: 30px;
	width: auto;
	text-align: center;
	height: auto;
	font-size: small;
	padding: 2% 2% 2% 2%;
}

#basedOnActiveTabs{
	cursor: pointer;
}

.paginationButton{
	font-size: 12px;
	width: 60px;
	height: 30px;
	background-color: rgb(240, 233, 233);
	border-radius: 10px;
	box-shadow: 0px 0px 3px 0px;
}
#receiptDetail{
	margin-top: -10%;
}

</style>