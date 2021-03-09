import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    balance : string ;
    searchString: string;
    searchType : string ;
    status : string ;
    sdate : string ;
    edate : string;
}

export class Tbl_Acc_Payment {
    pay_pkid: string;
    pay_vrno: string;
    pay_docno: string;
    pay_date: string;
    pay_year: number;
    pay_type: string;
    pay_rp: string;
    pay_narration: string;
    pay_cust_id: string;
    pay_cust_name: string;
    pay_acc_id: string;
    pay_acc_name: string;
    pay_status: string;
    pay_posted: string;

    pay_flag: string;

    pay_signature: string;

    pay_cust_type: string;

    pay_is_payroll: string;


    pay_charges_acc_id: string;
    pay_exdiff_acc_id: string;

    pay_amt: number;

    pay_total: number;
    pay_ar_total: number;
    pay_ap_total: number;
    pay_diff: number;



    pay_total_FC: number;
    pay_ar_total_FC: number;
    pay_ap_total_FC: number;
    pay_diff_FC: number;

    pay_basecurr: string;
    pay_isbasecurr: string;

    pay_currency_code: string;
    pay_bank_amt: number;
    pay_bank_charges: number;
    pay_exchange_diff: number;

    pay_exchange_diff_dr: number;
    pay_exchange_diff_cr: number;
    pay_exrate: number;



    pay_memo: string;

    pay_mode: string;
    pay_chqno: string;
    pay_chq_ctr: number;

    pay_tot_chq: number;

    pay_chq_date: string;
    pay_chq_bank: string;

    pay_depositno: string;
    pay_deposit_date: string;

    pay_from_id: string;
    pay_from_acc_code: string;
    pay_from_acc_name: string;

    pay_to_id: string;
    pay_to_acc_code: string;
    pay_to_acc_name: string;


    pay_invno: string;
    pay_inv_date: string;

    pay_inv_total: number;
    pay_inv_paid: number;
    pay_invrefno: string;
    pay_mblrefno: string;
    pay_mblno: string;

    rec_created_by: string;
    rec_created_date: string;
    rec_closed: string;
    rec_files_attached: string;
    rec_files_attached_chk: string;

    pay_invid: string;
    pay_mblid: string;
    pay_invtype: string;
    pay_hblid: string;

}


export interface AccPaymentModel {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_Acc_Payment[]
}

export interface vm_tbl_accPayment {
    mode: string;
    pkid: string;
    record: Tbl_Acc_Payment;
    userinfo: any,
    filter: any;
}

