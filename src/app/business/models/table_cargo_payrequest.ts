export interface Table_Cargo_Payrequest {
    cp_pkid: string;
    cp_mode: string;
    cp_source: string;
    cp_master_id: string;
    cp_paytype_needed: string;
    cp_spl_notes: string;
    cp_payment_date: string;
    cp_pay_status: string;

    rec_deleted_by: string;
    rec_deleted_date: string;
    rec_deleted: string;

    cp_cust_id: string;
    cp_cust_code: string;
    cp_cust_name: string;
    cp_inv_id: string;
    cp_inv_no: string;
    cp_selected:boolean;
}


export interface vm_Table_Cargo_Payrequest {
    mode: string;
    record: Table_Cargo_Payrequest;
    pkid: string;
    userinfo: any;
    filter: any;
}