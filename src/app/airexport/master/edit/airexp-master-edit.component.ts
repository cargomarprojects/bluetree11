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


  record: Tbl_cargo_exp_masterm = <Tbl_cargo_exp_masterm>{};
  hrecords: Tbl_cargo_exp_housem[] = [];
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
        this.hrecords = <Tbl_cargo_exp_housem[]>response.hrecords;
        this.record.mbl_direct_bool = this.record.mbl_direct === "Y" ? true : false;
        this.record.mbl_3rdparty_bool = this.record.mbl_3rdparty === "Y" ? true : false;
        this.mode = 'EDIT';
        this.is_locked = this.gs.IsShipmentClosed("AIR EXPORT", this.record.mbl_ref_date, this.record.mbl_lock, this.record.mbl_unlock_date);
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
          this.errorMessage.push('Save Complete');
          // alert(this.errorMessage);
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

    if (!this.IsValidAWB(this.record.mbl_no)) {
      bRet = false;
      this.errorMessage.push("Invalid Master BL#");
    }

    if (!bRet)
      alert('Error While Saving');
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
    this.location.back();
  }

  LovSelected(_Record: SearchTable) {

    if (_Record.controlname == "AGENT") {
      this.record.mbl_agent_id = _Record.id;
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

  BtnNavigation(action: string, attachmodal: any = null) {

    switch (action) {
      case 'ARAP': {
        let prm = {
          menuid: this.gs.MENU_AE_MASTER_ARAP,
          mbl_pkid: this.pkid,
          mbl_refno: this.record.mbl_refno,
          mbl_type: 'AI',
          origin: 'airexp-master-page',
        };
        this.gs.Naviagete('Silver.USAccounts.Trans/InvoicePage', JSON.stringify(prm));
        break;
      }
      case 'PROFITREPORT': {
        let prm = {
          menuid: this.gs.MENU_AE_MASTER_PROFIT_REPORT,
          mbl_pkid: this.pkid,
          mbl_refno: this.record.mbl_refno,
          mbl_type: 'AE',
          origin: 'airexp-master-page',
        };
        this.gs.Naviagete('Silver.USAccounts.Trans/ProfitReportPage', JSON.stringify(prm));
        break;
      }
      case 'HOUSE': {
        let prm = {
          menuid: this.gs.MENU_AE_HOUSE,
          parentid: this.pkid,
          pkid: this.hbl_pkid,
          refno: this.record.mbl_refno,
          type: 'AIR EXPORT',
          origin: 'airexp-master-page',
          mode: this.hbl_mode
        };
        this.gs.Naviagete('Silver.AirExport.Trans/AirExpHouseEditPage', JSON.stringify(prm));
        break;
      }

      case 'PAYMENT-REQUEST': {
        let prm = {
          menuid: this.gs.MENU_AE_PAYMENT_REQUEST,
          cp_master_id: this.pkid,
          cp_source: 'AIR-MASTER',
          cp_mode: 'AIR EXPORT',
          cp_ref_no: this.record.mbl_refno,
          is_locked: this.is_locked,
          origin: 'airexp-master-page'
        };
        this.gs.Naviagete('Silver.BusinessModule/PaymentRequestPage', JSON.stringify(prm));
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
          menuid: this.gs.MENU_AE_MESSENGER_SLIP,
          mbl_pkid: this.pkid,
          mbl_mode: 'AIR EXPORT',
          mbl_refno: this.record.mbl_refno,
          is_locked: this.is_locked,
          origin: 'airexp-master-page'
        };
        this.gs.Naviagete('Silver.Other.Trans/MessengerSlipList', JSON.stringify(prm));
        break;
      }
      case 'FOLLOWUP': {
        let prm = {
          menuid: this.gs.MENU_AE_MASTER,
          master_id: this.pkid,
          master_refno: this.record.mbl_refno,
          master_refdate: this.record.mbl_ref_date,
          is_locked: this.is_locked,
          origin: 'airexp-master-page'
        };
        this.gs.Naviagete('Silver.BusinessModule/FollowUpPage', JSON.stringify(prm));
        break;
      }
      case 'REQUEST-APPROVAL': {
        let prm = {
          menuid: this.gs.MENU_AE_MASTER_REQUEST_APPROVAL,
          mbl_pkid: this.pkid,
          mbl_refno: this.record.mbl_refno,
          doc_type: 'AIR EXPORT',
          req_type: 'REQUEST',
          is_locked: this.is_locked,
          origin: 'airexp-master-page'
        };
        this.gs.Naviagete('Silver.Other.Trans/ApprovedPageList', JSON.stringify(prm));
        break;
      }
      case 'INERNALMEMO': {
        let prm = {
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
        this.gs.Naviagete('Silver.Other.Trans/TrackingPage', JSON.stringify(prm));
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
          menuid: this.gs.MENU_AE_MASTER_PRINT_MAWB,
          pkid: this.pkid,
          is_locked: this.is_locked,
          origin: 'airexp-master-page',
        };
        this.gs.Naviagete('Silver.AirExport.Trans/MawbPage', JSON.stringify(prm));
        break;
      }

      case 'MANIFESTPAGE': {
        let prm = {
          menuid: this.gs.MENU_AE_MASTER_MANIFEST,
          pkid: this.pkid,
          mbl_no: this.record.mbl_no,
          mbl_refno: this.record.mbl_refno,
          is_locked: this.is_locked,
          origin: 'airexp-master-page',
        };
        this.gs.Naviagete('Silver.AirExport.Trans/ManifestPage', JSON.stringify(prm));
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

}
