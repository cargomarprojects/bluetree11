import { PageQuery } from '../../shared/models/pageQuery';
export class TBL_GEN_SEARCH {
    gs_pkid: string;
    gs_refno: string;
    gs_category: string;
    gs_houseno: string;
    gs_invoiceno: string;
}
export interface SearchQuery {
    searchString: string;
    searchType: string;
    searchDate: string;
    customerName: string;
    customerId: string;
}

export interface GenSearchReportModel {
    sortcol: string;
    sortorder: boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: TBL_GEN_SEARCH[]
}