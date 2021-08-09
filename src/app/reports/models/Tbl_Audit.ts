import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    searchString: string;
    fromdate: string;
    todate: string;
    searchtype: string;    
}

export class Tbl_Audit {

    audit_id : string;
    audit_user_id : string;
    audit_user_code : string;
    audit_screen : string;
    audit_action : string;
    audit_remarks : string;
    audit_client_date : string;
    audit_server_date : string;
    audit_key : string;
    audit_refno : string;
    audit_company_code : string;
    audit_branch_code : string;
    audit_fycode : string;
    rec_created_by: string;
    rec_created_date: string;
    rec_closed: string;
}

export interface Audit_Model {
    sortcol : string ;
    sortorder : boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_Audit[]
}

export interface vm_Tbl_Audit {
    mode: string;
    pkid: string;
    record: Tbl_Audit;
    userinfo: any,
    filter: any;
}
