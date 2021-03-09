import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { ReportService } from '../services/report.service';
import { Tbl_shipment_close } from '../models/Tbl_shipment_close';
import { SearchTable } from '../../shared/models/searchtable';

import { Store, State, select } from '@ngrx/store';
import * as myActions from './store/ship-close-report.actions';
import * as myReducer from './store/ship-close-report.reducer';
import { ReportState } from './store/ship-close-report.models'

import { Observable } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-ship-close-report',
  templateUrl: './ship-close-report.component.html'
})
export class ShipCloseReportComponent implements OnInit {

  title = 'Shipment Closing Report';

  pkid: string;
  urlid: string;
  url: string;
  menuid: string;

  currentTab = '';

  report_category: string;
  sdate: string;
  edate: string;
  mode = '';
  comp_type: string = '';
  report_type: string = '';
  report_shptype: string = '';

  cust_id: string;
  cust_name: string;

  cust_parent_id: string;
  cust_parent_name: string;

  reportformat = '';

  page_count: number = 0;
  page_current: number = 0;
  page_rows: number = 0;
  page_rowcount: number = 0;

  storesub: any;
  sub: any;
  tab: string = 'main';
  attach_pkid: string = "";
  attach_typelist: any = {};
  attach_type: string = "";
  attach_title: string = "";

  loading: boolean = false;
  errorMessage: string = '';

  SearchData: any = {};

  Reportstate1: Observable<ReportState>;

  MainList: Tbl_shipment_close[];

  CUSTRECORD: SearchTable = new SearchTable();
  PARENTRECORD: SearchTable = new SearchTable();

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

      if (rec) {

        this.MainList = rec.records;
        this.pkid = rec.pkid;
        this.currentTab = rec.currentTab;

        this.report_category = rec.report_category;
        this.sdate = rec.sdate;
        this.edate = rec.edate;
        this.mode = rec.mode;
        this.comp_type = rec.comp_type;
        this.page_rows = rec.page_rows;
        this.page_count = rec.page_count;
        this.page_current = rec.page_current;
        this.page_rowcount = rec.page_rowcount;


        this.SearchData = this.gs.UserInfo;
        this.SearchData.SDATE = this.sdate;
        this.SearchData.EDATE = this.edate;
        this.SearchData.MODE = this.mode;
        this.SearchData.COMP_TYPE = this.comp_type;
        if (this.comp_type === 'ALL') {
          this.SearchData.COMP_CODE = this.gs.branch_codes;
        } else {
          this.SearchData.COMP_CODE = this.comp_type;
        }


      } else {
        this.MainList = Array<Tbl_shipment_close>();

        this.page_rows = this.gs.ROWS_TO_DISPLAY;
        this.page_count = 0;
        this.page_current = 0;
        this.page_rowcount = 0;

        this.currentTab = 'LIST';

        this.report_category = 'CONSIGNEE SHIPMENT REPORT';
        this.sdate = this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF);
        this.edate = this.gs.defaultValues.today;
        this.mode = 'OCEAN IMPORT';
        this.comp_type = this.gs.branch_code;

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
      this.SearchData.SDATE = this.sdate;
      this.SearchData.EDATE = this.edate;
      this.SearchData.MODE = this.mode;

      this.SearchData.LOCK_DAYS_SEA = this.gs.LOCK_DAYS_SEA;
      this.SearchData.LOCK_DAYS_AIR = this.gs.LOCK_DAYS_AIR;
      this.SearchData.LOCK_DAYS_OTHERS = this.gs.LOCK_DAYS_OTHERS;
      this.SearchData.LOCK_DAYS_ADMIN = this.gs.LOCK_DAYS_ADMIN;
      this.SearchData.TODAYS_DATE = this.gs.defaultValues.today;
    }

    this.loading = true;

    this.mainservice.ShipmentCloseReport(this.SearchData)
      .subscribe(response => {

        if (_outputformat === 'SCREEN') {
          const state: ReportState = {
            pkid: this.pkid,
            urlid: this.urlid,
            menuid: this.menuid,
            currentTab: this.currentTab,
            report_category: this.SearchData.REPORT_CATEGORY,
            sdate: this.SearchData.SDATE,
            edate: this.SearchData.EDATE,
            mode: this.SearchData.MODE,
            comp_type: this.SearchData.COMP_TYPE,
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

  editmaster(_record: Tbl_shipment_close) {
    let sID: string = (_record.sc_mbl_pkid != null) ? _record.sc_mbl_pkid.toString() : "";
    let REFNO: string = _record.sc_mbl_refno != null ? _record.sc_mbl_refno.toString() : "";
    let sMode: string = _record.sc_mbl_mode != null ? _record.sc_mbl_mode.toString() : "";
    if (sID == "") {
      alert("Invalid Record Selected");
      return;
    }
    this.gs.LinkPage("REFNO", sMode, REFNO, sID);
  }

  AttachRow(_rec: Tbl_shipment_close) {
    let TypeList: any[] = [];
    TypeList = [{ "code": "EMAIL", "name": "E-MAIL" }, { "code": "HOUSEBL", "name": "HOUSE B/L" }, { "code": "MASTER", "name": "MASTER" }, { "code": "PAYMENT SETTLEMENT", "name": "OTHERS" }];
    this.attach_pkid = _rec.sc_mbl_pkid;
    this.attach_typelist = TypeList;
    this.attach_type = 'PAYMENT SETTLEMENT'
    this.attach_title = "Shipment Closing Report Attachments [REF#: " + _rec.sc_mbl_refno + "]";
    this.tab = 'attachment';
  }
  callbackevent() {
    this.tab = 'main';
  }

}
