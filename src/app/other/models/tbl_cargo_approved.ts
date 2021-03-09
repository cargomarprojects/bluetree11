import { PageQuery } from '../../shared/models/pageQuery';

 
export interface Tbl_Cargo_Approved {

    ca_pkid: string;
    ca_type: string;
    ca_doc_type: string;
    ca_ref_id: string;
    ca_ref_no: string;
    ca_remarks: string;
    ca_user_id: string;
    ca_user_name: string;
    ca_is_approved: string;
    ca_date: string;
    rec_created_date: string;
    rec_created_by: string;
    ca_hbl_id: string;
    ca_hbl_no: string;
    ca_inv_id: string;
    ca_inv_no: string;
    ca_consignee_id: string;
    ca_consignee_name: string;
    ca_approved_tot: number;
    ca_notapproved_tot: number;
    ca_customer_name: string;
    ca_inv_amt: number;
    ca_approvedby_name: string;
    ca_approvedby_id: string;
    ca_approved_date: string;
    ca_mode: string;
    ca_obl_recvd_date: string;
    ca_payment_recvd_date: string;
    ca_is_hide: string;
    ca_hide_status: string;
    ca_req_no: number;
    ca_req_no_str: string;
    ca_reqno: string;
    ca_is_ar_issued: string;
    ca_is_ar_issued_bool: boolean;
    rec_files_attached: string;
    ca_cad_pkid: string;
    ca_hbl_selected: boolean;
    ca_inv_selected: boolean;

}
export interface Tbl_Cargo_Approvedd {
    cad_pkid: string;
    cad_parent_id: string;
    cad_approvedby_id: string;
    cad_is_approved: string;
    cad_approved_date: string;
    cad_approvedby_name: string;
}

export interface vm_tbl_cargo_approved {
    mode: string;
    record: Tbl_Cargo_Approved;
    detrecord: Tbl_Cargo_Approvedd;
    userinfo: any,
    filter: any;
}

export interface SearchQuery {
    searchString: string;
    fromDate: string;
    toDate: string;
    sortParameter: string;
    isHidden: boolean;
    caType: string;
    userName: string;
    userId: string;
    userLovDisabled: boolean;
    userLovCaption: string;
}

export interface ApprovedPageModel {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_Cargo_Approved[]
}
