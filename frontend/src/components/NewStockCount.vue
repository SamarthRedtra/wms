<template>
	<BaseLayout :pageTitle="pageTitle" :home="'edit'" @cartIconClick="handleCartIconClick"   class="text-xs">
		<template #body>
			<div  class="flex flex-col items-center">
 <div @click="handleClick" id="containerIII" class="flex justify-around text-base leading-6  rounded w-full py-1 px-4 border-none mt-5">

<p>Purpose</p>
<select  v-model="selectedPurpose" >
    <option value=""></option>
    <option value="Opening Stock">Opening Stock</option>
    <option value="Stock Reconciliation">Stock Reconciliation</option>


</select>
 </div>


 <div @click="handleClick" id="containerII" class="flex justify-around text-base leading-6  rounded w-full py-1 px-4 border-none">

    <p>Company</p>
    <select v-model="selectedCompany">
    <option v-for="link in companyList"   :key="link.name" :value="link.name">{{link.name}}</option>
    

    <!-- <option value=""></option> -->
    </select>
     </div>
				
				

				<div id="addSummary" class="text-base leading-6  rounded  py-6 px-4 border-none" style="width: 90%;">
                  <p>Stock Entries</p>
				  <FeatherIcon name="plus" class="h-6 w-6 text-black-500 cursor-pointer"  @click="toggleAddForm"/>

				</div>




				<div  class="flex flex-col gap-5 my-4" style="width: 90%;">
					<!-- <div class="text-lg font-medium text-gray-900">QuickLinks</div> -->
					<div class="flex flex-col bg-white rounded ">
						<div id="basedOnActiveTabs"
							class="flex flex-row flex-start p-4 items-center justify-between border-b cursor-pointer"
							v-for="(item, index) in summaryItems" :key="index"
							
						 @click="editSummaryItem(item)"
						>
							<div class="flex flex-row items-center gap-3 grow">
								<!-- <component :is="link.icon" class="h-5 w-5 text-gray-500" /> -->
								<FeatherIcon name="edit" class="h-5 w-5 text-gray-500" />
								<div class="text-xs font-normal text-gray-800 leading-6">
									
									
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

				<div id="reader" v-show="showScanner"></div>

			  

				<div v-if="showAddForm" class="add-form"  >
				
					<div @click="handleClick"  id="space">
					<div @click="handleClick" id="scrollerLine"> </div></div>
					<br>
					
					<label for="itemName">Item</label>
					<div class="barcode-input">
						<input v-model="selectedItemCode" placeholder="Search item name here" list="searchName" id="nameField"/>
						<datalist id="searchName">
						
							<option v-for="link in itemList" :key="link.name" :value="link.name">{{ link.name }}</option>
							
							</datalist>						<span class="barcode-scanner" id="QRcodescanner" @click="startScanner">
						  <FeatherIcon name="maximize" class="h-6 w-6 text-black-500" />
						</span>
					  </div>

					<br >

					<!-- <div id="reader"></div> -->

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
						
					
				<br>
					<button id="addNew"   @click="submitAndAddNew">Submit and Add New</button>
					<br>
					<button id="sub" @click='submit' >Submit </button>

				  </div>
				

				  <div v-if="barcodeScannerOpen" class="barcode-scanner-container" @click="closeBarcodeScannerPopup">
					<!-- <div class="blurred-background"></div> -->
					<div id="barcodeScanner"></div>
				  </div>

			




				 <div class="flex flex-col gap-5 my-4 w-full">
					
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
								
									
									<p >{{ link.itemCode }}| {{ link.warehouse }}</p>
								</div>
								<div id="circleii">{{ link.quantity }}
									
								</div>
							</div>
							<FeatherIcon name="chevron-right" class="h-5 w-5 text-gray-500" />
						</div>
					</div>
				</div> 

				<div id="btnDiv" class="w-full flex justify-around  sm:w-96 py-2 standalone:pb-safe-bottom">
                <button  id="submitPurchaseReceipt"  @click="submitStockReconciliation">Submit</button>
				<button id="savePurchaseReceipt"  @click="saveStockReconcialation">Save</button>
				
				</div>
				<!-- <button id="DraftReceipt" >Submit Draft Receipt</button> -->
			</div>


	
			


	

		</template>

	</BaseLayout>



</template>

<script setup>
import { markRaw,ref, onUnmounted, watch,computed, onMounted, watchEffect } from "vue"


import BaseLayout from "@/components/BaseLayout.vue"


import { FeatherIcon, createListResource } from "frappe-ui"
import Quagga from "quagga";

import { useRoute } from "vue-router"

import axios from "axios"
import { useRouter } from 'vue-router';
// import{ router} from "vue-router";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();









const route = useRoute()
const linkName = ref('')

linkName.value = route.query.linkName;






const showOption = ref(false);
const showAddForm = ref(false);
const itemName = ref('');
const barcodeScannerOpen = ref(false);



const currentItem = ref({}); // Add this line

const editSummaryItem = (item) => {
  currentItem.value = { ...item }; // Clone the item to avoid mutating the original object
  selectedItemCode.value = item.itemCode;
  selectedWarehouse.value = item.warehouse;
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
   
    
    window.location.href = "/StockCount"
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
const selectedQuantity = ref(0);
const selectedPurchaseOrder = ref('');
const selectedUOM = ref('')
const itemsData = ref([]);
const purchaseOrderData = ref([])
const remainingQuantityMap = ref({});
const itemList = ref([])

const fetchItemList= async() => {

try{
const response = await axios.get('/api/method/wms.api.my_api.get_all_items')
itemList.value = response.data.message

console.log('itemList data', itemList.value)
}
catch(error){
  console.error('Error fetching warehouse:', error);
}

}

fetchItemList()





const companyList = ref([])

const fetchcompanyList= async() => {

try{
const response = await axios.get('/api/method/wms.api.my_api.get_all_company')
companyList.value = response.data.message

console.log('companyList data', companyList.value)
}
catch(error){
  console.error('Error fetching warehouse:', error);
}

}

fetchcompanyList()





watch(selectedPurchaseOrder, async (newVal) => {
    if (newVal) {
        await fetchItemData(newVal);
    }
});









const summaryItems = ref([]);

const addToSummary = () => {
	const itemCode = selectedItemCode.value;
	const warehouse = selectedWarehouse.value;
	const quantity = Number(selectedQuantity.value);

	
	const existingItem = summaryItems.value.find(item => item.itemCode === itemCode && item.warehouse === warehouse);

	if (existingItem) {
		
		existingItem.quantity += quantity;
	} else {
	
		summaryItems.value.push({ itemCode, warehouse, quantity });
	}

	
	clearInputFields();
};
  
const canSubmit = () => {
  
  return selectedItemCode.value.trim() !== '' &&
         selectedWarehouse.value.trim() !== '' &&
         selectedQuantity.value !== null && !isNaN(selectedQuantity.value) && selectedQuantity.value > 0;
};


const submitAndAddNew = () => {
  if (canSubmit()) {
    if (currentItem.value.itemCode) {
     
      const existingItem = summaryItems.value.find(
        (i) => i.itemCode === currentItem.value.itemCode && i.warehouse === currentItem.value.warehouse
      );
      if (existingItem) {
        existingItem.quantity = selectedQuantity.value;
        existingItem.warehouse = selectedWarehouse.value;
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
        (i) => i.itemCode === currentItem.value.itemCode && i.warehouse === currentItem.value.warehouse
      );
      if (existingItem) {
        existingItem.quantity = selectedQuantity.value;
        existingItem.warehouse = selectedWarehouse.value;
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







let pageTitle = ref("New")
const selectedCompany = ref('');
const selectedPurpose = ref('');
let draftNum = null; 










const showScanner = ref(false);

const qrScan = ref("")



const handleBarcodeScan = async () => {
    
    selectedItemCode.value = qrScan.value;

    
    try {
        const response = await axios.get('/api/method/wms.api.my_api.get_item_code_from_barcode', {
            params: {
                barcode_text: qrScan.value
            }
        });
        
        
        const itemCodeFromBarcode = response.data.item_code;
		console.log('itemcode from barcode', itemCodeFromBarcode)
        
        
        if (itemCodeFromBarcode) {
            selectedPurchaseOrder.value = itemCodeFromBarcode;
			console.log('selected po', selectedPurchaseOrder.value)
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
            console.log("QR code scanned:", qrCodeMessage);
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
    console.log("dat returned :",data.message.parent)
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





console.log('linkName', linkName)


const apiData = ref([]);


	const fetchReceiptData = async () => {
//  window.onload()

	try {
		const response = await axios.get('/api/method/wms.api.my_api.get_stock_by_name', {
			params: { name: linkName.value }
		});
		apiData.value = response.data.message;
		console.log('apiData', apiData.value)





      if (response.data && response.data.message) {
            // const apiData = response.data.message;
            selectedPurpose.value = apiData.value.purpose || '';
            selectedCompany.value = apiData.value.company || '';

            if (apiData.value.items && apiData.value.items.length > 0) {
                const firstItem = apiData.value.items[0]; // Assuming you want to populate with the first item
                selectedItemCode.value = firstItem.item_code || '';
                selectedWarehouse.value = firstItem.warehouse || '';
                selectedQuantity.value = firstItem.qty || '';
            }
        } 

		if (apiData.value) {
    //   const { name, items } = response.data.message;
      pageTitle.value = apiData.value.name;
      apiData.value.items.forEach(item => {
		 
        summaryItems.value.push({
			// purchaseOrder : item.purchase_order,
          
          itemCode: item.item_code,
          warehouse: item.warehouse,
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


onMounted(() => {

  const linkName = route.query.linkName;
  if (linkName) {
  
  
      fetchReceiptData(linkName);
    

	  
    
  }
});





const saveStockReconcialation = async () => {
  const sid = cookies.get('sid');
  const requestData = {
    company: selectedCompany.value,
    purpose: selectedPurpose.value,
    items: summaryItems.value.map(item => ({
      item_code: item.itemCode,
      warehouse: item.warehouse,
      qty: item.quantity
    })),
    docstatus: 0 
  };

  try {
    if (pageTitle.value && pageTitle.value !== "New") {
     
      const updateResponse = await axios.put(`/api/resource/Stock Reconciliation/${pageTitle.value}`, requestData, {
        headers: { 'Authorization': `Bearer ${sid}` }
      });

      console.log('Updated Stock Reconciliation', updateResponse.data);
      alert('Updated Stock Reconciliation: ' + updateResponse.data.data.name);
    } else {
      
      const createResponse = await axios.post('/api/resource/Stock Reconciliation', requestData, {
        headers: { 'Authorization': `Bearer ${sid}` }
      });

      console.log('Created Stock Reconciliation', createResponse.data);
      pageTitle.value = createResponse.data.data.name;
      alert('Created Stock Reconciliation: ' + pageTitle.value);
    }
  } catch (error) {
    console.error('Error in Stock Reconciliation process:', error);
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





const submitStockReconciliation = async () => {
  const sid = cookies.get('sid');
  const requestData = {
    company: selectedCompany.value,
    purpose: selectedPurpose.value,
    items: summaryItems.value.map(item => ({
      item_code: item.itemCode,
      warehouse: item.warehouse,
      qty: item.quantity
    })),
    docstatus: 1  
  };

  try {
    if (pageTitle.value && pageTitle.value !== 'New') {
     
      const updateResponse = await axios.put(`/api/resource/Stock Reconciliation/${pageTitle.value}`, requestData, {
        headers: { 'Authorization': `Bearer ${sid}` }
      });

      console.log('Updated Stock Reconciliation', updateResponse.data);
      alert('Updated Stock Reconciliation: ' + updateResponse.data.data.name);
    } else {
     
      const createResponse = await axios.post('/api/resource/Stock Reconciliation', requestData, {
        headers: { 'Authorization': `Bearer ${sid}` }
      });

      console.log('Created Stock Reconciliation', createResponse.data);
      pageTitle.value = createResponse.data.data.name;  
      alert('Created Stock Reconciliation: ' + pageTitle.value);
    }
  } catch (error) {
    console.error('Error in Stock Reconciliation process:', error);
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
















</script>











<style>
#containerIII{
height:auto;

}

#containerIII > select{
    height:35px;
    width:50%;
    font-size:12px;
    margin-left:1%;
    background-color: rgb(236, 235, 235);
    border-radius:5px;
}


#containerII > select{
    height:35px;
    width:50%;
    font-size:12px;
    background-color: rgb(236, 235, 235);
    border-radius:5px;
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
	width:45%;
	font-size:16px;
	font-weight: bold;



	background-color: black;
	color: white;
	height: 40px;
	box-sizing: border-box;
	border-radius: 10px;
  width:45%;
}

#savePurchaseReceipt{
	background-color: white;
	color: black;
	height: 40px;
	box-sizing: border-box;
	border-radius: 10px;
  border:1px solid gray;
  width:45%;
	font-size:16px;
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
</style>