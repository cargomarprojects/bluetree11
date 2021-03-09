import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    balance: string;
    searchString: string;
    sdate: string;
    edate: string;
}


export interface Tbl_cargo_mblusage {
    mu_pkid : string;
    mu_agent_id : string;
    mu_agent_code : string;
    mu_agent_name : string;
    mu_bl_start_no : number;
    mu_bl_end_no : number;
    mu_bl_tot : number;
    mu_origin : string;
    mu_courier_name : string;
    mu_tracking_no : string;
    mu_sent_on : string;
    mu_remarks : string;
    rec_created_by : string;
    rec_created_date : string;
}


export interface Tbl_cargo_mblusageModel {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_cargo_mblusage[]
}

export interface vm_Tbl_cargo_mblusage {
    mode: string;
    pkid: string;
    record: Tbl_cargo_mblusage;
    userinfo: any,
    filter: any;
}

