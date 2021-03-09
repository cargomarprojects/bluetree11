import { TBL_MBL_REPORT } from '../../models/TBL_MBL_REPORT';
export interface ReportState{ 

    pkid : string,    
    urlid : string,
    menuid : string;

    currentTab : string ;
    from_date : string ;
    to_date : string ;
    job_type : string ;
    group : string ;
    branch : string ;
    handled_id : string ;
    handled_name : string ;
    reporttype : string ;
    filename: string;
    filetype: string;
    filedisplayname: string;
    
    page_rows :number;
    page_count :number;
    page_current :number;
    page_rowcount :number;        
    records :  TBL_MBL_REPORT[]
}