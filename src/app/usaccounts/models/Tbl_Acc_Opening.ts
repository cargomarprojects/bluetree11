
import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    balance : string ;
    searchString: string;
}

export interface Tbl_Acc_Opening {
    op_pkid: string;
    op_vrno: string;
    op_docno: string;
    op_date: string;
    op_year: number;
    op_type: string;
    op_acc_id: string;
    op_acc_code: string;
    op_acc_name: string;
    op_amt: number;
    op_drcr: string;
    op_dr: number;
    op_cr: number;
    op_curr_code: string;
    op_ex_rate: number;
    op_famt: number;
    op_arap: string;
    op_cust_id: string;
    op_cust_code: string;
    op_cust_name: string;
    op_invno: string;
    op_invdate: string;
    op_is_paid: string;
    op_inv_refno: string;
    op_mbl_refno: string;
    rec_created_by: string;
    rec_created_date: string;
    rec_closed: string;
}

export interface AccOpeningModel {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_Acc_Opening[]
}

export interface vm_tbl_accOpening {
    mode: string;
    pkid: string;
    record: Tbl_Acc_Opening;
    userinfo: any,
    filter: any;
}
