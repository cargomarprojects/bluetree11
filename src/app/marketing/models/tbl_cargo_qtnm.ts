import { PageQuery } from '../../shared/models/pageQuery';

export interface Tbl_Cargo_Qtnm {
    qtnm_pkid: string;
    qtnm_cfno: number;
    qtnm_no: string;
    qtnm_to_id: string;
    qtnm_to_code: string;
    qtnm_to_name: string;
    qtnm_to_addr1: string;
    qtnm_to_addr2: string;
    qtnm_to_addr3: string;
    qtnm_to_addr4: string;
    qtnm_date: string;
    qtnm_quot_by: string;
    qtnm_valid_date: string;
    qtnm_salesman_id: string;
    qtnm_salesman_name: string;
    qtnm_move_type: string;
    qtnm_por_id: string;
    qtnm_por_code: string;
    qtnm_por_name: string;
    qtnm_pol_id: string;
    qtnm_pol_code: string;
    qtnm_pol_name: string;
    qtnm_pod_id: string;
    qtnm_pod_code: string;
    qtnm_pod_name: string;
    qtnm_pld_name: string;
    qtnm_plfd_name: string;
    qtnm_commodity: string;
    qtnm_package: string;
    qtnm_type: string;
    qtnm_kgs: number;
    qtnm_lbs: number;
    qtnm_cbm: number;
    qtnm_cft: number;
    qtnm_tot_amt: number;
    qtnm_subjects: string;
    qtnm_remarks: string;
    qtnm_office_use: string;
    rec_files_attached: string;
    qtnm_transtime: string;
    qtnm_routing: string;
    qtnm_curr_code: string;
}


export interface Tbl_Cargo_Qtnd_Lcl {
    qtnd_pkid: string;
    qtnd_parent_id: string;
    qtnd_desc_id: string;
    qtnd_desc_code: string;
    qtnd_desc_name: string;
    qtnd_amt: number;
    qtnd_per: string;
    qtnd_transtime: string;
    qtnd_routing: string;
    qtnd_order: number;
    qtnd_old_pkid: string;
    qtnd_old_amt: number;
}

export interface Tbl_Cargo_Qtnd_Fcl {
    qtnd_pkid: string;
    qtnd_parent_id: string;
    qtnd_pol_id: string;
    qtnd_pol_code: string;
    qtnd_pol_name: string;
    qtnd_pod_id: string;
    qtnd_pod_code: string;
    qtnd_pod_name: string;
    qtnd_carrier_id: string;
    qtnd_carrier_code: string;
    qtnd_carrier_name: string;
    qtnd_transtime: string;
    qtnd_routing: string;
    qtnd_cntr_type: string;
    qtnd_etd: string;
    qtnd_cutoff: string;
    qtnd_of: number;
    qtnd_pss: number;
    qtnd_baf: number;
    qtnd_isps: number;
    qtnd_haulage: number;
    qtnd_ifs: number;
    qtnd_tot_amt: number;
    qtnd_order: number;
}

export interface Tbl_Cargo_Qtnd_Air {
    qtnd_pkid: string;
    qtnd_parent_id: string;
    qtnd_pol_id: string;
    qtnd_pol_code: string;
    qtnd_pol_name: string;
    qtnd_pol_cntry_code: string;
    qtnd_pod_id: string;
    qtnd_pod_code: string;
    qtnd_pod_name: string;
    qtnd_pod_cntry_code: string;
    qtnd_carrier_id: string;
    qtnd_carrier_code: string;
    qtnd_carrier_name: string;
    qtnd_transtime: string;
    qtnd_routing: string;
    qtnd_min: string;
    qtnd_etd: string;
    qtnd_45k: string;
    qtnd_100k: string;
    qtnd_300k: string;
    qtnd_500k: string;
    qtnd_1000k: string;
    qtnd_fsc: string;
    qtnd_war: string;
    qtnd_sfc: string;
    qtnd_hac: string;
    qtnd_order: number;

}

export interface vm_Tbl_Cargo_Qtnd_Lcl {
    mode: string;
    pkid: string;
    record: Tbl_Cargo_Qtnm;
    records: Tbl_Cargo_Qtnd_Lcl[]
    userinfo: any,
    filter: any;
    historys: Tbl_Cargo_Qtnd_Lcl[];
}

export interface vm_Tbl_Cargo_Qtnd_Fcl {
    mode: string;
    pkid: string;
    record: Tbl_Cargo_Qtnm;
    records: Tbl_Cargo_Qtnd_Fcl[]
    userinfo: any,
    filter: any;
}

export interface vm_Tbl_Cargo_Qtnd_Air {
    mode: string;
    pkid: string;
    record: Tbl_Cargo_Qtnm;
    records: Tbl_Cargo_Qtnd_Air[]
    userinfo: any,
    filter: any;
}

export interface SearchQuery {
    searchString: string;
    fromdate: string;
    todate: string;
    searchtype: string;
}

export interface QtnmModel {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_Cargo_Qtnm[]
}