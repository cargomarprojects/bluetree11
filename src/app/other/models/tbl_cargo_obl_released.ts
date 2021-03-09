import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    balance: string;
    searchString: string;
    sdate: string;
    edate: string;
}

export interface Tbl_cargo_obl_released {
    obl_pkid: string;
    obl_date: string;
    obl_slno:number;
    obl_refno: string;
    obl_mbl_id: string;
    obl_hbl_id: string;
    obl_consignee_id: string;
    obl_consignee_code: string;
    obl_consignee_name: string;
    obl_handled_id: string;
    obl_handled_code: string;
    obl_handled_name: string;
    obl_houseno: string;
    obl_remark: string;
    rec_created_by: string;
    rec_created_date: string;

}


export interface OblReleaseModel {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_cargo_obl_released[]
}

export interface vm_tbl_OblRelease {
    mode: string;
    pkid: string;
    record: Tbl_cargo_obl_released;
    userinfo: any,
    filter: any;
}

