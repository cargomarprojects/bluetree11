import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { ReportService } from '../services/report.service';
import { TBL_MBL_REPORT } from '../models/tbl_mbl_report';
import { SearchTable } from '../../shared/models/searchtable';


import { Store, State, select } from '@ngrx/store';
import *  as myActions from './store/top-customer-report.actions';
import *  as myReducer from './store/top-customer-report.reducer';
import { ReportState } from './store/top-customer-report.models'

import { Observable } from 'rxjs';

@Component({
  selector: 'app-top-customer-report',
  templateUrl: './top-customer-report.component.html',
})
export class TopCustomerReportComponent implements OnInit {

  title: string = 'Top Customer Report';

  pkid: string;
  urlid: string;
  url: string;
  menuid: string;

  currentTab: string = '';

  report_url: string;
  report_searchdata: any = {};
  report_menuid: string;

  sdate: string;
  edate: string;
  comp_type: string = '';
  report_category: string;
  topnum: number = 0;
  toporder: string = '';
  report_type: string = '';
  radio_exp: string = 'EXPENSE';
  report_amt_caption: string = 'EXPENSE';
  reportformat: string = '';
  group_by_parent: boolean = false;
  radio_Visibility = true;
  filename: string = '';
  filetype: string = '';
  filedisplayname: string = '';
  filename2: string = '';
  filetype2: string = '';
  filedisplayname2: string = '';


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

  Reportstate1: Observable<ReportState>;

  MainList: TBL_MBL_REPORT[];

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

        this.MainList = rec.records;
        this.pkid = rec.pkid;
        this.currentTab = rec.currentTab;
        this.report_category = rec.report_category
        this.sdate = rec.sdate;
        this.edate = rec.edate;
        this.comp_type = rec.comp_type;
        this.report_type = rec.report_type;
        this.reportformat = rec.reportformat;
        this.topnum = rec.topnum;
        this.toporder = rec.toporder;
        this.radio_exp = rec.radio_exp;
        this.report_amt_caption = rec.report_amt_caption;
        this.group_by_parent = rec.group_by_parent;
        this.filename = rec.filename;
        this.filetype = rec.filetype;
        this.filedisplayname = rec.filedisplayname;
        this.filename2 = rec.filename2;
        this.filetype2 = rec.filetype2;
        this.filedisplayname2 = rec.filedisplayname2;


        this.page_rows = rec.page_rows;
        this.page_count = rec.page_count;
        this.page_current = rec.page_current;
        this.page_rowcount = rec.page_rowcount;


        this.SearchData = this.gs.UserInfo;
        this.SearchData.REPORT_TYPE = this.report_type;
        this.SearchData.REPORT_CATEGORY = this.report_category;
        this.SearchData.REPORT_AMT_CAPTION = this.report_amt_caption;
        this.SearchData.SDATE = this.sdate;
        this.SearchData.EDATE = this.edate;
        this.SearchData.COMP_TYPE = this.comp_type;
        if (this.comp_type == 'ALL')
          this.SearchData.COMP_CODE = this.gs.branch_codes;
        else
          this.SearchData.COMP_CODE = this.comp_type;
        this.SearchData.COMP_NAME = this.gs.branch_name;
        this.SearchData.ISPARENT = this.group_by_parent == true ? "Y" : "N";
        this.SearchData.ISADMIN = (this.gs.user_isadmin == "Y" || this.gs.IsAdmin(this.menuid)) ? "Y" : "N";

        this.SearchData.TOP_VAL = this.topnum;
        this.SearchData.SORT_ORDER = this.toporder;
        if (this.radio_exp == 'EXPENSE')
          this.SearchData.TOP_BY = "EXPENSE";
        if (this.radio_exp == "REVENUE")
          this.SearchData.TOP_BY = "REVENUE";
        if (this.radio_exp == "PROFIT")
          this.SearchData.TOP_BY = "PROFIT";
        if (this.radio_exp == "TEU")
          this.SearchData.TOP_BY = "TEU";
        if (this.radio_exp == "TONNAGE")
          this.SearchData.TOP_BY = "TON";
        if (this.radio_exp == "TOTHOUSE")
          this.SearchData.TOP_BY = "TOT_HBL";



        // this.SearchData.TOP_BY = top_by;
        this.reportformat = this.report_type;

      }
      else {
        this.MainList = Array<TBL_MBL_REPORT>();

        this.page_rows = this.gs.ROWS_TO_DISPLAY;
        this.page_count = 0;
        this.page_current = 0;
        this.page_rowcount = 0;

        this.currentTab = 'LIST';

        this.report_category = "OVERSEAS AGENT";
        this.sdate = this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF);
        this.edate = this.gs.defaultValues.today;
        this.comp_type = this.gs.branch_code;
        this.report_type = "SUMMARY";
        this.reportformat = 'SUMMARY';
        this.topnum = 10;
        this.toporder = 'DESC';
        this.radio_exp = 'REVENUE';
        this.report_amt_caption = '';
        this.group_by_parent = false;
        this.filename = '';
        this.filetype = '';
        this.filedisplayname = '';
        this.filename2 = '';
        this.filetype2 = '';
        this.filedisplayname2 = '';

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


    this.errorMessage = '';
    if (this.topnum <= 0) {
      this.errorMessage = 'Invalid Top Value';
      alert(this.errorMessage);
      return;
    }

    this.ResetControls();

    this.SearchData.outputformat = _outputformat;
    this.SearchData.pkid = this.urlid;
    this.SearchData.action = _action;
    this.SearchData.page_count = this.page_count;
    this.SearchData.page_current = this.page_current;
    this.SearchData.page_rows = this.page_rows;
    this.SearchData.page_rowcount = this.page_rowcount;

    if (_outputformat == "SCREEN" && _action == 'NEW') {

      this.SearchData.REPORT_TYPE = this.report_type;
      this.SearchData.REPORT_CATEGORY = this.report_category;
      this.SearchData.REPORT_AMT_CAPTION = this.report_amt_caption;
      this.SearchData.SDATE = this.sdate;
      this.SearchData.EDATE = this.edate;
      this.SearchData.COMP_TYPE = this.comp_type;
      if (this.comp_type == 'ALL')
        this.SearchData.COMP_CODE = this.gs.branch_codes;
      else
        this.SearchData.COMP_CODE = this.comp_type;
      this.SearchData.COMP_NAME = this.gs.branch_name;
      this.SearchData.ISPARENT = this.group_by_parent == true ? "Y" : "N";
      this.SearchData.ISADMIN = (this.gs.user_isadmin == "Y" || this.gs.IsAdmin(this.menuid)) ? "Y" : "N";

      this.SearchData.TOP_VAL = this.topnum;
      this.SearchData.SORT_ORDER = this.toporder;
      if (this.radio_exp == 'EXPENSE')
        this.SearchData.TOP_BY = "EXPENSE";
      if (this.radio_exp == "REVENUE")
        this.SearchData.TOP_BY = "REVENUE";
      if (this.radio_exp == "PROFIT")
        this.SearchData.TOP_BY = "PROFIT";
      if (this.radio_exp == "TEU")
        this.SearchData.TOP_BY = "TEU";
      if (this.radio_exp == "TONNAGE")
        this.SearchData.TOP_BY = "TON";
      if (this.radio_exp == "TOTHOUSE")
        this.SearchData.TOP_BY = "TOT_HBL";
      this.reportformat = this.report_type;
      this.SearchData.filename = "";
      this.SearchData.filedisplayname = "";
      this.SearchData.filetype = "";
    }

    this.loading = true;

    this.mainservice.TopCustomerReport(this.SearchData)
      .subscribe(response => {

        if (_outputformat == "SCREEN") {

          if (_action == "NEW") {
            this.SearchData.filename = response.filename;
            this.SearchData.filedisplayname = response.filedisplayname;
            this.SearchData.filetype = response.filetype;
            this.SearchData.filename2 = response.filename2;
            this.SearchData.filedisplayname2 = response.filedisplayname2;
            this.SearchData.filetype2 = response.filetype2;
          }
          const state: ReportState = {
            pkid: this.pkid,
            urlid: this.urlid,
            menuid: this.menuid,
            currentTab: this.currentTab,
            report_category: this.SearchData.REPORT_CATEGORY,
            sdate: this.SearchData.SDATE,
            edate: this.SearchData.EDATE,
            comp_type: this.SearchData.COMP_TYPE,
            report_type: this.SearchData.REPORT_TYPE,
            reportformat: this.reportformat,
            topnum: this.topnum,
            toporder: this.toporder,
            radio_exp: this.radio_exp,
            report_amt_caption: this.report_amt_caption,
            group_by_parent: this.group_by_parent,
            page_rows: response.page_rows,
            page_count: response.page_count,
            page_current: response.page_current,
            page_rowcount: response.page_rowcount,
            records: response.list,
            filename: this.SearchData.filename,
            filetype: this.SearchData.filetype,
            filedisplayname: this.SearchData.filedisplayname,
            filename2: this.SearchData.filename2,
            filetype2: this.SearchData.filetype2,
            filedisplayname2: this.SearchData.filedisplayname2

          };
          this.store.dispatch(new myActions.Update({ id: this.urlid, changes: state }));
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


  }

  LovSelected(_Record: SearchTable) {

  }
  OnChange(field: string) {
    if (field == 'report_category') {
      try {
        if (this.report_category == "SHIPPER" || this.report_category == "CONSIGNEE" ||
          this.report_category == "OVERSEAS AGENT" || this.report_category == "POL" ||
          this.report_category == "POD") {
          this.radio_exp = 'REVENUE';
          this.radio_Visibility = true;
        }
        else {
          this.radio_exp = 'EXPENSE';
          this.radio_Visibility = false;
        }
      }
      catch (Exception) {
      }
    }
  }

  rdbtnclick() {
    this.group_by_parent = false;
  }
  ResetControls() {
    if (this.radio_exp == 'EXPENSE')
      this.report_amt_caption = "EXPENSE";
    if (this.radio_exp == "REVENUE")
      this.report_amt_caption = "REVENUE";
    if (this.radio_exp == "PROFIT")
      this.report_amt_caption = "PROFIT";
    if (this.radio_exp == "TEU")
      this.report_amt_caption = "TEU";
    if (this.radio_exp == "TONNAGE")
      this.report_amt_caption = "TONNAGE";
    if (this.radio_exp == "TOTHOUSE")
      this.report_amt_caption = "NO OF HOUSE";

    if (this.report_type == "DETAIL") {
      this.reportformat = "DETAIL";
    }
    else if (this.report_type == "SUMMARY") {
      this.reportformat = "SUMMARY";
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

  onBlur(field: string = '')
  {

  }


  editmaster(_record: TBL_MBL_REPORT) {

    let sID: string = (_record.mbl_pkid != null) ? _record.mbl_pkid.toString() : "";
    let REFNO: string = _record.mbl_refno != null ? _record.mbl_refno.toString() : "";
    let sMode: string = _record.mbl_mode != null ? _record.mbl_mode.toString() : "";
    let branch_code: string = _record.mbl_branch != null ? _record.mbl_branch.toString() : "";

    if (sID == "") {
      alert("Invalid Record Selected");
      return;
    }
    if (branch_code == this.gs.branch_code) {
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
    let branch_code: string = _record.mbl_branch != null ? _record.mbl_branch.toString() : "";

    if (HBLID == "") {
      alert("Invalid Record Selected");
      return;
    }
    if (branch_code == this.gs.branch_code) {
      this.gs.LinkPage("HOUSE", sMode, REFNO, sID, HBLID);
    }
    else {
      alert("Cannot Show Details from another Branch");
    }
  }
}
