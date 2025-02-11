<template>
	<BaseLayout :pageTitle="pageTitle" :home="'shopping-cart'" @cartIconClick="handleCartIconClick"   class="text-xs">
		<template #body>
			<div  class="flex flex-col items-center">
				<!-- <CheckInPanel /> -->
                <!-- <PurchaceSummary /> -->
				<!-- {{ warehouseOptions }} -->
		
				
<!-- {{ invoices.data }} -->
				<div @click="handleClick"  id="purchaseDateII" class="text-base leading-6  rounded w-full py-6 px-4 border-none">
		    
					<label>Sales Order Number</label>







					<div class="custom-select-wrapper">
						<div class="custom-select" @click="toggleOptions">
						  <div class="custom-input-wrapper">
						   <div class="custom-input" >
							 {{ selectedPurchaseOrder }}
							
							<FeatherIcon name="chevron-down" class="h-6 w-6 text-black-500 cursor-pointer ml-auto"/>


						   </div>
						  </div>
						  <div class="custom-options">
							<div class="custom-input-wrapper">
							  <input type="text" placeholder="Type here..." @click.stop @input="filterOptions($event.target.value)" v-model="selectedPurchaseOrder"  id="searchPurchaseOrder">
							</div>
							<div v-if="!searchInput || filteredInvoices.length > 0" v-for="link in filteredInvoices" :key="link.title" :value="link.name" class="custom-option" @click="() => selectOption(link.name)">
								<p>{{ link.name }}</p>
								<p id="extra-data">{{ link.supplier }}, <span>{{ link.company }}</span></p>
							  </div>
							  <div v-else>
								<div v-for="link in invoices.data" :key="link.title" :value="link.name" class="custom-option">
								  <p>{{ link.name }}</p>
								  <p id="extra-data">{{ link.supplier }}, <span>{{ link.company }}</span></p>
								</div>
							</div>
							
							<!-- <div class="custom-option" @click="selectOption(this)">Option 2</div>
							<div class="custom-option" @click="selectOption(this)">Option 3</div>
							<div class="custom-option" @click="selectOption(this)">Option 4</div> -->
						  </div>
						</div>
					  </div>











					
<!-- <select   id="demo" >
<input placeholder="Search item name here" list="searchData" v-model="selectedPurchaseOrder"/>
	
	<option v-for="link in invoices.data" :key="link.title" :value="link.name"  >{{ link.name }}</option>

	
</select> -->
<!-- 
<div  >
	<datalist id="searchData">
		
		<option></option>
		
		</datalist>

</div> -->


		         
					
					
				</div>
				<!-- <QuickLinks :items="quickLinks" title="Quick Links" /> -->

				<div id="addSummary" class="text-base leading-6  rounded w-full py-6 px-4 border-none">
                  <p>Picked Items</p>
				  <FeatherIcon name="plus" class="h-6 w-6 text-black-500 cursor-pointer"  @click="toggleAddForm"/>

				</div>




				<div class="flex flex-col gap-5 my-4 w-full">
					<!-- <div class="text-lg font-medium text-gray-900">QuickLinks</div> -->
					<div class="flex flex-col bg-white rounded ">
						<div id="basedOnActiveTabs"
							class="flex flex-row flex-start p-4 items-center justify-between border-b"
							v-for="(item, index) in summaryItems" :key="index"
							
						>
							<div class="flex flex-row items-center gap-3 grow">
								<!-- <component :is="link.icon" class="h-5 w-5 text-gray-500" /> -->
								<FeatherIcon name="shopping-cart" class="h-5 w-5 text-gray-500" />
								<div class="text-xs font-normal text-gray-800 leading-6">
									<p>{{ item.purchaseOrder }}</p>
									
									<p >{{ item.itemCode }} | {{ item.warehouse }}</p>
								</div>
								<div id="circleii">
									{{ item.quantity }}
								</div>
							</div>
							<FeatherIcon name="chevron-right" class="h-5 w-5 text-gray-500" />
						</div>
					</div>
				</div>

				
			  

				<div v-if="showAddForm" class="add-form"  >
					<!-- Add your input fields and form elements here -->
					<div @click="handleClick"  id="space">
					<div @click="handleClick" id="scrollerLine"> </div></div>
					<br>
					
					<label for="itemName">Item</label>
					<div class="barcode-input">
						<input v-model="selectedItemCode" placeholder="Search item name here" list="searchName" id="nameField"/>
						<datalist id="searchName">
							<!-- <input placeholder="Search item name here" /> -->
							<!-- <option></option> -->
							<option v-for="link in itemsData" :key="link.title" :value="link.name">{{ link.item_code }}</option>
							<!-- <option value="">order2</option>
							<option value="">order3</option> -->
							</datalist>						<span class="barcode-scanner" @click="openBarcodeScannerPopup">
						  <FeatherIcon name="maximize" class="h-6 w-6 text-black-500" />
						</span>
					  </div>

					<br >

				<label for="itemName">Warehouse</label>
<div class="barcode-input">
	<input   placeholder="Search item by warehouse" list="searchWarehouse" id="wareHouseName" v-model="selectedWarehouse"/>
	<datalist id="searchWarehouse">
		<option v-for="whName in warehouseOptions" :key="whName" :value="whName" >
			{{ whName }}
		  </option>
		
		</datalist>		

						<span class="barcode-scanner" @click="openBarcodeScannerPopup">
						  <FeatherIcon name="maximize" class="h-6 w-6 text-black-500" />
						</span>
					  </div>
					<br>
					<label for="itemName">Quantity</label>

					<!-- <input v-model="selectedQuantity" type="number" id="quantity" :value="`${selectedQuantity} (${remainingQuantity})`" /> -->

					<input v-model="selectedQuantity"  type="number" id="quantity" placeholder="change quantity" />
						
					<!-- Add more input fields as needed -->
				<br>
					<button id="addNew"   @click="submitAndAddNew">Submit and Add New</button>
					<br>
					<button id="sub" @click='submit' >Submit </button>

				  </div>
				

				  <div v-if="barcodeScannerOpen" class="barcode-scanner-container" @click="closeBarcodeScannerPopup">
					<!-- <div class="blurred-background"></div> -->
					<div id="barcodeScanner"></div>
				  </div>

				<!-- <div class="w-full">
					<router-link
						:to="{ name: 'ExpenseClaimFormView' }"
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
				</div> -->


				<!-- <RequestPanel /> -->





				 <div class="flex flex-col gap-5 my-4 w-full">
					<!-- <div class="text-lg font-medium text-gray-900">QuickLinks</div> -->
					<div class="flex flex-col bg-white rounded ">
						<div
							class="flex flex-row flex-start p-4 items-center justify-between border-b"
							v-for="link in submittedData"
							:key="link.title"
							
						>
							<div class="flex flex-row items-center gap-3 grow">
								<component :is="link.icon" class="h-5 w-5 text-gray-500" />
								<FeatherIcon name="shopping-cart" class="h-5 w-5 text-gray-500" />
								<div class="text-sm font-normal text-gray-800 leading-6">
									<p>{{ link.purchaseOrder }}</p>
									
									<p >{{ link.itemCode }}| {{ link.warehouse }}</p>
								</div>
								<div id="circleii">{{ link.uom }}
									
								</div>
							</div>
							<FeatherIcon name="chevron-right" class="h-5 w-5 text-gray-500" />
						</div>
					</div>
				</div> 

				<div id="btnDiv" class="text-base leading-6  rounded w-full py-6 px-4 border-none">
                <button id="submitPurchaseReceipt" @click="submitPurchaseReceipt">Submit</button>
				<button id="savePurchaseReceipt"  @click="savePurchaseReceipt">Save</button>
				</div>
			</div>


	
			<!-- <BottomTabs :tabItems="simplifiedTabItems" /> -->


		<ion-tab-bar
		slot="bottom"
		class="bg-white shadow-md sm:w-96 py-2 standalone:pb-safe-bottom"
	>
		<ion-tab-button
			v-for="item in tabItems"
			:key="item.title"
			:tab="item.title"
			:href="item.route"
			:class="[
				'bg-white text-xs space-y-1.5 !hover:border-gray-300 !hover:text-gray-700 transition active:scale-95',
				route.path === item.route
					? 'border-gray-900 text-gray-800 font-semibold'
					: 'text-gray-600 font-normal',
			]"
		>
			<component :is="item.icon" class="h-5 w-5" />
			<div>{{ item.title }}</div>
		</ion-tab-button>
	</ion-tab-bar>

		</template>

	</BaseLayout>



</template>

<script setup>
import { markRaw,ref, onUnmounted, watch,computed } from "vue"

import PurchaceSummary from "@/components/PurchaceSummary.vue"
import BottomTabs from "@/components/BottomTabs.vue"

import QuickLinks from "@/components/QuickLinks.vue"
import BaseLayout from "@/components/BaseLayout.vue"
import RequestPanel from "@/components/RequestPanel.vue"
// import LeaveIcon from "@/components/icons/LeaveIcon.vue"
import ExpenseIcon from "@/components/icons/ExpenseIcon.vue"
import EmployeeAdvanceIcon from "@/components/icons/EmployeeAdvanceIcon.vue"
import SalaryIcon from "@/components/icons/SalaryIcon.vue"
import { FeatherIcon, createListResource } from "frappe-ui"
import Quagga from "quagga";
import HomeIcon from "@/components/icons/HomeIcon.vue"
// import LeaveIcon from "@/components/icons/LeaveIcon.vue"
import StockIcon from "@/components/icons/StockIcon.vue"
import { useRoute } from "vue-router"
import { IonTabBar, IonTabButton, IonLabel } from "@ionic/vue"
import qulity from "@/components/icons/qulity.vue"
import newdashbord from '@/components/icons/newdashbord.vue'
import axios from "axios"







// ... your other setup code ...

const route = useRoute()



const tabItems = [
	// {
	// 	icon: HomeIcon,
	// 	title: "Home",
	// 	route: "/home",
	// },
	// {
	// 	icon: LeaveIcon,
	// 	title: "Leaves",
	// 	route: "/dashboard/leaves",
	// },
	{
		icon: qulity,
		title: "Request QC",
		route: "/ReceivePage",
	},
	// {
	// 	icon: StockIcon,
	// 	title: "Stock Move",
	// 	route: "/FormView",
	// },
	{
		icon: newdashbord,
		title: "Print Labels",
		route: "/dashboard/expense-claims",
	},
	// {
	// 	icon: SalaryIcon,
	// 	title: "Salary",
	// 	route: "/dashboard/salary-slips",
	// },
]







const showOption = ref(false);
const showAddForm = ref(false);
const itemName = ref('');
const barcodeScannerOpen = ref(false);

const handleClick = async () => {
	// Close the add-form div
	showAddForm.value = false;


}

const openBarcodeScannerPopup = async () => {
  // Close the add-form div
  showAddForm.value = false;

  // Set the barcodeScannerOpen to true
  barcodeScannerOpen.value = true;

  // Load Quagga dynamically
  try {
    await loadQuagga();
    initializeQuagga();
  } catch (error) {
    console.error('Error loading Quagga:', error);
  }
};

const loadQuagga = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/quagga@0.12.1/dist/quagga.min.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const initializeQuagga = () => {
  // Initialize QuaggaJS
  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector("#barcodeScanner"),
    },
    decoder: {
      readers: ["ean_reader"],
    },
  }, function(err) {
    if (err) {
      console.error(err);
      return;
    }
    Quagga.start();
  });
};

const closeBarcodeScannerPopup = () => {
  // Close the barcode scanner
  barcodeScannerOpen.value = false;

  // Stop QuaggaJS when the component is unmounted
  if (Quagga && Quagga.stop) {
    Quagga.stop();
  }
};

const submitForm = () => {
  // Handle form submission logic here
//   console.log('Form submitted:', { itemName: itemName.value });
//   saveForm(false);
  saveFormSubmit(true)

  // Close the form after submission
  toggleAddForm();
};

const toggleAddForm = () => {
  showAddForm.value = !showAddForm.value;
};

const showOptions = () => {
showOption.value = true;
}

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
		title: "Print Stock Labels",
		route: "LeaveApplicationFormView",
	},
	{
		//icon: markRaw(ExpenseIcon),
		title: "Quality Inspection List",
		route: "ExpenseClaimFormView",
	},
	{
		//icon: markRaw(EmployeeAdvanceIcon),
		title: "Stock Entry List",
		route: "EmployeeAdvanceFormView",
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
		route: "ExpenseClaimFormView",
	},
	{
		//icon: markRaw(EmployeeAdvanceIcon),
		title: "Stock Entry List",
		route: "EmployeeAdvanceFormView",
	},
	// {
	// 	icon: markRaw(SalaryIcon),
	// 	title: "View Salary Slips",
	// 	route: "SalarySlipsDashboard",
	// },
]



// const props = defineProps({
// 	title: {
// 		type: String,
// 		required: false,
// 		default: "Quick Links",
// 	},
// 	items: {
// 		type: Array,
// 		required: true,
// 	},
// })



const handleCartIconClick = () => {
    // Handle the cart icon click event
    // Navigate to the "ReceivePage" route
    router.push({ name: 'ReceivePage' });
}

const invoices = createListResource({
  doctype: 'Purchase Order',
  fields: ['*'], 
  auto: true,
});

const warehouse = createListResource({
  doctype: 'Warehouse',
  fields: ['*'], 
  auto: true,
});


const warehouseOptions = ref([]);

watch(
  () => warehouse.data,
  (newWarehouseData) => {
    if (newWarehouseData && Array.isArray(newWarehouseData)) {
      const filteredWarehouses = newWarehouseData.filter(
        (wh) => wh.is_group === 0
      );
      warehouseOptions.value = filteredWarehouses.map((wh) => wh.name);
    }
  }
);


const selectedItemCode = ref('');
const selectedWarehouse = ref('');
const selectedQuantity = ref('');


const selectedPurchaseOrder = ref('');
const selectedUOM = ref('')

const itemsData = ref([]);

const purchaseOrderData = ref([])

const remainingQuantityMap = ref({});


watch(selectedPurchaseOrder, async (newVal) => {
    if (newVal) {
        await fetchItemData(newVal);
    }
});

// Fetch item data based on selected purchase order
const fetchItemData = async (purchaseOrderName) => {
    try {
        const response = await axios.get("/api/method/wms.api.my_api.list_of_items", {
            params: {
                po_name: purchaseOrderName
            }
        });
        if (response.data && response.data.message) {
            itemsData.value = response.data.message;

            // Update remaining quantity map
            remainingQuantityMap.value = {};
            itemsData.value.forEach(item => {
                remainingQuantityMap.value[item.item_code] = item.quantity;
            });
        } else {
            console.error("Invalid response data:", response.data);
        }
    } catch (error) {
        console.error("Error fetching item data:", error);
        // Handle error (e.g., display error message to user)
    }
};



const fetchPurchaseOrder = async () => {
	try{
      const result = await axios.get('/api/method/wms.api.my_api.list_of_purchase', {

	  })
	  purchaseOrderData.value =  result.data.message
	  console.log('data', purchaseOrderData.value)
	}
	

	catch{
console.log('error::::', error.result)
	}
}

fetchPurchaseOrder();





watch(selectedItemCode, (newVal) => {
    const selectedItem = itemsData.value.find(item => item.item_code === newVal);
    selectedWarehouse.value = selectedItem ? selectedItem.warehouse : '';
	selectedQuantity.value = selectedItem ? selectedItem.quantity : '';
	selectedUOM.value = selectedItem ? selectedItem.uom : ''; 
   
    selectedQuantity.value = remainingQuantityMap.value[newVal];


	if (remainingQuantityMap.value[newVal] === 0) {
        selectedItemCode.value = '';
    }
});









const summaryItems = ref([]);

const addToSummary = () => {
    const remainingQty = remainingQuantityMap.value[selectedItemCode.value];
    if (remainingQty > 0 && selectedQuantity.value <= remainingQty) {
        const itemCode = selectedItemCode.value;
        const quantity = selectedQuantity.value;
        const warehouse = selectedWarehouse.value;
        const uom = selectedUOM.value;
        summaryItems.value.push({ itemCode, quantity, warehouse, uom });
        remainingQuantityMap.value[itemCode] -= quantity;
		console.log('qtyyyy',remainingQuantityMap.value[itemCode]  )

		if (remainingQuantityMap.value[itemCode] === 0) {
            selectedItemCode.value = '';
        }

        clearInputFields();
    } else {
        console.log('Invalid quantity or no remaining quantity. Cannot add more items.');
    }
};

  
  const submitAndAddNew = () => {
	if(validateQuantity()){
    addToSummary(); 
	clearInputFields()
	} else {
		alert('Invalid quantity entered.');
	}
  };
  const submit = () => {
	if(validateQuantity()){
    addToSummary(); 
	 clearInputFields();
	 toggleAddForm();
	} else {
		alert('Invalid quantity entered')
	}
	
	
  };

  const clearInputFields = () => {
    selectedItemCode.value = '';
    selectedQuantity.value = '';
	selectedWarehouse.value = '';
	selectedUOM.value = '';
  };






















const filteredInvoices = ref([]);

 
  filteredInvoices.value = purchaseOrderData.value;

  const filterOptions = (inputValue) => {
    
    const input = inputValue.trim().toLowerCase();

    if (!input) {
      
      filteredInvoices.value = purchaseOrderData.value;
      return;
    }

   
    filteredInvoices.value = purchaseOrderData.value.filter(link =>
      link.name.toLowerCase().includes(input) ||
      link.supplier.toLowerCase().includes(input) ||
      link.company.toLowerCase().includes(input)
    );
  };





function toggleOptions() {
    const options = document.querySelector('.custom-options');
    options.classList.toggle('active');
  }

//   function selectOption(option) {
//     const selectedValue = option.textContent;
//     const inputField = document.querySelector('.custom-input');
//     inputField.value = selectedValue;
//     // toggleOptions();
//   }
const selectedOption = ref('')

const selectOption = (selectedValue) => {
    selectedPurchaseOrder.value = selectedValue;
	console.log('selectedValue', selectedOption.value)
};






const validateQuantity = () => {
    const existingItem = itemsData.value.find(item => item.item_code === selectedItemCode.value);
    const existingQuantity = existingItem ? parseInt(existingItem.quantity) : 0;
    const enteredQuantity = parseInt(selectedQuantity.value);

    return enteredQuantity > 0 && enteredQuantity <= existingQuantity;
};





















//  Post data
let pageTitle = ref("New");
// let pageTitle = route.params.receiptName || 'New'; 


let receiptCreated = false;

const savePurchaseReceipt = async () => {
    try {
        if (receiptCreated) {
            throw new Error('Purchase receipt has already been created for this data');
			
        }

        const purchaseOrderName = selectedPurchaseOrder.value;

        if (!purchaseOrderName) {
            console.error('Purchase order name is undefined');
            return;
        }

		const requestData = {
            name: purchaseOrderName,
            items: summaryItems.value.map(item => ({
                
                warehouse: item.warehouse,
                item_code: item.itemCode,
                qty: parseInt(item.quantity),
				uom: item.uom
            })),
        };

        console.log('Request Data:', requestData);

        const response = await axios.post('/api/method/wms.api.my_api.create_purchase_receipt', requestData);

        alert('Purchase receipt created:', response.data.message);
        
        receiptCreated = true;
        pageTitle.value = response.data.message;
    } catch (error) {
        console.error('Error creating purchase receipt:', error.response);
        
    }
};



const submitPurchaseReceipt = async () => {
    try {
		if (receiptCreated) {
            throw new Error('Purchase receipt has already been created for this data');
			
        }
        const purchaseOrderName = selectedPurchaseOrder.value;

        if (!purchaseOrderName) {
            console.error('Purchase order name is undefined');
            return;
        }

        const requestData = {
            name: purchaseOrderName,
            items: summaryItems.value.map(item => ({
                
                warehouse: item.warehouse,
                item_code: item.itemCode,
                qty: parseInt(item.quantity),
				uom: item.uom
            })),
        };

        console.log('Request Data:', requestData);

        const response = await axios.post('/api/method/wms.api.my_api.submit_and_create_purchase_receipt', requestData);

        console.log('Purchase receipt created:', response.data);
		receiptCreated = true;
		
            pageTitle.value = response.data.message;
        
      
    } catch (error) {
        console.error('Error creating purchase receipt:', error.response);
      
    }
};


</script>

<style>


ion-tab-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 900; /* Adjust the z-index based on your layout */
    background-color: white; /* Set the background color if needed */
    border-top: 1px solid #ccc; /* Add a border if needed */
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1); /* Add a shadow if needed */
  }

  /* Adjust the body padding to account for the fixed ion-tab-bar */
  body {
    padding-bottom: 50px; 
	/* Adjust the value based on the ion-tab-bar height */
  }


/* Hide the dropdown arrow in the input field */
#nameField::-webkit-calendar-picker-indicator,
#nameField::-webkit-datetime-edit-fields-wrapper,
#nameField::-webkit-inner-spin-button {
  display: none !important;
}

#nameField::-webkit-clear-button {
  -webkit-appearance: none;
  display: none !important;
}

#nameField {
  /* Optional: Adjust padding to ensure the input text is not covered by the hidden arrow */
  padding-right: 0.5em;
}



/* Hide the dropdown arrow in the input field */
#wareHouseName::-webkit-calendar-picker-indicator,
#wareHouseName::-webkit-datetime-edit-fields-wrapper,
#wareHouseName::-webkit-inner-spin-button {
  display: none !important;
}

#wareHouseName::-webkit-clear-button {
  -webkit-appearance: none;
  display: none !important;
}

#wareHouseName {
  /* Optional: Adjust padding to ensure the input text is not covered by the hidden arrow */
  padding-right: 0.5em;
}


#wareHouseName{
	width:100%;
	height:40px;
	
}
#quantity{
	border:none;
}

#demo{
	width:100%;
	height:40px;
	border:1px solid black;
	background-color: white;

}
#demo > input{
	width:100%;
	height:40px;
	border:1px solid black;
	background-color: white;

}
#nameField{
	width:100%;
	height:40px;
}
#scrollerLine{
	border: 2px solid gray;
	width: 50%;
    margin-left: 25%;
	height:1px;
	cursor:pointer;
	border-radius: 10px;

}




.add-form {
	position: fixed;
	bottom: 0;
	left: 0;
	width: auto;
	padding: 20px;
	background-color: white;
	box-shadow: 0px -5px 50px rgba(0, 0, 0, 0.1);
	transition: transform 0.5s ease-in-out;
	transform: translateY(0%);
	display: flex;
	flex-direction: column;
	margin-left: 3%;
	z-index: 999;
	border-radius: 10px;
	font-size: 16px;
	
  }
  
  .barcode-input {
	position: relative;
  }
  
  .barcode-scanner {
	position: absolute;
	top: 50%;
	right: 10px;
	transform: translateY(-50%);
	cursor: pointer;
  }
  
  .barcode-scanner-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2;
  }
  
  .blurred-background {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(255, 255, 255, 0.8);
	filter: blur(5px);
  }

#circleii{
	
	color: rgb(109, 106, 106);
	width: auto;
	text-align: center;
	height: auto;
	font-size: small;
	padding: 2% 2% 2% 10%;
}
#btnDiv{
	display: flex;
	justify-content: space-around;
	padding-bottom: 50%;

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

#purchaseDateII > label{
	width: 100%;
	text-align: center;
	font-size: 16px;

}
#purchaseDateII > select{
	width:100%;
}
#addSummary{
	display: flex;
	justify-content: space-between;
}

#barcodeScanner {
	width: auto;
	height: 200px;
	margin-top: 5%;
  }
  #addNew{
	background-color: black;
	color: white;
	border-radius:5px;
	font-size:16px;
	height:40px;
  }
  #sub
  {
	background-color: whitesmoke;
	color: black;
	border-radius:5px;
	font-size:16px;
	height:40px;
  }

  #space{
	height:20px;
	width:100%;
	cursor:pointer;
	

  }













  .custom-select-wrapper {
	width:100%;
    position: relative;
    display: inline-block;

  }
  .custom-select {
	width:100%;
    display: inline-block;
    cursor: pointer;
   
    border: 1px solid #ccc;
    border-radius: 5px;
    position: relative;
	background-color: white;
  }
  .custom-options {
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    width: 100%;
    z-index: 1;
    background-color: #fff;
    border: 1px solid #ccc;
    border-top: none;
    border-radius: 0 0 5px 5px;
    display: none;
	height: 250px;
	overflow-y: scroll;
  }
  .custom-options.active {
    display: block;
	height: 250px;
	overflow-y: scroll
  }
  .custom-option {
    padding: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .custom-option:hover {
    background-color: #f0f0f0;
  }
  .custom-input {
    width: 100%;
    padding: 5px;
    border: none;
    outline: none;
  }
  .custom-input-wrapper {
    border-radius: 5px;
  }






  #searchPurchaseOrder{
	border: 1px solid gray;
    width: 94%;
    border-radius: 10px;
    height: 40px;
    margin: 3% 3% 3% 3%;
  }



  .active{
 box-shadow:0px 0px 2px 0px;
  }
  #extra-data{
	font-size:12px;
	font-weight: bold;
  }
</style>