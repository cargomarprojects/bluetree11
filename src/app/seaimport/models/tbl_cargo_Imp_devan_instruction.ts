export interface Tbl_Cargo_Imp_Devan_Instruction {
    di_parent_id: string;
    di_request_to_id: string;
    di_cargo_loc_id: string;
    di_remark1: string;
    di_remark2: string;
    di_remark3: string;
    di_request_to_code: string;
    di_request_to_name: string;
    di_request_to_addr1: string;
    di_request_to_addr2: string;
    di_request_to_addr3: string;
    di_request_to_addr4: string;
    di_request_to_firmcode: string;
    di_cargo_loc_code: string;
    di_cargo_loc_name: string;
    di_cargo_loc_addr1: string;
    di_cargo_loc_addr2: string;
    di_cargo_loc_addr3: string;
    di_cargo_loc_addr4: string;
    di_cargo_loc_firmcode: string;
    di_mbl_refno: string;
    di_mbl_no: string;
    di_mbl_vessel: string;
    di_mbl_voyage: string;
    di_mbl_pod_eta: string;
    di_mbl_pol_name: string;
    di_rec_created_email: string;
    di_rec_created_by: string;
    di_is_devan_sent: boolean;
    di_devan_date: string;
}

export interface vm_Tbl_Cargo_Imp_Devan_Instruction {
    mode: string;
    record: Tbl_Cargo_Imp_Devan_Instruction;
    pkid: string;
    userinfo: any;
    filter: any;
}