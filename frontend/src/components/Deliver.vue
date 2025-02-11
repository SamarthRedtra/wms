<template>
	<BaseLayout pageTitle="Deliver">
		<template #body>
			<div class="flex flex-col items-center my-7 p-4 gap-7">
				<!-- <CheckInPanel /> -->
				
                <ShippingSummary />

                <div class="w-full">
					<router-link
						:to="{ name: 'NewDelivery' }"
						v-slot="{ navigate }"
					>
						<Button
							@click="navigate"
							variant="solid"
							class="w-full py-5 text-base font-bold"
						>
							New Delivery Note
						</Button>
					</router-link>
				</div>

				<QuickLinks :items="quickLinks" title="Quick Links" />

<!-- {{ invoices.data.length }} -->
 
				


				<!-- <RequestPanel/> -->

				
				<div class="w-full">
					<TabButtons
					  :buttons="[{ label: 'Pending Deliveries' }, { label: 'Completed Deliveries' }]"
					  v-model="activeTab"
					
					  @tab-clicked="handleTabClicked"
			  
			  
					/>
					<RequestList v-if="activeTab === 'Pending Deliveries'" :items="myRequests" />
					<RequestList
					  v-else-if="activeTab === 'Completed Deliveries'"
					  :items="teamRequests"
					  :teamRequests="true"
					/>
				  </div>










				<div class="flex flex-col gap-5 my-4 w-full">
					<!-- <div class="text-lg font-medium text-gray-900">QuickLinks</div> -->
					<div class="flex flex-col bg-white rounded ">
						<div id="basedOnActiveTabs"
							class="flex flex-row flex-start p-4 items-center justify-between border-b"
							v-for="link in getFilteredInvoices"
							:key="link.id"
							:class="{ 'clickable-div': link.status === 'Draft' }"
							@click="handleDivClick(link)"
							
						>
							<div class="flex flex-row items-center gap-3 grow">
								<!-- <component :is="link.icon" class="h-5 w-5 text-gray-500" /> -->
								<FeatherIcon name="shopping-cart" class="h-5 w-5 text-gray-500" />
								<div class="text-xs font-normal text-gray-800 leading-6">
									<p>{{ link.name }}</p>
									
									<p >{{ link.posting_date }}|20% Received</p>
								</div>
								<div id="circle">{{ link.status }}
									
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

import ShippingSummary from "@/components/ShippingSummary.vue"
import BottomTabs from "@/components/BottomTabs.vue"

import QuickLinks from "@/components/QuickLinks.vue"
import BaseLayout from "@/components/BaseLayout.vue"
import RequestPanel from "@/components/RequestPanel.vue"
import LeaveIcon from "@/components/icons/LeaveIcon.vue"
import ExpenseIcon from "@/components/icons/ExpenseIcon.vue"
import EmployeeAdvanceIcon from "@/components/icons/EmployeeAdvanceIcon.vue"
import SalaryIcon from "@/components/icons/SalaryIcon.vue"
import { FeatherIcon, createListResource } from "frappe-ui"
import TabButtons from "@/components/TabButtons.vue";
  import RequestList from "@/components/RequestList.vue";
  
  import { myLeaves, teamLeaves } from "@/data/leaves";
  import { myClaims, teamClaims } from "@/data/claims";
  
  import LeaveRequestItem from "@/components/LeaveRequestItem.vue";
  import ExpenseClaimItem from "@/components/ExpenseClaimItem.vue";
  
  import { useListUpdate } from "@/composables/realtime";
import axios from "axios"





  const activeTab = ref("Pending Deliveries"); // Set default active tab



  
onMounted(() => {
  console.log("RequestPanel.vue is mounted");
});

const handleTabClicked = (tabValue) => {
  activeTab.value = tabValue;
  emit("tab-clicked", tabValue);
};

  
  const socket = inject("$socket");
  const employee = inject("$employee");
  
  const myRequests = computed(() => {
	const requests = [...(myLeaves.data || []), ...(myClaims.data || [])];
  
	return requests.map((item) => {
	  if (item.doctype === "Leave Application")
		item.component = markRaw(LeaveRequestItem);
	  else if (item.doctype === "Expense Claim")
		item.component = markRaw(ExpenseClaimItem);
  
	  return item;
	});
  });
  
  const teamRequests = computed(() => {
	const requests = [...(teamLeaves.data || []), ...(teamClaims.data || [])];
  
	return requests.map((item) => {
	  if (item.doctype === "Leave Application")
		item.component = markRaw(LeaveRequestItem);
	  else if (item.doctype === "Expense Claim")
		item.component = markRaw(ExpenseClaimItem);
  
	  return item;
	});
  });
  
  onMounted(() => {
	useListUpdate(socket, "Leave Application", () => teamLeaves.reload());
	useListUpdate(socket, "Expense Claim", () => teamClaims.reload());
  });


  



  







const updateActiveTab = (tabValue) => {
  activeTab.value = tabValue;
  console.log("Received tabValue:", tabValue);
};

























 const quickLinks = [
	// {
	// 	icon: markRaw(LeaveIcon),
	// 	title: "Request Leave",
	// 	route: "LeaveApplicationFormView",
	// },
	// {
	// 	icon: markRaw(ExpenseIcon),
	// 	title: "Claim an Expense",
	// 	route: "ExpenseClaimFormView",
	// },
	// {
	// 	icon: markRaw(EmployeeAdvanceIcon),
	// 	title: "Request an Advance",
	// 	route: "EmployeeAdvanceFormView",
	// },
	// {
	// 	icon: markRaw(SalaryIcon),
	// 	title: "View Salary Slips",
	// 	route: "SalarySlipsDashboard",
	// },
    {
		//icon: markRaw(LeaveIcon),
		title: "Print Delivery Labels",
		route: "LeaveApplicationFormView",
	},
	{
		//icon: markRaw(ExpenseIcon),
		title: "Pending Delivery Pick lists",
		route: "QualityInspection",
	},
	{
		//icon: markRaw(EmployeeAdvanceIcon),
		title: "Pending Delivery Packing Slips",
		route: "StockEntryList",
	},
	// {
	// 	icon: markRaw(SalaryIcon),
	// 	title: "View Salary Slips",
	// 	route: "SalarySlipsDashboard",
	// },
]



const quickLinksCart = [
	// {
	// 	icon: markRaw(LeaveIcon),
	// 	title: "Request Leave",
	// 	route: "LeaveApplicationFormView",
	// },
	// {
	// 	icon: markRaw(ExpenseIcon),
	// 	title: "Claim an Expense",
	// 	route: "ExpenseClaimFormView",
	// },
	// {
	// 	icon: markRaw(EmployeeAdvanceIcon),
	// 	title: "Request an Advance",
	// 	route: "EmployeeAdvanceFormView",
	// },
	// {
	// 	icon: markRaw(SalaryIcon),
	// 	title: "View Salary Slips",
	// 	route: "SalarySlipsDashboard",
	// },
    {
		//icon: markRaw(LeaveIcon),
		title: "Print Stock Labels",
		route: "LeaveApplicationFormView",
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
	// {
	// 	icon: markRaw(SalaryIcon),
	// 	title: "View Salary Slips",
	// 	route: "SalarySlipsDashboard",
	// },
]










let purchaseReceiptData = ref([])

const fetchData = async () => {

	try{

		const response = await axios.get('/api/method/wms.api.my_api.get_purchase_receipt', {

})

purchaseReceiptData.value = response.data.message;
console.log('data', purchaseReceiptData.value)

	}
	catch{
		console.log('error while fetching data',error.response)
	}
}


fetchData()










const getFilteredInvoices = computed(() => {
  const data = purchaseReceiptData.value || [];

  console.log('activeTab', activeTab.value)
  if (activeTab.value === 'Pending Deliveries') {
    return data.filter((item) => item.status === 'Draft');
  } else if (activeTab.value === 'Completed Deliveries') {
    return data.filter(
      (item) => item.status === 'To Bill'
    );
  } else {
    return data;
  }
});
const router = useRouter();


const handleDivClick = (link) => {
    if (link.status === 'Draft') {
        router.push('/FormView' ); 
    }
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
</style>