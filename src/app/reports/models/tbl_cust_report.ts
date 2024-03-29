import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    searchString: string;
    searchCategory: string;
    fromdate: string;
    todate: string;
    formatType: string;
}

export class Tbl_Cust_Report {
    cust_pkid: string;
    cust_name: string;
    cust_official_name: string;
    cust_address1: string;
    cust_address2: string;
    cust_address3: string;
    cust_category: string;
    cust_contact: string;
    cust_telephone: string;
    cust_mobile: string;
    cust_fax: string;
    cust_email: string;
    cust_city: string;
    cust_state: string;
    cust_country: string;
    cust_creditdays: number;
    cust_is_splac: string;
    cust_splac_memo: string;
    rec_created_by: string;
    rec_created_date: string;
    rec_closed: string;
}

export interface Cust_Report_Model {
    sortcol: string;
    sortorder: boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_Cust_Report[];
}


