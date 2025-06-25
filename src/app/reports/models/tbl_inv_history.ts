import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    searchString: string;
    searchMode: string;
    fromdate: string;
    todate: string;
}

export class Tbl_Inv_History {
    mbl_refno: string;
    mbl_ref_date: string;
    inv_no: string;
    inv_date: string;
    log_cust_name: string;
    log_type: string;
    log_date: string;
    log_from_amt: number;
    log_to_amt: number;
    log_diff_amt: number;
    log_user_code: string;
    rec_branch_code: string;
}

export interface Inv_History_Model {
    selectedId: string;
    sortcol: string;
    sortorder: boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_Inv_History[];
}


