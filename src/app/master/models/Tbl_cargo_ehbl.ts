import { PageQuery } from '../../shared/models/pageQuery';
export interface Tbl_cargo_ehbl {
    ebl_pkid: string;
    ebl_agent_id: string;
    ebl_agent_code: string;
    ebl_agent_name: string;
    ebl_download_max_no: number;
    ebl_start_no: number;
    ebl_running_no: number;
    ebl_ending_no: number;
    ebl_color: boolean;

    rec_mode: string;
    rec_locked: string;
    rec_status: string;
    rec_created_by: string;
    rec_created_date: string

}

export interface Tbl_cargo_ehbld {
    ebld_pkid: string;
    ebld_agent_id: string;
    ebld_agent_code: string;
    ebld_agent_name: string;
    ebld_req_nos: number;
    ebld_req_start_no: number;
    ebld_req_end_no: number;
    ebld_approved: boolean;
    ebld_approved_by: string;
    ebld_approved_date: string;
    rec_mode: string;
    rec_created_by: string;
    rec_created_date: string;
}

export interface vm_Tbl_cargo_ehbl {
    mode: string;
    record: Tbl_cargo_ehbl;
    pkid: string;
    userinfo: any;
    filter: any;
}

export interface vm_Tbl_cargo_ehbld {
    mode: string;
    record: Tbl_cargo_ehbld;
    pkid: string;
    userinfo: any;
    filter: any;
}
