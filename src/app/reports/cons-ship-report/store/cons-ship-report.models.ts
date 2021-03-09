import { TBL_MBL_REPORT } from '../../models/TBL_MBL_REPORT';
export interface ReportState{ 

    pkid : string,    
    urlid : string,
    menuid : string;
    currentTab : string ;
    report_category: string;
    sdate: string;
    edate: string;
    mode : string;
    comp_type: string;
    report_type: string;
    report_shptype : string;
    cons_id : string ;
    cons_name : string ;
    reportformat : string ;
    filename: string;
    filetype: string;
    filedisplayname: string;
    page_rows :number;
    page_count :number;
    page_current :number;
    page_rowcount :number;        
    records : TBL_MBL_REPORT[]
}