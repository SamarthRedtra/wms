import frappe
from erpnext.buying.doctype.purchase_order.purchase_order import make_purchase_receipt
from erpnext.controllers.stock_controller import make_quality_inspections as mqi

@frappe.whitelist(allow_guest=True)
def fetch_childTable(self):
    pod = frappe.get_all('Purchase Order', filters={'name': 'PUR-ORD-2024-00005'}, fields=['*'])
    print("*********Purchase Order******", pod)

    for purchase_order in pod:
        if purchase_order:
            tab_data = frappe.db.get_all("Purchase Order Item", filters={'parent': purchase_order.name}, fields=['*'])
            print("********tab data*******", tab_data)
            
            for item in tab_data:
                print("**************", item)



@frappe.whitelist(allow_guest=True)
def get_current_user_info() -> dict:
    current_user = frappe.session.user
    if not current_user:
        frappe.throw(_("You must be logged in to access this page."))
    user = frappe.db.get_value(
        "User", current_user, ["name", "first_name", "full_name", "user_image"], as_dict=True
    )
    user["roles"] = frappe.get_roles(current_user)

    return user


@frappe.whitelist(allow_guest=True)
def test():
    po_name = "PUR-ORD-2024-00008"
    doc = frappe.get_doc('Purchase Order', po_name)
    all_pr_doc = frappe.db.get_all("Purchase Receipt", filters={'supplier': doc.supplier})
    items = []
    for i in doc.items:
        # items.append(i.item_code)
        print(i.qty)
        remaining_qty = 0
        for pr in all_pr_doc:
            
            pr_doc = frappe.get_doc("Purchase Receipt",pr.name)
            print(pr_doc)
            for pri in pr_doc.items:
                print(pri.item_code)
                if i.item_code == pri.item_code:
                    remaining_qty += pri.qty
        qty = i.qty - remaining_qty

        if qty >0:
            items.append({"item_code": i.item_code, "uom": i.uom, "quantity": qty, "warehouse": i.warehouse})
        
    return items

@frappe.whitelist(allow_guest=True)
def list_of_purchase():
    doc = frappe.db.get_all("Purchase Order", filters={'docstatus': 1}, fields=['name', 'supplier', 'total_qty', 'company'])
    values = []
    
    for po in doc:
        po_name = po['name']
        supplier = po['supplier']
        total_qty = po['total_qty']
        company = po['company']
        
        query = """
            SELECT DISTINCT pri.parent
            FROM `tabPurchase Receipt Item` pri
            JOIN `tabPurchase Receipt` pr ON pri.parent = pr.name
            WHERE pri.purchase_order = %s AND pr.supplier = %s
        """
        purchase_receipts = frappe.db.sql(query, (po_name, supplier), as_dict=True)

        all_pr_doc = [d['parent'] for d in purchase_receipts]
        
        if all_pr_doc:
            total_pr_qty = 0
            for pr_name in all_pr_doc:
                pr_doc = frappe.get_doc("Purchase Receipt", pr_name)
                total_pr_qty += pr_doc.total_qty
            
            if total_pr_qty < total_qty:
                values.append({'name': po_name, 'supplier': supplier, 'company': company})
        else:
            values.append({'name': po_name, 'supplier': supplier, 'company': company})
    
    return values

# @frappe.whitelist(allow_guest=True)
# def list_of_items(po_name):
#     # po_name = "PUR-ORD-2024-00008"
#     doc = frappe.get_doc('Purchase Order', po_name)
#     all_pr_doc = frappe.db.get_all("Purchase Receipt", filters={'supplier': doc.supplier})
#     items = []
#     for i in doc.items:
#         # items.append(i.item_code)
#         print(i.qty)
#         remaining_qty = 0
#         for pr in all_pr_doc:
            
#             pr_doc = frappe.get_doc("Purchase Receipt",pr.name)
#             print(pr_doc)
#             for pri in pr_doc.items:
#                 print(pri.item_code)
#                 if i.item_code == pri.item_code:
#                     remaining_qty += pri.qty
#         qty = i.qty - remaining_qty

#         if qty >0:
#             items.append({"item_code": i.item_code, "uom": i.uom, "quantity": qty, "warehouse": i.warehouse})
        
#     return items


@frappe.whitelist(allow_guest=True)
def list_of_items(po_name):
    # po_name = "PUR-ORD-2024-00025"
    doc = frappe.get_doc('Purchase Order', po_name)
    all_pr_doc = frappe.db.get_all("Purchase Receipt", filters={'supplier': doc.supplier})
    items = []
    
    query = """
        SELECT DISTINCT pri.parent
        FROM `tabPurchase Receipt Item` pri
        JOIN `tabPurchase Receipt` pr ON pri.parent = pr.name
        WHERE pri.purchase_order = %s
    """
    purchase_receipts = frappe.db.sql(query, (po_name,), as_dict=True)
    
    if purchase_receipts:
        all_pr_doc = [d['parent'] for d in purchase_receipts]
        for i in doc.items:
            remaining_qty = 0
            for pr_name in all_pr_doc:
                pr_doc = frappe.get_doc("Purchase Receipt", pr_name)
                for pri in pr_doc.items:
                    if i.item_code == pri.item_code:
                        remaining_qty += pri.qty
            qty = i.qty - remaining_qty
            if qty > 0:
                items.append({
                    "item_code": i.item_code, 
                    "uom": i.uom, 
                    "quantity": qty, 
                    "warehouse": i.warehouse,

                })
    else:
        for i in doc.items:
            items.append({
                "item_code": i.item_code, 
                "uom": i.uom, 
                "quantity": i.qty, 
                "warehouse": i.warehouse
            })
    
    return items


@frappe.whitelist(allow_guest=True)
def purchase_order_items(name):
    # name = "PUR-ORD-2024-00005"
    doc = frappe.get_doc('Purchase Order', name)
    
    items = [{"item_code": i.item_code, "uom": i.uom, "quantity": i.qty, "warehouse": i.warehouse} for i in doc.items]
    
    return items


# @frappe.whitelist(allow_guest=True)
# def create_purchase_receipt(name, items):
#     # name = "PUR-ORD-2024-00005"
#     # warehouse = 'Stores - DT'
#     # item_code = "002"
#     # qty = 5
#     purchase_order = frappe.get_doc('Purchase Order', name)
#     supplier_name = purchase_order.supplier

#     purchase_receipt = frappe.new_doc("Purchase Receipt")
#     purchase_receipt.supplier = supplier_name

#     for item in items:
#         purchase_receipt.append("items",{
#             "item_code": item.get('item_code'),
#             "warehouse":item.get('warehouse'),
#             "qty":item.get('qty'),
#             "uom": item.get('uom'),

#         })
#     purchase_receipt.save(ignore_permissions=True)
#     frappe.db.commit()
#     # return 'done'
#     return purchase_receipt.name


@frappe.whitelist(allow_guest=True)
def create_purchase_receipt(po_name=None,pr=None,items=None):
    # pr = 'MAT-PRE-2024-00028'
    # po_name = "PUR-ORD-2024-00020"
    # items = [
    #     {"item_code": "1997", "warehouse": 'Stores - DT', "qty": 30},
    #     {"item_code": "002", "warehouse": 'Stores - DT', "qty": 12},
    #     {"item_code": "001", "warehouse": 'Stores - DT', "qty": 2}
    # ]
    if items is None:
        items = []
    if pr:
        purchase_receipt = frappe.get_doc('Purchase Receipt', pr)
        if purchase_receipt.docstatus ==1:
            return f"{pr} has already submitted"
    else:
        purchase_receipt = make_purchase_receipt(po_name)

    for item_data in items:
        item_code = item_data.get('item_code')
        warehouse = item_data.get('warehouse')
        qty = item_data.get('qty')
        uom = item_data.get('uom', None)  # Default to None if uom is not provided

        existing_item = next((item for item in purchase_receipt.items if item.item_code == item_code), None)
        
        if existing_item:
            existing_item.warehouse = warehouse
            existing_item.qty = qty
            existing_item.uom = uom if uom else existing_item.uom
            existing_item.received_qty = qty
            existing_item.accepted_qty = qty
            existing_item.rejected_qty = 0
        else:
            new_item = purchase_receipt.append("items", {
                "item_code": item_code,
                "warehouse": warehouse,
                "qty": qty,
                "uom": uom,
                "received_qty": qty,
                "accepted_qty": qty,
                "rejected_qty": 0,
            })

    purchase_receipt.save(ignore_permissions=True)
    frappe.db.commit()
    return purchase_receipt.name



@frappe.whitelist(allow_guest=True)
def submit_and_create_purchase_receipt(name, items,pr=None):
    print('calling submit_and_create_purchase_receipt')
    # name = "PUR-ORD-2024-00005"
    # warehouse = 'Stores - DT'
    # item_code = "002"
    # qty = 50

    # pr = 'MAT-PRE-2024-00091'
    purchase_order = frappe.get_doc('Purchase Order', name)
    supplier_name = purchase_order.supplier

    if pr:
        print('in if pr condition')
        try:
            doc = frappe.get_doc('Purchase Receipt', pr)
            if doc.docstatus == 0:
                print('doc status')
                doc.submit()
                frappe.db.commit()
                return doc.name
            else:
                return ("Purchase Receipt is not in draft state, cannot submit.")
        except Exception as e:
            print("An error occurred:", e)
        # return purchase_receipt.name
    else:
        # po_name = "PUR-ORD-2024-00020"
        # items = [{"item_code": "1997", "warehouse": 'Stores - DT', "qty": 2}]
        purchase_receipt = make_purchase_receipt(name)
        
        items_to_remove = []

        for existing_item in purchase_receipt.items:
            if not any(item.get('item_code') == existing_item.item_code for item in items):
                items_to_remove.append(existing_item)

        for item in items_to_remove:
            purchase_receipt.items.remove(item)

        for item_data in items:
            item_code = item_data.get('item_code')
            warehouse = item_data.get('warehouse')
            qty = item_data.get('qty')
            uom = item_data.get('uom')
            
            existing_item = next((item for item in purchase_receipt.items if item.item_code == item_code), None)
            
            if existing_item:
                existing_item.warehouse = warehouse
                existing_item.qty = qty
                existing_item.uom = uom
            else:
                new_item = purchase_receipt.append("items", {
                    "item_code": item_code,
                    "warehouse": warehouse,
                    "qty": qty,
                    "uom": uom,
                })

        purchase_receipt.save(ignore_permissions=True)
        purchase_receipt.submit()
        frappe.db.commit()
        return purchase_receipt.name




        # # create_purchase_receipt(name,items)
        # purchase_receipt = frappe.new_doc("Purchase Receipt")
        # purchase_receipt.supplier = supplier_name
        
        # print(purchase_receipt)
        # print('items---',items)
        # for item in items:
        #     print(item)
        #     purchase_receipt.append("items",{
        #         "item_code": item.get('item_code'),
        #         "warehouse": item.get('warehouse'),
        #         "qty": item.get('qty'),
        #         "uom": item.get('uom'),

        #     })

        # purchase_receipt.save(ignore_permissions=True)
        # purchase_receipt.submit()
        # frappe.db.commit()
        # # return 'done'
        # return purchase_receipt.name


@frappe.whitelist(allow_guest=True)
def get_purchase_receiptII(pr_name):
    pr_doc = frappe.get_doc("Purchase Receipt", pr_name)
    itemcount = frappe.db.count('Purchase Receipt Item', {"parent":pr_name})
        
    return [{"item_c":itemcount  ,"rname":'Purchase Receipt' } ]






@frappe.whitelist(allow_guest=True)
def get_purchase_receipt_on_receiptform():
    all_pr_doc = frappe.get_doc("Purchase Receipt", fields=['name'])
   

    for pr in all_pr_doc:
            
        pr_doc = frappe.get_doc("Purchase Receipt", pr.name)
        print(pr_doc)
        for pri in pr_doc.items:
         print(pri.item_code)

         return pr_doc


@frappe.whitelist(allow_guest=True)
def get_item_code_from_barcode(barcode_text):
    # barcode_text = '5679'
    all_item = frappe.get_all('Item')
    for item in all_item:
        # print(item.name)
        item_doc = frappe.get_doc('Item',item.name)
        for barcode in item_doc.barcodes:
            if barcode_text == barcode.barcode:
                return item_doc.item_code


@frappe.whitelist(allow_guest=True)
def suman():
    try:
        print("----------suman calling")
        pr = 'MAT-PRE-2024-00091'
        doc = frappe.get_doc('Purchase Receipt', pr)
        if doc.docstatus == 0: 
            doc.submit()
            frappe.db.commit()
            print("Purchase Receipt submitted successfully.")
        else:
            print("Purchase Receipt is not in draft state, cannot submit.")
    except Exception as e:
        print("An error occurred:", e)


@frappe.whitelist(allow_guest=True)
def get_quality_inspection():
    get_data = frappe.db.get_all("Quality Inspection", fields=['*'])

        
    return get_data


@frappe.whitelist(allow_guest=True)
def get_items():
    get_item = frappe.db.get_all("Item", fields=['*'])

        
    return get_item

@frappe.whitelist(allow_guest=True)
def get_Purchase_receipt_toprint():
    get_receipt = frappe.db.get_all("Purchase Receipt", fields=['*'])

        
    return get_receipt



@frappe.whitelist(allow_guest=True)
def make_quality_inspections(docname, items):
    doctype = "Purchase Receipt"
    # docname = "MAT-PRE-2024-00178"
    # items = [{'item_code': 'ATKT001', 'item_name': 'Pen', 'qty': 2, 'description': 'Pen', 'sample_size': 0,}]
    pr_doc = frappe.get_doc(doctype,docname)

    if pr_doc.docstatus == 0:
        pr_doc =  mqi(doctype, docname, items)
        print(pr_doc,'suman----')
        for qc in pr_doc:
            qi = frappe.get_doc('Quality Inspection',qc)
            qi.submit()
            frappe.db.commit()
        return pr_doc
    else:
       
        return 'Quality Inspection can not be created on submitted purchase receipt'





@frappe.whitelist(allow_guest=True)
def save_quality_inspections(docname, items, qa_temp=None):
    doctype = "Purchase Receipt"
    # docname = "MAT-PRE-2024-00178"
    # items = [{'item_code': 'ATKT001', 'item_name': 'Pen', 'qty': 2, 'description': 'Pen', 'sample_size': 0,}]
    pr_doc = frappe.get_doc(doctype,docname)

   
    pr_doc =  mqi(doctype, docname, items)
    return pr_doc

@frappe.whitelist(allow_guest=True)
def edit_qa_inspection(qa_name,qa_temp):
    qa_doc = frappe.get_doc('Quality Inspection',qa_name)
    if qa_doc.docstatus == 1:
        return {'name':qa_name,
                'msg':f'Cannot be Edited: {qa_name} is Submitted'}
    qa_doc.quality_inspection_template = qa_temp
    qa_doc.save(ignore_permissions=True)
    frappe.db.commit()

    return {'name':qa_name,
            'msg':f'Successfully Edited: {qa_name} saved in Draft'}
  
@frappe.whitelist(allow_guest=True)
def submit_quality_inspections(qa_name):
    qa_doc = frappe.get_doc('Quality Inspection',qa_name)
    if qa_doc.docstatus == 0:
        qa_doc.submit()
        return {'name':qa_name,
                'msg':f"{qa_name} has submitted" }
    else:       
        return {'name':qa_name,
                'msg':f"{qa_name} has already submitted" }

@frappe.whitelist(allow_guest=True)
def get_quality_template():
    qa_temp = frappe.get_all('Quality Inspection Template', ['name'])
    return qa_temp






@frappe.whitelist(allow_guest=True)
def get_purchase_receipt(receipt_name):
    #receipt_name =  "MAT-PRE-2024-00178"
    doc = frappe.get_doc("Purchase Receipt", receipt_name)
    return doc




@frappe.whitelist(allow_guest=True)
def get_stock_by_name(name):
    #receipt_name =  "MAT-PRE-2024-00178"
    doc = frappe.get_doc("Stock Reconciliation", name)
    return doc

@frappe.whitelist(allow_guest=True)
def get_stockentry_by_name(name):
    #receipt_name =  "MAT-PRE-2024-00178"
    doc = frappe.get_doc("Stock Entry", name)
    return doc

@frappe.whitelist(allow_guest=True)
def get_quality_details(quality_name):
    #quality_name =  "MAT-QA-2024-00044"
    doc = frappe.get_doc("Quality Inspection", quality_name)
    return doc




@frappe.whitelist(allow_guest=True)
def make_quality_inspection_reading(specification, min_value,  max_value, numeric = None, manual_inspection= None, formula_based_criteria= None, readings=None, status= None, qa_name=None, reading_value=None, acceptance_formula=None):
    # specification = 'inspection'
    # min_value = 2
    # max_value = 10
    # numeric = True
    # readings = {'reading_1':'4','reading_2':'7','reading_3':'12'}
    # reading_value= 32
    # qa_name = 'MAT-QA-2024-00077'
    try:
        doc = frappe.get_doc("Quality Inspection", qa_name)
       
        for inp in doc.readings:
            print(inp.specification)
            inp.min_value = min_value
            inp.max_value = max_value
            if specification == inp.specification:
                inp.numeric = numeric
                
                inp.formula_based_criteria = formula_based_criteria
                if inp.formula_based_criteria and acceptance_formula:
                    inp.acceptance_formula = acceptance_formula

                inp.manual_inspection = manual_inspection
                inp.status = status
                if inp.manual_inspection and reading_value:
                    inp.reading_value = reading_value

                if inp.numeric:
                    for i in readings:
                        print(i)
                        if i == 'reading_1':
                            print(1)
                            inp.reading_1 = readings[i]
                        elif i == 'reading_2':
                            print(2)
                            inp.reading_2 = readings[i]
                        elif i == 'reading_3':
                            inp.reading_3 = readings[i]
                        elif i == 'reading_4':
                            inp.reading_4 = readings[i]
                        elif i == 'reading_5':
                            inp.reading_5 = readings[i]
                        elif i == 'reading_6':
                            inp.reading_6 = readings[i]
                        elif i == 'reading_7':
                            inp.reading_7 = readings[i]
                        elif i == 'reading_8':
                            inp.reading_8 = readings[i]
                        elif i == 'reading_9':
                            inp.reading_9 = readings[i]
                        elif i == 'reading_10':
                            inp.reading_10 = readings[i]
                        
                    
        
        doc.save()
        
        return {"status": "success", "message": "Quality Inspection updated successfully", 'result':doc.status}
    except Exception as e:
        return {"status": "error", "message": str(e)}



#----------------------------------------------------------------



# get delivery note

@frappe.whitelist(allow_guest=True)
def get_delivery_note(dr_name):
    de_doc = frappe.get_doc("Delivery Note", dr_name)
    itemcount = frappe.db.count('Delivery Note Item', {"parent":dr_name})
        
    return [{"item_count":itemcount  ,"dname":'Delivery Note' } ]

@frappe.whitelist(allow_guest=True)
def get_purchase_receiptIII():
    get_doc = frappe.db.get_all("Purchase Receipt", fields=['*'])

    return get_doc


@frappe.whitelist(allow_guest=True)
def get_stock_count():
    get_doc = frappe.db.get_all("Stock Reconciliation", fields=['purpose', 'company'])

    return get_doc



@frappe.whitelist(allow_guest=True)
def item_match_with_qr(barcode):
    try:
        item = frappe.db.sql("""
            SELECT 
               parent
            FROM
                `tabItem Barcode`
            WHERE
                barcode = %s
            LIMIT 1
        """, barcode, as_dict=True)

        print('**********************item :       ',item)

        if item:
            return item[0]
        else:
            return {"message": ("Item not found")}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "item_match_with_qr Error")
        return {"error": str(e)}    



        # Bin APi's


@frappe.whitelist(allow_guest=True)
def bin_item_data(item_code):
 
	filters = {"item_code" : item_code}
	bin_records = frappe.get_all('Bin',filters=filters,fields = ['*'])
	print("*****Bin_records*****8",bin_records)
	return bin_records





@frappe.whitelist(allow_guest=True)
def item_bin_data(warehouse):
 
	filters = {"warehouse" : warehouse}
	bin_records = frappe.get_all('Bin',filters=filters,fields = ['*'])
	print("*****Bin_records*****8",bin_records)
	return bin_records



# @frappe.whitelist(allow_guest=True)
# def bin_item_data(item_code):
# 	querry = """
# 					select * from `tabBin`
# 					where item_code = %s
# 				"""
# 	bin_records = frappe.db.sql(querry,item_code,as_dict=True)
# 	print("*****Bin_records*****8",bin_records)
# 	return bin_records
     



@frappe.whitelist(allow_guest=True)
def get_bin_details(bin_name):
    #bin_name =  ""
    doc = frappe.get_doc("Bin", bin_name)
    return doc


@frappe.whitelist(allow_guest=True)
def get_warehouse_list():
    doc = frappe.db.get_all("Warehouse", fields=['name', 'company'])
    return doc    

@frappe.whitelist(allow_guest=True)
def get_all_items():
    doc = frappe.db.get_all("Item", fields=['name', 'item_name'])
    return doc    

@frappe.whitelist(allow_guest=True)
def get_all_company():
    doc = frappe.db.get_all("Company", fields=['name'])
    return doc  

@frappe.whitelist(allow_guest=True)
def get_material_request_list():
    doc = frappe.db.get_all("Material Request", fields=['*'])
    return doc 

@frappe.whitelist(allow_guest=True)
def get_packing_slip_list():
    doc = frappe.db.get_all("Packing Slip", fields=['*'])
    return doc 


@frappe.whitelist(allow_guest=True)
def get_draft_delivery_notes():
    # Fetch all Delivery Notes with status "Draft"
    delivery_notes = frappe.get_all(
        "Delivery Note",  # DocType name
        filters={"status": "Draft"},  # Filter to get only draft status
        fields=["name"]  # Fields to return
    )
    return delivery_notes


@frappe.whitelist(allow_guest=True)
def get_material_by_name(name):
    #receipt_name =  "MAT-PRE-2024-00178"
    doc = frappe.get_doc("Material Request", name)
    return doc    



@frappe.whitelist(allow_guest=True)
def get_deliverynote_by_name(name):
    #receipt_name =  "MAT-PRE-2024-00178"
    doc = frappe.get_doc("Delivery Note", name)
    return doc  

@frappe.whitelist(allow_guest=True)
def get_packing_by_name(name):
    #receipt_name =  "MAT-PRE-2024-00178"
    doc = frappe.get_doc("Packing Slip", name)
    return doc      

@frappe.whitelist(allow_guest=True)
def get_all_Stock_Entry():
    doc = frappe.db.get_all("Stock Entry", fields=['*'])
    return doc  


@frappe.whitelist(allow_guest=True)
def get_all_pick_list():
    doc = frappe.db.get_all("Pick List", fields=['*'])
    return doc  
# import requests

# url = "https:///api/method/frappe.auth.get_logged_user?"
# headers = {
#     'Authorization': "token <api_key>:<api_secret>"
# }
# response = requests.request("GET", url, headers=headers)

@frappe.whitelist()
def save_stock_reconciliation(item_code, warehouse, qty):
    
	# if not headers.get('Authorization', None):
	# 	return 'Missing Authorization header'

	# api_key = headers.get('Authorization').split()[1]

	# user = frappe.db.get_value('User', 'api_key', api_key)
	# if not user:
	# 	return 'Invalid API key'
    print('calling')
    doc = frappe.new_doc("Stock Reconciliation")
    doc.purpose = 'Stock Reconciliation'
    doc.append("items", {
            "item_code": item_code,
            "warehouse": warehouse,
            "qty": qty
        })
    doc.insert(ignore_permissions=True)
    doc.save(ignore_permissions=True)
    doc.submit()    
    return f"{doc.name}"





@frappe.whitelist(allow_guest=True)
def submit_stock_reconciliation(item_code,warehouse,qty,stk_name=None):
    print(item_code,warehouse,qty,stk_name)
    if stk_name:
        doc = frappe.get_doc("Stock Reconciliation",stk_name)
        doc.submit()
    else:
        doc = frappe.new_doc("Stock Reconciliation")
        doc.purpose = 'Stock Reconciliation'
        doc.items['item_code'] = item_code
        doc.items['warehouse'] = warehouse
        doc.items['qty'] = qty
        doc.insert(ignore_permissions=True)
        doc.save(ignore_permissions=True)
        doc.submit()
        return f'{doc.name}'



@frappe.whitelist(allow_guest=True)
def key_for_authorization(user_mail):
	api_key = frappe.get_value('User',user_mail,"api_key")
	api_secret = frappe.utils.password.get_decrypted_password('User', user_mail, fieldname='api_secret')
	return "token {api_key}"



@frappe.whitelist(allow_guest=True)
def get_stock_reconsillation():
    q = """
        SELECT 
            sr.name,
            CASE
                WHEN sr.docstatus = 0 THEN 'Draft'
                WHEN sr.docstatus = 1 THEN 'Submitted'
                WHEN sr.docstatus = 2 THEN 'Cancelled'
                ELSE 'Unknown'
            END AS "docstatus",
            sri.warehouse,
            sri.item_code
        FROM 
            `tabStock Reconciliation` sr
        JOIN 
            `tabStock Reconciliation Item` sri
        ON 
            sr.name = sri.parent;

                
        """
    doc = frappe.db.sql(q,as_dict=True)
    # get_stock = frappe.db.get_all("Stock Reconciliation", fields=['*'])       
    return doc    


@frappe.whitelist(allow_guest=True)
def create_stock_reconciliation(company, purpose, items, sr=None):
    # company = 'dexciss technology'
    # purpose = 'Stock Reconciliation'
    # items = [{
    #     "item_code":'002',
    #     "warehouse" :'Stores - DT',
    #     "qty":'3'
    # }]
    # sr = 'MAT-RECO-2024-00041'
    try:
        if sr:
            doc = frappe.get_doc("Stock Reconciliation",sr)
            doc.company = company
            doc.purpose = purpose
            print('sr..........', sr)
            for item in items:
                print(item,'item------------',item['item_code'])
                if not item['item_code'] or not item.get('warehouse') or not item['qty']:
                    frappe.throw(("Each item must have item_code, warehouse, and qty."), frappe.ValidationError)
                
                doc.append("items", {
                    "item_code": item['item_code'],
                    "warehouse": item['warehouse'],
                    "qty": item['qty'],
                })
            print('sr..........', sr)
            print(doc)
            doc.save()
            frappe.db.commit()
        else:
            if not company or not purpose or not items:
                frappe.throw(("Company, purpose, and items are required fields."), frappe.MandatoryError)
            
            doc = frappe.new_doc("Stock Reconciliation")
            doc.company = company
            doc.purpose = purpose
            
            for item in items:
                print(item,'item------------',item['item_code'])
                if not item['item_code'] or not item.get('warehouse') or not item['qty']:
                    frappe.throw(("Each item must have item_code, warehouse, and qty."), frappe.ValidationError)
                
                doc.append("items", {
                    "item_code": item['item_code'],
                    "warehouse": item['warehouse'],
                    "qty": item['qty'],
                })
            print(doc)
            doc.save()
            frappe.db.commit()
            
            return {"status": "success", "message": ("Stock Reconciliation created successfully"), "docname": doc.name}
    except Exception as e:
        return e
    except frappe.MandatoryError as e:
        frappe.log_error(message=str(e), title="Mandatory Field Error in create_stock_reconciliation API")
        return {"status": "error", "message": str(e)}
    
    except frappe.ValidationError as e:
        frappe.log_error(message=str(e), title="Validation Error in create_stock_reconciliation API")
        return {"status": "error", "message": str(e)}
    
    except Exception as e:
        frappe.log_error(message=str(e), title="Unexpected Error in create_stock_reconciliation API")
        return {"status": "error", "message": ("An unexpected error occurred while creating Stock Reconciliation. Please try again later.")}


@frappe.whitelist(allow_guest=True)
def submit_stock_reconciliation(company, purpose, items, sr=None):
    # company = 'dexciss technology'
    # purpose = 'Stock Reconciliation'
    # items = [{
    #     "item_code":'002',
    #     "warehouse" :'Stores - DT',
    #     "qty":'3'
    # }]
    # sr = 'MAT-RECO-2024-00041'
    try:
        if sr:
            doc = frappe.get_doc("Stock Reconciliation",sr)
            doc.save()
            doc.submit()
            # frappe.db.commit()
        else:
            if not company or not purpose or not items:
                frappe.throw(("Company, purpose, and items are required fields."), frappe.MandatoryError)
            
            doc = frappe.new_doc("Stock Reconciliation")
            doc.company = company
            doc.purpose = purpose
            
            for item in items:
                print(item,'item------------',item['item_code'])
                if not item['item_code'] or not item.get('warehouse') or not item['qty']:
                    frappe.throw(("Each item must have item_code, warehouse, and qty."), frappe.ValidationError)
                
                doc.append("items", {
                    "item_code": item['item_code'],
                    "warehouse": item['warehouse'],
                    "qty": item['qty'],
                })
            print(doc)
            doc.save()
            doc.submit()
            # frappe.db.commit()
            
            return {"status": "success", "message": ("Stock Reconciliation created successfully"), "docname": doc.name}
    except Exception as e:
        return e
    except frappe.MandatoryError as e:
        frappe.log_error(message=str(e), title="Mandatory Field Error in create_stock_reconciliation API")
        return {"status": "error", "message": str(e)}
    
    except frappe.ValidationError as e:
        frappe.log_error(message=str(e), title="Validation Error in create_stock_reconciliation API")
        return {"status": "error", "message": str(e)}
    
    except Exception as e:
        frappe.log_error(message=str(e), title="Unexpected Error in create_stock_reconciliation API")
        return {"status": "error", "message": ("An unexpected error occurred while creating Stock Reconciliation. Please try again later.")}


@frappe.whitelist(allow_guest=True)
def create_user(email, first_name, last_name, password):
    # email = "john.doe@example.com"
    # first_name = "John"
    # last_name = "Doe"
    roles = ["Sales User"]
    # password = 'John@123'
    try:
        if frappe.db.exists("User", email):
            return f"User {email} already exists"

        user = frappe.get_doc({
            "doctype": "User",
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "enabled": 1
        })

        for role in roles:
            user.append("roles", {
                "role": role
            })

        user.save(ignore_permissions=True)

        user.new_password = password
        user.save(ignore_permissions=True)

        return f"User {email} created successfully"

    except Exception as e:
        return f"An error occurred: {e}"


@frappe.whitelist(allow_guest=True)
def get_notifications():
    doc = frappe.db.get_all("Notification Log", fields=['*'])
    return doc  

