import { PageQuery } from '../../shared/models/pageQuery';
export interface Tbl_Addr_Catgory {
    cat_yn: string;
    cat_id: string;
    cat_name: string;
    cat_yn_b: boolean;
}

export interface Tbl_Cargo_BulkMail {
    bm_pkid: string;
    bm_slno: number;
    bm_subctr: number;
    bm_desc: string;
    bm_send_status: string;
    bm_created_date: string;
    bm_send_date: string;
    bm_send_date_server: string;
    bm_filecount: number;
    bm_tot_emails: number;
    bm_failed_seq: string;
}

export interface SearchQuery {
    searchString: string;
    fromdate: string;
    todate: string;
    fromid: string;
    password: string;
}
export interface BulkmailModel {
    selectedId: string;
    sortcol: string;
    sortorder: boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_Addr_Catgory[];
    records2: Tbl_Cargo_BulkMail[];
}

export interface vm_Tbl_Addr_Catgory {
    mode: string;
    pkid: string;
    records: Tbl_Addr_Catgory[];
    userinfo: any;
    filter: any;
}