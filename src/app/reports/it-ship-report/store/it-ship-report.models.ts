import { TBL_MBL_REPORT } from '../../models/TBL_MBL_REPORT';
export interface ReportState{ 

    pkid : string,    
    urlid : string,
    menuid : string;
    currentTab : string ;
    
    sdate: string;
    edate: string;
    comp_type: string;

    page_rows :number;
    page_count :number;
    page_current :number;
    page_rowcount :number;        
    records : TBL_MBL_REPORT[]
}