
import { Tbl_cargo_exp_desc } from '../models/Tbl_cargo_exp_desc';

export interface vm_Tbl_cargo_exp_mbldet {
        mode: string;
        pkid: string;
        record: Tbl_cargo_exp_mbldet;
        records : Tbl_cargo_exp_desc[];
        userinfo: any
    }

    

export interface Tbl_cargo_exp_mbldet {

        mbld_pkid: string;
        mbld_refno: string;
        mbld_cfno: number;
        mbld_dockno: string;
        mbld_booking_no: string;

        mbld_shipper_id: string;
        mbld_shipper_code: string;
        mbld_shipper_name: string;
        mbld_shipper_add1: string;
        mbld_shipper_add2: string;
        mbld_shipper_add3: string;
        mbld_shipper_add4: string;

        mbld_clean: string;

        mbld_ship_term: string;

        mbld_cntr_type: string;

        mbld_print_kgs: string;
        mbld_print_lbs: string;

        _mbld_print_kgs: boolean;
        _mbld_print_lbs: boolean;


        mbld_consignee_id: string;
        mbld_consignee_code: string;
        mbld_consignee_name: string;

        mbld_consigned_to1: string;
        mbld_consigned_to2: string;
        mbld_consigned_to3: string;
        mbld_consigned_to4: string;
        mbld_consigned_to5: string;

        mbld_agent_id: string;
        mbld_agent_code: string;
        mbld_agent_name: string;
        mbld_agent_add1: string;
        mbld_agent_add2: string;
        mbld_agent_add3: string;



        mbld_liner_id: string;
        mbld_liner_code: string;
        mbld_liner_name: string;

        mbld_notify_id: string;
        mbld_notify_code: string;
        mbld_notify_name: string;
        mbld_notify_add1: string;
        mbld_notify_add2: string;
        mbld_notify_add3: string;
        mbld_notify_add4: string;

        mbld_sendto_id: string;
        mbld_sendto_code: string;
        mbld_sendto_name: string;
        mbld_sendto_add1: string;
        mbld_sendto_add2: string;
        mbld_sendto_add3: string;
        mbld_sendto_add4: string;

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
        _mbld_is_cntrized: boolean;

        mbld_exp_ref1: string;
        mbld_exp_ref2: string;
        mbld_exp_ref3: string;
        mbld_exp_ref4: string;


        mbld_issued_date: string;

        mbld_pol_etd: string;

        mbld_pol_name: string;
        mbld_pod_name: string;

        mbld_vessel: string;
        mbld_voyage: string;


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

        rec_created_date: string;
        rec_created_by: string;
        rec_created_id: string;
        rec_created_email: string;

        mbld_consigned_to6: string;
        mbld_mblno: string;
        mbld_carrier_name: string;
        mbld_pofd_name: string;
        mbld_commodity: string;
        mbld_etd_day: string;
        mbld_etd_month: string;
        mbld_etd_year: string;


        pkg1 : string ;
        pkg2 : string ;
        pkg3 : string ;
      
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
        mark11 : string ;
        mark12 : string ;
        mark13 : string ;
        mark14 : string ;
        mark15 : string ;
        mark16 : string ;
        mark17: string ;
      
      
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



