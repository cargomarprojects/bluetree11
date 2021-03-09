import { PageQuery } from '../../shared/models/pageQuery';


export interface Tbl_cargo_general {
    mbl_pkid: string;
    mbl_cfno: number;
    mbl_refno: string;
    mbl_ref_date: string;
    mbl_no: string;
    mbl_shipment_stage: string;
    mbl_prefix: string;
    mbl_startingno: string;
    mbl_remarks: string;
    mbl_liner_bookingno: string;
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
    mbl_pofd_id: string;
    mbl_pofd_code: string;
    mbl_pofd_name: string;
    mbl_vessel: string;
    mbl_voyage: string;
    mbl_country_id: string;
    mbl_country_name: string;
    mbl_frt_status: string;
    mbl_handled_id: string;
    mbl_handled_name: string;
    mbl_salesman_id: string;
    mbl_salesman_name: string;
    mbl_teu: number;
    mbl_20: number;
    mbl_40: number;
    mbl_40HQ: number;
    mbl_45: number;
    mbl_weight: number;
    mbl_cbm: number;
    mbl_pcs: number;
    mbl_type
    mbl_place_delivery: string;
    mbl_branch: string;
    mbl_lock: string;
    mbl_unlock_date: string;
    mbl_lock_yn: string;
    mbl_lock_yn_b: boolean;
    mbl_lock_status: string;
    rec_created_date: string;
    rec_created_by: string;
    rec_created_id: string;
    rec_created_email: string;
    rec_files_attached: string;
    hbl_pkid: string;
    hbl_mbl_id: string;
    hbl_houseno: string;
    hbl_date: string;
    hbl_final_date: string;
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
    hbl_uom: string;
    hbl_packages: number;
    hbl_cbm: number;
    hbl_weight: number;
    hbl_pcs: number;
    hbl_lbs: number;
    hbl_cft: number;
    hbl_chwt: number;
    hbl_chwt_lbs: number;
    hbl_commodity
    hbl_frt_status: string;
    mbl_container_tot: number;
    hbl_isf_no: string;
    mbl_cargo_loc_id: string;
    mbl_cargo_loc_name: string;
    mbl_devan_loc_id: string;
    mbl_devan_loc_name: string;
    mbl_jobtype_id: string;
    mbl_jobtype_code: string;
    mbl_jobtype_name: string;
    mbl_ar_total: number;
    mbl_ap_total: number;
    hbl_shipment_stage: string;
    hbl_bltype: string;
    mbl_pending_status: string;
    mbl_unlock_yn: string;
    mbl_unlock_yn_b: boolean;
    mbl_handled_email: string;
    hbl_it_no: string;
    hbl_it_date: string;
    hbl_it_port: string;
    mbl_ismemo_attached: string;
    mbl_mode: string;
    mbl_is_sea_waybill: string;
    hbl_bl_status: string;
    hbl_is_pl: string;
    hbl_is_ci: string;
    hbl_is_carr_an: string;
    hbl_is_pl_bool: boolean;
    hbl_is_ci_bool: boolean;
    hbl_is_carr_an_bool: boolean;
    hbl_custom_reles_status: string;
    hbl_cargo_release_status: string;
    hbl_paid_status: string;
    hbl_is_delivery: string;
    hbl_pld_eta: string;
    hbl_lfd_date: string;
    hbl_remark3: string;
    mbl_cntr_type: string;
    hbl_place_final: string;
    mbl_ulcode: string;
    mbl_inv_stage_a: string;
    mbl_inv_stage_b: string;
    mbl_inv_stage_c: string;
    mbl_inv_stage_d: string;
    mbl_inv_stage_e: string;
    mbl_cargo_loc_firmcode: string;
    hbl_is_itshipment: string;
}

export interface Tbl_cargo_container {
    cntr_pkid: string;
    cntr_hblid: string;
    cntr_catg: string;
    cntr_order: number;
    cntr_no: string;
    cntr_type: string;
    cntr_sealno: string;
    cntr_movement: string;
    cntr_pieces: number;
    cntr_packages_uom: string;
    cntr_packages: number;
    cntr_cbm: number;
    cntr_teu: number;
    cntr_weight_uom: string;
    cntr_weight: number;
    rec_year: number;
    cntr_yn: string;
    cntr_selected: boolean;
}

export interface vm_tbl_cargo_general {
    mode: string;
    record: Tbl_cargo_general;
    records: Tbl_cargo_general[];
    cntrs: Tbl_cargo_container[];
    userinfo: any,
    filter: any;
    operationmode: string;
}

export interface SearchQuery {
    searchString: string;
    fromdate: string;
    todate: string;
    mode: string;
    cust_id: string;
    cust_name: string;
    branch: string;
    lock_type: string;
    show_hide:boolean;
    handled_id: string;
    handled_name: string;
}

export interface OthGeneralModel {
    sortcol : string ;
    sortorder : boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_cargo_general[]
}
