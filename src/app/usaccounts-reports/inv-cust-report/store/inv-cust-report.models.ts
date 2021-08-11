import { Tbl_OS_REPORT } from '../../models/Tbl_OS_Report';
export interface ReportState {
    pkid: string,
    urlid: string,
    menuid: string;
    currentTab: string;
    cust_id: string;
    cust_code: string;
    cust_name: string;
    sortname: string;
    sortcol : string ;
    sortorder : boolean;    
    page_rows: number;
    page_count: number;
    page_current: number;
    page_rowcount: number;
    records: Tbl_OS_REPORT[];
}