import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { User_Menu } from '../../core/models/menum';
import { SearchTable } from '../../shared/models/searchtable';
import { SettingsService } from '../services/settings.service';
import { TBL_MAST_PARAM, VM_TBL_MAST_SETTINGS } from '../models/Tbl_Mast_Param';
 //EDIT-AJITH-06-09-2021
 
@Component({
  selector: 'app-compsettings',
  templateUrl: './compsettings.component.html'
})
export class CompSettingsComponent implements OnInit {
  records: TBL_MAST_PARAM[] = [];
  saveList: TBL_MAST_PARAM[] = [];
  // 15-04-2021 Created By Joy  

  menuid: string;
  title: string = '';
  isAdmin: boolean;
  errorMessage: string;

  version_id = '';
  version = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: SettingsService
  ) { }

  ngOnInit() {
    this.gs.checkAppVersion();
    const options = this.route.snapshot.queryParams;
    this.menuid = options.menuid;

    this.initPage();
    this.List('SCREEN');
  }

  private initPage() {

    this.title = 'Company Settings';
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.errorMessage = '';
  }


  List(action: string = '') {
    var SearchData = this.gs.UserInfo;
    SearchData.PARAM_TYPE = 'COMPANY SETTINGS';
    SearchData.pkid = this.gs.getGuid();
    this.mainService.List(SearchData).subscribe(response => {
      this.records = response.list;
      this.fillRecords();
    }, error => {
      this.errorMessage = this.gs.getError(error)
    });
  }


  fillRecords() {
    this.records.forEach(Rec => {
      if (Rec.param_name1 == "COMPANY VERSION") {
        this.version_id = Rec.param_name2;
        this.version = Rec.param_name3;
      }
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


  Save() {
    if (!this.Allvalid())
      return;
    if (!confirm("Save")) {
      return;
    }
    this.saveList = <TBL_MAST_PARAM[]>[];
    this.saveList.push(this.AddRecord("COMPANY VERSION", this.gs.branch_pkid, this.version));

    const saveRecord = <VM_TBL_MAST_SETTINGS>{};
    saveRecord.userinfo = this.gs.UserInfo;
    saveRecord.records = this.saveList;
    saveRecord.userinfo.PARAM_TYPE = 'COMPANY SETTINGS';

    this.mainService.Save(saveRecord)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage = response.error;
          alert(this.errorMessage);
        }
        else {
          this.errorMessage = 'Save Complete';
        }
      }, error => {
        this.errorMessage = this.gs.getError(error);
        alert(this.errorMessage);
      });
  }

  private AddRecord(SCATG: string, SPKID: string, ACNAME: string) {
    let Rec = <TBL_MAST_PARAM>{};
    Rec.param_pkid = this.gs.getGuid();
    Rec.param_type = "COMPANY SETTINGS";
    Rec.param_code = "";
    Rec.param_name1 = SCATG;
    Rec.param_name2 = SPKID;
    Rec.param_name3 = ACNAME;
    Rec.param_value1 = 0;
    return Rec;
  }


  Allvalid(): boolean {
    var bRet = true;
    this.errorMessage = "";
    return bRet;
  }

  Close() {
    this.location.back();
  }


}
