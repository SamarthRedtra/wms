<template>
	<BaseLayout pageTitle="Item Inquiry" :home="'home'" @cartIconClick="handleCartIconClick"   class="text-xs">

<template #body>

  <div id="openItemDropdown" class="flex flex-col items-center my-7 p-4 gap-7" >
    <div id="scanInput" class="relative" >
      <input
        @input="handleInputChange"
        @keyup.enter="handleEnterPress"
        v-model="receiptName"
        id="scanReceiptInput"
        placeholder="Type Item and press enter"
        @click="toggleItemDropdown"
      />
      <span class="barcode-scanner" id="QRcodescanner" @click="startScanner">

        <FeatherIcon name="maximize" class="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 h-6 w-6"    /> </span>
      <div v-if="showItemDropdown" class="item-dropdown" >
        <div v-for="(item, index) in paginatedItems" :key="item.name" class="item" @click="selectItem(item)">
          <p >{{ item.name }}</p>
        </div>
        <div v-if="filteredItems.length > currentPage * itemsPerPage" @click="loadMoreItems" class="load-more">
          View More
        </div>
      </div>
    </div>
    <div v-if="barcodeScannerOpen" class="barcode-scanner-container" @click="closeBarcodeScannerPopup">
      <div id="barcodeScanner"></div>
    </div>

   
    <div id="reader" v-show="showScanner" @click="closeScanner"></div>
  </div>


          <div @click="handleClosed" class="flex flex-col ml-5 gap-5 my-4  z-0" style="width: 90%;">
             
            <div class="flex flex-col bg-white rounded ">
              <div id="basedOnActiveTabsI"
                class="flex flex-row flex-start p-4 items-center justify-between border-b"
                v-for="link in prcount"
                key="link.name"
                @click="handleClick"
              >
                <div class=" grow cursor-pointer" >
   
                  <div  class=" flex justify-between text-xs font-normal text-black-900 leading-6">
                    <!-- <p > {{ link.name }}   </p>  -->
                    <span>{{ link.warehouse }} </span>
                    <span> {{link.actual_qty}} </span>
                    
                  </div>
                  
                </div>
              
              </div>
            </div>
          </div>




          <div v-if="showAddForm" class="add-form"  >
            <!-- Add your input fields and form elements here -->
            <div @click="handleClick"  id="space">
            <div @click="handleClick" id="scrollerLine"> </div></div>
            
  
            <div class="flex flex-col gap-10 my-4 w-full">
             
              <div id="binData" class="flex flex-col rounded ">
                <div id="basedOnActiveTabs"
                class="flex flex-row  p-4 items-center justify-between border-b"
                v-for="link in prcount"
                key="link.name"
                @click="selectLink(link)"
              >
                <div class=" grow cursor-pointer" >
   
                  <div @click="toggleForms"  class=" flex justify-between text-xs font-normal text-black-800 leading-6">
                    <!-- <p > {{ link.name }}   </p>  -->
                    <span>{{ link.warehouse }} </span>
                    <span> {{link.actual_qty}} </span>
                    
                  </div>
                  
                </div>
              
              </div>
              </div>
            </div>
    
          
       
  
            </div>






            <div v-if="showAddFormII" class="add-formII"  >
              <!-- Add your input fields and form elements here -->
              <div @click="handleClosed"  id="space">
              <div @click="handleClosed" id="scrollerLine"> </div></div>
              
    
              <div class="flex flex-col gap-10 my-4 w-full">
               
                <div  class="flex flex-col rounded ">
                  <div id="basedOnActiveTabsII"
                  class="flex flex-row p-4 items-center justify-between"
                
                >
                  <div class=" grow cursor-pointer" >
     
                    <div  class=" text-xs font-normal text-black-800 leading-6">
                   <div id="enterData" class=" flex justify-between text-xs font-normal text-black-800 leading-6">
                    <p>Warehouse</p>
                   <select v-model="selectedWarehouse" id="selectWarehouse">

                    <option v-for="link in wareHouse" :key="link.name" :value="link.name">{{link.name}}</option>
                  

                   </select>
                   </div>

                
                      
                    </div>

                    <div  class=" text-xs font-normal text-black-800 leading-6">
                     
   
                      <div id="enterData" class=" flex justify-between text-xs font-normal text-black-800 leading-6 mt-5">
                       <p>Quantity</p>
                      <input placeholder="Enter Quantity" v-model="selectedQty" type="number" id="selectQty" />
   
                      </div>
                         
                       </div>


                       <!-- <div  class=" flex justify-center text-xs font-normal text-black-800 leading-6">
                     
   
                        <div id="enterData" class=" flex justify-center text-xs font-normal text-black-800 leading-6 mt-5">
                        <button @click="saveReconsillation" id="saveBtn">Save</button>
                        
     
                        </div>
                           
                         </div> -->

                         <div  class=" flex justify-center text-xs font-normal text-black-800 leading-6">
                     
   
                          <div id="enterData" class=" flex justify-center text-xs font-normal text-black-800 leading-6 mt-5">
                         
                          <button @click="saveReconsillation"  id="submitBtn">Submit</button>
       
                          </div>
                             
                           </div>
                    
                  </div>
                
                </div>
                </div>
              </div>
      
            
         
    
              </div>
  


          <div
          id="footTab"
          slot="bottom"
          class="w-full flex justify-around  sm:w-96 py-2 standalone:pb-safe-bottom"
        >
        <div class="bottomTab">
          <FeatherIcon name="printer" class="h-7 w-7 text-center ml-6 pt-1 pb-1"></FeatherIcon>
          <p>Print</p>
        </div>
        <div @click="toggleAddForm" class="bottomTab">
          <FeatherIcon name="sliders" class="h-7 w-7 text-center ml-6 pt-1 pb-1" ></FeatherIcon>
          <p>Corrections</p>

        </div>

        <router-link class="bottomTab" to="BinInquiry">
        <div >
          <FeatherIcon name="credit-card" class="h-7 w-7 text-center ml-6 pt-1 pb-1" ></FeatherIcon>
          <p>Bin Inquiry</p>

        </div>
      </router-link>
        </div>

	
</template>
    </BaseLayout>


</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { useCookies } from "vue3-cookies";
import BaseLayout from "@/components/BaseLayout.vue";
import { FeatherIcon } from "frappe-ui";
import Quagga from "quagga";

const { cookies } = useCookies();
const barcodeScannerOpen = ref(false);
const showScanner = ref(false);
const receiptName = ref("");
const matchedDocType = ref("");
const errorMessage = ref("");
const showAddForm = ref(false);
const showAddFormII = ref(false);
const selectedWarehouse = ref('');
const selectedQty = ref('');
const showItemDropdown = ref(false);
const items = ref([]);
// const paginatedItems = ref([]);
const itemsPerPage = 10;
const currentPage = ref(1);
const hasMoreItems = ref(false);
const filteredItems = ref([]);


const route = useRoute();
const router = useRouter();


const fetchItems = async () => {
	try {
		const response = await axios.get('/api/method/wms.api.my_api.get_all_items');
		items.value = response.data.message;
		filteredItems.value = items.value; 
	} catch (error) {
		console.error('Error fetching items:', error);
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
	if (receiptName.value.trim() === "") {
		filteredItems.value = items.value;
	} else {
		filteredItems.value = items.value.filter(item => item.name.toLowerCase().includes(receiptName.value.toLowerCase()));
	}
	currentPage.value = 1; 
}, 300);

const toggleItemDropdown = () => {
	showItemDropdown.value = !showItemDropdown.value;
	if (showItemDropdown.value) {
		fetchItems();
	}
};



const selectItem = (item) => {
	receiptName.value = item.name;
  showItemDropdown.value = false; 
	checkItemMatch(); 
	
};


const toggleForms = () => {
  showAddForm.value = false;
  showAddFormII.value = true

}

const handleClosed = () => {
  showAddFormII.value = false
}



const toggleAddForm = () => {
  showAddForm.value = !showAddForm.value;
  showScanner.value = false;
};


const handleClick = async () => {
	
	showAddForm.value = false;
	showScanner.value = false;


}


const handleCartIconClick = () => { 
   router.push({ name: 'home' });
}


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


const closeScanner = () => {
  showScanner.value = false;
}
const closeBarcodeScannerPopup = () => {
  
  barcodeScannerOpen.value = false;
  showScanner.value = false;

 
  if (Quagga && Quagga.stop) {
    Quagga.stop();
  }
};







const startScanner = () => {
    showScanner.value = true;
    showItemDropdown.value = false;
    // document.getElementById('basedOnActiveTabsI').style.display = 'none'

    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
        { facingMode: "environment" },
        (qrCodeMessage) => {
            // alert("QR code scanned: " + qrCodeMessage);
            stopScanner(html5QrCode);

           
            //  handleBarcodeScan(qrCodeMessage);
        },
        (error) => {
            // console.error("Error scanning QR code:", error);
errorMessage.value = error
//  handleBarcodeScan(error);
            // alert("QR code: " + error);
handleBarcodeScan(error)

            
            stopScanner(html5QrCode);
        }
    );
};


const stopScanner = (html5QrCode) => {
  html5QrCode.stop();
};
 
const handleEnterPress = async () => {
	await checkItemMatch();

};


const handleBarcodeScan = async (barcode) => {
	errorMessage.value = barcode;
	await checkItemMatch();

  
};



const prcount = ref([])

const checkItemMatch = async () => {
const requestValue = errorMessage.value || receiptName.value

	try {
		const purchaseReceipts = await axios.get('/api/method/wms.api.my_api.bin_item_data', {
      
      params: {
       "item_code": requestValue
      } 
    });

   
    prcount.value = purchaseReceipts.data.message;

    if (prcount.value.length > 0) {
      matchedDocType.value = prcount.value[0].rname;
    } else {
      matchedDocType.value = '';
    }

		showScanner.value = false;
    
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};



const wareHouse = ref([])

const fetchWarehouse = async() => {

try{
const response = await axios.get('/api/method/wms.api.my_api.get_warehouse_list')
wareHouse.value = response.data.message

}
catch(error){
  console.error('Error fetching warehouse:', error);
}

}

fetchWarehouse()


const selectLink = (link) => {
  selectedWarehouse.value = link.warehouse;
  selectedQty.value = link.actual_qty;
  showAddFormII.value = true;
  showAddForm.value = false;
};

const stock_reconsile_name = ref('')


const saveReconsillation =  async() => {

  const item_code = receiptName.value;
  const warehouse = selectedWarehouse.value;
  const qty = selectedQty.value;
  const sid = cookies.get('sid'); 

  if (!item_code || !warehouse || !qty) {
    alert("Please ensure all fields are filled out.");
    return;
  }

  try {
    const response = await axios.post(
      '/api/method/wms.api.my_api.save_stock_reconciliation',
      { item_code, warehouse, qty },
      { headers: { 'Authorization': `Bearer ${sid}` } }
    );

    stock_reconsile_name.value = response.data.message
    alert(response.data.message);
  } catch (error) {
    try {
      const serverMessages = JSON.parse(error.response.data._server_messages);
      const serverMessage = JSON.parse(serverMessages[0]);
      alert(serverMessage.message);
    } catch (parseError) {
      console.error('Error parsing server message:', parseError);
      alert('An unexpected error occurred.');
    }
  }



}




const submitReconsillation =  async() => {
const stk_name = stock_reconsile_name.value
const item_code = receiptName.value;
const warehouse = selectedWarehouse.value;
const qty = selectedQty.value;
const sid = cookies.get('sid'); 
if (!item_code || !warehouse || !qty ) {
  alert("Please ensure all fields are filled out.");
  return;
}

try {
  const response = await axios.post(
    '/api/method/wms.api.my_api.submit_stock_reconciliation',
    { item_code, warehouse, qty, stk_name },
    { headers: { 'Authorization': `Bearer ${sid}` } }
  );

  alert("stock reconsilation submitted");
} catch (error) {
  // alert("No record Found", error.response.data._server_messages);
}



}

const itemCodeFromBarcode = ref('')
const handleBarcodeScanItem = async () => {
    
   

    
    try {
        const response = await axios.get('/api/method/wms.api.my_api.get_item_code_from_barcode', {
            params: {
                "barcode_text": errorMessage.value
            }
        });
        
        
        itemCodeFromBarcode.value = response.data;
        
        
       
    } catch (error) {
        console.error('Error scanning barcode:', error);
    }
};


handleBarcodeScanItem()

</script>

<style>


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
  z-index: 0;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  overflow-y: auto;
  max-height: 80%;
  margin: 0 auto;
  box-sizing: border-box;
  font-size: 16px;
	margin-bottom:40px;
  }


  .add-formII {
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
    z-index: 0;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    overflow-y: auto;
    max-height: 80%;
    margin: 0 auto;
    box-sizing: border-box;
    font-size: 16px;
      
      }
    
#saveBtn{
  width:100px;
  background-color: gainsboro;
  height:40px;
 
  font-size:16px;
  border-radius: 5px;
}


#submitBtn{
 width:100px;
 font-size:16px;
 border-radius: 5px;
  background-color: black;
  color:white;
  height:40px;
 margin-bottom:30%;

}

  #space{
    height:20px;
    width:100%;
    cursor:pointer;
    
  
    }


    #scrollerLine{
      border: 2px solid gray;
      width: 50%;
        margin-left: 25%;
      height:1px;
      cursor:pointer;
      border-radius: 10px;
    
    }

#footTab{
  position:fixed;
  bottom:0;
  z-index:999;
  background-color: white;
}


.bottomTab{

  width: 20%;
  height:50px;
  cursor:pointer;
}


.bottomTab > p{
  font-size: 12px;
  text-align: center;
  margin-top:2%;
 
}


#reader {

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
  #barcodeScanner {
	width: auto;
	height: 200px;
	margin-top: 5%;
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
	
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999;
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




#scanReceiptInput {
    background-color: rgb(231, 227, 227);
    
    margin-left: 3%;
    height: 100%;
    width:80%;
    
}
#scanInput{
    background-color: rgb(231, 227, 227);
    width:95%;
    margin-left: 2.5%;
    height: 40px;
    border-radius:5px;
}



#binData{
 border-bottom: 1px solid gainsboro;
}


#binDataPost{
  border-bottom: 1px solid gainsboro;
 }
 #enterData > p{
width: 30%;
 }

 #selectWarehouse{
  height:40px;
  width: 150px;
  font-size:12px;
  color:black;
 }

 #selectWarehouse > option{
  font-size:12px;
 }
 #selectQty{
  height:40px;
  width: 150px;
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