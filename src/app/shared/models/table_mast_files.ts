
export interface Table_Mast_Files {
    file_id: string;
    file_desc: string;
    file_uri: string;
    files_type: string;
    files_ref_no: string;
    files_created_date: string;
    files_strfile: string;
    files_size: number;
    files_sizewithunit: string;
    files_path: string;
    files_editrow: boolean;
    files_aws_bucket : string ;
    files_aws_job_id : string ;
    files_aws_job_status : string ;
    files_width : number;
    files_height : number;
    files_status:string;
    files_created_by:string;
    files_deleted_date:string;
    files_deleted_by:string;
    files_parent_id:string;
}

export interface vm_table_mast_files {
    mode: string;
    record: Table_Mast_Files;
    pkid: string;
    userinfo: any;
    filter: any;
}