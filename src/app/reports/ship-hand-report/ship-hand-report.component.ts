import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { ReportService } from '../services/report.service';
import { TBL_MBL_REPORT } from '../models/tbl_mbl_report';
import { SearchTable } from '../../shared/models/searchtable';


import { Store, State, select } from '@ngrx/store';
import *  as myActions from './store/ship-hand-report.actions';
import *  as myReducer from './store/ship-hand-report.reducer';
import { ReportState } from './store/ship-hand-report.models'

import { Observable } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-ship-hand-report',
  templateUrl: './ship-hand-report.component.html',
  styleUrls: ['./ship-hand-report.component.css']
})
export class ShipHandReportComponent implements OnInit {

  title: string = 'Shipment Handled Report ';

  pkid: string;
  urlid: string;
  url: string;
  menuid: string;

  report_url: string;
  report_searchdata: any = {};
  report_menuid: string;

  currentTab: string = '';
  from_date: string;
  to_date: string;
  job_type: string = '';
  group: string = '';
  branch: string = '';

  handled_id: string;
  handled_name: string;

  reporttype = '';
  filename: string = '';
  filetype: string = '';
  filedisplayname: string = '';

  page_count: number = 0;
  page_current: number = 0;
  page_rows: number = 0;
  page_rowcount: number = 0;

  storesub: any;
  sub: any;
  tab: string = 'main';

  loading: boolean = false;
  errorMessage: string = '';

  SearchData: any = {};

  mainState: ReportState;

  MainList: TBL_MBL_REPORT[];

  USERRECORD: SearchTable = new SearchTable();
  //private LSESSION = 0;

  constructor(
    public gs: GlobalService,
    private router: Router,
    public route: ActivatedRoute,
    private location: Location,
    private store: Store<myReducer.AppState>,
    private mainservice: ReportService
  ) {

    this.sub = this.route.queryParams.subscribe(params => {
      this.urlid = params.id;
      this.menuid = params.menuid;
      this.InitPage();
    });


  }

  ClearStore() {
    this.store.dispatch(new myActions.Delete({ id: this.urlid }));
  }

  InitPage() {

    // if (this.LSESSION < this.gs.GSESSION) {
    //   this.LSESSION = this.gs.GSESSION;
    //   this.store.dispatch(new myActions.Delete({ id: this.urlid }));
    // }

    this.storesub = this.store.select(myReducer.getState(this.urlid)).subscribe(rec => {
      this.initLov();
      if (rec) {
        this.MainList = rec.records;
        this.pkid = rec.pkid;
        this.currentTab = rec.currentTab;
        this.from_date = rec.from_date;
        this.to_date = rec.to_date;
        this.job_type = rec.job_type;
        this.group = rec.group;
        this.branch = rec.branch;
        this.handled_id = rec.handled_id;
        this.handled_name = rec.handled_name;
        this.reporttype = rec.reporttype;
        this.filename = rec.filename;
        this.filetype = rec.filetype;
        this.filedisplayname = rec.filedisplayname;
        this.page_rows = rec.page_rows;
        this.page_count = rec.page_count;
        this.page_current = rec.page_current;
        this.page_rowcount = rec.page_rowcount;


        this.SearchData = this.gs.UserInfo;
        this.SearchData.SDATE = this.from_date;
        this.SearchData.EDATE = this.to_date;
        this.SearchData.MODE = this.job_type;
        this.SearchData.COMP_TYPE = this.branch;
        if (this.branch == 'ALL')
          this.SearchData.COMP_CODE = this.gs.branch_codes;
        else
          this.SearchData.COMP_CODE = this.branch;

        this.SearchData.COMP_NAME = this.gs.branch_name;
        this.SearchData.HANDLED_ID = this.handled_id;
        this.SearchData.HANDLED_NAME = this.handled_name;

        this.SearchData.VIEW_MODE = this.group;

        this.USERRECORD.id = this.handled_id;
        this.USERRECORD.name = this.handled_name;

      }
      else {

        this.MainList = Array<TBL_MBL_REPORT>();

        this.page_rows = this.gs.ROWS_TO_DISPLAY;
        this.page_count = 0;
        this.page_current = 0;
        this.page_rowcount = 0;

        this.currentTab = 'LIST';
        this.from_date = this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF);
        this.to_date = this.gs.defaultValues.today;
        this.job_type = 'OCEAN IMPORT';
        this.group = 'MASTER DETAILS';
        this.branch = this.gs.branch_code;
        this.handled_id = "";
        this.handled_name = "";
        this.reporttype = 'MASTER DETAILS';
        this.filename = '';
        this.filetype = '';
        this.filedisplayname = '';


        this.SearchData = this.gs.UserInfo;

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
    this.List(actions.outputformat, actions.action);
  }

  List(_outputformat: string, _action: string = 'NEW') {

    this.SearchData.outputformat = _outputformat;
    this.SearchData.pkid = this.urlid;
    this.SearchData.action = _action;
    this.SearchData.page_count = this.page_count;
    this.SearchData.page_current = this.page_current;
    this.SearchData.page_rows = this.page_rows;
    this.SearchData.page_rowcount = this.page_rowcount;

    if (_outputformat == "SCREEN" && _action == 'NEW') {
      this.SearchData.SDATE = this.from_date;
      this.SearchData.EDATE = this.to_date;
      this.SearchData.MODE = this.job_type;
      this.SearchData.COMP_TYPE = this.branch;
      if (this.branch == 'ALL')
        this.SearchData.COMP_CODE = this.gs.branch_codes;
      else
        this.SearchData.COMP_CODE = this.branch;
      this.SearchData.COMP_NAME = this.gs.branch_name;
      this.SearchData.HANDLED_ID = this.handled_id;
      this.SearchData.HANDLED_NAME = this.handled_name;

      this.SearchData.VIEW_MODE = this.group;
      this.reporttype = this.group;
      this.SearchData.filename = "";
      this.SearchData.filedisplayname = "";
      this.SearchData.filetype = "";
    }

    this.loading = true;

    this.mainservice.ShipmentHandledReport(this.SearchData)
      .subscribe(response => {

        if (_outputformat == "SCREEN") {

          if (_action == "NEW") {
            this.SearchData.filename = response.filename;
            this.SearchData.filedisplayname = response.filedisplayname;
            this.SearchData.filetype = response.filetype;
          }

          this.mainState = {
            pkid: this.pkid,
            urlid: this.urlid,
            menuid: this.menuid,
            currentTab: this.currentTab,
            from_date: this.SearchData.SDATE,
            to_date: this.SearchData.EDATE,
            job_type: this.SearchData.MODE,
            group: this.SearchData.VIEW_MODE,
            branch: this.SearchData.COMP_TYPE,
            handled_id: this.SearchData.HANDLED_ID,
            handled_name: this.SearchData.HANDLED_NAME,
            reporttype: this.reporttype,
            page_rows: response.page_rows,
            page_count: response.page_count,
            page_current: response.page_current,
            page_rowcount: response.page_rowcount,
            records: response.list,
            filename: this.SearchData.filename,
            filetype: this.SearchData.filetype,
            filedisplayname: this.SearchData.filedisplayname
          };
          this.store.dispatch(new myActions.Update({ id: this.urlid, changes: this.mainState }));
        }

        this.loading = false;
      }, error => {
        this.loading = false;
        this.errorMessage = error.error.error_description;
        alert(this.errorMessage);
      });
  }

  Close() {
    this.store.dispatch(new myActions.Delete({ id: this.urlid }));
    this.location.back();
  }

  initLov(caption: string = '') {
    this.USERRECORD = new SearchTable();
    this.USERRECORD.controlname = "SALESMAN";
    this.USERRECORD.displaycolumn = "NAME";
    this.USERRECORD.type = "PARAM";
    this.USERRECORD.subtype = "SALESMAN";
    this.USERRECORD.id = "";
    this.USERRECORD.code = "";

  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "SALESMAN") {
      this.handled_id = _Record.id;
      this.handled_name = _Record.name;
    }
  }

  Print() {
    this.errorMessage = "";
    if (this.MainList.length <= 0) {
      this.errorMessage = "List Not Found";
      alert(this.errorMessage);
      return;
    }
    this.report_url = '';
    this.report_searchdata = this.gs.UserInfo;
    this.report_searchdata.pkid = '';
    this.report_menuid = this.menuid;
    this.tab = 'report';
  }

  callbackevent() {
    this.tab = 'main';
  }

  editmaster(_record: TBL_MBL_REPORT) {

    let sID: string = (_record.mbl_pkid != null) ? _record.mbl_pkid.toString() : "";
    let REFNO: string = _record.mbl_refno != null ? _record.mbl_refno.toString() : "";
    let sMode: string = _record.mbl_mode != null ? _record.mbl_mode.toString() : "";
    let branch_name: string = _record.mbl_branch != null ? _record.mbl_branch.toString() : "";

    if (sID == "") {
      alert("Invalid Record Selected");
      return;
    }
    if (branch_name == this.gs.branch_name) {
      this.gs.LinkPage("REFNO", sMode, REFNO, sID);
    }
    else {
      alert("Cannot Show Details from another Branch");
    }
  }

  edithouse(_record: TBL_MBL_REPORT) {

    let sID: string = (_record.mbl_pkid != null) ? _record.mbl_pkid.toString() : "";
    let REFNO: string = _record.mbl_refno != null ? _record.mbl_refno.toString() : "";
    let sMode: string = _record.mbl_mode != null ? _record.mbl_mode.toString() : "";
    let HBLID: string = _record.hbl_pkid != null ? _record.hbl_pkid.toString() : "";
    let branch_name: string = _record.mbl_branch != null ? _record.mbl_branch.toString() : "";

    if (HBLID == "") {
      alert("Invalid Record Selected");
      return;
    }
    if (branch_name == this.gs.branch_name) {
      this.gs.LinkPage("HOUSE", sMode, REFNO, sID, HBLID);
    }
    else {
      alert("Cannot Show Details from another Branch");
    }
  }

}
