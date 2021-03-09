import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { UsAccountReportService } from '../services/usaccounts-report.service';
import { Tbl_acc_ledger } from '../models/Tbl_acc_ledger';
import { SearchTable } from '../../shared/models/searchtable';

import { Store, State, select } from '@ngrx/store';
import * as myActions from './store/gen-ledger-report.actions';
import * as myReducer from './store/gen-ledger-report.reducer';
import { ReportState } from './store/gen-ledger-report.models'

import { Observable } from 'rxjs';

@Component({
  selector: 'app-gen-ledger-report',
  templateUrl: './gen-ledger-report.component.html'
})
export class GenLedgerReportComponent implements OnInit {

  title = 'General Ledger';
  pkid: string;
  urlid: string;
  url: string;
  menuid: string;
  currentTab = '';

  report_title: string;
  report_url: string;
  report_searchdata: any = {};
  report_menuid: string;

  fdate: string;
  tdate: string;
  cust_id: string;
  cust_name: string;
  comp_name: string = '';
  comp_code: string = '';
  radio_cust: string = 'ACC_ACCTM';
  is_ledger: string = 'Y';
  acc_parent_code: string = '';
  fy_start_month: number = 0;


  filename: string = '';
  filetype: string = '';
  filedisplayname: string = '';
  filename2: string = '';
  filetype2: string = '';
  filedisplayname2: string = '';

  lov_where: string = "";


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
  MainList: Tbl_acc_ledger[];
  CompList: any[];

  constructor(
    public gs: GlobalService,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private location: Location,
    private store: Store<myReducer.AppState>,
    private mainservice: UsAccountReportService
  ) {

    this.sub = this.activatedroute.queryParams.subscribe(params => {
      this.urlid = params.id;
      this.menuid = params.menuid;
      this.title = this.gs.getTitle(this.menuid);
      this.InitPage();
      this.LoadCompany();
    });

  }

  InitPage() {

    this.storesub = this.store.select(myReducer.getState(this.urlid)).subscribe(rec => {
      this.initLov();
      if (rec) {

        this.MainList = rec.records;
        this.pkid = rec.pkid;
        this.currentTab = rec.currentTab;
        this.cust_id = rec.cust_id;
        this.cust_name = rec.cust_name;
        this.fdate = rec.fdate;
        this.tdate = rec.tdate;
        this.comp_name = rec.comp_name;
        this.comp_code = rec.comp_code;
        this.radio_cust = rec.radio_cust,
          this.is_ledger = rec.is_ledger,
          this.acc_parent_code = rec.acc_parent_code,
          this.fy_start_month = rec.fy_start_month,

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
        this.SearchData.JV_ACC_ID = this.cust_id;
        this.SearchData.JV_YEAR = this.gs.year_code;
        this.SearchData.FDATE = this.fdate;
        this.SearchData.TDATE = this.tdate;
        this.SearchData.OPDATE = this.fdate;
        this.SearchData.BRCODE = this.comp_code;
        this.SearchData.ISLEDGER = this.is_ledger;
        this.SearchData.RETAINED_PROFIT = this.gs.RETAINED_PROFIT_ID;
        this.SearchData.ACC_PARENT_CODE = this.acc_parent_code;
        this.SearchData.FY_START_MONTH = this.fy_start_month;

      } else {

        this.MainList = Array<Tbl_acc_ledger>();
        this.page_rows = this.gs.ROWS_TO_DISPLAY;
        this.page_count = 0;
        this.page_current = 0;
        this.page_rowcount = 0;

        this.currentTab = 'LIST';
        this.cust_id = '';
        this.cust_name = '';
        this.fdate = this.gs.defaultValues.lastmonthdate;
        this.tdate = this.gs.defaultValues.today;
        this.comp_code = this.gs.branch_code;
        this.comp_name = this.gs.branch_name;
        this.radio_cust = 'ACC_ACCTM';
        this.is_ledger = 'Y';
        this.acc_parent_code = '';
        if (this.gs.FY_MONTHS.length > 0)
          this.fy_start_month = +this.gs.FY_MONTHS[0].code;
        else
          this.fy_start_month = +this.gs.FY_START_MONTH;
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

  LoadCompany() {
    this.CompList = <any[]>[];
    this.gs.CompanyList.forEach(Rec => {
      if (Rec.comp_code != 'ALL')
        this.CompList.push(Rec);
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

    if (this.gs.isBlank(this.fdate))
      this.fdate = this.gs.year_start_date;
    if (this.gs.isBlank(this.tdate))
      this.tdate = this.gs.defaultValues.today;

    this.errorMessage = "";
    if (this.gs.isBlank(this.cust_id)) {
      this.errorMessage = "Code Cannot be Blank";
      alert(this.errorMessage);
      return;
    }

    if (this.is_ledger == "") {
      this.errorMessage = "Invalid A/c Selected, pls re-enter the Account";
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

    if (_outputformat === 'SCREEN' && _action === 'NEW') {
      this.SearchData.JV_ACC_ID = this.cust_id;
      this.SearchData.JV_ACC_NAME = this.cust_name;
      this.SearchData.JV_YEAR = this.gs.year_code;
      this.SearchData.FDATE = this.fdate;
      this.SearchData.TDATE = this.tdate;
      this.SearchData.OPDATE = this.fdate;
      this.SearchData.BRCODE = this.comp_code;
      this.SearchData.COMP_NAME = this.comp_name;
      this.SearchData.ISLEDGER = this.is_ledger;
      this.SearchData.RETAINED_PROFIT = this.gs.RETAINED_PROFIT_ID;
      this.SearchData.ACC_PARENT_CODE = this.acc_parent_code;
      this.SearchData.FY_START_MONTH = this.fy_start_month;
      this.SearchData.RADIO_CUST = this.radio_cust;

      this.SearchData.filename = "";
      this.SearchData.filedisplayname = "";
      this.SearchData.filetype = "";
      this.SearchData.filename2 = "";
      this.SearchData.filedisplayname2 = "";
      this.SearchData.filetype2 = "";
    }

    this.loading = true;
    this.mainservice.LedgerReport(this.SearchData)
      .subscribe(response => {

        if (_outputformat === 'SCREEN') {
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
            cust_id: this.SearchData.JV_ACC_ID,
            cust_name: this.SearchData.JV_ACC_NAME,
            fdate: this.SearchData.FDATE,
            tdate: this.SearchData.TDATE,
            comp_name: this.SearchData.COMP_NAME,
            comp_code: this.SearchData.BRCODE,
            radio_cust: this.SearchData.RADIO_CUST,
            is_ledger: this.SearchData.ISLEDGER,
            acc_parent_code: this.SearchData.ACC_PARENT_CODE,
            fy_start_month: this.SearchData.FY_START_MONTH,
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
    if (_Record.controlname === 'ACCTM-CUST') {
      this.cust_id = _Record.id;
      this.cust_name = _Record.name;

      this.is_ledger = "N";
      if (this.radio_cust === "ACC_ACCTM")
        this.is_ledger = "Y";

      this.acc_parent_code = _Record.col7.toString()

    }
    // if (_Record.controlname === 'PARENT') {
    //   this.cust_parent_id = _Record.id;
    //   this.cust_parent_name = _Record.name;
    // }
  }

  Print() {
    this.errorMessage = "";
    if (this.MainList.length <= 0) {
      this.errorMessage = "List Not Found";
      alert(this.errorMessage);
      return;
    }

    // this.Downloadfile(this.filename, this.filetype, this.filedisplayname);
    this.report_title = 'Ledger Report';
    this.report_url = undefined;
    this.report_searchdata = this.gs.UserInfo;
    this.report_menuid = this.menuid;
    this.tab = 'report';
  }


  callbackevent() {
    this.tab = 'main';
  }

}
