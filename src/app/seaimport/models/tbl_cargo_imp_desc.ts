export interface Tbl_cargo_imp_desc {
    parentid: string;
    parent_type: string;
    cargo_ctr: number;
    cargo_marks: string;
    cargo_packages: string;
    cargo_description: string;
}

export interface vm_tbl_cargo_imp_desc {
    mode: string;
    records: Tbl_cargo_imp_desc[]
    pkid:string;
    source:string;
    userinfo: any;
    filter: any;
}