import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/services/global.service';

import { OthGeneralExpenseService } from '../../services/oth-generalexpense.service';
import { User_Menu } from '../../../core/models/menum';
import { Tbl_cargo_general, Tbl_cargo_container, vm_tbl_cargo_general } from '../../models/tbl_cargo_general';
import { SearchTable } from '../../../shared/models/searchtable';
import { strictEqual } from 'assert';
import { Tbl_cargo_obl_released } from '../../models/tbl_cargo_obl_released';
//EDIT-AJITH-06-09-2021
//EDIT-AJITH-19-11-2021

@Component({
  selector: 'app-oth-generalexpense-edit',
  templateUrl: './oth-generalexpense-edit.component.html'
})
export class OthGeneralExpenseEditComponent implements OnInit {

  //   @ViewChild('mbl_no') mbl_no_field: ElementRef;
  //   @ViewChild('mbl_liner_bookingno') mbl_liner_bookingno_field: ElementRef;

  record: Tbl_cargo_general = <Tbl_cargo_general>{};
  HouseList: Tbl_cargo_obl_released[] = [];

  // 24-05-2019 Created By Joy  

  pkid: string;
  menuid: string;

  mode: string;
  FALockStatus: string = "";
  errorMessage: string[] = [];

  closeCaption: string = 'Return';

  title: string;
  isAdmin: boolean;
  CanArAp: boolean = false;
  CanProfitReport: boolean = false;
  CanPayroll: boolean = false;
  CanPaymentRequest: boolean = false;

  cmbList = {};
  EXPTYPE: string = "";
  MblStatusList: any[] = [];
  BlStatusList: any[] = [];

  refnoDisabled: boolean = false;
  refnoMaxLength: Number = 8;
  refnoFormat: string = 'Format -  GEYYYYMM'
  is_locked: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: OthGeneralExpenseService,
  ) { }

  ngOnInit() {
    this.gs.checkAppVersion();
    if (this.route.snapshot.queryParams.parameter == null) {
      this.pkid = this.route.snapshot.queryParams.pkid;
      this.menuid = this.route.snapshot.queryParams.menuid;
      this.mode = this.route.snapshot.queryParams.mode;
      this.EXPTYPE = this.route.snapshot.queryParams.exptype;
    } else {
      const options = JSON.parse(this.route.snapshot.queryParams.parameter);
      this.pkid = options.pkid;
      this.menuid = options.menuid;
      this.mode = options.mode;
      this.EXPTYPE = options.exptype;
    }
    this.closeCaption = 'Return';
    this.initPage();
    this.actionHandler();
  }

  private initPage() {

    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.refnoFormat = "Format - " + this.EXPTYPE.trim() + "YYYYMM";
    this.refnoMaxLength = 8;
    this.refnoDisabled = false;
    if (this.EXPTYPE.trim() == "PS" || this.EXPTYPE.trim() == "FA") {
      this.refnoFormat = "";
      this.refnoMaxLength = 15;
      if (this.EXPTYPE.trim() == "FA")
        this.refnoDisabled = true;
    }
    this.SetUserRights();
    this.errorMessage = [];
    this.LoadCombo();
  }

  SetUserRights() {

    this.CanProfitReport = false;
    if (this.gs.screenExists(this.gs.MENU_GENERAL_EXPENSE_PROFIT_REPORT) && this.EXPTYPE.trim() == "GE")
      this.CanProfitReport = true;
    if (this.gs.screenExists(this.gs.MENU_PAYROLL_EXPENSE_PROFIT_REPORT) && this.EXPTYPE.trim() == "PR")
      this.CanProfitReport = true;
    if (this.gs.screenExists(this.gs.MENU_1099_EXPENSE_PROFIT_REPORT) && this.EXPTYPE.trim() == "CM")
      this.CanProfitReport = true;
    if (this.gs.screenExists(this.gs.MENU_INTERNAL_PAYMENT_SETTLEMENT_PROFIT_REPORT) && this.EXPTYPE.trim() == "PS")
      this.CanProfitReport = true;
    if (this.gs.screenExists(this.gs.MENU_FILE_ADJUSTMENT_PROFIT_REPORT) && this.EXPTYPE.trim() == "FA")
      this.CanProfitReport = true;

    this.CanArAp = false;
    if (this.gs.screenExists(this.gs.MENU_GENERAL_EXPENSE_ARAP) && this.EXPTYPE.trim() == "GE")
      this.CanArAp = true;
    if (this.gs.screenExists(this.gs.MENU_PAYROLL_EXPENSE_ARAP) && this.EXPTYPE.trim() == "PR")
      this.CanArAp = true;
    if (this.gs.screenExists(this.gs.MENU_1099_EXPENSE_ARAP) && this.EXPTYPE.trim() == "CM")
      this.CanArAp = true;
    if (this.gs.screenExists(this.gs.MENU_INTERNAL_PAYMENT_SETTLEMENT_ARAP) && this.EXPTYPE.trim() == "PS")
      this.CanArAp = true;
    if (this.gs.screenExists(this.gs.MENU_FILE_ADJUSTMENT_ARAP) && this.EXPTYPE.trim() == "FA")
      this.CanArAp = true;

    this.CanPaymentRequest = false;
    if (this.gs.screenExists(this.gs.MENU_FA_PAYMENT_REQUEST) && this.EXPTYPE.trim() == "FA")
      this.CanPaymentRequest = true;

    this.CanPayroll = false;
    if (this.gs.PAYROLL_ENABLED == "Y") {
      if (this.gs.screenExists(this.gs.MENU_PAYROLL_EXPENSE_ARAP) && this.EXPTYPE.trim() == "PR")
        this.CanPayroll = true;
    }
  }
  LoadCombo() {

    // if (this.gs.company_name == "MOTHERLINES INC USA") {
    //   this.MblStatusList = [{ "name": "NIL" }
    //     , { "name": "OMBL WITH ACCOUNTING" }, { "name": "OMBL SENT TO CARRIER" }
    //     , { "name": "OMBL WITH LAX OFFICE" }, { "name": "OMBL SENT BY LAX OFFICE" }, { "name": "OMBL WITH NYC OFFICE" }
    //     , { "name": "OMBL SENT BY NYC OFFICE" }];
    // } else {
    //   this.MblStatusList = [{ "name": "NIL" }, { "name": "OMBL WITH OPERATION" },
    //   { "name": "OMBL WITH ACCOUNTING" }, { "name": "OMBL SENT TO CARRIER" }];
    // }

    // this.BlStatusList = [{ "name": "NIL" }
    //   , { "name": "PENDING SEAWAY" }, { "name": "SEAWAY BILL" }
    //   , { "name": "PENDING TELEX RELEASED" }, { "name": "TELEX RELEASED" }];
  }

  NewRecord() {
    this.mode = 'ADD'
    this.actionHandler();
  }

  actionHandler() {
    this.errorMessage = [];
    if (this.mode == 'ADD') {
      this.record = <Tbl_cargo_general>{};
      // this.records = <Tbl_cargo_container[]>[];
      this.pkid = this.gs.getGuid();
      this.init();
    }
    if (this.mode == 'EDIT') {
      this.GetRecord();
    }
  }

  init() {
    this.record.mbl_pkid = this.pkid;
    this.record.mbl_refno = '';
    this.record.mbl_ref_date = this.gs.defaultValues.today;
    this.record.mbl_remarks = '';
    this.record.mbl_cargo_loc_id = '';
    this.record.mbl_cargo_loc_name = '';
    this.record.mbl_devan_loc_id = '';
    this.record.mbl_devan_loc_name = '';
    this.record.rec_created_by = this.gs.user_code;
    this.record.rec_created_date = this.gs.defaultValues.today;
  }

  GetRecord() {

    this.errorMessage = [];
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;

    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.record = <Tbl_cargo_general>response.record;
        this.mode = 'EDIT';
        let sOPr_Mode: string = "ADMIN";
        if (this.EXPTYPE.trim() == "FA")
          sOPr_Mode = "OTHERS";
        this.is_locked = this.gs.IsShipmentClosed(sOPr_Mode, this.record.mbl_ref_date, this.record.mbl_lock, this.record.mbl_unlock_date);
        this.HouseList = <Tbl_cargo_obl_released[]>[];
        if (!this.gs.isBlank(this.record.mbl_devan_loc_id)) {
          var rec = <Tbl_cargo_obl_released>{};
          rec.obl_mbl_id = this.record.mbl_cargo_loc_id;
          rec.obl_hbl_id = this.record.mbl_devan_loc_id;
          rec.obl_houseno = this.record.mbl_devan_loc_name;
          this.HouseList.push(rec);
        }

      }, error => {
        this.errorMessage.push(this.gs.getError(error));
      });
  }

  CheckData() {
    /*
        if (Lib.IsShipmentClosed("SEA EXPORT", (DateTime)ParentRec.mbl_ref_date, ParentRec.mbl_lock,ParentRec.mbl_unlock_date))
        {
            is_locked = true;
            LBL_LOCK.Content = "LOCKED";
            CmdSave.IsEnabled = false;
            CmdCopyCntr.IsEnabled = false;
        }
        else
            LBL_LOCK.Content = "UNLOCKED";
    
    */
  }


  IsBLDupliation(no: string) {

    if (this.gs.isBlank(no))
      return;
    this.errorMessage = [];
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;
    SearchData.blno = no;
    SearchData.stype = this.EXPTYPE;
    SearchData.company_code = this.gs.company_code;
    SearchData.branch_code = this.gs.branch_code;
    SearchData.mode = this.mode;

    this.mainService.Isblnoduplication(SearchData)
      .subscribe(response => {
        if (response.retvalue) {
          this.errorMessage.push(response.retstring);
          alert(this.errorMessage);
        }
      }, error => {
        this.errorMessage.push(this.gs.getError(error));
      });

  }


  GetFALockDetails(orgrefno: string) {
    this.FALockStatus = "";
    if (this.gs.isBlank(orgrefno) || this.EXPTYPE != 'FA')
      return;
    if (this.mode != "ADD")
      return;

    this.errorMessage = [];
    var SearchData = this.gs.UserInfo;
    SearchData.orgrefno = orgrefno;
    this.mainService.GetFALockDetails(SearchData)
      .subscribe(response => {
        if (response.retvalue) {

          if (response.RefnoFA.trim().length > 0) {

            this.FALockStatus = response.RefnoFA;
            if (response.IsLockRefnoFA) {
              this.FALockStatus += " (LOCKED)";
              // CmdSave.IsEnabled = true;
            }
            else {
              this.FALockStatus += " (UNLOCKED)";
              // CmdSave.IsEnabled = false;
            }
          }

        }
      }, error => {
        this.errorMessage.push(this.gs.getError(error));
      });

  }

  GetHouseDetails(orgrefno: string) {
    this.FALockStatus = "";
    if (this.EXPTYPE != 'FA')
      return;

    if (this.gs.isBlank(orgrefno)) {
      this.errorMessage.push("Master Reference# Cannot be blank");
      return;
    }

    this.record.mbl_cargo_loc_id = '';
    this.errorMessage = [];
    var SearchData = this.gs.UserInfo;
    SearchData.company_code = this.gs.company_code;
    SearchData.branch_code = this.gs.branch_code;
    SearchData.orgrefno = orgrefno;
    this.mainService.GetHouseDetails(SearchData)
      .subscribe(response => {
        this.HouseList = <Tbl_cargo_obl_released[]>response.list;
        this.HouseList.forEach(rec => {
          if (this.gs.isBlank(this.record.mbl_devan_loc_id)) //first house to assign default
            this.record.mbl_devan_loc_id = rec.obl_hbl_id;
          if (!this.gs.isBlank(rec.obl_mbl_id))
            this.record.mbl_cargo_loc_id = rec.obl_mbl_id;
        });

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
    this.SaveParent();

    const saveRecord = <vm_tbl_cargo_general>{};
    saveRecord.record = this.record;
    saveRecord.mode = this.mode;
    saveRecord.userinfo = this.gs.UserInfo;
    saveRecord.operationmode = this.EXPTYPE
    this.mainService.Save(saveRecord)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage.push(response.error);
          alert(this.errorMessage);
        }
        else {
          if (this.mode == "ADD" && response.code != '' && this.EXPTYPE.trim() == "FA")
            this.record.mbl_refno = response.code;
          this.mode = 'EDIT';

          let parameter = {
            appid: this.gs.appid,
            menuid: this.menuid,
            pkid: this.pkid,
            exptype: this.EXPTYPE,
            origin: 'oth-generalexp-edit-page',
            mode: 'EDIT'
          };
          this.location.replaceState('Silver.Other.Trans/OthGeneralExpenseEditPage', this.gs.getUrlParameter(parameter));

          this.mainService.RefreshList(this.record);
          // this.errorMessage.push('Save Complete');
          alert('Save Complete');
        }
      }, error => {
        this.errorMessage.push(this.gs.getError(error));
        alert(this.errorMessage);
      });
  }


  private SaveParent() {
    if (this.mode == "ADD") {
      this.record.rec_created_id = this.gs.user_pkid;
    }
    this.record.rec_created_date = this.gs.defaultValues.today;

    if (!this.gs.isBlank(this.record.mbl_devan_loc_id) && this.HouseList != null) {
      var REC = this.HouseList.find(rec => rec.obl_hbl_id == this.record.mbl_devan_loc_id);
      if (REC != null) {
        this.record.mbl_devan_loc_name = REC.obl_houseno;
      }
    }

  }

  private Allvalid(): boolean {

    var bRet = true;
    this.errorMessage = [];
    if (this.gs.isBlank(this.record.mbl_ref_date)) {
      this.errorMessage.push("Ref Date cannot be blank");
      bRet = false;
    }

    if (this.gs.isBlank(this.record.mbl_refno) && this.EXPTYPE != 'FA') {
      this.errorMessage.push("Ref Number cannot be blank");
      bRet = false;
    }

    if (this.EXPTYPE.trim() == "FA" && this.gs.isBlank(this.record.mbl_cargo_loc_name)) {
      this.errorMessage.push("Master Reference Number cannot be blank");
      bRet = false;
    }

    if (this.EXPTYPE.trim() == "GE" || this.EXPTYPE.trim() == "CM" || this.EXPTYPE.trim() == "PR") {
      this.record.mbl_refno = this.record.mbl_refno.trim();
      let RefNo = this.record.mbl_refno;
      if (RefNo.length != 8) {

        this.errorMessage.push("RefNo Should be at least 8 Characters");
        bRet = false;
      }
      if (RefNo.substring(0, 2) != this.EXPTYPE.trim()) {
        this.errorMessage.push("RefNo Should start with " + this.EXPTYPE.trim());
        bRet = false;
      }
    }


    if (!bRet)
      alert(this.errorMessage);

    return bRet;
  }


  Close() {
    let prm = {
      appid: this.gs.appid,
      id: this.mainService.menuid,
      menuid: this.mainService.menuid,
      menu_param: this.mainService.param_type,
      origin: 'oth-generalexp-edit-page',
      rnd: this.gs.getRandomInt()
    };
    this.gs.AutoReloadReturn(prm);
  }

  LovSelected(_Record: SearchTable) {

    //   if (_Record.controlname == "AGENT") {
    //     this.record.mbl_agent_id = _Record.id;
    //     this.record.mbl_agent_name = _Record.name;
    //   }

    // Container
    // if (_Record.controlname == "CONTAINER TYPE") {
    //   this.records.forEach(rec => {
    //     if (rec.cntr_pkid == _Record.uid) {
    //       rec.cntr_type = _Record.code;
    //     }
    //   });
    // }
  }

  onFocusout(field: string) {

    switch (field) {
      case 'mbl_cargo_loc_name': {
        this.GetFALockDetails(this.record.mbl_cargo_loc_name);//mbl_cargo_loc_name refer Mbl_NO
        break;
      }
      case 'mbl_refno': {

        this.IsBLDupliation(this.record.mbl_refno);
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
      case 'mbl_cargo_loc_name': {
        this.record.mbl_cargo_loc_name = this.record.mbl_cargo_loc_name.toUpperCase();
        break;
      }
    }
  }


  BtnNavigation2(action: string, _type: string, attachmodal: any = null) {
    if (action == "ARAP") {
      let sid = this.gs.MENU_GENERAL_EXPENSE_ARAP;
      if (this.EXPTYPE.trim() == "PR")
        sid = this.gs.MENU_PAYROLL_EXPENSE_ARAP;
      if (this.EXPTYPE.trim() == "CM")
        sid = this.gs.MENU_1099_EXPENSE_ARAP;
      if (this.EXPTYPE.trim() == "PS")
        sid = this.gs.MENU_INTERNAL_PAYMENT_SETTLEMENT_ARAP;
      if (this.EXPTYPE.trim() == "FA")
        sid = this.gs.MENU_FILE_ADJUSTMENT_ARAP;

      if (_type == "L")
        return '/Silver.USAccounts.Trans/InvoicePage';
      if (_type == 'P')
        return {
          appid: this.gs.appid,
          menuid: sid,
          mbl_pkid: this.pkid,
          mbl_refno: this.record.mbl_refno,
          mbl_type: this.EXPTYPE,
          origin: 'other-generalexpense-page',
        };
    } else if (action == "PROFITREPORT") {
      let sid = this.gs.MENU_GENERAL_EXPENSE_PROFIT_REPORT;
      if (this.EXPTYPE.trim() == "PR")
        sid = this.gs.MENU_PAYROLL_EXPENSE_PROFIT_REPORT;
      if (this.EXPTYPE.trim() == "CM")
        sid = this.gs.MENU_1099_EXPENSE_PROFIT_REPORT;
      if (this.EXPTYPE.trim() == "PS")
        sid = this.gs.MENU_INTERNAL_PAYMENT_SETTLEMENT_PROFIT_REPORT;
      if (this.EXPTYPE.trim() == "FA")
        sid = this.gs.MENU_FILE_ADJUSTMENT_PROFIT_REPORT;

      if (_type == "L")
        return '/Silver.USAccounts.Trans/ProfitReportPage';
      if (_type == 'P')
        return {
          appid: this.gs.appid,
          menuid: sid,
          mbl_pkid: this.pkid,
          mbl_refno: this.record.mbl_refno,
          mbl_type: this.EXPTYPE,
          origin: 'other-generalexpense-page',
        };
    } else if (action == "PAYROLLDET") {
      let sid = this.gs.MENU_GENERAL_EXPENSE_ARAP;
      if (this.EXPTYPE.trim() == "PR")
        sid = this.gs.MENU_PAYROLL_EXPENSE_ARAP;

      if (_type == "L")
        return '/Silver.Other.Trans/PayrollPage';
      if (_type == 'P')
        return {
          appid: this.gs.appid,
          menuid: sid,
          mbl_pkid: this.pkid,
          mbl_refno: this.record.mbl_refno,
          mbl_type: this.EXPTYPE,
          origin: 'other-generalexpense-page',
        };
    }else if (action == "PAYMENT-REQUEST") {
      if (_type == "L")
        return '/Silver.BusinessModule/PaymentRequestPage';
      if (_type == 'P')
        return {
          appid: this.gs.appid,
          menuid: this.gs.MENU_FA_PAYMENT_REQUEST,
          cp_master_id: this.pkid,
          cp_source: 'GE',
          cp_mode: 'FA',
          cp_ref_no: this.record.mbl_refno,
          is_locked: this.is_locked,
          origin: 'other-generalexpense-page'
        };
    }
  }



  BtnNavigation(action: string) {

    switch (action) {
      // case 'DELIVERY-ORDER': {
      //   let prm = {
      //     menuid: this.gs.MENU_OT_OPERATION_DELIVERY_ORDER,
      //     parentid: this.pkid,
      //     pickCategory:'OTHERS',
      //     is_locked: false,
      //     origin: 'other-general-page'
      //   };
      //   this.gs.Naviagete('Silver.Other.Trans/DeliveryOrderList', JSON.stringify(prm));
      //   break;
      // }

      case 'ARAP': {

        let sid = this.gs.MENU_GENERAL_EXPENSE_ARAP;
        if (this.EXPTYPE.trim() == "PR")
          sid = this.gs.MENU_PAYROLL_EXPENSE_ARAP;
        if (this.EXPTYPE.trim() == "CM")
          sid = this.gs.MENU_1099_EXPENSE_ARAP;
        if (this.EXPTYPE.trim() == "PS")
          sid = this.gs.MENU_INTERNAL_PAYMENT_SETTLEMENT_ARAP;
        if (this.EXPTYPE.trim() == "FA")
          sid = this.gs.MENU_FILE_ADJUSTMENT_ARAP;

        let prm = {
          appid: this.gs.appid,
          menuid: sid,
          mbl_pkid: this.pkid,
          mbl_refno: this.record.mbl_refno,
          mbl_type: this.EXPTYPE,
          origin: 'other-generalexpense-page',
        };
        this.gs.Naviagete2('Silver.USAccounts.Trans/InvoicePage', prm);
        break;

      }
      case 'PROFITREPORT': {
        let sid = this.gs.MENU_GENERAL_EXPENSE_PROFIT_REPORT;
        if (this.EXPTYPE.trim() == "PR")
          sid = this.gs.MENU_PAYROLL_EXPENSE_PROFIT_REPORT;
        if (this.EXPTYPE.trim() == "CM")
          sid = this.gs.MENU_1099_EXPENSE_PROFIT_REPORT;
        if (this.EXPTYPE.trim() == "PS")
          sid = this.gs.MENU_INTERNAL_PAYMENT_SETTLEMENT_PROFIT_REPORT;
        if (this.EXPTYPE.trim() == "FA")
          sid = this.gs.MENU_FILE_ADJUSTMENT_PROFIT_REPORT;

        let prm = {
          appid: this.gs.appid,
          menuid: sid,
          mbl_pkid: this.pkid,
          mbl_refno: this.record.mbl_refno,
          mbl_type: this.EXPTYPE,
          origin: 'other-generalexpense-page',
        };
        this.gs.Naviagete2('Silver.USAccounts.Trans/ProfitReportPage', prm);
        break;

      }
      case 'PAYROLLDET': {
        let sid = this.gs.MENU_GENERAL_EXPENSE_ARAP;
        if (this.EXPTYPE.trim() == "PR")
          sid = this.gs.MENU_PAYROLL_EXPENSE_ARAP;

        let prm = {
          appid: this.gs.appid,
          menuid: sid,
          mbl_pkid: this.pkid,
          mbl_refno: this.record.mbl_refno,
          mbl_type: this.EXPTYPE,
          origin: 'other-generalexpense-page',
        };
        this.gs.Naviagete2('Silver.Other.Trans/PayrollPage', prm);
        break;

      }

    }
  }


}
