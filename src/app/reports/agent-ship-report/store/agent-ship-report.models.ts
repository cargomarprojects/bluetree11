import { TBL_MBL_REPORT } from '../../models/TBL_MBL_REPORT';
export interface ReportState{ 

    pkid : string,    
    urlid : string,
    menuid : string;
    currentTab : string ;
    sdate: string;
    edate: string;
    mode : string;
    comp_type: string;
    cust_id : string ;
    cust_name : string ;
    cust_parent_id : string ;
    cust_parent_name : string ;
    consignee_id : string ;
    consignee_name : string ;
    shipper_id : string ;
    shipper_name : string ;
    filename: string;
    filetype: string;
    filedisplayname: string;
    page_rows :number;
    page_count :number;
    page_current :number;
    page_rowcount :number;        
    records : TBL_MBL_REPORT[]
}