export interface Tbl_Cargo_Tracking_Status {
    parent_type: string;
    param_id: string;
    param_name1: string;
    remarks: string;
    date: string;
    memo: string;
    rec_created_by: string;
    rec_files_attached: string;
}

export interface vm_Tbl_Cargo_Tracking_Status {
    mode: string;
    pkid: string;
    record: Tbl_Cargo_Tracking_Status[];
    memorecord: Tbl_Cargo_Tracking_Status;
    memoMode:string;
    memoPkid:string;
    parentType: string;
    paramType: string;
    userinfo: any;
    filter: any;
}