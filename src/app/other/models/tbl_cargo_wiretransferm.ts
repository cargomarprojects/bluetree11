import { PageQuery } from '../../shared/models/pageQuery';

export interface Tbl_Cargo_Wiretransferm {
    cwm_pkid: string;
    cwm_slno: number;
    cwm_refno: string;
    cwm_to_name: string;
    cwm_company_id: string;
    cwm_company_code: string;
    cwm_company_name: string;
    cwm_company_fax: string;
    cwm_company_tel: string;
    cwm_acc_number: string;
    cwm_request_type: string;
    cwm_from_name: string;
    cwm_date: string;
    cwm_senders_reference: string;
    cwm_your_reference: string;
    cwm_is_urgent: boolean;
    cwm_is_review: boolean;
    cwm_is_comment: boolean;
    cwm_is_reply: boolean;
    cwm_is_recycle: boolean;
    cwm_remarks: string;
}

export interface Tbl_Cargo_Wiretransferd {
    cwd_pkid: string;
    cwd_parent_id: string;
    cwd_type: string;
    cwd_beneficiary_id: string;
    cwd_beneficiary_code: string;
    cwd_beneficiary_name: string;
    cwd_beneficiary_bank_id: string;
    cwd_beneficiary_reference: string;
    cwd_transfer_amt: number;
    pb_pkid: string;
    pb_parent_id: string;
    pb_benefi_address1: string;
    pb_benefi_address2: string;
    pb_benefi_address3: string;
    pb_benefi_acc_no: string;
    pb_bank_name: string;
    pb_bank_address1: string;
    pb_bank_address2: string;
    pb_bank_address3: string;
    pb_swift_code: string;
    pb_iban: string;
    pb_routing_no: string;
    cwd_rows_to_print: number;
}

export interface vm_Tbl_Cargo_Wiretransferm {
    pkid: string;
    mode: string;
    record: Tbl_Cargo_Wiretransferm;
    records: Tbl_Cargo_Wiretransferd[];
    userinfo: any,
    filter: any;
}

export interface SearchQuery {
    searchString: string;
    fromdate: string;
    todate: string;
}

export interface WireTransfermModel {
    sortcol: string;
    sortorder: boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_Cargo_Wiretransferm[]
}
