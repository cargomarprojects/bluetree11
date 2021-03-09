import { Tbl_acc_ledger  } from '../../models/Tbl_acc_ledger';
export interface ReportState {

    pkid: string,
    urlid: string,
    menuid: string;
    currentTab: string;
    cust_id: string;
    cust_name: string;
    fdate: string;
    tdate: string;
    comp_name: string;
    comp_code:string;
    radio_cust:string;
    is_ledger:string;
    acc_parent_code:string;
    fy_start_month:number;
  
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
    records: Tbl_acc_ledger[];
}