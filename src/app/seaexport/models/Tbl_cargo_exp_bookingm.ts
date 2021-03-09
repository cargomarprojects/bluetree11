
export interface vm_Tbl_cargo_exp_bookingm {
    mode: string;
    record: Tbl_cargo_exp_bookingm;
    userinfo: any
}

export class Tbl_cargo_exp_bookingm {
    book_pkid: string;
    book_cfno: number;
    book_refno: string;

    book_no: string;

    book_date: string;
    book_shipper_id: string;
    book_shipper_code: string;
    book_shipper_name: string;

    book_shipper_add1: string;
    book_shipper_add2: string;
    book_shipper_add3: string;
    book_shipper_add4: string;
    book_shipper_add5: string;

    book_consignee_id: string;
    book_consignee_name: string;
    book_forwarder_id: string;
    book_forwarder_name: string;
    book_trucker_id: string;
    book_trucker_name: string;

    book_handled_id: string;
    book_handled_name: string;
    book_handled_email: string;

    book_salesman_id: string;
    book_salesman_name: string;

    book_vessel: string;
    book_voyage: string;
    book_exp_refno: string;

    book_por_place: string;
    book_pol_id: string;
    book_pol_name: string;
    book_pol_etd: string;
    book_pod_id: string;
    book_pod_name: string;
    book_pod_eta: string;
    book_pod_place: string;

    book_commodity: string;
    book_cntrs: string;
    book_package: string;
    book_weight: string;
    book_cbm: string;

    book_location_id: string;
    book_location_code: string;
    book_location_name: string;
    book_location_addr1: string;
    book_location_addr2: string;
    book_location_addr3: string;
    book_location_addr4: string;

    book_location_city: string;
    book_location_state: string;
    book_location_zip: string;


    book_pickuptime: string;
    

    book_routing1: string;
    book_routing2: string;
    book_routing3: string;




    book_cntr_returnat3: string;
    book_cntr_returnat4: string;

    book_cutoff: string;
    book_cuttime: string;
    book_doc_cutoff: string;
    book_doc_cuttime: string;

    
    book_cntr_pickupat_id: string;
    book_cntr_pickupat_code: string;
    book_cntr_pickupat1: string;
    book_cntr_pickupat2: string;
    book_cntr_pickupat3: string;
    book_cntr_pickupat4: string;


    book_cntr_returnat_id: string;
    book_cntr_returnat_code: string;
    book_cntr_returnat1: string;
    book_cntr_returnat2: string;

    book_remarks1: string;
    book_remarks2: string;
    book_remarks3: string;


    rec_created_email: string;

    rec_year: string;
    rec_locked: string;
    rec_closed: string;
    rec_created_id: string;
    rec_created_by: string;
    rec_created_date: string;
    rec_edited_by: string;
    rec_edited_date: string;
    rec_company_code: string;
    rec_branch_code: string;
    book_liner_name: string;
    book_cntr_retdate_frm: string;
    book_cntr_retdate_to: string;
}
