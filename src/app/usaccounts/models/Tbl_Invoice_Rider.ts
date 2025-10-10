export interface Tbl_Invoice_Riderm {

    irm_pkid: string;
    irm_inv_id: string;
    irm_cntr_no: string;
    irm_inv_due_dt: string;
    irm_allowed_free_days: number;
    irm_cntr_avlb_dt: string;
    irm_free_dt_start: string;
    irm_free_dt_end: string;
    irm_dnd_rule: string;
    irm_charged_dt_from: string;
    irm_charged_dt_to: string;
    irm_ctr: number;
    irm_tot_amt: number;
    rec_created_by: string;
    rec_created_date: string;
    rec_edited_by: string;
    rec_edited_date: string;
}


export interface vm_Tbl_Invoice_Riderm {
    mode: string;
    record: Tbl_Invoice_Riderm;
    pkid: string;
    userinfo: any;
    filter: any;
}