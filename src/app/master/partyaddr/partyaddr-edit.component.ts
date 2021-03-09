import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { PartyAddrService } from '../services/partyaddr.service';
import { User_Menu } from '../../core/models/menum';
import { Tbl_Mast_Addressm, vm_Tbl_Mast_Addressm } from '../models/Tbl_Mast_Addressm';
import { SearchTable } from '../../shared/models/searchtable';
import { strictEqual } from 'assert';

@Component({
  selector: 'app-partyaddr-edit',
  templateUrl: './partyaddr-edit.component.html'
})
export class PartyAddrEditComponent implements OnInit {

  //@ViewChild('mbl_no') mbl_no_field: ElementRef;
  record: Tbl_Mast_Addressm = <Tbl_Mast_Addressm>{};
  // 15-07-2019 Created By Ajith  

  menuid: string;
  parentid: string;

  pkid: string;
  mode: string;
  title: string = '';
  isAdmin: boolean;
  errorMessage: string;
  selectedRowIndex: number = -1;
  is_locked: boolean = false;
  lblSave: string = "Save";
  party_name: string;
  checkAddress: string = "Use this address while printing";
  SetAddressToLine: string = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: PartyAddrService
  ) { }

  ngOnInit() {
    const options = JSON.parse(this.route.snapshot.queryParams.parameter);
    this.menuid = options.menuid;
    this.parentid = options.parentid;
    this.pkid = options.pkid;
    this.mode = options.mode;
    this.party_name = options.party_name;

    this.initPage();
    this.actionHandler();
  }

  private initPage() {
    this.title = 'Address Details';
    if (this.gs.BRANCH_REGION == "USA")
      this.checkAddress = "Use this address while printing check.";
    else
      this.checkAddress = "Use this address while printing cheque.";
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.errorMessage = '';
    this.LoadCombo();
  }

  LoadCombo() {
  }

  actionHandler() {
    this.errorMessage = '';
    if (this.mode == 'ADD') {
      this.pkid = this.gs.getGuid();
      this.record = <Tbl_Mast_Addressm>{};
      this.InitRecord();
    }
    if (this.mode == 'EDIT')
      this.GetRecord();
  }

  init() {
  }

  GetRecord() {
    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.mode = "EDIT";
        this.record = <Tbl_Mast_Addressm>response.record;
        this.record.add_is_chk_address_b = (this.record.add_is_chk_address == "Y") ? true : false;

      }, error => {
        this.errorMessage = this.gs.getError(error);
      });
  }

  OnChange(field: string) {
    // if (field == 'cmbNotes') {
    //   this.record.cf_remarks = this.cmbNotes;
    // }
    // if (field == 'cf_assigned_id') {
    //   var REC = this.UserList.find(rec => rec.id == this.record.cf_assigned_id);
    //   if (REC != null) {
    //     this.record.cf_assigned_code = REC.code;
    //     this.record.cf_assigned_name = REC.name;
    //   }
    // }
  }

  onBlur(field: string, _rec: Tbl_Mast_Addressm = null) {
    switch (field) {
      //   case 'remarks': {
      //     _rec.cf_remarks = _rec.cf_remarks.toUpperCase();
      //     break;
      //   }

    }
  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "COUNTRY") {
      this.record.add_country_id = _Record.id;
      this.record.add_country_name = _Record.name;
    }
  }

  SetRowIndex(_indx: number) {
    this.selectedRowIndex = _indx;
  }


  InitRecord() {
    this.record.add_pkid = this.pkid;
    this.record.add_parent_id = this.parentid;
    this.record.add_type = 'PARTYS';
    this.record.add_address1 = '';
    this.record.add_address2 = '';
    this.record.add_address3 = '';
    this.record.add_location = '';
    this.record.add_state = '';
    this.record.add_pincode = '';
    this.record.add_contact = '';
    this.record.add_email = '';
    this.record.add_web = '';
    this.record.add_tel = '';
    this.record.add_mobile = '';
    this.record.add_fax = '';
    this.record.add_country_id = '';
    this.record.add_country_name = '';
    this.record.add_is_chk_address = "N";
    this.record.add_check_name = '';
    this.record.add_is_chk_address_b = false;
  }

  NewRecord() {
    this.mode = "ADD";
    this.actionHandler();
  }


  Save() {

    if (!this.Allvalid())
      return;

    this.record.add_is_chk_address = this.record.add_is_chk_address_b ? 'Y' : 'N';
    this.record.add_parent_id = this.parentid;
    this.record.add_type = 'PARTYS';

    const saveRecord = <vm_Tbl_Mast_Addressm>{};
    saveRecord.userinfo = this.gs.UserInfo;
    saveRecord.record = this.record;
    saveRecord.pkid = this.pkid;
    saveRecord.mode = this.mode;

    this.mainService.Save(saveRecord)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage = response.error;
          alert(this.errorMessage);
        }
        else {
            this.mode = "EDIT"
            this.errorMessage = 'Save Complete';
           // alert(this.errorMessage);
        }
      }, error => {
        this.errorMessage = this.gs.getError(error);
        alert(this.errorMessage);
      });
  }

  Allvalid(): boolean {

    var bRet = true;
    this.errorMessage = "";
    if (this.gs.isBlank(this.record.add_address1)) {
      bRet = false;
      this.errorMessage = "Address cannot be empty";
      alert(this.errorMessage);
      return bRet;
    }

    if (this.gs.isBlank(this.record.add_country_id)||this.gs.isBlank(this.record.add_country_name)) {
      bRet = false;
      this.errorMessage = "Country cannot be empty";
      alert(this.errorMessage);
      return bRet;
    }

    return bRet;
  }


  Close() {
    this.location.back();
  }

  SetAddress() {
    if (this.gs.isBlank(this.record.add_address2))
      this.SetAddressToLine = "Line2";
    else if (this.gs.isBlank(this.record.add_address3))
      this.SetAddressToLine = "Line3";
    else
      this.SetAddressToLine = "";
    this.GetAddress2();
  }

  GetAddress2() {
    let str: string = "";
    let str1: string = "";
    let str2: string = "";
    let str3: string = "";

    str1 = this.record.add_location;
    str2 = this.record.add_state;
    if (str2 != "" && this.record.add_state.trim().length > 0)
      str2 += " ";
    str2 += this.record.add_pincode;

    str3 = this.record.add_country_name;

    str = str1;
    if (str != "" && str2 != "")
      str += ", ";
    str += str2;
    if (str != "" && str3 != "")
      str += ", ";
    str += str3;

    str = str.trim();
    if (str.length > 60)
      str = str.substring(0, 60);

    if (this.SetAddressToLine == "Line2")
      this.record.add_address2 = str;
    else if (this.SetAddressToLine == "Line3")
      this.record.add_address3 = str;
  }

}
