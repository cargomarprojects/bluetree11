import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    searchString: string;
    file_type : string;
}
export class Tbl_Mast_Filesm {
    file_pkid: string;
	file_date : string
    file_name: string;
    file_type: string;
	file_remarks : string;
    rec_created_by: string;
    rec_created_date: string;
    rec_closed: string;
}
export interface Mast_Filesm_Model {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_Mast_Filesm[]
}
export interface vm_Tbl_Mast_Filesm {
    mode: string;
    pkid: string;
    record: Tbl_Mast_Filesm;
    userinfo: any,
    filter: any;
}
