import { createResource } from "frappe-ui"
import { employeeResource } from "./employee"

const transformAdvanceData = (data) => {
	return data.map((claim) => {
		claim.doctype = "Employee Advance"
		return claim
	})
}

export const advanceBalance = createResource({
	url: "wms.api.get_employee_advance_balance",
	params: {
		employee: employeeResource.data.name,
	},
	auto: true,
	cache: "wms:employee_advance_balance",
	transform(data) {
		return transformAdvanceData(data)
	},
})
