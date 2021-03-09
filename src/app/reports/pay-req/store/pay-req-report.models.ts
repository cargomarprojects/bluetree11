import { Tbl_Cargo_Payrequest } from '../../models/Tbl_Cargo_Payrequest';
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
    user_id: string ;
    user_name: string ;
    
    page_rows :number;
    page_count :number;
    page_current :number;
    page_rowcount :number;        
    records : Tbl_Cargo_Payrequest[];
}