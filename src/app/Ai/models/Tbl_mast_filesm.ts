import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    searchString: string;
    file_type : string;
}
export class Tbl_Mast_Filesm {
    file_pkid: string;
    file_slno : number;
	file_date : string
    file_type: string;
	file_remarks : string;
    rec_created_by: string;
    rec_created_date: string;
    rec_closed: string;
    rec_files_attached : string ;
}


export class DB_Tbl_Mast_Files
{
    files_id : string;
    files_desc  : string;
    files_uri  : string;
    files_type  : string;
    files_ref_no  : string;
    files_created_by  : string;
    files_created_date  : string;
    files_strfile  : string;
    files_size : number;
    files_sizewithunit  : string;
    files_path  : string;
}


export interface Mast_Filesm_Model {
    selectedId : string;
    selectedSlNo : number;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_Mast_Filesm[];
    DocList: DB_Tbl_Mast_Files[];
}
export interface vm_Tbl_Mast_Filesm {
    mode: string;
    pkid: string;
    record: Tbl_Mast_Filesm;
    userinfo: any,
    filter: any;
}
