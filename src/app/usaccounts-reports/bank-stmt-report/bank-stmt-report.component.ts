import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { UsAccountReportService } from '../services/usaccounts-report.service';
import { Tbl_Acc_Payment } from '../models/Tbl_Acc_Payment';
import { SearchTable } from '../../shared/models/searchtable';

import { Store, State, select } from '@ngrx/store';
import * as myActions from './store/bank-stmt-report.actions';
import * as myReducer from './store/bank-stmt-report.reducer';
import { ReportState } from './store/bank-stmt-report.models'

import { Observable } from 'rxjs';

@Component({
  selector: 'app-bank-stmt-report',
  templateUrl: './bank-stmt-report.component.html'
})
export class BankStmtReportComponent implements OnInit {

  title = 'Bank Statement';
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
  edate: string;
  bank_id: string;
  bank_name: string;
  comp_name: string = '';
  comp_code: string = '';

  filename: string = '';
  filetype: string = '';
  filedisplayname: string = '';
  filename2: string = '';
  filetype2: string = '';
  filedisplayname2: string = '';

  lov_where: string = " ACC_TYPE in ('CASH', 'BANK') ";

  page_count: number = 0;
  page_current: number = 0;
  page_rows: number = 0;
  page_rowcount: number = 0;

  storesub: any;
  sub: any;
  tab: string = 'main';
  sortCol = 'pay_date';
  sortOrder = true;

  loading: boolean = false;
  errorMessage: string = '';
  SearchData: any = {};
  Reportstate1: Observable<ReportState>;
  MainList: Tbl_Acc_Payment[];
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

      this.gs.checkAppVersion();

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
        this.bank_id = rec.bank_id;
        this.bank_name = rec.bank_name;
        this.fdate = rec.fdate;
        this.edate = rec.edate;
        this.comp_name = rec.comp_name;
        this.comp_code = rec.comp_code;
        this.filename = rec.filename;
        this.filetype = rec.filetype;
        this.filedisplayname = rec.filedisplayname;
        this.filename2 = rec.filename2;
        this.filetype2 = rec.filetype2;
        this.filedisplayname2 = rec.filedisplayname2;
        this.sortCol = rec.sortcol;
        this.sortOrder = rec.sortorder;

        this.page_rows = rec.page_rows;
        this.page_count = rec.page_count;
        this.page_current = rec.page_current;
        this.page_rowcount = rec.page_rowcount;

        this.SearchData = this.gs.UserInfo;

        this.SearchData.BANK_ID = this.bank_id;
        this.SearchData.JV_YEAR = this.gs.year_code;
        this.SearchData.FDATE = this.fdate;
        this.SearchData.EDATE = this.edate;
        this.SearchData.OPDATE = this.fdate;
        this.SearchData.COMP_NAME = this.gs.GetCompanyName(this.comp_code);
        this.SearchData.BRANCH_CODE = this.comp_code;
      } else {

        this.MainList = Array<Tbl_Acc_Payment>();
        this.page_rows = this.gs.ROWS_TO_DISPLAY;
        this.page_count = 0;
        this.page_current = 0;
        this.page_rowcount = 0;

        this.currentTab = 'LIST';
        this.bank_id = '';
        this.bank_name = '';
        this.fdate = this.gs.defaultValues.lastmonthdate;
        this.edate = this.gs.defaultValues.today;
        this.comp_code = this.gs.branch_code;
        this.comp_name = this.gs.branch_name;
        this.filename = '';
        this.filetype = '';
        this.filedisplayname = '';
        this.filename2 = '';
        this.filetype2 = '';
        this.filedisplayname2 = '';
        this.sortCol = 'pay_date';
        this.sortOrder = true;
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
    //GOTOCHANGE2
    if( actions.action == 'GOTO')
      this.page_current = actions.page_current;    
    this.List(actions.outputformat, actions.action);
  }

  List(_outputformat: string, _action: string = 'NEW') {

    this.errorMessage = "";
    if (this.gs.isBlank(this.bank_id)) {
      this.errorMessage = "Code Cannot be Blank";
      alert(this.errorMessage);
      return;
    }
    if (_outputformat == "PRINT") {
      if (this.MainList.length <= 0) {
        this.errorMessage = "List Not Found";
        alert(this.errorMessage);
        return;
      }
    }

    if (this.gs.isBlank(this.fdate)) {
      this.fdate = this.gs.year_start_date;
    }

    this.SearchData.outputformat = _outputformat;
    this.SearchData.pkid = this.urlid;
    this.SearchData.action = _action;
    this.SearchData.page_count = this.page_count;
    this.SearchData.page_current = this.page_current;
    this.SearchData.page_rows = this.page_rows;
    this.SearchData.page_rowcount = this.page_rowcount;

    if (_outputformat === 'SCREEN' && _action === 'NEW') {

      this.SearchData.JV_YEAR = this.gs.year_code;
      this.SearchData.BANK_ID = this.bank_id;
      this.SearchData.BANK_NAME = this.bank_name;
      this.SearchData.FDATE = this.fdate;
      this.SearchData.EDATE = this.edate;
      this.SearchData.OPDATE = this.fdate;
      this.SearchData.BRANCH_CODE = this.comp_code;
      this.SearchData.COMP_NAME = this.gs.GetCompanyName(this.comp_code);

      this.SearchData.filename = "";
      this.SearchData.filedisplayname = "";
      this.SearchData.filetype = "";
      this.SearchData.filename2 = "";
      this.SearchData.filedisplayname2 = "";
      this.SearchData.filetype2 = "";
    }


    this.loading = true;

    this.mainservice.BankStmt(this.SearchData)
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
            bank_id: this.SearchData.BANK_ID,
            bank_name: this.SearchData.BANK_NAME,
            fdate: this.SearchData.FDATE,
            edate: this.SearchData.EDATE,
            comp_name: this.SearchData.COMP_NAME,
            comp_code: this.SearchData.BRANCH_CODE,
            sortcol: 'pay_date',
            sortorder: true,
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
        } else if (_outputformat == "PRINT") {

          this.filename = response.filename;
          this.filetype = response.filetype;
          this.filedisplayname = response.filedisplayname;
          this.filename2 = response.filename2;
          this.filetype2 = response.filetype2;
          this.filedisplayname2 = response.filedisplayname2;
          this.Print();
        }

        this.loading = false;
      }, error => {
        this.loading = false;
        this.errorMessage = error.error.error_description;
        alert(this.errorMessage);
      });
  }

  Close() {
   // this.store.dispatch(new myActions.Delete({ id: this.urlid }));
    this.location.back();
  }
  private sort(sortcol: string) {
    this.store.dispatch(new myActions.SortData({ id: this.urlid, sortcol: sortcol }))
  }

  public getIcon(col: string) {
    if (col == this.sortCol) {
      if (this.sortOrder)
        return 'fa fa-arrow-down';
      else
        return 'fa fa-arrow-up';
    }
    else
      return null;
  }
  initLov(caption: string = '') {

  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname === 'ACCTM') {
      this.bank_id = _Record.id;
      this.bank_name = _Record.name;
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
    this.report_title = 'Bank Stmt Report';
    this.report_url = undefined;
    this.report_searchdata = this.gs.UserInfo;
    this.report_menuid = this.menuid;
    this.tab = 'report';
  }

  PrintPayment(_rec: Tbl_Acc_Payment) {

    if (_rec.pay_pkid == null)
      return;
    if (_rec.pay_pkid === "OP")
      return;
    if (_rec.pay_pkid === "CL")
      return;


    this.report_title = 'Bank Payment Details';
    this.report_url = '/api/UsAccBankStmtRpt/PaymentDetails';
    this.report_searchdata = this.gs.UserInfo;
    this.report_searchdata.PKID = _rec.pay_pkid;
    this.report_searchdata.TYPE = _rec.pay_type;
    this.report_menuid = this.menuid;
    this.tab = 'report';

  }


  callbackevent() {
    this.tab = 'main';
  }

}
