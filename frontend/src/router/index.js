import { createRouter, createWebHistory, createWebHashHistory } from "@ionic/vue-router"

import TabbedView from "@/views/TabbedView.vue"
import leaveRoutes from "./leaves"
import claimRoutes from "./claims"
import employeeAdvanceRoutes from "./advances"
import salarySlipRoutes from "./salary_slips"



const routes = [
	{
		path: "/pick-list",
				name: "Picklist2",
				component: () => import("@/components/Picklist2.vue"),
	},
	{
		path: "/ReceivePage",
				name: "ReceivePage",
				component: () => import("@/components/ReceivePage.vue"),
	},
	{
		path: "/NewQualityInspection",
				name: "NewQualityInspection",
				component: () => import("@/components/NewQualityInspection.vue"),
	},
	{
		path: "/Deliver",
				name: "Deliver",
				component: () => import("@/components/Deliver.vue"),
	},
	{
		path: "/NewDelivery",
				name: "NewDelivery",
				component: () => import("@/components/NewDelivery.vue"),
	},
	{
		path: "/QualityInspection",
				name: "QualityInspection",
				component: () => import("@/components/QualityInspection.vue"),
	},
	{
		path: "/PrintLab",
				name: "PrintLab",
				component: () => import("@/components/PrintLab.vue"),
	},
	{
		path: "/PickList",
				name: "PickList",
				component: () => import("@/components/PickList.vue"),
	},
	{
		path: "/StockEntryList",
				name: "StockEntryList",
				component: () => import("@/components/StockEntryList.vue"),
	},
	{
		path: "/",
		redirect: "/home",
	},

	{
		path: "/FormView",
				name: "FormView",
				component: () => import("@/components/FormView.vue"),
	},

	{
		path: "/ItemInquiry",
				name: "ItemInquiry",
				component: () => import("@/components/ItemInquiry.vue"),
	},

	{
		path: "/BinInquiry",
				name: "BinInquiry",
				component: () => import("@/components/BinInquiry.vue"),
	},
	{
		path: "/StockCount",
				name: "StockCount",
				component: () => import("@/components/StockCount.vue"),
	},
	{
		path: "/NewStockCount",
				name: "NewStockCount",
				component: () => import("@/components/NewStockCount.vue"),
	},
	
	{
		path: "/NewStockEntry",
				name: "NewStockEntry",
				component: () => import("@/components/NewStockEntry.vue"),
	},
	{
		path: "/MaterialRequest",
				name: "MaterialRequest",
				component: () => import("@/components/MaterialRequest.vue"),
	},
	{
		path: "/NewMaterialRequest",
				name: "NewMaterialRequest",
				component: () => import("@/components/NewMaterialRequest.vue"),
	},
	{
		path: "/Packing",
				name: "Packing",
				component: () => import("@/components/Packing.vue"),
	},
	{
		path: "/NewPacking",
				name: "NewPacking",
				component: () => import("@/components/NewPacking.vue"),
	},
	{
		path: "/",
		component: TabbedView,
		children: [
			{
				path: "",
				redirect: "/home",
			},
			{
				path: "/home",
				name: "Home",
				component: () => import("@/views/Home.vue"),
			},
			{
				path: "/pick-list",
						name: "Picklist2",
						component: () => import("@/components/Picklist2.vue"),
			},
			{
				path: "/ReceivePage",
						name: "ReceivePage",
						component: () => import("@/components/ReceivePage.vue"),
			},
		
			
			
			{
				path: "/dashboard/leaves",
				name: "LeavesDashboard",
				component: () => import("@/views/leave/Dashboard.vue"),
			},
			{
				path: "/dashboard/expense-claims",
				name: "ExpenseClaimsDashboard",
				component: () => import("@/views/expense_claim/Dashboard.vue"),
			},
			{
				path: "/dashboard/salary-slips",
				name: "SalarySlipsDashboard",
				component: () => import("@/views/salary_slip/Dashboard.vue"),
			},
		],
	},

	{
		path: "/",
		name: "Login",
		component: () => import("@/views/Login.vue"),
	},
	{
		path: "/login",
		name: "Login",
		component: () => import("@/views/Login.vue"),
	},
	{
		path: "/register",
		name: "Register",
		component: () => import("@/views/Register.vue"),
		
	},
	
	{
		path: "/profile",
		name: "Profile",
		component: () => import("@/views/Profile.vue"),
	},
	{
		path: "/notifications",
		name: "Notifications",
		component: () => import("@/views/Notifications.vue"),
	},
	
	
]

const router = createRouter({
	history: createWebHashHistory("/wms"),
	routes,
  });

export default router
