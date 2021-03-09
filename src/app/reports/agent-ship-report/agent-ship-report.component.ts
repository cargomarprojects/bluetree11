import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { ReportService } from '../services/report.service';
import { TBL_MBL_REPORT } from '../models/tbl_mbl_report';
import { SearchTable } from '../../shared/models/searchtable';

import { Store, State, select } from '@ngrx/store';
import * as myActions from './store/agent-ship-report.actions';
import * as myReducer from './store/agent-ship-report.reducer';
import { ReportState } from './store/agent-ship-report.models'

import { Observable } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-agent-ship-report',
  templateUrl: './agent-ship-report.component.html'
})
export class AgentShipReportComponent implements OnInit {

  title = 'Agent Shipment Report';

  pkid: string;
  urlid: string;
  url: string;
  menuid: string;

  currentTab = '';

  sdate: string;
  edate: string;
  mode = '';
  comp_type: string = '';

  filename: string = '';
  filetype: string = '';
  filedisplayname: string = '';

  cust_id: string;
  cust_name: string;
  cust_parent_id: string;
  cust_parent_name: string;
  shipper_id: string;
  shipper_name: string;
  consignee_id: string;
  consignee_name: string;

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

  MainList: TBL_MBL_REPORT[];

  CONSRECORD: SearchTable = new SearchTable();

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
        this.sdate = rec.sdate;
        this.edate = rec.edate;
        this.mode = rec.mode;
        this.comp_type = rec.comp_type;
        this.cust_id = rec.cust_id;
        this.cust_name = rec.cust_name;
        this.cust_parent_id = rec.cust_parent_id;
        this.cust_parent_name = rec.cust_parent_name;
        this.shipper_id = rec.shipper_id;
        this.shipper_name = rec.shipper_name;
        this.consignee_id = rec.consignee_id;
        this.consignee_name = rec.consignee_name;
        this.filename = rec.filename;
        this.filetype = rec.filetype;
        this.filedisplayname = rec.filedisplayname;

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
        this.SearchData.COMP_NAME = this.gs.branch_name;

        this.SearchData.SHIPPER_ID = this.shipper_id;
        this.SearchData.SHIPPER_NAME = this.shipper_name;
        this.SearchData.CONSIGNEE_ID = this.consignee_id;
        this.SearchData.CONSIGNEE_NAME = this.consignee_name;
        this.SearchData.CUST_ID = this.cust_id;
        this.SearchData.CUST_NAME = this.cust_name;
        this.SearchData.CUST_PARENT_ID = this.cust_parent_id;
        this.SearchData.CUST_PARENT_NAME = this.cust_parent_name;

      } else {
        this.MainList = Array<TBL_MBL_REPORT>();

        this.page_rows = this.gs.ROWS_TO_DISPLAY;
        this.page_count = 0;
        this.page_current = 0;
        this.page_rowcount = 0;

        this.currentTab = 'LIST';

        this.sdate = this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF);
        this.edate = this.gs.defaultValues.today;
        this.mode = 'OCEAN IMPORT';
        this.comp_type = this.gs.branch_code;
        this.shipper_id = '';
        this.shipper_name = '';
        this.consignee_id = '';
        this.consignee_name = '';
        this.cust_id = '';
        this.cust_name = '';
        this.cust_parent_id = '';
        this.cust_parent_name = '';
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

    if (_outputformat === 'SCREEN' && _action === 'NEW') {
      if (this.cust_parent_id != '') { //If Parent Exist then customer need to empty
        this.cust_id = '';
        this.cust_name = '';
      }
      this.SearchData.JV_YEAR = this.gs.globalVariables.year_code;
      this.SearchData.SDATE = this.sdate;
      this.SearchData.EDATE = this.edate;
      this.SearchData.MODE = this.mode;
      this.SearchData.COMP_TYPE = this.comp_type;
      if (this.comp_type === 'ALL') {
        this.SearchData.COMP_CODE = this.gs.branch_codes;
      } else {
        this.SearchData.COMP_CODE = this.comp_type;
      }
      this.SearchData.COMP_NAME = this.gs.branch_name;
      this.SearchData.SHIPPER_ID = this.shipper_id;
      this.SearchData.SHIPPER_NAME = this.shipper_name;
      this.SearchData.CONSIGNEE_ID = this.consignee_id;
      this.SearchData.CONSIGNEE_NAME = this.consignee_name;
      this.SearchData.CUST_ID = this.cust_id;
      this.SearchData.CUST_NAME = this.cust_name;
      this.SearchData.CUST_PARENT_ID = this.cust_parent_id;
      this.SearchData.CUST_PARENT_NAME = this.cust_parent_name;
      this.SearchData.filename = "";
      this.SearchData.filedisplayname = "";
      this.SearchData.filetype = "";
    }

    this.loading = true;
    this.mainservice.AgentShipmentReport(this.SearchData)
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
            sdate: this.SearchData.SDATE,
            edate: this.SearchData.EDATE,
            mode: this.SearchData.MODE,
            comp_type: this.SearchData.COMP_TYPE,
            cust_id: this.SearchData.CUST_ID,
            cust_name: this.SearchData.CUST_NAME,
            cust_parent_id: this.SearchData.CUST_PARENT_ID,
            cust_parent_name: this.SearchData.CUST_PARENT_NAME,
            shipper_id: this.SearchData.SHIPPER_ID,
            shipper_name: this.SearchData.SHIPPER_NAME,
            consignee_id: this.SearchData.CONSIGNEE_ID,
            consignee_name: this.SearchData.CONSIGNEE_NAME,
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
    // this.CONSRECORD = new SearchTable();
    // this.CONSRECORD.controlname = 'CONSIGNEE';
    // this.CONSRECORD.displaycolumn = 'NAME';
    // this.CONSRECORD.type = 'MASTER';
    // this.CONSRECORD.subtype = '';
    // this.CONSRECORD.id = '';
    // this.CONSRECORD.code = '';
  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname === 'CUSTOMER') {
      this.cust_id = _Record.id;
      this.cust_name = _Record.name;
    }
    if (_Record.controlname === 'PARENT') {
      this.cust_parent_id = _Record.id;
      this.cust_parent_name = _Record.name;
    }
    if (_Record.controlname === 'SHIPPER') {
      this.shipper_id = _Record.id;
      this.shipper_name  = _Record.name;
    }
    if (_Record.controlname === 'CONSIGNEE') {
      this.consignee_id = _Record.id;
      this.consignee_name  = _Record.name;
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
