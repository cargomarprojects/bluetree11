
import { Tbl_cargo_exp_desc } from '../models/Tbl_cargo_exp_desc';
import { Tbl_cargo_exp_container } from './Tbl_cargo_exp_container';
import { PageQuery } from '../../shared/models/pageQuery';

export interface vm_Tbl_cargo_exp_housem {
    mode: string;
    pkid: string;
    HousePrefix: string;
    IsPol: string;
    IsPod: string;
    iStartNo: number;
    iStep: number;
    record: Tbl_cargo_exp_housem;
    cntrs: Tbl_cargo_exp_container[];
    hbls: Tbl_cargo_exp_housem[];
    records: Tbl_cargo_exp_desc[];
    userinfo: any
}



export interface Tbl_cargo_exp_housem {
    hbl_pkid: string;
    hbl_mbl_id: string;
    hbl_selected: string;
    mbl_no: string;
    mbl_cntr_type: string;
    mbl_cfno: number;
    mbl_lock: string;
    mbl_unlock_date: string;
    mbl_ref_date: string;

    mbl_pol_etd: string;
    mbl_pod_eta: string;


    hbl_doc_no: string;
    mbl_refno: string;
    hbl_houseno: string;
    hbl_date: string;
    hbl_bltype: string;
    hbl_shipper_id: string;
    hbl_shipper_code: string;
    hbl_shipper_name: string;
    hbl_shipper_add1: string;
    hbl_shipper_add2: string;
    hbl_shipper_add3: string;
    hbl_shipper_add4: string;


    hbl_print_kgs: string;
    hbl_print_lbs: string;

    _hbl_print_kgs: boolean;
    _hbl_print_lbs: boolean;


    hbl_obl_telex: string;
    hbl_obl_slno: string;


    hbl_clean: string;

    hbl_consignee_id: string;
    hbl_consignee_code: string;
    hbl_consignee_name: string;

    hbl_consignee_add1: string;
    hbl_consignee_add2: string;
    hbl_consignee_add3: string;
    hbl_consignee_add4: string;



    hbl_consigned_to1: string;
    hbl_consigned_to2: string;
    hbl_consigned_to3: string;
    hbl_consigned_to4: string;
    hbl_consigned_to5: string;

    hbl_agent_id: string;
    hbl_agent_code: string;
    hbl_agent_name: string;
    hbl_agent_add1: string;
    hbl_agent_add2: string;
    hbl_agent_add3: string;
    hbl_agent_tel: string;
    hbl_agent_fax: string;

    hbl_liner_id: string;
    hbl_liner_code: string;
    hbl_liner_name: string;
    hbl_cha_id: string;
    hbl_cha_code: string;
    hbl_cha_name: string;

    hbl_notify_id: string;
    hbl_notify_code: string;
    hbl_notify_name: string;
    hbl_notify_add1: string;
    hbl_notify_add2: string;
    hbl_notify_add3: string;
    hbl_notify_add4: string;



    hbl_sub_house: string;
    hbl_telex_released: string;

    hbl_type_move: string;
    hbl_place_receipt: string;
    hbl_place_delivery: string;
    hbl_pre_carriage: string;
    hbl_origin: string;
    hbl_terminal: string;

    hbl_rout1: string;
    hbl_rout2: string;
    hbl_rout3: string;
    hbl_rout4: string;

    hbl_is_arranged: string;
    hbl_is_cntrized: string;


    _hbl_is_arranged: boolean;
    _hbl_is_cntrized: boolean;

    hbl_goods_nature: string;

    hbl_charges1: string;
    hbl_charges2: string;
    hbl_charges3: string;
    hbl_charges4: string;
    hbl_charges5: string;

    hbl_pp1: string;
    hbl_pp2: string;
    hbl_pp3: string;
    hbl_pp4: string;
    hbl_pp5: string;

    hbl_cc1: string;
    hbl_cc2: string;
    hbl_cc3: string;
    hbl_cc4: string;
    hbl_cc5: string;


    hbl_by1: string;
    hbl_by2: string;

    hbl_exp_ref1: string;
    hbl_exp_ref2: string;
    hbl_exp_ref3: string;
    hbl_exp_ref4: string;

    hbl_issued_place: string;

    hbl_issued_date: string;
    hbl_originals: number;


    hbl_pol_id: string;
    hbl_pol_code: string;
    hbl_pol_name: string;
    hbl_pol_etd: string;
    hbl_pod_id: string;
    hbl_pod_code: string;
    hbl_pod_name: string;
    hbl_pod_eta: string;
    hbl_pofd_id: string;
    hbl_pofd_code: string;
    hbl_pofd_name: string;
    hbl_pofd_eta: string;

    hbl_frt_status: string;
    hbl_ship_term: string;
    hbl_ship_term_id: string;
    hbl_vessel: string;
    hbl_voyage: string;
    hbl_uom: string;

    hbl_pcs: number;
    hbl_packages: number;
    hbl_cbm: number;
    hbl_weight: number;
    hbl_lbs: number;
    hbl_cft: number;

    hbl_commodity: string;

    hbl_salesman_id: string;
    hbl_salesman_code: string;
    hbl_salesman_name: string;

    hbl_bl_req: string;
    hbl_remark1: string;
    hbl_remark2: string;
    hbl_remark3: string;

    hbl_handled_id: string;
    hbl_handled_code: string;
    hbl_handled_name: string;

    rec_created_date: string;
    rec_created_by: string;
    rec_created_id: string;
    rec_created_email: string;

    hbl_yn: string;
    hbl_format_id: string;
    hbl_draft_format_id: string;
    hbl_shipment_stage: string;


    pkg1: string;
    pkg2: string;
    pkg3: string;

    mark1: string;
    mark2: string;
    mark3: string;
    mark4: string;
    mark5: string;
    mark6: string;
    mark7: string;
    mark8: string;
    mark9: string;
    mark10: string;
    mark11: string;
    mark12: string;
    mark13: string;
    mark14: string;
    mark15: string;
    mark16: string;
    mark17: string;


    desc1: string;
    desc2: string;
    desc3: string;
    desc4: string;

    desc5: string;
    desc6: string;
    desc7: string;
    desc8: string;
    desc9: string;
    desc10: string;

    desc11: string;
    desc12: string;
    desc13: string;
    desc14: string;
    desc15: string;
    desc16: string;
    desc17: string;

    hbl_checked: boolean;
    hbl_delivery_date:string;

}

export interface SearchQuery {
    searchString: string;
    fromdate: string;
    todate: string;
    mblid: string;
}

export interface SeaExpHouseModel {
    sortcol : string ;
    sortorder : boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_cargo_exp_housem[];
}