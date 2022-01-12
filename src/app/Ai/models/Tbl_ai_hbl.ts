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
    hbl_mbl_date: string;
    hbl_book_no: string;
    hbl_book_date: string;
    hbl_hbl_no: string;
    hbl_hbl_date: string;

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
    hbl_pol_id: string;
    hbl_pol_code: string;
    hbl_pol_name: string;
    hbl_pol: string;
    hbl_pol_etd: string;

    hbl_pod_id: string;
    hbl_pod_code: string;
    hbl_pod_name: string;
    hbl_pod: string;
    hbl_pod_eta: string;

    hbl_pofd_id: string;
    hbl_pofd_code: string;
    hbl_pofd_name: string;
    hbl_pofd: string;
    hbl_pofd_eta: string;

    hbl_vessel: string;
    hbl_voyage: string;

    hbl_place_of_delivery: string;
    hbl_delivery_date: string;
    hbl_place_of_issue: string;
    hbl_date_of_issue: string;

    hbl_commodity: string;
    hbl_po: string;
    hbl_invno: string;

    hbl_movement: string;
    hbl_movement_type: string;
    hbl_frt_status: string;
    hbl_pkgs: string;
    hbl_unit: string;
    hbl_gr_wt: string;
    hbl_nt_wt: string;
    hbl_cbm: string;
    hbl_ams: string;



    rec_created_by: string;
    rec_created_date: string;
}


export class Tbl_Ai_HblDesc {
    hbl_pkid: string;
    hbl_parent_id: string;
    hbl_desc1: string;
    hbl_desc2: string;
    hbl_desc_type: string;
}

export class Tbl_Ai_Cntr {
    hbl_pkid: string;
    hbl_parent_id: string;
    hbl_cntr_no: string;
    hbl_cntr_type: string;
    hbl_cntr_seal: string;

    hbl_cntr_cbm: string;
    hbl_cntr_grwt: string;
    hbl_cntr_pkgs: string;
    hbl_cntr_unit: string;
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
    records: Tbl_Ai_HblDesc[];
    cntrs: Tbl_Ai_Cntr[];
    userinfo: any,
    filter: any;
}

