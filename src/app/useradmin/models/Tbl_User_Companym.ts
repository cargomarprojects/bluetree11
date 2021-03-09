import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    searchString: string;
}

export class Tbl_User_Companym {

    comp_pkid : string;
    comp_type : string;
    comp_parent_id : string;
    comp_code : string;
    comp_name : string;
    parent_name : string;

    comp_add1 : string;
    comp_add2 : string;
    comp_add3 : string;
    comp_add4 : string;

    comp_line1 : string;
    comp_line2 : string;
    comp_line3 : string;
    comp_line4 : string;
    comp_line5 : string;
    comp_order : number;
    comp_prefix : string;

    comp_scolor : string;
    comp_ecolor : string;
    comp_offset : number;
    comp_ncolor : string;
    comp_linkcolor : string;
    comp_sow : string;
    comp_bankid : string;
    comp_bank_name : string;
    
    rec_created_by: string;
    rec_created_date: string;
    rec_closed: string;
}

export interface User_Companym_Model {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_User_Companym[]
}

export interface vm_Tbl_User_Companym {
    mode: string;
    pkid: string;
    record: Tbl_User_Companym;
    userinfo: any,
    filter: any;
}
