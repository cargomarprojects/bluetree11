import { PageQuery } from '../../shared/models/pageQuery';

export interface Tbl_cargo_exp_masterm {
    mbl_pkid: string;
    mbl_cfno: number;
    mbl_refno: string;
    mbl_old_ref_date: string;
    mbl_ref_date: string;
    mbl_no: string;

    mbl_prefix: string;
    mbl_startingno: string;

    mbl_lock: string;
    mbl_unlock_date: string;
    mbl_date: string;
    mbl_liner_bookingno: string;
    mbl_agent_id: string;
    mbl_agent_name: string;
    mbl_agent_code: string;

    mbl_agent_tel: string;
    mbl_agent_fax: string;

    mbl_direct: string;
    mbl_direct_bool: boolean;
     
    mbl_pol_cntry_code: string;
    mbl_pod_cntry_code: string;

    mbl_liner_id: string;
    mbl_liner_name: string;
    mbl_liner_code: string;
    mbl_pol_id: string;
    mbl_pol_code: string;
    mbl_pol_name: string;
    mbl_pol_etd: string;
    mbl_pod_id: string;
    mbl_pod_code: string;
    mbl_pod_name: string;
    mbl_pod_eta: string;

    mbl_vessel: string;
    mbl_voyage: string;

    mbl_country_id: string;
    mbl_country_code: string;
    mbl_country_name: string;

    mbl_to_port1: string;
    mbl_by_carrier1: string;
    mbl_to_port2: string;
    mbl_to_port3: string;

    mbl_by_carrier2: string;
    mbl_by_carrier3: string;
    mbl_currency: string;

    mbl_frt_status: string;

    mbl_handled_id: string;
    mbl_handled_name: string;

    mbl_cbm: number;

    mbl_mawb_weight: number;
    mbl_mawb_chwt: number;


    rec_created_date: string;
    rec_created_by: string;
    rec_created_id: string;
    mbl_jobtype_id: string;
    mbl_jobtype_code: string;
    mbl_jobtype_name: string;
    mbl_shipment_stage: string;

    mbl_salesman_id: string;
    mbl_salesman_name: string;
    rec_files_attached: string;
    mbl_ismemo_attached: string;
    mbl_3rdparty: string;
    mbl_3rdparty_bool: boolean;
}

export interface Tbl_cargo_exp_housem {
     
    hbl_pkid: string;
    mbl_no: string;
    mbl_refno: string;
    hbl_mbl_id: string;
    hbl_houseno: string;
    hbl_date: string;
    mbl_pol_etd: string;
    mbl_pod_eta: string;
    hbl_shipper_name: string;
    hbl_consignee_name: string;
    hbl_handled_name: string;
    rec_created_by: string;
    rec_created_date: string;
    hbl_packages: number;
}

export interface vm_tbl_cargo_exp_masterm {
    mode: string;
    record: Tbl_cargo_exp_masterm;
    userinfo: any,
    filter: any;
}

export interface SearchQuery {
    searchString: string;
    fromdate: string;
    todate: string;
    searchtype: string;
}

export interface AirExpMasterModel {
    sortcol : string ;
    sortorder : boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_cargo_exp_masterm[]
}