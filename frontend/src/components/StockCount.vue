<template>
	<BaseLayout pageTitle="Stock Count">
		<template #body>
			<div class="flex flex-col items-center my-7 p-4 gap-7">
                <div class="flex  w-full  border-none">
                    <h2 class="text-lg font-medium text-gray-900">Stock Summary</h2>
                </div>
                <div id="purchaseDate" class="text-base leading-6 bg-white rounded w-full py-6 px-4 border-none">
                    <div class='innerDiv'>
                        <div class="textDiv">
                            <p>Total Items</p>
                            <h3 class="font-bold">{{ itemCode.length }}</h3>
                        </div>
                        <div class="textDiv">
                            <p>Total Warehouse</p>
                            <h3 class="font-bold">{{ warehouse.length }}</h3>
                        </div>
                    </div>
                    <div class='innerDiv'>
                        <div class="textDiv">
                            <p>Total Stock Value</p>
                            <h3 class="font-bold">${{ totalNetTotal !== undefined ? totalNetTotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0.00' }}</h3>
                        </div>
                        <div class="textDiv">
                            <p>Draft</p>
                            <h3 class="font-bold">{{ draftDocCount }}</h3>
                        </div>
                    </div>
                </div>
				<div class="w-full">
					<Button @click="navigate" variant="solid" class="w-full py-5 text-base font-bold">New Stock Count</Button>
				</div>
				<div class="flex  w-full  border-none my-5">
                    <h2 class="text-lg font-medium text-gray-900">Recent Stock Reconciliations</h2>
				</div>
				<div id="receiptDetail" class="flex flex-col gap-5 my-4 w-full">
					<div class="flex flex-col bg-white rounded">
						<div id="basedOnActiveTabs" class="flex flex-row flex-start p-4 items-center justify-between border-b" v-for="link in paginatedData" :key="link.id" @click="handleDivClick(link)">
							<div class="flex flex-row items-center gap-3 grow">
								<FeatherIcon name="shopping-bag" class="h-5 w-5 text-gray-500" />
								<div class="text-xs font-normal text-gray-800 leading-6">
									<p>{{ link.name }}</p>                     
									<p>{{ link.item_code }} | {{ link.warehouse }}</p>
								</div>
								<div id="circle">{{ link.docstatus }}</div>
							</div>
							<FeatherIcon name="chevron-right" class="h-5 w-5 text-gray-500" />
						</div>
					</div>
				</div>
				<div class="flex justify-center gap-2">
					<button class="paginationButton" @click="prevPage" :disabled="currentPage === 1">Prev</button>
					<span>{{ currentPage }} of {{ totalPages }}</span>
					<button class="paginationButton" @click="nextPage" :disabled="currentPage === totalPages">Next</button>
				</div>
			</div>
		</template>
	</BaseLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRouter } from 'vue-router';
import BaseLayout from "@/components/BaseLayout.vue"
import { FeatherIcon, createListResource, createResource } from "frappe-ui"
import axios from "axios"

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

const invoicesT = createListResource({
  doctype: 'Purchase Order',
  fields: ['*'],
  filters: {
    docstatus: 1,
  },
  auto: true,
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

const invoicesII = createListResource({
  doctype: 'Purchase Order',
  fields: ['*'],
  auto: true,
})

const totalNetTotal = computed(() => {
	if(invoicesII.data){
    return invoicesII.data.reduce((total, link) => {
        return total + parseFloat(link.net_total || 0);
    }, 0);
}
});

onMounted(() => {
  console.log("RequestPanel.vue is mounted");
});

const currentPage = ref(1);
const itemsPerPage = 6;

let purchaseReceiptData = ref([])
const totalItems = ref(0)
const draftDocCount = ref(0);

const fetchData = async () => {
	try {
		const response = await axios.get('/api/method/wms.api.my_api.get_stock_reconsillation')
		purchaseReceiptData.value = response.data.message;
        totalItems.value = purchaseReceiptData.value.map(item => item.item_code).length
        draftDocCount.value = purchaseReceiptData.value.filter(item => item.docstatus === 'Draft').length;
	} catch (error) {
		console.log('error while fetching data', error.response)
	}
}

fetchData()

const getFilteredInvoices = computed(() => {
  const data = purchaseReceiptData.value || [];
  return data;
});

const paginatedData = computed(() => {
	const start = (currentPage.value - 1) * itemsPerPage;
	const end = start + itemsPerPage;
	return getFilteredInvoices.value.slice(start, end).sort((a, b) => b.name.localeCompare(a.name));
});

const totalPages = computed(() => {
	return Math.ceil(getFilteredInvoices.value.length / itemsPerPage);
});

const nextPage = () => {
	if (currentPage.value < totalPages.value) {
		currentPage.value++;
	}
};

const prevPage = () => {
	if (currentPage.value > 1) {
		currentPage.value--;
	}
};

const router = useRouter();

const handleDivClick = (link) => {
  router.push({ name: 'NewStockCount', query: { linkName: link.name } });
};

const navigate = () => {
	router.push({ name: "NewStockCount" })
}

const warehouse = ref([])

const fetchWarehouse = async () => {
  try {
	const response = await axios.get('/api/method/wms.api.my_api.get_warehouse_list')
	warehouse.value = response.data.message
  } catch (error) {
	console.error('Error fetching warehouse:', error);
  }
}

fetchWarehouse()

const itemCode = ref([])

const fetchItemCode = async () => {
  try {
	const response = await axios.get('/api/method/wms.api.my_api.get_items')
	itemCode.value = response.data.message
  } catch (error) {
	console.error('Error fetching items:', error);
  }
}

fetchItemCode()
</script>

<style>
.innerDiv {
	height: 60px;
	width: 100%;
	display: flex;
}
#purchaseDate {
	display: flex;
	flex-wrap: wrap;
}
.textDiv {
	width: 50%;
	height: 100%;
}
.clickable-div {
    cursor: pointer;
}
#circle {
	border: 1px solid rgb(207, 200, 200);
	border-radius: 30px;
	width: auto;
	text-align: center;
	height: auto;
	font-size: small;
	padding: 2%;
}
#basedOnActiveTabs {
	cursor: pointer;
}
.paginationButton {
	font-size: 12px;
	width: 60px;
	height: 30px;
	background-color: rgb(240, 233, 233);
	border-radius: 10px;
	box-shadow: 0px 0px 3px 0px;
}
#receiptDetail {
	margin-top: -10%;
}
</style>
