import { PageQuery } from '../../shared/models/pageQuery';
import { Tbl_Mast_Contacts } from 'src/app/marketing/models/tbl_cargo_journals_master';

export interface Tbl_Mast_Partym {
    gen_pkid: string;
    gen_type: string;
    gen_type2: string;
    gen_code: string;
    gen_short_name: string;
    gen_name: string;
    gen_salesman_id: string;
    gen_salesman_code: string;
    gen_salesman_name: string;
    gen_handled_id: string;
    gen_handled_code: string;
    gen_handled_name: string;
    gen_handled_loc_id: string;
    gen_handled_loc_code: string;
    gen_handled_loc_name: string;
    gen_address1: string;
    gen_address2: string;
    gen_address3: string;
    gen_address4: string;
    gen_location: string;
    gen_state: string;
    gen_is_tbd: string;
    gen_country_id: string;
    gen_country: string;
    gen_country_code: string;
    gen_country_name: string;
    gen_is_memo: string;
    gen_is_qtnmemo: string;
    gen_is_sopmemo: string;
    gen_parent_id: string;
    gen_parent_name: string;
    gen_firm_code: string;
    gen_einirsno: string;
    gen_cha_id: string;
    gen_cha_code: string;
    gen_cha_name: string;
    gen_chb_name: string;
    gen_chb_add1: string;
    gen_chb_add2: string;
    gen_chb_add3: string;
    gen_chb_contact: string;
    gen_chb_tel: string;
    gen_chb_fax: string;
    gen_chb_email: string;
    gen_pincode: string;
    gen_contact: string;
    gen_title: string;
    gen_email: string;
    gen_web: string;
    gen_tel: string;
    gen_mobile: string;
    gen_telex: string;
    gen_fax: string;
    gen_is_shipper: string;
    gen_is_consignee: string;
    gen_is_cha: string;
    gen_is_forwarder: string;
    gen_is_agent: string;
    gen_is_carrier: string;
    gen_is_trucker: string;
    gen_is_vendor: string;
    gen_is_warehouse: string;
    gen_is_miscellaneous: string;
    gen_is_employees: string;
    gen_is_importer: string;
    gen_is_exporter: string;
    gen_is_terminal: string;
    gen_is_terminal2: string;


    gen_branch: string;
    gen_protected: string;
    gen_is_carrier2_sea: string;
    gen_is_shipper_vendor: string;
    gen_is_contractor: string;
    gen_is_ctpat: string;
    gen_ctpat_no: string;
    gen_refer_by: string;
    gen_is_bank: string;
    gen_curr_code: string;
    gen_days: string;
    gen_nomination: string;
    gen_priority: string;
    gen_brokers: string;
    gen_poa_customs_yn: string;
    gen_poa_isf_yn: string;
    gen_bond_yn: string;
    gen_purch_from: string;
    gen_bondno: string;
    gen_bond_expdt: string;
    rec_files_attached: string;
    rec_status: string;
    rec_created_by: string;
    rec_created_date: string;
    gen_criteria: string;
    gen_min_profit: string;
    gen_is_acc_alert: string;
    gen_cust_group_id: string;
    gen_is_actual_vendor: string;
    gen_is_splac: string;
    gen_splac_memo: string;
    gen_is_blackac: string;

    gen_is_shipper_b: boolean;
    gen_is_consignee_b: boolean;
    gen_is_cha_b: boolean;
    gen_is_forwarder_b: boolean;
    gen_is_agent_b: boolean;
    gen_is_carrier_b: boolean;
    gen_is_trucker_b: boolean;
    gen_is_vendor_b: boolean;
    gen_is_warehouse_b: boolean;
    gen_is_miscellaneous_b: boolean;
    gen_is_employees_b: boolean;
    gen_is_importer_b: boolean;
    gen_is_exporter_b: boolean;
    gen_is_terminal_b: boolean;
    gen_is_terminal2_b: boolean;
    gen_is_carrier2_sea_b: boolean;
    gen_is_shipper_vendor_b: boolean;
    gen_is_contractor_b: boolean;
    gen_is_ctpat_b: boolean;
    gen_is_bank_b: boolean;
    gen_poa_customs_yn_b: boolean;
    gen_poa_isf_yn_b: boolean;
    gen_bond_yn_b: boolean;
    gen_is_actual_vendor_b: boolean;
    gen_is_splac_b: boolean;
    gen_is_blackac_b: boolean;
    gen_is_tbd_b:boolean;

}

export interface vm_Tbl_Mast_Partym {
    mode: string;
    record: Tbl_Mast_Partym;
    records: Tbl_Mast_Contacts[];
    userinfo: any,
    filter: any;
}

export interface SearchQuery {
    searchString: string;
    searchSort: string;
    searchState: string;
    searchCity: string;
    searchTel: string;
    searchZip: string;
    searchFax: string;
    searchBlackAc: boolean;
    menuType: string;
}

export interface PartyModel {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_Mast_Partym[]
}