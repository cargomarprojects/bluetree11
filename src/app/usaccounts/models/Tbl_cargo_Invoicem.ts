
export interface Tbl_cargo_invoicem {

    inv_pkid: string;
    inv_cfno: number;
    inv_no: string;
    inv_date: string;
    inv_mbl_lock: string;
    inv_mbl_unlock_date: string;
    inv_mbl_mode: string;
    inv_arap: string;
    inv_arrnotice: string;
    inv_type: string;
    inv_year: number;
    inv_cust_id: string;
    inv_cust_code: string;
    inv_cust_name: string;

    inv_prefix: string;
    inv_startingno: string;

    rec_files_attached: string;

    inv_acc_id: string;
    inv_acc_code: string;
    inv_acc_name: string;

    acc_address1: string;
    acc_address2: string;
    acc_address3: string;
    acc_address4: string;
    acc_address5: string;


    inv_exrate: number;

    inv_agent_drcr: string;

    inv_refno: string;
    inv_remarks: string;
    inv_remarks2: string;
    inv_remarks3: string;


    inv_hbl_boeno: string;
    inv_mbl_vessel: string;
    inv_mbl_voyage: string;
    inv_hbl_commodity: string;
    inv_cr_footer_note: string;
    inv_dr_footer_note: string;


    inv_narration: string;


    inv_curr_code: string;
    inv_ftotal: number;
    inv_total: number;

    inv_paid: number;
    inv_balance: number;

    inv_balance_base: number;

    inv_pay_amt: number;
    inv_ar_total: number;
    inv_ap_total: number;


    inv_pay_amt_base: number;
    inv_ar_pay_amt_base: number;
    inv_ap_pay_amt_base: number;


    inv_total1: number;
    inv_ftotal1: number;
    inv_fvat: number;
    inv_vat: number;
    inv_vat_per: number;


    inv_gen_days: number;

    inv_cost_type: string;

    inv_mbl_id: string;
    inv_hbl_id: string;


    inv_mbl_no: string;
    inv_mbl_refno: string;
    inv_mbl_ref_date: string;
    inv_hbl_no: string;

    inv_flag: string;

    inv_flag2: boolean;

    rec_deleted: string;
    rec_created_by: string;
    rec_created_date: string;
    rec_closed: string;


    inv_pay_chqno: string;
    inv_pay_chq_date: string;
    inv_pay_memo: string;

    inv_pod_eta: string;


    ar_amt: number;
    ap_amt: number;


    inv_cust_addr1: string;
    inv_cust_addr2: string;
    inv_cust_addr3: string;
    inv_cust_addr4: string;
    inv_cust_attn: string;
    inv_cust_tel: string;
    inv_cust_fax: string;

    inv_hbl_packages: number;
    inv_hbl_uom: string;
    inv_hbl_weight: number;
    inv_hbl_lbs: number;
    inv_hbl_cbm: number;
    inv_hbl_cft: number;


    inv_hbl_shipper_name: string;
    inv_hbl_consignee_name: string;

    inv_hbl_pol_code: string;
    inv_hbl_pol_name: string;
    inv_hbl_pod_name: string;
    inv_hbl_pofd_code: string;
    inv_hbl_pofd_name: string;

    inv_hbl_pod_code: string;
    inv_hbl_pol_cntry_code: string;
    inv_hbl_pod_cntry_code: string;


    handled_name: string;
    handled_email: string;


    rec_created_email: string;

    inv_jv_date: string;
    inv_jv_docno: string;
    inv_pay_mode: string;



    inv_pay_charges: number;
    inv_pay_exdiff_dr: number;
    inv_pay_exdiff_cr: number;
    inv_pay_ar_amt_fc: number;
    inv_pay_ap_amt_fc: number;
    inv_pay_amt_fc: number;
    inv_pay_bank: number;
    inv_pay_curr_code: string;

    inv_pay_chq_bank: string;



    rec_subfiles_attached: string;
    rec_chkcopy_attached: string;



    vat_acc_id: string;
    vat_acc_name: string;

    vat_desc_id: string;
    vat_dsc_name: string;

    vat_per: number;

    inv_confirmed: string;

    inv_stage: string;
}


export interface Tbl_Cargo_Invoiced {
    invd_pkid: string;
    invd_parent_id: string;
    invd_desc_id: string;
    invd_desc_code: string;
    invd_desc_name: string;

    invd_remarks: string;

    invd_acc_id: string;
    invd_acc_code: string;
    invd_acc_name: string;

    invd_curr_id: string;
    invd_curr_code: string;
    invd_curr_name: string;


    invd_qty: number;
    invd_frate: number;
    invd_ftotal: number;

    invd_exrate: number;

    invd_rate: number;
    invd_total: number;

    invd_vat_per: number;
    invd_vat_amt: number;
    invd_fvat_amt: number;

    invd_cc_id: string;
    invd_cc_code: string;


    invd_order: number;

    invd_payroll_id: string;
    invd_payroll_yn: string;
    invd_payroll_date: string;

}


export interface Tbl_PayHistory {
    docno: string;
    doc_date: string;
    amt: number;
    chqno: string;
    by: string;
    deleted: string;
    inv_id: string;
}


export interface vm_tbl_cargo_invoicem {
    mode: string;
    record: Tbl_cargo_invoicem;
    records: Tbl_Cargo_Invoiced[];
    userinfo: any;
    old_amt: number;
}

export interface InvoiceModel {
    errormessage: string;
    mbl_pkid: string;
    mbl_refno: string;
    inv_type: string;
    showdeleted: string;
    records: Tbl_cargo_invoicem[]
}
