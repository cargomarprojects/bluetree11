export interface Tbl_Mast_Addressm {
    add_pkid: string;
    add_parent_id: string;
    add_type: string;
    add_address1: string;
    add_address2: string;
    add_address3: string;
    add_address4: string;
    add_location: string;
    add_state: string;
    add_country: string;
    add_pincode: string;
    add_contact: string;
    add_email: string;
    add_web: string;
    add_tel: string;
    add_mobile: string;
    add_telex: string;
    add_fax: string;
    add_is_same: string;
    add_country_id: string;
    add_country_name: string;
    add_is_chk_address: string;
    rec_created_by: string;
    rec_created_date: string;
    add_check_name: string;
    add_is_chk_address_b:boolean;
}

export interface vm_Tbl_Mast_Addressm {
    mode: string;
    record: Tbl_Mast_Addressm;
    pkid: string;
    userinfo: any;
    filter: any;
}