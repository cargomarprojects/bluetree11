export interface tbl_trk_summary_container {

  refid: string;
  refno: string;
  mbl: string;
  booking_no: string;
  carrier_name: string;
  scac_code: string;
  tracked_at: string;       // MM-dd-yyyy HH:mm (UTC)
  tracking_status: string;

  container_no: string;
  vessel: string;
  voyage: string;
  etd: string;
  eta: string;
  cons_pickup: string;
  empty_return: string;
  dem_lfd: string;
  det_lfd: string;
}

// export interface tbl_trk_summary {
//   refid: string;
//   mbl: string;
//   booking_no: string;
//   carrier_name: string;
//   scac_code: string;
//   tracked_at: string;       // MM-dd-yyyy HH:mm (UTC)
//   tracking_status: string;
//   containers: tbl_trk_summary_container[];
// }
