export interface TBL_MAST_PARAM {
    param_pkid: string;
    param_type: string;
    param_code: string;
    param_name1: string;
    param_name2: string;
    param_name3: string;
    param_name4: string;
    param_name5: string;
    param_name6: string;
    param_value1: number;
    param_lookup_id: string;
    param_lookup_code: string;
    param_lookup_name: string;
    rec_locked: string;
    rec_status: string;
    rec_created_by: string;
    rec_created_date: string
    userInfo : any ;
}

export interface VM_TBL_MAST_PARAM {
    mode : string;
    record : TBL_MAST_PARAM,
    userinfo : any,
    filter : any;
}
