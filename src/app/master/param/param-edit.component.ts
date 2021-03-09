import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { ParamService } from '../services/master.service';

import { User_Menu } from '../../core/models/menum';
import { TBL_MAST_PARAM, VM_TBL_MAST_PARAM } from '../models/Tbl_Mast_Param';

import { SearchTable } from '../../shared/models/searchtable';


@Component({
  selector: 'app-param-edit',
  templateUrl: './param-edit.component.html'
})
export class ParamEditComponent implements OnInit {

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
  lovName: string = 'lovName';
  name6: string = 'Name6';

  bcodeenabled: boolean = true;

  bcode: boolean = true;
  bname1: boolean = true;
  bname2: boolean = true;
  bname3: boolean = false;
  bname4: boolean = false;
  bname5: boolean = false;
  blovName: boolean = false;
  bname6: boolean = false;

  cmbList = {};

  USERRECORD: SearchTable = new SearchTable();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: ParamService,
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
      }
      else {
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
    this.record.param_name6 = '';
    this.record.param_lookup_id = '';
    this.record.param_lookup_code = '';
    this.record.param_lookup_name = '';

    if (this.menu_param == "HBL-FORMAT")
      this.record.param_name6 = 'BLANK';

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
      }
    }
    if (this.mode == 'EDIT') {
      this.GetRecord();
    }
    this.ResetControls();
  }

  ResetControls() {
    if (this.mode == "ADD" && this.menu_param != "INVOICE-DESCRIPTION")
      this.bcodeenabled = true;
    else
      this.bcodeenabled = false;
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
    this.initLov();
    this.USERRECORD.id = this.record.param_lookup_id;
    this.USERRECORD.code = this.record.param_lookup_code;
    this.USERRECORD.name = this.record.param_lookup_name;
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
        if (response.retvalue == false) {
          this.errorMessage = response.error;
          alert(this.errorMessage);
        }
        else {
          if (this.mode == "ADD" && response.code != '')
            this.record.param_code = response.code;
          this.mode = 'EDIT';
          this.errorMessage = 'Save Complete';
          alert(this.errorMessage);
        }
      }, error => {
        this.errorMessage = this.gs.getError(error);
        alert(this.errorMessage);
      });
  }


  private Allvalid(): boolean {

    var bRet = true;
    var Code = this.record.param_code;
    var Name1 = this.record.param_name1;
    var Name2 = this.record.param_name2;
    var Name6 = this.record.param_lookup_id;
    if (this.menu_param != "INVOICE-DESCRIPTION" && this.menu_param != "CNTR-MOVE-STATUS" && this.menu_param != "SHIP-MOVE-STATUS" && this.menu_param != "CUSTOMER GROUP" && this.menu_param != "AIR-SHIP-MOVE-STATUS") {
      if (Code.length <= 0) {
        this.errorMessage = "Code cannot be empty";
        return false;
      }
    }
    if (Name1.length <= 0) {
      this.errorMessage = "Name cannot be empty";
      return false;
    }

    if (this.menu_param == "AIR CARRIER") {
      if (Name2.length <= 0) {
        this.errorMessage = "Master Prefix Cannot be Empty";
        return false;
      }
    }

    if (this.menu_param == "CURRENCY") {
      if (Code.length <= 0) {
        this.errorMessage = "Code Cannot Be Blank";
        return false;
      }
      if (Code.length > 3) {
        this.errorMessage = "Maximum Code length is 3 Characters";
        return false;
      }
      if (Name1.length > 3) {
        this.errorMessage = "Maximum Name length is 3 Characters";
        return false;
      }
    }



    if (this.menu_param == "PORT" || this.menu_param == "AIRPORT" || this.menu_param == "SEAPORT") {
      if (Name2.length <= 0) {
        this.errorMessage = "Error in Name2";
        return false;
      }
    }


    if (this.menu_param == "JOB-TYPE") {
      if (Name2 != "SEA EXPORT" && Name2 != "AIR EXPORT" && Name2 != "SEA IMPORT" && Name2 != "AIR IMPORT" && Name2 != "OTHERS") {
        this.errorMessage = "Categories should be SEA IMPORT/AIR IMPORT/SEA EXPORT/AIR EXPORT/OTHERS";
        return false;
      }
    }


    if (this.menu_param == "HBL-FORMAT") {
      if (Name6.length <= 0) {
        this.errorMessage = "Type Has to be selected";
        return false;
      }
    }


    return true;
  }




  initLov(caption: string = '') {

    this.USERRECORD = new SearchTable();
    this.USERRECORD.controlname = "USER";
    this.USERRECORD.displaycolumn = "NAME";
    this.USERRECORD.type = "USER";
    this.USERRECORD.subtype = "";
    this.USERRECORD.id = "";
    this.USERRECORD.code = "";
    if (!this.isAdmin)
      this.USERRECORD.where = " param_lookup_id = '" + this.gs.user_pkid + "'";
  }


  LovSelected(_Record: SearchTable) {

    if (_Record.controlname == "USER") {
      this.record.param_lookup_id = _Record.id;
    }
  }


  Close() {
    this.location.back();
  }


  ngOnDestroy() {
    this.sub.unsubscribe;
  }



  showHideControls() {
    this.bcode = true;
    this.bname1 = true;
    this.bname2 = false;
    this.bname3 = false;
    this.bname4 = false;
    this.bname5 = false;
    this.blovName = false;
    this.bname6 = false;

    this.name1 = 'Name';

    if (this.menu_param == 'HBL-FORMAT') {
      this.cmbList = ['BLANK', 'DRAFT'];
      this.name6 = 'Type';
      this.record.param_name6 = 'BLANK'
      this.bname6 = true;
    }
    if (this.menu_param == 'EDI') {
      this.cmbList = ['BRANCH WISE MASTER', 'COMPANY WISE MASTER'];
      this.name6 = 'Type';
      this.record.param_name6 = 'BRANCH WISE MASTER'
      this.bname6 = true;
    }
    if (this.menu_param == "CNTR-MOVE-STATUS" || this.menu_param == "SHIP-MOVE-STATUS" || this.menu_param == "AIR-SHIP-MOVE-STATUS") {
      this.name1 = "Status";
      this.name2 = "Sort Order";
      this.bname2 = true;

      this.bcode = false;

    }
    if (this.menu_param == 'SALESMAN') {
      this.name1 = "Name";
      this.name2 = "Email";
      this.lovName = 'User';
      this.blovName = true;
      this.bname2 = true;
    }

    if (this.menu_param == 'JOB-TYPE') {
      this.name1 = "Job Type";
      this.name2 = "Category";
      this.name3 = "Order By";
      this.bname2 = true;
      this.bname3 = true;
    }
    if (this.menu_param == 'PORT') {
      this.name1 = "Port Name";
      this.name2 = "Country";
      this.bname2 = true;
    }

    if (this.menu_param == 'AIR PORT') {
      this.name1 = "Port Name";
      this.name2 = "Country";
      this.bname2 = true;

      // code Len = 3

    }

    if (this.menu_param == 'SEA PORT') {
      this.name1 = "Port Name";
      this.name2 = "Country";
      this.bname2 = true;
      // code Len = 5
    }

    if (this.menu_param == 'CURRENCY') {
      this.name1 = "Name";
      this.name2 = "Ex.Rate";
      this.bname2 = true;
      // code Len = 5
    }
    if (this.menu_param == 'OCEAN CARRIER') {
      this.name1 = "Sea Carrier";
      this.name2 = "SCAC Code";
      this.bname2 = true;
      // code Len = 4
    }

    if (this.menu_param == 'AIR CARRIER') {
      this.name1 = "Air Carrier";
      this.name2 = "Master Prefix";
      this.bname2 = true;
    }
    if (this.menu_param == "INVOICE-DESCRIPTION" && this.gs.VAT_PER > 0) {
      this.name5 = 'VAT%';
      this.bname5 = true;
    }

    if (this.menu_param == 'CUSTOMER GROUP') {
      this.name1 = "Description";
      this.bcode = false;
    }

    if (this.menu_param == 'BUDGET-TYPE') {
      this.name2 = "Sort Order";
      this.bname2 = true;
    }


  }

}
