import { Tbl_OS_REPORT } from '../../models/Tbl_OS_Report';
export interface ReportState {

    pkid: string,
    urlid: string,
    menuid: string;
    currentTab: string;
    cust_id: string;
    cust_name: string;
    adate: string;
    ddate: string;
    comp_name: string;
    comp_code: string;

    comp_type: string;
    bank_id: string;
    bank_name: string;
    radio_cust: string;
    showall: boolean;
    showprofit: boolean;
    sortname: string;
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
    idlist:any[];
}