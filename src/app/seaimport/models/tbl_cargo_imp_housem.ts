import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    searchString: string;
}

export interface Tbl_cargo_imp_housem {
    hbl_pkid: string;
    hbl_mbl_id: string;
    hbl_selected: string;
    mbl_no: string;
    mbl_cfno: number;
    mbl_refno: string;
    mbl_ref_date: string;
    mbl_lock: string;
    mbl_unlock_date: string;
    hbl_houseno: string;
    hbl_date: string;
    mbl_pol_etd: string;
    mbl_pod_eta: string;
    hbl_bltype: string;
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
    hbl_agent_id: string;
    hbl_agent_code: string;
    hbl_agent_name: string;
    hbl_liner_id: string;
    hbl_liner_code: string;
    hbl_liner_name: string;
    hbl_cha_id: string;
    hbl_cha_code: string;
    hbl_cha_name: string;
    hbl_cha_attn: string;
    hbl_cha_tel: string;
    hbl_cha_fax: string;
    hbl_pono: string;
    hbl_location_id: string;
    hbl_location_code: string;
    hbl_location_name: string;
    hbl_location_add1: string;
    hbl_location_add2: string;
    hbl_location_add3: string;
    hbl_location_add4: string;
    hbl_location_add5: string;
    hbl_notify_id: string;
    hbl_notify_code: string;
    hbl_notify_name: string;
    hbl_notify_add1: string;
    hbl_notify_add2: string;
    hbl_notify_add3: string;
    hbl_notify_add4: string;
    hbl_notify_add5: string;
    hbl_ams_fileno: string;
    hbl_sub_house: string;
    hbl_it_no: string;
    hbl_it_date: string;
    hbl_it_port: string;
    hbl_telex_released: string;
    hbl_pol_id: string;
    hbl_pol_code: string;
    hbl_pol_name: string;
    hbl_pol_etd: string;
    mbl_cntr_type: string;
    hbl_pod_id: string;
    hbl_pod_code: string;
    hbl_pod_name: string;
    hbl_pod_eta: string;
    hbl_lfd_date: string;
    hbl_go_date: string;
    hbl_pickup_date: string;
    hbl_empty_ret_date: string;
    hbl_place_delivery: string;
    hbl_place_final: string;
    hbl_pld_eta: string;
    hbl_plf_eta: string;
    hbl_frt_status: string;
    hbl_ship_term: string;
    hbl_ship_term_id: string;
    hbl_vessel: string;
    hbl_voyage: string;
    hbl_uom: string;
    hbl_pofd_name: string;
    hbl_packages: number;
    hbl_cbm: number;
    hbl_weight: number;
    hbl_pcs: number;
    hbl_lbs: number;
    hbl_cft: number;
    hbl_commodity: string;
    hbl_salesman_id: string;
    hbl_salesman_code: string;
    hbl_salesman_name: string;
    hbl_isf_no: string;
    hbl_mov_dad: string;
    hbl_bl_req: string;
    hbl_remark1: string;
    hbl_remark2: string;
    hbl_remark3: string;
    hbl_devan_instr1: string;
    hbl_devan_instr2: string;
    hbl_devan_instr3: string;
    hbl_handled_id: string;
    hbl_handled_code: string;
    hbl_handled_name: string;
    hbl_handled_email: string;
    hbl_devan_loccode: string;
    hbl_devan_locname: string;
    hbl_devan_locaddr1: string;
    hbl_devan_locaddr2: string;
    hbl_devan_locaddr3: string;
    hbl_devan_locaddr4: string;
    rec_created_date: string;
    rec_created_by: string;
    rec_created_id: string;
    rec_created_email: string;
    hbl_yn: string;
    hbl_location_firmcode: string;
    hbl_devan_firmcode: string;
    hbl_careof_id: string;
    hbl_careof_name: string;
    hbl_boeno: string;
    hbl_paid_status: string;
    hbl_bl_status: string;
    hbl_cargo_release_status: string;
    hbl_shipment_stage: string;
    hbl_country_origin: string;
    rec_files_attached: string;
    hbl_is_itshipment: boolean;
    hbl_book_slno: number;
    hbl_isf_attached: string;
    hbl_is_pl: boolean;
    hbl_is_ci: boolean;
    hbl_is_carr_an: boolean;
    hbl_custom_reles_status: string;
    hbl_is_delivery: string;
    hbl_paid_remarks: string;
    hbl_checked:boolean;
    hbl_delivery_date:string;
    hbl_custom_clear_date:string;
}
export interface Tbl_desc {
   
    hbl_cargo_marks1:string;
    hbl_cargo_marks2:string;
    hbl_cargo_marks3:string;
    hbl_cargo_marks4:string;
    hbl_cargo_marks5:string;
    hbl_cargo_marks6:string;
    hbl_cargo_marks7:string;
    hbl_cargo_marks8:string;
    hbl_cargo_marks9:string;
    hbl_cargo_marks10:string;
    hbl_cargo_marks11:string;
    hbl_cargo_marks12:string;
    hbl_cargo_marks13:string;
    hbl_cargo_marks14:string;
    hbl_cargo_marks15:string;
    hbl_cargo_marks16:string;
    hbl_cargo_marks17:string;
    
    hbl_cargo_description1:string;
    hbl_cargo_description2:string;
    hbl_cargo_description3:string;
    hbl_cargo_description4:string;
    hbl_cargo_description5:string;
    hbl_cargo_description6:string;
    hbl_cargo_description7:string;
    hbl_cargo_description8:string;
    hbl_cargo_description9:string;
    hbl_cargo_description10:string;
    hbl_cargo_description11:string;
    hbl_cargo_description12:string;
    hbl_cargo_description13:string;
    hbl_cargo_description14:string;
    hbl_cargo_description15:string;
    hbl_cargo_description16:string;
    hbl_cargo_description17:string;
}
export interface Tbl_cargo_imp_container {
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
    cntr_tare_weight: number;
    cntr_pick_date: string;
    cntr_return_date: string;
    cntr_selected:boolean;
    cntr_lfd:string;
    cntr_discharge_date:string;
}

export interface Table_Address {
    
    pkid: string;
    code: string;
    name: string;
    attention: string;
    telephone: string;
    fax: string;
    sman_id: string;
    sman_name: string;
}
export interface Tbl_cargo_imp_desc {
    parentid: string;
    parent_type: string;
    cargo_ctr: number;
    cargo_marks: string;
    cargo_packages: string;
    cargo_description: string;
}

export interface vm_tbl_cargo_imp_housem {
    pkid: string;
    mode: string;
    record: Tbl_cargo_imp_housem;
    cntrs: Tbl_cargo_imp_container[];
    desc: Tbl_cargo_imp_desc[];
    hbls: Tbl_cargo_imp_housem[];
    userinfo: any;
    filter: any;
    pickup_date: string;
    empty_ret_date: string;
}

export interface SearchQuery {
    searchString: string;
    fromdate: string;
    todate: string;
    mblid: string;
}

export interface SeaImpHouseModel {
    sortcol : string ;
    sortorder : boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_cargo_imp_housem[];
}
