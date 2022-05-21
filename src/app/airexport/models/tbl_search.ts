import { PageQuery } from '../../shared/models/pageQuery';

export interface Tbl_Search {
    mbl_pkid: string;
    mbl_refno: string;
    mbl_ref_date: string;
    mbl_no: string;
    mbl_date: string;
    mbl_vessel: string;
    mbl_voyage: string;
    mbl_mode: string;
    mbl_liner_bookingno: string;
    mbl_cntr_type: string;
    mbl_shipment_term: string;
    hbl_pkid: string;
    hbl_houseno: string;
    hbl_date: string;
    agent_name: string;
    carrier_name: string;
    pol_name: string;
    pol_etd: string;
    pod_name: string;
    pod_eta: string;
    shipper_name: string;
    consignee_name: string;
    handled_name: string;
    createdby: string;
    createddate: string;
    inv_pkid: string;
    inv_no: string;
    inv_date: string;
    inv_refno: string;
    inv_arap: string;
    inv_total: number;
    inv_paid: number;

    cntr_no: string;
    cntr_type: string;
    cntr_sealno: string;

    pcs: number;
    pkgs: number;
    wt: number;
    chwt: number;
    cbm: number;
    hbl_it_no: string;
    hbl_pono: string;

    gen_pkid: string;
    gen_code: string;
    gen_short_name: string;
    gen_address1: string;
    gen_contact: string;
    gen_country_name: string;
    gen_tel: string;
    gen_fax: string;
    gen_type2: string;

    inv_type: string;
    inv_mbl_refno: string;
    inv_mbl_id: string;
    inv_hbl_id: string;

    rec_branch_code: string;
    hbl_cha_name: string;

}
export interface SearchQuery {
    searchString: string;
    searchType: string;
    isParentChecked: boolean;
    isHouseChecked: boolean;
}

export interface SearchPageModel {
    selectedId: string;
    sortcol: string;
    sortorder: boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_Search[]
}