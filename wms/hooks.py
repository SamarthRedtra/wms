app_name = "wms"
app_title = "WMS"
app_publisher = "samarthupare"
app_description = "WMS Resarch"
app_email = "support@redtra.com"
app_license = "mit"
# required_apps = []

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/wms/css/wms.css"
# app_include_js = "/assets/wms/js/wms.js"

# include js, css files in header of web template
# web_include_css = "/assets/wms/css/wms.css"
# web_include_js = "/assets/wms/js/wms.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "wms/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "wms/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "wms.utils.jinja_methods",
# 	"filters": "wms.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "wms.install.before_install"
# after_install = "wms.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "wms.uninstall.before_uninstall"
# after_uninstall = "wms.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "wms.utils.before_app_install"
# after_app_install = "wms.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "wms.utils.before_app_uninstall"
# after_app_uninstall = "wms.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "wms.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

doc_events = {
"Pick List": {
		"on_submit": "wms.picklist_api.send_notification",
		# "on_submit": "customs_management.api.create_grouping",
	},
}

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"wms.tasks.all"
# 	],
# 	"daily": [
# 		"wms.tasks.daily"
# 	],
# 	"hourly": [
# 		"wms.tasks.hourly"
# 	],
# 	"weekly": [
# 		"wms.tasks.weekly"
# 	],
# 	"monthly": [
# 		"wms.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "wms.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "wms.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "wms.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["wms.utils.before_request"]
# after_request = ["wms.utils.after_request"]

# Job Events
# ----------
# before_job = ["wms.utils.before_job"]
# after_job = ["wms.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"wms.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }


website_route_rules = [{'from_route': '/wms/<path:app_path>', 'to_route': 'wms'}, {'from_route': '/wms#/<path:app_path>', 'to_route': 'wms'}]

fixtures = [
		{"dt":"Custom Field", "filters": [["name", "in",(
			      "Pick List Item-custom_item_picked",
                  "Pick List Item-custom_qty_scanned",
                  "Pick List Item-custom_skipped",
		),]]} 

    ]
