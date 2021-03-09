
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
}

export interface vm_table_mast_files {
    mode: string;
    record: Table_Mast_Files;
    pkid: string;
    userinfo: any;
    filter: any;
}