import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { ParamDetService } from '../services/paramdet.service';

import { User_Menu } from '../../core/models/menum';

import { TBL_MAST_PARAM, VM_TBL_MAST_PARAM } from '../models/Tbl_Mast_Param';

import { SearchTable } from '../../shared/models/searchtable';
// import { type } from 'os';


@Component({
  selector: 'app-paramdet-edit',
  templateUrl: './paramdet-edit.component.html'
})
export class ParamDetEditComponent implements OnInit {

  record: TBL_MAST_PARAM = <TBL_MAST_PARAM>{};

  // 24-05-2019 Created By Joy  

  pkid: string;
  menuid: string;
  menu_param: string;
  mode: string;
  sub: any;
  errorMessage: string;
  origin: string = "";
  ms_name: string = "";

  closeCaption: string = 'Return';

  title: string;
  isAdmin: boolean;

  code: string = 'Code';
  name1: string = 'Name';
  name2: string = 'Name2';
  name3: string = 'Name3';
  name4: string = 'Name4';
  name5: string = 'Name5';


  bcodeenabled: boolean = true;
  bnameenabled: boolean = true;

  bcode: boolean = true;
  bname1: boolean = true;
  bname2: boolean = true;
  bname3: boolean = false;
  bname4: boolean = false;
  bname5: boolean = false;


  cmbList = {};



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: ParamDetService,
  ) { }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      if (this.route.snapshot.queryParams.parameter == null) {
        this.pkid = this.route.snapshot.queryParams.pkid;
        this.menuid = this.route.snapshot.queryParams.menuid;
        this.menu_param = this.route.snapshot.queryParams.type;
        this.mode = this.route.snapshot.queryParams.mode;
        this.origin = this.route.snapshot.queryParams.origin;
        if (this.origin === "EXTERNAL") {
          this.ms_name = this.route.snapshot.queryParams.ms_name;
        }
      } else {
        const options = JSON.parse(params["parameter"]);
        this.pkid = options.pkid;
        this.menuid = options.menuid;
        this.menu_param = options.type;
        this.mode = options.mode;
        this.origin = options.origin;
        if (this.origin === "EXTERNAL") {
          this.ms_name = options.ms_name;
        }
      }
      this.closeCaption = 'Return';
      this.initPage();
      this.showHideControls();
      this.actionHandler();
    });
  }

  private initPage() {
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.errorMessage = '';
  }

  init() {
    this.record.param_pkid = this.pkid;
    this.record.param_type = this.menu_param;
    this.record.param_code = '';
    this.record.param_name1 = '';
    this.record.param_name2 = '';
    this.record.param_name3 = '';
    this.record.param_name4 = '';
    this.record.param_name5 = '';
  }


  NewRecord() {
    this.mode = 'ADD'
    this.actionHandler();
  }

  actionHandler() {

    this.initLov();
    if (this.mode == 'ADD') {
      this.record = <TBL_MAST_PARAM>{};
      this.pkid = this.gs.getGuid();
      this.init();
      if (this.origin === "EXTERNAL") {
        this.record.param_name1 = this.ms_name;
        if (this.menu_param === "SEA PORT")
          this.record.param_name3 = this.ms_name;
      }
    }
    if (this.mode == 'EDIT') {
      this.GetRecord();
    }
    this.ResetControls();
  }

  ResetControls() {

  }

  GetRecord() {

    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;
    SearchData.TYPE = this.menu_param;

    this.mainService.GetRecord(SearchData)
      .subscribe(response => {

        this.record = <TBL_MAST_PARAM>response.record;
        this.LoadData();
        this.mode = 'EDIT';
      }, error => {
        this.errorMessage = this.gs.getError(error);
      });
  }

  LoadData() {
  }

  onBlur(field: string) {
    switch (field) {
      case 'param_code': {
        this.record.param_code = this.record.param_code.toUpperCase();
        break;
      }
      case 'param_name1': {
        this.record.param_name1 = this.record.param_name1.toUpperCase();
        break;
      }
      case 'param_name2': {
        this.record.param_name2 = this.record.param_name2.toUpperCase();
        break;
      }

      case 'param_name3': {
        this.record.param_name3 = this.record.param_name3.toUpperCase();
        break;
      }

      case 'param_name4': {
        this.record.param_name4 = this.record.param_name4.toUpperCase();
        break;
      }

      case 'param_name5': {
        this.record.param_name5 = this.record.param_name5.toUpperCase();
        break;
      }
    }

    if (this.menu_param == "AIR PORT") {
      this.record.param_code = this.record.param_name2;
      this.record.param_name1 = this.record.param_name3 + ", " + this.record.param_name5;
    }
    if (this.menu_param == "SEA PORT") {
      this.record.param_name1 = this.record.param_name3 + ", " + this.record.param_name5;
    }

  }

  Save() {

    if (!this.Allvalid())
      return;

    const saveRecord = <VM_TBL_MAST_PARAM>{};
    saveRecord.record = this.record;
    saveRecord.userinfo = this.gs.UserInfo;
    saveRecord.mode = this.mode;

    this.mainService.Save(saveRecord)
      .subscribe(response => {
        if (response.retvalue == false)
          this.errorMessage = response.error;
        else {
          this.mode = 'EDIT';
          this.errorMessage = 'Save Complete';
        }
      }, error => {
        this.errorMessage = this.gs.getError(error);
      });
  }


  private Allvalid(): boolean {

    var bRet = true;
    var Code = this.record.param_code;
    var Name1 = this.record.param_name1;
    var Name2 = this.record.param_name2;
    var Name3 = this.record.param_name3;
    var Name4 = this.record.param_name4;
    var Name5 = this.record.param_name5;

    if (Code.length <= 0) {
      this.errorMessage = "Code cannot be empty";
      return false;
    }
    if (Name1.length <= 0) {
      this.errorMessage = "Name cannot be empty";
      return false;
    }

    if (this.menu_param == "AIR PORT" || this.menu_param == "SEA PORT") {

      if (Name2.length <= 0) {
        this.errorMessage = "Port Code Cannot Be Empty";
        return false;
      }
      if (Name3.length <= 0) {
        this.errorMessage = "Port Name Cannot Be Empty";
        return false;
      }

      if (Name4.length <= 0) {
        this.errorMessage = "Country Code Cannot Be Empty";
        return false;
      }

      if (Name5.length <= 0) {
        this.errorMessage = "Country Name Cannot Be Empty";
        return false;
      }

    }

    if (this.menu_param == "AIR PORT") {
      if (Code.length != 3) {
        this.errorMessage = "Code Need To be 3 characters long";
        return false;
      }

      if (Name1.length > 60) {
        this.errorMessage = "Port Name Max Length is 60 Characters";
        return false;
      }

      if (Name2.length != 3) {
        this.errorMessage = "Port Code Should be 3 characters";
        return false;
      }

      if (Name4.length != 2) {
        this.errorMessage = "Country Code Should be 2 characters";
        return false;
      }

      if (Name5.length > 60) {
        this.errorMessage = "Country Name Max Length is 60 Characters";
        return false;
      }


    }

    if (this.menu_param == "SEA PORT") {
      if (Code.length != 5) {
        this.errorMessage = "Code Need To be 5 characters long";
        return false;
      }

      if (Name1.length > 60) {
        this.errorMessage = "Port Name Max Length is 60 Characters";
        return false;
      }

      if (Name2.length != 3) {
        this.errorMessage = "Port Code Should be 3 characters";
        return false;
      }

      if (Name4.length != 2) {
        this.errorMessage = "Country Code Should be 2 characters";
        return false;
      }

      if (Name5.length > 60) {
        this.errorMessage = "Country Name Max Length is 60 Characters";
        return false;
      }

    }

    if (this.menu_param == "AIR CARRIER") {
      if (Name2.length != 4) {
        this.errorMessage = "Master Prefix Should be 4 Characters";
        return false;
      }


    }
    return true;
  }




  initLov(caption: string = '') {


  }


  LovSelected(_Record: SearchTable) {

  }


  Close() {
    this.location.back();
  }


  ngOnDestroy() {
    this.sub.unsubscribe;
  }



  showHideControls() {

    this.bcodeenabled = true;
    this.bnameenabled = true;
    this.bcode = true;
    this.bname1 = true;
    this.bname2 = false;
    this.bname3 = false;
    this.bname4 = false;
    this.bname5 = false;

    this.name1 = 'Name';


    if (this.menu_param == 'AIR PORT') {

      this.name1 = "Name";
      this.name2 = "Port Code";
      this.name3 = "Port Name";
      this.name4 = "Country Code";
      this.name5 = "Country Name";

      this.bcodeenabled = false;
      this.bnameenabled = false;
      this.bname1 = false;

      this.bname2 = true;
      this.bname3 = true;
      this.bname4 = true;
      this.bname5 = true;


    }

    if (this.menu_param == 'SEA PORT') {
      this.name1 = "Name";
      this.name2 = "Port Code";
      this.name3 = "Port Name";
      this.name4 = "Country Code";
      this.name5 = "Country Name";

      this.bcodeenabled = true;
      this.bnameenabled = false;

      this.bname1 = false;

      this.bname2 = true;
      this.bname3 = true;
      this.bname4 = true;
      this.bname5 = true;
    }


    if (this.menu_param == 'SEA CARRIER') {
      this.code = "Code";
      this.name1 = "Sea Carrier ";
      this.name2 = "SCAC Code";
      this.name3 = "Tracking Web";

      this.bname2 = true;
      this.bname3 = true;


      // code Len = 4
    }

    if (this.menu_param == 'AIR CARRIER') {
      this.code = "Code";
      this.name1 = "Air Carrier";
      this.name2 = "Master Prefix";
      this.name3 = "Tracking Web";

      this.bname2 = true;
      this.bname3 = true;

    }



  }

}
