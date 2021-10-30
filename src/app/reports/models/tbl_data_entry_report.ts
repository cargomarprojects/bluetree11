import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    searchString: string;
    category: string;
    type: string;
    fromdate: string;
    todate: string;
    compCode: string;
    isDetail: boolean;
}

export class Tbl_Data_Entry_Report {
    row_type: string;
    de_type: string;
    de_category: string;
    de_created_by: string;
    de_created_count: number;
    de_branch: string;
    de_refno: string;
    de_refdate: string;
    de_agent_name: string;
    de_handled_name: string;
    de_inv_no: string;
    de_remarks: string;
    de_mbl_no:string;
}

export interface Data_Entry_Report_Model {
    sortcol: string;
    sortorder: boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_Data_Entry_Report[];
}





