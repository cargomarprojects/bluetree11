import { Tbl_acc_ledger } from '../../models/Tbl_acc_ledger';
import { Tbl_OS_REPORT } from '../../models/Tbl_OS_Report';
export interface ReportState {

    pkid: string,
    urlid: string,
    menuid: string;
    currentTab: string;

    jv_year: string;
    edate: string;
    basedon: string;
    comp_type: string;
    comp_code: string;
    comp_name: string;
    report_arap: string;
    currency: string;
    radio_cust: string;
    showall: boolean;
    cust_name: string;
    cust_id: string;
    show_advance: boolean;
    group_by_parent: boolean;
    report_type: string;
    radio_days: string;
    iscustomer: string;
    isparent: string;
    hide_payroll: string;
    
    filename: string;
    filetype: string;
    filedisplayname: string;
    filename2: string;
    filetype2: string;
    filedisplayname2: string;

    page_rows: number;
    page_count: number;
    page_current: number;
    page_rowcount: number;
    records: Tbl_OS_REPORT[];
}