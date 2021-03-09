import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    searchString : string ;
}



export interface Tbl_cargo_exp_masterm {
    mbl_pkid: string;
    mbl_cfno: number;
    mbl_refno: string;
    mbl_ref_date: string;
    mbl_no: string;
    mbl_lock: string;
    mbl_unlock_date: string;
    mbl_prefix: string;
    mbl_startingno: string;

    mbl_date: string;
    mbl_liner_bookingno: string;
    mbl_agent_id: string;
    mbl_agent_name: string;
    mbl_agent_code: string;

    mbl_agent_tel: string;
    mbl_agent_fax: string;

    mbl_direct: string;
    mbl_direct_bool: boolean;
    
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
    mbl_pofd_eta: string;
    mbl_vessel: string;
    mbl_voyage: string;

    mbl_country_id: string;
    mbl_country_name: string;

    mbl_frt_status: string;
    mbl_ship_term: string;
    mbl_ship_term_id: string;
    mbl_cntr_type: string;

    mbl_telex_released: string;
    mbl_it_no: string;
    mbl_it_date: string;
    mbl_it_port: string;

    mbl_por: string;

    mbl_handled_id: string;
    mbl_handled_name: string;
    mbl_cargo_loc_id: string;
    mbl_devan_loc_id: string;
    mbl_cargo_loccode: string;
    mbl_cargo_locname: string;
    mbl_cargo_locaddr1: string;
    mbl_cargo_locaddr2: string;
    mbl_cargo_locaddr3: string;
    mbl_cargo_locaddr4: string;
    mbl_devan_loccode: string;
    mbl_devan_locname: string;
    mbl_devan_locaddr1: string;
    mbl_devan_locaddr2: string;
    mbl_devan_locaddr3: string;
    mbl_devan_locaddr4: string;

    mbl_shipper_id: number;
    mbl_consignee_id: number;

    mbl_teu: number;

    mbl_weight: number;
    mbl_cbm: number;
    mbl_pcs: number;

    mbl_20: number;
    mbl_40: number;
    mbl_40HQ: number;
    mbl_45: number;
    mbl_cntr_cbm: number;

    mbl_is_held: boolean;
    rec_created_date: string;
    rec_created_by: string;
    rec_created_id: string;
    mbl_sub_houseno: string;
    mbl_container_tot: number;
    mbl_jobtype_id: string;
    mbl_jobtype_code: string;
    mbl_jobtype_name: string;
    mbl_shipment_stage: string;

    mbl_salesman_id: string;
    mbl_salesman_name: string;
    mbl_rotation_no: string;
    rec_files_attached: string;
    mbl_book_slno: number;
    mbl_ismemo_attached: string;
    mbl_cntr_desc: string;
    mbl_cooformat_id:string;
}

export interface Tbl_cargo_exp_container
{
    cntr_pkid : string;
    cntr_hblid : string;
    cntr_catg : string;
    cntr_order : number;
    cntr_no : string;
    cntr_type : string;
    cntr_sealno : string;
    cntr_movement : string;
    cntr_pieces : number;
    cntr_packages_uom : string;
    cntr_packages  : number;
    cntr_cbm : number;
    cntr_teu : number;
    cntr_weight_uom : string;
    cntr_weight : number;
    cntr_tare_weight : number;
    rec_year : number;
    cntr_rider : string;
    cntr_yn : string;
    cntr_selected:boolean;
}



export interface vm_tbl_cargo_exp_masterm {
    mode : string;
    record : Tbl_cargo_exp_masterm;
    cntrs  : Tbl_cargo_exp_container[];
    userinfo : any,
    filter : any;
}

export interface SearchQuery {
    searchString : string ;
    fromdate: string;
    todate: string;
}

export interface seaExpMasterModel {
    sortcol : string ;
    sortorder : boolean;
    errormessage : string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_cargo_exp_masterm[];
}
