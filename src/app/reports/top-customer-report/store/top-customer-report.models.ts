import { TBL_MBL_REPORT } from '../../models/TBL_MBL_REPORT';
export interface ReportState {

    pkid: string,
    urlid: string,
    menuid: string;

    currentTab: string;

    report_category: string;
    sdate: string;
    edate: string;
    comp_type: string;
    report_type: string;
    reportformat: string;
    topnum: number;
    toporder: string;
    radio_exp: string;
    report_amt_caption: string;
    group_by_parent: boolean;
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
    records: TBL_MBL_REPORT[]
}