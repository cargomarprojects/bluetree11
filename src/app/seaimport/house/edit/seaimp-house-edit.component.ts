import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/services/global.service';
import { AutoComplete2Component } from '../../../shared/autocomplete2/autocomplete2.component';
import { SeaImpHouseService } from '../../services/seaimp-house.service';
import { User_Menu } from '../../../core/models/menum';
import { vm_tbl_cargo_imp_housem, Tbl_cargo_imp_container, Tbl_cargo_imp_desc, Tbl_cargo_imp_housem, Table_Address, Tbl_desc } from '../../models/tbl_cargo_imp_housem';
import { SearchTable } from '../../../shared/models/searchtable';
import { Tbl_cargo_imp_masterm } from '../../models/tbl_cargo_imp_masterm';


@Component({
  selector: 'app-seaimp-house-edit',
  templateUrl: './seaimp-house-edit.component.html'
})
export class SeaImpHouseEditComponent implements OnInit {

  @ViewChild('hbl_houseno') hbl_houseno_field: ElementRef;
  @ViewChild('hbl_shipment_stage') hbl_shipment_stage_field: ElementRef;
  @ViewChild('hbl_shipper_code') hbl_shipper_code_field: AutoComplete2Component;
  @ViewChild('hbl_shipper_add1') hbl_shipper_add1_field: ElementRef;
  @ViewChild('hbl_consignee_code') hbl_consignee_code_field: AutoComplete2Component;
  @ViewChild('hbl_consignee_add1') hbl_consignee_add1_field: ElementRef;
  @ViewChild('hbl_agent_name') hbl_agent_name_field: AutoComplete2Component;
  @ViewChild('hbl_cha_code') hbl_cha_code_field: AutoComplete2Component;
  @ViewChild('hbl_packages') hbl_packages_field: ElementRef;
  @ViewChild('hbl_uom') hbl_uom_field: ElementRef;
  @ViewChild('hbl_weight') hbl_weight_field: ElementRef;
  @ViewChild('hbl_cbm') hbl_cbm_field: ElementRef;
  @ViewChild('hbl_lbs') hbl_lbs_field: ElementRef;
  @ViewChild('hbl_cft') hbl_cft_field: ElementRef;
  @ViewChild('hbl_commodity') hbl_commodity_field: ElementRef;
  @ViewChild('hbl_frt_status') hbl_frt_status_field: ElementRef;
  @ViewChild('hbl_ship_term_id') hbl_ship_term_id_field: ElementRef;
  @ViewChild('hbl_bltype') hbl_bltype_field: ElementRef;
  @ViewChild('hbl_handled_name') hbl_handled_name_field: AutoComplete2Component;

  @ViewChild('_hbl_shipper_name') hbl_shipper_name_field: ElementRef;
  @ViewChild('_hbl_consignee_name') hbl_consignee_name_field: ElementRef;
  @ViewChild('_hbl_location_name') hbl_location_name_field: ElementRef;
  @ViewChild('_hbl_notify_name') hbl_notify_name_field: ElementRef;
  @ViewChild('_hbl_salesman_name') hbl_salesman_name_field: AutoComplete2Component;
  @ViewChild('_hbl_cha_name') hbl_cha_name_field: ElementRef;

  @ViewChildren('_cntr_no') cntr_no_field: QueryList<ElementRef>;
  @ViewChildren('_cntr_sealno') cntr_sealno_field: QueryList<ElementRef>;

  mblrecord: Tbl_cargo_imp_masterm = <Tbl_cargo_imp_masterm>{};
  record: Tbl_cargo_imp_housem = <Tbl_cargo_imp_housem>{};
  recorddet: Tbl_desc = <Tbl_desc>{};
  cntrrecords: Tbl_cargo_imp_container[] = [];
  descrecords: Tbl_cargo_imp_desc[] = [];

  // 24-05-2019 Created By Joy  

  tab: string = 'main';
  report_title: string = '';
  report_url: string = '';
  report_searchdata: any = {};
  report_menuid: string = '';
  attach_pkid: string = '';
  attach_type: string = '';
  attach_tablename: string = '';
  attach_pk_column: string = '';
  attach_refno: string = '';
  attach_update_column: string = '';

  ISFBtnForegroundcolor: string;
  OHBLBtnForegroundcolor: string;


  private parentid: string;
  private pkid: string;
  private menuid: string;

  private mode: string;

  private ShipmentType: string;
  //private errorMessage: string;
  private errorMessage: string[] = [];

  private closeCaption: string = 'Return';

  private title: string;
  private isAdmin: boolean;

  private cmbList = {};

  TelexRlsList: any[] = [];
  PaidStatusList: any[] = [];

  is_locked: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: SeaImpHouseService,
  ) { }

  ngOnInit() {
    if (this.route.snapshot.queryParams.parameter == null) {
      this.pkid = this.route.snapshot.queryParams.pkid;
      this.menuid = this.route.snapshot.queryParams.menuid;
      this.mode = this.route.snapshot.queryParams.mode;
      this.parentid = this.route.snapshot.queryParams.parentid;
    } else {
      const options = JSON.parse(this.route.snapshot.queryParams.parameter);
      this.pkid = options.pkid;
      this.menuid = options.menuid;
      this.mode = options.mode;
      this.parentid = options.parentid;
    }
    this.closeCaption = 'Return';
    this.initPage();
    this.actionHandler();
  }

  private initPage() {
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.errorMessage = [];
    this.LoadCombo();
  }

  LoadCombo() {

    if (this.gs.BRANCH_REGION == "USA") {
      this.TelexRlsList = [{ "name": "YES" }
        , { "name": "NO - REQUIRED" }
        , { "name": "NO - RECEIVED" }];
    } else {
      this.TelexRlsList = [{ "name": "YES" }, { "name": "NO" }];
    }

    if (this.gs.BRANCH_REGION == "USA") {
      if (this.gs.company_code == "MNYC") {
        this.PaidStatusList = [{ "name": "NIL" }
          , { "name": "CREDIT" }, { "name": "PAID" }, { "name": "PAID BY CHECK" }, { "name": "PAID BY WIRE" }
          , { "name": "CHECK COPY ACCEPTED" }, { "name": "CHECK RECEIVED BY LAX OFFICE" }, { "name": "CHECK RECEIVED BY NYC OFFICE" }
          , { "name": "PAID BY OTHERS" }, { "name": "NOT PAID" }];

      } else {
        this.PaidStatusList = [{ "name": "NIL" }
          , { "name": "CREDIT" }, { "name": "PAID" }, { "name": "PAID BY CHECK" }, { "name": "PAID BY WIRE" }
          , { "name": "NOT PAID" }];
      }

    } else {
      this.PaidStatusList = [{ "name": "NIL" }
        , { "name": "CREDIT" }, { "name": "PAID" }
        , { "name": "NOT PAID" }];
    }

  }

  NewRecord() {
    this.mode = 'ADD'
    this.actionHandler();
  }

  actionHandler() {
    this.errorMessage = [];
    this.is_locked = false;
    this.initDesc();
    if (this.mode == 'ADD') {
      this.record = <Tbl_cargo_imp_housem>{};
      this.cntrrecords = <Tbl_cargo_imp_container[]>[];
      this.descrecords = <Tbl_cargo_imp_desc[]>[];
      this.pkid = this.gs.getGuid();
      this.InitRecord();
      this.LoadData();
    }
    if (this.mode == 'EDIT') {
      this.GetRecord();
    }
  }

  ngAfterViewInit() {
    // this.hbl_agent_name_field.Focus();
  }
  InitRecord() {
    this.record.hbl_pkid = this.pkid;
    this.record.hbl_mbl_id = this.parentid;
    this.record.mbl_no = '';
    this.record.mbl_refno = '';
    this.record.hbl_houseno = '';
    this.record.hbl_bltype = '';
    this.record.hbl_frt_status = '';
    this.record.hbl_ship_term = '';
    this.record.hbl_ship_term_id = '';
    this.record.hbl_it_no = '';
    this.record.hbl_it_port = '';
    this.record.hbl_consignee_id = '';
    this.record.hbl_consignee_code = '';
    this.record.hbl_consignee_name = '';
    this.record.hbl_consignee_add1 = '';
    this.record.hbl_consignee_add2 = '';
    this.record.hbl_consignee_add3 = '';
    this.record.hbl_consignee_add4 = '';
    this.record.hbl_consignee_add5 = '';
    this.record.hbl_shipper_id = '';
    this.record.hbl_shipper_code = '';
    this.record.hbl_shipper_name = '';
    this.record.hbl_shipper_add1 = '';
    this.record.hbl_shipper_add2 = '';
    this.record.hbl_shipper_add3 = '';
    this.record.hbl_shipper_add4 = '';
    this.record.hbl_shipper_add5 = '';
    this.record.hbl_location_id = '';
    this.record.hbl_location_name = '';
    this.record.hbl_location_code = '';
    this.record.hbl_location_add1 = '';
    this.record.hbl_location_add2 = '';
    this.record.hbl_location_add3 = '';
    this.record.hbl_location_add4 = '';
    this.record.hbl_location_add5 = '';
    this.record.hbl_notify_id = '';
    this.record.hbl_notify_name = '';
    this.record.hbl_notify_code = '';
    this.record.hbl_notify_add1 = '';
    this.record.hbl_notify_add2 = '';
    this.record.hbl_notify_add3 = '';
    this.record.hbl_notify_add4 = '';
    this.record.hbl_notify_add5 = '';
    this.record.hbl_agent_id = '';
    this.record.hbl_agent_name = '';
    this.record.hbl_agent_code = '';
    this.record.hbl_cha_id = '';
    this.record.hbl_cha_code = '';
    this.record.hbl_cha_name = '';
    this.record.hbl_cha_attn = '';
    this.record.hbl_cha_tel = '';
    this.record.hbl_cha_fax = '';
    this.record.hbl_commodity = '';
    this.record.hbl_uom = '';
    this.record.hbl_pcs = 0;
    this.record.hbl_packages = 0;
    this.record.hbl_weight = 0;
    this.record.hbl_lbs = 0;
    this.record.hbl_cbm = 0;
    this.record.hbl_cft = 0;
    this.record.hbl_pono = '';
    this.record.hbl_place_delivery = '';
    this.record.hbl_place_final = '';
    this.record.rec_files_attached = '';
    this.record.hbl_sub_house = '';
    this.record.hbl_ams_fileno = '';
    if (this.gs.BRANCH_REGION == "USA")
      this.record.hbl_telex_released = "NO - REQUIRED";
    else
      this.record.hbl_telex_released = "NO";
    this.record.hbl_isf_no = '';
    this.record.hbl_mov_dad = '';
    this.record.hbl_bl_req = "* ENDORSED ORIGINAL B/L REQUIRED";
    this.record.hbl_remark1 = '';
    this.record.hbl_remark2 = '';
    this.record.hbl_remark3 = '';
    this.record.hbl_devan_instr1 = '';
    this.record.hbl_devan_instr2 = '';
    this.record.hbl_devan_instr3 = '';
    this.record.hbl_salesman_id = '';
    this.record.hbl_salesman_code = '';
    this.record.hbl_salesman_name = '';
    this.record.hbl_handled_id = '';
    this.record.hbl_handled_code = '';
    this.record.hbl_handled_name = '';
    this.record.hbl_handled_email = '';
    this.record.rec_created_email = '';
    this.record.hbl_liner_code = '';
    this.record.hbl_liner_name = '';
    this.record.hbl_vessel = '';
    this.record.hbl_voyage = '';
    this.record.hbl_pol_code = '';
    this.record.hbl_pol_name = '';
    this.record.hbl_pod_code = '';
    this.record.hbl_pod_name = '';
    this.record.hbl_devan_loccode = '';
    this.record.hbl_devan_locname = '';
    this.record.hbl_devan_locaddr1 = '';
    this.record.hbl_devan_locaddr2 = '';
    this.record.hbl_devan_locaddr3 = '';
    this.record.hbl_devan_locaddr4 = '';
    this.record.mbl_cntr_type = '';
    this.record.hbl_careof_id = '';
    this.record.hbl_careof_name = '';
    this.record.mbl_lock = '';
    this.record.hbl_boeno = '';
    this.record.hbl_paid_status = 'NIL';
    this.record.hbl_bl_status = 'NIL';
    this.record.hbl_cargo_release_status = 'NIL';
    this.record.hbl_shipment_stage = 'NIL';
    this.record.hbl_is_itshipment = false;
    this.record.hbl_book_slno = 0;
    this.record.hbl_isf_attached = '';
    this.record.hbl_is_pl = false;
    this.record.hbl_is_ci = false;
    this.record.hbl_is_carr_an = false;
    this.record.hbl_custom_reles_status = 'NA';
    this.record.hbl_is_delivery = 'NA';
    this.record.hbl_paid_remarks = '';
    this.recorddet.hbl_cargo_description9 = "QUANTITY/QUALITY AS PER SHIPPER'S DECLARATION";
    this.recorddet.hbl_cargo_description10 = "CARRIER NOT RESPONSIBLE FOR PACKING OF CARGO";
    this.record.rec_created_by = this.gs.user_code;
    this.record.rec_created_date = this.gs.defaultValues.today;
    this.record.hbl_delivery_date = '';
    this.record.hbl_custom_clear_date = '';
  }

  LoadData() {
    this.record.hbl_pkid = this.pkid;
    this.record.hbl_mbl_id = this.parentid;
    if (this.gs.BRANCH_REGION == "USA")
      this.record.hbl_telex_released = "NO - REQUIRED";
    else
      this.record.hbl_telex_released = "NO";
    this.record.hbl_bl_req = "* ENDORSED ORIGINAL B/L REQUIRED";
    this.record.hbl_paid_status = 'NIL';
    this.record.hbl_bl_status = 'NIL';
    this.record.hbl_cargo_release_status = 'NIL';
    this.record.hbl_shipment_stage = 'NIL';
    this.record.hbl_is_itshipment = false;
    this.record.hbl_custom_reles_status = 'NA';
    this.record.hbl_is_delivery = 'NA';
    this.recorddet.hbl_cargo_description9 = "QUANTITY/QUALITY AS PER SHIPPER'S DECLARATION";
    this.recorddet.hbl_cargo_description10 = "CARRIER NOT RESPONSIBLE FOR PACKING OF CARGO";
    this.record.rec_created_by = this.gs.user_code;
    this.record.rec_created_date = this.gs.defaultValues.today;
    if (this.parentid.trim() != "")
      this.LoadMasterData();
  }

  GetRecord() {

    this.errorMessage = [];
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;

    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.record = <Tbl_cargo_imp_housem>response.record;
        this.cntrrecords = (response.cntrrecords == undefined || response.cntrrecords == null) ? <Tbl_cargo_imp_container[]>[] : <Tbl_cargo_imp_container[]>response.cntrrecords;
        this.descrecords = (response.descrecords == undefined || response.descrecords == null) ? <Tbl_cargo_imp_desc[]>[] : <Tbl_cargo_imp_desc[]>response.descrecords;
        this.mode = 'EDIT';

        if (this.record.hbl_isf_attached == "Y")
          this.ISFBtnForegroundcolor = "red";
        else
          this.ISFBtnForegroundcolor = "white";

        if (this.record.rec_files_attached == "Y")
          this.OHBLBtnForegroundcolor = "red";
        else
          this.OHBLBtnForegroundcolor = "white";

        if (this.gs.BRANCH_REGION == "USA") {
          if (this.record.hbl_telex_released == "NO") {
            if (this.record.hbl_bl_req.includes("RECEIVED"))
              this.record.hbl_telex_released = "NO - RECEIVED";
            else
              this.record.hbl_telex_released = "NO - REQUIRED";
          }
        }

        this.ShipmentType = this.record.mbl_cntr_type;

        this.initDesc();
        if (this.descrecords != null) {
          this.descrecords.forEach(Rec => {
            this.ShowDesc(Rec);
          })
        }
        this.is_locked = this.gs.IsShipmentClosed("SEA IMPORT", this.record.mbl_ref_date, this.record.mbl_lock, this.record.mbl_unlock_date);

        this.hbl_houseno_field.nativeElement.focus();
        // this.hbl_agent_name_field.Focus();
      }, error => {
        this.errorMessage.push(this.gs.getError(error));
      });
  }
  private initDesc() {
    this.recorddet.hbl_cargo_marks1 = '';
    this.recorddet.hbl_cargo_marks2 = '';
    this.recorddet.hbl_cargo_marks3 = '';
    this.recorddet.hbl_cargo_marks4 = '';
    this.recorddet.hbl_cargo_marks5 = '';
    this.recorddet.hbl_cargo_marks6 = '';
    this.recorddet.hbl_cargo_marks7 = '';
    this.recorddet.hbl_cargo_marks8 = '';
    this.recorddet.hbl_cargo_marks9 = '';
    this.recorddet.hbl_cargo_marks10 = '';
    this.recorddet.hbl_cargo_marks11 = '';
    this.recorddet.hbl_cargo_marks12 = '';
    this.recorddet.hbl_cargo_marks13 = '';
    this.recorddet.hbl_cargo_marks14 = '';
    this.recorddet.hbl_cargo_marks15 = '';
    this.recorddet.hbl_cargo_marks16 = '';
    this.recorddet.hbl_cargo_marks17 = '';

    this.recorddet.hbl_cargo_description1 = '';
    this.recorddet.hbl_cargo_description2 = '';
    this.recorddet.hbl_cargo_description3 = '';
    this.recorddet.hbl_cargo_description4 = '';
    this.recorddet.hbl_cargo_description5 = '';
    this.recorddet.hbl_cargo_description6 = '';
    this.recorddet.hbl_cargo_description7 = '';
    this.recorddet.hbl_cargo_description8 = '';
    this.recorddet.hbl_cargo_description9 = '';
    this.recorddet.hbl_cargo_description10 = '';
    this.recorddet.hbl_cargo_description11 = '';
    this.recorddet.hbl_cargo_description12 = '';
    this.recorddet.hbl_cargo_description13 = '';
    this.recorddet.hbl_cargo_description14 = '';
    this.recorddet.hbl_cargo_description15 = '';
    this.recorddet.hbl_cargo_description16 = '';
    this.recorddet.hbl_cargo_description17 = '';
  }
  private ShowDesc(_Record: Tbl_cargo_imp_desc) {

    if (_Record.cargo_ctr == 1) {
      this.recorddet.hbl_cargo_marks1 = _Record.cargo_marks.toString(); this.recorddet.hbl_cargo_description1 = _Record.cargo_description.toString();
    }
    else if (_Record.cargo_ctr == 2) {
      this.recorddet.hbl_cargo_marks2 = _Record.cargo_marks.toString(); this.recorddet.hbl_cargo_description2 = _Record.cargo_description.toString();
    }
    else if (_Record.cargo_ctr == 3) {
      this.recorddet.hbl_cargo_marks3 = _Record.cargo_marks.toString(); this.recorddet.hbl_cargo_description3 = _Record.cargo_description.toString();
    }
    else if (_Record.cargo_ctr == 4) {
      this.recorddet.hbl_cargo_marks4 = _Record.cargo_marks.toString(); this.recorddet.hbl_cargo_description4 = _Record.cargo_description.toString();
    }
    else if (_Record.cargo_ctr == 5) {
      this.recorddet.hbl_cargo_marks5 = _Record.cargo_marks.toString(); this.recorddet.hbl_cargo_description5 = _Record.cargo_description.toString();
    }
    else if (_Record.cargo_ctr == 6) {
      this.recorddet.hbl_cargo_marks6 = _Record.cargo_marks.toString(); this.recorddet.hbl_cargo_description6 = _Record.cargo_description.toString();
    }
    else if (_Record.cargo_ctr == 7) {
      this.recorddet.hbl_cargo_marks7 = _Record.cargo_marks.toString(); this.recorddet.hbl_cargo_description7 = _Record.cargo_description.toString();
    }
    else if (_Record.cargo_ctr == 8) {
      this.recorddet.hbl_cargo_marks8 = _Record.cargo_marks.toString(); this.recorddet.hbl_cargo_description8 = _Record.cargo_description.toString();
    }
    else if (_Record.cargo_ctr == 9) {
      this.recorddet.hbl_cargo_marks9 = _Record.cargo_marks.toString(); this.recorddet.hbl_cargo_description9 = _Record.cargo_description.toString();
    }
    else if (_Record.cargo_ctr == 10) {
      this.recorddet.hbl_cargo_marks10 = _Record.cargo_marks.toString(); this.recorddet.hbl_cargo_description10 = _Record.cargo_description.toString();
    }
    else if (_Record.cargo_ctr == 11) {
      this.recorddet.hbl_cargo_marks11 = _Record.cargo_marks.toString(); this.recorddet.hbl_cargo_description11 = _Record.cargo_description.toString();
    }
    else if (_Record.cargo_ctr == 12) {
      this.recorddet.hbl_cargo_marks12 = _Record.cargo_marks.toString(); this.recorddet.hbl_cargo_description12 = _Record.cargo_description.toString();
    }
    else if (_Record.cargo_ctr == 13) {
      this.recorddet.hbl_cargo_marks13 = _Record.cargo_marks.toString(); this.recorddet.hbl_cargo_description13 = _Record.cargo_description.toString();
    }
    else if (_Record.cargo_ctr == 14) {
      this.recorddet.hbl_cargo_marks14 = _Record.cargo_marks.toString(); this.recorddet.hbl_cargo_description14 = _Record.cargo_description.toString();
    }
    else if (_Record.cargo_ctr == 15) {
      this.recorddet.hbl_cargo_marks15 = _Record.cargo_marks.toString(); this.recorddet.hbl_cargo_description15 = _Record.cargo_description.toString();
    }
    else if (_Record.cargo_ctr == 16) {
      this.recorddet.hbl_cargo_marks16 = _Record.cargo_marks.toString(); this.recorddet.hbl_cargo_description16 = _Record.cargo_description.toString();
    }
    else if (_Record.cargo_ctr == 17) {
      this.recorddet.hbl_cargo_marks17 = _Record.cargo_marks.toString(); this.recorddet.hbl_cargo_description17 = _Record.cargo_description.toString();
    }

  }

  LoadMasterData() {
    this.errorMessage = [];
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.parentid;
    this.mainService.LoadMasterData(SearchData)
      .subscribe(response => {
        this.mblrecord = <Tbl_cargo_imp_masterm>response.record;
        let mcntrrecords: Tbl_cargo_imp_container[] = <Tbl_cargo_imp_container[]>response.records;
        mcntrrecords.forEach(Rec => {
          Rec.cntr_pkid = this.gs.getGuid();
          Rec.cntr_hblid = this.pkid.toString();
          Rec.cntr_catg = "H";
        })
        this.cntrrecords = <Tbl_cargo_imp_container[]>mcntrrecords;

        if (this.mblrecord != null) {
          this.record.mbl_refno = this.mblrecord.mbl_refno;
          this.record.hbl_location_id = this.mblrecord.mbl_cargo_loc_id;
          this.record.hbl_location_code = this.mblrecord.mbl_cargo_loccode;
          this.record.hbl_location_name = this.mblrecord.mbl_cargo_locname;
          this.record.hbl_location_add1 = this.mblrecord.mbl_cargo_locaddr1;
          this.record.hbl_location_add2 = this.mblrecord.mbl_cargo_locaddr2;
          this.record.hbl_location_add3 = this.mblrecord.mbl_cargo_locaddr3;
          this.record.hbl_location_add4 = this.mblrecord.mbl_cargo_locaddr4;
          this.record.hbl_agent_id = this.mblrecord.mbl_agent_id;
          this.record.hbl_agent_code = this.mblrecord.mbl_agent_code;
          this.record.hbl_agent_name = this.mblrecord.mbl_agent_name;
          this.record.hbl_it_no = this.mblrecord.mbl_it_no;
          this.record.hbl_it_port = this.mblrecord.mbl_it_port;
          this.record.hbl_it_date = this.mblrecord.mbl_it_date;
          this.record.hbl_pod_id = this.mblrecord.mbl_pod_id;
          this.record.hbl_pod_code = this.mblrecord.mbl_pod_code;
          this.record.hbl_pod_name = this.mblrecord.mbl_pod_name;
          this.record.hbl_pod_eta = this.mblrecord.mbl_pod_eta;
          this.record.hbl_pld_eta = this.mblrecord.mbl_pofd_eta;
          this.record.mbl_no = this.mblrecord.mbl_no;
          this.record.hbl_vessel = this.mblrecord.mbl_vessel;
          this.record.hbl_voyage = this.mblrecord.mbl_voyage;
          this.record.hbl_handled_id = this.mblrecord.mbl_handled_id;
          this.record.hbl_handled_name = this.mblrecord.mbl_handled_name;
          this.record.hbl_salesman_id = this.mblrecord.mbl_salesman_id;
          this.record.hbl_salesman_name = this.mblrecord.mbl_salesman_name;

          this.record.hbl_frt_status = "";
          this.record.hbl_ship_term_id = "";
          this.record.hbl_ship_term = "";
          this.record.hbl_place_delivery = this.mblrecord.mbl_place_delivery;
          this.ShipmentType = this.mblrecord.mbl_cntr_type;
          this.record.mbl_cntr_type = this.ShipmentType;
          this.record.hbl_shipment_stage = this.mblrecord.mbl_shipment_stage;

          this.is_locked = this.gs.IsShipmentClosed("SEA IMPORT", this.mblrecord.mbl_ref_date, this.mblrecord.mbl_lock, this.mblrecord.mbl_unlock_date);

          if (this.ShipmentType != "CONSOLE")
            this.FindTotalWeight();
          this.hbl_houseno_field.nativeElement.focus();
        }

      }, error => {
        this.errorMessage.push(this.gs.getError(error));
      });
  }

  IsBLDupliation(stype: string, no: string) {

    if (no == null)
      return;
    if (no == '')
      return;

    this.errorMessage = [];
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;
    SearchData.blno = no;
    SearchData.stype = stype;
    SearchData.company_code = this.gs.company_code;
    SearchData.branch_code = this.gs.branch_code;
    SearchData.mode = this.mode;

    this.mainService.Isblnoduplication(SearchData)
      .subscribe(response => {
        if (response.retvalue) {
          this.errorMessage.push(response.retstring);
          if (stype == 'HBL')
            this.hbl_houseno_field.nativeElement.focus();
        }
      }, error => {
        this.errorMessage.push(this.gs.getError(error));
      });

  }


  Save() {

    if (!this.Allvalid())
      return;
    this.SaveContainer();
    this.SaveDescList();
    const saveRecord = <vm_tbl_cargo_imp_housem>{};
    saveRecord.record = this.record;
    saveRecord.cntrs = this.cntrrecords;
    saveRecord.desc = this.descrecords;
    saveRecord.mode = this.mode;
    saveRecord.userinfo = this.gs.UserInfo;

    this.mainService.Save(saveRecord)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage.push(response.error);
          alert(this.errorMessage);
        }
        else {
          if (this.mode == "ADD" && response.code != '')
            this.record.mbl_refno = response.code;
          this.mode = 'EDIT';
          this.errorMessage.push('Save Complete');
          // alert(this.errorMessage);
        }
      }, error => {
        this.errorMessage.push(this.gs.getError(error));
        alert(this.errorMessage);
      });
  }

  private FindTotalWeight() {

    let sUnit: string = "";
    let icntr_pieces: number = 0;
    let icntr_weight: number = 0;
    let icntr_cbm: number = 0;

    this.cntrrecords.forEach(Rec => {
      icntr_pieces += Rec.cntr_pieces;
      icntr_weight += Rec.cntr_weight;
      icntr_cbm += Rec.cntr_cbm;
      if (Rec.cntr_packages_uom.toString().trim().length > 0) {
        sUnit = Rec.cntr_packages_uom.toString().trim();
      }
    })

    if (sUnit != "")
      this.record.hbl_uom = sUnit;

    this.record.hbl_packages = this.gs.roundNumber(icntr_pieces, 0);

    this.record.hbl_weight = this.gs.roundNumber(icntr_weight, 3);
    this.record.hbl_cbm = this.gs.roundNumber(icntr_cbm, 3);
    this.record.hbl_cft = this.gs.Convert_Weight("CBM2CFT", this.record.hbl_cbm, 3);
    this.record.hbl_lbs = this.gs.Convert_Weight("KG2LBS", this.record.hbl_weight, 3);

  }

  private SaveContainer() {
    let iCtr: number = 0;
    this.cntrrecords.forEach(Rec => {
      iCtr++;
      Rec.cntr_hblid = this.pkid.toString();
      Rec.cntr_catg = "H";
      Rec.cntr_order = iCtr;
      Rec.cntr_weight_uom = "";
      Rec.cntr_packages = 0;
      Rec.cntr_teu = 0;
    })
  }
  private SaveDescList() {
    this.descrecords = <Tbl_cargo_imp_desc[]>[];
    this.SaveDesc(1, this.recorddet.hbl_cargo_marks1, "", this.recorddet.hbl_cargo_description1);
    this.SaveDesc(2, this.recorddet.hbl_cargo_marks2, "", this.recorddet.hbl_cargo_description2);
    this.SaveDesc(3, this.recorddet.hbl_cargo_marks3, "", this.recorddet.hbl_cargo_description3);
    this.SaveDesc(4, this.recorddet.hbl_cargo_marks4, "", this.recorddet.hbl_cargo_description4);
    this.SaveDesc(5, this.recorddet.hbl_cargo_marks5, "", this.recorddet.hbl_cargo_description5);
    this.SaveDesc(6, this.recorddet.hbl_cargo_marks6, "", this.recorddet.hbl_cargo_description6);
    this.SaveDesc(7, this.recorddet.hbl_cargo_marks7, "", this.recorddet.hbl_cargo_description7);
    this.SaveDesc(8, this.recorddet.hbl_cargo_marks8, "", this.recorddet.hbl_cargo_description8);
    this.SaveDesc(9, this.recorddet.hbl_cargo_marks9, "", this.recorddet.hbl_cargo_description9);
    this.SaveDesc(10, this.recorddet.hbl_cargo_marks10, "", this.recorddet.hbl_cargo_description10);
    this.SaveDesc(11, this.recorddet.hbl_cargo_marks11, "", this.recorddet.hbl_cargo_description11);
    this.SaveDesc(12, this.recorddet.hbl_cargo_marks12, "", this.recorddet.hbl_cargo_description12);
    this.SaveDesc(13, this.recorddet.hbl_cargo_marks13, "", this.recorddet.hbl_cargo_description13);
    this.SaveDesc(14, this.recorddet.hbl_cargo_marks14, "", this.recorddet.hbl_cargo_description14);
    this.SaveDesc(15, this.recorddet.hbl_cargo_marks15, "", this.recorddet.hbl_cargo_description15);
    this.SaveDesc(16, this.recorddet.hbl_cargo_marks16, "", this.recorddet.hbl_cargo_description16);
    this.SaveDesc(17, this.recorddet.hbl_cargo_marks17, "", this.recorddet.hbl_cargo_description17);
  }
  private SaveDesc(iCtr: number, M1: string, P1: string, D1: string) {
    if (M1.length > 0 || P1.length > 0 || D1.length > 0) {
      let Rec = <Tbl_cargo_imp_desc>{};
      Rec.parentid = this.pkid;
      Rec.parent_type = "SI-DESC";
      Rec.cargo_ctr = iCtr;
      Rec.cargo_marks = M1;
      Rec.cargo_packages = P1;
      Rec.cargo_description = D1;
      this.descrecords.push(Rec);
    }
  }
  private Allvalid(): boolean {

    var bRet = true;
    this.errorMessage = [];

    if (this.gs.isBlank(this.parentid)) {
      this.errorMessage.push("Invalid MBL ID");
      bRet = false;
    }

    if (this.gs.isBlank(this.record.hbl_houseno)) {
      this.errorMessage.push("House BL# cannot be blank");
      bRet = false;
    }

    if (!this.hbl_shipment_stage_field.nativeElement.disabled) {
      if (this.gs.isBlank(this.record.hbl_shipment_stage)) {
        this.errorMessage.push("Shipment Stage cannot be blank");
        bRet = false;
      }
    }

    if (this.gs.isBlank(this.record.hbl_shipper_id)) {
      this.errorMessage.push("Shipper Code can't be blank");
      bRet = false;
    }
    if (this.gs.isBlank(this.record.hbl_shipper_add1)) {
      this.errorMessage.push("Shipper Address can't be blank");
      bRet = false;
    }
    if (this.gs.isBlank(this.record.hbl_consignee_code)) {
      this.errorMessage.push("Consignee Code can't be blank");
      bRet = false;
    }
    if (this.gs.isBlank(this.record.hbl_consignee_add1)) {
      this.errorMessage.push("Consignee Address can't be blank");
      bRet = false;
    }

    if (this.gs.isBlank(this.record.hbl_agent_id)) {
      this.errorMessage.push("Agent can't be blank");
      bRet = false;
    }

    if (!this.gs.isBlank(this.record.hbl_cha_code)) {
      if (this.gs.isBlank(this.record.hbl_cha_id)) {
        this.errorMessage.push("Invalid CHB");
        bRet = false;
      }
    }


    if (this.gs.isZero(this.record.hbl_packages)) {
      this.errorMessage.push("No. of packages can't be blank");
      bRet = false;
    }
    if (this.gs.isBlank(this.record.hbl_uom)) {
      this.errorMessage.push("Unit of packages can't be blank");
      bRet = false;
    }
    if (this.gs.isZero(this.record.hbl_weight)) {
      this.errorMessage.push("Weight can't be blank");
      bRet = false;
    }

    if (this.gs.isZero(this.record.hbl_cbm) && this.ShipmentType != "FCL") {
      this.errorMessage.push("CBM can't be blank");
      bRet = false;
    }
    if (this.gs.BRANCH_REGION == "USA") {
      if (this.gs.isZero(this.record.hbl_lbs)) {
        this.errorMessage.push("LBS can't be blank");
        bRet = false;
      }
      if (this.gs.isZero(this.record.hbl_cft) && this.ShipmentType != "FCL") {
        this.errorMessage.push("CFT can't be blank");
        bRet = false;
      }
    }

    if (this.gs.OPTIONAL_DESCRIPTION == "N") {
      if (this.gs.isBlank(this.record.hbl_commodity)) {
        this.errorMessage.push("Goods description can't be blank");
        bRet = false;
      }
    }

    if (this.gs.isBlank(this.record.hbl_frt_status)) {
      this.errorMessage.push("Freight Status can't be blank");
      bRet = false;
    }
    if (this.gs.isBlank(this.record.hbl_ship_term_id)) {
      this.errorMessage.push("Terms can't be blank");
      bRet = false;
    }
    if (this.gs.isBlank(this.record.hbl_bltype)) {
      this.errorMessage.push("Nomination Type can't be blank");
      bRet = false;
    }


    //decimal iWt = 0;
    this.cntrrecords.forEach(Rec => {

      if (Rec.cntr_no.toString().trim().length < 11) {
        this.errorMessage.push("Container( " + Rec.cntr_no.toString() + " ) Invalid ");
        bRet = false;
      }
      if (Rec.cntr_type.toString().trim().length <= 0) {
        this.errorMessage.push("Container( " + Rec.cntr_no.toString() + " ) container type has to be select");
        bRet = false;
      }

    })

    if (this.gs.isBlank(this.record.hbl_handled_id)) {
      this.errorMessage.push("Handled By cannot be blank");
      bRet = false;
    }


    /*
    if (Txt_Salesman.TxtLovBox.Text.Trim().Length <= 0)
    {
        
        MessageBox.Show("Sales By can't be blank", "Save", MessageBoxButton.OK);
        Txt_Salesman.Focus();
        bRet = false;
    }
    */

    if (!bRet)
      alert('Error While Saving');

    return bRet;
  }


  Close() {
    this.location.back();
  }


  AddRow() {
    var rec = <Tbl_cargo_imp_container>{};
    rec.cntr_pkid = this.gs.getGuid();
    rec.cntr_hblid = this.pkid.toString();
    rec.cntr_catg = "H";
    rec.cntr_no = "";
    rec.cntr_type = "";
    rec.cntr_sealno = '';
    rec.cntr_pieces = 0;
    rec.cntr_packages_uom = '';
    rec.cntr_packages = 0;
    rec.cntr_weight = 0;
    rec.cntr_tare_weight = 0;
    rec.cntr_cbm = 0;
    rec.cntr_pick_date = '';
    rec.cntr_return_date = '';
    rec.cntr_lfd = '';
    rec.cntr_weight_uom = '';
    rec.cntr_order = 1;
    this.cntrrecords.push(rec);
    this.cntr_no_field.changes
      .subscribe((queryChanges) => {
        this.cntr_no_field.last.nativeElement.focus();
      });
  }


  LovSelected(_Record: SearchTable, idx: number = 0) {

    if (_Record.controlname == "SHIPPER") {
      this.record.hbl_shipper_id = _Record.id;
      this.record.hbl_shipper_code = _Record.code;
      this.record.hbl_shipper_name = _Record.name;
      if (_Record.col8 != "")
        this.record.hbl_shipper_name = _Record.col8;

      this.record.hbl_shipper_add1 = _Record.col1;
      this.record.hbl_shipper_add2 = _Record.col2;
      this.record.hbl_shipper_add3 = _Record.col3;
      this.record.hbl_shipper_add4 = this.gs.GetAttention(_Record.col5.toString());
      this.record.hbl_shipper_add5 = this.gs.GetTelFax(_Record.col6.toString(), _Record.col7.toString());
      if (_Record.col9 == "Y") {
        // MsgAlertBox mPage = new MsgAlertBox();
        // mPage.PKID = Txt_Shipper_Code.PKID;
        // mPage.SOURCE = "ACCOUNTING-ALERT";
        // mPage.parentpage += delegate(object sender2, string objectName2)
        // {
        //     Dispatcher.BeginInvoke(() => { Txt_Shipper_Name.Focus(); });
        // };
        // mPage.Show();

        // this.SearchRecord("MsgAlertBox", this.record.hbl_shipper_id);

        this.gs.ShowAccAlert(this.record.hbl_shipper_id);
      }
      this.hbl_shipper_name_field.nativeElement.focus();
    }

    if (_Record.controlname == "CONSIGNEE") {
      this.record.hbl_consignee_id = _Record.id;
      this.record.hbl_consignee_code = _Record.code;
      this.record.hbl_consignee_name = _Record.name;
      if (_Record.col8 != "")
        this.record.hbl_consignee_name = _Record.col8;

      this.record.hbl_consignee_add1 = _Record.col1;
      this.record.hbl_consignee_add2 = _Record.col2;
      this.record.hbl_consignee_add3 = _Record.col3;
      this.record.hbl_consignee_add4 = this.gs.GetAttention(_Record.col5.toString());
      this.record.hbl_consignee_add5 = this.gs.GetTelFax(_Record.col6.toString(), _Record.col7.toString());

      if (this.gs.PARAM_NOMINATION != null)
        if (this.gs.PARAM_NOMINATION.length > 0) {
          let sNom: string = _Record.type.toString().trim();
          if (sNom == "NOMINATION" || sNom == "MUTUAL")
            this.record.hbl_bltype = sNom;
          else
            this.record.hbl_bltype = "FREEHAND";
        }

      // Dispatcher.BeginInvoke(() => { Txt_Consignee_Name.Focus(); });
      // if (Txt_Consingee_Code.RESULT_RECORD.col9 == "Y")
      // {
      //     MsgAlertBox mPage = new MsgAlertBox();
      //     mPage.PKID = Txt_Consingee_Code.PKID;
      //     mPage.SOURCE = "ACCOUNTING-ALERT";
      //     mPage.parentpage += delegate(object sender2, string objectName2)
      //     {
      //         Dispatcher.BeginInvoke(() => { Txt_Consignee_Name.Focus(); });
      //         LoadCHA();
      //     };
      //     mPage.Show();
      // }
      // else
      //     LoadCHA();

      if (_Record.col9 == "Y") {
        this.SearchRecord("MsgAlertBox", this.record.hbl_consignee_id, "CONSIGNEE");
      } else
        this.LoadCHA();
    }

    if (_Record.controlname == "CARGO-LOC") {
      this.record.hbl_location_id = _Record.id;
      this.record.hbl_location_code = _Record.code;
      this.record.hbl_location_name = _Record.name;
      if (_Record.col8 != "")
        this.record.hbl_location_name = _Record.col8;

      this.record.hbl_location_add1 = _Record.col1;
      this.record.hbl_location_add2 = _Record.col2;
      this.record.hbl_location_add3 = _Record.col3;
      this.record.hbl_location_add4 = this.gs.GetTelFax(_Record.col6.toString(), _Record.col7.toString());
      this.hbl_location_name_field.nativeElement.focus();
    }

    if (_Record.controlname == "NOTIFY-TO") {
      this.record.hbl_notify_id = _Record.id;
      this.record.hbl_notify_code = _Record.code;
      this.record.hbl_notify_name = _Record.name;
      if (_Record.col8 != "")
        this.record.hbl_notify_name = _Record.col8;

      this.record.hbl_notify_add1 = _Record.col1;
      this.record.hbl_notify_add2 = _Record.col2;
      this.record.hbl_notify_add3 = _Record.col3;
      this.record.hbl_notify_add4 = this.gs.GetTelFax(_Record.col6.toString(), _Record.col7.toString());
      if (_Record.col9 == "Y") {
        // MsgAlertBox mPage = new MsgAlertBox();
        // mPage.PKID = Txt_Notify_Code.PKID;
        // mPage.SOURCE = "ACCOUNTING-ALERT";
        // mPage.parentpage += delegate(object sender2, string objectName2)
        // {
        //     Dispatcher.BeginInvoke(() => { Txt_Notify_Name.Focus(); });
        // };
        // mPage.Show();
        this.SearchRecord("MsgAlertBox", this.record.hbl_notify_id, "NOTIFY-TO");

      } else
        this.hbl_notify_name_field.nativeElement.focus();
    }

    if (_Record.controlname == "CHA") {
      this.record.hbl_cha_id = _Record.id;
      this.record.hbl_cha_code = _Record.code;
      this.record.hbl_cha_name = _Record.name;
      if (_Record.col8 != "")
        this.record.hbl_cha_name = _Record.col8;

      this.record.hbl_cha_attn = _Record.col5;
      this.record.hbl_cha_tel = _Record.col6;
      this.record.hbl_cha_fax = _Record.col7;
      this.hbl_cha_name_field.nativeElement.focus();
    }
    if (_Record.controlname == "AGENT") {
      this.record.hbl_agent_id = _Record.id;
      this.record.hbl_agent_name = _Record.name;
      this.hbl_cha_code_field.Focus();
    }
    if (_Record.controlname == "CARRIER") {
      this.record.hbl_liner_id = _Record.id;
      this.record.hbl_liner_name = _Record.name;
    }

    if (_Record.controlname == "HANDLEDBY") {
      this.record.hbl_handled_id = _Record.id;
      this.record.hbl_handled_name = _Record.name;
      this.hbl_salesman_name_field.Focus();
    }
    if (_Record.controlname == "SALESMAN") {
      this.record.hbl_salesman_id = _Record.id;
      this.record.hbl_salesman_name = _Record.name;
    }

    if (_Record.controlname == "CARE-OF") {
      this.record.hbl_careof_id = _Record.id;
      this.record.hbl_careof_name = _Record.name;
      if (!this.gs.isBlank(this.hbl_agent_name_field))
        this.hbl_agent_name_field.Focus();
    }

    // Container
    if (_Record.controlname == "CONTAINER TYPE") {
      this.cntrrecords.forEach(rec => {
        if (rec.cntr_pkid == _Record.uid) {
          rec.cntr_type = _Record.code;
          if (idx < this.cntr_sealno_field.toArray().length)
            this.cntr_sealno_field.toArray()[idx].nativeElement.focus();
        }
      });
    }
  }

  OnChange(field: string) {
    if (field == 'hbl_frt_status') {
      if (this.gs.company_code == "MNYC") {
        let sWord: string = "";
        if (this.record.hbl_frt_status.toString() == "PREPAID" || this.record.hbl_frt_status.toString() == "COLLECT" || this.record.hbl_frt_status.toString() == "TBA")
          sWord = "FREIGHT " + this.record.hbl_frt_status.toString();

        if (sWord.length <= 0)
          return;

        this.recorddet.hbl_cargo_description7 = sWord;
      }
    }
    if (field == 'hbl_telex_released') {
      if (this.record.hbl_telex_released.toString() == "YES")
        this.record.hbl_bl_req = "* ORIGINAL B/L SURRENDERED";
      else {
        if (this.gs.BRANCH_REGION == "USA") {
          if (this.record.hbl_telex_released.toString() == "NO - REQUIRED")
            this.record.hbl_bl_req = "* ENDORSED ORIGINAL B/L REQUIRED";
          else
            this.record.hbl_bl_req = "* ENDORSED ORIGINAL B/L RECEIVED";
        }
        else
          this.record.hbl_bl_req = "* ENDORSED ORIGINAL B/L REQUIRED";
      }
    }
  }

  onFocusout(field: string) {
    switch (field) {
      case 'hbl_houseno': {
        this.IsBLDupliation('HBL', this.record.hbl_houseno);
        break;
      }
      case 'mbl_liner_bookingno': {

        // this.IsBLDupliation('BOOKING', this.record.mbl_liner_bookingno);
        // break;
      }
    }
  }

  onBlur(field: string, rec: Tbl_cargo_imp_container = null) {
    switch (field) {
      case 'mbl_refno': {
        this.record.mbl_refno = this.record.mbl_refno.toUpperCase();
        break;
      }
      case 'mbl_no': {
        this.record.mbl_no = this.record.mbl_no.toUpperCase();
        break;
      }

      case 'mbl_refno': {
        this.record.mbl_refno = this.record.mbl_refno.toUpperCase();
        break;
      }
      case 'hbl_houseno': {
        this.record.hbl_houseno = this.record.hbl_houseno.toUpperCase();
        break;
      }
      case 'hbl_bltype': {
        this.record.hbl_bltype = this.record.hbl_bltype.toUpperCase();
        break;
      }
      case 'hbl_frt_status': {
        this.record.hbl_frt_status = this.record.hbl_frt_status.toUpperCase();
        break;
      }
      case 'hbl_ship_term': {
        this.record.hbl_ship_term = this.record.hbl_ship_term.toUpperCase();
        break;
      }
      case 'hbl_it_no': {
        this.record.hbl_it_no = this.record.hbl_it_no.toUpperCase();
        break;
      }
      case 'hbl_it_port': {
        this.record.hbl_it_port = this.record.hbl_it_port.toUpperCase();
        break;
      }
      case 'hbl_consignee_name': {
        this.record.hbl_consignee_name = this.record.hbl_consignee_name.toUpperCase();
        break;
      }
      case 'hbl_consignee_add1': {
        this.record.hbl_consignee_add1 = this.record.hbl_consignee_add1.toUpperCase();
        break;
      }
      case 'hbl_consignee_add2': {
        this.record.hbl_consignee_add2 = this.record.hbl_consignee_add2.toUpperCase();
        break;
      }


      case 'hbl_consignee_add3': {
        this.record.hbl_consignee_add3 = this.record.hbl_consignee_add3.toUpperCase();
        break;
      }
      case 'hbl_consignee_add4': {
        this.record.hbl_consignee_add4 = this.record.hbl_consignee_add4.toUpperCase();
        break;
      }
      case 'hbl_consignee_add5': {
        this.record.hbl_consignee_add5 = this.record.hbl_consignee_add5.toUpperCase();
        break;
      }
      case 'hbl_shipper_name': {
        this.record.hbl_shipper_name = this.record.hbl_shipper_name.toUpperCase();
        break;
      }
      case 'hbl_shipper_add1': {
        this.record.hbl_shipper_add1 = this.record.hbl_shipper_add1.toUpperCase();
        break;
      }
      case 'hbl_shipper_add2': {
        this.record.hbl_shipper_add2 = this.record.hbl_shipper_add2.toUpperCase();
        break;
      }
      case 'hbl_shipper_add3': {
        this.record.hbl_shipper_add3 = this.record.hbl_shipper_add3.toUpperCase();
        break;
      }
      case 'hbl_shipper_add4': {
        this.record.hbl_shipper_add4 = this.record.hbl_shipper_add4.toUpperCase();
        break;
      }
      case 'hbl_shipper_add5': {
        this.record.hbl_shipper_add5 = this.record.hbl_shipper_add5.toUpperCase();
        break;
      }
      case 'hbl_location_code': {
        this.record.hbl_location_code = this.record.hbl_location_code.toUpperCase();
        break;
      }
      case 'hbl_location_add1': {
        this.record.hbl_location_add1 = this.record.hbl_location_add1.toUpperCase();
        break;
      }
      case 'hbl_location_add2': {
        this.record.hbl_location_add2 = this.record.hbl_location_add2.toUpperCase();
        break;
      }
      case 'hbl_location_add3': {
        this.record.hbl_location_add3 = this.record.hbl_location_add3.toUpperCase();
        break;
      }
      case 'hbl_location_add4': {
        this.record.hbl_location_add4 = this.record.hbl_location_add4.toUpperCase();
        break;
      }
      case 'hbl_location_add5': {
        this.record.hbl_location_add5 = this.record.hbl_location_add5.toUpperCase();
        break;
      }
      case 'hbl_notify_name': {
        this.record.hbl_notify_name = this.record.hbl_notify_name.toUpperCase();
        break;
      }
      case 'hbl_notify_code': {
        this.record.hbl_notify_code = this.record.hbl_notify_code.toUpperCase();
        break;
      }
      case 'hbl_notify_add1': {
        this.record.hbl_notify_add1 = this.record.hbl_notify_add1.toUpperCase();
        break;
      }
      case 'hbl_notify_add2': {
        this.record.hbl_notify_add2 = this.record.hbl_notify_add2.toUpperCase();
        break;
      }
      case 'hbl_notify_add3': {
        this.record.hbl_notify_add3 = this.record.hbl_notify_add3.toUpperCase();
        break;
      }
      case 'hbl_notify_add4': {
        this.record.hbl_notify_add4 = this.record.hbl_notify_add4.toUpperCase();
        break;
      }
      case 'hbl_notify_add5': {
        this.record.hbl_notify_add5 = this.record.hbl_notify_add5.toUpperCase();
        break;
      }
      case 'hbl_agent_name': {
        this.record.hbl_agent_name = this.record.hbl_agent_name.toUpperCase();
        break;
      }
      case 'hbl_cha_code': {
        this.record.hbl_cha_code = this.record.hbl_cha_code.toUpperCase();
        break;
      }
      case 'hbl_cha_name': {
        this.record.hbl_cha_name = this.record.hbl_cha_name.toUpperCase();
        break;
      }
      case 'hbl_cha_attn': {
        this.record.hbl_cha_attn = this.record.hbl_cha_attn.toUpperCase();
        break;
      }
      case 'hbl_cha_tel': {
        this.record.hbl_cha_tel = this.record.hbl_cha_tel.toUpperCase();
        break;
      }
      case 'hbl_cha_fax': {
        this.record.hbl_cha_fax = this.record.hbl_cha_fax.toUpperCase();
        break;
      }
      case 'hbl_commodity': {
        this.record.hbl_commodity = this.record.hbl_commodity.toUpperCase();
        break;
      }
      case 'hbl_uom': {
        this.record.hbl_uom = this.record.hbl_uom.toUpperCase();
        break;
      }



      case 'hbl_pcs': {
        this.record.hbl_pcs = this.gs.roundNumber(this.record.hbl_pcs, 0);
        break;
      }
      case 'hbl_packages': {
        this.record.hbl_packages = this.gs.roundNumber(this.record.hbl_packages, 0);
        break;
      }
      case 'hbl_weight': {
        this.record.hbl_weight = this.gs.roundNumber(this.record.hbl_weight, 3);
        break;
      }
      case 'hbl_lbs': {
        this.record.hbl_lbs = this.gs.roundNumber(this.record.hbl_lbs, 3);
        break;
      }
      case 'hbl_cbm': {
        this.record.hbl_cbm = this.gs.roundNumber(this.record.hbl_cbm, 3);
        break;
      }
      case 'hbl_cft': {
        this.record.hbl_cft = this.gs.roundNumber(this.record.hbl_cft, 3);
        break;
      }

      case 'hbl_pono': {
        this.record.hbl_pono = this.record.hbl_pono.toUpperCase();
        break;
      }
      case 'hbl_place_delivery': {
        this.record.hbl_place_delivery = this.record.hbl_place_delivery.toUpperCase();
        break;
      }
      case 'hbl_place_final': {
        this.record.hbl_place_final = this.record.hbl_place_final.toUpperCase();
        break;
      }
      case 'hbl_sub_house': {
        this.record.hbl_sub_house = this.record.hbl_sub_house.toUpperCase();
        break;
      }
      case 'hbl_ams_fileno': {
        this.record.hbl_ams_fileno = this.record.hbl_ams_fileno.toUpperCase();
        break;
      }
      case 'hbl_isf_no': {
        this.record.hbl_isf_no = this.record.hbl_isf_no.toUpperCase();
        break;
      }
      case 'hbl_mov_dad': {
        this.record.hbl_mov_dad = this.record.hbl_mov_dad.toUpperCase();
        break;
      }
      case 'hbl_bl_req': {
        this.record.hbl_bl_req = this.record.hbl_bl_req.toUpperCase();
        break;
      }
      case 'hbl_remark1': {
        this.record.hbl_remark1 = this.record.hbl_remark1.toUpperCase();
        break;
      }
      case 'hbl_remark2': {
        this.record.hbl_remark2 = this.record.hbl_remark2.toUpperCase();
        break;
      }
      case 'hbl_remark3': {
        this.record.hbl_remark3 = this.record.hbl_remark3.toUpperCase();
        break;
      }
      case 'hbl_devan_instr1': {
        this.record.hbl_devan_instr1 = this.record.hbl_devan_instr1.toUpperCase();
        break;
      }
      case 'hbl_devan_instr2': {
        this.record.hbl_devan_instr2 = this.record.hbl_devan_instr2.toUpperCase();
        break;
      }
      case 'hbl_devan_instr3': {
        this.record.hbl_devan_instr3 = this.record.hbl_devan_instr3.toUpperCase();
        break;
      }
      case 'hbl_salesman_name': {
        this.record.hbl_salesman_name = this.record.hbl_salesman_name.toUpperCase();
        break;
      }
      case 'hbl_handled_name': {
        this.record.hbl_handled_name = this.record.hbl_handled_name.toUpperCase();
        break;
      }
      case 'hbl_handled_email': {
        this.record.hbl_handled_email = this.record.hbl_handled_email.toUpperCase();
        break;
      }
      case 'rec_created_email': {
        this.record.rec_created_email = this.record.rec_created_email.toUpperCase();
        break;
      }
      case 'hbl_liner_code': {
        this.record.hbl_liner_code = this.record.hbl_liner_code.toUpperCase();
        break;
      }
      case 'hbl_liner_name': {
        this.record.hbl_liner_name = this.record.hbl_liner_name.toUpperCase();
        break;
      }
      case 'hbl_vessel': {
        this.record.hbl_vessel = this.record.hbl_vessel.toUpperCase();
        break;
      }
      case 'hbl_voyage': {
        this.record.hbl_voyage = this.record.hbl_voyage.toUpperCase();
        break;
      }
      case 'hbl_pol_code': {
        this.record.hbl_pol_code = this.record.hbl_pol_code.toUpperCase();
        break;
      }
      case 'hbl_pol_name': {
        this.record.hbl_pol_name = this.record.hbl_pol_name.toUpperCase();
        break;
      }
      case 'hbl_pod_code': {
        this.record.hbl_pod_code = this.record.hbl_pod_code.toUpperCase();
        break;
      }
      case 'hbl_pod_name': {
        this.record.hbl_pod_name = this.record.hbl_pod_name.toUpperCase();
        break;
      }
      case 'hbl_devan_loccode': {
        this.record.hbl_devan_loccode = this.record.hbl_devan_loccode.toUpperCase();
        break;
      }
      case 'hbl_devan_locname': {
        this.record.hbl_devan_locname = this.record.hbl_devan_locname.toUpperCase();
        break;
      }
      case 'hbl_devan_locaddr1': {
        this.record.hbl_devan_locaddr1 = this.record.hbl_devan_locaddr1.toUpperCase();
        break;
      }
      case 'hbl_devan_locaddr2': {
        this.record.hbl_devan_locaddr2 = this.record.hbl_devan_locaddr2.toUpperCase();
        break;
      }
      case 'hbl_devan_locaddr3': {
        this.record.hbl_devan_locaddr3 = this.record.hbl_devan_locaddr3.toUpperCase();
        break;
      }
      case 'hbl_devan_locaddr4': {
        this.record.hbl_devan_locaddr4 = this.record.hbl_devan_locaddr4.toUpperCase();
        break;
      }
      case 'mbl_cntr_type': {
        this.record.mbl_cntr_type = this.record.mbl_cntr_type.toUpperCase();
        break;
      }
      case 'hbl_careof_name': {
        this.record.hbl_careof_name = this.record.hbl_careof_name.toUpperCase();
        break;
      }
      case 'mbl_lock': {
        this.record.mbl_lock = this.record.mbl_lock.toUpperCase();
        break;
      }
      case 'hbl_boeno': {
        this.record.hbl_boeno = this.record.hbl_boeno.toUpperCase();
        break;
      }
      case 'hbl_paid_status': {
        this.record.hbl_paid_status = this.record.hbl_paid_status.toUpperCase();
        break;
      }
      case 'hbl_bl_status': {
        this.record.hbl_bl_status = this.record.hbl_bl_status.toUpperCase();
        break;
      }
      case 'hbl_cargo_release_status': {
        this.record.hbl_cargo_release_status = this.record.hbl_cargo_release_status.toUpperCase();
        break;
      }
      case 'hbl_shipment_stage': {
        this.record.hbl_shipment_stage = this.record.hbl_shipment_stage.toUpperCase();
        break;
      }
      case 'hbl_custom_reles_status': {
        this.record.hbl_custom_reles_status = this.record.hbl_custom_reles_status.toUpperCase();
        break;
      }
      case 'hbl_is_delivery': {
        this.record.hbl_is_delivery = this.record.hbl_is_delivery.toUpperCase();
        break;
      }
      case 'hbl_paid_remarks': {
        this.record.hbl_paid_remarks = this.record.hbl_paid_remarks.toUpperCase();
        break;
      }

      case 'hbl_cargo_marks1': {
        this.recorddet.hbl_cargo_marks1 = this.recorddet.hbl_cargo_marks1.toUpperCase();
        break;
      }
      case 'hbl_cargo_marks2': {
        this.recorddet.hbl_cargo_marks2 = this.recorddet.hbl_cargo_marks2.toUpperCase();
        break;
      }
      case 'hbl_cargo_marks3': {
        this.recorddet.hbl_cargo_marks3 = this.recorddet.hbl_cargo_marks3.toUpperCase();
        break;
      }
      case 'hbl_cargo_marks4': {
        this.recorddet.hbl_cargo_marks4 = this.recorddet.hbl_cargo_marks4.toUpperCase();
        break;
      }
      case 'hbl_cargo_marks5': {
        this.recorddet.hbl_cargo_marks5 = this.recorddet.hbl_cargo_marks5.toUpperCase();
        break;
      }
      case 'hbl_cargo_marks6': {
        this.recorddet.hbl_cargo_marks6 = this.recorddet.hbl_cargo_marks6.toUpperCase();
        break;
      }
      case 'hbl_cargo_marks7': {
        this.recorddet.hbl_cargo_marks7 = this.recorddet.hbl_cargo_marks7.toUpperCase();
        break;
      }
      case 'hbl_cargo_marks8': {
        this.recorddet.hbl_cargo_marks8 = this.recorddet.hbl_cargo_marks8.toUpperCase();
        break;
      }
      case 'hbl_cargo_marks9': {
        this.recorddet.hbl_cargo_marks9 = this.recorddet.hbl_cargo_marks9.toUpperCase();
        break;
      }
      case 'hbl_cargo_marks10': {
        this.recorddet.hbl_cargo_marks10 = this.recorddet.hbl_cargo_marks10.toUpperCase();
        break;
      }
      case 'hbl_cargo_marks11': {
        this.recorddet.hbl_cargo_marks11 = this.recorddet.hbl_cargo_marks11.toUpperCase();
        break;
      }
      case 'hbl_cargo_marks12': {
        this.recorddet.hbl_cargo_marks12 = this.recorddet.hbl_cargo_marks12.toUpperCase();
        break;
      }
      case 'hbl_cargo_marks13': {
        this.recorddet.hbl_cargo_marks13 = this.recorddet.hbl_cargo_marks13.toUpperCase();
        break;
      }
      case 'hbl_cargo_marks14': {
        this.recorddet.hbl_cargo_marks14 = this.recorddet.hbl_cargo_marks14.toUpperCase();
        break;
      }
      case 'hbl_cargo_marks15': {
        this.recorddet.hbl_cargo_marks15 = this.recorddet.hbl_cargo_marks15.toUpperCase();
        break;
      }
      case 'hbl_cargo_marks16': {
        this.recorddet.hbl_cargo_marks16 = this.recorddet.hbl_cargo_marks16.toUpperCase();
        break;
      }
      case 'hbl_cargo_description1': {
        this.recorddet.hbl_cargo_description1 = this.recorddet.hbl_cargo_description1.toUpperCase();
        break;
      }
      case 'hbl_cargo_description2': {
        this.recorddet.hbl_cargo_description2 = this.recorddet.hbl_cargo_description2.toUpperCase();
        break;
      }
      case 'hbl_cargo_description3': {
        this.recorddet.hbl_cargo_description3 = this.recorddet.hbl_cargo_description3.toUpperCase();
        break;
      }
      case 'hbl_cargo_description4': {
        this.recorddet.hbl_cargo_description4 = this.recorddet.hbl_cargo_description4.toUpperCase();
        break;
      }
      case 'hbl_cargo_description5': {
        this.recorddet.hbl_cargo_description5 = this.recorddet.hbl_cargo_description5.toUpperCase();
        break;
      }
      case 'hbl_cargo_description6': {
        this.recorddet.hbl_cargo_description6 = this.recorddet.hbl_cargo_description6.toUpperCase();
        break;
      }
      case 'hbl_cargo_description7': {
        this.recorddet.hbl_cargo_description7 = this.recorddet.hbl_cargo_description7.toUpperCase();
        break;
      }
      case 'hbl_cargo_description8': {
        this.recorddet.hbl_cargo_description8 = this.recorddet.hbl_cargo_description8.toUpperCase();
        break;
      }
      case 'hbl_cargo_description9': {
        this.recorddet.hbl_cargo_description9 = this.recorddet.hbl_cargo_description9.toUpperCase();
        break;
      }
      case 'hbl_cargo_description10': {
        this.recorddet.hbl_cargo_description10 = this.recorddet.hbl_cargo_description10.toUpperCase();
        break;
      }
      case 'hbl_cargo_description11': {
        this.recorddet.hbl_cargo_description11 = this.recorddet.hbl_cargo_description11.toUpperCase();

        break;
      }
      case 'hbl_cargo_description12': {
        this.recorddet.hbl_cargo_description12 = this.recorddet.hbl_cargo_description12.toUpperCase();
        break;
      }
      case 'hbl_cargo_description13': {
        this.recorddet.hbl_cargo_description13 = this.recorddet.hbl_cargo_description13.toUpperCase();
        break;
      }
      case 'hbl_cargo_description14': {
        this.recorddet.hbl_cargo_description14 = this.recorddet.hbl_cargo_description14.toUpperCase();
        break;
      }
      case 'hbl_cargo_description15': {
        this.recorddet.hbl_cargo_description15 = this.recorddet.hbl_cargo_description15.toUpperCase();
        break;
      }
      case 'hbl_cargo_description16': {
        this.recorddet.hbl_cargo_description16 = this.recorddet.hbl_cargo_description16.toUpperCase();
        break;
      }
      case 'hbl_cargo_description17': {
        this.recorddet.hbl_cargo_description17 = this.recorddet.hbl_cargo_description17.toUpperCase();
        break;
      }

      case 'cntr_no': {
        rec.cntr_no = rec.cntr_no.toUpperCase();
        break;
      }
      case 'cntr_type': {
        rec.cntr_type = rec.cntr_type.toUpperCase();
        break;
      }
      case 'cntr_sealno': {
        rec.cntr_sealno = rec.cntr_sealno.toUpperCase();
        break;
      }
      case 'cntr_pieces': {
        rec.cntr_pieces = this.gs.roundNumber(rec.cntr_pieces, 0);
        break;
      }
      case 'cntr_packages_uom': {
        rec.cntr_packages_uom = rec.cntr_packages_uom.toUpperCase();
        break;
      }
      case 'cntr_weight': {
        rec.cntr_weight = this.gs.roundNumber(rec.cntr_weight, 3);
        break;
      }
      case 'cntr_cbm': {
        rec.cntr_cbm = this.gs.roundNumber(rec.cntr_cbm, 3);
        break;
      }
      case 'cntr_tare_weight': {
        rec.cntr_tare_weight = this.gs.roundNumber(rec.cntr_tare_weight, 0);
        break;
      }

    }
  }


  BtnNavigation(action: string) {

    switch (action) {
      case 'CUSTOMSHOLD': {
        let prm = {
          menuid: this.gs.MENU_SI_HOUSE_US_CUSTOM_HOLD,
          pkid: this.pkid,
          origin: 'seaimp-House-page',
          is_locked: this.is_locked,
        };
        this.gs.Naviagete('Silver.SeaImport/USCustomsHoldPage', JSON.stringify(prm));
        break;
      }
      case 'CARGOPICKUP': {
        let prm = {
          menuid: this.gs.MENU_SI_HOUSE_DELIVERY_ORDER,
          pkid: this.pkid,
          origin: 'seaimp-House-page',
          is_locked: this.is_locked,
        };
        this.gs.Naviagete('Silver.SeaImport/CargoPickupPage', JSON.stringify(prm));
        break;
      }
      case 'RIDERPAGE': {
        let prm = {
          menuid: this.gs.MENU_SI_HOUSE,
          pkid: this.pkid,
          source: 'SI-DESC-EX',
          is_locked: this.is_locked,
          origin: 'seaimp-House-page',
          canPrint: false
        };
        this.gs.Naviagete('Silver.SeaImport/RiderPage', JSON.stringify(prm));
        break;
      }
      case 'SHIPMOVEMENT': {
        let prm = {
          menuid: this.gs.MENU_SI_SHIPMENT_MOVEMENT,
          refno: "REF : " + this.record.mbl_refno + "  HBL : " + this.record.hbl_houseno,
          pkid: this.pkid,
          origin: 'seaimp-House-page',
          oprgrp: 'SEA IMPORT',
          parentType: 'SEAIMP-SHIP',
          paramType: 'SHIP-MOVE-STATUS',
          hideTracking: 'Y',
          is_locked: this.is_locked
        };
        this.gs.Naviagete('Silver.Other.Trans/TrackingPage', JSON.stringify(prm));
        break;
      }
      case 'ARRIVAL-NOTICE': {
        this.report_title = 'ARRIVAL NOTICE';
        this.report_url = '/api/SeaImport/House/GetArrivalNotice';
        this.report_searchdata = this.gs.UserInfo;
        this.report_searchdata.pkid = this.pkid;
        this.report_searchdata.type = 'ARRIVAL NOTICE';
        this.report_menuid = this.gs.MENU_SI_HOUSE_ARRIVAL_NOTICE;
        this.tab = 'report';
        break;
      }
      case 'FREIGHT-INVOICE': {
        this.report_title = 'ARRIVAL NOTICE FREIGHT INVOICE';
        this.report_url = '/api/SeaImport/House/GetArrivalNotice';
        this.report_searchdata = this.gs.UserInfo;
        this.report_searchdata.pkid = this.pkid;
        this.report_searchdata.type = 'FREIGHT INVOICE';
        this.report_menuid = this.gs.MENU_SI_HOUSE_ARRIVAL_NOTICE;
        this.tab = 'report';
        break;
      }
      case 'PRE-ADVISE': {
        this.report_title = 'PRE-ADVISE';
        this.report_url = '/api/SeaImport/House/GetPreAlertReport';
        this.report_searchdata = this.gs.UserInfo;
        this.report_searchdata.pkid = this.pkid;
        this.report_menuid = this.gs.MENU_SI_HOUSE_PRE_ADVISE;
        this.tab = 'report';
        break;
      }
      case 'TURNOVER-LETTER': {
        this.report_title = 'TURNOVER LETTER';
        this.report_url = '/api/SeaImport/House/GetTurnOverReport';
        this.report_searchdata = this.gs.UserInfo;
        this.report_searchdata.pkid = this.pkid;
        this.report_menuid = this.gs.MENU_SI_HOUSE_TURNOVER_LETTER;
        this.tab = 'report';
        break;
      }
      case 'ATTACH-ISFNO': {
        this.attach_pkid = this.pkid;
        this.attach_type = 'ISF FILE';
        this.attach_tablename = 'cargo_housem';
        this.attach_pk_column = 'hbl_pkid';
        this.attach_refno = this.record.hbl_houseno;
        this.attach_update_column = 'HBL_ISF_ATTACHED';
        this.tab = 'attachment';
        break;
      }
      case 'ATTACH-OHBL': {
        this.attach_pkid = this.pkid;
        this.attach_type = 'OHBL OR TELEX RLS';
        this.attach_tablename = 'cargo_housem';
        this.attach_pk_column = 'hbl_pkid';
        this.attach_refno = this.record.hbl_houseno;
        this.attach_update_column = '';
        this.tab = 'attachment';
        break;
      }
      case 'HOUSE-DEVAN': {
        let prm = {
          menuid: this.menuid,
          pkid: this.pkid,
          source: 'SEA-HOUSE-DEVAN',
          title: 'Devanning Instruction',
          origin: 'seaimp-House-page',
          is_locked: this.is_locked,
        };
        this.gs.Naviagete('Silver.BusinessModule/XmlRemarksPage', JSON.stringify(prm));
        break;
      }
    }
  }

  callbackevent(event: any) {
    this.tab = 'main';
  }

  FindWeight(_type: string) {
    if (_type == "Kgs2Lbs")
      this.record.hbl_lbs = this.gs.Convert_Weight("KG2LBS", this.record.hbl_weight, 3);
    else if (_type == "Lbs2Kgs")
      this.record.hbl_weight = this.gs.Convert_Weight("LBS2KG", this.record.hbl_lbs, 3);
    else if (_type == "Cbm2Cft")
      this.record.hbl_cft = this.gs.Convert_Weight("CBM2CFT", this.record.hbl_cbm, 3);
    else if (_type == "Cft2Cbm")
      this.record.hbl_cbm = this.gs.Convert_Weight("CFT2CBM", this.record.hbl_cft, 3);
  }



  SearchRecord(controlname: string, _id: string = "", _type: string = "") {
    this.errorMessage = [];
    let SearchData = {
      table: '',
      pkid: '',
      SPATH: ''
    };


    if (controlname == "MsgAlertBox") {
      SearchData.table = 'ACCOUNTING-ALERT';
      SearchData.pkid = _id;
      SearchData.SPATH = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\xmlremarks\\";
    }
    this.gs.SearchRecord(SearchData)
      .subscribe(response => {

        if (response.message.length > 0)
          alert(response.message);

        if (controlname == "MsgAlertBox" && _type == "CONSIGNEE")
          this.LoadCHA();
        else if (_type == "NOTIFY-TO") {
          if (!this.gs.isBlank(this.hbl_notify_name_field))
            this.hbl_notify_name_field.nativeElement.focus();
        }
      },
        error => {
          this.errorMessage.push(this.gs.getError(error));
          alert(this.errorMessage);
        });
  }

  LoadCHA() {

    this.record.hbl_cha_id = "";
    this.record.hbl_cha_code = "";
    this.record.hbl_cha_name = "";
    this.record.hbl_cha_attn = "";
    this.record.hbl_cha_tel = "";
    this.record.hbl_cha_fax = "";
    if (this.gs.GENERAL_BRANCH_CODE == "MFDR") {
      this.record.hbl_salesman_id = "";
      this.record.hbl_salesman_code = "";
      this.record.hbl_salesman_name = "";
    }

    if (this.gs.isBlank(this.record.hbl_consignee_id))
      return;

    this.errorMessage = [];
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.record.hbl_consignee_id;
    this.mainService.LoadCha(SearchData)
      .subscribe(response => {
        let charecord: Table_Address = <Table_Address>{};
        charecord = <Table_Address>response.record;

        if (charecord != null) {
          this.record.hbl_agent_id = charecord.pkid;
          this.record.hbl_cha_code = charecord.code;
          this.record.hbl_cha_name = charecord.name;
          this.record.hbl_cha_attn = charecord.attention;
          this.record.hbl_cha_tel = charecord.telephone;
          this.record.hbl_cha_fax = charecord.fax;
          if (this.gs.GENERAL_BRANCH_CODE == "MFDR") {
            this.record.hbl_salesman_id = charecord.sman_id;
            this.record.hbl_salesman_name = charecord.sman_name;
          }
        }

        if (!this.gs.isBlank(this.hbl_consignee_name_field))
          this.hbl_consignee_name_field.nativeElement.focus();

      }, error => {
        this.errorMessage.push(this.gs.getError(error));
      });
  }

  RemoveRow(_rec: Tbl_cargo_imp_container) {
    this.cntrrecords.splice(this.cntrrecords.findIndex(rec => rec.cntr_pkid == _rec.cntr_pkid), 1);
  }

  UpdatePuEr() {

    this.errorMessage = [];
    if (this.mode != 'EDIT') {
      this.errorMessage.push('Please Save and Continue...');
      return;
    }

    if (!confirm("Update P/U. & E/R.")) {
      return;
    }

    const updateRecord = <vm_tbl_cargo_imp_housem>{};
    updateRecord.pkid = this.record.hbl_pkid;
    updateRecord.cntrs = this.cntrrecords;
    updateRecord.userinfo = this.gs.UserInfo;
    updateRecord.empty_ret_date = this.record.hbl_empty_ret_date;
    updateRecord.pickup_date = this.record.hbl_pickup_date;

    this.mainService.UpdatePuEr(updateRecord)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage.push(response.error);
          alert(this.errorMessage);
        }
        else {
          this.errorMessage.push('Update P/U. & E/R. Complete');
          alert(this.errorMessage);
        }
      }, error => {
        this.errorMessage.push(this.gs.getError(error));
      });
  }

  /*
    GetArrivalNotice(_type:string) {
      this.errorMessage = '';
      var SearchData = this.gs.UserInfo;
      SearchData.pkid = this.pkid;
      SearchData.type =_type;
                                  
      this.mainService.GetArrivalNotice(SearchData)
        .subscribe(response => {
          
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
  
          
        }, error => {
          this.errorMessage = this.gs.getError(error);
        });
    }
  
    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
      this.gs.DownloadFile(this.gs.GLOBAL_REPORT_FOLDER, filename, filetype, filedisplayname);
    }
  
    GetPreAlert() {
      this.errorMessage = '';
      var SearchData = this.gs.UserInfo;
      SearchData.pkid = this.pkid;
          
      this.mainService.GetPreAlertReport(SearchData)
        .subscribe(response => {
          
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
  
          
        }, error => {
          this.errorMessage = this.gs.getError(error);
        });
    }
    GetTurnOver() {
      this.errorMessage = '';
      var SearchData = this.gs.UserInfo;
      SearchData.pkid = this.pkid;
          
      this.mainService.GetTurnOverReport(SearchData)
        .subscribe(response => {
          
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
  
          
        }, error => {
          this.errorMessage = this.gs.getError(error);
        });
    }*/

}
