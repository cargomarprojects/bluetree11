import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { ReportService } from '../services/report.service';
import { TBL_MBL_REPORT } from '../models/tbl_mbl_report';
import { SearchTable } from '../../shared/models/searchtable';
import { User_Menu } from '../../core/models/menum';

import { Store, State, select } from '@ngrx/store';
import *  as myActions from './store/profit-report-house.actions';
import *  as myReducer from './store/profit-report-house.reducer';
import { ReportState } from './store/proft-report-house.models'

import { Observable } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';
import { Tbl_shipment_stage } from '../models/tbl_shipment_stage';

@Component({
  selector: 'app-profit-report-house',
  templateUrl: './profit-report-house.component.html'
})
export class ProfitReportHouseComponent implements OnInit {

  title: string = 'Profit Report - House';

  pkid: string;
  urlid: string;
  url: string;
  menuid: string;

  currentTab: string = '';
  report_category: string;
  sdate: string;
  edate: string;
  mode: string = '';
  comp_type: string = '';
  report_type: string = '';
  client_type: string = 'ALL';

  selectedId = '';

  report_url: string;
  report_searchdata: any = {};
  report_menuid: string;

  filename: string = '';
  filetype: string = '';
  filedisplayname: string = '';
  filename2: string = '';
  filetype2: string = '';
  filedisplayname2: string = '';

  cust_id: string;
  cust_name: string;
  cust_parent_id: string;
  cust_parent_name: string;

  sales_id: string;
  sales_name: string;
  sales_where: string = '';

  _report_category: string;
  _report_type: string = '';

  page_count: number = 0;
  page_current: number = 0;
  page_rows: number = 0;
  page_rowcount: number = 0;


  // Local Variables;

  isAdmin: boolean = false;
  showStages: boolean = false;

  storesub: any;
  sub: any;
  tab: string = 'main';

  loading: boolean = false;
  errorMessage: string = '';

  SearchData: any = {};

  Reportstate1: Observable<ReportState>;
  stagefullrecords: Tbl_shipment_stage[] = [];
  stagerecords: Tbl_shipment_stage[] = [];

  MainList: TBL_MBL_REPORT[];

  menu_current: User_Menu = null;;

  // CUSTRECORD: SearchTable = new SearchTable();
  // SMANRECORD: SearchTable = new SearchTable();
  // HANDRECORD: SearchTable = new SearchTable();

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
      this.LoadStage();
    });

  }

  init() {

    if (this.menu_current = this.gs.getMenuById(this.menuid)) {
      if (this.menu_current.rights_admin == 'Y')
        this.isAdmin = true;

      this.title = this.menu_current.menu_name;
    }

    this.isAdmin = false;
    if (this.gs.user_isadmin == 'Y')
      this.isAdmin = true;

    this.showStages = false;
    if (this.gs.GENERAL_BRANCH_CODE == "MFDR")// MFORWARDER USA
      this.showStages = true;

    this.sales_where = "";
    if (!this.isAdmin)
      this.sales_where = " param_lookup_id = '" + this.gs.user_pkid + "'";
    this.initLov('');

  }

  InitPage() {

    this.storesub = this.store.select(myReducer.getState(this.urlid)).subscribe(rec => {
      this.init();
      if (rec) {

        this.MainList = rec.records;
        this.pkid = rec.pkid;
        this.currentTab = rec.currentTab;

        this.report_category = rec.report_category
        this.sdate = rec.sdate;
        this.edate = rec.edate;
        this.mode = rec.mode;
        this.comp_type = rec.comp_type;
        this.report_type = rec.report_type;

        this.cust_id = rec.cust_id;
        this.cust_name = rec.cust_name;
        this.cust_parent_id = rec.cust_parent_id;
        this.cust_parent_name = rec.cust_parent_name;
        this.sales_id = rec.sales_id;
        this.sales_name = rec.sales_name;
        this.client_type = rec.client_type;
        this.selectedId = rec.selectedId;

        this._report_category = rec._report_category;
        this._report_type = rec._report_type;
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
        this.SearchData.SDATE = this.sdate;
        this.SearchData.EDATE = this.edate;
        this.SearchData.MODE = this.mode;
        this.SearchData.COMP_TYPE = this.comp_type;
        if (this.comp_type == 'ALL')
          this.SearchData.COMP_CODE = this.gs.branch_codes;
        else
          this.SearchData.COMP_CODE = this.comp_type;
        this.SearchData.COMP_NAME = this.gs.GetCompanyName(this.comp_type);
        this.SearchData.REPORT_TYPE = this.report_type;
        this.SearchData.REPORT_CATEGORY = this.report_category;
        this.SearchData.BASEDON = '';
        this.SearchData.REPORT_COLUMN = 'REF.DATE';

        this.SearchData.ISADMIN = (this.isAdmin) ? 'Y' : 'N';
        this.SearchData.SHOWSTAGES = (this.showStages) ? 'Y' : 'N';
        this.SearchData.CUST_ID = this.cust_id;
        this.SearchData.CUST_NAME = this.cust_name;
        this.SearchData.CUST_PARENT_ID = this.cust_parent_id;
        this.SearchData.CUST_PARENT_NAME = this.cust_parent_name;

        // this.CUSTRECORD.id = this.cust_id;
        // this.CUSTRECORD.name = this.cust_name;

        this.SearchData.SALES_ID = this.sales_id;
        this.SearchData.SALES_NAME = this.sales_name;
        this.SearchData.CLIENT_TYPE = this.client_type;
        // this.SMANRECORD.id = this.sales_id;
        // this.SMANRECORD.name = this.sales_name;
        // this.HANDRECORD.id = this.cust_id;
        // this.HANDRECORD.name = this.cust_name;

        this.SearchData.STAGES = rec.stage;
      }
      else {
        this.MainList = Array<TBL_MBL_REPORT>();

        this.page_rows = this.gs.ROWS_TO_DISPLAY;
        this.page_count = 0;
        this.page_current = 0;
        this.page_rowcount = 0;

        this.currentTab = 'LIST';

        this.report_category = "AGENT";
        this.sdate = this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF);
        this.edate = this.gs.defaultValues.today;
        this.mode = 'ALL';
        this.comp_type = this.gs.branch_code;
        this.report_type = "DETAIL";
        this.client_type = "ALL";

        this.selectedId = '';

        this.filename = '';
        this.filetype = '';
        this.filedisplayname = '';
        this.filename2 = '';
        this.filetype2 = '';
        this.filedisplayname2 = '';

        this.cust_id = "";
        this.cust_name = "";
        this.cust_parent_id = "";
        this.cust_parent_name = "";
        this.sales_id = "";
        this.sales_name = "";


        this._report_category = 'AGENT';
        this._report_type = 'SUMMARY';

        this.SearchData = this.gs.UserInfo;

      }
    });

  }
  LoadStage() {
    var SearchData2 = this.gs.UserInfo;
    this.mainservice.StageList(SearchData2).subscribe(response => {
      this.stagefullrecords = response.list;
      this.FillChkListBox();
    }, error => {
      this.errorMessage = this.gs.getError(error)
    });
  }

  FillChkListBox() {
    let sCode: string
    if (this.mode == "OCEAN EXPORT")
      sCode = "OE";
    else if (this.mode == "AIR EXPORT") {
      sCode = "AE";
    }
    else if (this.mode == "AIR IMPORT") {
      sCode = "AI";
    }
    else if (this.mode == "OTHERS") {
      sCode = "OT";
    }
    else if (this.mode == "OCEAN IMPORT") {
      sCode = "OI";
    }
    else
      sCode = "ALL";

    this.stagerecords = <Tbl_shipment_stage[]>[];
    // this.allstagechecked=false;
    // this.selectdeselect = false;
    if (sCode.trim() != "ALL") {
      this.stagefullrecords.filter(rec => rec.ss_mode == sCode).forEach(Rec => {
        Rec.ss_checked = false;
        this.stagerecords.push(Rec);
      })
    }

  }
  SelectStage(_rec: Tbl_shipment_stage) {
    _rec.ss_checked = true;
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

  onChange(field: string) {
    if (field == "report_category") {
      if (this.report_category == "HANDLED BY")
        this.initLov('HANDLED BY');
      else
        this.initLov('CUSTOMER');
    }
    if (field == 'mode') {
      this.FillChkListBox();
    }

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

    if (this.report_category == "CLIENT TYPE" && this.client_type != "ALL") {
      if (this.mode == "ALL" || this.mode == "OCEAN EXPORT" || this.mode == "AIR EXPORT") {
        this.errorMessage = "Please select a Group (OCEAN IMPORT/AIR IMPORT/OTHERS)";
        alert(this.errorMessage);
        return;
      }
    }

    let _STAGES: string = "";
    this.stagerecords.forEach(Rec => {
      if (Rec.ss_checked) {
        if (_STAGES.trim() != "")
          _STAGES += ",";
        _STAGES += "'" + Rec.ss_stage.trim() + "'";
      }
    })

    this.SearchData.outputformat = _outputformat;
    this.SearchData.pkid = this.urlid;
    this.SearchData.action = _action;
    this.SearchData.page_count = this.page_count;
    this.SearchData.page_current = this.page_current;
    this.SearchData.page_rows = this.page_rows;
    this.SearchData.page_rowcount = this.page_rowcount;

    if (_outputformat == "SCREEN" && _action == 'NEW') {
      if (this.cust_parent_id != '' && this.report_category != 'HANDLED BY') { //If Parent Exist then customer need to empty
        this.cust_id = '';
        this.cust_name = '';
      }
      this.SearchData.REPORT_CATEGORY = this.report_category;
      this.SearchData.SDATE = this.sdate;
      this.SearchData.EDATE = this.edate;
      this.SearchData.MODE = this.mode;
      this.SearchData.COMP_TYPE = this.comp_type;

      if (this.comp_type == 'ALL')
        this.SearchData.COMP_CODE = this.gs.branch_codes;
      else
        this.SearchData.COMP_CODE = this.comp_type;
      this.SearchData.COMP_NAME = this.gs.GetCompanyName(this.comp_type);

      this.SearchData.REPORT_TYPE = this.report_type;
      this.SearchData.CLIENT_TYPE = this.client_type;

      this.SearchData.BASEDON = '';
      this.SearchData.REPORT_COLUMN = 'REF.DATE';

      this.SearchData.ISADMIN = (this.isAdmin) ? 'Y' : 'N';
      this.SearchData.SHOWSTAGES = (this.showStages) ? 'Y' : 'N';


      this.SearchData.CUST_ID = this.cust_id;
      this.SearchData.CUST_NAME = this.cust_name;
      this.SearchData.CUST_PARENT_ID = this.cust_parent_id;
      this.SearchData.CUST_PARENT_NAME = this.cust_parent_name;

      this.SearchData.SALES_ID = this.sales_id;
      this.SearchData.SALES_NAME = this.sales_name;
      this.SearchData.STAGES = _STAGES;
    }

    this.loading = true;

    this.mainservice.ProfitReportHouse(this.SearchData)
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
            mode: this.SearchData.MODE,
            comp_type: this.SearchData.COMP_TYPE,
            report_type: this.SearchData.REPORT_TYPE,

            cust_id: this.SearchData.CUST_ID,
            cust_name: this.SearchData.CUST_NAME,
            cust_parent_id: this.SearchData.CUST_PARENT_ID,
            cust_parent_name: this.SearchData.CUST_PARENT_NAME,
            sales_id: this.SearchData.SALES_ID,
            sales_name: this.SearchData.SALES_NAME,
            client_type: this.SearchData.CLIENT_TYPE,
            selectedId: this.selectedId,

            _report_category: this.SearchData.REPORT_CATEGORY,
            _report_type: this.SearchData.REPORT_TYPE,
            stage: this.SearchData.STAGES,

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


  initLov(caption: string = '') {

    // if (caption == '' || caption == 'CUSTOMER') {
    //   this.CUSTRECORD = new SearchTable();
    //   this.CUSTRECORD.controlname = "CUSTOMER";
    //   this.CUSTRECORD.displaycolumn = "NAME";
    //   this.CUSTRECORD.type = "MASTER";
    //   this.CUSTRECORD.subtype = "";
    //   this.CUSTRECORD.id = "";
    //   this.CUSTRECORD.code = "";
    // }
    // if (caption == '' || caption == 'SALESMAN') {
    //   this.SMANRECORD = new SearchTable();
    //   this.SMANRECORD.controlname = "SALESMAN";
    //   this.SMANRECORD.displaycolumn = "NAME";
    //   this.SMANRECORD.type = "PARAM";
    //   this.SMANRECORD.subtype = "SALESMAN";
    //   this.SMANRECORD.id = "";
    //   this.SMANRECORD.code = "";
    // if (!this.isAdmin)
    //   this.SMANRECORD.where = " param_lookup_id = '" + this.gs.user_pkid + "'";
    // }
    // if (caption == ''||caption == 'HANDLED BY') {
    // this.HANDRECORD = new SearchTable();
    // this.HANDRECORD.controlname = "HANDLED BY";
    // this.HANDRECORD.displaycolumn = "NAME";
    // this.HANDRECORD.type = "PARAM";
    // this.HANDRECORD.subtype = "SALESMAN";
    // this.HANDRECORD.id = "";
    // this.HANDRECORD.code = "";
    // }

  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "CUSTOMER" || _Record.controlname == "HANDLED BY") {
      this.cust_id = _Record.id;
      this.cust_name = _Record.name;
    }
    if (_Record.controlname == "SALESMAN") {
      this.sales_id = _Record.id;
      this.sales_name = _Record.name;
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


  private selectRowId(rowid: string) {
    this.store.dispatch(new myActions.SelectRow({ id: this.urlid, selecteId: rowid }))
  }

  public getRowId() {
    return this.selectedId;
  }


}
