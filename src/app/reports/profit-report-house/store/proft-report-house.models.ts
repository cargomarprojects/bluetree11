import { TBL_MBL_REPORT } from '../../models/tbl_mbl_report';
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

    cust_id : string ;
    cust_name : string ;
    cust_parent_id:string;
    cust_parent_name:string;
    sales_id : string ;
    sales_name : string ;    
    
    filename: string;
    filetype: string;
    filedisplayname: string;
    filename2: string;
    filetype2: string;
    filedisplayname2: string;
    stage:string;
    client_type:string;

    _report_category: string;
    _report_type: string;

    selectedId : string;
    
    page_rows :number;
    page_count :number;
    page_current :number;
    page_rowcount :number;        
    records : TBL_MBL_REPORT[]
}