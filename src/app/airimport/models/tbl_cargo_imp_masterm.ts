import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    searchString: string;
}

export interface Tbl_cargo_imp_masterm {
    mbl_pkid: string;
    mbl_cfno: number;
    mbl_refno: string;
    mbl_old_ref_date: string;
    mbl_ref_date: string;
    mbl_no: string;
    mbl_prefix: string;
    mbl_startingno: string;
    mbl_date: string;
    mbl_agent_id: string;
    mbl_agent_name: string;
    mbl_agent_code: string;
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
    mbl_pol_cntry_code: string;
    mbl_pod_cntry_code: string;
    mbl_frt_status: string;
    mbl_country_id: string;
    mbl_country_name: string;
    mbl_handled_id: string;
    mbl_handled_name: string;
    mbl_handled_email: string;
    mbl_cargo_loc_id: string;
    mbl_devan_loc_id: string;
    mbl_cargo_loccode: string;
    mbl_cargo_locname: string;
    mbl_cargo_locaddr1: string;
    mbl_cargo_locaddr2: string;
    mbl_cargo_locaddr3: string;
    mbl_cargo_locaddr4: string;

    mbl_cbm: number;
    mbl_weight: number;
    mbl_chwt: number;
    mbl_pcs: number;
    mbl_mawb_weight: number;
    mbl_mawb_chwt: number;
    rec_created_date: string;
    rec_created_by: string;
    rec_created_id: string;
    mbl_lock: string;
    mbl_unlock_date: string;
    mbl_jobtype_id: string;
    mbl_jobtype_code: string;
    mbl_jobtype_name: string;
    mbl_boeno: string;
    mbl_shipment_stage: string;
    mbl_salesman_id: string;
    mbl_salesman_name: string;
    rec_files_attached: string;
    mbl_ismemo_attached: string;

}

export interface Tbl_cargo_imp_housem {

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

export interface vm_tbl_cargo_imp_masterm {
    mode: string;
    record: Tbl_cargo_imp_masterm;
    userinfo: any,
    filter: any;
}

export interface SearchQuery {
    searchString: string;
    fromdate: string;
    todate: string;
}

export interface AirImpMasterModel {
    sortcol : string ;
    sortorder : boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_cargo_imp_masterm[]
}