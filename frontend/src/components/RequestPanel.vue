<template>
	<div class="w-full">
	  <TabButtons
		:buttons="[{ label: 'Pending Receipt' }, { label: 'Completed Receipt' }]"
		v-model="activeTab"
		@tab-clicked="handleTabClicked"


	  />
	  <RequestList v-if="activeTab === 'Pending Receipt'" :items="myRequests" />
	  <RequestList
		v-else-if="activeTab === 'Completed Receipt'"
		:items="teamRequests"
		:teamRequests="true"
	  />
	</div>
  </template>
  
  <script setup>
  import { ref, inject, onMounted, computed, markRaw } from "vue";
  
  import TabButtons from "@/components/TabButtons.vue";
  import RequestList from "@/components/RequestList.vue";
  
  import { myLeaves, teamLeaves } from "@/data/leaves";
  import { myClaims, teamClaims } from "@/data/claims";
  
  import LeaveRequestItem from "@/components/LeaveRequestItem.vue";
  import ExpenseClaimItem from "@/components/ExpenseClaimItem.vue";
  
  import { useListUpdate } from "@/composables/realtime";
  


  
  const activeTab = ref("Pending Receipt"); // Set default active tab



  
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


  

  </script>
  