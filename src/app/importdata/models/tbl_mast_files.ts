import { PageQuery } from '../../shared/models/pageQuery';

export interface Tbl_mast_files {
    
    files_branch_name : string;
    files_slno : string;
    files_type : string;
    files_id : string;
    files_desc : string;
    files_created_date : string;
    files_uploaded_date : string;
    files_ref_no : string;
    files_selected : string;
    files_processed : string;
    files_status : string;
    files_path : string;
}
  
export interface vm_tbl_mast_files {
    mode: string;
    record: Tbl_mast_files;
    userinfo: any,
    filter: any;
}

export interface SearchQuery {
    searchString: string;
    rdbprocessed: string;
}

export interface ImportHblPageModel {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_mast_files[]
}