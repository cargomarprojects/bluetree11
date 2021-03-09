import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { ReportService } from '../services/report.service';
import { TBL_INV_ISSUE_RPT } from '../models/tbl_inv_issue_rpt';
import { SearchTable } from '../../shared/models/searchtable';

import { Store, State, select } from '@ngrx/store';
import * as myActions from './store/inv-iss-report.actions';
import * as myReducer from './store/inv-iss-report.reducer';
import { ReportState } from './store/inv-iss-report.models'

import { Observable } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material';

@Component({
  selector: 'app-invoice-issue-report',
  templateUrl: './inv-iss-report.component.html'
})
export class InvIssReportComponent implements OnInit {

  title = 'Invoice Issue Report';

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
  filename: string = '';
  filetype: string = '';
  filedisplayname: string = '';

  cust_id: string;
  cust_name: string;

  cust_parent_id: string;
  cust_parent_name: string;
  datetype: string = 'Inv-Date';
  araptype: string = 'A/R';

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

  MainList: TBL_INV_ISSUE_RPT[];

  // CUSTRECORD: SearchTable = new SearchTable();
  // PARENTRECORD: SearchTable = new SearchTable();

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
        this.mode = rec.mode;
        this.comp_type = rec.comp_type;
        this.report_type = rec.report_type;
        this.report_shptype = rec.report_shptype;
        this.filename = rec.filename;
        this.filetype = rec.filetype;
        this.filedisplayname = rec.filedisplayname;
        this.cust_id = rec.cust_id;
        this.cust_name = rec.cust_name;

        this.cust_parent_id = rec.cust_parent_id;
        this.cust_parent_name = rec.cust_parent_name;
        this.datetype = rec.datetype;
        this.araptype = rec.araptype;
        this.reportformat = rec.reportformat;


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
        this.SearchData.REPORT_TYPE = this.report_type;
        this.SearchData.REPORT_SHPTYPE = this.report_shptype;

        this.SearchData.CUST_ID = this.cust_id;
        this.SearchData.CUST_NAME = this.cust_name;
        // this.CUSTRECORD.id = this.cust_id;
        // this.CUSTRECORD.name = this.cust_name;


        this.SearchData.CUST_PARENT_ID = this.cust_parent_id;
        this.SearchData.CUST_PARENT_NAME = this.cust_parent_name;
        // this.PARENTRECORD.id = this.cust_parent_id;
        // this.PARENTRECORD.name = this.cust_parent_name;
        this.SearchData.DATE_TYPE = this.datetype;
        this.SearchData.ARAP_TYPE = this.araptype;



      } else {
        this.MainList = Array<TBL_INV_ISSUE_RPT>();

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
        this.report_type = 'DETAIL';
        this.report_shptype = 'ALL';
        this.filename = '';
        this.filetype = '';
        this.filedisplayname = '';

        this.cust_id = '';
        this.cust_name = '';

        this.cust_parent_id = '';
        this.cust_parent_name = '';
        this.datetype = 'Inv-Date';
        this.araptype = 'A/R';
        this.reportformat = 'DETAIL';


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
    if (this.gs.isBlank(this.cust_id) && this.gs.isBlank(this.cust_parent_id)) {
      this.errorMessage = 'Parent or Customer Cannot be Empty';
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
      if (this.cust_parent_id != '') { //If Parent Exist then customer need to empty
        this.cust_id = '';
        this.cust_name = '';
      }

      this.SearchData.JV_YEAR = this.gs.globalVariables.year_code;
      this.SearchData.REPORT_CATEGORY = this.report_category;
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
      this.SearchData.REPORT_TYPE = this.report_type;
      this.SearchData.REPORT_SHPTYPE = this.report_shptype;

      this.SearchData.CUST_ID = this.cust_id;
      this.SearchData.CUST_NAME = this.cust_name;

      this.SearchData.CUST_PARENT_ID = this.cust_parent_id;
      this.SearchData.CUST_PARENT_NAME = this.cust_parent_name;
      this.SearchData.DATE_TYPE = this.datetype;
      this.SearchData.ARAP_TYPE = this.araptype;
      this.SearchData.filename = "";
      this.SearchData.filedisplayname = "";
      this.SearchData.filetype = "";
      this.reportformat = this.report_type;
    }


    this.loading = true;

    this.mainservice.InvoiceIssueReport(this.SearchData)
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
            cust_id: this.SearchData.CUST_ID,
            cust_name: this.SearchData.CUST_NAME,
            cust_parent_id: this.SearchData.CUST_PARENT_ID,
            cust_parent_name: this.SearchData.CUST_PARENT_NAME,
            datetype: this.SearchData.DATE_TYPE,
            araptype: this.SearchData.ARAP_TYPE,
            reportformat: this.reportformat,
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
    // this.CUSTRECORD = new SearchTable();
    // this.CUSTRECORD.controlname = 'CUSTOMER';
    // this.CUSTRECORD.displaycolumn = 'NAME';
    // this.CUSTRECORD.type = 'MASTER';
    // this.CUSTRECORD.subtype = '';
    // this.CUSTRECORD.id = '';
    // this.CUSTRECORD.code = '';

    // this.PARENTRECORD = new SearchTable();
    // this.PARENTRECORD.controlname = 'PARENT';
    // this.PARENTRECORD.displaycolumn = 'NAME';
    // this.PARENTRECORD.type = 'OVERSEAAGENT';
    // this.PARENTRECORD.subtype = '';
    // this.PARENTRECORD.id = '';
    // this.PARENTRECORD.code = '';
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

  editmaster(_record: TBL_INV_ISSUE_RPT) {

    let sID: string = (_record.mbl_pkid != null) ? _record.mbl_pkid.toString() : "";
    let REFNO: string = _record.mbl_refno != null ? _record.mbl_refno.toString() : "";
    let sMode: string = _record.mbl_mode != null ? _record.mbl_mode.toString() : "";
    let branch_code: string = _record.mbl_branch_code != null ? _record.mbl_branch_code.toString() : "";

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

  editinvoice(_record: TBL_INV_ISSUE_RPT) {

    let sID: string = (_record.mbl_pkid != null) ? _record.mbl_pkid.toString() : "";
    let REFNO: string = _record.inv_type != null ? _record.inv_type.toString() : "";
    let sMode: string = "";
    let INVID: string = (_record.inv_pkid != null) ? _record.inv_pkid.toString() : "";
    let HBLID: string = (_record.inv_hbl_id != null) ? _record.inv_hbl_id.toString() : "";
    let branch_code: string = _record.mbl_branch_code != null ? _record.mbl_branch_code.toString() : "";

    if (REFNO == "OI")
      sMode = "SEA IMPORT";
    else if (REFNO == "OE")
      sMode = "SEA EXPORT";
    else if (REFNO == "AI")
      sMode = "AIR IMPORT";
    else if (REFNO == "AE")
      sMode = "AIR EXPORT";
    else if (REFNO == "OT")
      sMode = "OTHERS";

    if (INVID == "" || sID == "") {
      alert("Invalid Record Selected");
      return;
    }
    if (branch_code == this.gs.branch_code) {
      this.gs.LinkPage("INVNO", sMode, REFNO, sID, HBLID, INVID);
    }
    else {
      alert("Cannot Show Details from another Branch");
    }
  }

}
