export interface Table_Cargo_Followup {
    cf_pkid: string;
    cf_master_id: string;
    cf_user_id: string;
    cf_remarks: string;
    cf_followup_date: string;
    rec_created_by: string;
    cf_assigned_id: string;
    cf_assigned_code: string;
    cf_assigned_name: string;
}

export interface vm_Table_Cargo_Followup {
    mode: string;
    pkid: string;
    record: Table_Cargo_Followup;
    userinfo: any;
    filter: any;
}