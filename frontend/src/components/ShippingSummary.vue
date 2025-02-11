<template>
    <div class="flex  w-full  border-none">
		<!-- {{ netTotalBill.data }} -->
		<h2 class="text-lg font-medium text-gray-900">
			Shipping Summary
		</h2>
	</div>
	<div id="purchaseDate" class="text-base leading-6 bg-white rounded w-full py-6 px-4 border-none">
		
		
		<!-- <h2 class="text-lg font-bold text-gray-900">
			Hey, {{ employee?.data?.first_name }} 👋
		</h2> -->
		<!-- <div class="font-medium text-sm text-gray-500 mt-1.5" v-if="lastLog">
			Last {{ lastLogType }} was at {{ lastLogTime }}
		</div> -->
		<!-- <Button
			class="mt-4 mb-1 drop-shadow-sm py-5 text-base"
			id="open-checkin-modal"
			@click="checkinTimestamp = dayjs().format('YYYY-MM-DD HH:mm:ss')"
		>
			<template #prefix>
				<FeatherIcon
					:name="
						nextAction.action === 'IN'
							? 'arrow-right-circle'
							: 'arrow-left-circle'
					"
					class="w-4"
				/>
			</template>
			{{ nextAction.label }}
		</Button> -->

		<div class='innerDiv'>
			<!-- {{ invoicesII.data }} -->
			<!-- {{ invoicesT.data }} -->
     <div class="textDiv">
		
		<p>Pending SOs</p>
		<h3 class="font-bold">{{ itemCount }} </h3>
	 </div>
	 <div class="textDiv">
 
		<p>Today's Delivery</p>
		<h3 class="font-bold">{{ itemCountII }} </h3>

	 </div>

		</div >



		<div class='innerDiv'>

			<div class="textDiv">
				<p>Annual Delivery 				
				</p>
		<h3 class="font-bold"><h3 class="font-bold">${{ totalNetTotal !== undefined ? totalNetTotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0.00' }}</h3>
	</h3>
			</div>
			<div class="textDiv">
				<p>to Invoice</p>
		<h3 class="font-bold">{{ toBillCount}} </h3>
			</div>
		</div >
		
	</div>

	<ion-modal
		ref="modal"
		trigger="open-checkin-modal"
		:initial-breakpoint="1"
		:breakpoints="[0, 1]"
	>
		<div
			class="h-40 w-full flex flex-col items-center justify-center gap-5 p-4 mb-5"
		>
			<div class="flex flex-col gap-1.5 items-center justify-center">
				<div class="font-bold text-xl">
					{{ dayjs(checkinTimestamp).format("hh:mm:ss a") }}
				</div>
				<div class="font-medium text-gray-500 text-sm">
					{{ dayjs().format("D MMM, YYYY") }}
				</div>
			</div>
			<Button
				variant="solid"
				class="w-full py-5 text-sm"
				@click="submitLog(nextAction.action)"
			>
				Confirm {{ nextAction.label }}
			</Button>
		</div>
	</ion-modal>
</template>

<script setup>
import { createListResource, toast, FeatherIcon, createResource } from "frappe-ui"
import { computed, inject, ref, onMounted, onBeforeUnmount , watch} from "vue"
import { IonModal, modalController } from "@ionic/vue"







  const user = createResource({
  url: 'frappe.auth.get_logged_user',
})
const invoices = createListResource({
  doctype: 'Purchase Order',
  fields: ['*'],
  filters: {
    owner: user.data,
    status: 'To Receive and Bill',
    docstatus: 1,
  },
  auto: true,
  
 
})
const itemCount = computed(() => invoices.data ? invoices.data.length : 0);


const invoicesT = createListResource({
  doctype: 'Purchase Order',
  fields: ['*'],
  filters: {
    // status: ['To Receive and Bill', 'To Bill'],
    docstatus: 1,
  },
  auto: true,
});

const itemCountII = computed(() => {
  if (invoicesT.data) {
    return invoicesT.data.filter(item => 
      item.status === 'To Receive and Bill' || item.status === 'To Bill'
    ).length;
  } else {
    return 0;
  }
});









const invoicesBill = createListResource({
  doctype: 'Purchase Order',
  fields: ['*'],
  filters: {
    owner: user.data,
    status: 'To Bill',
    docstatus: 1,
  },
  auto: true,
  
 
})
const toBillCount = computed(() => invoicesBill.data ? invoicesBill.data.length : 0)

const invoicesII = createListResource({
  doctype: 'Purchase Order',
  fields: [ '*'],
//   filters: {
//     owner: user.data,
//     status: 'To Receive and Bill',
//     docstatus: 1,
//   },
  auto: true,
  
 
})

const totalNetTotal = computed(() => {
	if(invoicesII.data){
    return invoicesII.data.reduce((total, link) => {
        return total + parseFloat(link.net_total || 0);
    }, 0);
}
});

</script>


<style>
.innerDiv{
	height: 60px;
	width: 100%;
	display:flex;
	
}

#purchaseDate{
	display: flex;
	flex-wrap: wrap;
	
}
.textDiv{
width:50%;
height:100%;
}
</style>