import router from "@/router"
import { createResource } from "frappe-ui"

export const employeeResource = createResource({
	url: "wms.api.get_current_employee_info",
	cache: "wms:employee",
	onError(error) {
		if (error && error.exc_type === "AuthenticationError") {
			router.push("/login")
		}
	},
})
