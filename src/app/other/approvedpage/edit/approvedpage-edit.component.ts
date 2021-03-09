import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/services/global.service';
import { AutoComplete2Component } from '../../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../../shared/input/inputbox.component';
import { ApprovedPageService } from '../../../other/services/approvedpage.service';
import { User_Menu } from '../../../core/models/menum';
import { vm_tbl_cargo_approved, Tbl_Cargo_Approved, Tbl_Cargo_Approvedd } from '../../../other/models/tbl_cargo_approved';
import { SearchTable } from '../../../shared/models/searchtable';
import { strictEqual } from 'assert';
import { Table_Cargo_Payrequest } from 'src/app/businessmodule/models/table_cargo_payrequest';
import { DateComponent } from '../../../shared/date/date.component';

@Component({
  selector: 'app-approvedpage-edit',
  templateUrl: './approvedpage-edit.component.html'
})
export class ApprovedPageEditComponent implements OnInit {

  @ViewChild('is_drop') is_drop_field: ElementRef;
  // @ViewChild(' csdate') csdate_field: DateComponent;
  @ViewChild('to_name') to_name_field: InputBoxComponent;
  @ViewChild('deliver_to_name') deliver_to_name_field: InputBoxComponent;

  @ViewChild('_ca_type') ca_type_field: ElementRef;
  //@ViewChild('hbl_shipper_code') hbl_shipper_code_field: AutoComplete2Component;

  record: Tbl_Cargo_Approved = <Tbl_Cargo_Approved>{};
  detrecord: Tbl_Cargo_Approvedd = <Tbl_Cargo_Approvedd>{};
  hblrecords: Tbl_Cargo_Approved[] = [];
  invrecords: Tbl_Cargo_Approved[] = [];
  detrecords: Tbl_Cargo_Approvedd[] = [];

  Foregroundcolor_edit: string;
  mbl_pkid: string;
  mbl_refno: string;
  doc_type: string;
  req_type: string = "REQUEST";

  pkid: string;
  menuid: string;
  mode: string;
  errorMessage: string;
  closeCaption: string = 'Return';

  title: string;
  isAdmin: boolean;
  oprgrp: string = "GENERAL";
  rdBtnChkedValue: string = "";

  is_locked: boolean = false;
  RdbApproved: boolean = false;
  RdbNotApproved: boolean = false;
  tab: string = 'main';
  attach_pkid: string = "";
  attach_typelist: any = {};
  attach_type: string = "";
  attach_tablename: string = "";
  attach_tablepkcolumn: string = "";
  attach_refno: string = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: ApprovedPageService,
  ) {

  }

  ngOnInit() {
    if (this.route.snapshot.queryParams.parameter == null) {
      this.menuid = this.route.snapshot.queryParams.menuid;
      this.pkid = this.route.snapshot.queryParams.pkid;
      this.mbl_pkid = this.route.snapshot.queryParams.mbl_pkid;
      this.mbl_refno = this.route.snapshot.queryParams.mbl_refno;
      this.doc_type = this.route.snapshot.queryParams.doc_type;
      this.req_type = this.route.snapshot.queryParams.req_type;
      this.mode = this.route.snapshot.queryParams.mode;
      this.is_locked = this.route.snapshot.queryParams.is_locked;
    } else {
      const options = JSON.parse(this.route.snapshot.queryParams.parameter);
      this.menuid = options.menuid;
      this.pkid = options.pkid;
      this.mbl_pkid = options.mbl_pkid;
      this.mbl_refno = options.mbl_refno;
      this.doc_type = options.doc_type;
      this.req_type = options.req_type;
      this.mode = options.mode;
      this.is_locked = options.is_locked;
    }
    this.initPage();
    this.actionHandler();
  }

  private initPage() {
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.errorMessage = '';
    this.LoadCombo();
    this.GetHblInvList();
  }

  LoadCombo() {

  }

  NewRecord() {
    this.mode = 'ADD'
    this.actionHandler();
  }

  actionHandler() {
    this.errorMessage = '';
    if (this.mode == 'ADD') {
      this.record = <Tbl_Cargo_Approved>{};
      this.pkid = this.gs.getGuid();
      this.init();
    }
    if (this.mode == 'EDIT') {
      this.GetRecord();
    }
  }

  init() {

    this.record.ca_pkid = this.pkid;
    this.record.ca_date = this.gs.defaultValues.today;
    this.record.ca_user_name = this.gs.user_name;
    this.record.rec_created_date = this.gs.defaultValues.today;
    this.record.rec_created_by = this.gs.user_code;
    this.record.ca_is_approved = "N";
    this.record.ca_is_ar_issued = "N";
    this.record.ca_ref_id = this.mbl_pkid;
    this.record.ca_ref_no = this.mbl_refno;
    this.record.ca_type = "RELEASE WITHOUT OBL";
    this.record.ca_doc_type = this.doc_type;
    this.record.ca_is_ar_issued_bool = false;
    this.record.ca_req_no_str = '';
    this.invrecords.forEach(Rec => {
      Rec.ca_inv_selected = false;
    })
    this.hblrecords.forEach(Rec => {
      Rec.ca_hbl_selected = false;
    })
    // this.csdate_field.Focus();
    this.Foregroundcolor_edit = "white";
    if (!this.gs.isBlank(this.ca_type_field))
      this.ca_type_field.nativeElement.focus();
  }

  GetRecord() {

    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;

    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.record = <Tbl_Cargo_Approved>response.record;
        this.detrecords = <Tbl_Cargo_Approvedd[]>response.detrecords;
        this.mode = 'EDIT';
        if (this.hblrecords != null) {
          this.hblrecords.forEach(Rec => {
            if (this.record.ca_hbl_no === Rec.ca_hbl_no)
              Rec.ca_hbl_selected = true;
            else
              Rec.ca_hbl_selected = false;
          })
        }

        if (this.invrecords != null) {
          this.invrecords.forEach(Rec => {
            if (this.record.ca_inv_no === Rec.ca_inv_no)
              Rec.ca_inv_selected = true;
            else
              Rec.ca_inv_selected = false;
          })
        }

        this.record.ca_is_ar_issued_bool = this.record.ca_is_ar_issued == "Y" ? true : false;
        this.record.ca_req_no_str = this.record.ca_req_no.toString().padStart(6, '0');
        if (this.record.rec_files_attached == "Y")
          this.Foregroundcolor_edit = "red";
        else
          this.Foregroundcolor_edit = "white";

        // if (REQ_TYPE == "APPROVED")
        // Dispatcher.BeginInvoke(() => { RB_Approved.Focus(); });
        // else
        // Dispatcher.BeginInvoke(() => { Cmb_Type.Focus(); });

        //this.hbl_houseno_field.nativeElement.focus();
        if (!this.gs.isBlank(this.ca_type_field))
          this.ca_type_field.nativeElement.focus();

      }, error => {
        this.errorMessage = this.gs.getError(error);
      });
  }

  GetHblInvList() {
    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.mbl_pkid = this.mbl_pkid;
    this.mainService.GetHblInvList(SearchData)
      .subscribe(response => {
        this.hblrecords = <Tbl_Cargo_Approved[]>response.hblrecords;
        this.invrecords = <Tbl_Cargo_Approved[]>response.invrecords;

        if (this.hblrecords != null && this.record != null) {
          this.hblrecords.forEach(Rec => {
            if (this.record.ca_hbl_no === Rec.ca_hbl_no)
              Rec.ca_hbl_selected = true;
            else
              Rec.ca_hbl_selected = false;
          })
        }

        if (this.invrecords != null && this.record != null) {
          this.invrecords.forEach(Rec => {
            if (this.record.ca_inv_no === Rec.ca_inv_no)
              Rec.ca_inv_selected = true;
            else
              Rec.ca_inv_selected = false;
          })
        }
        if (!this.gs.isBlank(this.ca_type_field))
          this.ca_type_field.nativeElement.focus();
      }, error => {
        this.errorMessage = this.gs.getError(error);
      });
  }


  CheckData() {
    /*
        if (Lib.IsShipmentClosed("SEA EXPORT", (DateTime)ParentRec.mbl_ref_date, ParentRec.mbl_lock,ParentRec.mbl_unlock_date))
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

  Save() {

    if (!this.Allvalid())
      return;
    this.SaveParent();
    const saveRecord = <vm_tbl_cargo_approved>{};
    saveRecord.record = this.record;
    saveRecord.mode = this.mode;
    saveRecord.userinfo = this.gs.UserInfo;

    this.mainService.Save(saveRecord)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage = response.error;
          alert(this.errorMessage);
        }
        else {
          if (this.mode == "ADD" && response.code != '') {
            this.record.ca_req_no = response.code;
            this.record.ca_req_no_str = this.record.ca_req_no.toString().padStart(6, '0');
          }

          this.mode = 'EDIT';
          this.errorMessage = 'Save Complete';
          // alert(this.errorMessage);
        }
        //  this.csdate_field.Focus();
      }, error => {
        this.errorMessage = this.gs.getError(error);
        alert(this.errorMessage);
      });
  }

  private SaveParent() {
    this.record.ca_ref_id = this.mbl_pkid;
    this.record.ca_user_id = this.gs.user_pkid;
    this.record.ca_doc_type = this.doc_type;
    this.record.ca_mode = this.record.ca_doc_type;
    this.record.ca_is_ar_issued = this.record.ca_is_ar_issued_bool == true ? "Y" : "N";
  }

  private Allvalid(): boolean {

    var bRet = true;
    this.errorMessage = "";

    if (this.gs.isBlank(this.record.ca_type)) {
      bRet = false;
      this.errorMessage = "Type Cannot be blank";
      alert(this.errorMessage);
      // Cmb_Type.Focus();
      return bRet;
    }

    if (this.gs.isBlank(this.record.ca_ref_no)) {
      bRet = false;
      this.errorMessage = "Reference # cannot be blank";
      alert(this.errorMessage);
      //Txt_refno.Focus();
      return bRet;
    }

    if (this.gs.isBlank(this.record.ca_ref_id)) {
      bRet = false;
      this.errorMessage = "Invalid Reference #";
      alert(this.errorMessage);
      // Txt_refno.Focus();
      return bRet;
    }

    if (this.record.ca_type == "RELEASE WITHOUT OBL" || this.record.ca_type == "RELEASE WITHOUT OBL & PAYMENT") {
      if (this.gs.isBlank(this.record.ca_hbl_no)) {
        bRet = false;
        this.errorMessage = "House # cannot be blank";
        alert(this.errorMessage);
        //Txt_House.Focus();
        return bRet;
      }
      if (this.gs.isBlank(this.record.ca_hbl_id)) {
        bRet = false;
        this.errorMessage = "Invalid House #";
        alert(this.errorMessage);
        // Txt_House.Focus();
        return bRet;
      }
    }

    if (this.record.ca_type == "RELEASE WITHOUT PAYMENT" || this.record.ca_type == "RELEASE WITHOUT OBL & PAYMENT") {
      if (this.gs.isBlank(this.record.ca_inv_no)) {
        if (this.record.ca_is_ar_issued_bool == false) {
          bRet = false;
          this.errorMessage = "Invoice # cannot be blank";
          alert(this.errorMessage);
          //Txt_invoice.Focus();
          return bRet;
        }
      }

      if (this.gs.isBlank(this.record.ca_inv_id)) {
        if (this.record.ca_is_ar_issued_bool == false) {
          bRet = false;
          this.errorMessage = "Invalid Invoice #";
          alert(this.errorMessage);
          //Txt_invoice.Focus();
          return bRet;
        }
      }
    }

    if (!this.gs.isBlank(this.record.ca_hbl_no) && this.gs.isBlank(this.record.ca_hbl_id)) {
      bRet = false;
      this.errorMessage = "Invalid House #";
      alert(this.errorMessage);
      // Txt_House.Focus();
      return bRet;
    }

    if (!this.gs.isBlank(this.record.ca_inv_no) && this.gs.isBlank(this.record.ca_inv_id)) {
      if (this.record.ca_is_ar_issued_bool == false) {
        bRet = false;
        this.errorMessage = "Invalid Invoice #";
        alert(this.errorMessage);
        //Txt_invoice.Focus();
        return bRet;
      }
    }

    return bRet;
  }


  Close() {
    this.location.back();
  }


  LovSelected(_Record: SearchTable) {

    // if (_Record.controlname == "TO-CODE") {
    //   this.record.cs_to_id = _Record.id;
    //   this.record.cs_to_code = _Record.code;
    //   this.record.cs_to_name = _Record.name;
    //   if (_Record.col8 != "")
    //     this.record.cs_to_name = _Record.col8;

    //   this.record.cs_to_tel = _Record.col6;
    //   this.record.cs_to_fax = _Record.col7;
    //   this.to_name_field.focus();
    // }

    // if (_Record.controlname == "FROM-CODE") {
    //   this.record.cs_from_id = _Record.id;
    //   this.record.cs_from_name = _Record.name;
    //   if (_Record.col8 != "")
    //     this.record.cs_from_name = _Record.col8;
    //   this.is_drop_field.nativeElement.focus();
    // }
    // if (_Record.controlname == "DELIVER-TO") {
    //   this.record.cs_deliver_to_id = _Record.id;
    //   this.record.cs_deliver_to_name = _Record.name;
    //   if (_Record.col8 != "")
    //     this.record.cs_deliver_to_name = _Record.col8;
    //   this.LoadDeliveryAddress();
    // }

  }

  OnChange(field: string) {
    if (field == 'hbl_frt_status') {
    }
  }

  onFocusout(field: string) {
    switch (field) {
      case 'mbl_liner_bookingno': {
        // this.IsBLDupliation('BOOKING', this.record.mbl_liner_bookingno);
        // break;
      }
    }
  }

  onBlur(field: string) {
    switch (field) {
      case 'ca_remarks': {
        this.record.ca_remarks = this.record.ca_remarks.toUpperCase();
        break;
      }

    }
  }


  BtnNavigation(action: string) {
    switch (action) {
      case 'ATTACHMENT': {
        let TypeList: any[] = [];
        TypeList = [{ "code": "APPROVAL REQUEST", "name": "APPROVAL REQUEST" }];
        this.attach_pkid = this.pkid;
        this.attach_type = 'APPROVAL REQUEST';
        this.attach_typelist = TypeList;
        this.attach_tablename = 'cargo_approved';
        this.attach_tablepkcolumn = 'ca_pkid';
        this.attach_refno = this.record.ca_req_no.toString();
        this.tab = 'attachment';
        break;
      }
    }
  }

  SelectHouse(_rec: Tbl_Cargo_Approved) {
    this.hblrecords.forEach(Rec => {
      if (Rec.ca_hbl_no != _rec.ca_hbl_no)
        Rec.ca_hbl_selected = false;
    })
    this.record.ca_hbl_no = _rec.ca_hbl_no;
    this.record.ca_hbl_id = _rec.ca_hbl_id;
    this.record.ca_consignee_id = _rec.ca_consignee_id;
    this.record.ca_consignee_name = _rec.ca_consignee_name;
  }

  SelectInvoice(_rec: Tbl_Cargo_Approved) {
    this.invrecords.forEach(Rec => {
      if (Rec.ca_inv_no != _rec.ca_inv_no)
        Rec.ca_inv_selected = false;
    })
    this.record.ca_inv_no = _rec.ca_inv_no;
    this.record.ca_inv_id = _rec.ca_inv_id;
    this.record.ca_customer_name = _rec.ca_customer_name;
  }
  rdBtnChecked(_select: string) {
    this.rdBtnChkedValue = _select;
  }

  SaveApproved() {
    this.SaveParentDet();

    if (!this.AllvalidDet())
      return;

    const saveRecord = <vm_tbl_cargo_approved>{};
    saveRecord.detrecord = this.detrecord;
    saveRecord.mode = 'ADD';
    saveRecord.userinfo = this.gs.UserInfo;

    this.mainService.Savedet(saveRecord)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage = response.error;
          alert(this.errorMessage);
        }
        else {
          if (this.detrecords == null || this.detrecords == undefined)
            this.detrecords = <Tbl_Cargo_Approvedd[]>[];
          this.detrecords.push(response.record);
          // this.errorMessage = 'Save Complete';
          // alert(this.errorMessage);
        }
        //  this.csdate_field.Focus();
      }, error => {
        this.errorMessage = this.gs.getError(error);
        alert(this.errorMessage);
      });
  }

  private SaveParentDet() {
    this.detrecord = <Tbl_Cargo_Approvedd>{};
    this.detrecord.cad_pkid = this.gs.getGuid();
    this.detrecord.cad_parent_id = this.pkid;
    this.detrecord.cad_approved_date = this.gs.defaultValues.today;
    this.detrecord.cad_approvedby_id = this.gs.user_pkid;
    this.detrecord.cad_approvedby_name = this.gs.user_name;
    this.detrecord.cad_is_approved = this.rdBtnChkedValue;
  }
  private AllvalidDet(): boolean {

    var bRet = true;
    this.errorMessage = "";

    if (this.gs.isBlank(this.detrecord.cad_parent_id) || this.gs.isBlank(this.detrecord.cad_approvedby_id)) {
      bRet = false;
      this.errorMessage = "Invalid ID.";
      alert(this.errorMessage);
      return bRet;
    }

    if (this.gs.isBlank(this.rdBtnChkedValue)) {
      bRet = false;
      this.errorMessage = "Please Select Approved or Not Approved.";
      alert(this.errorMessage);
      return bRet;
    }

    this.detrecords.forEach(Rec => {
      if (Rec.cad_approvedby_id == this.gs.user_pkid && Rec.cad_is_approved == this.rdBtnChkedValue) {
        bRet = false;
        this.errorMessage = "Duplicate Record";
        alert(this.errorMessage);
        // RB_Approved.Focus();
        return bRet;
      }
    })
    return bRet;
  }


  AttachRow(_rec: Tbl_Cargo_Approved) {

  }

  callbackevent() {
    this.tab = 'main';
  }

}
