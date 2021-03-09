import { Tbl_acc_Trialbalance  } from '../../models/Tbl_acc_Trialbalance';
export interface ReportState {
    pkid: string,
    urlid: string,
    menuid: string;
    currentTab: string;
    basedon: string;
    fdate: string;
    tdate: string;
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
    records: Tbl_acc_Trialbalance[];
}