import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    searchString: string;
    file_type: string;
}

export class Tbl_Ai_Hblm {
    hbl_pkid: string;
    hbl_file_id: string;
    hbl_format_id: string;

    mbl_branch_code: string;

    mbl_pkid: string;
    mbl_no: string;
    mbl_date: string;
    mbl_book_no: string;
    mbl_book_date: string;


    mbl_carrier_id: string;
    mbl_carrier_code: string;
    mbl_carrier_name: string;

    mbl_agent_id: string;
    mbl_agent_code: string;
    mbl_agent_name: string;

    mbl_coloader_id: string;
    mbl_coloader_code: string;
    mbl_coloader_name: string;

    mbl_handled_id: string;
    mbl_handled_code: string;
    mbl_handled_name: string;

    mbl_frt_status: string;
    mbl_ship_term_id : string;
    mbl_cntr_type : string ;
    mbl_inco_term : string ;

    
    hbl_hbl_no: string;
    hbl_hbl_date: string;

    hbl_country_id: string;
    hbl_country_code: string;
    hbl_country_name: string;

    hbl_shipper_id: string;
    hbl_shipper_code: string;
    hbl_shipper_name: string;
    hbl_shipper_add1: string;
    hbl_shipper_add2: string;
    hbl_shipper_add3: string;
    hbl_shipper_add4: string;
    hbl_shipper_add5: string;
    

    hbl_consignee_id: string;
    hbl_consignee_code: string;
    hbl_consignee_name: string;
    hbl_consignee_add1: string;
    hbl_consignee_add2: string;
    hbl_consignee_add3: string;
    hbl_consignee_add4: string;
    hbl_consignee_add5: string;


    hbl_notify_id: string;
    hbl_notify_code: string;
    hbl_notify_name: string;
    hbl_notify_add1: string;
    hbl_notify_add2: string;
    hbl_notify_add3: string;
    hbl_notify_add4: string;
    hbl_notify_add5: string;
    

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

    hbl_frt_status: string;
    hbl_ship_term_id: string;
    hbl_inco_term: string;
    
    hbl_pkgs: number;
    hbl_unit: string;
    hbl_gr_wt: number;
    hbl_nt_wt: number;
    hbl_cbm: number;
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

    hbl_cntr_cbm: number;
    hbl_cntr_grwt: number;
    hbl_cntr_pkgs: number;
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

