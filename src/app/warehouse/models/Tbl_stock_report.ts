import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    searchString: string;
    fromdate: string;
    todate: string;
    zerobal: boolean;
}

export class Tbl_Stock_Report {
    row_type: string;
    prod_code: string;
    prod_name: string;
    unit: string;
    cust_name: string;
    in_qty: number;
    out_qty: number;
    bal_qty: number;
}

export interface Stock_Report_Model {
    selectedId: string;
    sortcol: string;
    sortorder: boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_Stock_Report[];
}





