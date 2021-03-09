import { Tbl_cargo_invoicem } from '../../models/Tbl_cargo_invoicem';
export interface ReportState{ 

    pkid : string,    
    urlid : string,
    menuid : string;
    currentTab : string ;
    report_category: string;
    sdate: string;
    edate: string;
    showsmode : string;
    comp_type: string;
    sdata: string ;
    sort: string ;

    chk_air_import : boolean;
    chk_sea_import : boolean;
    chk_air_export : boolean,
    chk_sea_export : boolean;
    chk_others : boolean;
    chk_admin_expense : boolean;

    cust_id: string ;
    cust_name: string ;
    
    page_rows :number;
    page_count :number;
    page_current :number;
    page_rowcount :number;        
    records : Tbl_cargo_invoicem[];
}