<template>
    <div class="flex  w-full  border-none">
	
		<h2 class="text-lg font-medium text-gray-900">
			Purchase Summary
		</h2>
	</div>
	<div id="purchaseDate" class="text-base leading-6 bg-white rounded w-full py-6 px-4 border-none">
		
		
		
		
	

		<div class='innerDiv'>
			<!-- {{ invoicesII.data }} -->
			<!-- {{ invoicesT.data }} -->
     <div class="textDiv">
		
		<p>POs to Receive</p>
		<h3 class="font-bold">{{ itemCount }} </h3>
	 </div>
	 <div class="textDiv">
 
		<p>Today's Receipt</p>
		<h3 class="font-bold">{{ itemCountII }} </h3>

	 </div>

		</div >



		<div class='innerDiv'>

			<div class="textDiv">
				<p>Annual Purchase  				
				</p>
		<h3 class="font-bold"><h3 class="font-bold">${{ totalNetTotal !== undefined ? totalNetTotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0.00' }}</h3>
	</h3>
			</div>
			<div class="textDiv">
				<p>Pending to Bill</p>
		<h3 class="font-bold">{{ toBillCount}} </h3>
			</div>
		</div >
		
	</div>

	
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