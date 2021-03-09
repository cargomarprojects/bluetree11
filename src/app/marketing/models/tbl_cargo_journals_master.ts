import { PageQuery } from '../../shared/models/pageQuery';

export interface Tbl_Cargo_Journals_Master {
    cjm_pkid: string;
    cjm_customer_id: string;
    cjm_customer_code: string;
    cjm_customer_name: string;
    cjm_user_id: string;
    cjm_user_name: string;
    cjm_salesman_name: string;
    cjm_city: string;
    cjm_state: string;
    cjm_pincode: string;
    rec_memo: string;
    rec_files_attached: string;
    rec_created_by: string;
    rec_created_date: string;
}

export interface vm_Tbl_Cargo_Journals_Master {
    mode: string;
    pkid: string;
    record: Tbl_Cargo_Journals_Master;
    userinfo: any,
    filter: any;
}

export interface SearchQuery {
    searchString: string;
}

export interface SalesJournalModel {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_Cargo_Journals_Master[]
}

export interface Tbl_Mark_Contacts {

    gen_pkid: string;
    gen_type: string;
    gen_type2: string;
    gen_code: string;
    gen_short_name: string;
    gen_name: string;

    gen_status: string;

    gen_salesman_id: string;
    gen_salesman_code: string;
    gen_salesman_name: string;

    gen_handled_id: string;
    gen_handled_code: string;
    gen_handled_name: string;

    gen_pros_category: string;

    gen_address1: string;
    gen_address2: string;
    gen_address3: string;
    gen_address4: string;
    gen_location: string;
    gen_state: string;

    gen_country_id: string;
    gen_country: string;
    gen_country_code: string;
    gen_country_name: string;

    gen_parent_name: string;
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

    gen_nomination: string;
    gen_priority: number;
    gen_brokers: string;
    gen_poa_customs_yn: string;
    gen_poa_isf_yn: string;

    gen_bond_yn: string;
    gen_purch_from: string;
    gen_bondno: string;
    gen_bond_expdt: string;

    rec_memo: string;

    rec_files_attached: string;

    rec_created_by: string;
    rec_created_date: string;

    cjm_customer_id: string;
    cjm_user_id: string;
    cjm_pkid: string;
}

export interface Tbl_Mast_Contacts {

    cont_pkid: string;
    cont_parent_id: string;
    cont_type: string;
    cont_order: number;
    cont_name: string;
    cont_title: string;
    cont_email: string;
    cont_tel: string;
    cont_mobile: string;
    cont_remarks: string;
    cont_oth_messenger: string;

}