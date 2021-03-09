import { PageQuery } from '../../shared/models/pageQuery';

export interface Tbl_Cargo_Qtn_Rates {
    qtnr_pkid: string;
    qtnr_slno: number;
    qtnr_refno: string;
    qtnr_agent_id: string;
    qtnr_agent_code: string;
    qtnr_agent_name: string;
    qtnr_pol_cntry_id: string;
    qtnr_pol_cntry_code: string;
    qtnr_pol_cntry_name: string;
    qtnr_pod_cntry_id: string;
    qtnr_pod_cntry_code: string;
    qtnr_pod_cntry_name: string;
    qtnr_mode: string;
    qtnr_validity: string;
    qtnr_file_id: string;
    qtnr_file_name: string;
    qtnr_file_uri: string;
    rec_created_by: string;
    rec_created_date: string;
    rec_files_attached: string;

}

export interface vm_tbl_cargo_qtn_rates {
    mode: string;
    pkid: string;
    record: Tbl_Cargo_Qtn_Rates;
    userinfo: any,
    filter: any;
}

export interface SearchQuery {
    searchString: string;
    fromdate: string;
    todate: string;
    searchtype: string;
}

export interface QtnRateModel {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_Cargo_Qtn_Rates[]
}