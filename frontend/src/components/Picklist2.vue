<template>
	<BaseLayout pageTitle="PickList">
		<template #body>
			<!-- <div>Hello</div>
			<div class="p-2">
			<Autocomplete
				:options="[
					{
						label: 'John Doe',
						value: 'john-doe',
						image: 'https://randomuser.me/api/portraits/men/59.jpg',
					},
					{
						label: 'Jane Doe',
						value: 'jane-doe',
						image: 'https://randomuser.me/api/portraits/women/58.jpg',
					},
					{
						label: 'John Smith',
						value: 'john-smith',
						image: 'https://randomuser.me/api/portraits/men/59.jpg',
					},
					{
						label: 'Jane Smith',
						value: 'jane-smith',
						image: 'https://randomuser.me/api/portraits/women/59.jpg',
					},
					{
						label: 'John Wayne',
						value: 'john-wayne',
						image: 'https://randomuser.me/api/portraits/men/57.jpg',
					},
					{
						label: 'Jane Wayne',
						value: 'jane-wayne',
						image: 'https://randomuser.me/api/portraits/women/51.jpg',
					},
				]"
				v-model="search"
				placeholder="Select person"
				@input="getValues"
			/>
			</div> -->
			<div class="badge-container">
			<h2 class="heading text-lg font-bold text-gray-900">Pick List</h2>
				<Badge
				:variant="'solid'"
				:theme="'green'"
				size="md"
				label="Badge"
				v-if="item.custom_item_picked"
				>
				Scanned
				</Badge>

				<Badge
				:variant="'solid'"
				:theme="'red'"
				size="md"
				label="Badge"
				v-if="item.custom_skipped"
				>
				Skipped
				</Badge>
			</div>
			<div class="picklist-main-container">
				<div class="search-container">
					<div class="in-pack">
						<label class="field-label text-base font-normal text-gray-800">Select Picklist:</label>
						<div class="p-2">
							<TextInput
								:type="'text'"
								size="sm"
								variant="subtle"
								placeholder="Pick List"
								:disabled="false"
								modelValue=""
								@click="getValues"
								:value="search"
								@input="getValues"
							/>
						</div>
						<!-- <input class="search_bar" @click="sugg=true" :value="search" type="select" @input="getValues"> -->
						<div v-if="sugg" class="sugg-list">
							<button class="sugg-button" v-for="list in pick_lists" @click="assignAndClose">{{list.name}}</button>
						</div>
					</div>
					<div>
						<button :class="[sugg ? '' : 'hide','exit-search']" @click="sugg=!sugg">❌</button>
					</div>
				</div>
				<div class="picklist-data" v-if="!picklist_complete">
					<div class="data-fields">
						<label class="field-label text-base font-normal text-gray-800">Item Code</label>
						<div class="p-2">
							<TextInput
								:type="'text'"
								size="sm"
								variant="subtle"
								placeholder="Item Code"
								:disabled="true"
								modelValue=""
								:value="item.item_code"
							/>
						</div>
					</div>
					<div class="data-fields">
						<label class="field-label text-base font-normal text-gray-800">Item Name</label>
						<div class="p-2">
							<TextInput
								:type="'text'"
								size="sm"
								variant="subtle"
								placeholder="Item Name"
								:disabled="true"
								modelValue=""
								:value="item.item_name"
							/>
						</div>
					</div>
					<div class="data-fields">
						<label class="field-label text-base font-normal text-gray-800">Qty  of <span style="color:red;font-weight:bold">{{ item.qty }}</span></label>
						<div class="p-2">
							<TextInput
									:type="'number'"
									min="0"
									:max="item.qty"
									size="sm"
									variant="subtle"
									placeholder="Qty"
									:disabled="item.custom_item_picked || item.custom_skipped?true:false"
									modelValue=""
	
									@input="(e)=>item.custom_qty_scanned=e.target.value"
									:value="item.custom_item_picked || item.custom_skipped?item.custom_qty_scanned:item.qty"
								/>
						</div>
					</div>
					<div class="data-fields">
						<label class="field-label text-base font-normal text-gray-800">Warehouse</label>
						<div class="p-2">
							<TextInput
									:type="'text'"
									size="sm"
									variant="subtle"
									placeholder="Warehouse"
									:disabled="true"
									modelValue=""
									:value="item.warehouse"
								/>
						</div>
					</div>
					<div class="data-fields text-base font-normal text-gray-800" v-if="!item.custom_item_picked && !item.custom_skipped">
						<label class="field-label">Scanner Input</label>
						<div class="p-2">
							<TextInput
									:type="'text'"
									size="sm"
									variant="subtle"
									placeholder=""
									:disabled="false"
									modelValue=""
									v-model="scannedValue"
									:value="scannedValue"
								/>
						</div>
					</div>
					<div class="data-fields skip-scan" v-if="item.item_code">
						<div >
							<!-- <Button
							:variant="'outline'"
							theme="gray"
							size="sm"
							label="Button"
							:loading="false"
							:loadingText="null"
							:disabled="false"
							:link="null"
							@click="runScanner"
							v-if="!item.custom_item_picked && !item.custom_skipped"
							>
							Scan
							</Button> -->

							<Button
							:variant="'outline'"
							theme="gray"
							size="sm"
							label="Button"
							:loading="false"
							:loadingText="null"
							:disabled="false"
							:link="null"
							@click="sendScanData"
							v-if="!item.custom_item_picked && !item.custom_skipped"
							>
							Submit Scan
							</Button>
							
						</div>
						<div >
							<Button
							:variant="'outline'"
							theme="gray"
							size="sm"
							label="Button"
							:loading="false"
							:loadingText="null"
							:disabled="false"
							:link="null"
							@click="cnf_dia=true"
							v-if="!item.custom_item_picked && !item.custom_skipped"
							>
							Skip
							</Button>
							
						</div>
					</div>
				</div>
				<div class="submit-container" v-if="picklist_complete">
					<Button
						:variant="'solid'"
						theme="gray"
						size="sm"
						label="Button"
						:loading="false"
						:loadingText="null"
						:disabled="false"
						:link="null"
						@click="()=>submitPicklist({'name':loaded_picklist})"
						>
						Submit
						</Button>
				</div>
				<div :class="[picklist_items.length>0 ? '':'hide','counter']">{{ counter+1 }}/{{ picklist_items.length }}</div>
				<div v-if="picklist_items.length>0 && !picklist_complete" class="button-container">
					<div class="prev">
						<Button
						:variant="'subtle'"
						theme="gray"
						size="sm"
						label="Button"
						:loading="false"
						:loadingText="null"
						:disabled="false"
						:link="null"
						@click="()=>listNavigate('dec')"
						>
						Prev
						</Button>
					</div>
					<div class="next">
						<Button
						:variant="'solid'"
						theme="gray"
						size="sm"
						label="Button"
						:loading="false"
						:loadingText="null"
						:disabled="false"
						:link="null"
						@click="()=>listNavigate('inc')"
						>
						Next
						</Button>
					</div>
				</div>
				<!-- <Button @click="dialog2 = true">
				Show Dialog
				</Button> -->
				<Dialog v-model="dialog2">
				<template #body-title>
					<h3>Notification</h3>
				</template>
				<template #body-content>
					<p>{{ dialogmsg }}</p>
				</template>
				<!-- <template #actions>
					<Button variant="solid">
					Confirm
					</Button>
					<Button
					class="ml-2"
					@click="dialog2 = false"
					>
					Close
					</Button>
				</template> -->
				</Dialog>
				<Dialog v-model="dialog3">
				<template #body-title>
					<h3>Scanner</h3>
				</template>
				<template #body-content>
					<div id="reader"></div>
				</template>
				<!-- <template #actions>
					<Button variant="solid">
					Confirm
					</Button>
					<Button
					class="ml-2"
					@click="dialog2 = false"
					>
					Close
					</Button>
				</template> -->
				</Dialog>
				<Dialog
				:options="{
					title: 'Confirm',
					message: 'Are you sure you want to skip these',
					size: 'xl',
					actions: [
					{
						label: 'Confirm',
						variant: 'solid',
						onClick: () => {
								console.log('confirm');
								cnf_dia=false
								skipItem({picklist:loaded_picklist,name:item.name})
								},
					},
					],
				}"
				v-model="cnf_dia"
				/>
			<Loading v-if="loading"/>
			</div>
		</template>
	</BaseLayout>
</template>

<script setup>
	import { ref,reactive } from "vue";
	import BaseLayout from "@/components/BaseLayout.vue"
	import Loading from "@/components/Loading.vue"
	import {Autocomplete,TextInput,Button,Spinner,Dialog,Badge} from "frappe-ui"
	import { Html5QrcodeScanner } from "html5-qrcode";

	const search=ref('')
	const sugg = ref(false)
	const pick_lists=ref([])
	const t_out=ref(false)
	const picklist_items=ref([])
	const loaded_picklist=ref("")
	const counter=ref(0)
	const scannedValue=ref('')
	const loading=ref(false)
	const dialog2= ref(false)
	const dialog3= ref(false)
	const dialogmsg=ref('')
	const picklist_complete=ref(false)
	const cnf_dia=ref(false)


	const item= reactive({
		"name":"",
		"item_code":"",
		"qty":"",
		"warehouse":"",
		"custom_item_picked":false,
		"item_name":"",
		"custom_qty_scanned":"",
		"custom_skipped":false,
		"barcode":[]
	})
	
	function getValues(e){
		sugg.value=true
		search.value=e.target.value
		console.log("triff",search.value)
		if(!t_out.value){
			setTimeout(async ()=>{
				if (!!search.value){
					pick_lists.value=await fetchData("Pick List",`"name"`,JSON.stringify([[encodeURIComponent("name"),encodeURIComponent("like"),`${encodeURIComponent('%'+search.value+'%')}`],["workflow_state","=","Draft"]]))
				}else{
					pick_lists.value=await fetchData("Pick List",`"name"`,JSON.stringify([["workflow_state","=","Draft"]]))
				}
				console.log("data",pick_lists.value)
				t_out.value=false
			},500)
			t_out.value=true
		}else{
			return 
		}
	}

	async function assignAndClose(e){
		console.log(e.target.innerHTML)
		search.value=e.target.innerHTML
		await checkPicklist()
		picklist_items.value=await get_picklist_items(e.target.innerHTML)
		sugg.value=false
		if (picklist_items.value){
			item.name=picklist_items.value[0].name
			item.item_code=picklist_items.value[0].item_code
			item.warehouse=picklist_items.value[0].warehouse
			item.custom_item_picked = picklist_items.value[0].custom_item_picked
			item.item_name = picklist_items.value[0].item_name
			item.qty=picklist_items.value[0].qty
			item.custom_qty_scanned=picklist_items.value[0].custom_qty_scanned
			item.custom_skipped=picklist_items.value[0].custom_skipped
			item.barcode=picklist_items.value[0].barcode
			if(!picklist_items.value[0].custom_item_picked && !picklist_items.value[0].custom_skipped){
				item.custom_qty_scanned=picklist_items.value[0].qty
			}
			// if (picklist_items.value[0].custom_item_picked){
			// 	item.qty=picklist_items.value[0].custom_qty_scanned
			// }else{
			// 	item.qty=picklist_items.value[0].qty
			// }
			counter.value = 0
			loaded_picklist.value=search.value
		}
	}


	function listNavigate(op){
		console.log("op",op)
		if (op == "inc"){
			if (counter.value < picklist_items.value.length-1 && (item.custom_item_picked || item.custom_skipped)){
			// if (counter.value < picklist_items.value.length-1 ){
				console.log("plus plus")
				counter.value +=1
				scannedValue.value=""
			}else{
				dialogmsg.value = "Please Scan Current Item to Continue."
				dialog2.value = true
			}
		}else{
			if (counter.value > 0){
				console.log("minus minus")
				counter.value -=1
			}
		}
		console.log("pi",picklist_items.value,counter.value)
		item.name=picklist_items.value[counter.value].name
		item.item_code=picklist_items.value[counter.value].item_code
		item.qty=picklist_items.value[counter.value].qty
		item.warehouse=picklist_items.value[counter.value].warehouse
		item.custom_item_picked = picklist_items.value[counter.value].custom_item_picked
		item.item_name = picklist_items.value[counter.value].item_name
		item.custom_qty_scanned=picklist_items.value[counter.value].custom_qty_scanned
		item.custom_skipped=picklist_items.value[counter.value].custom_skipped
		item.barcode=picklist_items.value[counter.value].barcode

		if(!picklist_items.value[counter.value].custom_item_picked && !picklist_items.value[counter.value].custom_skipped){
			console.log("not skipped/scanned item")
			item.custom_qty_scanned=picklist_items.value[counter.value].qty
		}
		// if (picklist_items.value[counter.value].custom_item_picked){
		// 	item.qty=picklist_items.value[counter.value].custom_qty_scanned
		// }else{
		// 	item.qty=picklist_items.value[counter.value].qty
		// }
	}

	// adding scanner
	function runScanner(){
		
		console.log("scanner",Html5QrcodeScanner)

		dialog3.value = true

		setTimeout(()=>{
			const scanner = new Html5QrcodeScanner("reader",{
				qrbox:{
					width:200,
					height:150,
				},
				fps:20,
			})
	
			scanner.render(success,error)
	
			function success(result){
				console.log("result",result)
				scannedValue.value=result
				scanner.clear()
				sendScanData()
			}
	
			function error(){
				console.log("erroro",error)
			}
	
			

		},500)

	}

	async function checkPicklist(){
		console.log('running check picklist api')
		loading.value=true
		let response= await fetch(`/api/method/wms.picklist_api.checkAndSubmit?name=${search.value}`,{
			method:'GET',
			// headers:{
			//     'Authorization':'token 9aceaa0ecbc6c40:3b8c45594ee6fd4'
			// }
		})
		console.log('response',response)
		let value= await response.json()
		loading.value=false
		if (value.message){
			picklist_complete.value=true		
		}else{
			picklist_complete.value=false
		}
		console.log('picklist check completion value',value.message)
		return value.message
	}

	async function sendScanData(){
		console.log("scann val",scannedValue.value)
		if (qtyUpdate(item.custom_qty_scanned)){
			return
		}
		if (((item.barcode).includes(scannedValue.value) || item.item_code == scannedValue.value) && item.item_code != ""){
			console.log("barcode valid mark as scanned")
			updatePicklist({
				"picklist":search.value,
				"name":item.name,
				"item_code":item.item_code,
				"qty":item.custom_qty_scanned,
				"warehouse":item.warehouse,
			})
		}else{
			console.log("invalid barcode")
			dialogmsg.value = "Value for item is incorrect"
			console.log("dialogmsg.value",dialogmsg.value)
			dialog2.value = true
		}
	}

	// submit picklist
	async function submitPicklist(data){
		console.log('submit pick list api')
		console.log(data)
		loading.value=true
		let response= await fetch(`/api/method/wms.picklist_api.submit_pick_list`,{
			method:'POST',
			body:JSON.stringify(data),		
			headers:{
				'Accept': 'application/json',
        		'Content-Type': 'application/json',
			    // 'Authorization':'token 9aceaa0ecbc6c40:3b8c45594ee6fd4'
			}
		})
		console.log('response',response.status)
		let value= await response.json()
		loading.value=false
		if (response.status == 200){
			if (value.message.status){
				dialogmsg.value = value.message.msg
				dialog2.value = true
				hardReset()
			}
		}
		console.log('value',value)
	}

	// skip item
	async function skipItem(data){
		console.log('running skip item api')
		console.log(data)
		loading.value=true
		let response= await fetch(`/api/method/wms.picklist_api.skipItem`,{
			method:'POST',
			body:JSON.stringify(data),		
			headers:{
				'Accept': 'application/json',
        		'Content-Type': 'application/json',
			    // 'Authorization':'token 9aceaa0ecbc6c40:3b8c45594ee6fd4'
			}
		})
		console.log('response',response.status)
		let value= await response.json()
		loading.value=false
		if (response.status == 200){
			dialogmsg.value = "Item Skipped"
			dialog2.value = true
			picklist_items.value[counter.value].custom_skipped = true
			item.custom_skipped = true
			item.custom_qty_scanned=0
			if (value.message.submit){
				picklist_complete.value=true
			}
		}
		console.log('value',value)
	}

	async function updatePicklist(data){
		console.log('running create api')
		console.log(data)
		loading.value=true
		let response= await fetch(`/api/method/wms.picklist_api.updatePicklist`,{
			method:'POST',
			body:JSON.stringify(data),		
			headers:{
				'Accept': 'application/json',
        		'Content-Type': 'application/json',
			    // 'Authorization':'token 9aceaa0ecbc6c40:3b8c45594ee6fd4'
			}
		})
		console.log('response',response.status)
		let value= await response.json()
		loading.value=false
		if (response.status == 200){
			dialogmsg.value = "Item Scanned Sucessfully"
			dialog2.value = true
			picklist_items.value[counter.value].custom_item_picked = true
			item.custom_item_picked = true
			if (value.message.submit){
				picklist_complete.value=true
			}
		}
		console.log('value',value)
	}

	function hardReset(){
		search.value=""
		sugg.value= false
		pick_lists.value=[]
		t_out.value=false
		picklist_items.value=[]
		loaded_picklist.value=""
		counter.value=0
		scannedValue.value=''
		loading.value=false
		// dialog2.value= false
		dialog3.value= false
		// dialogmsg.value=''
		picklist_complete.value=false

		item.name= ""
		item.item_code= ""
		item.qty= ""
		item.warehouse= ""
		item.item_name= ""
		item.custom_item_picked = false

	}

	function qtyUpdate(e){
		console.log("qty update",e,item.qty)
		picklist_items.value[counter.value].custom_qty_scanned = e
		if(e <= 0 || e > item.qty){
			console.log("inside if")
			dialogmsg.value = "Qty should be greater than zero and less than Qty provided for scanning"
			dialog2.value = true
			return true
		}else{
			console.log("else")
			return false
		}
	}

	//get pick lists
	async function fetchData(docName,fields,filters){
		console.log('running fetch api',`/api/resource/${docName}?fields=[${fields}]&filters=${filters}`)
		loading.value=true
		let response= await fetch(`/api/resource/${docName}?fields=[${fields}]&filters=${filters}&limit=5`,{
			method:'GET',
			// headers:{
			//     'Authorization':'token 9aceaa0ecbc6c40:3b8c45594ee6fd4'
			// }
		})
		console.log('response',response)
		let value= await response.json()
		console.log('value',value)
		loading.value=false
		return value.data
	}

	//get child items
	async function get_picklist_items(name){
    console.log('running get_picklist_items api')
	loading.value=true
    let response= await fetch(`/api/method/wms.picklist_api.get_picklist_items?name=${name}`,{
        method:'GET',
        // headers:{
        //     'Authorization':'token 9aceaa0ecbc6c40:3b8c45594ee6fd4'
        // }
    })
    console.log('response',response)
    let value= await response.json()
	loading.value=false
    console.log('value',value.message)
    return value.message
}
</script>

<style scoped>
	.in-pack{
		display:flex;
		flex-direction: column;
		/* width: 80%; */
		position: relative;
		margin-left: 10px;
	}
	.sugg-list{
		background-color: aliceblue;
		display: flex;
  		flex-direction: column;
		margin:5px 0px;
		gap: 5px;

		position: absolute;
		top: 60px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 10;
		width: 90%;
		background: white;
		border-radius: 10px;
		overflow: hidden;

		box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
	}
	.search-container{
		display: flex;
		/* padding: 10px; */
		justify-content: center;		
	}
	.search_bar{
		text-align: center;
	}
	.exit-search{
		margin-top: 26px;
	}
	.picklist-data{
		display: flex;
		flex-direction: column;
		gap: 2rem;
		align-items: center;
	}
	.data-fields{
		width: 90%;
	}
	.picklist-main-container{
		background: white;
		padding: 20px 20px;
		padding-top: 50px;
		margin: 35px;
		margin-top: 0px;
		border-radius: 10px;

		display: flex;
  		flex-direction: column;
  		gap: 2rem;
	}
	.sugg-button{
		background-color: transparent;
		transition: 0.5s all;
	}
	.sugg-button:hover{
		background-color: #e9e9e9;
	}
	.button-container{
		display: flex;
		justify-content: space-between;
		margin: 0px 20px;
	}
	.hide{
		visibility: hidden;
	}
	.heading{
		/* padding: 20px 20px 0px 20px; */
		font-weight: 400;
		letter-spacing: 0.5px;
	}
	.counter{
		/* width:80%; */
		margin: 0px 20px;
		text-align: right;
	}
	/* #reader{
		width: 200px;
		height: 100px;
		border:solid;
		margin: auto;
	} */
	.badge-container{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 11px 40px;
	}
	.field-label{
		padding-left: 10px;
	}
	.submit-container{
		margin: auto;
	}
	.qty-field{
		width:100%
	}
	.skip-scan{
		display: flex;
		justify-content: space-evenly;
	}
	
</style>
