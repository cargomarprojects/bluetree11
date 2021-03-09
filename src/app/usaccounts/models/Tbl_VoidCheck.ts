import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    balance: string;
    searchString: string;
    sdate: string;
    edate: string;
}

export interface Tbl_VoidCheck {
    void_pkid: string;
    void_vrno: string;
    void_docno: string;
    void_date: string;
    void_year: number;
    void_bank_id: string;
    void_bank_code: string;
    void_bank_name: string;
    void_chqno: string;
    void_memo: string;
    rec_created_by: string;
    rec_created_date: string;
    rec_closed: string;
}

export interface VoidCheckModel {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_VoidCheck[]
}

export interface vm_tbl_VoidCheck {
    mode: string;
    pkid: string;
    record: Tbl_VoidCheck;
    userinfo: any,
    filter: any;
}
