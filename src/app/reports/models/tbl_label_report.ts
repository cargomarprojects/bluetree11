export class TBL_LABELM {
    lblm_mbl_pkid: string;
    lblm_mbl_no: string;
    lblm_origin: string;
    lblm_pod: string;
    lblm_destination: string;
    lblm_refno: string;
    lblm_carrier: string;
    lblm_voyage: string;
    lblm_etd: string;
    lblm_eta: string;
    lblm_handled_by: string;
    lblm_agent: string;
    lblm_mode: string;
    lblm_refdate: string;
    lblm_input: string;
    lblm_tot_house: number;
    lblm_tot_container: number;
    lblm_tot_rows: number;
    lblm_yn: string;
    lblm_yn_b: boolean;
}

export class TBL_LABELD {
    lbld_mbl_pkid: string;
    lbld_house_no: string;
    lbld_consignee: string;
    lbld_shipper: string;
    lbld_pcs: number;
    lbld_kgs: number;
    lbld_cbm: number;

}

export class TBL_LABELCONTAINER {
    cntr_hblid: string;
    cntr_no: string;
    cntr_type: string;
}