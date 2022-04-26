import { PageQuery } from '../../shared/models/pageQuery';

export class TBL_INV_LIST {
    row_type: string;
    mbl_branch: string;
    mbl_pkid: string;
    mbl_refno: string;
    mbl_ref_date: string;
    handled_name: string;
    inv_pkid: string;
    inv_no: string;
    inv_date: string;
    inv_refno: string;
    inv_arap: string;
    customer_name: string;
    inv_total: number;
    inv_paid: number;
    inv_bal: number;
}

export interface SearchQuery {
    searchString: string;
    fromdate: string;
    todate: string;
    type: string;
    cust_id: string;
    cust_name: string;
    comp_code: string;
    comp_type: string;
}

export interface InvoiceReportModel {
    sortcol: string;
    sortorder: boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: TBL_INV_LIST[]
}