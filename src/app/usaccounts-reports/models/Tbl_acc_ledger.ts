import { PageQuery } from '../../shared/models/pageQuery';

export class Tbl_acc_ledger {
    jv_pkid: string;
    jv_vrno: string;
    jv_docno: string;
    jv_date: string;
    jv_year: number;
    jv_type: string;
    jv_total: number;
    jv_narration: string;
    jv_hrefno: string;
    jv_hrefdate: string;

    jv_row_pkid: string;
    jv_header_id: string;
    jv_acc_id: string;
    acc_code: string;
    acc_name: string;
    acc_type: string;
    acc_against_drcr: string;
    acc_is_costcenter: string;
    acc_is_arap_code: string;

    jv_acc_subledger_id: string;
    jv_acc_subledger_code: string;
    jv_acc_subledger_name: string;

    jv_allocationexists: string;

    jv_drcr: string;
    jv_amount: number;
    jv_curr_code: string;
    jv_curr_name: string;
    jv_exrate: number;
    jv_dcamt: number;
    jv_debit: number;
    jv_credit: number;
    jv_remarks: string;
    jv_refno: string;
    jv_refdate: string
    jv_balance: number;

    jv_doc_type: string;
    jv_bank: string;
    jv_chqno: string;
    jv_due_date: string;
    jv_paidto: string;

    jv_reconciled: string;

    jv_posted_date: string;
    jv_reconciled_by: string;
    jv_reconciled_date: string;
}

export interface SearchQuery {
    accId: string;
    accCode: string;
    accName: string;
    sdate: string;
    edate: string;
    sdate2: string;
    edate2: string;
    chkreconciled: boolean;
    chkunreconciled: boolean;
    lbl_op: string;
    lbl_trans_dr: string;
    lbl_trans_cr: string;
    lbl_balance: string;
}
export interface BankReconModel {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_acc_ledger[]
}
export interface vm_Tbl_acc_ledger {
    record: Tbl_acc_ledger;
    userinfo: any;
}