import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    searchString: string;
    fromdate: string;
    todate: string;
    mblid: string;
}

export interface Tbl_cargo_imp_housem {
    hbl_pkid: string;
    hbl_mbl_id: string;
    hbl_selected: string;
    mbl_no: string;
    mbl_cfno
    mbl_refno: string;
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
    hbl_location_id: string;
    hbl_location_code: string;
    hbl_location_name: string;
    hbl_location_add1: string;
    hbl_location_add2: string;
    hbl_location_add3: string;
    hbl_location_add4: string;
    hbl_location_add5: string;
    hbl_location_firmcode: string;

    hbl_pod_code: string;
    hbl_pod_cntry_code: string;
    hbl_pol_code: string;
    hbl_pol_cntry_code: string;

    hbl_pono: string;

    hbl_it_no: string;
    hbl_it_port: string;
    hbl_it_pcs: number;
    hbl_it_wt: number;
    hbl_it_date: string;

    hbl_it_no2: string;
    hbl_it_port2: string;
    hbl_it_pcs2: number;
    hbl_it_wt2: number;
    hbl_it_date2: string;

    hbl_it_no3: string;
    hbl_it_port3: string;
    hbl_it_pcs3: number;
    hbl_it_wt3: number;
    hbl_it_date3: string;

    hbl_pol_etd: string;
    hbl_pod_eta: string;

    hbl_pod_name: string;
    hbl_pol_name: string;

    hbl_pickup_date: string;
    mbl_ref_date: string;

    hbl_pofd_id: string;
    hbl_pofd_code: string;
    hbl_pofd_name: string;
    hbl_place_final: string;
    hbl_plf_eta: string;
    hbl_pofd_eta: string;

    hbl_frt_status: string;
    hbl_vessel: string;
    hbl_voyage: string;
    hbl_uom: string;
    hbl_packages: number;

    hbl_cbm: number;
    hbl_weight: number;
    hbl_lbs: number;
    hbl_cft: number;

    hbl_chwt: number;
    hbl_chwt_lbs: number;

    hbl_pcs: number;

    hbl_commodity: string;
    hbl_salesman_id: string;
    hbl_salesman_code: string;
    hbl_salesman_name: string;

    hbl_remark1: string;
    hbl_remark2: string;
    hbl_remark3: string;
    hbl_handled_id: string;
    hbl_handled_code: string;
    hbl_handled_name: string;
    hbl_handled_email: string;

    rec_created_date: string;
    rec_created_by: string;
    rec_created_id: string;
    rec_created_email: string;
    hbl_careof_id: string;
    hbl_careof_name: string;
    hbl_boeno: string;
    hbl_shipment_stage: string;
    hbl_is_itshipment: boolean;

    hbl_paid_status: string;
    hbl_cargo_release_status: string;

    hbl_is_pl: boolean;
    hbl_is_ci: boolean;
    hbl_is_carr_an: boolean;
    hbl_custom_reles_status: string;
    hbl_is_delivery: string;
    hbl_lfd_date: string;
    hbl_paid_remarks: string;
    hbl_delivery_date: string;
    hbl_incoterm:string;

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
    desc: Tbl_cargo_imp_desc[];
    hbls: Tbl_cargo_imp_housem[];
    userinfo: any,
    filter: any;
}


export interface AirImpHouseModel {
    sortcol : string ;
    sortorder : boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_cargo_imp_housem[]
}
