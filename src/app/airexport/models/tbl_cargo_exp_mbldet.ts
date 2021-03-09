import { Tbl_cargo_exp_desc } from '../models/Tbl_cargo_exp_desc';

export interface vm_Tbl_cargo_exp_mbldet {
    mode: string;
    pkid: string;
    record: Tbl_cargo_exp_mbldet;
    records: Tbl_cargo_exp_desc[];
    userinfo: any
}

export interface Tbl_cargo_exp_mbldet {
    mbld_pkid: string;
    mbld_refno: string;

    mbld_shipper_id: string;
    mbld_shipper_code: string;
    mbld_shipper_name: string;
    mbld_shipper_add1: string;
    mbld_shipper_add2: string;
    mbld_shipper_add3: string;
    mbld_shipper_add4: string;

    mbld_clean: string;
    mbld_direct: string;

    mbld_pod_code: string;
    mbld_pod_cntry_code: string;
    mbld_pol_cntry_code: string;

    mbld_consignee_id: string;
    mbld_consignee_code: string;
    mbld_consignee_name: string;

    mbld_consigned_to1: string;
    mbld_consigned_to2: string;
    mbld_consigned_to3: string;
    mbld_consigned_to4: string;
    mbld_consigned_to5: string;
    mbld_consigned_to6: string;

    mbld_agent_id: string;
    mbld_agent_code: string;
    mbld_agent_name: string;
    mbld_agent_city: string;

    mbld_liner_id: string;
    mbld_liner_code: string;
    mbld_liner_name: string;

    mbld_notify_id: string;
    mbld_notify_code: string;
    mbld_notify_name: string;
    mbld_notify_add1: string;
    mbld_notify_add2: string;
    mbld_notify_add3: string;
    mbld_sendto_id: string;
    mbld_sendto_code: string;
    mbld_sendto_name: string;
    mbld_sendto_add1: string;
    mbld_sendto_add2: string;
    mbld_sendto_add3: string;

    mbld_type_move: string;
    mbld_place_receipt: string;
    mbld_place_delivery: string;
    mbld_pre_carriage: string;
    mbld_origin: string;
    mbld_terminal: string;

    mbld_rout1: string;
    mbld_rout2: string;
    mbld_rout3: string;
    mbld_rout4: string;

    mbld_is_cntrized: string;

    mbld_exp_ref1: string;
    mbld_exp_ref2: string;
    mbld_exp_ref3: string;
    mbld_exp_ref4: string;

    mbld_issued_date: string;

    mbld_pol_name: string;
    mbld_pod_name: string;

    mbld_vessel: string;
    mbld_voyage: string;

    mbld_country_name: string;

    mbld_pcs: number;
    mbld_cbm: number;
    mbld_weight: number;
    mbld_lbs: number;
    mbld_cft: number;

    mbld_remark1: string;
    mbld_remark2: string;
    mbld_remark3: string;

    mbld_handled_id: string;
    mbld_handled_code: string;
    mbld_handled_name: string;
    mbld_charges1: string;
    mbld_charges2: string;
    mbld_charges3: string;
    mbld_charges4: string;
    mbld_charges5: string;

    mbld_porc1: string;
    mbld_porc2: string;
    mbld_porc3: string;
    mbld_porc4: string;
    mbld_porc5: string;

    mbld_rate1: string;
    mbld_rate2: string;
    mbld_rate3: string;
    mbld_rate4: string;
    mbld_rate5: string;

    mbld_total1: string;
    mbld_total2: string;
    mbld_total3: string;
    mbld_total4: string;
    mbld_total5: string;

    mbld_print_shpr1: string;
    mbld_print_shpr2: string;
    mbld_print_shpr3: string;
    mbld_print_shpr4: string;
    mbld_print_shpr5: string;

    mbld_print_cons1: string;
    mbld_print_cons2: string;
    mbld_print_cons3: string;
    mbld_print_cons4: string;
    mbld_print_cons5: string;

    mbld_print_shpr1_b: boolean;
    mbld_print_shpr2_b: boolean;
    mbld_print_shpr3_b: boolean;
    mbld_print_shpr4_b: boolean;
    mbld_print_shpr5_b: boolean;
    mbld_print_cons1_b: boolean;
    mbld_print_cons2_b: boolean;
    mbld_print_cons3_b: boolean;
    mbld_print_cons4_b: boolean;
    mbld_print_cons5_b: boolean;


    mbld_pp1: string;
    mbld_pp2: string;
    mbld_pp3: string;
    mbld_pp4: string;
    mbld_pp5: string;

    mbld_cc1: string;
    mbld_cc2: string;
    mbld_cc3: string;
    mbld_cc4: string;
    mbld_cc5: string;

    mbld_charges1_carrier: string;
    mbld_charges2_carrier: string;
    mbld_charges3_carrier: string;
    mbld_charges4_carrier: string;

    mbld_porc1_carrier: string;
    mbld_porc2_carrier: string;
    mbld_porc3_carrier: string;
    mbld_porc4_carrier: string;

    mbld_rate1_carrier: string;
    mbld_rate2_carrier: string;
    mbld_rate3_carrier: string;
    mbld_rate4_carrier: string;

    mbld_total1_carrier: string;
    mbld_total2_carrier: string;
    mbld_total3_carrier: string;
    mbld_total4_carrier: string;

    mbld_pp1_carrier: string;
    mbld_pp2_carrier: string;
    mbld_pp3_carrier: string;
    mbld_pp4_carrier: string;

    mbld_cc1_carrier: string;
    mbld_cc2_carrier: string;
    mbld_cc3_carrier: string;
    mbld_cc4_carrier: string;

    mbld_print_shpr1_carrier: string;
    mbld_print_shpr2_carrier: string;
    mbld_print_shpr3_carrier: string;
    mbld_print_shpr4_carrier: string;

    mbld_print_cons1_carrier: string;
    mbld_print_cons2_carrier: string;
    mbld_print_cons3_carrier: string;
    mbld_print_cons4_carrier: string;


    mbld_print_shpr1_carrier_b: boolean;
    mbld_print_shpr2_carrier_b: boolean;
    mbld_print_shpr3_carrier_b: boolean;
 mbld_print_shpr4_carrier_b: boolean;

    mbld_print_cons1_carrier_b: boolean;
    mbld_print_cons2_carrier_b: boolean;
    mbld_print_cons3_carrier_b: boolean;
 mbld_print_cons4_carrier_b: boolean;


    mbld_asarranged_shipper: string;
    mbld_asarranged_consignee: string;

    
 mbld_asarranged_shipper_b: boolean;
 mbld_asarranged_consignee_b: boolean;

    mbld_by1: string;
    mbld_by2: string;

    mbld_by1_carrier: string;
    mbld_by2_carrier: string;

    mbld_issued_by: string;

    mbld_commodity: string;

    mbld_weight_unit: string;


    mbld_chwt: number;
    mbld_chwt_lbs: number;
    mbld_rate: number;
    mbld_total: number;

    mbld_iata: string;
    mbld_accno: string;
    mbld_frt_status: string;
    mbld_oc_status: string;
    mbld_carriage_value: string;
    mbld_customs_value: string;
    mbld_ins_amt: string;

    mbld_class: string;
    mbld_comm: string;

    mbld_lcno: string;
    mbld_aesno: string;

    mbld_pol_code: string;
    mbld_mbl_no: string;

    mbld_by_carrier1: string;
    mbld_by_carrier2: string;
    mbld_by_carrier3: string;

    mbld_to_port1: string;
    mbld_to_port2: string;
    mbld_to_port3: string;

    mbld_currency: string;

    rec_created_date: string;
    rec_created_by: string;
    rec_created_id: string;
    rec_created_email: string;

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
