import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { ReportService } from '../services/report.service';
import { TBL_MBL_REPORT } from '../models/tbl_mbl_report';
import { SearchTable } from '../../shared/models/searchtable';

import { Store, State, select } from '@ngrx/store';
import * as myActions from './store/cons-ship-report.actions';
import * as myReducer from './store/cons-ship-report.reducer';
import { ReportState } from './store/cons-ship-report.models'

import { Observable } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-cons-ship-report',
  templateUrl: './cons-ship-report.component.html'
})
export class ConsShipReportComponent implements OnInit {

  title = 'Consignee Shipment Report';

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
  report_type: string = 'HOUSE WISE';
  report_shptype: string = '';
  filename: string = '';
  filetype: string = '';
  filedisplayname: string = '';

  cons_id: string;
  cons_name: string;
  cust_parent_id: string;
  cust_parent_name: string;

  page_count: number = 0;
  page_current: number = 0;
  page_rows: number = 0;
  page_rowcount: number = 0;

  storesub: any;
  sub: any;

  loading: boolean = false;
  errorMessage: string = '';

  SearchData: any = {};
  sortCol = 'mbl_refno';
  sortOrder = true;

  selectedId = '';
  date_basedon: string = "REF. DATE";

  DateBasedList: any[] = [{ "id": "REF. DATE", "name": "Ref. Date" }, { "id": "ETD", "name": "ETD" }, { "id": "ETA", "name": "ETA" }];

  Reportstate1: Observable<ReportState>;

  MainList: TBL_MBL_REPORT[];

  // CONSRECORD: SearchTable = new SearchTable();

  constructor(
    public gs: GlobalService,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private location: Location,
    private store: Store<myReducer.AppState>,
    private mainservice: ReportService
  ) {

    this.sub = this.activatedroute.queryParams.subscribe(params => {

      this.gs.checkAppVersion();

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
        this.mode = rec.mode;
        this.comp_type = rec.comp_type;
        this.report_type = rec.report_type;
        this.report_shptype = rec.report_shptype;
        this.cons_id = rec.cons_id;
        this.cons_name = rec.cons_name;
        this.cust_parent_id = rec.cust_parent_id;
        this.cust_parent_name = rec.cust_parent_name;
        this.filename = rec.filename;
        this.filetype = rec.filetype;
        this.filedisplayname = rec.filedisplayname;
        this.sortCol = rec.sortcol;
        this.sortOrder = rec.sortorder;
        this.selectedId = rec.selectedId;
        this.date_basedon = rec.date_basedon;

        this.page_rows = rec.page_rows;
        this.page_count = rec.page_count;
        this.page_current = rec.page_current;
        this.page_rowcount = rec.page_rowcount;


        this.SearchData = this.gs.UserInfo;
        this.SearchData.SDATE = this.sdate;
        this.SearchData.EDATE = this.edate;
        this.SearchData.DATE_TYPE = this.date_basedon;
        this.SearchData.MODE = this.mode;
        this.SearchData.COMP_TYPE = this.comp_type;
        if (this.comp_type === 'ALL') {
          this.SearchData.COMP_CODE = this.gs.branch_codes;
        } else {
          this.SearchData.COMP_CODE = this.comp_type;
        }
        this.SearchData.COMP_NAME = this.gs.GetCompanyName(this.comp_type);
        this.SearchData.REPORT_TYPE = this.report_type;
        this.SearchData.REPORT_SHPTYPE = this.report_shptype;
        this.SearchData.REPORT_CATEGORY = this.report_category;
        this.SearchData.CONSIGNEE_ID = this.cons_id;
        this.SearchData.CONSIGNEE_NAME = this.cons_name;
        this.SearchData.CUST_PARENT_ID = this.cust_parent_id;
        this.SearchData.CUST_PARENT_NAME = this.cust_parent_name;
      
        // this.CONSRECORD.id = this.cons_id;
        // this.CONSRECORD.name = this.cons_name;

      } else {
        this.MainList = Array<TBL_MBL_REPORT>();

        this.page_rows = this.gs.ROWS_TO_DISPLAY;
        this.page_count = 0;
        this.page_current = 0;
        this.page_rowcount = 0;

        this.currentTab = 'LIST';
        
        this.date_basedon = 'REF. DATE';
        this.report_category = 'CONSIGNEE SHIPMENT REPORT';
        this.sdate = this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF);
        this.edate = this.gs.defaultValues.today;
        this.mode = 'OCEAN IMPORT';
        this.comp_type = this.gs.branch_code;
        this.report_type = 'HOUSE WISE';
        this.report_shptype = 'ALL';
        this.cons_id = '';
        this.cons_name = '';
        this.cust_parent_id = '';
        this.cust_parent_name = '';
        this.filename = '';
        this.filetype = '';
        this.filedisplayname = '';
        this.sortCol = 'mbl_refno';
        this.selectedId = '';
        this.sortOrder = true;
        this.SearchData = this.gs.UserInfo;

      }
    });
    this.DateBasedList = [{ "id": "REF. DATE", "name": "Ref. Date" }, { "id": "ETD", "name": "ETD" }, { "id": "ETA", "name": "ETA" }];
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.storesub.unsubscribe();
  }

  PageEvents(actions) {
    //GOTOCHANGE2
    if (actions.action == 'GOTO')
      this.page_current = actions.page_current;
    this.List(actions.outputformat, actions.action);
  }

  List(_outputformat: string, _action: string = 'NEW') {

    this.errorMessage = "";
    if (_outputformat == "PRINT") {
      if (this.MainList.length <= 0) {
        this.errorMessage = "List Not Found";
        alert(this.errorMessage);
        return;
      }
    }

    this.SearchData.outputformat = _outputformat;
    this.SearchData.pkid = this.urlid;
    this.SearchData.action = _action;
    this.SearchData.page_count = this.page_count;
    this.SearchData.page_current = this.page_current;
    this.SearchData.page_rows = this.page_rows;
    this.SearchData.page_rowcount = this.page_rowcount;

    if (_outputformat === 'SCREEN' && _action === 'NEW') {
      if (this.cust_parent_id != '') { //If Parent Exist then customer need to empty
        this.cons_id = '';
        this.cons_name = '';
      }
      this.SearchData.JV_YEAR = this.gs.globalVariables.year_code;
      this.SearchData.REPORT_CATEGORY = this.report_category;
      this.SearchData.SDATE = this.sdate;
      this.SearchData.EDATE = this.edate;
      this.SearchData.DATE_TYPE = this.date_basedon;
      this.SearchData.MODE = this.mode;
      this.SearchData.COMP_TYPE = this.comp_type;

      if (this.comp_type === 'ALL') {
        this.SearchData.COMP_CODE = this.gs.branch_codes;
      } else {
        this.SearchData.COMP_CODE = this.comp_type;
      }
      this.SearchData.COMP_NAME = this.gs.GetCompanyName(this.comp_type);
      this.SearchData.REPORT_TYPE = this.report_type;
      this.SearchData.REPORT_SHPTYPE = this.report_shptype;

      this.SearchData.CONSIGNEE_ID = this.cons_id;
      this.SearchData.CONSIGNEE_NAME = this.cons_name;
      this.SearchData.CUST_PARENT_ID = this.cust_parent_id;
      this.SearchData.CUST_PARENT_NAME = this.cust_parent_name;

      this.SearchData.filename = "";
      this.SearchData.filedisplayname = "";
      this.SearchData.filetype = "";
    }


    this.loading = true;

    this.mainservice.ConsigneeShipmentReport(this.SearchData)
      .subscribe(response => {

        if (_outputformat === 'SCREEN') {

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
            report_category: this.SearchData.REPORT_CATEGORY,
            sdate: this.SearchData.SDATE,
            edate: this.SearchData.EDATE,
            mode: this.SearchData.MODE,
            comp_type: this.SearchData.COMP_TYPE,
            report_type: this.SearchData.REPORT_TYPE,
            report_shptype: this.SearchData.REPORT_SHPTYPE,
            cons_id: this.SearchData.CONSIGNEE_ID,
            cons_name: this.SearchData.CONSIGNEE_NAME,
            cust_parent_id: this.SearchData.CUST_PARENT_ID,
            cust_parent_name: this.SearchData.CUST_PARENT_NAME,
            sortcol: 'mbl_refno',
            sortorder: true,
            selectedId: this.selectedId,
            date_basedon: this.SearchData.DATE_TYPE,
            page_rows: response.page_rows,
            page_count: response.page_count,
            page_current: response.page_current,
            page_rowcount: response.page_rowcount,
            records: response.list,
            filename: this.SearchData.filename,
            filetype: this.SearchData.filetype,
            filedisplayname: this.SearchData.filedisplayname
          };
          this.store.dispatch(new myActions.Update({ id: this.urlid, changes: state }));
        } else if (_outputformat == "PRINT") {
          this.filename = response.filename;
          this.filetype = response.filetype;
          this.filedisplayname = response.filedisplayname;
          // this.filename2 = response.filename2;
          // this.filetype2 = response.filetype2;
          // this.filedisplayname2 = response.filedisplayname2;
          this.Print();
        }

        this.loading = false;
      }, error => {
        this.loading = false;
        this.errorMessage = this.gs.getError(error);
        alert(this.errorMessage);
      });
  }

  Close() {
    //this.store.dispatch(new myActions.Delete({ id: this.urlid }));
    this.location.back();
  }

  private sort(sortcol: string) {
    this.store.dispatch(new myActions.SortData({ id: this.urlid, sortcol: sortcol }))
  }

  private selectRowId(rowid: string) {
    this.store.dispatch(new myActions.SelectRow({ id: this.urlid, selecteId: rowid }))
  }

  public getRowId() {
    return this.selectedId;
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
    // this.CONSRECORD = new SearchTable();
    // this.CONSRECORD.controlname = 'CONSIGNEE';
    // this.CONSRECORD.displaycolumn = 'NAME';
    // this.CONSRECORD.type = 'MASTER';
    // this.CONSRECORD.subtype = '';
    // this.CONSRECORD.id = '';
    // this.CONSRECORD.code = '';
  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname === 'CONSIGNEE') {
      this.cons_id = _Record.id;
      this.cons_name = _Record.name;
    }
    if (_Record.controlname === 'PARENT') {
      this.cust_parent_id = _Record.id;
      this.cust_parent_name = _Record.name;
    }
  }
  Print() {
    this.errorMessage = "";
    if (this.MainList.length <= 0) {
      this.errorMessage = "List Not Found";
      alert(this.errorMessage);
      return;
    }
    this.Downloadfile(this.filename, this.filetype, this.filedisplayname);
  }
  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.GLOBAL_REPORT_FOLDER, filename, filetype, filedisplayname);
  }
}
