import { PageQuery } from '../../shared/models/pageQuery';
import { Tbl_cargo_exp_desc } from '../../airexport/models/Tbl_cargo_exp_desc';

export interface Tbl_cargo_exp_housem {
    hbl_pkid: string;
    hbl_mbl_id: string;
    hbl_selected: string;
    mbl_no: string;
    mbl_cfno: number;
    mbl_refno: string;
    mbl_lock: string;
    mbl_unlock_date: string;
    mbl_ref_date: string;
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
    hbl_consigned_to6: string;
    hbl_agent_id: string;
    hbl_agent_code: string;
    hbl_agent_name: string;
    hbl_agent_city: string;
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
    hbl_place_delivery: string;
    hbl_pol_name: string;
    hbl_pod_name: string;
    hbl_rout1: string;
    hbl_rout2: string;
    hbl_rout3: string;
    hbl_rout4: string;
    hbl_goods_nature: string;
    hbl_charges1: string;
    hbl_charges2: string;
    hbl_charges3: string;
    hbl_charges4: string;
    hbl_charges5: string;
    hbl_porc1: string;
    hbl_porc2: string;
    hbl_porc3: string;
    hbl_porc4: string;
    hbl_porc5: string;
    hbl_rate1: string;
    hbl_rate2: string;
    hbl_rate3: string;
    hbl_rate4: string;
    hbl_rate5: string;
    hbl_total1: string;
    hbl_total2: string;
    hbl_total3: string;
    hbl_total4: string;
    hbl_total5: string;
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
    hbl_print_shpr1: string;
    hbl_print_shpr2: string;
    hbl_print_shpr3: string;
    hbl_print_shpr4: string;
    hbl_print_shpr5: string;
    hbl_print_cons1: string;
    hbl_print_cons2: string;
    hbl_print_cons3: string;
    hbl_print_cons4: string;
    hbl_print_cons5: string;

    
    hbl_print_shpr1_b: boolean;
    hbl_print_shpr2_b: boolean;
    hbl_print_shpr3_b: boolean;
    hbl_print_shpr4_b: boolean;
    hbl_print_shpr5_b: boolean;
    hbl_print_cons1_b: boolean;
    hbl_print_cons2_b: boolean;
    hbl_print_cons3_b: boolean;
    hbl_print_cons4_b: boolean;
    hbl_print_cons5_b: boolean;

    hbl_charges1_carrier: string;
    hbl_charges2_carrier: string;
    hbl_charges3_carrier: string;
    hbl_porc1_carrier: string;
    hbl_porc2_carrier: string;
    hbl_porc3_carrier: string;
    hbl_rate1_carrier: string;
    hbl_rate2_carrier: string;
    hbl_rate3_carrier: string;
    hbl_total1_carrier: string;
    hbl_total2_carrier: string;
    hbl_total3_carrier: string;
    hbl_pp1_carrier: string;
    hbl_pp2_carrier: string;
    hbl_pp3_carrier: string;
    hbl_cc1_carrier: string;
    hbl_cc2_carrier: string;
    hbl_cc3_carrier: string;

    hbl_print_shpr1_carrier: string;
    hbl_print_shpr2_carrier: string;
    hbl_print_shpr3_carrier: string;
    hbl_print_cons1_carrier: string;
    hbl_print_cons2_carrier: string;
    hbl_print_cons3_carrier: string;

    hbl_print_shpr1_carrier_b: boolean;
    hbl_print_shpr2_carrier_b: boolean;
    hbl_print_shpr3_carrier_b: boolean;
    hbl_print_cons1_carrier_b: boolean;
    hbl_print_cons2_carrier_b: boolean;
    hbl_print_cons3_carrier_b: boolean;

    hbl_asarranged_shipper: string;
    hbl_asarranged_consignee: string;
    hbl_asarranged_shipper_b: boolean;
    hbl_asarranged_consignee_b: boolean;
    hbl_by1: string;
    hbl_by2: string;
    hbl_by1_carrier: string;
    hbl_by2_carrier: string;
    hbl_exp_ref1: string;
    hbl_exp_ref2: string;
    hbl_exp_ref3: string;
    hbl_exp_ref4: string;
    hbl_issued_date: string;
    hbl_issued_by: string;
    hbl_frt_status: string;
    hbl_vessel: string;
    hbl_voyage: string;
    hbl_pcs: number;
    hbl_packages: number;
    hbl_cbm: number;
    hbl_weight: number;
    hbl_weight_unit: string;
    hbl_lbs: number;
    hbl_cft: number;
    hbl_chwt: number;
    hbl_chwt_lbs: number;
    hbl_rate: number;
    hbl_total: number;
    hbl_uom: string;
    hbl_commodity: string;
    hbl_salesman_id: string;
    hbl_salesman_code: string;
    hbl_salesman_name: string;
    hbl_remark1: string;
    hbl_remark2: string;
    hbl_remark3: string;
    hbl_iata: string;
    hbl_accno: string;
    hbl_oc_status: string;
    hbl_carriage_value: string;
    hbl_customs_value: string;
    hbl_ins_amt: string;
    hbl_class: string;
    hbl_comm: string;
    hbl_lcno: string;
    hbl_aesno: string;
    mbl_pol_code: string;
    mbl_pol_name: string;
    mbl_pod_name: string;
    mbl_currency: string;
    mbl_to_port1: string;
    mbl_by_carrier1: string;
    mbl_to_port2: string;
    mbl_by_carrier2: string;
    mbl_to_port3: string;
    mbl_by_carrier3: string;
    mbl_country_name: string;
    hbl_handled_id: string;
    hbl_handled_code: string;
    hbl_handled_name: string;
    rec_created_date: string;
    rec_created_by: string;
    rec_created_id: string;
    rec_created_email: string;
    hbl_format_id: string;
    hbl_shipment_stage: string;
    hbl_delivery_date: string;

}

export interface Tbl_desc {
    mark1 : string ;
    mark2 : string ;
    mark3 : string ;
    mark4 : string ;
    mark5 : string ;
    mark6 : string ;
    mark7 : string ;
    mark8 : string ;
    mark9 : string ;
    mark10 : string ;
       
  
    desc1 : string ;
    desc2 : string ;
    desc3 : string ;
    desc4 : string ;
  
    desc5 : string ;
    desc6 : string ;
    desc7 : string ;
    desc8 : string ;
    desc9 : string ;
    desc10 : string ;
  
    desc11 : string ;
    desc12 : string ;
    desc13 : string ;
    desc14 : string ;
    desc15 : string ;
    desc16 : string ;
    desc17 : string ;
}

export interface vm_tbl_cargo_exp_housem {
    mode: string;
    pkid: string;
    housePrefix : string;
    isPol : string; 
    isPod : string;
    iStartNo : number;
    iStep  : number;
    record: Tbl_cargo_exp_housem;
    records : Tbl_cargo_exp_desc[];
    userinfo: any,
    filter: any;
}

export interface SearchQuery {
    searchString: string;
    fromdate: string;
    todate: string;
    searchtype: string;
}

export interface AirExpHouseModel {
    sortcol : string ;
    sortorder : boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_cargo_exp_housem[]
}