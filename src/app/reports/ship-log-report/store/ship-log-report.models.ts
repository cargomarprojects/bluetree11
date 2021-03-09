import { Tbl_cargo_general } from '../../../other/models/tbl_cargo_general'
export interface ReportState {

    pkid: string,
    urlid: string,
    menuid: string;
    currentTab: string;

    job_mode:string;
    date_basedon:string;
    sdate: string;
    edate: string;
    shipper_id:string;
    shipper_name:string;
    consignee_id:string;
    consignee_name:string;
    agent_id:string;
    agent_name:string;
    handled_basedon:string;
    handled_id:string;
    handled_name:string;
    report_masterwise:boolean;
    report_housewise:boolean ;
    checkList: any[];
    sort_order:string;
    format_type:string;
    printer_friendly:boolean;
    reportformat: string ;

    page_rows: number;
    page_count: number;
    page_current: number;
    page_rowcount: number;
    records: Tbl_cargo_general[]
}