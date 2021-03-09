export interface Tbl_cargo_imp_custhold {
    cust_parentid:string;
    cust_title: string;
    cust_comm_inv: string;
    cust_fumi_cert: string;
    cust_insp_chrg: string;
    cust_remarks: string;
    cust_comm_inv_yn: string;
    cust_fumi_cert_yn: string;
    cust_insp_chrg_yn: string;
    IS_comm_inv: boolean;
    IS_fumi_cert: boolean;
    IS_insp_chrg: boolean;
}

export interface vm_tbl_cargo_imp_custhold {
    mode: string;
    record: Tbl_cargo_imp_custhold;
    pkid:string;
    userinfo: any;
    filter: any;
}