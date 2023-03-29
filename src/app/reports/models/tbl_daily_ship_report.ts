import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    datetype: string;
    type: string;
    fromdate: string;
    todate: string;
    compCode: string;
    cust_parent_id: string;
    cust_parent_name: string;
    cust_id: string;
    cust_name: string;
}

export class Tbl_Daily_Ship_Report {
    row_type: string;

    dsr_shipper: string;
    dsr_consignee: string;
    dsr_pono: string;
    dsr_invoiceno: string;
    dsr_incoterm: string;
    dsr_cntrtype: string;
    dsr_cntrno: string;
    dsr_bookingno: string;
    dsr_carrier: string;
    dsr_blno: string;
    dsr_etd: string;
    dsr_eta: string;
    dsr_refno: string;
    dsr_refdate: string;
    dsr_houseno: string;
    dsr_mbl_mode: string;
    dsr_branch_code: string;
    dsr_mbl_id: string;
    dsr_hbl_id: string;
}

export interface Daily_Ship_Report_Model {
    selectedId: string;
    sortcol: string;
    sortorder: boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_Daily_Ship_Report[];
}
