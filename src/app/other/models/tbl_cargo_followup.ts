
export interface Tbl_cargo_followup {
    cf_pkid: string;
    cf_master_id: string;
    cf_refno: string;
    cf_ref_date: string;
    cf_user_id: string;
    cf_yn: string;
    cf_remarks: string;
    cf_followup_date: string;
    cf_mbl_mode: string;
    cf_mbl_lock: string;
    cf_mbl_unlock_date: string;
    cf_assigned_id: string;
    cf_assigned_code: string;
    cf_yn_b:boolean;
    cf_branch_code:string;
}

export interface vm_Tbl_cargo_followup {
    mode: string;
    pkid: string;
    records: Tbl_cargo_followup[];
    userinfo: any;
    filter: any;
}