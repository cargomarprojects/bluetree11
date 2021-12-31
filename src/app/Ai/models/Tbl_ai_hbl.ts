import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    searchString: string;
    file_type: string;
}

export class Tbl_Ai_Hblm {
    hbl_pkid: string;
    hbl_file_id: string;
    hbl_format_id: string;

    hbl_mbl_no: string;
    hbl_hbl_no: string;

    hbl_shipper_name: string;
    hbl_shipper_add1: string;
    hbl_shipper_add2: string;
    hbl_shipper_add3: string;
    hbl_shipper_add4: string;
    hbl_shipper_add5: string;
    hbl_shipper_add6: string;

    hbl_consignee_name: string;
    hbl_consignee_add1: string;
    hbl_consignee_add2: string;
    hbl_consignee_add3: string;
    hbl_consignee_add4: string;
    hbl_consignee_add5: string;
    hbl_consignee_add6: string;


    hbl_notify_name: string;
    hbl_notify_add1: string;
    hbl_notify_add2: string;
    hbl_notify_add3: string;
    hbl_notify_add4: string;
    hbl_notify_add5: string;
    hbl_notify_add6: string;

    hbl_pre_carriage: string;
    hbl_por: string;
    hbl_pol: string;
    hbl_pod: string;
    hbl_pofd: string;
    hbl_vessel: string;
    hbl_voyage: string;

    hbl_frt_status: string;
    hbl_gr_wt: string;
    hbl_cbm: string;





    rec_created_by: string;
    rec_created_date: string;
}



export interface Ai_Hblm_Model {
    selectedId: string;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_Ai_Hblm[];
}
export interface vm_Tbl_Ai_Hblm {
    mode: string;
    pkid: string;
    record: Tbl_Ai_Hblm;
    userinfo: any,
    filter: any;
}

