import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    searchString: string;
    deleted : boolean;
}

export class Tbl_wh_productm {
    prod_pkid : string;
    prod_code : string;
    prod_name : string;
    
    rec_created_by: string;
    rec_created_date: string;
    rec_closed: string;
}

export interface WhProductmModel {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_wh_productm[]
}

export interface vm_Tbl_wh_productm {
    mode: string;
    pkid: string;
    record: Tbl_wh_productm;
    userinfo: any;
    filter: any;
}
