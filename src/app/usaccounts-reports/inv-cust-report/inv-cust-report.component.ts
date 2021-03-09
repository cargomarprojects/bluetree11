import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { UsAccountReportService } from '../services/usaccounts-report.service';
import { Tbl_OS_REPORT } from '../models/Tbl_OS_Report';
import { SearchTable } from '../../shared/models/searchtable';

import { Store, State, select } from '@ngrx/store';
import * as myActions from './store/inv-cust-report.actions';
import * as myReducer from './store/inv-cust-report.reducer';
import { ReportState } from './store/inv-cust-report.models'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inv-cust-report',
  templateUrl: './inv-cust-report.component.html'
})
export class InvCustReportComponent implements OnInit {

  title = 'Invoice Customer Report';
  pkid: string;
  urlid: string;
  url: string;
  menuid: string;
  currentTab = '';

  billcust_id: string = '';
  billcust_name: string = '';
  billcust_code: string = '';

  cust_id: string;
  cust_name: string;
  cust_code: string;
  sortname: string = 'inv_no';

  page_count: number = 0;
  page_current: number = 0;
  page_rows: number = 0;
  page_rowcount: number = 0;

  storesub: any;
  sub: any;

  allchecked: boolean = false;
  selectdeselect: boolean = false;

  loading: boolean = false;
  errorMessage: string = '';
  SearchData: any = {};
  Reportstate1: Observable<ReportState>;
  MainList: Tbl_OS_REPORT[];

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
    });

  }

  InitPage() {

    this.storesub = this.store.select(myReducer.getState(this.urlid)).subscribe(rec => {
      this.initLov();
      if (rec) {

        this.MainList = JSON.parse(JSON.stringify(rec.records));
        this.pkid = rec.pkid;
        this.currentTab = rec.currentTab;
        this.cust_id = rec.cust_id;
        this.cust_code = rec.cust_code;
        this.cust_name = rec.cust_name;
        this.sortname = rec.sortname;

        this.page_rows = rec.page_rows;
        this.page_count = rec.page_count;
        this.page_current = rec.page_current;
        this.page_rowcount = rec.page_rowcount;

        this.SearchData = this.gs.UserInfo;
        this.SearchData.CUST_ID = this.cust_id;
        this.SearchData.JV_YEAR = this.gs.year_code;
        this.SearchData.SORT = this.sortname;

      } else {
        this.MainList = Array<Tbl_OS_REPORT>();
        this.page_rows = this.gs.ROWS_TO_DISPLAY;
        this.page_count = 0;
        this.page_current = 0;
        this.page_rowcount = 0;

        this.currentTab = 'LIST';
        this.cust_id = '';
        this.cust_code = '';
        this.cust_name = '';
        this.sortname = 'inv_date';
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
    this.allchecked = false;
    this.errorMessage = "";
    if (this.gs.isBlank(this.cust_id.trim())) {
      this.errorMessage = "Customer Cannot be Blank";
      alert(this.errorMessage);
      return;
    }

    if (this.gs.isBlank(this.sortname))
      this.sortname = "inv_no";

    this.SearchData.outputformat = _outputformat;
    this.SearchData.pkid = this.urlid;
    this.SearchData.action = _action;
    this.SearchData.page_count = this.page_count;
    this.SearchData.page_current = this.page_current;
    this.SearchData.page_rows = this.page_rows;
    this.SearchData.page_rowcount = this.page_rowcount;

    if (_outputformat === 'SCREEN' && _action === 'NEW') {

      this.SearchData.CUST_ID = this.cust_id;
      this.SearchData.CUST_CODE = this.cust_code;
      this.SearchData.CUST_NAME = this.cust_name;
      this.SearchData.SORT = this.sortname;
    }


    this.loading = true;

    this.mainservice.InvoiceCustomer(this.SearchData)
      .subscribe(response => {

        if (_outputformat === 'SCREEN') {
          const state: ReportState = {
            pkid: this.pkid,
            urlid: this.urlid,
            menuid: this.menuid,
            currentTab: this.currentTab,
            cust_id: this.SearchData.CUST_ID,
            cust_code: this.SearchData.CUST_CODE,
            cust_name: this.SearchData.CUST_NAME,
            sortname: this.sortname,
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

  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname === 'CUSTOMER') {
      this.cust_id = _Record.id;
      this.cust_code = _Record.code;
      this.cust_name = _Record.name;
    }

    if (_Record.controlname === 'CUSTOMER2') {
      this.billcust_id = _Record.id;
      this.billcust_code = _Record.code;
      this.billcust_name = _Record.name;
    }
  }


  SelectDeselect() {
    this.selectdeselect = !this.selectdeselect;
    this.MainList.forEach(Rec => {
      Rec.inv_flag_b = this.selectdeselect;
      Rec.inv_flag = this.selectdeselect == true ? 'Y' : 'N';
      this.allchecked = this.selectdeselect;
    })
  }


  Update() {

    this.errorMessage = '';
    if (this.MainList.length <= 0) {
      this.errorMessage = "List Not Found";
      alert(this.errorMessage);
      return;
    }

    if (this.gs.isBlank(this.cust_id.trim())) {
      this.errorMessage = "Customer Cannot be Blank";
      alert(this.errorMessage);
      return;
    }

    if (this.gs.isBlank(this.billcust_id) || this.gs.isBlank(this.billcust_name)) {
      this.errorMessage = "Invalid Billing Customer";
      alert(this.errorMessage);
      return;
    }

    let Inv_IDS: string = "";
    Inv_IDS = "";
    this.MainList.forEach(Rec => {
      if (Rec.inv_flag_b) {
        if (Inv_IDS != "")
          Inv_IDS += ',';
        Inv_IDS += Rec.inv_pkid;
      }
    })

    if (this.gs.isBlank(Inv_IDS)) {
      this.errorMessage = "No Records Selected to Update";
      alert(this.errorMessage);
      return;
    }

    if (!confirm("Update Selected Record with Billing Customer " + this.billcust_name)) {
      return;
    }

    var SearchData = this.gs.UserInfo;
    SearchData.INV_IDS = Inv_IDS;
    SearchData.OLD_CUST_ID = this.cust_id;
    SearchData.NEW_CUST_ID = this.billcust_id;
    SearchData.NEW_CUST_NAME = this.billcust_name;

    this.mainservice.UpdateBillingCustomer(SearchData)
      .subscribe(response => {

        if (response.retvalue) {
          if (Inv_IDS.indexOf(",") > 0) {
            var tempid = Inv_IDS.split(',');
            for (var i = 0; i < tempid.length; i++)
              this.MainList.splice(this.MainList.findIndex(rec => rec.inv_pkid == tempid[i]), 1);
          } else
            this.MainList.splice(this.MainList.findIndex(rec => rec.inv_pkid == Inv_IDS), 1);
        }

      }, error => {
        this.errorMessage = this.gs.getError(error);
      });

  }

  editmaster(_record: Tbl_OS_REPORT) {

    let sID: string = (_record.inv_mbl_id != null) ? _record.inv_mbl_id.toString() : "";
    let REFNO: string = _record.inv_type != null ? _record.inv_type.toString() : "";
    let sMode: string = "";
    let branch_code: string = _record.inv_branch_code != null ? _record.inv_branch_code.toString() : "";

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

  editinvoice(_record: Tbl_OS_REPORT) {

    let sID: string = (_record.inv_mbl_id != null) ? _record.inv_mbl_id.toString() : "";
    let REFNO: string = _record.inv_type != null ? _record.inv_type.toString() : "";
    let sMode: string = "";
    let branch_code: string = _record.inv_branch_code != null ? _record.inv_branch_code.toString() : "";
    let INVID: string = (_record.inv_pkid != null) ? _record.inv_pkid.toString() : "";
    let HBLID: string = (_record.inv_hbl_id != null) ? _record.inv_hbl_id.toString() : "";

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
