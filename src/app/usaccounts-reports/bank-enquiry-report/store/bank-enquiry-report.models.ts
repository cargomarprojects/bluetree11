import { Tbl_Acc_Payment } from '../../models/Tbl_Acc_Payment';
export interface ReportState {

    pkid: string,
    urlid: string,
    menuid: string;
    currentTab: string;
    bank_id: string;
    bank_name: string;
    fdate: string;
    edate: string;
    comp_name: string;
    comp_code:string;

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
    records: Tbl_Acc_Payment[];
}