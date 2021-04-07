import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/services/global.service';
import { vm_Tbl_Cargo_Qtnd_Lcl,Tbl_Cargo_Qtnm } from '../../models/tbl_cargo_qtnm';
 import { QtnSettingService } from '../../services/qtnsetting.service';

@Component({
  selector: 'app-qtnsetting-edit',
  templateUrl: './qtnsetting-edit.component.html'
})
export class QtnSettingEditComponent implements OnInit {

   
  record: Tbl_Cargo_Qtnm = <Tbl_Cargo_Qtnm>{};
  menuid: string;
  pkid: string;
  source: string;
  mode: string;
  title: string = '';
  isAdmin: boolean;
  errorMessage: string;
  is_locked: boolean = false;
  remarks: string = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: QtnSettingService
  ) { }

  ngOnInit() {
    const options = JSON.parse(this.route.snapshot.queryParams.parameter);
    this.menuid = options.menuid;
    this.pkid = options.pkid;
    this.title = options.title;
    
    this.initPage();
    this.actionHandler();
  }

  private initPage() {
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
    filePath = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\quotation\\";
    var SearchData = this.gs.UserInfo;
    SearchData.filePath = filePath;
    SearchData.pkid = this.pkid;
    

    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.record = <Tbl_Cargo_Qtnm>{};
        this.record.qtnm_subjects = response.remarks;
     
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
    sPath = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\quotation\\";

    const saveRecord = <vm_Tbl_Cargo_Qtnd_Lcl>{};
    saveRecord.userinfo = this.gs.UserInfo;
    saveRecord.record = this.record;
    // saveRecord.filepath = sPath;

    this.mainService.Save(saveRecord)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage = response.error;
          alert(this.errorMessage);
        }else{
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
    // if (this.gs.isBlank(this.record.pkid) || this.gs.isBlank(this.record.source)) {
    //   bRet = false;
    //   this.errorMessage = "ID or Source Cannot be empty";
    //   alert(this.errorMessage);
    //   return bRet;
    // }

    // if (this.gs.isBlank(this.record.remarks)) {
    //   bRet = false;
    //   this.errorMessage = "Remarks Cannot be empty";
    //   alert(this.errorMessage);
    //   return bRet;
    // }
    return bRet;
  }

 

  Close() {
    this.location.back();
  }

}