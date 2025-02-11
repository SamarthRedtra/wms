<template>
	<BaseLayout :pageTitle="pageTitle" :home="'codesandbox'" @cartIconClick="handleCartIconClick"   class="text-xs">
		<template #body>
			<div  class="flex flex-col items-center">
 <div @click="handleClick" id="containerIII" class=" text-base leading-6  rounded w-full py-1 px-4 border-none mt-5">

<p>Select Delivery Note</p>
<!-- <select  v-model="selectedDeliveryNote" >
    <option :value="selectedDeliveryNote"></option>
   


</select> -->
<!-- <input v-model="selectedDeliveryNote" /> -->





  <div id="scanInput" class="relative" >
    <input
      @input="handleInputChange"
      @keyup.enter="handleEnterPress"
      v-model="selectedDeliveryNote"
      id="scanReceiptInput"
      placeholder="Type Item and press enter"
      @click="toggleItemDropdown"
    />
    <!-- <span class="barcode-scanner" id="QRcodescanner" @click="openCustomerForm">

      <FeatherIcon name="plus" class="absolute top-1/2 right-0 transform -translate-y-1/2 text-black-400 h-6 w-6 cursor-pointer"    /> </span> -->
    <div v-if="showItemDropdown" class="item-dropdown" >
      <div v-for="(item, index) in paginatedItems" :key="item.name" class="item" @click="selectItem(item)">
        <p >{{ item.name }}</p>
      </div>
      <div v-if="filteredItems.length > currentPage * itemsPerPage" @click="loadMoreItems" class="load-more">
        View More
      </div>
    </div>
  </div>

 </div>

<br/>
 <div @click="handleClick" id="containerII" class=" text-base leading-6  rounded w-full py-1 px-4 border-none">

    <p>From Package No.</p>
  
    <input  v-model="SelectedDate" />
     </div>
				
				

				<div @click="handleClose"  id="addSummary" class="text-base leading-6  rounded  py-6 px-4 border-none" style="width: 90%;">
                  <p>Packing Slips</p>
				  <FeatherIcon name="plus" class="h-6 w-6 text-black-500 cursor-pointer"  @click="toggleAddForm"/>

				</div>




				<div  class="flex flex-col gap-5 my-4" style="width: 90%;">
					<!-- <div class="text-lg font-medium text-gray-900">QuickLinks</div> -->
					<div class="flex flex-col bg-white rounded ">
						<div id="basedOnActiveTabs"
							class="flex flex-row flex-start p-4 items-center justify-between border-b"
							v-for="(item, index) in summaryItems" :key="index"
								@click="editSummaryItem(item)"
						>
							<div class="flex flex-row items-center gap-3 grow">
								<!-- <component :is="link.icon" class="h-5 w-5 text-gray-500" /> -->
								<FeatherIcon name="codesandbox" class="h-5 w-5 text-gray-500" />
								<div class="text-xs font-normal text-gray-800 leading-6">
									
									
									<p >{{ item.itemCode }} </p>
								</div>
								<div id="circleii">
									{{ item.quantity }}
								</div>

							</div>
							<FeatherIcon name="chevron-right" class="h-5 w-5 text-gray-500" />
						</div>
					</div>
				</div>

				<div id="reader" v-show="showScanner"></div>

			  

				<div v-if="showAddForm" class="add-form"  >
				
					<div @click="handleClick"  id="space">
					<div @click="handleClick" id="scrollerLine"> </div></div>
					<br>
					
					<label for="itemName">Item</label>
					<div class="barcode-input">
						<input v-model="selectedItemCode" placeholder="Search item name here" list="searchName" id="nameField"/>
						<datalist id="searchName">
						
							<option v-for="link in itemList" :key="link.name" :value="link.name">{{ link.name  }}   </option>
							
							</datalist>						<span class="barcode-scanner" id="QRcodescanner" @click="startScanner">
						  <FeatherIcon name="maximize" class="h-6 w-6 text-black-500" />
						</span>
					  </div>

					<br >

					<!-- <div id="reader"></div> -->

				<!-- <label for="itemName">Source Warehouse</label>
<div class="barcode-input">
	<input   placeholder="Search item by warehouse" list="searchWarehouse" id="wareHouseName" v-model="selectedWarehouse"/>
					  </div>
					<br> -->
          <!-- <label for="itemName">Delivery Date</label>

          <div class="barcode-input">
            <input   type="date" id="deDate" v-model="SelectedDeliveryDate"/>
                      </div>
                    <br> -->
          <!-- <label for="wName">Target Warehouse</label>
<div class="barcode-input">
	<input   placeholder="Search item by warehouse" list="searchTWarehouse" id="wareTHouseName" v-model="selectedTWarehouse"/>
	<datalist id="searchTWarehouse">
		<option v-for="link in warehouseList" :key="link.name" :value="link.name" >
			{{ link.name }}
		  </option>
		
		</datalist>		

					
					  </div>
					<br> -->

					<label for="itemName">Quantity</label>

					<!-- <input v-model="selectedQuantity" type="number" id="quantity" :value="`${selectedQuantity} (${remainingQuantity})`" /> -->

					<input v-model="selectedQuantity"  type="number" id="quantity" placeholder="change quantity" />
						
					
				<br>
                
					
					<button id="addNew"   @click="submitAndAddNew">Submit and Add New</button>
					<br>
					<button id="sub" @click='submit' >Submit </button>

				  </div>
				

				  <div v-if="barcodeScannerOpen" class="barcode-scanner-container" @click="closeBarcodeScannerPopup">
					<!-- <div class="blurred-background"></div> -->
					<div id="barcodeScanner"></div>
				  </div>

			




				 <!-- <div class="flex flex-col gap-5 my-4 w-full">
					
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
								
									
									<p >{{ link.itemCode }}</p>
								</div>
								<div id="circleii">{{ link.quantity }}
									
								</div>
                               
							</div>
							<FeatherIcon name="chevron-right" class="h-5 w-5 text-gray-500" />
						</div>
					</div>
				</div>  -->
        <!-- <Button @click="createQualityInspection" variant="outline" theme="blue" class="w-full shadow py-4 mt-5">
					<template #prefix>
					  <FeatherIcon name="award" class="w-4" />
					</template>
					Quality Inspection
				  </Button> -->

				<div id="btnDiv" class="w-full flex justify-around  bg-none sm:w-96 py-2 standalone:pb-safe-bottom">
          <Button @click="submitPackingSlip" variant="outline" theme="blue" id="submitPurchaseReceipt" class=" shadow py-4 mt-5">
            <template #prefix>
              <FeatherIcon name="truck" class="w-4" />
            </template>
            submit
            </Button>
                <!-- <button    >Submit</button> -->
                <Button @click="savePackingSlip" variant="outline" theme="blue" id="savePurchaseReceipt" class=" shadow py-4 mt-5">
                  <template #prefix>
                    <FeatherIcon name="truck" class="w-4" />
                  </template>
                  save
                  </Button>
				<!-- <button   >Save</button> -->
				
				</div>
				<!-- <button id="DraftReceipt" >Submit Draft Receipt</button> -->
			</div>


	
			


	

		</template>

	</BaseLayout>



</template>

<script setup>
import { markRaw,ref, onUnmounted, watch,computed, onMounted, watchEffect } from "vue"


import BaseLayout from "@/components/BaseLayout.vue"


import { FeatherIcon, createListResource, Button } from "frappe-ui"
import Quagga from "quagga";

import { useRoute } from "vue-router"

import axios from "axios"
import { useRouter } from 'vue-router';
// import{ router} from "vue-router";
import { useCookies } from "vue3-cookies";
// import VueCookies from 'vue-cookies'


const { cookies } = useCookies();








const selectedDeliveryNote = ref('');
const selectedPackageNote = ref(1)

const route = useRoute()
const linkName = ref('')

linkName.value = route.query.linkName;



const router = useRouter();


const showOption = ref(false);
const showAddForm = ref(false);
const itemName = ref('');
const barcodeScannerOpen = ref(false);
const SelectedDeliveryDate = ref('')
const currentItem = ref({}); 
// const getCompany = ref(VueCookies.get('selectedCompany') || '')


const editSummaryItem = (item) => {
  currentItem.value = { ...item }; 
  selectedItemCode.value = item.itemCode;

  // selectedWarehouse.value = item.warehouse;
  // selectedTWarehouse.value = item.Twarehouse;
  SelectedDeliveryDate.value = item.deliveryDate

  selectedQuantity.value = item.quantity;
  
  showAddForm.value = true;
};


const handleClick = async () => {
	
	showAddForm.value = false;
	showScanner.value = false;


}

const openBarcodeScannerPopup = async () => {
  
  showAddForm.value = false;

  barcodeScannerOpen.value = true;

 
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
  
  barcodeScannerOpen.value = false;

 
  if (Quagga && Quagga.stop) {
    Quagga.stop();
  }
};



const toggleAddForm = () => {
  showAddForm.value = !showAddForm.value;
  showScanner.value = false;
};

const handleCartIconClick = () => {
   
    
    window.location.href = "/SalesOrderList"
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

// const posProfile = ref( VueCookies.get('selectedPosProfile'));
// const selectedWarehouse = ref( VueCookies.get('selectedWarehouse'));
// const selectedTWarehouse = ref('')
// const selectedPosProfile = ref( VueCookies.get('selectedPosProfile'));

const selectedQuantity = ref(0);
const selectedPurchaseOrder = ref('');
const itemsData = ref([]);
const purchaseOrderData = ref([])
const remainingQuantityMap = ref({});
const itemList = ref([])
const warehouseList = ref([])


const fetchItemList= async() => {

try{
const response = await axios.get('/api/method/wms.api.my_api.get_all_items', {

})
itemList.value = response.data.message


}
catch(error){
  console.error('Error fetching warehouse:', error);
}

}

fetchItemList()

const fetchWarehouseList= async() => {

try{
const response = await axios.get('/api/method/wms.api.my_api.get_all_warehouse', {

})
warehouseList.value = response.data.message


}
catch(error){
  console.error('Error fetching warehouse:', error);
}

}

fetchWarehouseList()





const customerList = ref([])

const fetchcustomerList= async() => {

try{
const response = await axios.get('/api/method/wms.api.my_api.get_internal_customers')
customerList.value = response.data.message
const matchedCustomer = customerList.value.find(customer => customer.represents_company === getCompany.value);

// selectedDeliveryNote.value = matchedCustomer.name


}
catch(error){
  console.error('Error fetching warehouse:', error);
}

}

fetchcustomerList()





watch(selectedPurchaseOrder, async (newVal) => {
    if (newVal) {
        await fetchItemData(newVal);
    }
});









const summaryItems = ref([]);

const addToSummary = () => {
	const itemCode = selectedItemCode.value;
  const item = itemList.value.find(item => item.name === itemCode);
  const itemName = item ? item.item_name : 'Unknown Item'; 
  	// const warehouse = selectedWarehouse.value;
    // const Twarehouse = selectedTWarehouse.value;
    const deliveryDate = SelectedDeliveryDate.value;
	const quantity = Number(selectedQuantity.value);
   
    

	
	const existingItem = summaryItems.value.find(item => item.itemCode === itemCode  && item.itemName === itemName && item.deliveryDate === deliveryDate)

	if (existingItem) {
		
		existingItem.quantity += quantity;
	} else {
	
		summaryItems.value.push({ itemCode, quantity, itemName, deliveryDate });
	}

	
	clearInputFields();
};
  
const canSubmit = () => {
  
  return selectedItemCode.value.trim() !== '' &&
//          selectedWarehouse.value.trim() !== '' &&
// selectedTWarehouse.value.trim() !== '' &&
// SelectedDeliveryDate.value.trim() !== '' &&
        
         selectedQuantity.value !== null && !isNaN(selectedQuantity.value) && selectedQuantity.value > 0;
};


const submitAndAddNew = () => {
  if (canSubmit()) {
    if (currentItem.value.itemCode) {
     
      const existingItem = summaryItems.value.find(
        (i) => i.itemCode === currentItem.value.itemCode &&   i.deliveryDate === currentItem.value.deliveryDate
      );
      if (existingItem) {
        existingItem.quantity = selectedQuantity.value;

        // existingItem.warehouse = selectedWarehouse.value;
        // existingItem.Twarehouse = selectedTWarehouse.value;
        // existingItem.deliveryDate = SelectedDeliveryDate.value;
        existingItem.itemCode = selectedItemCode.value;
      }
    } else {
      
      addToSummary();
    }
    clearInputFields();
    currentItem.value = {}; // Clear the current item
  }
};

const submit = () => {
  if (canSubmit()) {
    if (currentItem.value.itemCode) {
     
      const existingItem = summaryItems.value.find(
        (i) => i.itemCode === currentItem.value.itemCode &&  i.deliveryDate === currentItem.value.deliveryDate
      );
      if (existingItem) {
        existingItem.quantity = selectedQuantity.value;
        // existingItem.warehouse = selectedWarehouse.value;
        // existingItem.Twarehouse = selectedTWarehouse.value;
        // existingItem.deliveryDate = SelectedDeliveryDate.value;
        existingItem.itemCode = selectedItemCode.value;
      }
    } else {
    
      addToSummary();
    }
    clearInputFields();
    toggleAddForm();
    currentItem.value = {}; 
  }
};
  const clearInputFields = () => {
    selectedItemCode.value = '';
    selectedQuantity.value = '';
	
	

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
};







let pageTitle = ref("New")
const SelectedDate = ref(1);
// const selectedDeliveryNote = ref('');
let draftNum = null; 










const showScanner = ref(false);

const qrScan = ref("")


const showItemDropdown = ref(false);
const customers = ref([]);
// const paginatedItems = ref([]);
const itemsPerPage = 4;
const currentPage = ref(1);
const hasMoreItems = ref(false);
const filteredItems = ref([]);

const isModalVisible = ref(false);


const fetchCustomers = async () => {
	try {
		const response = await axios.get('/api/method/wms.api.my_api.get_draft_delivery_notes');
		customers.value = response.data.message;
		filteredItems.value = customers.value; 
	} catch (error) {
		console.error('Error fetching customers:', error);
	}
};

const paginatedItems = computed(() => {
	return filteredItems.value.slice(0, currentPage.value * itemsPerPage);
});

const loadMoreItems = () => {
	currentPage.value++;
};

const debounce = (func, wait) => {
	let timeout;
	return function (...args) {
		const context = this;
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(context, args), wait);
	};
};

const handleInputChange = debounce(async () => {
	if (selectedDeliveryNote.value.trim() === "") {
		filteredItems.value = customers.value;
	} else {
		filteredItems.value = customers.value.filter(item => item.name.toLowerCase().includes(selectedDeliveryNote.value.toLowerCase()));
	}
	currentPage.value = 1; 
}, 300);

const toggleItemDropdown = () => {
	showItemDropdown.value = !showItemDropdown.value;
	if (showItemDropdown.value) {
		fetchCustomers();
	}
};

const handleClose = () => {
  showItemDropdown.value = false;
}


const selectItem = (item) => {
	selectedDeliveryNote.value = item.name;
  showItemDropdown.value = false; 
};








const handleBarcodeScan = async () => {
    
    selectedItemCode.value = qrScan.value;

    
    try {
        const response = await axios.get('/api/method/wms.api.my_api.get_item_code_from_barcode', {
            params: {
                barcode_text: qrScan.value
            }
        });
        
        
        const itemCodeFromBarcode = response.data.item_code;
        
        
        if (itemCodeFromBarcode) {
            selectedPurchaseOrder.value = itemCodeFromBarcode;
        }
    } catch (error) {
        console.error('Error scanning barcode:', error);
    }
};





const startScanner = () => {
    showScanner.value = true;

    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
        { facingMode: "environment" },
        (qrCodeMessage) => {
            alert("QR code scanned: " + qrCodeMessage);
			fetchItemDetails(qrScan.value)
            stopScanner(html5QrCode);

           
            // handleBarcodeScan(qrCodeMessage);
        },
        (error) => {
            // console.error(" QR code:", errorMessage);
			qrScan.value = error
            alert(" QR code: " + qrScan.value );
			fetchItemDetails(qrScan.value)
            stopScanner(html5QrCode);
        }
    );
};


const stopScanner = (html5QrCode) => {
 
  showScanner.value = false;

 
  html5QrCode.stop();
};



const findItem = ref('')
const fetchItemDetails = async (qrMsg) => {
  try {
    const response = await fetch(`/api/method/wms.api.my_api.item_match_with_qr?barcode=${qrMsg}`); 
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
	findItem.value = data.message.parent
	return data;

  } catch (error) {
    console.error('Error fetching item details:', error);
    return null;
  }
};





const uniqueItemsData = computed(() => {
	const seen = new Set();
	return itemsData.value.filter(item => {
	const duplicate = seen.has(item.name);
	seen.add(item.name);
	return !duplicate;
    });
});

const isItemInList = computed(() => {
    return uniqueItemsData.value.some(item => item.name === findItem.value);
});


watchEffect(() => {
	if (findItem.value) {
		selectedItemCode.value = findItem.value;
    }
});





console.log("selectedDeliveryNote", selectedDeliveryNote.value)

const apiData = ref([]);


	const fetchReceiptData = async () => {


	try {
		const response = await axios.get('/api/method/wms.api.my_api.get_packing_by_name', {
			params: { name: linkName.value }
		});
		apiData.value = response.data.message;





      if (response.data && response.data.message) {
            // const apiData = response.data.message;
            selectedDeliveryNote.value = apiData.value.delivery_note || '';

            // selectedWarehouse.value = apiData.value.set_warehouse || '';
            // selectedTWarehouse.value = apiData.value.set_target_warehouse || '';


            if (apiData.value.items && apiData.value.items.length > 0) {
                const firstItem = apiData.value.items[0]; 
                selectedItemCode.value = firstItem.item_code || '';
                // selectedWarehouse.value = firstItem.warehouse || '';
                selectedQuantity.value = firstItem.qty || '';
                SelectedDeliveryDate.value = firstItem.delivery_date || ''
               
            }
        } 

		if (!deliveryData.value && apiData.value) {
    //   const { name, items } = response.data.message;
      pageTitle.value = apiData.value.name;
      apiData.value.items.forEach(item => {
		 
        summaryItems.value.push({
			// purchaseOrder : item.purchase_order,
          
          itemCode: item.item_code,
          // warehouse: item.warehouse,
          // Twarehouse: item.set_target_warehouse,
          // deliveryDate: item.delivery_date,
          quantity: item.qty,
        });
        console.log('apiData...value', apiData.value)
	})
	
    } else {
      console.error('Invalid response data:', response.data);
    }


	} catch (error) {
		console.log('Error while fetching data', error.response);
	}
};





const deliveryData = ref([]);


const fetchDeliveryData = async (deliveryParam) => {


try {
  const response = await axios.get('/api/method/wms.api.my_api.get_deliverynote_by_name', {
    params: { name: deliveryParam}
  });
  deliveryData.value = response.data.message;
console.log(' deliveryData.value',  deliveryData.value)




    if (response.data && response.data.message) {
          // const deliveryData = response.data.message;
          selectedDeliveryNote.value = deliveryData.value.delivery_note || '';

          // selectedWarehouse.value = deliveryData.value.set_warehouse || '';
          // selectedTWarehouse.value = deliveryData.value.set_target_warehouse || '';


          if (deliveryData.value.items && deliveryData.value.items.length > 0) {
              const firstItem = deliveryData.value.items[0]; 
              selectedItemCode.value = firstItem.item_code || '';
              // selectedWarehouse.value = firstItem.warehouse || '';
              selectedQuantity.value = firstItem.qty || '';
              SelectedDeliveryDate.value = firstItem.delivery_date || ''
             
          }
      } 

  if (deliveryData.value) {
  //   const { name, items } = response.data.message;
    deliveryData.value.items.forEach(item => {
   
      summaryItems.value.push({
    // purchaseOrder : item.purchase_order,
        
        itemCode: item.item_code,
        // warehouse: item.warehouse,
        // Twarehouse: item.set_target_warehouse,
        deliveryDate: item.delivery_date,
        quantity: item.qty,
      });
})

  } else {
    console.error('Invalid response data:', response.data);
  }


} catch (error) {
  console.log('Error while fetching data', error.response);
}
};


watch(selectedDeliveryNote, async (newD) => {
  if (newD) {
    await fetchDeliveryData(newD);
  }
});




onMounted(() => {



  const linkName = route.query.linkName;
  if (linkName) {
  
  
      fetchReceiptData(linkName);
    

	  
    
  }

//    selectedWarehouse.value = VueCookies.get('selectedWarehouse') || 'No warehouse selected'
 
//   selectedPosProfile.value = VueCookies.get('selectedPosProfile') || 'No pos profile selected'

});





const savePackingSlip = async () => {
  const sid = cookies.get('sid');
  const requestData = {
    delivery_note:"MAT-DN-2024-00001",
    from_case_no: SelectedDate.value,
    items: summaryItems.value.map(item => ({
      item_code: item.itemCode,
      qty: item.quantity,
    

     
    })),
    docstatus: 0 
  };
console.log('requestData',requestData )
  try {
    if (pageTitle.value && pageTitle.value !== "New") {
     
      const updateResponse = await axios.put(`/api/resource/Packing Slip/${pageTitle.value}`, requestData, {
        headers: { 'Authorization': `Bearer ${sid}`,
        'Content-Type': 'application/json',

         }
      });

      alert('Updated Packing Slip: ' + updateResponse.data.data.name);
    } else {
      
      const createResponse = await axios.post('/api/resource/Packing Slip', requestData, {
        headers: { 'Authorization': `Bearer ${sid}` }
      });

      pageTitle.value = createResponse.data.data.name;
      alert('Created Packing Slip: ' + pageTitle.value);
    }
  } catch (error) {
    console.error('Error in Packing Slip process:', error);
    try {
      const serverMessages = JSON.parse(error.response.data._server_messages);
      const serverMessage = JSON.parse(serverMessages[0]);
      alert(serverMessage.message);
    } catch (parseError) {
      console.error('Error parsing server message:', parseError);
      alert('An unexpected error occurred.');
    }
  }
};





const submitPackingSlip = async () => {
  const sid = cookies.get('sid');
  const requestData = {
    delivery_note:"MAT-DN-2024-00001",
    from_case_no: SelectedDate.value,
    items: summaryItems.value.map(item => ({
      item_code: item.itemCode,
      qty: 1,
    

     
    })),
    docstatus: 1 
  };

  try {
    if (pageTitle.value && pageTitle.value !== 'New') {
     
      const updateResponse = await axios.put(`/api/resource/Packing Slip/${pageTitle.value}`, requestData, {
        headers: { 'Authorization': `Bearer ${sid}` }
      });

      alert('Updated Packing Slip: ' + updateResponse.data.data.name);
    } else {
     
      const createResponse = await axios.post('/api/resource/Packing Slip', requestData, {
        headers: { 'Authorization': `Bearer ${sid}` }
      });

      pageTitle.value = createResponse.data.data.name;  
      alert('Created Packing Slip: ' + pageTitle.value);
    }
  } catch (error) {
    console.error('Error in Packing Slip process:', error);

    const serverMessages = JSON.parse(error.response.data._server_messages);
    const serverMessage = JSON.parse(serverMessages[0]);

   
    const tempElement = document.createElement('div');
    tempElement.innerHTML = serverMessage.message;

   
    const plainTextMessage = tempElement.textContent || tempElement.innerText || '';

    alert(plainTextMessage);
}
};





const qualityNumber = ref('')



const createQualityInspection = async () => {
    try {
        const requestData = {
            docname: pageTitle.value || linkName.value,
            items: summaryItems.value.map(item => ({
                item_code: item.itemCode,
                warehouse: item.warehouse,
                set_target_warehouse: item.Twarehouse,
                qty: parseInt(item.quantity),
                uom: item.uom,
                sample_size: 0,
            })),
        };


        const response = await axios.post('/api/method/wms.api.my_api.save_quality_inspections', requestData);

      
		qualityNumber.value = response.data.message[0]
        
        alert(`quality inspection saved in draft ${response.data.message.name}`)
        router.push({name: 'QualityInspection'})
    } catch (error) {
        console.error('Error creating quality inspection:', error);
        alert('Error while creating quality inspection:', error.message);
    }
};





watch(route, (to, from) => {
  if (from.name === 'SalesOrderList') {
    window.location.reload();
  }
});


</script>











<style>
#containerIII{
height:auto;
text-align:center;

}

#containerII{
height:auto;
text-align:center;

}
#containerIII > input{
    height:35px;
    width:80%;
    font-size:12px;
    margin-left:5%;
    background-color: rgb(236, 235, 235);
    border-radius:5px;
    border:1px solid rgb(110, 108, 108);
}


#containerII > select{
    height:35px;
    width:50%;
    font-size:12px;
    background-color: rgb(236, 235, 235);
    border-radius:5px;
}

#containerII > input{
    height:35px;
    width:80%;

    font-size:12px;
    background-color: rgb(236, 235, 235);
    border-radius:5px;
    border:1px solid gray;
}


#reader {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.8); 
	z-index: 9999; 
	display: flex;
	justify-content: center;
	align-items: center;
  }



#html5-qrcode-anchor-scan-type-change {
	text-decoration: none !important;
	color: #1d9bf0;
}

video {
	width: 100% !important;
	border: 1px solid #b2b2b2 !important;
	border-radius: 0.25em;
}



#my-qr-reader img[alt="Info icon"] {
	display: none;
}

#my-qr-reader img[alt="Camera based scan"] {
	width: 100px !important;
	height: 100px !important;
}




#scanInput{
  height: 35px;
    width: 80%;
    font-size: 12px;
    background-color: rgb(236, 235, 235);
    border-radius: 5px;
    border: 0.5px solid gray;
    margin-left:10%;
    }

#scanInput > input {
  height: 100%;
    width: 100%;
    font-size: 12px;
    background-color: rgb(236, 235, 235);
    border-radius: 5px;
}




ion-tab-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 900; 
    background-color: white;
    border-top: 1px solid #ccc; 
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1); 
  }


  body {
    padding-bottom: 50px; 
	
  }



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
  
  padding-right: 0.5em;
}
input::placeholder{
    font-size:12px;
}

label{
    font-size:14px;
}


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
 
  padding-right: 0.5em;
}


#wareHouseName{
	width:100%;
	height:40px;
	
}




#wareTHouseName::-webkit-calendar-picker-indicator,
#wareTHouseName::-webkit-datetime-edit-fields-wrapper,
#wareTHouseName::-webkit-inner-spin-button {
  display: none !important;
}

#wareTHouseName::-webkit-clear-button {
  -webkit-appearance: none;
  display: none !important;
}

#wareTHouseName {
 
  padding-right: 0.5em;
}


#wareTHouseName{
	width:100%;
	height:40px;
	
}
#deDate{
  width:100%;
	height:40px;
  border:none;
}
#quantity{
	border:none;
}
#uom{
	border:none;
    height:40px;
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
  width: 100%;
max-width:400px;
  padding: 20px;
  background-color: white;
  box-shadow: 0px -5px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  transform: translateY(0%);
  display: flex;
  flex-direction: column;
  z-index: 999;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  overflow-y: auto;
  max-height: 80%;
  margin: 0 auto;
  box-sizing: border-box;
  font-size: 16px;
	
  }
  
  .barcode-input {
	position: relative;
  }
  
  .barcode-scanner {
	position: absolute;
	top: 50%;
	right: 0;
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

#DraftReceipt{
	background-color: black;
	color: white;
	height: 40px;
	box-sizing: border-box;
	border-radius: 10px;
	width:95%;
	margin-left:2%;
	font-size:16px;
	font-weight:bold;
}
#btnDiv{
  bottom:0;
  position:fixed;
}
#submitPurchaseReceipt{
	height: 30px;
    box-sizing: border-box;
    border-radius: 10px;
    border: 1px solid gray;
    width: 35%;
    font-size: 14px;
    font-weight: bold;
}

#savePurchaseReceipt{
	height: 30px;
	box-sizing: border-box;
	border-radius: 10px;
  border:1px solid gray;
  width:35%;
	font-size:14px;
	font-weight: bold;
}

#purchaseDate > label{
	width: 100%;
	text-align: center;
	font-size: 16px;

}
#purchaseDate > select{
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
  .extra-data{
	font-size:12px;
	font-weight: bold;
  }






.item-dropdown {
  position: absolute;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

.item {
  padding: 10px;
  cursor: pointer;
}

.item:hover {
  background-color: #f0f0f0;
}

.view-more {
  padding: 10px;
  text-align: center;
  cursor: pointer;
  border-top: 1px solid #ddd;
}

.load-more:hover {
  background-color: #f0f0f0;
}

.load-more {
	text-align: center;
	padding: 10px;
	cursor: pointer;
	color: blue;
}
</style>