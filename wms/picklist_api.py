import frappe

@frappe.whitelist()
def checkAndSubmit(name):
    print("check and submit",name)
    items=frappe.db.get_all("Pick List Item",{"parent":name,"parenttype":"Pick List","custom_item_picked":0,"custom_skipped":0},["name"],order_by="idx asc")
    if items:
        return False
    else:
        return  True


@frappe.whitelist()
def get_picklist_items(name="STO-PICK-2024-00019"):
    print("get_picklist_items",name)
    if not name:
        return []
    items_list= frappe.db.get_all("Pick List Item",{"parent":name,"parenttype":"Pick List"},["name","item_code","qty","warehouse","custom_item_picked","item_name","custom_qty_scanned","custom_skipped"],order_by="idx asc")
    print("item_list",items_list)
    for i in items_list:
        barcode=frappe.get_all("Item Barcode",{"parent":i.item_code,"parenttype":"Item"},pluck='barcode')
        print("barcode",barcode,i.item_code)
        i.update({"barcode":barcode})
    return items_list


@frappe.whitelist()
def updatePicklist(picklist,name,item_code,qty,warehouse):
    try:
        print("name",picklist,name,item_code,qty,warehouse)
        item=frappe.get_doc("Pick List Item",name)
        print("item.name",item.name,item.warehouse)
        item.custom_item_picked = 1
        item.custom_qty_scanned = qty
        item.save()
        pick_submit=checkAndSubmit(picklist)
        return {"submit":pick_submit,"save":True}
    except Exception as e:
        return False

@frappe.whitelist()
def skipItem(picklist,name):
    print("skip"*40)
    try:
        print("skip item name",picklist,name)
        item=frappe.get_doc("Pick List Item",name)
        print("item.name",item.name,item.warehouse)
        item.custom_skipped = 1
        item.custom_qty_scanned = 0
        item.save()
        pick_submit=checkAndSubmit(picklist)
        return {"submit":pick_submit,"save":True}
    except Exception as e:
        return False
    
@frappe.whitelist()
def submit_pick_list(name):
    print("submit pick list ",name)
    try:
        if frappe.db.exists("Pick List",name):
            doc=frappe.get_doc("Pick List",name)
            doc.workflow_state="Pending"
            doc.save()
            return {"status":True,"msg":"Pick List Submitted"}
        else:
            return {"status":False,"msg":"Pick List Not Found"}
    except Exception as e:
        return {"status":False,"msg":f"Something went wrong {e}"}
    
@frappe.whitelist()
def send_notification(self,method):
    print("Send email picklist",self,method)
    message=""
    # select * from `tabHas Role` where role = "System Manager" order by creation desc limit 3;
    recep=frappe.db.get_all('Has Role',filters={'role': 'System Manager','parenttype':'User'},pluck="parent",order_by='creation desc')
    print("recep",recep)
    for i in self.locations:
        if i.custom_skipped:
            message=f"{message}<div>{i.idx}.Item:{i.item_name}({i.item_code}) was skipped and not picked</div>"
        elif i.custom_qty_scanned < i.qty:
            message=f"{message}<div>{i.idx}.Item:{i.item_name}({i.item_code}) was partially scanned {i.custom_qty_scanned}/{i.qty}</div>"
    print("message",message)
    if message != "":
        for reci in recep:
            frappe.sendmail(recipients=reci,
                subject=f"Picklist {self.name} Update",
                message= message
            )