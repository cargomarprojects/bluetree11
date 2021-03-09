import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { OthTrackingPageService } from '../services/oth-trackingpage.service';
import { User_Menu } from '../../core/models/menum';
import { Tbl_Cargo_Tracking_Status, vm_Tbl_Cargo_Tracking_Status } from '../models/tbl_cargo_tracking_status';
import { SearchTable } from '../../shared/models/searchtable';
// import { strictEqual } from 'assert';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-oth-trackingpage',
  templateUrl: './oth-trackingpage.component.html'
})
export class OthTrackingPageComponent implements OnInit {

  @ViewChild('_cmb_notes') cmb_notes_field: ElementRef;
  @ViewChildren('_cntr_remarks') cntr_remarks_field: QueryList<ElementRef>;

  trackrecords: Tbl_Cargo_Tracking_Status[] = [];
  trackmemorecord: Tbl_Cargo_Tracking_Status = <Tbl_Cargo_Tracking_Status>{};
  trackmemorecords: Tbl_Cargo_Tracking_Status[] = [];
  // 15-07-2019 Created By Ajith  

  parentTypememo: string;
  pkid: string;
  parentType: string;
  paramType: string;
  menuid: string;
  refno: string;
  hideTracking: string = 'N';
  oprgrp: string = '';
  mode: string;
  title: string = '';
  isAdmin: boolean;
  errorMessage: string;
  selectedRowIndex: number = -1;
  is_locked: boolean = false;
  Memo_Mode: string = "ADD";
  Memo_Id: string = "";
  lblSaveMemo: string = "Save";
  cmbNotes: string = "";
  MemoList: any[] = [];
  tab: string = 'main';
  attach_pkid: string = "";
  attach_typelist: any = {};
  modal: any;

  constructor(
    private modalconfig: NgbModalConfig,
    private modalservice: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: OthTrackingPageService
  ) {
    modalconfig.backdrop = 'static'; //true/false/static
    modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
  }

  ngOnInit() {
    const options = JSON.parse(this.route.snapshot.queryParams.parameter);
    this.pkid = options.pkid;
    this.menuid = options.menuid;
    this.parentType = options.parentType;
    this.paramType = options.paramType;
    this.hideTracking = options.hideTracking;
    this.oprgrp = options.oprgrp;
    this.refno = options.refno;
    this.is_locked = options.is_locked;
    // this.mode = 'ADD';
    this.parentTypememo = this.parentType + "-MEMO";
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
    // this.errorMessage = '';
    // if (this.mode == 'ADD') {
    //   this.record = <Tbl_cargo_imp_desc>{};
    //   this.init();
    // }
    // if (this.mode == 'EDIT') {
    //   this.GetRecord();
    // }
    this.GetRecord();
  }

  init() {
    // this.record.parentid = this.pkid;
    // this.record.cargo_description = '';
    // this.record.cargo_marks = '';
    // this.record.cargo_packages = '';
    // this.record.cargo_ctr = 1;
  }

  GetRecord() {
    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;
    SearchData.parentType = this.parentType;
    SearchData.paramType = this.paramType;

    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.trackrecords = <Tbl_Cargo_Tracking_Status[]>response.records;
        this.trackmemorecords = <Tbl_Cargo_Tracking_Status[]>response.memorecords;
        this.NewRecord();
      }, error => {
        this.errorMessage = this.gs.getError(error);
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



  Save() {

    if (!this.Allvalid())
      return;

    const saveRecord = <vm_Tbl_Cargo_Tracking_Status>{};
    saveRecord.userinfo = this.gs.UserInfo;
    saveRecord.record = this.trackrecords;
    saveRecord.pkid = this.pkid;
    saveRecord.parentType = this.parentType;
    saveRecord.paramType = this.paramType;

    this.mainService.Save(saveRecord)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage = response.error;
          alert(this.errorMessage);
        }
        else {
           this.errorMessage = 'Save Complete';
          // alert(this.errorMessage);
        }
      }, error => {
        this.errorMessage = this.gs.getError(error);
        alert(this.errorMessage);
      });
  }

  private Allvalid(): boolean {

    var bRet = true;
    this.errorMessage = "";
    if (this.pkid == "") {
      bRet = false;
      this.errorMessage = "Invalid ID";
      alert(this.errorMessage);
      return bRet;
    }

    return bRet;
  }


  Close() {
    this.location.back();
  }
  OnChange(field: string) {
    if (field == 'cmbNotes') {
      this.trackmemorecord.remarks = this.cmbNotes;
    }
  }

  onBlur(field: string, _rec: Tbl_Cargo_Tracking_Status = null) {
    switch (field) {
      case 'remarks': {
        _rec.remarks = _rec.remarks.toUpperCase();
        break;
      }
      case 'trackremarks': {
        this.trackmemorecord.remarks = this.trackmemorecord.remarks.toUpperCase();
        break;
      }
    }
  }

  AddRow() {
    var rec = <Tbl_Cargo_Tracking_Status>{};
    // rec.parentid = this.pkid;
    // rec.cargo_marks = "",
    //   rec.cargo_description = "",
    //   rec.cargo_ctr = this.findNextCtr();

    // this.descrecords.push(rec);
  }

  //   findNextCtr() {
  //     let max: number = 16;
  //     this.trackrecords.forEach(Rec => {
  //       max = Rec.cargo_ctr > max ? Rec.cargo_ctr : max;
  //     })
  //     return max + 1;
  //   }


  SetRowIndex(_indx: number) {
    this.selectedRowIndex = _indx;
  }

  AttachRow(_rec: Tbl_Cargo_Tracking_Status, attachmodal: any = null) {
    let TypeList: any[] = [];
    TypeList = [{ "code": "INTERNAL MEMO", "name": "INTERNAL MEMO" }];
    this.attach_pkid = _rec.param_id;
    this.attach_typelist = TypeList;
    this.modal = this.modalservice.open(attachmodal, { centered: true });
  }

  callbackevent() {
    this.tab = 'main';
  }

  RemoveRow(_rec: Tbl_Cargo_Tracking_Status) {

    this.errorMessage = '';
    if (this.gs.isBlank(_rec.param_id)) {
      this.errorMessage = "Cannot Delete, ID Not Found";
      alert(this.errorMessage);
      return;
    }

    if (!confirm("DELETE " + _rec.remarks)) {
      return;
    }

    var SearchData = this.gs.UserInfo;
    SearchData.pkid = _rec.param_id;
    SearchData.parentType = this.parentTypememo;

    this.mainService.DeleteRecord(SearchData)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage = response.error;
          alert(this.errorMessage);
        }
        else {
          this.trackmemorecords.splice(this.trackmemorecords.findIndex(rec => rec.param_id == _rec.param_id), 1);
          this.NewRecord();
        }
      }, error => {
        this.errorMessage = this.gs.getError(error);
        alert(this.errorMessage);
      });

  }
  //   RemoveRow(_rec: Tbl_cargo_imp_desc) {
  //     this.descrecords.splice(this.descrecords.findIndex(rec => rec.cargo_ctr == _rec.cargo_ctr), 1);
  //   }

  NewRecord(_stype: string = '') {
    this.Memo_Mode = "ADD";
    this.Memo_Id = this.gs.getGuid();
    this.trackmemorecord = <Tbl_Cargo_Tracking_Status>{};
    this.trackmemorecord.rec_created_by = this.gs.user_code;
    this.trackmemorecord.param_id = this.Memo_Id;
    this.trackmemorecord.date = this.gs.defaultValues.today;
    this.trackmemorecord.remarks = ''
    this.lblSaveMemo = "Save";
    this.SetloadFocus(_stype);
  }

  EditRow(_rec: Tbl_Cargo_Tracking_Status) {
    //Dt_Date.IsEnabled = false;
    this.Memo_Id = _rec.param_id.toString();
    this.Memo_Mode = "EDIT";
    this.trackmemorecord.param_id = this.Memo_Id;
    this.trackmemorecord.date = _rec.date;
    this.trackmemorecord.remarks = _rec.remarks.toString();
    this.lblSaveMemo = "Update";
    if (!this.gs.isBlank(this.cmb_notes_field))
      this.cmb_notes_field.nativeElement.focus();
  }

  SaveMemo() {
    const saveRecord = <vm_Tbl_Cargo_Tracking_Status>{};
    saveRecord.userinfo = this.gs.UserInfo;
    saveRecord.memorecord = this.trackmemorecord;
    saveRecord.pkid = this.pkid;
    saveRecord.memoPkid = this.Memo_Id;
    saveRecord.memoMode = this.Memo_Mode;
    saveRecord.parentType = this.parentTypememo;

    this.mainService.SaveMemo(saveRecord)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage = response.error;
          alert(this.errorMessage);
        }
        else {

          if (this.Memo_Mode == "ADD") {
            this.trackmemorecord.date = response.memodate;
            this.trackmemorecords.push(this.trackmemorecord);
            // Grid_Memo.ScrollIntoView(memo_Record, Grid_Memo.Columns[0]);
            //Grid_Memo.Focus();
          } else {
            if (this.trackmemorecords != null) {
              var REC = this.trackmemorecords.find(rec => rec.param_id == this.Memo_Id);
              if (REC != null)
                REC.remarks = this.trackmemorecord.remarks;
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


  SearchRecord(controlname: string) {
    this.errorMessage = '';
    let SearchData = {
      table: '',
      pkid: '',
    };

    if (controlname == "loadcombo") {
      SearchData.table = 'LOAD_COMBO_TRACKING_PAGE';
      SearchData.pkid = '';
    }
    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.MemoList = response.memolist;
        this.SetloadFocus();
      },
        error => {
          this.errorMessage = this.gs.getError(error);
          alert(this.errorMessage);
        });
  }
  CloseModal() {
    this.modal.close();
  }

  SetloadFocus(_stype: string = '') {
    if (this.hideTracking == 'Y' || _stype == 'MEMO') {
      if (!this.gs.isBlank(this.cmb_notes_field))
        this.cmb_notes_field.nativeElement.focus();
    } else {
      this.cntr_remarks_field.changes
        .subscribe((queryChanges) => {
          this.cntr_remarks_field.first.nativeElement.focus();
        });
      // this.cntr_remarks_field.first.nativeElement.focus();
    }
  }
}
