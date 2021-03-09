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
    report_criteria: string;
    report_amount: number;
    report_profit_met: boolean;
    report_loss_approved: boolean;
    cust_id : string ;
    cust_name : string ;
    cust_parent_id : string ;
    cust_parent_name : string ;
    
    sales_id : string ;
    sales_name : string ;    
    filename: string;
    filetype: string;
    filedisplayname: string;
    filename2: string;
    filetype2: string;
    filedisplayname2: string;
    _report_category: string;
    _report_type: string;
    stage:string;
    
    page_rows :number;
    page_count :number;
    page_current :number;
    page_rowcount :number;        
    records : TBL_MBL_REPORT[]
}