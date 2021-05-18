export interface Tbl_cargo_ehbl {
    ebl_pkid: string;
    ebl_agent_id: string;
    ebl_download_max_no: number;
    ebl_start_no: number;
    ebl_running_no: number;
    ebl_ending_no: number;
    ebl_color: string;
    rec_locked: string;
    rec_status: string;
    rec_created_by: string;
    rec_created_date: string

}

export interface Tbl_cargo_ehbld {
    ebld_pkid: string;
    ebld_agent_id: string;
    ebld_req_nos: number;
    ebld_req_start_no: number;
    ebld_req_end_no: number;
    ebld_approved: string;
    ebld_approved_by: string;
    ebld_approved_date: string;

}