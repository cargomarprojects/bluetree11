import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { ReportService } from '../services/report.service';
import { Tbl_cargo_invoicem } from '../models/Tbl_cargo_invoicem';
import { SearchTable } from '../../shared/models/searchtable';

import { Store, State, select } from '@ngrx/store';
import * as myActions from './store/pay-due-report.actions';
import * as myReducer from './store/pay-due-report.reducer';
import { ReportState } from './store/pay-due-report.models'

import { Observable } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-pay-due-report',
  templateUrl: './pay-due-report.component.html'
})
export class PayDueReportComponent implements OnInit {

  title = 'Payment Due Report';

  pkid: string;
  urlid: string;
  url: string;
  menuid: string;

  currentTab = '';


  mode = "";
  report_category: string;
  sdate: string;
  edate: string;
  showsmode = '';

  comp_type: string = '';
  report_type: string = '';
  report_shptype: string = '';

  sort: string = 'inv_mbl_refno';
  sdata = '';
  cust_id = '';
  cust_name = '';

  chk_air_import = true;
  chk_air_export = true;
  chk_sea_import = true;
  chk_sea_export = true;
  chk_others = true;
  chk_admin_expense = false;

  reportformat = '';

  page_count: number = 0;
  page_current: number = 0;
  page_rows: number = 0;
  page_rowcount: number = 0;

  storesub: any;
  sub: any;

  loading: boolean = false;
  errorMessage: string = '';

  SearchData: any = {};

  Reportstate1: Observable<ReportState>;

  MainList: Tbl_cargo_invoicem[];

  CUSTRECORD: SearchTable = new SearchTable();


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

        this.report_category = rec.report_category;
        this.sdate = rec.sdate;
        this.edate = rec.edate;
        this.showsmode = rec.showsmode;

        this.sdata = rec.sdata;
        this.sort = rec.sort;

        this.chk_air_import = rec.chk_air_import;
        this.chk_sea_import = rec.chk_sea_import;
        this.chk_air_export = rec.chk_air_export;
        this.chk_sea_export = rec.chk_sea_export;
        this.chk_others = rec.chk_others;
        this.chk_admin_expense = rec.chk_admin_expense;


        this.cust_id = rec.cust_id;
        this.cust_name = rec.cust_name;

        this.CUSTRECORD.id = this.cust_id;
        this.CUSTRECORD.name = this.cust_name;

        this.comp_type = rec.comp_type;
        this.page_rows = rec.page_rows;
        this.page_count = rec.page_count;
        this.page_current = rec.page_current;
        this.page_rowcount = rec.page_rowcount;

        this.SearchData = this.gs.UserInfo;
        this.SearchData.SDATE = this.sdate;
        this.SearchData.EDATE = this.edate;
        this.SearchData.SHOWSMODE = this.showsmode;
        this.SearchData.COMP_TYPE = this.comp_type;
        this.SearchData.CUST_ID = '';
        this.SearchData.CUST_NAME = '';


        if (this.comp_type === 'ALL') {
          this.SearchData.COMP_CODE = this.gs.branch_codes;
        } else {
          this.SearchData.COMP_CODE = this.comp_type;
        }


      } else {
        this.MainList = Array<Tbl_cargo_invoicem>();

        this.page_rows = this.gs.ROWS_TO_DISPLAY;
        this.page_count = 0;
        this.page_current = 0;
        this.page_rowcount = 0;

        this.currentTab = 'LIST';



        this.report_category = 'CONSIGNEE SHIPMENT REPORT';
        this.sdate = this.gs.getPreviousDate(30);
        this.edate = this.gs.defaultValues.today;
        this.showsmode = "";
        this.comp_type = this.gs.branch_code;

        this.sdata = '';
        this.sort = 'inv_mbl_refno';
        this.cust_id = '';
        this.cust_name = '';

        this.chk_air_import = true;
        this.chk_air_export = true;
        this.chk_sea_import = true;
        this.chk_sea_export = true;
        this.chk_others = true;
        this.chk_admin_expense = false;

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
    this.page_current = actions.page_current;
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

    if (_outputformat === 'SCREEN' && _action === 'NEW') {

      this.SearchData.page_current = -1;

      this.SearchData.JV_YEAR = this.gs.globalVariables.year_code;
      this.SearchData.REPORT_CATEGORY = this.report_category;
      this.SearchData.FDATE = this.sdate;
      this.SearchData.TDATE = this.edate;

      //this.SearchData.STYPE = this.mode;


      this.SearchData.SORT = this.sort;

      this.SearchData.ISADMIN = 'N';

      this.SearchData.SDATA = this.sdata;
      this.SearchData.SORT = this.sort;
      this.SearchData.CUST_ID = this.cust_id;
      this.SearchData.CUST_NAME = this.cust_name;

      this.mode = "";
      if (this.chk_air_import) {
        if (this.mode != "")
          this.mode += ",";
        this.mode += "'AIR IMPORT'";
      }
      if (this.chk_air_export) {
        if (this.mode != "")
          this.mode += ",";
        this.mode += "'AIR EXPORT'";
      }
      if (this.chk_sea_import) {
        if (this.mode != "")
          this.mode += ",";
        this.mode += "'SEA IMPORT'";
      }
      if (this.chk_sea_export) {
        if (this.mode != "")
          this.mode += ",";
        this.mode += "'SEA EXPORT'";
      }
      if (this.chk_others) {
        if (this.mode != "")
          this.mode += ",";
        this.mode += "'OTHERS'";
      }
      if (this.chk_admin_expense) {
        if (this.mode != "")
          this.mode += ",";
        this.mode += "'CM','GE','PR','PS'";
      }
      this.showsmode = this.mode;
      this.SearchData.SHOWSMODE = this.showsmode;

    }

    this.loading = true;

    this.mainservice.PayDueReport(this.SearchData)
      .subscribe(response => {

        if (_outputformat === 'SCREEN') {
          const state: ReportState = {
            pkid: this.pkid,
            urlid: this.urlid,
            menuid: this.menuid,
            currentTab: this.currentTab,
            report_category: this.SearchData.REPORT_CATEGORY,
            sdate: this.SearchData.FDATE,
            edate: this.SearchData.TDATE,

            comp_type: this.SearchData.COMP_TYPE,

            sdata: this.SearchData.SDATA,
            sort: this.SearchData.SORT,
            cust_id: this.SearchData.CUST_ID,
            cust_name: this.SearchData.CUST_NAME,

            chk_air_import: this.chk_air_import,
            chk_sea_import: this.chk_sea_import,
            chk_air_export: this.chk_air_export,
            chk_sea_export: this.chk_sea_export,
            chk_others: this.chk_others,
            chk_admin_expense: this.chk_admin_expense,
            showsmode: this.SearchData.SHOWSMODE,

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
        this.errorMessage = error.error.error_description;
        alert(this.errorMessage);
      });
  }

  Close() {
    this.store.dispatch(new myActions.Delete({ id: this.urlid }));
    this.location.back();
  }

  initLov(caption: string = '') {
    this.CUSTRECORD = new SearchTable();
    this.CUSTRECORD.controlname = "CUSTOMER";
    this.CUSTRECORD.displaycolumn = "NAME";
    this.CUSTRECORD.type = "MASTER";
    this.CUSTRECORD.subtype = "";
    this.CUSTRECORD.id = "";
    this.CUSTRECORD.code = "";

  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "CUSTOMER") {
      this.cust_id = _Record.id;
      this.cust_name = _Record.name;
    }
  }

  editmaster(_record: Tbl_cargo_invoicem) {
    this.FindRow("REFNO", _record);
  }

  edithouse(_record: Tbl_cargo_invoicem) {
    this.FindRow("HOUSE", _record);
  }

  editinvoice(_record: Tbl_cargo_invoicem) {
    this.FindRow("INVNO", _record);
  }

  FindRow(sCol: string, _record: Tbl_cargo_invoicem) {
    let MBLID: string = "";
    let REFNO: string = "";
    let HBLID: string = "";
    let INVID: string = "";
    let STYPE: string = "";
    let MBL_MODE: string = "";

    MBL_MODE = _record.mbl_mode.toString();
    MBLID = _record.mbl_pkid.toString().trim();
    REFNO = _record.mbl_refno.toString().trim();
    HBLID = _record.inv_hbl_id.toString().trim();

    if (MBL_MODE == "CM" || MBL_MODE == "GE" || MBL_MODE == "PR" || MBL_MODE == "PS") {
      alert("Cannot Load This Record");
      return;
    }

    STYPE = REFNO;
    if (STYPE.length >= 2)
      STYPE = STYPE.substring(0, 2);
    else
      STYPE = "";

    if (STYPE == "") {
      alert("Cannot Load This Record");
      return;
    }
    else {
      if (sCol == "INVNO") {

        INVID = _record.inv_pkid.toString();
        if (MBLID == "" || INVID == "") {
          alert("Invalid Record Selected");
          return;
        }
        this.gs.LinkPage("INVNO", MBL_MODE, REFNO, MBLID, "", INVID);
      }
      else if (sCol == "REFNO") {
        if (MBLID == "") {
          alert("Invalid Record Selected");
          return;
        }
        this.gs.LinkPage("REFNO", MBL_MODE, REFNO, MBLID);
      }
      else if (sCol == "HOUSE") {
        if (HBLID == "") {
          alert("Invalid Record Selected");
          return;
        }
        this.gs.LinkPage("HOUSE", MBL_MODE, REFNO, MBLID, HBLID);
      }
    }


  }

}
