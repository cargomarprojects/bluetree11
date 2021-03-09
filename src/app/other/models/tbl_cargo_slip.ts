import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    searchString: string;
}

export interface Tbl_cargo_slip {
    cs_mbl_id: string;
    cs_mbl_no: string;
    cs_mode: string;

    cs_pkid: string;
    cs_slno: number;
    cs_refno: string;

    cs_date: string;
    cs_to_id: string;
    cs_to_code: string;
    cs_to_name: string;
    cs_to_tel: string;
    cs_to_fax: string;
    cs_from_id: string;
    cs_from_name: string;
    cs_is_drop: string;
    cs_is_pick: string;
    cs_is_receipt: string;
    cs_is_check: string;
    cs_check_det: string;
    cs_is_bl: string;
    cs_bl_det: string;
    cs_is_oth: string;
    cs_oth_det: string;
    cs_deliver_to_id: string;
    cs_deliver_to_code: string;
    cs_deliver_to_name: string;
    cs_deliver_to_add1: string;
    cs_deliver_to_add2: string;
    cs_deliver_to_add3: string;
    cs_deliver_to_tel: string;
    cs_deliver_to_attn: string;
    cs_remark: string;
    cs_ampm: string;
    rec_created_by: string;
    rec_created_date: string;

    cs_is_drop_bool: boolean;
    cs_is_pick_bool: boolean;
    cs_is_receipt_bool: boolean;
    cs_is_check_bool: boolean;
    cs_is_bl_bool: boolean;
    cs_is_oth_bool: boolean;
}

export interface vm_tbl_cargo_slip {
    pkid: string;
    mode: string;
    record: Tbl_cargo_slip;
    userinfo: any,
    filter: any;
}

export interface SearchQuery {
    searchString: string;
    fromdate: string;
    todate: string;
    mblid: string;
}

export interface MessengerSlipModel {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_cargo_slip[]
}
