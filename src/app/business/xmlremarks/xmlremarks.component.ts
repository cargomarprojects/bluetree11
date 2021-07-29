import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { Table_Cargo_Remarks, vm_Table_Cargo_Remarks } from '../models/table_cargo_remarks';
import { XmlRemarksService } from '../services/xmlremarks.service';
import { User_Menu } from '../../core/models/menum';
import { SearchTable } from '../../shared/models/searchtable';
import { strictEqual } from 'assert';
import { AnyFn } from '@ngrx/store/src/selector';

@Component({
  selector: 'app-xmlremarks',
  templateUrl: './xmlremarks.component.html'
})
export class XmlRemarksComponent implements OnInit {

  //@ViewChild('mbl_no') mbl_no_field: ElementRef;

  // 15-07-2019 Created By Ajith  
  record: Table_Cargo_Remarks = <Table_Cargo_Remarks>{};
  menuid: string;
  pkid: string;
  source: string;
  mode: string;
  title: string = '';
  isAdmin: boolean;
  errorMessage: string;
  is_locked: boolean = false;
  remarks: string = "";
  origin: string;
  parentid: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: XmlRemarksService
  ) { }

  ngOnInit() {
    if (this.route.snapshot.queryParams.parameter == null) {
      this.menuid = this.route.snapshot.queryParams.menuid;
      this.pkid = this.route.snapshot.queryParams.pkid;
      this.source = this.route.snapshot.queryParams.source;
      this.title = this.route.snapshot.queryParams.title;
      if (!this.gs.isBlank(this.route.snapshot.queryParams.is_locked))
        this.is_locked = JSON.parse(this.route.snapshot.queryParams.is_locked);
      this.origin = this.route.snapshot.queryParams.origin;
      this.parentid = this.route.snapshot.queryParams.parentid;
    } else {
      const options = JSON.parse(this.route.snapshot.queryParams.parameter);
      this.menuid = options.menuid;
      this.pkid = options.pkid;
      this.source = options.source;
      this.title = options.title;
      this.is_locked = options.is_locked;
      this.origin = options.origin;
      this.parentid = options.parentid;
    }
    this.initPage();
    this.actionHandler();
  }

  private initPage() {
    this.gs.checkAppVersion();
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.errorMessage = '';
    this.LoadCombo();
  }

  LoadCombo() {

  }

  actionHandler() {
    this.GetRecord();
  }

  init() {
  }

  GetRecord() {
    this.errorMessage = '';
    let filePath: string = "";
    filePath = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\xmlremarks\\";
    var SearchData = this.gs.UserInfo;
    SearchData.filePath = filePath;
    SearchData.pkid = this.pkid;
    SearchData.source = this.source;

    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.record = <Table_Cargo_Remarks>{};
        this.record.remarks = response.remarks;
        this.record.pkid = this.pkid;
        this.record.source = this.source;
      }, error => {
        this.errorMessage = this.gs.getError(error);
      });
  }


  OnChange(field: string) {

  }

  onBlur(field: string) {
    switch (field) {
      // case 'remarks': {
      //   this.record.remarks = this.record.remarks.toUpperCase();
      //   break;
      // }
    }
  }


  Save() {

    if (!this.Allvalid())
      return;

    let sPath: string = "";
    sPath = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\xmlremarks\\";

    const saveRecord = <vm_Table_Cargo_Remarks>{};
    saveRecord.userinfo = this.gs.UserInfo;
    saveRecord.record = this.record;
    saveRecord.filepath = sPath;

    this.mainService.Save(saveRecord)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage = response.error;
          alert(this.errorMessage);
        } else {
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
    if (this.gs.isBlank(this.record.pkid) || this.gs.isBlank(this.record.source)) {
      bRet = false;
      this.errorMessage = "ID or Source Cannot be empty";
      alert(this.errorMessage);
      return bRet;
    }

    if (this.gs.isBlank(this.record.remarks)) {
      bRet = false;
      this.errorMessage = "Remarks Cannot be empty";
      alert(this.errorMessage);
      return bRet;
    }
    return bRet;
  }

  BtnNavigation(action: string) {
    switch (action) {
      case 'HISTORY': {
        let prm = {
          appid:this.gs.appid,
          menuid: this.menuid,
          pkid: this.pkid,
          source: this.source,
          title: "History [" + this.source + "]",
          origin: 'Xml-remark-page'
        };
        this.gs.Naviagete('Silver.BusinessModule/LogBookPage', JSON.stringify(prm));
        break;
      }
    }
  }

  Close() {
    // if (this.origin == "seaimp-house-page")
    //   this.gs.LinkReturn(this.origin, this.pkid, '', this.parentid);
    // else
    this.location.back();
  }

}
