import { TBL_INV_ISSUE_RPT } from '../../models/tbl_inv_issue_rpt';
export interface ReportState {

    pkid: string,
    urlid: string,
    menuid: string;
    currentTab: string;
    report_category: string;
    sdate: string;
    edate: string;
    mode: string;
    comp_type: string;
    report_type: string;
    report_shptype: string;
    filename: string;
    filetype: string;
    filedisplayname: string;

    cust_id: string;
    cust_name: string;

    cust_parent_id: string;
    cust_parent_name: string;
    datetype: string;
    araptype: string;
    reportformat: string;
    page_rows: number;
    page_count: number;
    page_current: number;
    page_rowcount: number;
    records: TBL_INV_ISSUE_RPT[];
}