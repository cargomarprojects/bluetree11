export interface Tbl_cargo_whstock {

    ind_pkid: string;
    ind_type: string;
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
    ind_volume: string;
    ind_volume_uom_id: string;
    ind_volume_uom_code: string;
    ind_volume_uom_name: string;
    ind_slno: number;
    ind_req_cqty: string;
    ind_set_qty: number;
    ind_selected: boolean;
    ind_transfer_cqty: string;
    ind_transfer_qty: number;
    ind_out_cqty: string;
    ind_out_qty: Number;
    ind_bal_cqty: string;
    ind_bal_qty: Number;
    ind_can_transfer: boolean;
}

export interface vm_tbl_cargo_whstock {
    mode: string;
    parentid: string;
    records: Tbl_cargo_whstock[];
    userinfo: any,
    filter: any;
}