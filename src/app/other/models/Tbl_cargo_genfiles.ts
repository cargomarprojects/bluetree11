
import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    balance: string;
    searchString: string;
    sdate: string;
    edate: string;
    accNo: string;
}



export interface Tbl_cargo_genfiles {
    gf_pkid: string;
    gf_slno: number;
    gf_type: string;
    gf_name: string;
    gf_accno: string;
    gf_mmyy: string;
    gf_month: number;
    gf_year: number;
    gf_remarks: string;
    rec_created_by: string;
    rec_created_date: string;
    gf_file_id: string;
    gf_file_name: string;
    gf_file_uri: string;
    rec_files_attached: string;
    gf_category: string;
    gf_refno: string;
    gf_prefix: string;
    rec_branch_code: string;
}


export interface Tbl_cargo_genfilesModel {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_cargo_genfiles[]
}

export interface vm_Tbl_cargo_genfiles {
    mode: string;
    pkid: string;
    record: Tbl_cargo_genfiles;
    userinfo: any,
    filter: any;
}

