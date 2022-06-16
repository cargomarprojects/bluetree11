import { PageQuery } from '../../shared/models/pageQuery';

export interface Tbl_wh_inwardm {
    inm_pkid: string;
    inm_type: string;
    inm_refno: string;
    inm_doc_slno: number;
    inm_doc_no: string;
    inm_doc_date: string;
    inm_arrival_date: string;
    inm_cust_id: string;
    inm_cust_code: string;
    inm_cust_name: string;
    inm_cust_add1: string;
    inm_cust_add2: string;
    inm_cust_add3: string;
    inm_cust_add4: string;
    inm_wh_id: string;
    inm_wh_code: string;
    inm_wh_name: string;
    inm_supplier_id: string;
    inm_supplier_code: string;
    inm_supplier_name: string;
    inm_supplier_add1: string;
    inm_supplier_add2: string;
    inm_supplier_add3: string;
    inm_supplier_add4: string;
    inm_transport_id: string;
    inm_transport_code: string;
    inm_transport_name: string;
    inm_transport_add1: string;
    inm_transport_add2: string;
    inm_transport_add3: string;
    inm_transport_add4: string;
    rec_created_date: string;
    rec_created_by: string;
    inm_prefix: string;
    inm_startingno: string;
}

export interface Tbl_wh_container {
    cntr_pkid: string;
    cntr_parent_id: string;
    cntr_order: number;
    cntr_no: string;
    cntr_type: string;
    cntr_sealno: string;
    cntr_packages: number;
    cntr_packages_uom: string;
    cntr_pallets: number;
    cntr_teu: number;
    cntr_cbm: number;
    cntr_weight: number;
    cntr_weight_uom: string;
}

export interface Tbl_wh_inwardd {

    ind_pkid: string;
    ind_parent_id: string;
    ind_code_id: string;
    ind_code: string;
    ind_product: string;
    ind_desc: string;
    ind_refno: string;
    ind_cqty: string;
    ind_qty: number;
    ind_qty_uom_id: string;
    ind_qty_uom_code: string;
    ind_qty_uom_name: string;
    ind_unit_factor: number;
    ind_packages: number;
    ind_packages_uom_id: string;
    ind_packages_uom_code: string;
    ind_packages_uom_name: string;
    ind_weight: number;
    ind_weight_uom_id: string;
    ind_weight_uom_code: string;
    ind_weight_uom_name: string;
    ind_pallets: number;
    ind_volume: number;
    ind_volume_uom_id: string;
    ind_volume_uom_code: string;
    ind_volume_uom_name: string;
    ind_slno: number;
    ind_req_cqty: string;
    ind_set_qty: number;
    ind_selected: boolean;
}


export interface Tbl_wh_inwarddet {
    indd_pkid: string;
    indd_parent_id: string;
    indd_doc_no: string;
    indd_doc_date: string;
    indd_refno: string;
    indd_cust_id: string;
    indd_code_id: string;
    indd_unit_id: string;
    indd_header_id: string
    indd_xref_id: string;
    indd_xref_header_id: string;
    indd_bal_cqty: string;
    indd_despatch_cqty: string;
    indd_qty: number;
    indd_selected: boolean;
    indd_unit_factor: number;
    indd_slno: number;
}

export interface vm_tbl_wh_inwardm {
    mode: string;
    record: Tbl_wh_inwardm;
    drecords: Tbl_wh_inwardd[];
    detrecords: Tbl_wh_inwarddet[];
    cntrrecords: Tbl_wh_container[];
    userinfo: any,
    filter: any;
}

export interface SearchQuery {
    searchString: string;
    fromdate: string;
    todate: string;
}

export interface WhInwardModel {
    selectedId: string;
    sortcol: string;
    sortorder: boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_wh_inwardm[]
}
