import { Component, OnInit, ViewChild, ElementRef, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { InputBoxComponent } from '../../../shared/input/inputbox.component';
import { InputBoxNumberComponent } from '../../../shared/inputnumber/inputboxnumber.component';

import { GlobalService } from '../../../core/services/global.service';
import { User_Menu } from '../../../core/models/menum';
import { SearchTable } from '../../../shared/models/searchtable';
import { AirExpHouseService } from '../../services/airexp-house.service';
import { Tbl_cargo_exp_housem, vm_tbl_cargo_exp_housem, Tbl_desc } from '../../models/Tbl_cargo_exp_housem';
import { Tbl_cargo_exp_desc } from '../../models/Tbl_cargo_exp_desc';
import { Tbl_cargo_exp_masterm } from '../../models/tbl_cargo_exp_masterm';
import { NgModel } from '@angular/forms';
import { AutoComplete2Component } from '../../../shared/autocomplete2/autocomplete2.component';

@Component({
  selector: 'app-airexp-house-edit',
  templateUrl: './airexp-house-edit.component.html'
})
export class AirExpHouseEditComponent implements OnInit {



  private pkid: string;
  private menuid: string;
  private mode: string = "ADD";
  private errorMessage: string[] = [];

  private title: string;
  private isAdmin: boolean;
  bValueChanged: boolean = false;

  record: Tbl_cargo_exp_housem = <Tbl_cargo_exp_housem>{};
  recorddet: Tbl_desc = <Tbl_desc>{};
  records: Tbl_cargo_exp_desc[] = [];

  ShipmentType: string = '';

  /*23/03/2020 */
  @ViewChild('shipment_stage') shipment_stage_ctrl: ElementRef;

  @ViewChild('_hbl_shipper_code') hbl_shipper_code_ctrl: AutoComplete2Component;
  @ViewChild('_hbl_shipper_name') hbl_shipper_name_ctrl: InputBoxComponent;
  @ViewChild('_hbl_consigned_to1') hbl_consigned_to1_ctrl: InputBoxComponent;
  @ViewChild('_hbl_salesman_name') hbl_salesman_name_ctrl: AutoComplete2Component;
  @ViewChild('_hbl_goods_nature') hbl_goods_nature_ctrl: InputBoxComponent;
  @ViewChild('_btnretaeh') btnretaeh_ctrl: ElementRef;

  tab: string = 'main';
  report_title: string = '';
  report_url: string = '';
  report_searchdata: any = {};
  report_menuid: string = '';


  DESC_TYPE: string = "AE-DESC";
  iStartNo: number = 0;
  iStep: number = 0;
  canSave: boolean = false;
  Client_Category: string = "SHPR";
  is_locked: boolean = false;
  is_stage_locked = false;
  origin: string = "";

  private parentid: string;
  private mbl_refno: string;
  private type: string;

  private refno: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: AirExpHouseService,
  ) { }


  ngOnInit() {
    if (this.route.snapshot.queryParams.parameter == null) {
      this.menuid = this.route.snapshot.queryParams.menuid;
      this.parentid = this.route.snapshot.queryParams.parentid;
      this.pkid = this.route.snapshot.queryParams.pkid;
      this.mbl_refno = this.route.snapshot.queryParams.refno;
      this.type = this.route.snapshot.queryParams.type;
      this.mode = this.route.snapshot.queryParams.mode;
      this.origin = this.route.snapshot.queryParams.origin;
    } else {
      const options = JSON.parse(this.route.snapshot.queryParams.parameter);
      this.menuid = options.menuid;
      this.parentid = options.parentid;
      this.pkid = options.pkid;
      this.mbl_refno = options.refno;
      this.type = options.type;
      this.mode = options.mode;
      this.origin = options.origin;
    }
    this.initPage();
    this.actionHandler();
  }

  ngAfterViewInit() {
    if (!this.gs.isBlank(this.btnretaeh_ctrl))
      this.btnretaeh_ctrl.nativeElement.focus();
  }

  initPage() {

    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.canSave = this.gs.canSave(this.menuid, this.mode);

    this.errorMessage = [];

  }

  actionHandler() {

    this.errorMessage = [];
    this.InitDesc();

    this.is_stage_locked = false;
    this.is_locked = false;

    if (this.mode == 'ADD') {
      this.pkid = this.gs.getGuid();
      this.record = <Tbl_cargo_exp_housem>{};
      this.records = <Tbl_cargo_exp_desc[]>[];
      this.InitRecord();
      this.LoadData();
    }
    if (this.mode == 'EDIT')
      this.GetRecord();

  }
  InitRecord() {
    this.record.hbl_pkid = this.pkid;
    this.record.hbl_mbl_id = this.parentid;
    this.record.hbl_houseno = "";
    this.record.hbl_date = "";
    this.record.hbl_bltype = "";
    this.record.hbl_frt_status = "";
    this.record.hbl_consignee_id = "";
    this.record.hbl_consignee_code = "";
    this.record.hbl_consignee_name = "";
    this.record.hbl_shipper_id = "";
    this.record.hbl_shipper_code = "";
    this.record.hbl_shipper_name = "";
    this.record.hbl_shipper_add1 = "";
    this.record.hbl_shipper_add2 = "";
    this.record.hbl_shipper_add3 = "";
    this.record.hbl_shipper_add4 = "";
    this.record.hbl_agent_id = "";
    this.record.hbl_agent_name = "";
    this.record.hbl_agent_city = "";
    this.record.hbl_agent_code = "";
    this.record.hbl_cha_id = "";
    this.record.hbl_cha_name = "";
    this.record.hbl_cha_code = "";
    this.record.hbl_asarranged_shipper = "";
    this.record.hbl_asarranged_consignee = "";
    this.record.hbl_asarranged_shipper_b = false;
    this.record.hbl_asarranged_consignee_b = false;
    this.record.hbl_commodity = "";
    this.record.hbl_uom = "";
    this.record.hbl_pcs = 0;
    this.record.hbl_packages = 0;
    this.record.hbl_weight = 0;
    this.record.hbl_lbs = 0;
    this.record.hbl_cbm = 0;
    this.record.hbl_cft = 0;
    this.record.hbl_remark1 = "";
    this.record.hbl_remark2 = "";
    this.record.hbl_remark3 = "";
    this.record.hbl_salesman_id = "";
    this.record.hbl_salesman_code = "";
    this.record.hbl_salesman_name = "";
    this.record.hbl_handled_id = "";
    this.record.hbl_handled_code = "";
    this.record.hbl_handled_name = "";
    this.record.rec_created_by = "";
    this.record.rec_created_date = "";
    this.record.rec_created_email = "";
    this.record.hbl_consigned_to1 = "";
    this.record.hbl_consigned_to2 = "";
    this.record.hbl_consigned_to3 = "";
    this.record.hbl_consigned_to4 = "";
    this.record.hbl_consigned_to5 = "";
    this.record.hbl_consigned_to6 = "";
    this.record.hbl_notify_id = "";
    this.record.hbl_notify_code = "";
    this.record.hbl_notify_name = "";
    this.record.hbl_notify_add1 = "";
    this.record.hbl_notify_add2 = "";
    this.record.hbl_notify_add3 = "";
    this.record.hbl_exp_ref1 = "";
    this.record.hbl_exp_ref2 = "";
    this.record.hbl_exp_ref3 = "";
    this.record.hbl_exp_ref4 = "";
    this.record.hbl_rout1 = "";
    this.record.hbl_rout2 = "";
    this.record.hbl_rout3 = "";
    this.record.hbl_rout4 = "";
    this.record.hbl_goods_nature = "";
    this.record.hbl_place_delivery = "";
    this.record.hbl_pol_name = "";
    this.record.hbl_pod_name = "";
    this.record.hbl_by1 = "";
    this.record.hbl_by2 = "";
    this.record.hbl_by1_carrier = "";
    this.record.hbl_by2_carrier = "";
    this.record.hbl_weight_unit = "";
    this.record.hbl_chwt = 0;
    this.record.hbl_chwt_lbs = 0;
    this.record.hbl_rate = 0;
    this.record.hbl_total = 0;
    this.record.hbl_iata = "";
    this.record.hbl_accno = "";
    this.record.hbl_oc_status = "";
    this.record.hbl_carriage_value = "";
    this.record.hbl_customs_value = "";
    this.record.hbl_ins_amt = "";
    this.record.hbl_class = "";
    this.record.hbl_comm = "";
    this.record.hbl_aesno = "";
    this.record.hbl_lcno = "";
    this.record.hbl_issued_by = "";
    this.record.hbl_issued_date = "";
    this.record.mbl_lock = "";
    this.record.mbl_unlock_date = "";
    this.record.mbl_ref_date = "";
    this.record.hbl_format_id = "";
    this.record.hbl_shipment_stage = "";
    this.record.hbl_charges1 = "";
    this.record.hbl_porc1 = "";
    this.record.hbl_rate1 = "";
    this.record.hbl_total1 = "";
    this.record.hbl_print_shpr1 = "";
    this.record.hbl_print_cons1 = "";
    this.record.hbl_print_shpr1_b = false;
    this.record.hbl_print_cons1_b = false;
    this.record.hbl_pp1 = "";
    this.record.hbl_cc1 = "";
    this.record.hbl_charges2 = "";
    this.record.hbl_porc2 = "";
    this.record.hbl_rate2 = "";
    this.record.hbl_total2 = "";
    this.record.hbl_print_shpr2 = "";
    this.record.hbl_print_cons2 = "";
    this.record.hbl_print_shpr2_b = false;
    this.record.hbl_print_cons2_b = false;
    this.record.hbl_pp2 = "";
    this.record.hbl_cc2 = "";
    this.record.hbl_charges3 = "";
    this.record.hbl_porc3 = "";
    this.record.hbl_rate3 = "";
    this.record.hbl_total3 = "";
    this.record.hbl_print_shpr3 = "";
    this.record.hbl_print_cons3 = "";
    this.record.hbl_print_shpr3_b = false;
    this.record.hbl_print_cons3_b = false;
    this.record.hbl_pp3 = "";
    this.record.hbl_cc3 = "";
    this.record.hbl_charges4 = "";
    this.record.hbl_porc4 = "";
    this.record.hbl_rate4 = "";
    this.record.hbl_total4 = "";
    this.record.hbl_print_shpr4 = "";
    this.record.hbl_print_cons4 = "";
    this.record.hbl_print_shpr4_b = false;
    this.record.hbl_print_cons4_b = false;
    this.record.hbl_pp4 = "";
    this.record.hbl_cc4 = "";
    this.record.hbl_charges5 = "";
    this.record.hbl_porc5 = "";
    this.record.hbl_rate5 = "";
    this.record.hbl_total5 = "";
    this.record.hbl_print_shpr5 = "";
    this.record.hbl_print_cons5 = "";
    this.record.hbl_print_shpr5_b = false;
    this.record.hbl_print_cons5_b = false;
    this.record.hbl_pp5 = "";
    this.record.hbl_cc5 = "";
    this.record.hbl_charges1_carrier = "";
    this.record.hbl_porc1_carrier = "";
    this.record.hbl_rate1_carrier = "";
    this.record.hbl_total1_carrier = "";
    this.record.hbl_print_shpr1_carrier = "";
    this.record.hbl_print_cons1_carrier = "";
    this.record.hbl_print_shpr1_carrier_b = false;
    this.record.hbl_print_cons1_carrier_b = false;
    this.record.hbl_pp1_carrier = "";
    this.record.hbl_cc1_carrier = "";
    this.record.hbl_charges2_carrier = "";
    this.record.hbl_porc2_carrier = "";
    this.record.hbl_rate2_carrier = "";
    this.record.hbl_total2_carrier = "";
    this.record.hbl_print_shpr2_carrier = "";
    this.record.hbl_print_cons2_carrier = "";
    this.record.hbl_print_shpr2_carrier_b = false;
    this.record.hbl_print_cons2_carrier_b = false;
    this.record.hbl_pp2_carrier = "";
    this.record.hbl_cc2_carrier = "";
    this.record.hbl_charges3_carrier = "";
    this.record.hbl_porc3_carrier = "";
    this.record.hbl_rate3_carrier = "";
    this.record.hbl_total3_carrier = "";
    this.record.hbl_print_shpr3_carrier = "";
    this.record.hbl_print_cons3_carrier = "";
    this.record.hbl_print_shpr3_carrier_b = false;
    this.record.hbl_print_cons3_carrier_b = false;
    this.record.hbl_pp3_carrier = "";
    this.record.hbl_cc3_carrier = "";

  }
  LoadData() {

    if (this.mode == "ADD") {
      this.record.hbl_asarranged_shipper = "N";
      this.record.hbl_asarranged_consignee = "N";
      this.record.hbl_print_shpr1 = "N";
      this.record.hbl_print_shpr2 = "N";
      this.record.hbl_print_shpr3 = "N";
      this.record.hbl_print_shpr4 = "N";
      this.record.hbl_print_shpr5 = "N";
      this.record.hbl_print_cons1 = "N";
      this.record.hbl_print_cons2 = "N";
      this.record.hbl_print_cons3 = "N";
      this.record.hbl_print_cons4 = "N";
      this.record.hbl_print_cons5 = "N";
      this.record.hbl_print_shpr1_carrier = "N";
      this.record.hbl_print_shpr2_carrier = "N";
      this.record.hbl_print_shpr3_carrier = "N";
      this.record.hbl_print_cons1_carrier = "N";
      this.record.hbl_print_cons2_carrier = "N";
      this.record.hbl_print_cons3_carrier = "N";

      this.record.hbl_asarranged_shipper_b = false;
      this.record.hbl_asarranged_consignee_b = false;
      this.record.hbl_print_shpr1_b = false;
      this.record.hbl_print_shpr2_b = false;
      this.record.hbl_print_shpr3_b = false;
      this.record.hbl_print_shpr4_b = false;
      this.record.hbl_print_shpr5_b = false;
      this.record.hbl_print_cons1_b = false;
      this.record.hbl_print_cons2_b = false;
      this.record.hbl_print_cons3_b = false;
      this.record.hbl_print_cons4_b = false;
      this.record.hbl_print_cons5_b = false;
      this.record.hbl_print_shpr1_carrier_b = false;
      this.record.hbl_print_shpr2_carrier_b = false;
      this.record.hbl_print_shpr3_carrier_b = false;
      this.record.hbl_print_cons1_carrier_b = false;
      this.record.hbl_print_cons2_carrier_b = false;
      this.record.hbl_print_cons3_carrier_b = false;

      this.record.hbl_frt_status = "";
      this.record.hbl_bltype = "";
      this.record.hbl_shipment_stage = "NIL";


      this.record.hbl_date = this.gs.defaultValues.today;
      this.record.rec_created_by = this.gs.user_code;
      this.record.rec_created_date = this.gs.defaultValues.today;


      if (this.parentid.trim() != "")
        this.LoadMasterData();

      if (this.gs.PARAM_HAWB_FORMAT != null) {
        if (this.gs.PARAM_HAWB_FORMAT.length > 0)
          this.record.hbl_format_id = this.gs.PARAM_HAWB_FORMAT[0].code;
      }

    }
  }

  LoadMasterData() {
    this.errorMessage = [];
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.parentid;
    this.mainService.LoadMasterData(SearchData)
      .subscribe(response => {
        var masRec = <Tbl_cargo_exp_masterm>response.record;

        if (masRec != null) {
          this.record.mbl_refno = masRec.mbl_refno;

          this.record.mbl_no = masRec.mbl_no;
          this.record.hbl_vessel = masRec.mbl_vessel;
          this.record.hbl_voyage = masRec.mbl_voyage;


          this.record.hbl_handled_id = masRec.mbl_handled_id;
          this.record.hbl_handled_name = masRec.mbl_handled_name;

          this.record.hbl_salesman_id = masRec.mbl_salesman_id;
          this.record.hbl_salesman_name = masRec.mbl_salesman_name;

          this.record.hbl_pol_name = this.gs.GetAirportCode(masRec.mbl_pol_code, masRec.mbl_pol_name, masRec.mbl_pol_cntry_code);
          this.record.hbl_pod_name = this.gs.GetAirportCode(masRec.mbl_pod_code, masRec.mbl_pod_name, masRec.mbl_pod_cntry_code);

          this.record.hbl_weight_unit = "KG";
          this.record.hbl_uom = "CTN";


          this.record.hbl_carriage_value = "NVD";
          this.record.hbl_customs_value = "NCV";
          this.record.hbl_ins_amt = "NIL";

          this.record.hbl_iata = this.gs.HBL_IATA;

          this.record.hbl_rout3 = "PLEASE CONTACT WITH CONSIGNEE UPON SHIPMENT ARRIVAL.";

          this.record.hbl_exp_ref1 = this.gs.ISSUE_AGENT_NAME;
          this.record.hbl_exp_ref2 = this.gs.ISSUE_AGENT_ADDRESS;
          this.record.hbl_exp_ref3 = this.gs.ISSUE_AGENT_CITY;


          this.record.hbl_issued_by = masRec.mbl_handled_name;


          this.record.hbl_by1_carrier = this.gs.ADDRESS_LINE1 + " AS AGENT FOR";

          this.record.hbl_by2_carrier = masRec.mbl_liner_name;

          this.record.hbl_agent_name = this.gs.ISSUE_AGENT_NAME;
          this.record.hbl_agent_city = this.gs.ISSUE_AGENT_CITY;

          this.record.hbl_issued_date = masRec.mbl_pol_etd;

          this.is_locked = this.gs.IsShipmentClosed("AIR EXPORT", masRec.mbl_ref_date, masRec.mbl_lock, masRec.mbl_unlock_date);

          // if (Lib.IsShipmentClosed("AIR EXPORT", (DateTime)masRec.mbl_ref_date, masRec.mbl_lock,masRec.mbl_unlock_date))
          // {
          //     LBL_LOCK.Content = "LOCKED";
          //     CmdSave.IsEnabled = false;
          // }

        }
        if (!this.gs.isBlank(this.hbl_shipper_code_ctrl))
          this.hbl_shipper_code_ctrl.Focus();

      }, error => {
        this.errorMessage.push(this.gs.getError(error));
        alert(this.errorMessage[0]);
      });
  }

  GetRecord() {

    this.errorMessage = [];
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;
    SearchData.desc_type = this.DESC_TYPE;
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {

        this.record = <Tbl_cargo_exp_housem>response.record;
        this.records = <Tbl_cargo_exp_desc[]>response.records;
        this.is_locked = this.gs.IsShipmentClosed("AIR EXPORT", this.record.mbl_ref_date, this.record.mbl_lock, this.record.mbl_unlock_date);
        this.InitDesc();
        if (this.records != null) {
          this.records.forEach(rec => {
            this.ShowDesc(rec);
          });
        }

        this.record.hbl_asarranged_shipper_b = (this.record.hbl_asarranged_shipper == "Y") ? true : false;
        this.record.hbl_asarranged_consignee_b = (this.record.hbl_asarranged_consignee == "Y") ? true : false;
        this.record.hbl_print_shpr1_b = (this.record.hbl_print_shpr1 == "Y") ? true : false;
        this.record.hbl_print_shpr2_b = (this.record.hbl_print_shpr2 == "Y") ? true : false;
        this.record.hbl_print_shpr3_b = (this.record.hbl_print_shpr3 == "Y") ? true : false;
        this.record.hbl_print_shpr4_b = (this.record.hbl_print_shpr4 == "Y") ? true : false;
        this.record.hbl_print_shpr5_b = (this.record.hbl_print_shpr5 == "Y") ? true : false;
        this.record.hbl_print_cons1_b = (this.record.hbl_print_cons1 == "Y") ? true : false;
        this.record.hbl_print_cons2_b = (this.record.hbl_print_cons2 == "Y") ? true : false;
        this.record.hbl_print_cons3_b = (this.record.hbl_print_cons3 == "Y") ? true : false;
        this.record.hbl_print_cons4_b = (this.record.hbl_print_cons4 == "Y") ? true : false;
        this.record.hbl_print_cons5_b = (this.record.hbl_print_cons5 == "Y") ? true : false;
        this.record.hbl_print_shpr1_carrier_b = (this.record.hbl_print_shpr1_carrier == "Y") ? true : false;
        this.record.hbl_print_shpr2_carrier_b = (this.record.hbl_print_shpr2_carrier == "Y") ? true : false;
        this.record.hbl_print_shpr3_carrier_b = (this.record.hbl_print_shpr3_carrier == "Y") ? true : false;
        this.record.hbl_print_cons1_carrier_b = (this.record.hbl_print_cons1_carrier == "Y") ? true : false;
        this.record.hbl_print_cons2_carrier_b = (this.record.hbl_print_cons2_carrier == "Y") ? true : false;
        this.record.hbl_print_cons3_carrier_b = (this.record.hbl_print_cons3_carrier == "Y") ? true : false;
        if (!this.gs.isBlank(this.btnretaeh_ctrl))
          this.btnretaeh_ctrl.nativeElement.focus();

      }, error => {
        this.errorMessage.push(this.gs.getError(error));

      });
  }


  ShowDesc(Rec: Tbl_cargo_exp_desc) {
    if (Rec.cargo_ctr == 1) {
      this.recorddet.mark1 = Rec.cargo_marks; this.recorddet.desc1 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 2) {
      this.recorddet.mark2 = Rec.cargo_marks; this.recorddet.desc2 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 3) {
      this.recorddet.mark3 = Rec.cargo_marks; this.recorddet.desc3 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 4) {
      this.recorddet.mark4 = Rec.cargo_marks; this.recorddet.desc4 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 5) {
      this.recorddet.mark5 = Rec.cargo_marks; this.recorddet.desc5 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 6) {
      this.recorddet.mark6 = Rec.cargo_marks; this.recorddet.desc6 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 7) {
      this.recorddet.mark7 = Rec.cargo_marks; this.recorddet.desc7 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 8) {
      this.recorddet.mark8 = Rec.cargo_marks; this.recorddet.desc8 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 9) {
      this.recorddet.mark9 = Rec.cargo_marks; this.recorddet.desc9 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 10) {
      this.recorddet.mark10 = Rec.cargo_marks; this.recorddet.desc10 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 11) {
      this.recorddet.desc11 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 12) {
      this.recorddet.desc12 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 13) {
      this.recorddet.desc13 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 14) {
      this.recorddet.desc14 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 15) {
      this.recorddet.desc15 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 16) {
      this.recorddet.desc16 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 17) {
      this.recorddet.desc17 = Rec.cargo_description;
    }
  }

  InitDesc() {

    this.recorddet.mark1 = ""; this.recorddet.desc1 = "";
    this.recorddet.mark2 = ""; this.recorddet.desc2 = "";
    this.recorddet.mark3 = ""; this.recorddet.desc3 = "";
    this.recorddet.mark4 = ""; this.recorddet.desc4 = "";
    this.recorddet.mark5 = ""; this.recorddet.desc5 = "";
    this.recorddet.mark6 = ""; this.recorddet.desc6 = "";
    this.recorddet.mark7 = ""; this.recorddet.desc7 = "";
    this.recorddet.mark8 = ""; this.recorddet.desc8 = "";
    this.recorddet.mark9 = ""; this.recorddet.desc9 = "";
    this.recorddet.mark10 = ""; this.recorddet.desc10 = "";
    this.recorddet.desc11 = "";
    this.recorddet.desc12 = "";
    this.recorddet.desc13 = "";
    this.recorddet.desc14 = "";
    this.recorddet.desc15 = "";
    this.recorddet.desc16 = "";
    this.recorddet.desc17 = "";
  }


  Allvalid() {
    let bret = true;

    if (this.gs.isBlank(this.parentid)) {
      this.errorMessage.push("Invalid MBL ID");
      bret = false;
    }

    if (this.iStartNo <= 0 || this.iStep <= 0) {
      this.errorMessage.push("Invalid HAWB Starting / Increment No");
      bret = false;
    }

    if (!this.gs.isBlank(this.shipment_stage_ctrl))
      if (!this.shipment_stage_ctrl.nativeElement.disabled) {
        if (this.gs.isBlank(this.record.hbl_shipment_stage)) {
          this.errorMessage.push("Shipment Stage cannot be blank");
          bret = false;
        }
      }


    if (this.gs.isBlank(this.record.hbl_shipper_id) || this.gs.isBlank(this.record.hbl_shipper_code)) {
      this.errorMessage.push("Shipper Code cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.hbl_shipper_name)) {
      this.errorMessage.push("Shipper Name cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.hbl_shipper_add1)) {
      this.errorMessage.push("Shipper Address1 cannot be blank");
      bret = false;
    }


    if (this.gs.isBlank(this.record.hbl_consignee_id) || this.gs.isBlank(this.record.hbl_consignee_code)) {
      this.errorMessage.push("Consignee Code cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.hbl_consigned_to1)) {
      this.errorMessage.push("Consignee Name cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.hbl_consigned_to2)) {
      this.errorMessage.push("Consignee Address1 cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.hbl_frt_status)) {
      this.errorMessage.push("Freight Status cannot be blank");
      bret = false;
    }


    this.record.hbl_oc_status = this.record.hbl_oc_status.trim();
    if (this.record.hbl_oc_status != "") {
      if (this.record.hbl_oc_status != "P" && this.record.hbl_oc_status != "C") {
        this.errorMessage.push("Invalid Other/PC, P or C has to be enterd(P-Prepaid,C-Collect)");
        bret = false;
      }
    }

    if (this.gs.isBlank(this.record.hbl_bltype)) {
      this.errorMessage.push("Nomination Type cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.hbl_pol_name)) {
      this.errorMessage.push("Pol cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.hbl_pod_name)) {
      this.errorMessage.push("Pod cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.hbl_handled_id) || this.gs.isBlank(this.record.hbl_handled_name)) {
      this.errorMessage.push("Handled By cannot be blank");
      bret = false;
    }

    if (this.gs.isZero(this.record.hbl_packages)) {
      this.errorMessage.push("Pcs cannot be blank");
      bret = false;
    }

    if (this.gs.isZero(this.record.hbl_weight)) {
      this.errorMessage.push("Weight cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.hbl_weight_unit)) {
      this.errorMessage.push("Kg/Lb cannot be blank");
      bret = false;
    }

    if (this.gs.isZero(this.record.hbl_chwt)) {
      this.errorMessage.push("Ch.Wt cannot be blank");
      bret = false;
    }


    if (!bret)
      alert('Error While Saving');

    return bret;
  }

  onChange(field: string) {

    if (field == 'hbl_rate' || field == 'hbl_chwt' || field == 'hbl_rate1' || field == 'hbl_rate2' ||
      field == 'hbl_rate3' || field == 'hbl_rate4' || field == 'hbl_rate5' || field == 'hbl_rate1_carrier' || field == 'hbl_rate2_carrier'
      || field == 'hbl_rate3_carrier' || field == 'hbl_rate4_carrier')
      this.bValueChanged = true;

  }

  onFocus(field: string) {

    if (field == 'hbl_rate' || field == 'hbl_chwt' || field == 'hbl_rate1' || field == 'hbl_rate2' ||
      field == 'hbl_rate3' || field == 'hbl_rate4' || field == 'hbl_rate5' || field == 'hbl_rate1_carrier' || field == 'hbl_rate2_carrier'
      || field == 'hbl_rate3_carrier' || field == 'hbl_rate4_carrier')
      this.bValueChanged = false;

  }

  onBlur(field: string) {

    switch (field) {
      case 'hbl_rate': {
        this.record.hbl_rate = this.gs.roundNumber(this.record.hbl_rate, 2);
        this.FindTotal();
        break;
      }
      case 'hbl_chwt': {
        this.record.hbl_chwt = this.gs.roundNumber(this.record.hbl_chwt, 3);
        this.FindTotal();
        this.FindOther("");
        break;
      }
      case 'hbl_rate1': {
        this.record.hbl_rate1 = this.gs.roundNumber(+this.record.hbl_rate1, 2).toString();
        this.FindOther("A1");
        break;
      }
      case 'hbl_rate2': {
        this.record.hbl_rate2 = this.gs.roundNumber(+this.record.hbl_rate2, 2).toString();
        this.FindOther("A2");
        break;
      }
      case 'hbl_rate3': {
        this.record.hbl_rate3 = this.gs.roundNumber(+this.record.hbl_rate3, 2).toString();
        this.FindOther("A3");
        break;
      }
      case 'hbl_rate4': {
        this.record.hbl_rate4 = this.gs.roundNumber(+this.record.hbl_rate4, 2).toString();
        this.FindOther("A4");
        break;
      }
      case 'hbl_rate5': {
        this.record.hbl_rate5 = this.gs.roundNumber(+this.record.hbl_rate5, 2).toString();
        this.FindOther("A5");
        break;
      }

      case 'hbl_rate1_carrier': {
        this.record.hbl_rate1_carrier = this.gs.roundNumber(+this.record.hbl_rate1_carrier, 2).toString();
        this.FindOther("C1");
        break;
      }

      case 'hbl_rate2_carrier': {
        this.record.hbl_rate2_carrier = this.gs.roundNumber(+this.record.hbl_rate2_carrier, 2).toString();
        this.FindOther("C2");
        break;
      }

      case 'hbl_rate3_carrier': {
        this.record.hbl_rate3_carrier = this.gs.roundNumber(+this.record.hbl_rate3_carrier, 2).toString();
        this.FindOther("C3");
        break;
      }

    }

  }



  Save() {

    this.errorMessage = [];
    this.iStartNo = +this.gs.AIR_EXPORT_HOUSE_STARTING_NO.toString();
    this.iStep = +this.gs.AIR_EXPORT_HOUSE_INCR_BY.toString();

    if (!this.Allvalid())
      return;

    this.SaveParent();
    this.SaveDescList();

    const saverec = <vm_tbl_cargo_exp_housem>{};

    saverec.mode = this.mode;
    saverec.pkid = this.pkid;
    saverec.record = this.record;
    saverec.records = this.records;
    saverec.userinfo = this.gs.UserInfo;
    saverec.isPol = this.gs.AIR_EXPORT_HOUSE_PREFIX_POL.toString();
    saverec.isPod = this.gs.AIR_EXPORT_HOUSE_PREFIX_POD.toString();
    saverec.iStartNo = this.iStartNo;
    saverec.iStep = this.iStep;
    saverec.housePrefix = this.gs.AIR_EXPORT_HOUSE_PREFIX;

    this.mainService.Save(saverec).subscribe(response => {

      if (response.retvalue) {
        if (this.mode === "ADD" && response.code != '')
          this.record.hbl_houseno = response.code;
        this.mode = 'EDIT';
        if (this.origin === "airexp-house-page")
          this.mainService.RefreshList(this.record);
        this.errorMessage.push('Save Complete');
      }
    }, error => {
      this.errorMessage.push(this.gs.getError(error));
      alert(this.errorMessage[0]);
    }
    );

  }


  private SaveParent() {
    this.record.hbl_mbl_id = this.parentid;
    this.record.rec_created_id = this.gs.user_pkid;

    if (this.gs.BRANCH_REGION != "USA")
      this.record.hbl_goods_nature = this.record.hbl_commodity;

    this.record.hbl_asarranged_shipper = (this.record.hbl_asarranged_shipper_b) ? "Y" : "N";
    this.record.hbl_asarranged_consignee = (this.record.hbl_asarranged_consignee_b) ? "Y" : "N";
    this.record.hbl_print_shpr1 = (this.record.hbl_print_shpr1_b) ? "Y" : "N";
    this.record.hbl_print_shpr2 = (this.record.hbl_print_shpr2_b) ? "Y" : "N";
    this.record.hbl_print_shpr3 = (this.record.hbl_print_shpr3_b) ? "Y" : "N";
    this.record.hbl_print_shpr4 = (this.record.hbl_print_shpr4_b) ? "Y" : "N";
    this.record.hbl_print_shpr5 = (this.record.hbl_print_shpr5_b) ? "Y" : "N";
    this.record.hbl_print_cons1 = (this.record.hbl_print_cons1_b) ? "Y" : "N";
    this.record.hbl_print_cons2 = (this.record.hbl_print_cons2_b) ? "Y" : "N";
    this.record.hbl_print_cons3 = (this.record.hbl_print_cons3_b) ? "Y" : "N";
    this.record.hbl_print_cons4 = (this.record.hbl_print_cons4_b) ? "Y" : "N";
    this.record.hbl_print_cons5 = (this.record.hbl_print_cons5_b) ? "Y" : "N";
    this.record.hbl_print_shpr1_carrier = (this.record.hbl_print_shpr1_carrier_b) ? "Y" : "N";
    this.record.hbl_print_shpr2_carrier = (this.record.hbl_print_shpr2_carrier_b) ? "Y" : "N";
    this.record.hbl_print_shpr3_carrier = (this.record.hbl_print_shpr3_carrier_b) ? "Y" : "N";
    this.record.hbl_print_cons1_carrier = (this.record.hbl_print_cons1_carrier_b) ? "Y" : "N";
    this.record.hbl_print_cons2_carrier = (this.record.hbl_print_cons2_carrier_b) ? "Y" : "N";
    this.record.hbl_print_cons3_carrier = (this.record.hbl_print_cons3_carrier_b) ? "Y" : "N";
  }


  SaveDescList() {

    this.records = <Tbl_cargo_exp_desc[]>[];

    this.SaveDesc(1, this.recorddet.mark1, "", this.recorddet.desc1);
    this.SaveDesc(2, this.recorddet.mark2, "", this.recorddet.desc2);
    this.SaveDesc(3, this.recorddet.mark3, "", this.recorddet.desc3);

    this.SaveDesc(4, this.recorddet.mark4, '', this.recorddet.desc4);
    this.SaveDesc(5, this.recorddet.mark5, '', this.recorddet.desc5);
    this.SaveDesc(6, this.recorddet.mark6, '', this.recorddet.desc6);
    this.SaveDesc(7, this.recorddet.mark7, '', this.recorddet.desc7);
    this.SaveDesc(8, this.recorddet.mark8, '', this.recorddet.desc8);
    this.SaveDesc(9, this.recorddet.mark9, '', this.recorddet.desc9);
    this.SaveDesc(10, this.recorddet.mark10, '', this.recorddet.desc10);
    this.SaveDesc(11, "", '', this.recorddet.desc11);

    this.SaveDesc(12, "", '', this.recorddet.desc12);
    this.SaveDesc(13, "", '', this.recorddet.desc13);
    this.SaveDesc(14, "", '', this.recorddet.desc14);
    this.SaveDesc(15, "", '', this.recorddet.desc15);
    this.SaveDesc(16, "", '', this.recorddet.desc16);
    this.SaveDesc(17, "", '', this.recorddet.desc17);

  }

  SaveDesc(iCtr: number, M1: string, P1: string, D1: string) {
    if (M1.length > 0 || P1.length > 0 || D1.length > 0) {
      var Rec: Tbl_cargo_exp_desc = <Tbl_cargo_exp_desc>{};
      Rec.parentid = this.pkid;
      Rec.parent_type = this.DESC_TYPE;
      Rec.cargo_ctr = iCtr;
      Rec.cargo_marks = M1;
      Rec.cargo_packages = P1;
      Rec.cargo_description = D1;
      this.records.push(Rec);
    }
  }



  LovSelected(rec: SearchTable) {

    if (rec.controlname == "SHIPPER") {
      this.record.hbl_shipper_id = rec.id;
      this.record.hbl_shipper_code = rec.code;
      this.record.hbl_shipper_name = rec.name;
      if (rec.col8 != "")
        this.record.hbl_shipper_name = rec.col8;
      this.record.hbl_shipper_add1 = rec.col1;
      this.record.hbl_shipper_add2 = rec.col2;
      this.record.hbl_shipper_add3 = rec.col3;
      this.record.hbl_shipper_add4 = this.gs.GetTelFax(rec.col6, rec.col7);
      this.record.hbl_by1 = this.gs.ADDRESS_LINE1 + " AS AGENT FOR ";     //Agnt_for_Shipper                  
      this.record.hbl_by2 = this.record.hbl_shipper_name;     //Agnt_for_Shipper2  

      if (rec.col9 == "Y") {
        this.gs.ShowAccAlert(this.record.hbl_shipper_id);
      }
      if (!this.gs.isBlank(this.hbl_shipper_name_ctrl))
        this.hbl_shipper_name_ctrl.focus();

    }

    if (rec.controlname == 'CONSIGNEE') {

      this.record.hbl_consignee_id = rec.id;
      this.record.hbl_consignee_code = rec.code;
      this.record.hbl_consigned_to1 = rec.name;
      this.record.hbl_consigned_to2 = rec.col1;
      this.record.hbl_consigned_to3 = rec.col2;
      this.record.hbl_consigned_to4 = rec.col3;
      this.record.hbl_consigned_to5 = this.gs.GetTelFax(rec.col6, rec.col7);
      this.record.hbl_consigned_to6 = this.gs.GetAttention(rec.col5);
      var sNom = rec.type;
      if (sNom == "NOMINATION" || sNom == "MUTUAL")
        this.record.hbl_bltype = sNom;
      else
        this.record.hbl_bltype = "FREEHAND";

      if (rec.col9 == "Y") {
        this.gs.ShowAccAlert(this.record.hbl_consignee_id);
      }
      if (!this.gs.isBlank(this.hbl_consigned_to1_ctrl))
        this.hbl_consigned_to1_ctrl.focus();

    }

    // if (rec.controlname == "NOTIFY") {
    //   this.record.hbl_notify_id = rec.id;
    //   this.record.hbl_notify_code = rec.code;
    //   this.record.hbl_notify_name = rec.name;
    //   if (rec.col8 != "")
    //     this.record.hbl_notify_name = rec.col8;
    //   this.record.hbl_notify_add1 = rec.col1;
    //   this.record.hbl_notify_add2 = rec.col2;
    //   this.record.hbl_notify_add3 = rec.col3;
    //   // this.record.hbl_notify_add4 = this.gs.GetTelFax(rec.col6, rec.col7);
    //   if (rec.col9 == "Y") {
    //     this.gs.ShowAccAlert(this.record.hbl_notify_id);
    //   }
    // }


    // if (rec.controlname == "AGENT") {
    //   this.record.hbl_agent_id = rec.id;
    // }

    if (rec.controlname == "HANDLEDBY") {
      this.record.hbl_handled_id = rec.id;
      this.record.hbl_issued_by = rec.name;
      if (!this.gs.isBlank(this.hbl_salesman_name_ctrl))
        this.hbl_salesman_name_ctrl.Focus();

    }

    if (rec.controlname == "SALEMSAN") {
      this.record.hbl_salesman_id = rec.id;
      if (!this.gs.isBlank(this.hbl_goods_nature_ctrl))
        this.hbl_goods_nature_ctrl.focus();

    }

    // // Container
    // if (rec.controlname == "CONTAINER TYPE") {
    //   this.cntrs.forEach(mrec => {
    //     if (mrec.cntr_pkid == rec.uid) {
    //     }
    //   });
    // }

  }
  BtnNavigation(action: string) {

    switch (action) {

      case 'FULL-FORMAT': {
        this.report_title = 'House Print';
        this.report_url = '/api/AirExport/House/GetHAWBReport';
        this.report_searchdata = this.gs.UserInfo;
        this.report_searchdata.pkid = this.pkid;
        this.report_searchdata.invoketype = this.Client_Category;
        this.report_searchdata.desc_type = this.DESC_TYPE;
        if (this.Client_Category == "SHPR" || this.Client_Category == "CNOR")
          this.report_menuid = this.gs.MENU_AE_HOUSE_HAWB_SHIPPER;
        else
          this.report_menuid = this.gs.MENU_AE_HOUSE_HAWB_CONSIGNEE;
        this.tab = 'report';
        break;
      }
      case 'BLANK-FORMAT': {
        this.report_title = 'House Print';
        this.report_url = '/api/AirExport/House/GetHAWBBlankReport';
        this.report_searchdata = this.gs.UserInfo;
        this.report_searchdata.pkid = this.pkid;
        this.report_searchdata.invoketype = this.Client_Category;
        this.report_searchdata.desc_type = this.DESC_TYPE;
        if (this.Client_Category == "SHPR" || this.Client_Category == "CNOR")
          this.report_menuid = this.gs.MENU_AE_HOUSE_HAWB_SHIPPER;
        else
          this.report_menuid = this.gs.MENU_AE_HOUSE_HAWB_CONSIGNEE;
        this.tab = 'report';
        break;
      }

    }
  }
  callbackevent(event: any) {
    this.tab = 'main';
  }

  Close() {
    this.location.back();
  }

  private FindTotal() {
    if (!this.bValueChanged)
      return;

    let nTot: number = this.record.hbl_rate * this.record.hbl_chwt;
    this.record.hbl_total = this.gs.roundNumber(nTot, 2);
  }

  private FindOther(_type: string = "") {
    if (!this.bValueChanged)
      return;

    let nAmt: number = 0;

    if (+this.record.hbl_rate1 > 0 && (_type == "A1" || _type == "")) {
      nAmt = +this.record.hbl_rate1 * this.record.hbl_chwt; this.record.hbl_total1 = this.gs.roundNumber(nAmt, 2).toString();
    }

    if (+this.record.hbl_rate2 > 0 && (_type == "A2" || _type == "")) {
      nAmt = +this.record.hbl_rate2 * this.record.hbl_chwt; this.record.hbl_total2 = this.gs.roundNumber(nAmt, 2).toString();
    }

    if (+this.record.hbl_rate3 > 0 && (_type == "A3" || _type == "")) {
      nAmt = +this.record.hbl_rate3 * this.record.hbl_chwt; this.record.hbl_total3 = this.gs.roundNumber(nAmt, 2).toString();
    }
    if (+this.record.hbl_rate4 > 0 && (_type == "A4" || _type == "")) {
      nAmt = +this.record.hbl_rate4 * this.record.hbl_chwt; this.record.hbl_total4 = this.gs.roundNumber(nAmt, 2).toString();
    }
    if (+this.record.hbl_rate5 > 0 && (_type == "A5" || _type == "")) {
      nAmt = +this.record.hbl_rate5 * this.record.hbl_chwt; this.record.hbl_total5 = this.gs.roundNumber(nAmt, 2).toString();
    }

    if (+this.record.hbl_rate1_carrier > 0 && (_type == "C1" || _type == "")) {
      nAmt = +this.record.hbl_rate1_carrier * this.record.hbl_chwt; this.record.hbl_total1_carrier = this.gs.roundNumber(nAmt, 2).toString();
    }

    if (+this.record.hbl_rate2_carrier > 0 && (_type == "C2" || _type == "")) {
      nAmt = +this.record.hbl_rate2_carrier * this.record.hbl_chwt; this.record.hbl_total2_carrier = this.gs.roundNumber(nAmt, 2).toString();
    }
    if (+this.record.hbl_rate3_carrier > 0 && (_type == "C3" || _type == "")) {
      nAmt = +this.record.hbl_rate3_carrier * this.record.hbl_chwt; this.record.hbl_total3_carrier = this.gs.roundNumber(nAmt, 2).toString();
    }

  }
}
