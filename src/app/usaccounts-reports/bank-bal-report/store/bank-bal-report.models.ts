import { Tbl_acc_ledger } from '../../models/Tbl_acc_ledger';
import { Tbl_Bank_List } from '../../models/Tbl_Bank_List';
export interface ReportState {

    pkid: string,
    urlid: string,
    menuid: string;
    currentTab: string;

    tdate: string;
    comp_type:string;
    comp_name: string;
    comp_code:string;
    bankids:string;

    page_rows: number;
    page_count: number;
    page_current: number;
    page_rowcount: number;
    records: Tbl_acc_ledger[];
    // bankrecords: Tbl_Bank_List[];
    // bankfullrecords: Tbl_Bank_List[];
}