import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { User_Menu } from '../../core/models/menum';
import { SearchTable } from '../../shared/models/searchtable';
import { SettingsService } from '../services/settings.service';
import { TBL_MAST_PARAM, VM_TBL_MAST_SETTINGS } from '../models/Tbl_Mast_Param';


@Component({
  selector: 'app-globalsettings',
  templateUrl: './globalsettings.component.html'
})
export class GlobalSettingsComponent implements OnInit {
  records: TBL_MAST_PARAM[] = [];
  saveList: TBL_MAST_PARAM[] = [];
  sortedList: TBL_MAST_PARAM[] = [];
  // 15-04-2021 Created By Joy  

  stagesRecords: TBL_MAST_PARAM[] = [];

  serverList: any[];

  menuid: string;
  title: string = '';
  isAdmin: boolean;
  errorMessage: string;

  tab = "page1";


  version = '';
  Txt_Company_ID = '';
  Txt_Name = '';
  Txt_Display_Name = '';
  Txt_Email = '';
  Txt_Password = '';
  Txt_Cc = '';
  Txt_Bcc = '';
  Txt_Sign1 = '';
  Txt_Sign2 = '';
  Txt_Sign3 = '';
  Txt_Sign4 = '';
  Txt_Of = '';
  Txt_Of_Order = 0;
  Txt_Pss = '';
  Txt_Pss_Order = 0;
  Txt_Baf = '';
  Txt_Baf_Order = 0;
  Txt_IsPs = '';
  Txt_IsPs_order = 0;
  Txt_Haulage = '';
  Txt_Haulage_Order = 0;
  Txt_ISF = '';
  Txt_ISF_Order = 0;
  Txt_Branch_Code = '';
  mailServer = "";


  LBL_STAGES_ID = '';
  LBL_STAGES = '';
  STAGE_CODE = '';

  Txt_Seq1 = 0;
  Txt_Seq2 = 0;
  Txt_Seq3 = 0;
  Txt_Seq4 = 0;
  Txt_Seq5 = 0;
  Txt_Seq6 = 0;
  Txt_Seq7 = 0;
  Txt_Seq8 = 0;
  Txt_Seq9 = 0;
  Txt_Seq10 = 0;
  Txt_Seq11 = 0;
  Txt_Seq12 = 0;
  Txt_Seq13 = 0;
  Txt_Seq14 = 0;
  Txt_Seq15 = 0;

  Txt_Stage1 = '';
  Txt_Stage2 = '';
  Txt_Stage3 = '';
  Txt_Stage4 = '';
  Txt_Stage5 = '';
  Txt_Stage6 = '';
  Txt_Stage7 = '';
  Txt_Stage8 = '';
  Txt_Stage9 = '';
  Txt_Stage10 = '';
  Txt_Stage11 = '';
  Txt_Stage12 = '';
  Txt_Stage13 = '';
  Txt_Stage14 = '';
  Txt_Stage15 = '';


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: SettingsService
  ) { }

  ngOnInit() {
    const options = this.route.snapshot.queryParams;
    this.menuid = options.menuid;

    this.initPage();
    this.LoadCombo();
    this.List('SCREEN');
  }

  private initPage() {
    this.title = 'Global Settings';
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.errorMessage = '';
  }

  LoadCombo(){
    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.CODE = "";
    SearchData.TYPE = "";

    this.mainService.MailServerList(SearchData).subscribe(response => {
        this.serverList = <any>response.list;
    }, error => {
        this.errorMessage = this.gs.getError(error);
    });
  }


  List(action: string = '') {
    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.PARAM_TYPE = 'GLOBAL SETTINGS';
    SearchData.INVOKE_TYPE = 'GENERAL';
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
      if (Rec.param_name1 == "SOFTWARE VERSION") {
        this.version = Rec.param_name3;
      }
      if (Rec.param_name1 == "COMPANY_STRING_ID") {
        this.Txt_Company_ID = Rec.param_name3;
      }

      if (Rec.param_name1 == "GENERAL_EMAIL_NAME")
        this.Txt_Name = Rec.param_name3;
      if (Rec.param_name1 == "GENERAL_EMAIL_DISPLAY_NAME")
        this.Txt_Display_Name = Rec.param_name3;
      if (Rec.param_name1 == "GENERAL_EMAIL")
        this.Txt_Email = Rec.param_name3;
      if (Rec.param_name1 == "GENERAL_EMAIL_PWD")
        this.Txt_Password = Rec.param_name3;
      if (Rec.param_name1 == "GENERAL_EMAIL_CC")
        this.Txt_Cc = Rec.param_name3;
      if (Rec.param_name1 == "GENERAL_EMAIL_BCC")
        this.Txt_Bcc = Rec.param_name3;
      if (Rec.param_name1 == "GENERAL_EMAIL_SIGNATURE1")
        this.Txt_Sign1 = Rec.param_name3;
      if (Rec.param_name1 == "GENERAL_EMAIL_SIGNATURE2")
        this.Txt_Sign2 = Rec.param_name3;
      if (Rec.param_name1 == "GENERAL_EMAIL_SIGNATURE3")
        this.Txt_Sign3 = Rec.param_name3;
      if (Rec.param_name1 == "GENERAL_EMAIL_SIGNATURE4")
        this.Txt_Sign4 = Rec.param_name3;
      if (Rec.param_name1 == "GENERAL_EMAIL_SERVER")
        this.mailServer = Rec.param_name3;
      if (Rec.param_name1 == "GENERAL_FCL_QUOT_LABEL_OF") {
        this.Txt_Of = Rec.param_name3;
        this.Txt_Of_Order = Rec.param_value1;
      }
      if (Rec.param_name1 == "GENERAL_FCL_QUOT_LABEL_PSS") {
        this.Txt_Pss = Rec.param_name3;
        this.Txt_Pss_Order = Rec.param_value1;
      }
      if (Rec.param_name1 == "GENERAL_FCL_QUOT_LABEL_BAF") {
        this.Txt_Baf = Rec.param_name3;
        this.Txt_Baf_Order = Rec.param_value1;
      }
      if (Rec.param_name1 == "GENERAL_FCL_QUOT_LABEL_ISPS") {
        this.Txt_IsPs = Rec.param_name3;
        this.Txt_IsPs_order = Rec.param_value1;
      }
      if (Rec.param_name1 == "GENERAL_FCL_QUOT_LABEL_HAULAGE") {
        this.Txt_Haulage = Rec.param_name3;
        this.Txt_Haulage_Order = Rec.param_value1;
      }
      if (Rec.param_name1 == "GENERAL_FCL_QUOT_LABEL_IFS") {
        this.Txt_ISF = Rec.param_name3;
        this.Txt_ISF_Order = Rec.param_value1;
      }
      if (Rec.param_name1 == "GENERAL_BRANCH_CODE")
        this.Txt_Branch_Code = Rec.param_name3;




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

    this.errorMessage = '';

    if (!this.Allvalid())
      return;

    this.saveList = <TBL_MAST_PARAM[]>[];

    this.saveList.push(this.AddRecord("SOFTWARE VERSION", this.gs.branch_pkid, this.version));

    this.saveList.push(this.AddRecord("COMPANY_STRING_ID", this.gs.branch_pkid, this.Txt_Company_ID));
    this.saveList.push(this.AddRecord("GENERAL_EMAIL_NAME", this.gs.branch_pkid, this.Txt_Name));
    this.saveList.push(this.AddRecord("GENERAL_EMAIL_DISPLAY_NAME", this.gs.branch_pkid, this.Txt_Display_Name));
    this.saveList.push(this.AddRecord("GENERAL_EMAIL", this.gs.branch_pkid, this.Txt_Email));
    this.saveList.push(this.AddRecord("GENERAL_EMAIL_PWD", this.gs.branch_pkid, this.Txt_Password));
    this.saveList.push(this.AddRecord("GENERAL_EMAIL_CC", this.gs.branch_pkid, this.Txt_Cc));
    this.saveList.push(this.AddRecord("GENERAL_EMAIL_BCC", this.gs.branch_pkid, this.Txt_Bcc));

    this.saveList.push(this.AddRecord("GENERAL_EMAIL_SIGNATURE1", this.gs.branch_pkid, this.Txt_Sign1));
    this.saveList.push(this.AddRecord("GENERAL_EMAIL_SIGNATURE2", this.gs.branch_pkid, this.Txt_Sign2));
    this.saveList.push(this.AddRecord("GENERAL_EMAIL_SIGNATURE3", this.gs.branch_pkid, this.Txt_Sign3));
    this.saveList.push(this.AddRecord("GENERAL_EMAIL_SIGNATURE4", this.gs.branch_pkid, this.Txt_Sign4));


    if (this.mailServer == "")
      this.saveList.push(this.AddRecord("GENERAL_EMAIL_SERVER", this.gs.branch_pkid, ""));
    else
      this.saveList.push(this.AddRecord("GENERAL_EMAIL_SERVER", this.gs.branch_pkid, this.mailServer));

    this.saveList.push(this.AddRecord("GENERAL_FCL_QUOT_LABEL_OF", this.gs.branch_pkid, this.Txt_Of, this.Txt_Of_Order));
    this.saveList.push(this.AddRecord("GENERAL_FCL_QUOT_LABEL_PSS", this.gs.branch_pkid, this.Txt_Pss, this.Txt_Pss_Order));
    this.saveList.push(this.AddRecord("GENERAL_FCL_QUOT_LABEL_BAF", this.gs.branch_pkid, this.Txt_Baf, this.Txt_Baf_Order));
    this.saveList.push(this.AddRecord("GENERAL_FCL_QUOT_LABEL_ISPS", this.gs.branch_pkid, this.Txt_IsPs, this.Txt_IsPs_order));
    this.saveList.push(this.AddRecord("GENERAL_FCL_QUOT_LABEL_HAULAGE", this.gs.branch_pkid, this.Txt_Haulage, this.Txt_Haulage_Order));
    this.saveList.push(this.AddRecord("GENERAL_FCL_QUOT_LABEL_IFS", this.gs.branch_pkid, this.Txt_ISF, this.Txt_ISF_Order));
    this.saveList.push(this.AddRecord("GENERAL_BRANCH_CODE", this.gs.branch_pkid, this.Txt_Branch_Code));


    const saveRecord = <VM_TBL_MAST_SETTINGS>{};
    saveRecord.userinfo = this.gs.UserInfo;
    saveRecord.records = this.saveList;
    saveRecord.userinfo.PARAM_TYPE = 'GLOBAL SETTINGS';

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

  private AddRecord(SCATG: string, SPKID: string, ACNAME: string, NumValue: number = 0, pCODE: string = "", pNAME4: string = "") {
    let Rec = <TBL_MAST_PARAM>{};
    Rec.param_pkid = this.gs.getGuid();
    Rec.param_type = "GLOBAL SETTINGS";
    Rec.param_code = pCODE;
    Rec.param_name1 = SCATG;
    Rec.param_name2 = SPKID;
    Rec.param_name3 = ACNAME;
    Rec.param_name4 = pNAME4;
    Rec.param_value1 = NumValue;
    return Rec;
  }

  StageClick(_type: string) {
    if (_type == 'OCEAN IMPORT') {
      this.LBL_STAGES = "SHIPMENT STAGES - OCEAN IMPORT";
      this.LBL_STAGES_ID = "GENERAL_SHIPMENT_STAGE";
      this.STAGE_CODE = "OI";
    }
    if (_type == 'OCEAN EXPORT') {
      this.LBL_STAGES = "SHIPMENT STAGES - OCEAN EXPORT";
      this.LBL_STAGES_ID = "GENERAL_SHIPMENT_STAGE_OE";
      this.STAGE_CODE = "OE";
    }
    if (_type == 'AIR IMPORT') {
      this.LBL_STAGES = "SHIPMENT STAGES - AIR IMPORT";
      this.LBL_STAGES_ID = "GENERAL_SHIPMENT_STAGE_AI";
      this.STAGE_CODE = "AI";
    }
    if (_type == 'AIR EXPORT') {
      this.LBL_STAGES = "SHIPMENT STAGES - AIR EXPORT";
      this.LBL_STAGES_ID = "GENERAL_SHIPMENT_STAGE_AE";
      this.STAGE_CODE = "AE";
    }
    if (_type == 'OTHERS') {
      this.LBL_STAGES = "SHIPMENT STAGES - OTHERS";
      this.LBL_STAGES_ID = "GENERAL_SHIPMENT_STAGE_OT";
      this.STAGE_CODE = "OT";
    }
    this.LoadShipmentStage();
  }

  initStages() {
    this.Txt_Seq1 = 0; this.Txt_Stage1 = '';
    this.Txt_Seq2 = 0; this.Txt_Stage2 = '';
    this.Txt_Seq3 = 0; this.Txt_Stage3 = '';
    this.Txt_Seq4 = 0; this.Txt_Stage4 = '';
    this.Txt_Seq5 = 0; this.Txt_Stage5 = '';
    this.Txt_Seq6 = 0; this.Txt_Stage6 = '';
    this.Txt_Seq7 = 0; this.Txt_Stage7 = '';
    this.Txt_Seq8 = 0; this.Txt_Stage8 = '';
    this.Txt_Seq9 = 0; this.Txt_Stage9 = '';
    this.Txt_Seq10 = 0; this.Txt_Stage10 = '';
    this.Txt_Seq11 = 0; this.Txt_Stage11 = '';
    this.Txt_Seq12 = 0; this.Txt_Stage12 = '';
    this.Txt_Seq13 = 0; this.Txt_Stage13 = '';
    this.Txt_Seq14 = 0; this.Txt_Stage14 = '';
    this.Txt_Seq15 = 0; this.Txt_Stage15 = '';


  }

  LoadShipmentStage() {

    this.errorMessage = '';
    this.initStages();

    var SearchData = this.gs.UserInfo;
    SearchData.PARAM_TYPE = 'GLOBAL SETTINGS';
    SearchData.INVOKE_TYPE = 'SHIPMENT-STAGES';
    SearchData.STAGE_CATEGORY = this.LBL_STAGES_ID;
    SearchData.pkid = this.gs.getGuid();
    this.mainService.List(SearchData).subscribe(response => {
      this.stagesRecords = response.list;
      this.fillStages();
      this.sortList();
    }, error => {
      this.errorMessage = this.gs.getError(error)
    });
  }

  fillStages() {
    this.stagesRecords.forEach(Rec => {

      if (Rec.param_name4 == "STAGE1") {
        this.Txt_Seq1 = Rec.param_value1;
        this.Txt_Stage1 = Rec.param_name3;
      }
      if (Rec.param_name4 == "STAGE2") {
        this.Txt_Seq2 = Rec.param_value1;
        this.Txt_Stage2 = Rec.param_name3;
      }

      if (Rec.param_name4 == "STAGE3") {
        this.Txt_Seq3 = Rec.param_value1;
        this.Txt_Stage3 = Rec.param_name3;
      }

      if (Rec.param_name4 == "STAGE4") {
        this.Txt_Seq4 = Rec.param_value1;
        this.Txt_Stage4 = Rec.param_name3;
      }

      if (Rec.param_name4 == "STAGE5") {
        this.Txt_Seq5 = Rec.param_value1;
        this.Txt_Stage5 = Rec.param_name3;
      }

      if (Rec.param_name4 == "STAGE6") {
        this.Txt_Seq6 = Rec.param_value1;
        this.Txt_Stage6 = Rec.param_name3;
      }
      if (Rec.param_name4 == "STAGE7") {
        this.Txt_Seq7 = Rec.param_value1;
        this.Txt_Stage7 = Rec.param_name3;
      }

      if (Rec.param_name4 == "STAGE8") {
        this.Txt_Seq8 = Rec.param_value1;
        this.Txt_Stage8 = Rec.param_name3;
      }
      if (Rec.param_name4 == "STAGE9") {
        this.Txt_Seq9 = Rec.param_value1;
        this.Txt_Stage9 = Rec.param_name3;
      }

      if (Rec.param_name4 == "STAGE10") {
        this.Txt_Seq10 = Rec.param_value1;
        this.Txt_Stage10 = Rec.param_name3;
      }
      if (Rec.param_name4 == "STAGE11") {
        this.Txt_Seq11 = Rec.param_value1;
        this.Txt_Stage11 = Rec.param_name3;
      }
      if (Rec.param_name4 == "STAGE12") {
        this.Txt_Seq12 = Rec.param_value1;
        this.Txt_Stage12 = Rec.param_name3;
      }
      if (Rec.param_name4 == "STAGE13") {
        this.Txt_Seq13 = Rec.param_value1;
        this.Txt_Stage13 = Rec.param_name3;
      }
      if (Rec.param_name4 == "STAGE14") {
        this.Txt_Seq14 = Rec.param_value1;
        this.Txt_Stage14 = Rec.param_name3;
      }
      if (Rec.param_name4 == "STAGE15") {
        this.Txt_Seq15 = Rec.param_value1;
        this.Txt_Stage15 = Rec.param_name3;
      }
    });

  }

  SaveStages() {

    this.errorMessage = '';


    if (this.gs.isBlank(this.LBL_STAGES_ID)) {
      alert("Please Click a Shipment Stage and Continue.....");
      return;
    }

    
    this.saveList = <TBL_MAST_PARAM[]>[];
    this.SaveStageList();

    const saveRecord = <VM_TBL_MAST_SETTINGS>{};
    saveRecord.userinfo = this.gs.UserInfo;
    saveRecord.records = this.saveList;
    saveRecord.userinfo.PARAM_TYPE = 'GLOBAL SETTINGS';
    saveRecord.userinfo.INVOKE_TYPE = 'SHIPMENT-STAGES';
    saveRecord.userinfo.STAGE_CATEGORY = this.LBL_STAGES_ID;

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

  SaveStageList(){
    if (this.Txt_Stage1 != "")
      this.saveList.push(this.AddRecord(this.LBL_STAGES_ID + "1", this.gs.branch_pkid, this.Txt_Stage1, this.Txt_Seq1, this.STAGE_CODE, "STAGE1"));

    if (this.Txt_Stage2 != "")
      this.saveList.push(this.AddRecord(this.LBL_STAGES_ID + "2", this.gs.branch_pkid, this.Txt_Stage2, this.Txt_Seq2, this.STAGE_CODE, "STAGE2"));

    if (this.Txt_Stage3 != "")
      this.saveList.push(this.AddRecord(this.LBL_STAGES_ID + "3", this.gs.branch_pkid, this.Txt_Stage3, this.Txt_Seq3, this.STAGE_CODE, "STAGE3"));

    if (this.Txt_Stage4 != "")
      this.saveList.push(this.AddRecord(this.LBL_STAGES_ID + "4", this.gs.branch_pkid, this.Txt_Stage4, this.Txt_Seq4, this.STAGE_CODE, "STAGE4"));

    if (this.Txt_Stage5 != "")
      this.saveList.push(this.AddRecord(this.LBL_STAGES_ID + "5", this.gs.branch_pkid, this.Txt_Stage5, this.Txt_Seq5, this.STAGE_CODE, "STAGE5"));

    if (this.Txt_Stage6 != "")
      this.saveList.push(this.AddRecord(this.LBL_STAGES_ID + "6", this.gs.branch_pkid, this.Txt_Stage6, this.Txt_Seq6, this.STAGE_CODE, "STAGE6"));

    if (this.Txt_Stage7 != "")
      this.saveList.push(this.AddRecord(this.LBL_STAGES_ID + "7", this.gs.branch_pkid, this.Txt_Stage7, this.Txt_Seq7, this.STAGE_CODE, "STAGE7"));

    if (this.Txt_Stage8 != "")
      this.saveList.push(this.AddRecord(this.LBL_STAGES_ID + "8", this.gs.branch_pkid, this.Txt_Stage8, this.Txt_Seq8, this.STAGE_CODE, "STAGE8"));

    if (this.Txt_Stage9 != "")
      this.saveList.push(this.AddRecord(this.LBL_STAGES_ID + "9", this.gs.branch_pkid, this.Txt_Stage9, this.Txt_Seq9, this.STAGE_CODE, "STAGE9"));

    if (this.Txt_Stage10 != "")
      this.saveList.push(this.AddRecord(this.LBL_STAGES_ID + "10", this.gs.branch_pkid, this.Txt_Stage10, this.Txt_Seq10, this.STAGE_CODE, "STAGE10"));

    if (this.Txt_Stage11 != "")
      this.saveList.push(this.AddRecord(this.LBL_STAGES_ID + "11", this.gs.branch_pkid, this.Txt_Stage11, this.Txt_Seq11, this.STAGE_CODE, "STAGE11"));

    if (this.Txt_Stage12 != "")
      this.saveList.push(this.AddRecord(this.LBL_STAGES_ID + "12", this.gs.branch_pkid, this.Txt_Stage12, this.Txt_Seq12, this.STAGE_CODE, "STAGE12"));

    if (this.Txt_Stage13 != "")
      this.saveList.push(this.AddRecord(this.LBL_STAGES_ID + "13", this.gs.branch_pkid, this.Txt_Stage13, this.Txt_Seq13, this.STAGE_CODE, "STAGE213"));

    if (this.Txt_Stage14 != "")
      this.saveList.push(this.AddRecord(this.LBL_STAGES_ID + "14", this.gs.branch_pkid, this.Txt_Stage14, this.Txt_Seq14, this.STAGE_CODE, "STAGE14"));

    if (this.Txt_Stage15 != "")
      this.saveList.push(this.AddRecord(this.LBL_STAGES_ID + "15", this.gs.branch_pkid, this.Txt_Stage15, this.Txt_Seq15, this.STAGE_CODE, "STAGE15"));

  }



  sortList(){

    this.saveList = <TBL_MAST_PARAM[]>[];
    this.SaveStageList();
    this.sortedList = this.saveList.sort( (a,b) => (a.param_value1  > b.param_value1 ? 1 : -1)  )

  }


  Allvalid(): boolean {
    var bRet = true;
    this.errorMessage = "";
    return bRet;
  }

  Close() {
    this.location.back();
  }

  changeTab(_tab : string ){
    this.tab = _tab;
    this.errorMessage = '';
  }

}
