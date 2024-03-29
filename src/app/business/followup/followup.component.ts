import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { FollowupService } from '../services/followup.service';
import { User_Menu } from '../../core/models/menum';
import { Table_Cargo_Followup, vm_Table_Cargo_Followup } from '../models/table_cargo_followup';
import { SearchTable } from '../../shared/models/searchtable';
import { strictEqual } from 'assert';
import { DateComponent } from '../../shared/date/date.component';
//EDIT-AJITH-06-09-2021
//EDIT-AJITH-21-09-2021

@Component({
  selector: 'app-followup',
  templateUrl: './followup.component.html'
})
export class FollowupComponent implements OnInit {

  @ViewChild('cmb_note') cmb_note_field: ElementRef;
  @ViewChild('_cf_followup_date') cf_followup_date_field: DateComponent;
  records: Table_Cargo_Followup[] = [];
  record: Table_Cargo_Followup = <Table_Cargo_Followup>{};
  // 15-07-2019 Created By Ajith  

  menuid: string;
  cf_masterid: string;
  cf_refno: string;
  cf_refdate: string;

  cf_assigned_id = '';
  cf_assigned_code = '';
  cf_assigned_name = '';
  cf_handled_name = '';

  pkid: string;
  mode: string;
  title: string = '';
  isAdmin: boolean;
  errorMessage: string;
  selectedRowIndex: number = -1;
  is_locked: boolean = false;
  lblSave: string = "Save";
  cmbNotes: string = "";
  FollowupList: any[] = [];
  UserList: any[] = [];
  UsrDeleteId = '';
  origin: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: FollowupService
  ) { }

  ngOnInit() {
    this.gs.checkAppVersion();
    if (this.route.snapshot.queryParams.parameter == null) {
      this.menuid = this.route.snapshot.queryParams.menuid;
      this.cf_masterid = this.route.snapshot.queryParams.master_id;
      this.cf_refno = this.route.snapshot.queryParams.master_refno;
      this.cf_refdate = this.route.snapshot.queryParams.master_refdate;
      this.is_locked = JSON.parse(this.route.snapshot.queryParams.is_locked);
      this.origin = this.route.snapshot.queryParams.origin;
    } else {
      const options = JSON.parse(this.route.snapshot.queryParams.parameter);
      this.menuid = options.menuid;
      this.cf_masterid = options.master_id;
      this.cf_refno = options.master_refno;
      this.cf_refdate = options.master_refdate;
      this.is_locked = options.is_locked;
      this.origin = options.origin;
    }
    this.initPage();
    this.actionHandler();
  }

  private initPage() {

    this.title = 'Tracking';
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.errorMessage = '';
    this.LoadCombo();
  }

  LoadCombo() {
    this.SearchRecord('loadcombo');
  }

  actionHandler() {
    this.GetRecord();
  }

  init() {
  }

  GetRecord() {
    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.cf_masterid;
    SearchData.origin = this.origin;

    this.mainService.GetRecord(SearchData)
      .subscribe(response => {

        this.cf_handled_name = response.handledname;
        this.cf_assigned_id = response.assignedid;
        this.cf_assigned_code = response.assignedcode;
        this.cf_assigned_name = response.assignedname;

        this.records = (response.records == undefined || response.records == null) ? <Table_Cargo_Followup[]>[] : <Table_Cargo_Followup[]>response.records;
        this.NewRecord();
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

  OnChange(field: string) {
    if (field == 'cmbNotes') {
      this.record.cf_remarks = this.cmbNotes;
    }
    if (field == 'cf_assigned_id') {
      var REC = this.UserList.find(rec => rec.id == this.record.cf_assigned_id);
      if (REC != null) {
        this.record.cf_assigned_code = REC.code;
        this.record.cf_assigned_name = REC.name;
      }
    }
  }

  onBlur(field: string, _rec: Table_Cargo_Followup = null) {
    switch (field) {
      case 'remarks': {
        _rec.cf_remarks = _rec.cf_remarks.toUpperCase();
        break;
      }

    }
  }

  SetRowIndex(_indx: number) {
    this.selectedRowIndex = _indx;
  }


  NewRecord() {

    // if (CmbList != null && UsrDeleteRec != null)
    // {
    //     CmbList.Remove(UsrDeleteRec);
    //     UsrDeleteRec = null;
    // }

    if (this.UserList != null && this.UsrDeleteId != '') {
      this.UserList.splice(this.UserList.findIndex(rec => rec.id == this.UsrDeleteId), 1);
      this.UsrDeleteId = '';
    }

    this.mode = "ADD";
    this.pkid = this.gs.getGuid();
    this.record = <Table_Cargo_Followup>{};
    this.record.cf_pkid = this.pkid;
    this.record.cf_master_id = this.cf_masterid;
    this.record.cf_user_id = this.gs.user_pkid;
    this.record.rec_created_by = this.gs.user_code;
    this.record.cf_followup_date = this.gs.defaultValues.today;
    this.record.cf_assigned_id = this.gs.user_pkid;
    this.record.cf_assigned_code = this.gs.user_code;
    this.record.cf_assigned_name = this.gs.user_name;
    this.record.cf_remarks = '';
    this.lblSave = "Save";
    //Txtmemo.Focus();
    //this.cmb_note_field.nativeElement.fous();
    this.cf_followup_date_field.Focus();
  }

  EditRow(_rec: Table_Cargo_Followup) {

    if (this.UserList != null) {
      let bFind: boolean = false;
      this.UserList.forEach(Rec => {
        if (Rec.id == _rec.cf_assigned_id)
          bFind = true;
      })

      if (bFind == false) {

        this.UsrDeleteId = _rec.cf_assigned_id;

        var UsrDeleteRec = <SearchTable>{};
        UsrDeleteRec.id = _rec.cf_assigned_id;
        UsrDeleteRec.code = _rec.cf_assigned_code;
        UsrDeleteRec.name = "";
        this.UserList.push(UsrDeleteRec);
      }
    }

    this.mode = "EDIT";
    this.pkid = _rec.cf_pkid.toString();
    this.record.cf_pkid = this.pkid;
    this.record.cf_followup_date = _rec.cf_followup_date;
    this.record.cf_remarks = _rec.cf_remarks.toString();
    this.record.cf_assigned_id = _rec.cf_assigned_id;
    this.record.cf_assigned_code = _rec.cf_assigned_code;
    this.lblSave = "Update";
    this.cmbNotes = '';
    this.cf_followup_date_field.Focus();
  }

  Save() {

    if (!this.Allvalid())
      return;

    if (!confirm("Save")) {
      return;
    }

    const saveRecord = <vm_Table_Cargo_Followup>{};
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
              var REC = this.records.find(rec => rec.cf_pkid == this.pkid);
              if (REC != null) {
                REC.cf_followup_date = this.record.cf_followup_date;
                REC.cf_remarks = this.record.cf_remarks;
              }
            }
          }
          this.NewRecord();
          this.errorMessage = 'Save Complete';
          alert(this.errorMessage);
        }
      }, error => {
        this.errorMessage = this.gs.getError(error);
        alert(this.errorMessage);
      });
  }

  Allvalid(): boolean {

    var bRet = true;
    this.errorMessage = "";
    if (this.gs.isBlank(this.record.cf_master_id)) {
      bRet = false;
      this.errorMessage = "Invalid ID";
      alert(this.errorMessage);
      return bRet;
    }

    if (this.gs.isBlank(this.record.cf_assigned_id)) {
      bRet = false;
      this.errorMessage = "Assigned To has to be selected";
      alert(this.errorMessage);
      return bRet;
    }
    return bRet;
  }


  Close() {
    // if (this.origin == "seaexp-master-page" || this.origin == "seaimp-master-page" || this.origin == "airexp-master-page" || this.origin == "airimp-master-page" || this.origin == "other-general-page")
    //   this.gs.LinkReturn(this.origin, this.cf_masterid, '');
    // else
    this.location.back();
  }

  RemoveRow(_rec: Table_Cargo_Followup) {

    this.errorMessage = '';
    if (!confirm("DELETE " + _rec.cf_remarks)) {
      return;
    }

    var SearchData = this.gs.UserInfo;
    SearchData.pkid = _rec.cf_pkid;
    SearchData.remarks = _rec.cf_remarks;

    this.mainService.DeleteRecord(SearchData)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage = response.error;
          alert(this.errorMessage);
        }
        else {
          this.records.splice(this.records.findIndex(rec => rec.cf_pkid == _rec.cf_pkid), 1);
          this.NewRecord();
        }
      }, error => {
        this.errorMessage = this.gs.getError(error);
      });
  }


  SearchRecord(controlname: string) {
    this.errorMessage = '';
    let SearchData = {
      table: '',
      pkid: '',
      source: ''
    };

    if (controlname == "loadcombo") {
      SearchData.table = 'LOAD_COMBO_FOLLOWUP_PAGE';
      SearchData.pkid = '';
      if (this.origin == "sales-journal-page")
        SearchData.source = 'SALES JOURNALS';
      else
        SearchData.source = '';
    }
    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.FollowupList = response.followuplist;
        this.UserList = response.userlist;
        // this.cmb_note_field.nativeElement.focus();
        this.cf_followup_date_field.Focus();
      },
        error => {
          this.errorMessage = this.gs.getError(error);
          alert(this.errorMessage);
        });
  }

  tableKeydown(event: KeyboardEvent, _rec: Table_Cargo_Followup) {
    if (event.key === 'Enter') {
      this.EditRow(_rec);
    }
  }

  AssignHandlingPerson() {
    if (!this.gs.isBlank(this.cf_handled_name)) {
      this.record.cf_assigned_id = this.cf_assigned_id;
      this.record.cf_assigned_code = this.cf_assigned_code;
      this.record.cf_assigned_name = this.cf_assigned_name;
    }
  }
}


