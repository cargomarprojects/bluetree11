import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/services/global.service';
import { AutoComplete2Component } from '../../../shared/autocomplete2/autocomplete2.component';
import { AirImpHouseService } from '../../services/airimp-house.service';
import { User_Menu } from '../../../core/models/menum';
import { vm_tbl_cargo_imp_housem, Tbl_cargo_imp_desc, Tbl_cargo_imp_housem, Table_Address } from '../../models/tbl_cargo_imp_housem';
import { SearchTable } from '../../../shared/models/searchtable';
import { strictEqual } from 'assert';
import { Tbl_cargo_imp_masterm } from '../../models/tbl_cargo_imp_masterm';
import { InputBoxComponent } from '../../../shared/input/inputbox.component';
import { DateComponent } from '../../../shared/date/date.component';

@Component({
  selector: 'app-airimp-house-edit',
  templateUrl: './airimp-house-edit.component.html'
})
export class AirImpHouseEditComponent implements OnInit {

  @ViewChild('_hbl_shipment_stage') shipment_stage_field: ElementRef;

  @ViewChild('_hbl_houseno') hbl_houseno_field: ElementRef;
  // @ViewChild('hbl_shipment_stage') hbl_shipment_stage_field: ElementRef;
  @ViewChild('_hbl_shipper_code') hbl_shipper_code_field: AutoComplete2Component;
  @ViewChild('_hbl_shipper_name') hbl_shipper_name_field: InputBoxComponent;
  // @ViewChild('hbl_shipper_add1') hbl_shipper_add1_field: ElementRef;hbl_shipper_name
  @ViewChild('_hbl_consignee_code') hbl_consignee_code_field: AutoComplete2Component;
  @ViewChild('_hbl_consignee_name') hbl_consignee_name_field: InputBoxComponent;
  @ViewChild('_hbl_location_name') hbl_location_name_field: InputBoxComponent;
  // @ViewChild('hbl_agent_name') hbl_agent_name_field: AutoComplete2Component;
  @ViewChild('_hbl_cha_code') hbl_cha_code_field: AutoComplete2Component;
  @ViewChild('_hbl_cha_name') hbl_cha_name_field: InputBoxComponent;
  @ViewChild('_hbl_place_final') hbl_place_final_field: InputBoxComponent;
  // @ViewChild('hbl_packages') hbl_packages_field: ElementRef;
  // @ViewChild('hbl_uom') hbl_uom_field: ElementRef;
  // @ViewChild('hbl_weight') hbl_weight_field: ElementRef;
  // @ViewChild('hbl_cbm') hbl_cbm_field: ElementRef;
  // @ViewChild('hbl_lbs') hbl_lbs_field: ElementRef;
  // @ViewChild('hbl_cft') hbl_cft_field: ElementRef;
  // @ViewChild('hbl_commodity') hbl_commodity_field: ElementRef;
  // @ViewChild('hbl_frt_status') hbl_frt_status_field: ElementRef;
  // @ViewChild('hbl_ship_term_id') hbl_ship_term_id_field: ElementRef;
  // @ViewChild('hbl_bltype') hbl_bltype_field: ElementRef;
  // @ViewChild('hbl_handled_name') hbl_handled_name_field: AutoComplete2Component;
  @ViewChild('_hbl_salesman_name') hbl_salesman_name_field: AutoComplete2Component;

  @ViewChild('_hbl_lfd_date') hbl_lfd_date_field: DateComponent;

  mblrecord: Tbl_cargo_imp_masterm = <Tbl_cargo_imp_masterm>{};
  record: Tbl_cargo_imp_housem = <Tbl_cargo_imp_housem>{};
  descrecords: Tbl_cargo_imp_desc[] = [];

  // 24-05-2019 Created By Joy  

  tab: string = 'main';
  report_title: string = '';
  report_url: string = '';
  report_searchdata: any = {};
  report_menuid: string = '';
  origin: string = "";

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

  // IsLocked: boolean = false;
  is_locked: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: AirImpHouseService,
  ) { }

  ngOnInit() {
    if (this.route.snapshot.queryParams.parameter == null) {
      this.pkid = this.route.snapshot.queryParams.pkid;
      this.menuid = this.route.snapshot.queryParams.menuid;
      this.mode = this.route.snapshot.queryParams.mode;
      this.parentid = this.route.snapshot.queryParams.parentid;
      this.origin = this.route.snapshot.queryParams.origin;
    } else {
      const options = JSON.parse(this.route.snapshot.queryParams.parameter);
      this.pkid = options.pkid;
      this.menuid = options.menuid;
      this.mode = options.mode;
      this.parentid = options.parentid;
      this.origin = options.origin;
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

  ngAfterViewInit() {
    if (!this.gs.isBlank(this.hbl_houseno_field))
      this.hbl_houseno_field.nativeElement.focus();
  }

  LoadCombo() {

    // if (this.gs.BRANCH_REGION == "USA") {
    //   this.TelexRlsList = [{ "name": "YES" }
    //     , { "name": "NO - REQUIRED" }
    //     , { "name": "NO - RECEIVED" }];
    // } else {
    //   this.TelexRlsList = [{ "name": "YES" }, { "name": "NO" }];
    // }

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
    if (this.mode == 'ADD') {
      this.record = <Tbl_cargo_imp_housem>{};
      this.descrecords = <Tbl_cargo_imp_desc[]>[];
      this.pkid = this.gs.getGuid();
      this.LoadMasterData();
    }
    if (this.mode == 'EDIT') {
      this.GetRecord();
    }
  }

  init() {
    this.record.hbl_pkid = this.pkid;
    this.record.hbl_mbl_id = this.parentid;
    this.record.mbl_no = '';
    this.record.mbl_cfno = '';
    this.record.mbl_refno = '';
    this.record.hbl_houseno = '';
    this.record.hbl_date = '';
    this.record.hbl_bltype = '';
    this.record.hbl_frt_status = '';
    this.record.hbl_it_no = '';
    this.record.hbl_it_port = '';
    this.record.hbl_it_pcs = 0;
    this.record.hbl_it_wt = 0;
    this.record.hbl_it_date = '';
    this.record.hbl_it_no2 = '';
    this.record.hbl_it_port2 = '';
    this.record.hbl_it_pcs2 = 0
    this.record.hbl_it_wt2 = 0;
    this.record.hbl_it_date2 = '';
    this.record.hbl_it_no3 = '';
    this.record.hbl_it_port3 = '';
    this.record.hbl_it_pcs3 = 0;
    this.record.hbl_it_wt3 = 0;
    this.record.hbl_it_date3 = '';
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
    this.record.hbl_agent_id = '';
    this.record.hbl_agent_name = '';
    this.record.hbl_agent_code = '';
    this.record.hbl_cha_id = '';
    this.record.hbl_cha_name = '';
    this.record.hbl_cha_code = '';
    this.record.hbl_cha_attn = '';
    this.record.hbl_cha_tel = '';
    this.record.hbl_cha_fax = '';
    this.record.hbl_commodity = '';
    this.record.hbl_uom = '';
    this.record.hbl_packages = 0;
    this.record.hbl_weight = 0;
    this.record.hbl_lbs = 0;
    this.record.hbl_cbm = 0;
    this.record.hbl_cft = 0;
    this.record.hbl_chwt = 0;
    this.record.hbl_chwt_lbs = 0;
    this.record.hbl_pcs = 0;
    this.record.hbl_pono = '';
    this.record.hbl_place_final = '';
    this.record.hbl_plf_eta = '';
    this.record.hbl_remark1 = '';
    this.record.hbl_remark2 = '';
    this.record.hbl_remark3 = '';
    this.record.hbl_salesman_id = '';
    this.record.hbl_salesman_code = '';
    this.record.hbl_salesman_name = '';
    this.record.hbl_handled_id = '';
    this.record.hbl_handled_code = '';
    this.record.hbl_handled_name = '';
    this.record.hbl_handled_email = '';
    this.record.rec_created_by = '';
    this.record.rec_created_date = '';
    this.record.rec_created_email = '';
    this.record.hbl_liner_code = '';
    this.record.hbl_liner_name = '';
    this.record.hbl_vessel = '';
    this.record.hbl_careof_id = '';
    this.record.hbl_careof_name = '';
    this.record.hbl_pickup_date = '';
    this.record.mbl_lock = '';
    this.record.mbl_unlock_date = '';
    this.record.mbl_ref_date = '';
    this.record.hbl_boeno = '';
    this.record.hbl_shipment_stage = '';
    this.record.hbl_is_itshipment = false;
    this.record.hbl_paid_status = '';
    this.record.hbl_cargo_release_status = '';
    this.record.hbl_is_pl = false;
    this.record.hbl_is_ci = false;
    this.record.hbl_is_carr_an = false;
    this.record.hbl_custom_reles_status = '';
    this.record.hbl_is_delivery = '';
    this.record.hbl_lfd_date = '';
    this.record.hbl_paid_remarks = '';
    this.record.hbl_delivery_date = '';


    // this.initDesc();
    this.record.rec_created_by = this.gs.user_code;
    this.record.rec_created_date = this.gs.defaultValues.today;
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
      this.record.mbl_no = this.mblrecord.mbl_no;
      this.record.hbl_vessel = this.mblrecord.mbl_vessel;
      this.record.hbl_handled_id = this.mblrecord.mbl_handled_id;
      this.record.hbl_handled_name = this.mblrecord.mbl_handled_name;
      this.record.hbl_shipment_stage = this.mblrecord.mbl_shipment_stage;
      this.record.hbl_salesman_id = this.mblrecord.mbl_salesman_id;
      this.record.hbl_salesman_name = this.mblrecord.mbl_salesman_name;

      if (!this.gs.isBlank(this.hbl_houseno_field))
        this.hbl_houseno_field.nativeElement.focus();
    }
  }

  GetRecord() {

    this.errorMessage = [];
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;

    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.record = <Tbl_cargo_imp_housem>response.record;
        this.descrecords = <Tbl_cargo_imp_desc[]>response.descrecords;
        this.mode = 'EDIT';
        this.is_locked = this.gs.IsShipmentClosed("AIR IMPORT", this.record.mbl_ref_date, this.record.mbl_lock, this.record.mbl_unlock_date);

        this.initDesc();
        if (!this.gs.isBlank(this.hbl_houseno_field))
          this.hbl_houseno_field.nativeElement.focus();
      }, error => {
        this.errorMessage.push(this.gs.getError(error));
      });
  }
  private initDesc() {

  }

  LoadMasterData() {
    this.errorMessage = [];
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.parentid;
    this.mainService.LoadMasterData(SearchData)
      .subscribe(response => {
        this.mblrecord = <Tbl_cargo_imp_masterm>response.record;
        this.is_locked = this.gs.IsShipmentClosed("AIR IMPORT", this.record.mbl_ref_date, this.record.mbl_lock, this.record.mbl_unlock_date);
        this.init();

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
          // if (stype == 'HBL')
          //   this.hbl_houseno_field.nativeElement.focus();
        }
      }, error => {
        this.errorMessage.push(this.gs.getError(error));
      });

  }


  Save() {

    if (!this.Allvalid())
      return;

    //this.SaveDescList();
    const saveRecord = <vm_tbl_cargo_imp_housem>{};
    saveRecord.record = this.record;
    saveRecord.desc = this.descrecords;
    saveRecord.mode = this.mode;
    saveRecord.userinfo = this.gs.UserInfo;

    this.mainService.Save(saveRecord)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage.push(response.error);
          alert(this.errorMessage[0]);
        }
        else {
          if (this.mode == "ADD" && response.code != '')
            this.record.mbl_refno = response.code;
          this.mode = 'EDIT';
          if (this.origin === "airimp-house-page")
            this.mainService.RefreshList(this.record);
          this.errorMessage.push('Save Complete');
          // alert(this.errorMessage[0]);
        }
      }, error => {
        this.errorMessage.push(this.gs.getError(error));
        alert(this.errorMessage[0]);
      });
  }

  private FindTotalWeight() {

  }

  private Allvalid(): boolean {

    var bRet = true;
    this.errorMessage = [];

    if (this.gs.isBlank(this.parentid)) {
      bRet = false;
      this.errorMessage.push("Invalid MBL ID");
    }

    if (this.gs.isBlank(this.record.hbl_houseno)) {
      bRet = false;
      this.errorMessage.push("House BL# cannot be blank");
    }

    if (!this.shipment_stage_field.nativeElement.disabled) {
      if (this.gs.isBlank(this.record.hbl_shipment_stage)) {
        bRet = false;
        this.errorMessage.push("Shipment Stage cannot be blank");
      }
    }

    if (this.gs.isBlank(this.record.hbl_shipper_id)) {
      bRet = false;
      this.errorMessage.push("Shipper Code can't be blank");
    }
    if (this.gs.isBlank(this.record.hbl_shipper_add1)) {
      bRet = false;
      this.errorMessage.push("Shipper Address can't be blank");
    }
    if (this.gs.isBlank(this.record.hbl_consignee_code)) {
      bRet = false;
      this.errorMessage.push("Consignee Code can't be blank");

    }
    if (this.gs.isBlank(this.record.hbl_consignee_add1)) {
      bRet = false;
      this.errorMessage.push("Consignee Address can't be blank");
    }

    if (this.gs.BRANCH_REGION == "USA")
      if (this.gs.isBlank(this.record.hbl_location_id)) {
        bRet = false;
        this.errorMessage.push("Location Details cannot be blank");
      }
    if (this.gs.isBlank(this.record.hbl_agent_id)) {
      bRet = false;
      this.errorMessage.push("Agent can't be blank");
    }

    if (this.gs.isBlank(this.record.hbl_place_final)) {
      bRet = false;
      this.errorMessage.push("Final Destination can't be blank");
    }
    if (this.gs.isBlank(this.record.hbl_plf_eta)) {
      bRet = false;
      this.errorMessage.push("Final date can't be blank");
    }



    if (this.gs.isZero(this.record.hbl_packages)) {
      bRet = false;
      this.errorMessage.push("No. of packages can't be blank");
    }
    if (this.gs.isBlank(this.record.hbl_uom)) {
      bRet = false;
      this.errorMessage.push("Unit of packages can't be blank");
    }
    if (this.gs.isZero(this.record.hbl_weight)) {
      bRet = false;
      this.errorMessage.push("Weight can't be blank");
    }
    if (this.gs.isZero(this.record.hbl_chwt)) {
      bRet = false;
      this.errorMessage.push("CH. Weight can't be blank");
    }


    if (this.gs.BRANCH_REGION == "USA") {
      if (this.gs.isZero(this.record.hbl_lbs)) {
        bRet = false;
        this.errorMessage.push("LBS can't be blank");
      }
      if (this.gs.isZero(this.record.hbl_chwt_lbs)) {
        bRet = false;
        this.errorMessage.push("CH.WT / LBS can't be blank");
      }
    }

    if (this.gs.OPTIONAL_DESCRIPTION == "N") {
      if (this.gs.isBlank(this.record.hbl_commodity)) {
        bRet = false;
        this.errorMessage.push("Goods description can't be blank");
      }
    }

    if (this.gs.isBlank(this.record.hbl_frt_status)) {
      bRet = false;
      this.errorMessage.push("Freight Status can't be blank");
    }

    if (this.gs.isBlank(this.record.hbl_bltype)) {
      bRet = false;
      this.errorMessage.push("Nomination Type can't be blank");
    }


    //decimal iWt = 0;

    if (this.gs.isBlank(this.record.hbl_handled_id)) {
      bRet = false;
      this.errorMessage.push("Handled By cannot be blank");
    }
    /*
    if (Txt_Salesman.TxtLovBox.Text.Trim().Length <= 0)
    {
        bRet = false;
        MessageBox.Show("Sales By can't be blank", "Save", MessageBoxButton.OK);
        Txt_Salesman.Focus();
        return bRet;
    }
    */
    if (!bRet)
      alert('Error While Saving');

    return bRet;
  }


  Close() {
    this.location.back();
  }



  LovSelected(_Record: SearchTable) {

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
        this.gs.ShowAccAlert(this.record.hbl_shipper_id);
      }
      if (!this.gs.isBlank(this.hbl_shipper_name_field))
        this.hbl_shipper_name_field.focus();
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

      if (_Record.col9 == "Y") {
        this.gs.ShowAccAlert(this.record.hbl_consignee_id);
      }
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
      if (!this.gs.isBlank(this.hbl_location_name_field))
        this.hbl_location_name_field.focus();
    }



    if (_Record.controlname == "AGENT") {
      this.record.hbl_agent_id = _Record.id;
      this.record.hbl_agent_code = _Record.code;
      this.record.hbl_agent_name = _Record.name;
      if (!this.gs.isBlank(this.hbl_cha_code_field))
        this.hbl_cha_code_field.Focus();
    }


    if (_Record.controlname == "CHA") {
      this.record.hbl_cha_id = _Record.id;
      this.record.hbl_cha_code = _Record.code;
      this.record.hbl_cha_name = _Record.name;
      if (_Record.col8 != "")
        this.record.hbl_cha_name = _Record.name;
      this.record.hbl_cha_attn = _Record.col5;
      this.record.hbl_cha_tel = _Record.col6;
      this.record.hbl_cha_fax = _Record.col7;
      if (!this.gs.isBlank(this.hbl_cha_name_field))
        this.hbl_cha_name_field.focus();
    }

    if (_Record.controlname == "HANDLEDBY") {
      this.record.hbl_handled_id = _Record.id;
      this.record.hbl_handled_name = _Record.name;
      if (!this.gs.isBlank(this.hbl_salesman_name_field))
        this.hbl_salesman_name_field.Focus();
    }
    if (_Record.controlname == "SALESMAN") {
      this.record.hbl_salesman_id = _Record.id;
      this.record.hbl_salesman_name = _Record.name;
      if (!this.gs.isBlank(this.hbl_lfd_date_field))
        this.hbl_lfd_date_field.Focus();
    }

    if (_Record.controlname == "CARE-OF") {
      this.record.hbl_careof_id = _Record.id;
      this.record.hbl_careof_name = _Record.name;
      if (!this.gs.isBlank(this.hbl_place_final_field))
        this.hbl_place_final_field.focus();
    }

  }

  OnChange(field: string) {
    if (field == 'hbl_frt_status') {

    }
    if (field == 'hbl_telex_released') {

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

  onBlur(field: string) {
    switch (field) {

      case 'hbl_houseno': {
        this.record.hbl_houseno = this.record.hbl_houseno.toUpperCase();
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

    }
  }


  BtnNavigation(action: string) {

    switch (action) {
      case 'CUSTOMSHOLD': {
        let prm = {
          menuid: this.gs.MENU_SI_HOUSE_US_CUSTOM_HOLD,
          pkid: this.pkid,
          is_locked: this.is_locked,
          origin: 'seaimp-House-page',
        };
        this.gs.Naviagete('Silver.SeaImport/USCustomsHoldPage', JSON.stringify(prm));
        break;
      }
      case 'CARGOPICKUP': {
        let prm = {
          menuid: this.gs.MENU_AI_HOUSE_DELIVERY_ORDER,
          pkid: this.pkid,
          is_locked: this.is_locked,
          origin: 'airimp-House-page',
        };
        this.gs.Naviagete('Silver.AirImport.Trans/AirCargoPickupPage', JSON.stringify(prm));
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
          menuid: this.gs.MENU_AI_SHIPMENT_MOVEMENT,
          refno: "REF : " + this.record.mbl_refno + "  HBL : " + this.record.hbl_houseno,
          pkid: this.pkid,
          origin: 'airimp-House-page',
          oprgrp: 'AIR IMPORT',
          parentType: 'AIRIMP-SHIP',
          paramType: 'SHIP-MOVE-STATUS',
          hideTracking: 'Y',
          is_locked: this.is_locked
        };
        this.gs.Naviagete('Silver.Other.Trans/TrackingPage', JSON.stringify(prm));
        break;
      }
      case 'ARRIVAL-NOTICE': {
        this.report_title = 'ARRIVAL NOTICE';
        this.report_url = '/api/AirImport/House/GetArrivalNotice';
        this.report_searchdata = this.gs.UserInfo;
        this.report_searchdata.pkid = this.pkid;
        this.report_searchdata.type = 'ARRIVAL-NOTICE';
        this.report_menuid = this.gs.MENU_AI_HOUSE_ARRIVAL_NOTICE;
        this.tab = 'report';
        break;
      }
      case 'FREIGHT-INVOICE': {
        this.report_title = 'ARRIVAL NOTICE INVOICE';
        this.report_url = '/api/AirImport/House/GetArrivalNotice';
        this.report_searchdata = this.gs.UserInfo;
        this.report_searchdata.pkid = this.pkid;
        this.report_searchdata.type = 'FREIGHT-INVOICE';
        this.report_menuid = this.gs.MENU_AI_HOUSE_ARRIVAL_NOTICE;
        this.tab = 'report';
        break;
      }
      case 'RELEASE-ORDER': {
        this.report_title = 'RELEASE ORDER';
        this.report_url = '/api/AirImport/House/GetReleaseOrder';
        this.report_searchdata = this.gs.UserInfo;
        this.report_searchdata.pkid = this.pkid;
        this.report_menuid = this.gs.MENU_AI_HOUSE_RELEASE_ORDER;
        this.tab = 'report';
        break;
      }
      case 'AUTHORITY-ENTRY': {
        this.report_title = 'AUTHORITY TO MAKE ENTRY';
        this.report_url = '/api/AirImport/House/GetAuthorityEntry';
        this.report_searchdata = this.gs.UserInfo;
        this.report_searchdata.pkid = this.pkid;
        this.report_menuid = this.gs.MENU_AI_HOUSE_AUTH_MAKE_ENTRY;
        this.tab = 'report';
        break;
      }
      case 'NOT-RELEASE-LETTER': {
        this.report_title = 'NOT RELEASE LETTER';
        this.report_url = '/api/AirImport/House/GetShipmentNotRelease';
        this.report_searchdata = this.gs.UserInfo;
        this.report_searchdata.pkid = this.pkid;
        this.report_menuid = this.gs.MENU_AI_HOUSE_NOT_RELEASE_LETTER;
        this.tab = 'report';
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
    else if (_type == "Chwt2Lbs")
      this.record.hbl_chwt_lbs = this.gs.Convert_Weight("KG2LBS", this.record.hbl_chwt, 3);
    else if (_type == "Lbs2Chwt")
      this.record.hbl_chwt = this.gs.Convert_Weight("LBS2KG", this.record.hbl_chwt_lbs, 3);
  }

  AddHouse() {

  }
  ShowCntrMovement() {
  }


  ISFUpload() {

  }

  OHBLUpload() {

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
          this.hbl_consignee_name_field.focus();
      }, error => {
        this.errorMessage.push(this.gs.getError(error));
      });
  }

}
