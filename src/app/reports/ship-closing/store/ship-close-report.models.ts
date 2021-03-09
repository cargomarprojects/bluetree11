import { Tbl_shipment_close } from '../../models/Tbl_shipment_close';
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
    
    page_rows :number;
    page_count :number;
    page_current :number;
    page_rowcount :number;        
    records : Tbl_shipment_close[];
}