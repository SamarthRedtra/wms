<template>
	<BaseLayout pageTitle="PrintLab" :home="'home'" @cartIconClick="handleCartIconClick"   >
		
		<template #body>
			<div class="flex flex-col items-center my-7 p-4 gap-7">
			
                <div id="scanInput" class="relative">
                    <input   @input="handleInputChange"
						@keyup.enter="handleEnterPress"  v-model="receiptName" id="scanReceiptInput" placeholder="Scan Receipt Or Delivery" />
                <span class="barcode-scanner" id="QRcodescanner" @click="startScanner">

                    <FeatherIcon name="maximize" class="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 h-6 w-6"    /> </span>
                </div>


                <div v-if="barcodeScannerOpen" class="barcode-scanner-container" @click="closeBarcodeScannerPopup">
                  <!-- <div class="blurred-background"></div> -->
                  <div id="barcodeScanner"></div>
                  </div>

          <div id="reader" v-show="showScanner" @click="closeScanner"></div>





                <div id="receiptDetails">
             <p>{{ errorMessage || receiptName}}</p>
<br />
             <hr/>
<br />
             <p  > Type :  <span v-if="prcount.length > 0" v-for="link in prcount" :key="link.rname">{{ link.rname }}</span>
              <span v-else-if="drcount.length > 0" v-for="link in drcount" :key="link.dname">{{ link.dname }}</span> </p>  
             <p >Item#:  <span v-if="prcount.length > 0" v-for="i in prcount" :key="i.item_c">{{ i.item_c }} line items</span>
              <span v-else-if="drcount.length > 0" v-for="i in drcount" :key="i.item_count">{{ i.item_count }} line items</span></p>


                </div>

				  </div>


 <div id="noOfPages">
    <label>
Select # of Copies per line item
    </label>
    <input type="number" />
</div> 



<Button label="Print" id="printBtn" @click="handlePrint"></Button>


<div  id="selectPrinter" class="fixed bottom-4 left-0 right-0 flex justify-center z-50">
            <div class="flex flex-col items-center   p-2 ">
                <FeatherIcon name="printer" class="text-gray-500 text-base mb-1 h-6" />
                <span class="text-sm">Select Printer</span>
            </div>
        </div>



			
                

		</template>
       
       
	</BaseLayout>
</template>

<script setup>
import { markRaw, ref,computed, onMounted, watch, onBeforeUnmount,watchEffect,inject, onUnmounted } from "vue"
// import { markRaw } from "vue"

import PurchaceSummary from "@/components/PurchaceSummary.vue"
import BottomTabs from "@/components/BottomTabs.vue"

import QuickLinks from "@/components/QuickLinks.vue"
import BaseLayout from "@/components/BaseLayout.vue"

import { FeatherIcon,createListResource, Input, Button } from "frappe-ui"

import { QrcodeStream } from 'vue-qrcode-reader';
import Quagga from "quagga";

 


import { useRouter } from 'vue-router';


import axios from "axios"



const barcodeScannerOpen = ref(false);
const showScanner = ref(false);
const receiptName = ref("");

const matchedDocType = ref("");
const errorMessage = ref("");




const handleCartIconClick = () => {
  router.push({ name: "ReceivePage" });
};




const openBarcodeScannerPopup = async () => {
  
  

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

    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
        { facingMode: "environment" },
        (qrCodeMessage) => {
            console.log("QR code scanned:", qrCodeMessage);
            alert("QR code scanned: " + qrCodeMessage);
            stopScanner(html5QrCode);

           
            //  handleBarcodeScan(qrCodeMessage);
        },
        (error) => {
            // console.error("Error scanning QR code:", error);
errorMessage.value = error
//  handleBarcodeScan(error);
            alert("QR code: " + error);
handleBarcodeScan(error)

            
            stopScanner(html5QrCode);
        }
    );
};


const stopScanner = (html5QrCode) => {
 
 

 
  html5QrCode.stop();
};





//const handleInputChange = async () => {
	//await checkMatch();
//};

const handleEnterPress = async () => {
	await checkMatch();
	await checkMatchII();

};

const prcount = ref([])
const drcount =  ref([])


const handleBarcodeScan = async (barcode) => {
	errorMessage.value = barcode;
	await checkMatch();
  await checkMatchII()
  
};

const checkMatch = async () => {
const requestValue = errorMessage.value || receiptName.value

	try {
		const purchaseReceipts = await axios.get('/api/method/wms.api.my_api.get_purchase_receiptII', {
      
      params: {
        
       "pr_name": requestValue
      }
     
    });

   
    prcount.value = purchaseReceipts.data.message;
    console.log('prcount',  prcount.value)

    if (prcount.value.length > 0) {
      matchedDocType.value = prcount.value[0].rname;
    } else {
      matchedDocType.value = '';
    }

		showScanner.value = false;
    alert(response.data._server_messages)
    
	} catch (error) {
		console.error('Error fetching data:', error);
    const err = JSON.parse(error.response.data._server_messages)
    alert(err)

	}
};



const checkMatchII = async () => {
const requestValue = errorMessage.value || receiptName.value

	try {
		

  



		const deliveryNotes = await axios.get('/api/method/wms.api.my_api.get_delivery_note', { 
    params: {
        
       "dr_name" : requestValue,
       }
     });
     console.log('dsjfag',deliveryNotes )
     drcount.value = deliveryNotes.data.message;
     console.log('drname', drcount.value[0].dname)
		 if (drcount.value.length > 0) {
      matchedDocType.value = drcount.value[0].dname;
    } else {
      matchedDocType.value = '';
    }
    

    showScanner.value = false;
    alert(response.data._server_messages)



	} catch (error) {
		console.error('Error fetching data:', error);
    const err = JSON.parse(error.response.data._server_messages)
    alert(err)

	}
};








const handlePrint = async () => {

  await checkMatch(); 
	await checkMatchII();

	if (matchedDocType.value === "Unknown") {
		alert("No matching document found.");
		return;
	}
 
  try {
   
    const response = await axios.get('/api/method/frappe.utils.print_format.download_pdf', {
      
      params: {
        
        "doctype":matchedDocType.value,
     "name": errorMessage.value || receiptName.value,
     
      },
      responseType: 'blob', 
    });

   
    const blob = new Blob([response.data], { type: 'application/pdf' });

   
    const url = window.URL.createObjectURL(blob);

   
    const newWindow = window.open(url, '_blank');

   
    newWindow.onload = () => {
     
      newWindow.print();
    };
  } catch (error) {
    console.error('Error fetching PDF:', error);
    alert('no document found')
    
  }
};









</script>

<style>
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
    background-color: white;
    
    height: 100%;
    
}
#scanInput{
    background-color: white;
    width:90%;
    margin-left: 3%;
    height: 40px;
}
#receiptDetails{
  background-color: white;
  width: 90%;
  margin-left: 2%;
  height: 121px;
  border-radius: 10px;
  padding-top: 3%;
  z-index: 0;
  

    
    
}
#receiptDetails > p {
    text-align: center;

}
#noOfPages{
  background-color: white;
  width: 83%;
  margin-left: 10%;
  height: 85px;

  z-index: 0;
 
}
#noOfPages > input{
    height: 38%;
    border-radius: 10px;
    margin-top: 4%; 
    width: 100%;


}
#noOfPages > label{
  text-align: center;
  margin-left:10%;
}

#printBtn{
  background-color: black;
    color: white;
    margin-top: 10%;
    width: 70%;
    margin-left: 15%;
    height: 30px;
    font-size: 16px;
    
    z-index: 0;
}
#selectPrinter{
    position: fixed;
    margin-right: 55%;
    border:none;
}

</style>