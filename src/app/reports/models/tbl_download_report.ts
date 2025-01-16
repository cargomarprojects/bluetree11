import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    searchString: string;
    searchGroup: string;
    fromDate: string;
    toDate: string;
    agentId: string;
    agentName: string;
    carrierId: string;
    carrierName: string;
    shipmentType: string;
    shipmentCntr: string;
}

export class Tbl_Download_Report {
    mbl_refno: string;
    mbl_ref_date: string;
    mbl_no: string;
    mbl_agent_name: string;
    mbl_liner_name: string;
    mbl_cntr_type: string;
    mbl_teu: number;
    rec_created_by: string;
    rec_created_date: string;
    rec_closed: string;
}

export interface Download_Report_Model {

    sortcol: string;
    sortorder: boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_Download_Report[];
}

