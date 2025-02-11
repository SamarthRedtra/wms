<template>
	<BaseLayout :pageTitle="pageTitle" :home="'award'" @cartIconClick="handleCartIconClick"   class="text-xs">
		<template #body>
			<div  class="flex flex-col items-center">
				
				<div @click="handleClick"  id="purchaseDate" class="text-base leading-6  rounded w-full py-6 px-4 border-none">
		    
					
          <div id="dropdownContainer"  @click="toggleAddForm" >
            <div class="dropdown">
				<label>Inspection Type</label>
				<input v-model="apiData.inspection_type" class="selectTag"/>
			
			</div>
			<div class="dropdown" >
				<label>Item Code</label>
				<input v-model="apiData.item_code" class="selectTag"/>

			</div>
			<div class="dropdown">
				<label>Reference Type</label>
				<input v-model="apiData.reference_type" class="selectTag"/>

			</div>
			<div class="dropdown">
				<label>Template</label>
				<input list="searchTemplate" v-model="apiData.quality_inspection_template" class="selectTag" id="selectTemp"/>
				<datalist id="searchTemplate">
							
					<option v-for="link in itemTemplate">{{link.name}}</option>
				
					</datalist>	
			</div>

		</div>	
					
				</div>
				

				

				<div id="addSummary" class="text-base leading-6  rounded  border-none">
					<p>Quality Test</p>
					<FeatherIcon name="plus" class="h-6 w-6 text-black-500 cursor-pointer"  @click="toggleAddForm"/>
  
				  </div>




				  <div id="showdata" class="flex flex-col gap-5 my-4 ">
					<!-- <div class="text-lg font-medium text-gray-900">QuickLinks</div> -->
					<div class="flex flex-col bg-white rounded ">
						<div id="basedOnActiveTabs"
							class="flex flex-row flex-start p-4 items-center justify-between border-b"
							
							
						>
							<div class="flex flex-row items-center gap-3 grow cursor-pointer" @click="toggleAddForm">
								<!-- <component :is="link.icon" class="h-5 w-5 text-gray-500" /> -->
								<!-- <FeatherIcon name="shopping-cart" class="h-5 w-5 text-gray-500" /> -->
								<div v-for="item in apiData.readings" class=" flex gap-15 text-xs font-normal text-gray-800 leading-6">
									<p > param: <p>{{ item.specification }}</p>   </p> 
									<span> status: <p id="newStatus">{{ item.status }}</p> </span>
									<span>reading1: <p id="newReading">{{ item.reading_1 }} </p> </span>
									
								</div>
								
							</div>
							<!-- <FeatherIcon name="chevron-right" class="h-5 w-5 text-gray-500" /> -->
						</div>
					</div>
				</div>


<!-- 
				<div id='statusSelectTag'>
					<label id="statusLabel">Status</label>

				<input v-model="apiData.status" class="selectTag"/>

				
				</div> -->

				
			  

				<div v-if="showAddForm" class="add-form"  >
					
					<div @click="handleClick"  id="space">
					<div @click="handleClick" id="scrollerLine"> </div></div>
					<br>
					
					<label for="itemName">Parameter</label>
					<div class="barcode-input">
						<input placeholder="Enter Parameter" list="searchParameter" id="nameField" v-model="apiData.readings[0].specification" />
						<datalist id="searchParameter">
							
							<option ></option>
						
							</datalist>						
					  </div>

					<br >

					
				<label for="itemName">Status</label>
<div class="barcode-input">
	<input    list="searchStatus" placeholder="Add Status" id="wareHouseName" v-model="apiData.readings[0].status"/>
	<datalist id="searchStatus">
		<option >
		Rejected 
		  </option>
		  <option >
			Accepted
			  </option>
		
		</datalist>		

						
					  </div>
					<br>
					<div class="numericCheckDiv">
                <input type="checkbox" id="numericCheck" v-model="isNumeric">
				<div >Numeric</div>
					</div>
					<br>

					<div class="numericCheckDiv">
						<input type="checkbox" id="manualCheck" v-model="isManual ">
						<div >Manual Inspection</div>
							</div>
							<br>

							<div class="numericCheckDiv">
								<input type="checkbox" id="formulaeCheck" v-model="isFormulae">
								<div >Formulae Based Criteria</div>
									</div>
									<br>
									<div id="formulaeReading" v-show="isFormulae ">
										<label>Formalue Based</label>
										<div >
											
											<input     placeholder="formulae " id="formulaeRead"  v-model="apiData.readings[0].acceptance_formula"/>
										</div>
										<br>	
									</div>
									<br>






							<div id="manualReading" v-show="isManual && !isNumeric">
								<label>Manual Reading</label>
								<div class="barcode-input">
									
									<input   type="number"  placeholder="Manual Value" id="manualRead"  v-model="apiData.readings[0].reading_value"/>
								</div>
								<br>	
							</div>






					<div  id="readingDiv"   v-show="isNumeric">

						<label v-show="isNumeric && !isFormulae ">minimum value</label>
						<div v-show="isNumeric && !isFormulae" class="barcode-input">
							
							<input  v-model="apiData.readings[0].min_value"   placeholder="min value" id="minValue"/>
						</div>
						<br>
						<label v-show="isNumeric && !isFormulae">maximum value</label>
						<div v-show="isNumeric && !isFormulae" class="barcode-input">
							
							<input  v-model="apiData.readings[0].max_value"   placeholder="max value" id="maxValue"/>
						</div>
						<br>
						 <!-- Display reading fields dynamically -->
						 <template v-for="index in visibleReadings">
							<label :for="'reading' + index">Reading {{ index }}</label>
							<div class="barcode-input">
							  <input type="number" :id="'reading' + index" placeholder="change quantity" v-model="apiData.readings[0]['reading_' + index]"/>
							</div>
							<br>
						  </template>
					<br>
				
						<!-- <label >Reading 2</label>
						<div class="barcode-input">
						<input type="number" id="readingII" placeholder="change quantity"   v-model="apiData.readings[0].reading_2" /></div>		
					<br> -->
				
					
						 <!-- <label for="itemName">Reading 3</label>
						<div class="barcode-input">
						<input type="number" id="readingIII" placeholder="change quantity" v-model="apiData.readings[0].reading_3" />		
			</div>
					<br> 
						<label for="itemName">Reading 4</label>
						<div class="barcode-input">
						<input type="number" id="readingIV" placeholder="change quantity"  v-model="apiData.readings[0].reading_4" />		
						</div>
					<br>
				
						<label for="itemName">Reading 5</label>
						<div class="barcode-input">
						<input type="number" id="readingV" placeholder="change quantity"  v-model="apiData.readings[0].reading_5"/>		
						</div>
					<br>
						 <label for="itemName">Reading 6</label>
						<div class="barcode-input">
						<input type="number" id="readingVI" placeholder="change quantity"  v-model="apiData.readings[0].reading_6"/>	
					</div>	
					<br>
				
						<label for="itemName">Reading 7</label>
						<div class="barcode-input">
						<input type="number" id="readingVII" placeholder="change quantity"  v-model="apiData.readings[0].reading_7"/>	
					</div>	
					<br>
				
						 <label for="itemName">Reading 8</label>
						<div class="barcode-input">
						<input type="number" id="readingVIII" placeholder="change quantity"  v-model="apiData.readings[0].reading_8"/>	
					</div>	
					<br> 

						<label for="itemName">Reading 9</label>
						<div class="barcode-input">
						<input type="number" id="readingIX" placeholder="change quantity"  v-model="apiData.readings[0].reading_9"/>	
				</div>	
					<br> 
				
						<label for="itemName">Reading 10</label>
						<div class="barcode-input">						
						<input type="number" id="readingX" placeholder="change quantity"  v-model="apiData.readings[0].reading_10"/>		
					
					</div>  -->
				</div>
				<br>
				<div id="saveSubmitBtn" >
					<button id="addNew"    @click="submitAndAddNew">Submit and Add New</button>
					<br>
					<button id="sub" @click='submit' >Submit </button>
				</div>
				</div>
				 

				<div id="btnDivII" class="w-full flex justify-around  sm:w-96 py-2 standalone:pb-safe-bottom">
                <button id="submitPurchaseReceipt" @click="submitQualityInspection">Submit</button>
				<button id="savePurchaseReceipt"  @click="saveQualityInspection">Save</button>
				</div>
			
			</div>
			


	
			
	

	
		</template>

	</BaseLayout>



</template>

<script setup>
import { markRaw,ref, onUnmounted, watch,computed, onMounted } from "vue"


import BaseLayout from "@/components/BaseLayout.vue"

import { FeatherIcon, createListResource } from "frappe-ui"

import { useRoute } from "vue-router"


import axios from "axios"


const route = useRoute()
const qName = ref('')
const isNumeric = ref(true);
const isManual = ref(false);
const isFormulae = ref(false);

qName.value = route.query.qName;

const showAddForm = ref(false);

const summaryItems = ref([])


const handleClick = async () => {
	
	showAddForm.value = false;


}




const toggleAddForm = () => {
  showAddForm.value = !showAddForm.value;
}

const handleCartIconClick = () => {
   
    router.push({ name: 'QualityInspection' });
}

const selectedQualityNumber = ref('');
  
  const submitAndAddNew = () => {

	submitQualityInspectionReading()

	
	
  };
  const submit = () => {
	
  
	 toggleAddForm();
	 	submitQualityInspectionReading()
	 
	
  
 
  
 

	
  };


let pageTitle = ref("New");






const apiData = ref([]);


	const fetchQualityData = async () => {


	try {
		const response = await axios.get('/api/method/wms.api.my_api.get_quality_details', {
			params: { quality_name: qName.value }
		});
		apiData.value = response.data.message;

		if (apiData.value) {
  
      pageTitle.value = apiData.value.name;
      apiData.value.forEach(item => {
		selectedQualityNumber.value = item.purchase_order; 
        summaryItems.value.push({
			// purchaseOrder : item.purchase_order,
          
          itemCode: item.item_code,
          sample_size: item.sample_size,
          description: item.description,
        });
	})

     

     

	
    } else {
      console.error('Invalid response data:', response.data);
    }


	} catch (error) {
		console.error('Error in quaility Inspection process:', error);
    try {
      const serverMessages = JSON.parse(error.response.data._server_messages);
      const serverMessage = JSON.parse(serverMessages[0]);
      alert(serverMessage.message);
    } catch (parseError) {
      console.error('Error parsing server message:', parseError);
      
    }
	}
};


onMounted(() => {

  const qName = route.query.qName;
  if (qName) {
  
  
      fetchQualityData(qName);
	  
    
  }
});

const qualityNumber = ref('')
const visibleReadings = ref(1); 







const submitQualityInspectionReading = async () => {
  const specification = document.getElementById("nameField").value;
  const minValue = document.getElementById("minValue").value;
  const minV = minValue.value || apiData.value.readings[0].min_value
  const maxValue = document.getElementById("maxValue").value;
  const maxV = maxValue.value || apiData.value.readings[0].max_value
  const manualReadingg = document.getElementById('manualRead').value
  const formulaeReading = document.getElementById('formulaeRead').value
  const formulaeReadd = formulaeReading.value || apiData.value.readings[0].acceptance_formula

const Status = document.getElementById('wareHouseName').value 
const changeStatus = Status.value || apiData.value.readings[0].status

  const numeric = isNumeric.value;
  const manual = isManual.value;
  const formulae = isFormulae.value;
  const qaName = qName.value;

//  const readings = {
//     reading_1: document.getElementById("readingI").value,
//     reading_2: document.getElementById("readingII").value,
//     reading_3: document.getElementById("readingIII").value,
//     reading_4: document.getElementById("readingIV").value,
//     reading_5: document.getElementById("readingV").value,
//     reading_6: document.getElementById("readingVI").value,
//     reading_7: document.getElementById("readingVII").value,
//     reading_8: document.getElementById("readingVIII").value,
//     reading_9: document.getElementById("readingIX").value,
//     reading_10: document.getElementById("readingX").value
//   };
const readings = {};


for (let i = 1; i <= visibleReadings.value; i++) {
  const readingValue = document.getElementById(`reading${i}`).value;
  const propertyName = `reading_${i}`;
  readings[propertyName] = readingValue;
}

  const requestData = {
    specification,
    min_value: minV,
    max_value: maxV,
    numeric:numeric,
	manual_inspection:manual,
	formula_based_criteria:formulae,
    readings,
	status:changeStatus,
	reading_value: manualReadingg,
	acceptance_formula:formulaeReadd ,
    qa_name: qaName
  };
  try {
    const response = await axios.post('/api/method/wms.api.my_api.make_quality_inspection_reading', requestData);
    if (response.data.status === "success") {
   
    
    } else {
     if(visibleReadings.value < 10) {
		visibleReadings.value += 1
	 }
    }
  } catch (error) {
    
      const serverMessages = JSON.parse(error.response.data._server_messages);
      const serverMessage = JSON.parse(serverMessages[0]);
      alert(serverMessage.message);
    
  }
};




const submitQualityInspection = async () => {
    try {
        const requestData = {
            qa_name: pageTitle.value || qName.value
        };


        const response = await axios.post('/api/method/wms.api.my_api.submit_quality_inspections', requestData);

		qualityNumber.value = response.data.message[0]
        
     
            alert(response.data.message.msg);
        
    }  catch (error) {
		console.error('Error in quality inspection process:', error);
    try {
      const serverMessages = JSON.parse(error.response.data._server_messages);
      const serverMessage = JSON.parse(serverMessages[0]);
      alert(serverMessage.message);
    } catch (parseError) {
      console.error('Error parsing server message:', parseError);
      
    }
    }
};


const selectedTemplate = ref('');


const saveQualityInspection = async () => {
    try {
		const qa_temp_template = document.getElementById('selectTemp').value
        const requestData = {
            qa_name: pageTitle.value || qName.value,
			
			qa_temp: qa_temp_template.value || apiData.value.quality_inspection_template 
        };


        const response = await axios.post('/api/method/wms.api.my_api.edit_qa_inspection', requestData);

		
            alert(response.data.message.name && response.data.message.msg);
        
    }   catch (error) {
        console.error('Error in quality inspection process:', error);
    try {
      const serverMessages = JSON.parse(error.response.data._server_messages);
      const serverMessage = JSON.parse(serverMessages[0]);
      alert(serverMessage.message);
    } catch (parseError) {
      console.error('Error parsing server message:', parseError);
      
    }
    }
};







const itemTemplate = ref([])

const getItemTemplate = async () => {
	try{
      const templateData = await axios.get('/api/method/wms.api.my_api.get_quality_template', {

	  })
	  itemTemplate.value =  templateData.data.message
	}
	

	catch{
console.log('error::::', error.templateData)
	}
}

getItemTemplate();








</script>

<style>

#dropdownContainer{
	
	width: 100%;
	height: 150px;
	display: flex;
	flex-wrap: wrap;
	
	justify-content: space-around;
}
.dropdown{
	
	width:45%;
	height:45%;
	
}
.selectTag{
	width:100%;
	height:50%;
	font-size: 12px;
	border-radius: 7px;
	background-color: rgb(240, 238, 238);

}

#qualityTest{
	
	font-size: 18px;
	margin-right: 58%;

}
#statusSelectTag{
	
	width:50%;
	height:60px;
	justify-content: center;
	margin-top:5%;
	margin-bottom:25%;
}
#statusLabel{
	text-align:center;
	margin-left: 30%;
	font-size: 16px;
}
#statusSelectTag > select{
	height:60%;
	margin-top: 2%;
}
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
	height:30px;
	
}
#readingI{
	border:none;
	height: 30px;
}
#readingFields > input{
	border:none;
	height: 30px;
}
#readingFields > label{
	font-size: 12px;
}

#readingII{
	border:none;
	height: 30px;
}
#readingIII{
	border:none;
	height: 30px;
}

#readingIV{
	border:none;
	height: 30px;
}
#readingV{
	border:none;
	height: 30px;
}
#readingVI{
	border:none;
	height: 30px;
}
#readingVII{
	border:none;
	height: 30px;
}
#readingVIII{
	border:none;
	height: 30px;
}
#readingIX{
	border:none;
	height: 30px;
}
#readingX{
	border:none;
	height: 30px;
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
	height:30px;
}
#minValue{
	width:100%;
	height:30px;
}
#maxValue{
	width:100%;
	height:30px;
}
#scrollerLine{
	border: 2px solid gray;
	width: 50%;
    margin-left: 25%;
	height:1px;
	cursor:pointer;
	border-radius: 10px;

}
#saveSubmitBtn{
	height:40%;
}

.numericCheckDiv{
	display: flex;
	justify-content: flex-start;
	gap: 5%;
	font-size: 12px;
	 height: 16px;
}
#manualReading > label{
font-size: 12px;
}
#formulaeReading > label{
	font-size: 12px;
}
#formulaeRead{
	height: 150px;
	overflow: auto;
}
#formulaeReading > input {
	background-color: #fdf9f9;
   
    border: none;
}
#manualRead{
	height: 30px;
	border:none;
	overflow:auto;
}
#numericCheck{
	height: 100%;
    width: 6%;
}

#manualCheck{
	height: 100%;
    width: 6%;
}
#formulaeCheck{
	height: 100%;
    width: 6%;
}
#readingDiv >label{
font-size:12px;
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
  .add-form > label{
	font-size: 12px;
	color: rgb(46, 45, 45);
  }
  .add-form > input::placeholder{
	font-size: 10px;
  }
  
  .barcode-input {
	position: relative;
  }
  .barcode-input > input::placeholder{
	font-size: 10px;
  }
  
  .barcode-input> input{
	background-color: #fdf9f9;
	height:30px;
	border:none;
	width:100%;
	
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

#cir{
	
	color: rgb(109, 106, 106);
	width: auto;
	text-align: center;
	height: auto;
	font-size: 10px;
	padding: 2% 2% 2% 10%;
}
#btnDivII{
	
    position: fixed;
    bottom: 0;

	
	

}

body {
	margin: 0;
	padding: 0;
	height: 100%;
}
#btnDivII > button{
	width:45%;
	font-size:16px;
	font-weight: bold;

}
#btnDivII > :nth-child(1){
	background-color: black;
	color: white;
	height: 40px;
	box-sizing: border-box;
	border-radius: 10px;
	
}
#btnDivII > :nth-child(2){
	background-color: white;
	color: black;
	height: 40px;
	box-sizing: border-box;
	border-radius: 10px;
	border:1px solid gray;
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
	width:90%;
}
#showdata{
	width:90%;
}

#barcodeScanner {
	width: auto;
	height: 200px;
	margin-top: 5%;
  }
  #addNew{
	background-color: black;
    color: white;
    border-radius: 5px;
    font-size: 14px;
    height: 36px;
    width: 100%;

  }
  #sub
  {
	background-color: whitesmoke;
	color: black;
	border-radius:5px;
	font-size:14px;
	height:40px;
	width: 100%;
	margin-top:5%;
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