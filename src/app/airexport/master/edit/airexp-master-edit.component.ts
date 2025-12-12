import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/services/global.service';

import { AirExpMasterService } from '../../services/airexp-master.service';
import { User_Menu } from '../../../core/models/menum';
import { Tbl_cargo_exp_masterm, Tbl_cargo_exp_housem, vm_tbl_cargo_exp_masterm } from '../../models/tbl_cargo_exp_masterm';
import { SearchTable } from '../../../shared/models/searchtable';
// import { isNumber } from 'util';
// import { flatMap } from 'rxjs/operators';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateComponent } from '../../../shared/date/date.component';
import { AutoComplete2Component } from '../../../shared/autocomplete2/autocomplete2.component';
import { AccAlertComponent } from '../../../shared/accalert/accalert.component';
import { Table_Cargo_Remarks } from '../../../shared/models/table_cargo_remarks';
//EDIT-AJITH-06-09-2021
//EDIT-AJITH-18-10-2021

@Component({
  selector: 'app-airexp-master-edit',
  templateUrl: './airexp-master-edit.component.html'
})
export class AirExpMasterEditComponent implements OnInit {

  @ViewChild('mbl_no') mbl_no_field: ElementRef;
  @ViewChild('_mbl_ref_date') mbl_ref_date_field: DateComponent;
  @ViewChild('_mbl_frt_status') mbl_frt_status_field: ElementRef;
  @ViewChild('_mbl_pol_etd') mbl_pol_etd_field: DateComponent;
  @ViewChild('_mbl_pod_eta') mbl_pod_eta_field: DateComponent;
  @ViewChild('_mbl_liner_name') mbl_liner_name_field: AutoComplete2Component;
  @ViewChild('_mbl_to_port1') mbl_to_port1_field: ElementRef;
  @ViewChild('_mbl_salesman_name') mbl_salesman_name_field: AutoComplete2Component;
  @ViewChild('_mbl_mawb_weight') mbl_mawb_weight_field: ElementRef;
  @ViewChild('_acc_alert') acc_alert_field: AccAlertComponent;

  record: Tbl_cargo_exp_masterm = <Tbl_cargo_exp_masterm>{};
  hrecords: Tbl_cargo_exp_housem[] = [];
  alertrecords: Table_Cargo_Remarks[] = [];
  /*
    01-07-2019 Created By Ajith  
  */
  tab: string = 'main';
  report_title: string = '';
  report_url: string = '';
  report_searchdata: any = {};
  report_menuid: string = '';

  attach_title: string = '';
  attach_parentid: string = '';
  attach_subid: string = '';
  attach_type: string = '';
  attach_typelist: any = {};
  attach_tablename: string = '';
  attach_tablepkcolumn: string = '';
  attach_refno: string = '';
  attach_customername: string = '';
  attach_updatecolumn: string = '';
  attach_viewonlysource: string = '';
  attach_viewonlyid: string = '';
  attach_filespath: string = '';
  attach_filespath2: string = '';

  private pkid: string = "";
  private menuid: string;
  private hbl_pkid: string = '';
  private hbl_mode: string = '';

  private mode: string;
  modal: any;
  //private errorMessage: string;
  private errorMessage: string[] = [];
  private closeCaption: string = 'Return';

  private title: string;
  private isAdmin: boolean;

  private cmbList = {};


  //IsLocked: boolean = false;
  is_locked: boolean = false;
  constructor(
    private modalconfig: NgbModalConfig,
    private modalservice: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: AirExpMasterService,
  ) {
    modalconfig.backdrop = 'static'; //true/false/static
    modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
  }

  ngOnInit() {
    this.gs.checkAppVersion();
    if (this.route.snapshot.queryParams.parameter == null) {
      this.pkid = this.route.snapshot.queryParams.pkid;
      this.menuid = this.route.snapshot.queryParams.menuid;
      this.mode = this.route.snapshot.queryParams.mode;
    } else {
      const options = JSON.parse(this.route.snapshot.queryParams.parameter);
      this.pkid = options.pkid;
      this.menuid = options.menuid;
      this.mode = options.mode;
    }
    this.closeCaption = 'Return';
    this.initPage();
    this.actionHandler();
  }

  private initPage() {

    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.errorMessage = [];
  }

  ngAfterViewInit() {
    if (!this.gs.isBlank(this.mbl_ref_date_field))
      this.mbl_ref_date_field.Focus();
  }

  NewRecord() {
    this.mode = 'ADD'
    this.actionHandler();
  }

  actionHandler() {
    this.errorMessage = [];
    this.is_locked = false;
    if (this.mode == 'ADD') {
      this.record = <Tbl_cargo_exp_masterm>{};
      this.hrecords = <Tbl_cargo_exp_housem[]>[];
      this.pkid = this.gs.getGuid();
      this.init();
    }
    if (this.mode == 'EDIT') {
      this.GetRecord();
    }
  }

  init() {
    this.record.mbl_pkid = this.pkid;
    this.record.rec_created_by = this.gs.user_code;
    this.record.rec_created_date = this.gs.defaultValues.today;
    this.record.mbl_prefix = this.gs.AIR_EXPORT_REFNO_PREFIX;
    this.record.mbl_startingno = this.gs.AIR_EXPORT_REFNO_STARTING_NO;
    if (this.gs.BRANCH_REGION == "USA")
      this.record.mbl_currency = "USD";
    else
      this.record.mbl_currency = "AED";
    this.record.mbl_no = '';
    this.record.mbl_refno = '';
    this.record.mbl_ref_date = this.gs.defaultValues.today;
    this.record.mbl_date = '';
    this.record.mbl_frt_status = '';
    this.record.mbl_liner_id = '';
    this.record.mbl_liner_name = '';
    this.record.mbl_liner_code = '';
    this.record.mbl_agent_id = '';
    this.record.mbl_agent_name = '';
    this.record.mbl_agent_code = '';
    this.record.mbl_pod_id = '';
    this.record.mbl_pod_code = '';
    this.record.mbl_pod_name = '';
    this.record.mbl_pod_cntry_code = '';
    this.record.mbl_pol_id = '';
    this.record.mbl_pol_code = '';
    this.record.mbl_pol_name = '';
    this.record.mbl_pol_cntry_code = '';
    this.record.mbl_liner_bookingno = '';
    this.record.mbl_direct = 'N';
    this.record.mbl_direct_bool = false;
    this.record.mbl_pol_etd = '';
    this.record.mbl_pod_eta = '';
    this.record.mbl_vessel = '';
    this.record.mbl_voyage = '';
    // this.record.mbl_currency = '';
    this.record.mbl_to_port1 = '';
    this.record.mbl_to_port2 = '';
    this.record.mbl_to_port3 = '';
    this.record.mbl_by_carrier1 = '';
    this.record.mbl_by_carrier2 = '';
    this.record.mbl_by_carrier3 = '';
    this.record.mbl_country_id = '';
    this.record.mbl_country_name = '';
    this.record.mbl_handled_id = '';
    this.record.mbl_handled_name = '';
    this.record.mbl_mawb_weight = 0;
    this.record.mbl_mawb_chwt = 0;
    if (this.gs.JOB_TYPE_AE.length > 0) {
      this.record.mbl_jobtype_id = this.gs.JOB_TYPE_AE[0].code;
      this.record.mbl_jobtype_name = this.gs.JOB_TYPE_AE[0].name;
    } else {
      this.record.mbl_jobtype_id = '';
      this.record.mbl_jobtype_name = '';
    }
    this.record.mbl_shipment_stage = 'NIL';
    this.record.mbl_salesman_id = '';
    this.record.mbl_salesman_name = '';
    this.record.mbl_3rdparty = 'N';
    this.record.mbl_3rdparty_bool = false;
    this.record.mbl_ismemo_attached = 'N';
    this.record.rec_files_attached = 'N';
    if (this.gs.JOB_TYPE_AE.length > 0) {
      // if (JobList.Count > 0)
      //     Cmb_JobType.SelectedIndex = 0;
    }
    if (!this.gs.isBlank(this.mbl_ref_date_field))
      this.mbl_ref_date_field.Focus();
  }

  GetRecord() {

    this.errorMessage = [];
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;

    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.record = <Tbl_cargo_exp_masterm>response.record;
        this.hrecords = (response.hrecords == undefined || response.hrecords == null) ? <Tbl_cargo_exp_housem[]>[] : <Tbl_cargo_exp_housem[]>response.hrecords;
        this.alertrecords = (response.alertrecords == undefined || response.alertrecords == null) ? <Table_Cargo_Remarks[]>[] : <Table_Cargo_Remarks[]>response.alertrecords;
        this.record.mbl_direct_bool = this.record.mbl_direct === "Y" ? true : false;
        this.record.mbl_3rdparty_bool = this.record.mbl_3rdparty === "Y" ? true : false;
        this.mode = 'EDIT';
        this.is_locked = this.gs.IsShipmentClosed("AIR EXPORT", this.record.mbl_ref_date, this.record.mbl_lock, this.record.mbl_unlock_date);

        if (!this.gs.isBlank(this.acc_alert_field)) {
            this.acc_alert_field.show(this.alertrecords);
        }
        // this.CheckData();
      }, error => {
        this.errorMessage.push(this.gs.getError(error));
      });
  }

  CheckData() {
    /*
        if (Lib.IsShipmentClosed("AIR EXPORT", (DateTime)ParentRec.mbl_ref_date, ParentRec.mbl_lock,ParentRec.mbl_unlock_date))
        {
            IsLocked = true;
            LBL_LOCK.Content = "LOCKED";
            CmdSave.IsEnabled = false;
            CmdCopyCntr.IsEnabled = false;
        }
        else
            LBL_LOCK.Content = "UNLOCKED";
    
    */
  }


  IsBLDupliation(stype: string, no: string) {

    if (this.gs.isBlank(no))
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
          alert(this.errorMessage);
          // alert(this.errorMessage);
          // if (stype == 'MBL')
          //   this.mbl_no_field.nativeElement.focus();
        }
      }, error => {
        this.errorMessage.push(this.gs.getError(error));
      });

  }

  Save() {

    if (!this.Allvalid())
      return;

    if (!confirm("Save")) {
      return;
    }

    this.record.mbl_direct = this.record.mbl_direct_bool ? 'Y' : 'N';
    this.record.mbl_3rdparty = this.record.mbl_3rdparty_bool ? 'Y' : 'N';

    const saveRecord = <vm_tbl_cargo_exp_masterm>{};
    saveRecord.record = this.record;
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

          let parameter = {
            appid: this.gs.appid,
            menuid: this.menuid,
            pkid: this.pkid,
            type: '',
            origin: 'airexp-master-edit-page',
            mode: 'EDIT'
          };
          this.location.replaceState('Silver.AirExport.Trans/AirExpMasterEditPage', this.gs.getUrlParameter(parameter));

          // this.errorMessage.push('Save Complete');
          alert('Save Complete');
          this.mainService.RefreshList(this.record);
        }
      }, error => {
        this.errorMessage.push(this.gs.getError(error));
        alert(this.errorMessage[0]);
      });
  }


  private Allvalid(): boolean {

    var bRet = true;

    this.errorMessage = [];
    if (this.gs.isBlank(this.record.mbl_ref_date)) {
      bRet = false;
      this.errorMessage.push("Ref Date cannot be blank");
    }

    if (this.gs.JOB_TYPE_AE.length > 0 && this.gs.isBlank(this.record.mbl_jobtype_id)) {
      bRet = false;
      this.errorMessage.push("Job Type cannot be blank");
    }

    if (this.gs.isBlank(this.record.mbl_shipment_stage)) {
      bRet = false;
      this.errorMessage.push("Shipment Stage cannot be blank");
    }
    if (this.gs.isBlank(this.record.mbl_no)) {
      bRet = false;
      this.errorMessage.push("Master BL# can't be blank");
    }

    if (this.gs.isBlank(this.record.mbl_agent_id)) {
      bRet = false;
      this.errorMessage.push("Master Agent cannot be blank");
    }
    if (this.gs.isBlank(this.record.mbl_liner_id)) {
      bRet = false;
      this.errorMessage.push("Carrier cannot be blank");

    }
    if (this.gs.isBlank(this.record.mbl_handled_id)) {
      bRet = false;
      this.errorMessage.push("A/N Handled By cannot be blank");
    }

    if (this.gs.isBlank(this.record.mbl_frt_status)) {
      bRet = false;
      this.errorMessage.push("Freight status cannot be blank");
    }

    if (this.gs.isBlank(this.record.mbl_pol_id)) {
      bRet = false;
      this.errorMessage.push("Port of Loading cannot be blank");
    }
    if (this.gs.isBlank(this.record.mbl_pol_etd)) {
      bRet = false;
      this.errorMessage.push("ETD cannot be blank");
    }
    if (this.gs.isBlank(this.record.mbl_pod_id)) {
      bRet = false;
      this.errorMessage.push("Port of Discharge cannot be blank");
    }
    if (this.gs.isBlank(this.record.mbl_pod_eta)) {
      bRet = false;
      this.errorMessage.push("ETA cannot be blank");

    }
    // if (this.record.mbl_pofd_id == "") {
    //   bRet = false;
    //   this.errorMessage = "Final Destination cannot be blank"
    //   return bRet;
    // }

    if (this.gs.isBlank(this.record.mbl_country_id)) {
      bRet = false;
      this.errorMessage.push("Country Cannot be blank");
    }
    if (this.gs.isBlank(this.record.mbl_currency)) {
      bRet = false;
      this.errorMessage.push("Currency cannot be blank");
    }

    if (this.gs.isZero(this.record.mbl_mawb_weight)) {
      bRet = false;
      this.errorMessage.push("Invalid Weight");
    }

    if (this.gs.isZero(this.record.mbl_mawb_chwt)) {
      bRet = false;
      this.errorMessage.push("Invalid Ch.Weight");
    }

    if (!this.gs.isBlank(this.record.mbl_no)) {
      if (!this.IsValidAWB(this.record.mbl_no)) {
        bRet = false;
        this.errorMessage.push("Invalid Master BL#");
      }
    }

    if (!bRet)
      alert(this.errorMessage);
    return bRet;
  }

  IsValidAWB(Awb: string) {
    let strnum: string = "0123456789";
    let i: number = 0;//"".indexOf(snum)<0
    let strChar: string = '';
    Awb = Awb.trim();
    if (Awb.length != 11)
      return false;
    for (i = 0; i < Awb.length; i++) {
      strChar = Awb.substr(i, 1);
      if (strnum.indexOf(strChar) < 0)
        return false;
    }
    return true;
  }

  Close() {
    let prm = {
      appid: this.gs.appid,
      id: this.gs.MENU_AE_MASTER,
      menuid: this.gs.MENU_AE_MASTER,
      menu_param: '',
      origin: 'airexp-master-edit-page',
      rnd: this.gs.getRandomInt()
    };
    this.gs.AutoReloadReturn(prm);
  }

  LovSelected(_Record: SearchTable) {

    if (_Record.controlname == "AGENT") {
      this.record.mbl_agent_id = _Record.id;
      this.record.mbl_agent_code = _Record.code;
      this.record.mbl_agent_name = _Record.name;
      if (!this.gs.isBlank(this.mbl_frt_status_field))
        this.mbl_frt_status_field.nativeElement.focus();
    }
    if (_Record.controlname == "CARRIER") {
      this.record.mbl_liner_id = _Record.id;
      this.record.mbl_liner_name = _Record.name;
      if (!this.gs.isBlank(this.mbl_to_port1_field))
        this.mbl_to_port1_field.nativeElement.focus();
    }
    if (_Record.controlname == "HANDLEDBY") {
      this.record.mbl_handled_id = _Record.id;
      this.record.mbl_handled_name = _Record.name;
      if (!this.gs.isBlank(this.mbl_salesman_name_field))
        this.mbl_salesman_name_field.Focus();
    }
    if (_Record.controlname == "SALESMAN") {
      this.record.mbl_salesman_id = _Record.id;
      this.record.mbl_salesman_name = _Record.name;
      if (!this.gs.isBlank(this.mbl_mawb_weight_field))
        this.mbl_mawb_weight_field.nativeElement.focus();
    }
    if (_Record.controlname == "POL") {
      this.record.mbl_pol_id = _Record.id;
      this.record.mbl_pol_name = _Record.name;
      if (!this.gs.isBlank(this.mbl_pol_etd_field))
        this.mbl_pol_etd_field.Focus();
    }

    if (_Record.controlname == "POD") {
      this.record.mbl_pod_id = _Record.id;
      this.record.mbl_pod_name = _Record.name;
      if (!this.gs.isBlank(this.mbl_pod_eta_field))
        this.mbl_pod_eta_field.Focus();
    }

    if (_Record.controlname == "COUNTRY") {
      this.record.mbl_country_id = _Record.id;
      this.record.mbl_country_name = _Record.name;
      if (!this.gs.isBlank(this.mbl_liner_name_field))
        this.mbl_liner_name_field.Focus();
    }

  }

  onFocusout(field: string) {

    switch (field) {
      case 'mbl_no': {
        this.IsBLDupliation('MBL', this.record.mbl_no);
        break;
      }
    }
  }


  onBlur(field: string) {
    switch (field) {
      case 'mbl_refno': {
        this.record.mbl_refno = this.record.mbl_refno.toUpperCase();
        break;
      }
      case 'mbl_no': {
        this.record.mbl_no = this.record.mbl_no.toUpperCase();
        break;
      }
      case 'mbl_liner_bookingno': {
        this.record.mbl_liner_bookingno = this.record.mbl_liner_bookingno.toUpperCase();
        break;
      }
      case 'mbl_vessel': {
        this.record.mbl_vessel = this.record.mbl_vessel.toUpperCase();
        break;
      }
      case 'mbl_voyage': {
        this.record.mbl_voyage = this.record.mbl_voyage.toUpperCase();
        break;
      }
      case 'mbl_to_port1': {
        this.record.mbl_to_port1 = this.record.mbl_to_port1.toUpperCase();
        break;
      }
      case 'mbl_by_carrier1': {
        this.record.mbl_by_carrier1 = this.record.mbl_by_carrier1.toUpperCase();
        break;
      }

      case 'mbl_to_port2': {
        this.record.mbl_to_port2 = this.record.mbl_to_port2.toUpperCase();
        break;
      }
      case 'mbl_by_carrier2': {
        this.record.mbl_by_carrier2 = this.record.mbl_by_carrier2.toUpperCase();
        break;
      }
      case 'mbl_to_port3': {
        this.record.mbl_to_port3 = this.record.mbl_to_port3.toUpperCase();
        break;
      }
      case 'mbl_by_carrier3': {
        this.record.mbl_by_carrier3 = this.record.mbl_by_carrier3.toUpperCase();
        break;
      }
      case 'mbl_mawb_weight': {
        this.record.mbl_mawb_weight = this.gs.roundNumber(this.record.mbl_mawb_weight, 3);
        break;
      }
      case 'mbl_mawb_chwt': {
        this.record.mbl_mawb_chwt = this.gs.roundNumber(this.record.mbl_mawb_chwt, 3);
        break;
      }
      case 'mbl_currency': {
        this.record.mbl_currency = this.record.mbl_currency.toUpperCase();
        break;
      }
    }
  }

  AddHouse() {
    if (!this.gs.canAdd(this.gs.MENU_AE_HOUSE)) {
      alert('Insufficient User Rights')
      return;
    }

    this.hbl_pkid = "";
    this.hbl_mode = "ADD";
    this.BtnNavigation('HOUSE')
  }

  EditHouse(_record: Tbl_cargo_exp_housem) {

    if (!this.gs.canEdit(this.gs.MENU_AE_HOUSE)) {
      alert('Insufficient User Rights')
      return;
    }

    this.hbl_pkid = _record.hbl_pkid;
    this.hbl_mode = "EDIT";
    this.BtnNavigation('HOUSE')
  }


  BtnNavigation2(action: string, _type: string, attachmodal: any = null) {
    if (action == "ARAP") {
      if (_type == "L")
        return '/Silver.USAccounts.Trans/InvoicePage';
      if (_type == 'P')
        return { appid: this.gs.appid, menuid: this.gs.MENU_AE_MASTER_ARAP, mbl_pkid: this.pkid, mbl_refno: this.record.mbl_refno, mbl_type: 'AE', origin: 'airexp-master-page' }
    } else if (action == "PROFITREPORT") {
      if (_type == "L")
        return '/Silver.USAccounts.Trans/ProfitReportPage';
      if (_type == 'P')
        return { appid: this.gs.appid, menuid: this.gs.MENU_AE_MASTER_PROFIT_REPORT, mbl_pkid: this.pkid, mbl_refno: this.record.mbl_refno, mbl_type: 'AE', origin: 'airexp-master-page' }
    } else if (action == "PAYMENT-REQUEST") {
      if (_type == "L")
        return '/Silver.BusinessModule/PaymentRequestPage';
      if (_type == 'P')
        return { appid: this.gs.appid, menuid: this.gs.MENU_AE_PAYMENT_REQUEST, cp_master_id: this.pkid, cp_source: 'AIR-MASTER', cp_mode: 'AIR EXPORT', cp_ref_no: this.record.mbl_refno, is_locked: this.is_locked, origin: 'airexp-master-page' }
    } else if (action == "MESSENGER-SLIP") {
      if (_type == "L")
        return '/Silver.Other.Trans/MessengerSlipList';
      if (_type == 'P')
        return { appid: this.gs.appid, menuid: this.gs.MENU_AE_MESSENGER_SLIP, mbl_pkid: this.pkid, mbl_mode: 'AIR EXPORT', mbl_refno: this.record.mbl_refno, is_locked: this.is_locked, origin: 'airexp-master-page' }
    } else if (action == "FOLLOWUP") {
      if (_type == "L")
        return '/Silver.BusinessModule/FollowUpPage';
      if (_type == 'P')
        return { appid: this.gs.appid, menuid: this.gs.MENU_AE_MASTER, master_id: this.pkid, master_refno: this.record.mbl_refno, master_refdate: this.record.mbl_ref_date, is_locked: this.is_locked, origin: 'airexp-master-page' }
    } else if (action == "REQUEST-APPROVAL") {
      if (_type == "L")
        return '/Silver.Other.Trans/ApprovedPageList';
      if (_type == 'P')
        return { appid: this.gs.appid, menuid: this.gs.MENU_AE_MASTER_REQUEST_APPROVAL, mbl_pkid: this.pkid, mbl_refno: this.record.mbl_refno, doc_type: 'AIR EXPORT', req_type: 'REQUEST', is_locked: this.is_locked, origin: 'airexp-master-page' }
    } else if (action == "INERNALMEMO") {
      if (_type == "L")
        return '/Silver.Other.Trans/TrackingPage';
      if (_type == 'P')
        return { appid: this.gs.appid, menuid: this.gs.MENU_AE_MASTER_INTERNAL_MEMO, refno: this.record.mbl_refno, pkid: this.pkid, origin: 'airexp-master-page', oprgrp: 'AIR EXPORT', parentType: 'AIREXP-CNTR', paramType: 'AIREXP-CNTR-MOVE-STATUS', hideTracking: 'Y', is_locked: this.is_locked, houseno: '' }
    } else if (action == "MAWBPAGE") {
      if (_type == "L")
        return '/Silver.AirExport.Trans/MawbPage';
      if (_type == 'P')
        return { appid: this.gs.appid, menuid: this.gs.MENU_AE_MASTER_PRINT_MAWB, pkid: this.pkid, is_locked: this.is_locked, origin: 'airexp-master-page', }
    } else if (action == "MANIFESTPAGE") {
      if (_type == "L")
        return '/Silver.AirExport.Trans/ManifestPage';
      if (_type == 'P')
        return { appid: this.gs.appid, menuid: this.gs.MENU_AE_MASTER_MANIFEST, pkid: this.pkid, mbl_no: this.record.mbl_no, mbl_refno: this.record.mbl_refno, is_locked: this.is_locked, origin: 'airexp-master-page' }
    }

  }




  BtnNavigation(action: string, attachmodal: any = null) {

    switch (action) {
      case 'ARAP': {
        let prm = {
          appid: this.gs.appid,
          menuid: this.gs.MENU_AE_MASTER_ARAP,
          mbl_pkid: this.pkid,
          mbl_refno: this.record.mbl_refno,
          mbl_type: 'AE',
          origin: 'airexp-master-page',
        };
        this.gs.Naviagete2('Silver.USAccounts.Trans/InvoicePage', prm);
        break;
      }
      case 'PROFITREPORT': {
        let prm = {
          appid: this.gs.appid,
          menuid: this.gs.MENU_AE_MASTER_PROFIT_REPORT,
          mbl_pkid: this.pkid,
          mbl_refno: this.record.mbl_refno,
          mbl_type: 'AE',
          origin: 'airexp-master-page',
        };
        this.gs.Naviagete2('Silver.USAccounts.Trans/ProfitReportPage', prm);
        break;
      }
      case 'HOUSE': {
        let prm = {
          appid: this.gs.appid,
          menuid: this.gs.MENU_AE_HOUSE,
          parentid: this.pkid,
          pkid: this.hbl_pkid,
          refno: this.record.mbl_refno,
          type: 'AIR EXPORT',
          origin: 'airexp-master-page',
          mode: this.hbl_mode
        };
        this.gs.Naviagete2('Silver.AirExport.Trans/AirExpHouseEditPage', prm);
        break;
      }

      case 'PAYMENT-REQUEST': {
        let prm = {
          appid: this.gs.appid,
          menuid: this.gs.MENU_AE_PAYMENT_REQUEST,
          cp_master_id: this.pkid,
          cp_source: 'AIR-MASTER',
          cp_mode: 'AIR EXPORT',
          cp_ref_no: this.record.mbl_refno,
          is_locked: this.is_locked,
          origin: 'airexp-master-page'
        };
        this.gs.Naviagete2('Silver.BusinessModule/PaymentRequestPage', prm);
        break;
      }
      case 'ATTACHMENT': {
        let TypeList: any[] = [];
        TypeList = [{ "code": "EMAIL", "name": "E-MAIL" }, { "code": "HOUSEBL", "name": "HOUSE B/L" }, { "code": "MASTER", "name": "MASTER" }, { "code": "PAYMENT SETTLEMENT", "name": "OTHERS" }];
        this.attach_title = 'Documents';
        this.attach_parentid = this.pkid;
        this.attach_subid = '';
        this.attach_type = 'PAYMENT SETTLEMENT';
        this.attach_typelist = TypeList;
        this.attach_tablename = 'cargo_masterm';
        this.attach_tablepkcolumn = 'mbl_pkid';
        this.attach_refno = this.record.mbl_refno;
        this.attach_customername = '';
        this.attach_updatecolumn = 'REC_FILES_ATTACHED';
        this.attach_viewonlysource = '';
        this.attach_viewonlyid = '';
        this.attach_filespath = '';
        this.attach_filespath2 = '';
        this.modal = this.modalservice.open(attachmodal, { centered: true });
        break;
      }
      case 'MESSENGER-SLIP': {
        let prm = {
          appid: this.gs.appid,
          menuid: this.gs.MENU_AE_MESSENGER_SLIP,
          mbl_pkid: this.pkid,
          mbl_mode: 'AIR EXPORT',
          mbl_refno: this.record.mbl_refno,
          is_locked: this.is_locked,
          origin: 'airexp-master-page'
        };
        this.gs.Naviagete2('Silver.Other.Trans/MessengerSlipList', prm);
        break;
      }
      case 'FOLLOWUP': {
        let prm = {
          appid: this.gs.appid,
          menuid: this.gs.MENU_AE_MASTER,
          master_id: this.pkid,
          master_refno: this.record.mbl_refno,
          master_refdate: this.record.mbl_ref_date,
          is_locked: this.is_locked,
          origin: 'airexp-master-page'
        };
        this.gs.Naviagete2('Silver.BusinessModule/FollowUpPage', prm);
        break;
      }
      case 'REQUEST-APPROVAL': {
        let prm = {
          appid: this.gs.appid,
          menuid: this.gs.MENU_AE_MASTER_REQUEST_APPROVAL,
          mbl_pkid: this.pkid,
          mbl_refno: this.record.mbl_refno,
          doc_type: 'AIR EXPORT',
          req_type: 'REQUEST',
          is_locked: this.is_locked,
          origin: 'airexp-master-page'
        };
        this.gs.Naviagete2('Silver.Other.Trans/ApprovedPageList', prm);
        break;
      }
      case 'INERNALMEMO': {
        let prm = {
          appid: this.gs.appid,
          menuid: this.gs.MENU_AE_MASTER_INTERNAL_MEMO,
          refno: "REF : " + this.record.mbl_refno,
          pkid: this.pkid,
          origin: 'airimp-master-page',
          oprgrp: 'AIR EXPORT',
          parentType: 'AIREXP-CNTR',
          paramType: 'AIREXP-CNTR-MOVE-STATUS',
          hideTracking: 'Y',
          is_locked: this.is_locked
        };
        this.gs.Naviagete2('Silver.Other.Trans/TrackingPage', prm);
        break;
      }
      // case 'POD': {
      //   this.report_title = 'POD';
      //   this.report_url = '/api/AirImport/Master/GetPODAirImpRpt';
      //   this.report_searchdata = this.gs.UserInfo;
      //   this.report_searchdata.pkid = this.pkid;
      //   this.report_menuid = this.gs.MENU_AI_MASTER_POD ;
      //   this.tab = 'report';
      //   break;
      // }

      case 'MAWBPAGE': {
        let prm = {
          appid: this.gs.appid,
          menuid: this.gs.MENU_AE_MASTER_PRINT_MAWB,
          pkid: this.pkid,
          is_locked: this.is_locked,
          origin: 'airexp-master-page',
        };
        this.gs.Naviagete2('Silver.AirExport.Trans/MawbPage', prm);
        break;
      }

      case 'MANIFESTPAGE': {
        let prm = {
          appid: this.gs.appid,
          menuid: this.gs.MENU_AE_MASTER_MANIFEST,
          pkid: this.pkid,
          mbl_no: this.record.mbl_no,
          mbl_refno: this.record.mbl_refno,
          is_locked: this.is_locked,
          origin: 'airexp-master-page',
        };
        this.gs.Naviagete2('Silver.AirExport.Trans/ManifestPage', prm);
        break;
      }
      case 'SHIP-LABEL-PRINT': {
        this.report_title = 'Shipment Label';
        this.report_menuid = this.gs.MENU_SHIPMENT_LABEL;
        this.report_url = '/api/Report/ShipmentLabelReport';
        this.report_searchdata = this.gs.UserInfo;
        this.report_searchdata.outputformat = 'PRINT';
        this.report_searchdata.pkid = this.gs.getGuid();
        this.report_searchdata.action = 'NEW';
        this.report_searchdata.MODE = 'AIR EXPORT';
        this.report_searchdata.MBL_PKID = this.pkid;
        this.tab = 'report';
        break;
      }
    }
  }

  callbackevent(event: any) {
    this.tab = 'main';
  }
  CloseModal() {
    this.modal.close();
  }

  getLink(_mode: string) {
    if (_mode == "LIST")
      return "/Silver.AirExport.Trans/AirExpMasterPage";
    else
      return "/Silver.AirExport.Trans/AirExpMasterEditPage";
  }

  getParam(_mode: string = "") {

    if (_mode == "LIST") {
      return {
        appid: this.gs.appid,
        id: this.gs.MENU_AE_MASTER,
        menuid: this.gs.MENU_AE_MASTER,
        menu_param: '',
        origin: 'airexp-master-page',
        rnd: this.gs.getRandomInt()
      };
    } else {
      return {
        appid: this.gs.appid,
        menuid: this.menuid,
        pkid: '',
        type: this.mainService.param_type,
        origin: 'airexp-master-page',
        mode: 'ADD',
        rnd: this.gs.getRandomInt()
      };
    }
  }

  DirectAgent() {
    if (!this.gs.isBlank(this.gs.DIRECT_AGENT_ID)) {
      if (this.record.mbl_direct_bool) {
        this.record.mbl_agent_name = this.gs.DIRECT_AGENT_NAME;
        this.record.mbl_agent_id = this.gs.DIRECT_AGENT_ID;
      } else {
        this.record.mbl_agent_name = '';
        this.record.mbl_agent_id = '';
      }
    }
  }

  DeleteHouseRow(_rec: Tbl_cargo_exp_housem) {
    this.errorMessage = [];
    if (this.gs.isBlank(_rec.hbl_pkid) || this.gs.isBlank(_rec.hbl_mbl_id)) {
      this.errorMessage.push("Cannot Delete, Reference Not Found");
      alert(this.errorMessage);
      return;
    }

    if (!confirm("DELETE " + _rec.hbl_houseno)) {
      return;
    }

    var SearchData = this.gs.UserInfo;
    SearchData.pkid = _rec.hbl_pkid;
    SearchData.mblid = _rec.hbl_mbl_id;
    SearchData.remarks = _rec.hbl_houseno;

    this.mainService.DeleteHouseRecord(SearchData)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage.push(response.error);
          alert(this.errorMessage);
        }
        else {
          this.hrecords.splice(this.hrecords.findIndex(rec => rec.hbl_pkid == _rec.hbl_pkid), 1);
        }
      }, error => {
        this.errorMessage.push(this.gs.getError(error));
        alert(this.errorMessage);
      });
  }

}
