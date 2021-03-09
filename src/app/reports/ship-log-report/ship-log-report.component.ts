import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { ReportService } from '../services/report.service';
import { Tbl_cargo_general } from '../../other/models/tbl_cargo_general'
import { Tbl_shipment_stage } from '../models/tbl_shipment_stage';
import { SearchTable } from '../../shared/models/searchtable';


import { Store, State, select } from '@ngrx/store';
import *  as myActions from './store/ship-log-report.actions';
import *  as myReducer from './store/ship-log-report.reducer';
import { ReportState } from './store/ship-log-report.models'

import { Observable } from 'rxjs';

@Component({
  selector: 'app-ship-log-report',
  templateUrl: './ship-log-report.component.html',
})
export class ShipmentLogReportComponent implements OnInit {

  title: string = 'Shipment Log Report';

  @ViewChild('chkbox0') mChkBox0: ElementRef;
  @ViewChild('chkbox1') mChkBox1: ElementRef;
  @ViewChild('chkbox2') mChkBox2: ElementRef;
  @ViewChild('chkbox3') mChkBox3: ElementRef;
  @ViewChild('chkbox4') mChkBox4: ElementRef;
  @ViewChild('chkbox5') mChkBox5: ElementRef;
  @ViewChild('chkbox6') mChkBox6: ElementRef;
  @ViewChild('chkbox7') mChkBox7: ElementRef;
  @ViewChild('chkbox8') mChkBox8: ElementRef;
  @ViewChild('chkbox9') mChkBox9: ElementRef;
  @ViewChild('chkbox10') mChkBox10: ElementRef;
  @ViewChild('chkbox11') mChkBox11: ElementRef;
  @ViewChild('chkbox12') mChkBox12: ElementRef;
  @ViewChild('chkbox13') mChkBox13: ElementRef;
  @ViewChild('chkbox14') mChkBox14: ElementRef;
  @ViewChild('chkbox15') mChkBox15: ElementRef;


  pkid: string;
  urlid: string;
  url: string;
  menuid: string;

  currentTab: string = '';

  report_url: string;
  report_searchdata: any = {};
  report_menuid: string;

  job_mode: string = "OCEAN IMPORT";
  date_basedon: string = "REF. DATE";
  sdate: string;
  edate: string;
  shipper_id: string;
  shipper_name: string;
  consignee_id: string;
  consignee_name: string;
  agent_id: string;
  agent_name: string;
  handled_basedon: string = "HANDLED BY";
  handled_id: string;
  handled_name: string;
  report_masterwise: boolean = false;
  report_housewise: boolean = false;
  checkList: any[] = [{ "code": "Stage1", "name": "Stage1", "ischecked": false }, { "code": "Stage2", "name": "Stage2", "ischecked": false }, { "code": "Stage3", "name": "Stage3", "ischecked": false }, { "code": "Stage4", "name": "Stage4", "ischecked": false },
  { "code": "Stage5", "name": "Stage5", "ischecked": false }, { "code": "Stage6", "name": "Stage6", "ischecked": false }, { "code": "Stage7", "name": "Stage7", "ischecked": false }, { "code": "Stage8", "name": "Stage8", "ischecked": false },
  { "code": "Stage9", "name": "Stage9", "ischecked": false }, { "code": "Stage10", "name": "Stage10", "ischecked": false }, { "code": "Stage11", "name": "Stage11", "ischecked": false }, { "code": "Stage12", "name": "Stage12", "ischecked": false },
  { "code": "Stage13", "name": "Stage13", "ischecked": false }, { "code": "Stage14", "name": "Stage14", "ischecked": false }, { "code": "Stage15", "name": "Stage15", "ischecked": false }, { "code": "Stage16", "name": "Stage16", "ischecked": false },];
  sort_order: string = "mbl_refno";
  format_type: string = "FORMAT-1";
  printer_friendly: boolean = false;

  reportformat: string = '';


  page_count: number = 0;
  page_current: number = 0;
  page_rows: number = 0;
  page_rowcount: number = 0;

  storesub: any;
  sub: any;
  tab: string = 'main';

  isRecStored: boolean = false;

  chklstCol2Visible: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';

  SearchData: any = {};

  Reportstate1: Observable<ReportState>;

  MainList: Tbl_cargo_general[];

  constructor(
    public gs: GlobalService,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private location: Location,
    private store: Store<myReducer.AppState>,
    private mainservice: ReportService
  ) {
    this.sub = this.activatedroute.queryParams.subscribe(params => {
      this.urlid = params.id;
      this.menuid = params.menuid;
      this.InitPage();
    });
  }

  InitPage() {

    this.storesub = this.store.select(myReducer.getState(this.urlid)).subscribe(rec => {
      this.initLov();
      if (rec) {
        this.isRecStored = true;
        this.MainList = rec.records;
        this.pkid = rec.pkid;
        this.currentTab = rec.currentTab;
        this.job_mode = rec.job_mode == "OTHERS" ? "OTHER OPERATION" : rec.job_mode;
        this.date_basedon = rec.date_basedon;
        this.sdate = rec.sdate;
        this.edate = rec.edate;
        this.shipper_id = rec.shipper_id;
        this.shipper_name = rec.shipper_name;
        this.consignee_id = rec.consignee_id;
        this.consignee_name = rec.consignee_name;
        this.agent_id = rec.agent_id;
        this.agent_name = rec.agent_name;
        this.handled_basedon = rec.handled_basedon;
        this.handled_id = rec.handled_id;
        this.handled_name = rec.handled_name;
        this.report_masterwise = rec.report_masterwise;
        this.report_housewise = rec.report_housewise;
        this.checkList = JSON.parse(JSON.stringify(rec.checkList));
        this.sort_order = rec.sort_order;
        this.format_type = rec.format_type;
        this.printer_friendly = rec.printer_friendly;
        this.reportformat = rec.reportformat;

        this.page_rows = rec.page_rows;
        this.page_count = rec.page_count;
        this.page_current = rec.page_current;
        this.page_rowcount = rec.page_rowcount;

        this.SearchData = this.gs.UserInfo;

        this.SearchData.SHOWSTAGES = this.GetStages();;
        this.SearchData.SORT = this.sort_order.replace("mbl_no", "hbl_houseno"); //In gridlist filed hbl_houseno is used for both houseno and masterno;
        this.SearchData.HANDLED_TYPE = this.handled_basedon;
        this.SearchData.HANDLED_ID = this.handled_id;
        this.SearchData.MASTER_AGENT_ID = this.agent_id;
        this.SearchData.CONSIGNEE_ID = this.consignee_id;
        this.SearchData.SHIPPER_ID = this.shipper_id;
        if (this.job_mode == "OTHER OPERATION")
          this.SearchData.SMODE = 'OTHERS';
        else
          this.SearchData.SMODE = this.job_mode;
        this.SearchData.MASTER_WISE = this.report_masterwise == true ? "Y" : "N";
        this.SearchData.HOUSE_WISE = this.report_housewise == true ? "Y" : "N";
        this.SearchData.OVERRIDE_ETA = this.gs.SEA_IMP_OVERRIDE_POD_ETA;
        this.SearchData.DATE_TYPE = this.date_basedon;
        this.SearchData.SDATE = this.sdate;
        this.SearchData.EDATE = this.edate;
        this.SearchData.FORMAT_TYPE = this.format_type;
        this.SearchData.PRINTER_FRIENDLY = this.printer_friendly == true ? "Y" : "N";

      }
      else {
        this.isRecStored = false;
        this.MainList = Array<Tbl_cargo_general>();
        this.page_rows = this.gs.ROWS_TO_DISPLAY;
        this.page_count = 0;
        this.page_current = 0;
        this.page_rowcount = 0;
        this.currentTab = 'LIST';

        this.job_mode = 'OCEAN IMPORT';
        this.date_basedon = 'REF. DATE';
        this.sdate = this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF);
        this.edate = this.gs.defaultValues.today;
        this.shipper_id = '';
        this.shipper_name = '';
        this.consignee_id = '';
        this.consignee_name = '';
        this.agent_id = '';
        this.agent_name = '';
        this.handled_basedon = 'HANDLED BY';
        this.handled_id = '';
        this.handled_name = '';
        this.report_masterwise = true;
        this.report_housewise = false;
        this.checkList = [{ "code": "Stage1", "name": "Stage1", "ischecked": false }, { "code": "Stage2", "name": "Stage2", "ischecked": false }, { "code": "Stage3", "name": "Stage3", "ischecked": false }, { "code": "Stage4", "name": "Stage4", "ischecked": false },
        { "code": "Stage5", "name": "Stage5", "ischecked": false }, { "code": "Stage6", "name": "Stage6", "ischecked": false }, { "code": "Stage7", "name": "Stage7", "ischecked": false }, { "code": "Stage8", "name": "Stage8", "ischecked": false },
        { "code": "Stage9", "name": "Stage9", "ischecked": false }, { "code": "Stage10", "name": "Stage10", "ischecked": false }, { "code": "Stage11", "name": "Stage11", "ischecked": false }, { "code": "Stage12", "name": "Stage12", "ischecked": false },
        { "code": "Stage13", "name": "Stage13", "ischecked": false }, { "code": "Stage14", "name": "Stage14", "ischecked": false }, { "code": "Stage15", "name": "Stage15", "ischecked": false }, { "code": "Stage16", "name": "Stage16", "ischecked": false },];
        this.sort_order = 'mbl_refno'
        this.format_type = 'FORMAT-1';
        this.printer_friendly = false;
        this.reportformat = 'FORMAT-1';
        this.SearchData = this.gs.UserInfo;
        this.SetStages();
      }
    });


  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.storesub.unsubscribe();
  }

  PageEvents(actions) {
    this.page_current = actions.page_current;
    this.List(actions.outputformat, actions.action);
  }

  List(_outputformat: string, _action: string = 'NEW') {

    this.errorMessage = '';
    if (this.gs.isBlank(this.job_mode)) {
      this.errorMessage = 'Shipment Mode cannot be blank';
      alert(this.errorMessage);
      return;
    }

    if (this.report_masterwise == false && this.report_housewise == false) {
      this.errorMessage = 'Either Master or House must be selected';
      alert(this.errorMessage);
      return;
    }

    this.SearchData.outputformat = _outputformat;
    this.SearchData.pkid = this.urlid;
    this.SearchData.action = _action;
    this.SearchData.page_count = this.page_count;
    this.SearchData.page_current = this.page_current;
    this.SearchData.page_rows = this.page_rows;
    this.SearchData.page_rowcount = this.page_rowcount;

    if (_outputformat == "SCREEN" && _action == 'NEW') {
      this.SearchData.page_current = -1;
      this.SearchData.SHOWSTAGES = this.GetStages();
      this.SearchData.SORT = this.sort_order.replace("mbl_no", "hbl_houseno"); //In gridlist filed hbl_houseno is used for both houseno and masterno;
      this.SearchData.HANDLED_TYPE = this.handled_basedon;
      this.SearchData.HANDLED_ID = this.handled_id;
      this.SearchData.MASTER_AGENT_ID = this.agent_id;
      this.SearchData.CONSIGNEE_ID = this.consignee_id;
      this.SearchData.SHIPPER_ID = this.shipper_id;
      if (this.job_mode == "OTHER OPERATION")
        this.SearchData.SMODE = 'OTHERS';
      else
        this.SearchData.SMODE = this.job_mode;
      this.SearchData.MASTER_WISE = this.report_masterwise == true ? "Y" : "N";
      this.SearchData.HOUSE_WISE = this.report_housewise == true ? "Y" : "N";
      this.SearchData.OVERRIDE_ETA = this.gs.SEA_IMP_OVERRIDE_POD_ETA;
      this.SearchData.DATE_TYPE = this.date_basedon;
      this.SearchData.SDATE = this.sdate;
      this.SearchData.EDATE = this.edate;
      this.SearchData.FORMAT_TYPE = this.format_type;
      this.SearchData.PRINTER_FRIENDLY = this.printer_friendly == true ? "Y" : "N";

      this.reportformat = this.format_type;
    }

    this.loading = true;

    this.mainservice.ShipmentLogReport(this.SearchData)
      .subscribe(response => {

        if (_outputformat == "SCREEN") {

          if (_action == "NEW") {
            this.SearchData.filename = response.filename;
            this.SearchData.filedisplayname = response.filedisplayname;
            this.SearchData.filetype = response.filetype;
          }
          const state: ReportState = {

            pkid: this.pkid,
            urlid: this.urlid,
            menuid: this.menuid,
            currentTab: this.currentTab,

            job_mode: this.SearchData.SMODE,
            date_basedon: this.SearchData.DATE_TYPE,
            sdate: this.SearchData.SDATE,
            edate: this.SearchData.EDATE,
            shipper_id: this.SearchData.SHIPPER_ID,
            shipper_name: this.shipper_name,
            consignee_id: this.SearchData.CONSIGNEE_ID,
            consignee_name: this.consignee_name,
            agent_id: this.SearchData.MASTER_AGENT_ID,
            agent_name: this.agent_name,
            handled_basedon: this.SearchData.HANDLED_TYPE,
            handled_id: this.SearchData.HANDLED_ID,
            handled_name: this.handled_name,
            report_masterwise: this.SearchData.MASTER_WISE == "Y" ? true : false,
            report_housewise: this.SearchData.HOUSE_WISE == "Y" ? true : false,
            checkList: this.checkList,
            sort_order: this.SearchData.SORT,
            format_type: this.format_type,
            printer_friendly: this.printer_friendly,

            reportformat: this.reportformat,

            page_rows: response.page_rows,
            page_count: response.page_count,
            page_current: response.page_current,
            page_rowcount: response.page_rowcount,
            records: response.list
          };
          this.store.dispatch(new myActions.Update({ id: this.urlid, changes: state }));
        }

        this.loading = false;
      }, error => {
        this.loading = false;
        this.errorMessage = this.gs.getError(error);
        alert(this.errorMessage);
      });
  }

  GetStages() {
    let Stages: string = "";
    for (let i = 0; i < 16; i++) {
      if (this.checkList[i].name.length > 0 && this.checkList[i].ischecked == true) {
        if (Stages != "")
          Stages += ",";
        Stages += "'" + this.checkList[i].code + "'";
      }
    }
    return Stages;
  }

  Close() {
    this.store.dispatch(new myActions.Delete({ id: this.urlid }));
    this.location.back();
  }

  initLov(caption: string = '') {


  }

  LovSelected(_Record: SearchTable) {

    if (_Record.controlname == "SHIPPER") {
      this.shipper_id = _Record.id;
      this.shipper_name = _Record.name;
    }
    if (_Record.controlname == "CONSIGNEE") {
      this.consignee_id = _Record.id;
      this.consignee_name = _Record.name;
    }

    if (_Record.controlname == "AGENT") {
      this.agent_id = _Record.id;
      this.agent_name = _Record.name;
    }
    if (_Record.controlname == "HANDLEDBY") {
      this.handled_id = _Record.id;
      this.handled_name = _Record.name;
    }


  }

  OnChange(field: string) {
    if (field == 'job_mode') {
      this.SetStages();
    }
  }

  SetStages() {
    this.chklstCol2Visible = false;
    for (let i = 0; i < 16; i++) {
      this.checkList[i].code = "";
      this.checkList[i].name = "";
      this.checkList[i].ischecked = false;
    }
    if (this.job_mode == "OCEAN EXPORT") {
      this.FillStages(this.gs.SHIPMENT_STAGE_OE, "OE");
    }
    else if (this.job_mode == "AIR EXPORT") {
      this.FillStages(this.gs.SHIPMENT_STAGE_AE, "AE");
    }
    else if (this.job_mode == "AIR IMPORT") {
      this.FillStages(this.gs.SHIPMENT_STAGE_AI, "AI");
    }
    else if (this.job_mode == "OTHER OPERATION") {
      this.FillStages(this.gs.SHIPMENT_STAGE_OT, "OT");
    }
    else // OCEAN IMPORT
    {
      this.FillStages(this.gs.SHIPMENT_STAGE_OI, "OI");
    }

    for (let i = 0; i < 16; i++) {
      if (this.checkList[i].name.length > 0) {
        this.checkList[i].ischecked = this.checkList[i].name == "NIL" ? false : true;
        if (i > 7)
          this.chklstCol2Visible = true;
      }
    }
  }

  FillStages(stageList: any, OprMode: string) {
    let slno: number = 0;
    stageList.forEach(Rec => {
      if (Rec.name != "NIL") {
        this.checkList[slno].code = Rec.code;
        this.checkList[slno].name = Rec.name;
        slno++;
      }
    })
    this.checkList[slno].code = "NIL";
    this.checkList[slno].name = "NIL";
  }



  Print() {
    this.errorMessage = "";
    // if (this.MainList.length <= 0) {
    //   this.errorMessage = "List Not Found";
    //   alert(this.errorMessage);
    //   return;
    // }
    // this.report_url = '';
    // this.report_searchdata = this.gs.UserInfo;
    // this.report_searchdata.pkid = '';
    // this.report_menuid = this.menuid;

    this.report_url = '/api/Other/Report/ShipmentLogPrint';
    this.report_menuid = this.menuid;
    this.report_searchdata.pkid = '';
    this.report_searchdata = this.gs.UserInfo;
    this.report_searchdata.SHOWSTAGES = this.GetStages();
    this.report_searchdata.SORT = this.sort_order.replace("mbl_no", "hbl_houseno"); //In gridlist filed hbl_houseno is used for both houseno and masterno;
    this.report_searchdata.HANDLED_TYPE = this.handled_basedon;
    this.report_searchdata.HANDLED_ID = this.handled_id;
    this.report_searchdata.MASTER_AGENT_ID = this.agent_id;
    this.report_searchdata.CONSIGNEE_ID = this.consignee_id;
    this.report_searchdata.SHIPPER_ID = this.shipper_id;
    if (this.job_mode == "OTHER OPERATION")
      this.report_searchdata.SMODE = 'OTHERS';
    else
      this.report_searchdata.SMODE = this.job_mode;
    this.report_searchdata.MASTER_WISE = this.report_masterwise == true ? "Y" : "N";
    this.report_searchdata.HOUSE_WISE = this.report_housewise == true ? "Y" : "N";
    this.report_searchdata.OVERRIDE_ETA = this.gs.SEA_IMP_OVERRIDE_POD_ETA;
    this.report_searchdata.DATE_TYPE = this.date_basedon;
    this.report_searchdata.SDATE = this.sdate;
    this.report_searchdata.EDATE = this.edate;
    this.report_searchdata.FORMAT_TYPE = this.format_type;
    this.report_searchdata.PRINTER_FRIENDLY = this.printer_friendly == true ? "Y" : "N";
    this.report_searchdata.SHIPPER_NAME = this.shipper_name;
    this.report_searchdata.CONSIGNEE_NAME = this.consignee_name;
    this.report_searchdata.AGENT_NAME = this.agent_name;
    this.report_searchdata.HANDLED_NAME = this.handled_name;

    this.tab = 'report';
  }

  callbackevent() {
    this.tab = 'main';
  }

  onBlur(field: string = '') {

  }

  SelectDeselect(_type: string) {
    if (this.isRecStored)
      this.store.dispatch(new myActions.SelectDeselect({ id: this.urlid, flag: _type == "SELECT" ? true : false }));
    else {
      for (let i = 0; i < 16; i++) {
        if (this.checkList[i].name.length > 0)
          this.checkList[i].ischecked = _type == "SELECT" ? true : false;
      }
    }

  }
  SelectDeselect2(_code: string, _chkedseq: number) {
    if (this.isRecStored) {
      if (_chkedseq == 0)
        this.store.dispatch(new myActions.SingleSelectDeselect({ urlid: this.urlid, id: _code, flag: this.mChkBox0.nativeElement.checked }));
      else if (_chkedseq == 1)
        this.store.dispatch(new myActions.SingleSelectDeselect({ urlid: this.urlid, id: _code, flag: this.mChkBox1.nativeElement.checked }));
      else if (_chkedseq == 2)
        this.store.dispatch(new myActions.SingleSelectDeselect({ urlid: this.urlid, id: _code, flag: this.mChkBox2.nativeElement.checked }));
      else if (_chkedseq == 3)
        this.store.dispatch(new myActions.SingleSelectDeselect({ urlid: this.urlid, id: _code, flag: this.mChkBox3.nativeElement.checked }));
      else if (_chkedseq == 4)
        this.store.dispatch(new myActions.SingleSelectDeselect({ urlid: this.urlid, id: _code, flag: this.mChkBox4.nativeElement.checked }));
      else if (_chkedseq == 5)
        this.store.dispatch(new myActions.SingleSelectDeselect({ urlid: this.urlid, id: _code, flag: this.mChkBox5.nativeElement.checked }));
      else if (_chkedseq == 6)
        this.store.dispatch(new myActions.SingleSelectDeselect({ urlid: this.urlid, id: _code, flag: this.mChkBox6.nativeElement.checked }));
      else if (_chkedseq == 7)
        this.store.dispatch(new myActions.SingleSelectDeselect({ urlid: this.urlid, id: _code, flag: this.mChkBox7.nativeElement.checked }));
      else if (_chkedseq == 8)
        this.store.dispatch(new myActions.SingleSelectDeselect({ urlid: this.urlid, id: _code, flag: this.mChkBox8.nativeElement.checked }));
      else if (_chkedseq == 9)
        this.store.dispatch(new myActions.SingleSelectDeselect({ urlid: this.urlid, id: _code, flag: this.mChkBox9.nativeElement.checked }));
      else if (_chkedseq == 10)
        this.store.dispatch(new myActions.SingleSelectDeselect({ urlid: this.urlid, id: _code, flag: this.mChkBox10.nativeElement.checked }));
      else if (_chkedseq == 11)
        this.store.dispatch(new myActions.SingleSelectDeselect({ urlid: this.urlid, id: _code, flag: this.mChkBox11.nativeElement.checked }));
      else if (_chkedseq == 12)
        this.store.dispatch(new myActions.SingleSelectDeselect({ urlid: this.urlid, id: _code, flag: this.mChkBox12.nativeElement.checked }));
      else if (_chkedseq == 13)
        this.store.dispatch(new myActions.SingleSelectDeselect({ urlid: this.urlid, id: _code, flag: this.mChkBox13.nativeElement.checked }));
      else if (_chkedseq == 14)
        this.store.dispatch(new myActions.SingleSelectDeselect({ urlid: this.urlid, id: _code, flag: this.mChkBox14.nativeElement.checked }));
      else if (_chkedseq == 15)
        this.store.dispatch(new myActions.SingleSelectDeselect({ urlid: this.urlid, id: _code, flag: this.mChkBox15.nativeElement.checked }));
    }

  }

  editmaster(_record: Tbl_cargo_general) {
    let sID: string = (_record.mbl_pkid != null) ? _record.mbl_pkid.toString() : "";
    let REFNO: string = _record.mbl_refno != null ? _record.mbl_refno.toString() : "";
    let sMode: string = _record.mbl_mode != null ? _record.mbl_mode.toString() : "";
    if (sID == "") {
      alert("Invalid Record Selected");
      return;
    }
   this.gs.LinkPage("REFNO", sMode, REFNO, sID);
  }


  edithouse(_record: Tbl_cargo_general) {
    let sID: string = (_record.mbl_pkid != null) ? _record.mbl_pkid.toString() : "";
    let REFNO: string = _record.mbl_refno != null ? _record.mbl_refno.toString() : "";
    let sMode: string = _record.mbl_mode != null ? _record.mbl_mode.toString() : "";
    let HBLID: string = _record.hbl_pkid != null ? _record.hbl_pkid.toString() : "";

    if (HBLID == "") {
      alert("Invalid Record Selected");
      return;
    }
    this.gs.LinkPage("HOUSE", sMode, REFNO, sID, HBLID);
  }
}
