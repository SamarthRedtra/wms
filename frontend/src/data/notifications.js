import { createResource, createListResource } from "frappe-ui"
import { userResource } from "./user"

export const unreadNotificationsCount = createResource({
	url: "wms.api.get_unread_notifications_count",
	cache: "wms:unread_notifications_count",
	initialData: 0,
	auto: true,
})

export const notifications = createListResource({
	doctype: "Notification Log",
	filters: { to_user: userResource.data.name },
	fields: [
		"name",
		"from_user",
		"subject",
		"read",
		"creation",
		"document_type",
		"document_name",
	],
	auto: true,
	cache: "wms:notifications",
	orderBy: "creation desc",
	onSuccess() {
		unreadNotificationsCount.reload()
	},
})
// console.log('notification log',notifications.data.name )
