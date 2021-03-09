import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { PartyLoginService } from '../services/partylogin.service';
import { User_Menu } from '../../core/models/menum';
import { Tbl_Party_Login, vm_Tbl_Party_Login } from '../models/Tbl_Party_Login';
import { SearchTable } from '../../shared/models/searchtable';
import { strictEqual } from 'assert';

@Component({
  selector: 'app-partylogin',
  templateUrl: './partylogin.component.html'
})
export class PartyLoginComponent implements OnInit {

  //@ViewChild('mbl_no') mbl_no_field: ElementRef;
  records: Tbl_Party_Login[] = [];
  record: Tbl_Party_Login = <Tbl_Party_Login>{};
  // 15-07-2019 Created By Ajith  

  menuid: string;
  parentid: string;
  partyCode: string;
  partyName: string;
  pkid: string;
  mode: string;
  title: string = '';
  isAdmin: boolean;
  errorMessage: string;
  selectedRowIndex: number = -1;
  is_locked: boolean = false;
  lblSave: string = "Save";
   
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: PartyLoginService
  ) { }

  ngOnInit() {
    const options = JSON.parse(this.route.snapshot.queryParams.parameter);
    this.menuid = options.menuid;
    this.parentid = options.parentid;
    this.partyCode = options.party_code;
    this.partyName = options.party_name;
    this.initPage();
    this.mode = "ADD";
    this.actionHandler();
    this.List('SCREEN');
  }

  private initPage() {
    this.title = 'Login Details';
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
      this.record = <Tbl_Party_Login>{};
      this.InitRecord();
    }
    if (this.mode == 'EDIT')
      this.GetRecord();
  }


  List(action: string = '') {
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.parentid;
    this.mainService.List(SearchData).subscribe(response => {
      this.records = response.list;
    }, error => {
      this.errorMessage = this.gs.getError(error)
    });
  }


  init() {
  }

  GetRecord() {
    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.lblSave = "Update";
        this.mode = "EDIT";
        this.record = <Tbl_Party_Login>response.record;
        this.record.plogin_locked_b = this.record.plogin_locked == "Y" ? true : false;
        this.record.plogin_isparent_b = this.record.plogin_isparent == "Y" ? true : false;

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

  onBlur(field: string, _rec: Tbl_Party_Login = null) {
    switch (field) {
      //   case 'remarks': {
      //     _rec.cf_remarks = _rec.cf_remarks.toUpperCase();
      //     break;
      //   }

    }
  }

  SetRowIndex(_indx: number) {
    this.selectedRowIndex = _indx;
  }


  InitRecord() {
    this.record.plogin_pkid = this.pkid;
    this.record.plogin_party_id = this.parentid;
    this.record.plogin_code = '';
    this.record.plogin_name = '';
    this.record.plogin_pwd = '';
    this.record.plogin_email = '';
    this.record.plogin_locked = 'N';
    this.record.plogin_category = 'AGENT';
    this.record.plogin_isparent = 'N';
    this.record.plogin_isparent_b = false;
    this.record.plogin_locked_b = false;
    this.lblSave = "Save";
    //Txtmemo.Focus();
  }

  NewRecord()
  {
    this.mode = "ADD";
    this.actionHandler();
  }
  EditRow(_rec: Tbl_Party_Login) {
    this.pkid = _rec.plogin_pkid.toString();
    this.mode = "EDIT";
    this.actionHandler();
  }

  Save() {

    if (!this.Allvalid())
      return;

    this.record.plogin_party_id = this.parentid;
    this.record.plogin_locked = this.record.plogin_locked_b == true ? "Y" : "N";
    this.record.plogin_isparent = this.record.plogin_isparent_b == true? "Y" : "N";

    const saveRecord = <vm_Tbl_Party_Login>{};
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
          if (this.mode == "ADD") {
            this.records.push(this.record);
            // Grid_Memo.ScrollIntoView(memo_Record, Grid_Memo.Columns[0]);
            //Grid_Memo.Focus();
          } else {
            if (this.records != null) {
                var REC = this.records.find(rec => rec.plogin_pkid == this.pkid);
                if (REC != null) {
                  REC.plogin_code = this.record.plogin_code;
                  REC.plogin_name = this.record.plogin_name;
                  REC.plogin_locked = this.record.plogin_locked;
                }
            }
          }
          this.NewRecord();
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
    if (this.gs.isBlank(this.record.plogin_pkid)) {
      bRet = false;
      this.errorMessage = "Invalid Record";
      alert(this.errorMessage);
      return bRet;
    }

    if (this.gs.isBlank(this.record.plogin_code)) {
      bRet = false;
      this.errorMessage = "Code Cannot Be Blank";
      alert(this.errorMessage);
      return bRet;
    }

    if (this.gs.isBlank(this.record.plogin_name)) {
      bRet = false;
      this.errorMessage = "Name Cannot Be Blank";
      alert(this.errorMessage);
      return bRet;
    }
    
    if (this.gs.isBlank(this.record.plogin_pwd)) {
      bRet = false;
      this.errorMessage = "Password Cannot Be Blank";
      alert(this.errorMessage);
      return bRet;
    }

    
    if (this.gs.isBlank(this.record.plogin_email)) {
      bRet = false;
      this.errorMessage = "Email Cannot Be Blank";
      alert(this.errorMessage);
      return bRet;
    }

    if (this.gs.isBlank(this.record.plogin_category)) {
      bRet = false;
      this.errorMessage = "Invalid Category";
      alert(this.errorMessage);
      return bRet;
    }

    return bRet;
  }


  Close() {
    this.location.back();
  }


}
