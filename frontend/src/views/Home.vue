<template>
	<BaseLayout>
		<template #body>
			<div class="flex flex-col  my-7 p-4 gap-7">
             <h2 id="hII">Shortcuts</h2>
				<div id="container">
					<router-link to="/ItemInquiry" >
                <div class="iconDiv">

					<div class="icon">
						<FeatherIcon name="package" class="h-11 w-11"/>
					</div>
					<div class="text">Item Enquiry</div>


				</div>
			</router-link>
			<router-link to="/BinInquiry">
				<div class="iconDiv">
					<div class="icon">
						<FeatherIcon name="zoom-in" class="h-11 w-11"/>
					</div>
					<div class="text">Bin Enquiry</div>

				</div>
			</router-link>
			<router-link to="/StockCount">
				<div class="iconDiv">
					<div class="icon">
						<FeatherIcon name="edit" class="h-11 w-11"/>
					</div>
					<div class="text">Stock Count</div>
				</div>
			</router-link>
				<router-link to="/ReceivePage"> <div class="iconDiv">
					<div class="icon">
						<FeatherIcon name="shopping-cart" class="h-11 w-11"/>
					</div>
					<div class="text">Receive</div>

				</div>
			</router-link>
			<router-link to='/Deliver'>
				<div class="iconDiv">
					
					<div class="icon">
						<FeatherIcon name="truck" class="h-11 w-11"/>
					</div>
					<div class="text">Deliver</div>
				
				</div>
			</router-link>
				<router-link to="/MaterialRequest">
					<div class="iconDiv">
						<div class="icon">
							<FeatherIcon name="shopping-bag" class="h-11 w-11"/>
						</div>
						<div class="text">Mat. Request</div>
	
					</div>
				</router-link>
				<router-link to="/StockEntryList">
					<div class="iconDiv">
						<div class="icon">
							<FeatherIcon name="layers" class="h-11 w-11"/>
						</div>
						<div class="text">Stock Entry</div>
	
					</div>	
				</router-link>
				<router-link to="/PickList">
				<div class="iconDiv">
					<div class="icon">
						<FeatherIcon name="file-text" class="h-11 w-11"/>
					</div>
					<div class="text">Pick List</div>

				</div>
			</router-link>
				<router-link to="/Packing">
					<div class="iconDiv">
						<div class="icon">
							<FeatherIcon name="codesandbox" class="h-11 w-11"/>
						</div>
						<div class="text">Packing</div>
	
					</div>
				</router-link>
				<router-link to='/PrintLab'>

				
				<div class="iconDiv">
					<div class="icon">
						<FeatherIcon name="printer" class="h-11 w-11"/>
					</div>
					<div class="text">Print Label</div>

				</div>
			</router-link>

			<router-link to='/QualityInspection'>
				<div class="iconDiv">
					<div class="icon">
						<FeatherIcon name="award" class="h-11 w-11"/>
					</div>
					<div class="text">Quality Check</div>

				</div>
				</router-link>
					<router-link to="/pick-list">
						<div class="iconDiv">
							<div class="icon">
								<FeatherIcon name="file-text" class="h-11 w-11"/>
							</div>
							<div class="text">Pick List2</div>

						</div>
					</router-link>

				</div>
				<!-- <CheckInPanel /> -->
				<!-- <QuickLinks :items="quickLinks" title="Quick Links" /> -->
				<!-- <RequestPanel /> -->
			</div>
		</template>
	</BaseLayout>
</template>

<script setup>
import { markRaw } from "vue"

import CheckInPanel from "@/components/CheckInPanel.vue"
import QuickLinks from "@/components/QuickLinks.vue"
import BaseLayout from "@/components/BaseLayout.vue"
import RequestPanel from "@/components/RequestPanel.vue"
import LeaveIcon from "@/components/icons/LeaveIcon.vue"
import ExpenseIcon from "@/components/icons/ExpenseIcon.vue"
import EmployeeAdvanceIcon from "@/components/icons/EmployeeAdvanceIcon.vue"
import SalaryIcon from "@/components/icons/SalaryIcon.vue"
import { FeatherIcon } from "frappe-ui";
import stock_count from '@/components/icons/stock_count.vue'

const quickLinks = [
	{
		icon: markRaw(LeaveIcon),
		title: "Request Leave",
		route: "LeaveApplicationFormView",
	},
	{
		icon: markRaw(ExpenseIcon),
		title: "Claim an Expense",
		route: "ExpenseClaimFormView",
	},
	{
		icon: markRaw(EmployeeAdvanceIcon),
		title: "Request an Advance",
		route: "EmployeeAdvanceFormView",
	},
	{
		icon: markRaw(SalaryIcon),
		title: "View Salary Slips",
		route: "SalarySlipsDashboard",
	},
]




</script>
<style>



#container{
	
	width: 100%;
	height: 450px;
	display: grid;
	grid-template-columns: repeat(3, 30%);
	column-gap: 2%;
	row-gap: 0%;
	font-family: Sans-serif !important;
	margin-left: 5%
}
#hII{
	text-align: left;
	margin-left: 5%
}
.iconDiv{
	
	height:90px;
	width:90px;
	background-color: white;
	box-shadow: 0px 0px 5px 0px;
	border-radius: 5%;

}
.icon{
	width:100%;
	height: 70%;
	
	display:flex;
	align-items: center;
	justify-content: center;
}
.text{
	width:100%;
	height: 30%;
	
	text-align: center;
	font-size: 11px;
}


</style>
