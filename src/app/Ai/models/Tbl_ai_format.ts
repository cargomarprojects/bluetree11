import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    searchString: string;
    file_type : string;
}

export class Tbl_Ai_Formatm {
    fmt_pkid: string;
	fmt_name : string;
    fmt_type : string;
    rec_created_by: string;
    rec_created_date: string;
}

export class Tbl_Ai_Formatd {
    fmt_pkid: string;
	fmt_parent_id : string;
    fmt_caption : string;
    fmt_text : string;
    fmt_type : string;
    fmt_bet1 : string;
    fmt_bet2 : string;
    fmt_position : string;
    fmt_exclude : string;
    fmt_page : number;
    fmt_order : number;
    rec_created_by: string;
    rec_created_date: string;
}


export interface Ai_Formatm_Model {
    selectedId : string;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_Ai_Formatm[];
}
export interface vm_Tbl_Ai_Formatm {
    mode: string;
    pkid: string;
    record: Tbl_Ai_Formatm;
    records: Tbl_Ai_Formatd[];
    userinfo: any,
    filter: any;
}

