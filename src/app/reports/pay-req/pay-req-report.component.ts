import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { ReportService } from '../services/report.service';
import { Tbl_Cargo_Payrequest } from '../models/Tbl_Cargo_Payrequest';
import { Tbl_cargo_invoicem } from '../models/Tbl_cargo_invoicem';
import { Tbl_cargo_general } from '../../other/models/tbl_cargo_general'
import { SearchTable } from '../../shared/models/searchtable';

import { Store, State, select } from '@ngrx/store';
import * as myActions from './store/pay-req-report.actions';
import * as myReducer from './store/pay-req-report.reducer';
import { ReportState } from './store/pay-req-report.models'

import { Observable } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pay-req-report',
  templateUrl: './pay-req-report.component.html'
})
export class PayReqReportComponent implements OnInit {

  title = 'Payment Request Report';

  pkid: string;
  urlid: string;
  url: string;
  menuid: string;

  currentTab = '';

  report_category: string;
  sdate: string;
  edate: string;
  mode = 'PENDING';
  comp_type: string = '';
  report_type: string = '';
  report_shptype: string = '';

  user_id: string;
  user_name: string;

  attach_title: string = '';
  attach_parentid: string = '';
  attach_refno: string = '';
  attach_type: string = '';
  attach_typelist: any = {};
  attach_tablename: string = '';
  attach_tablepkcolumn: string = '';
  attach_customername: string = '';

  reportformat = '';
  payrefno = "";
  paystatus = "";
  paypkid = "";
  modal: any;

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

  MainList: Tbl_Cargo_Payrequest[];

  Invoketitle: string = "";
  Invoketype: string = "";
  HouseList: Tbl_cargo_general[];
  InvoiceList: Tbl_cargo_invoicem[];

  // USERRECORD: SearchTable = new SearchTable();


  constructor(
    private modalconfig: NgbModalConfig,
    private modalservice: NgbModal,
    public gs: GlobalService,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private location: Location,
    private store: Store<myReducer.AppState>,
    private mainservice: ReportService
  ) {

    modalconfig.backdrop = 'static'; //true/false/static
    modalconfig.keyboard = true; //true Closes the modal when escape key is pressed

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

        this.MainList = JSON.parse(JSON.stringify(rec.records));
        this.pkid = rec.pkid;
        this.currentTab = rec.currentTab;

        this.report_category = rec.report_category;
        this.sdate = rec.sdate;
        this.edate = rec.edate;
        this.mode = rec.mode;

        this.user_id = rec.user_id;
        this.user_name = rec.user_name;

        // this.USERRECORD.id = this.user_id;
        // this.USERRECORD.name = this.user_name;

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
        this.MainList = Array<Tbl_Cargo_Payrequest>();

        this.page_rows = this.gs.ROWS_TO_DISPLAY;
        this.page_count = 0;
        this.page_current = 0;
        this.page_rowcount = 0;

        this.currentTab = 'LIST';

        this.report_category = 'CONSIGNEE SHIPMENT REPORT';
        this.sdate = this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF);
        this.edate = this.gs.defaultValues.today;
        this.mode = 'PENDING';
        this.comp_type = this.gs.branch_code;

        this.user_id = this.gs.user_pkid;
        this.user_name = this.gs.user_name;

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
      this.SearchData.STYPE = this.mode;
      this.SearchData.ISADMIN = 'N';

      this.SearchData.REQUEST_ID = this.user_id;
      this.SearchData.user_id = this.user_id;
      this.SearchData.user_name = this.user_name;


    }

    this.loading = true;

    this.mainservice.PayReqReport(this.SearchData)
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
            mode: this.SearchData.STYPE,
            comp_type: this.SearchData.COMP_TYPE,

            user_id: this.SearchData.user_id,
            user_name: this.SearchData.user_name,

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
    // this.USERRECORD = new SearchTable();
    // this.USERRECORD.controlname = "USER";
    // this.USERRECORD.displaycolumn = "NAME";
    // this.USERRECORD.type = "USER";
    // this.USERRECORD.subtype = "";
    // this.USERRECORD.id = this.gs.user_pkid;
    // this.USERRECORD.name = this.user_name;

  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "USER") {
      this.user_id = _Record.id;
      this.user_name = _Record.name;
    }
  }

  editmaster(_record: Tbl_Cargo_Payrequest) {
    let sID: string = (_record.cp_master_id != null) ? _record.cp_master_id.toString() : "";
    let REFNO: string = _record.cp_master_refno != null ? _record.cp_master_refno.toString() : "";
    let sMode: string = _record.cp_mode != null ? _record.cp_mode.toString() : "";
    if (sID == "") {
      alert('Invalid Record Selected');
      return;
    }
    this.gs.LinkPage("REFNO", sMode, REFNO, sID);

  }

  editinvoice(_record: Tbl_Cargo_Payrequest) {

    let sID: string = (_record.cp_master_id != null) ? _record.cp_master_id.toString() : "";
    let REFNO: string = _record.cp_master_refno != null ? _record.cp_master_refno.toString() : "";
    let sMode: string = _record.cp_mode != null ? _record.cp_mode.toString() : "";
    let INVID: string = _record.cp_inv_id != null ? _record.cp_inv_id.toString() : "";
    if (sID == "" || INVID == "") {
      alert('Invalid Record Selected');
      return;
    }
    this.gs.LinkPage("INVNO", sMode, REFNO, sID, "", INVID);
  }


  editapproval(_record: Tbl_Cargo_Payrequest) {
    let sID: string = (_record.cp_master_id != null) ? _record.cp_master_id.toString() : "";
    if (sID == "") {
      alert("Invalid Record Selected");
      return;
    }

    let SMENU_ID: string = "11815566-3D53-4DE6-9EBD-FFE83061AD76";
    if (this.gs.canEdit(SMENU_ID) || this.gs.canView(SMENU_ID)) {
      let parameter = {
        menuid: SMENU_ID,
        mbl_pkid: sID,
        mbl_refno: _record.cp_master_refno,
        doc_type: _record.cp_mode,
        req_type: 'APPROVED',
        is_locked: false,
        origin: 'payment-req-page'
      };
      this.gs.Naviagete('Silver.Other.Trans/ApprovedPageList', JSON.stringify(parameter));

    }
    else
      alert("Insufficient Rights");

  }


  UpdatePayStatus(_record: Tbl_Cargo_Payrequest, paymodal: any) {

    if (this.gs.user_isadmin == "Y" || this.gs.canEdit(this.menuid)) {
      this.paypkid = _record.cp_pkid;
      this.payrefno = _record.cp_master_refno;
      this.paystatus = _record.cp_pay_status;
      if (this.paypkid.length > 0) {
        this.modal = this.modalservice.open(paymodal, { centered: true });
      } else
        alert("Invalid Record Selected");
    } else
      alert("Insufficient Rights");
  }

  UpdatePayment() {

    if (this.paystatus == undefined || this.paystatus == null || this.paystatus == '') {
      alert('Payment update status cannot be blank')
      return;
    }
    this.errorMessage = '';
    var searchData = this.gs.UserInfo;
    searchData.CP_PKID = this.paypkid;
    searchData.CP_PAY_STATUS = this.paystatus;
    searchData.company_code = this.gs.company_code;
    searchData.branch_code = this.gs.branch_code;

    this.mainservice.PayReqUpdate(searchData)
      .subscribe(response => {
        if (response.retvalue) {
          var REC = this.MainList.find(rec => rec.cp_pkid == this.paypkid);
          if (REC != null)
            REC.cp_pay_status = this.paystatus;
          this.modal.close();
        } else
          this.errorMessage = response.error;
      }, error => {
        this.errorMessage = this.gs.getError(error);
        alert(this.errorMessage);
      });
  }


  AttachedOhblFiles(_record: Tbl_Cargo_Payrequest, payuploadmodal: any, payattachmodal: any) {
    this.HouseList = <Tbl_cargo_general[]>[];
    let MBLID: string = (_record.cp_master_id != null) ? _record.cp_master_id.toString() : "";
    if (MBLID.trim() == "") {
      alert("Invalid Record Selected");
      return;
    }

    this.errorMessage = '';
    var searchData = this.gs.UserInfo;
    searchData.MBLID = MBLID;
    searchData.company_code = this.gs.company_code;
    searchData.branch_code = this.gs.branch_code;

    this.mainservice.PayReqUploadHouseList(searchData)
      .subscribe(response => {
        this.HouseList = response.list;
        this.Invoketitle = "Attachments";
        this.Invoketype = "HOUSE-LIST";
        if (this.HouseList != null) {
          if (this.HouseList.length <= 0)
            alert("House Not Found");
          else if (this.HouseList.length == 1) {
            let TypeList: any[] = [];
            this.attach_title = "File Uploaded";
            this.attach_parentid = this.HouseList[0].hbl_pkid;
            this.attach_type = "OHBL OR TELEX RLS";
            this.attach_typelist = TypeList;
            this.attach_tablename = "cargo_housem";
            this.attach_tablepkcolumn = "hbl_pkid"
            this.attach_refno = this.HouseList[0].hbl_houseno;
            this.attach_customername = "";
            this.modal = this.modalservice.open(payattachmodal, { centered: true });
          } else {
            this.modal = this.modalservice.open(payuploadmodal, { centered: true });
          }
        } else
          alert("House Not Found");
      }, error => {
        this.errorMessage = this.gs.getError(error);
        alert(this.errorMessage);
      });

    // this.modal = this.modalservice.open(paymodal, { centered: true });
  }

  AttachedCheckFiles(_record: Tbl_Cargo_Payrequest, payuploadmodal: any, payattachmodal: any) {
    this.InvoiceList = <Tbl_cargo_invoicem[]>[];
    let MBLID: string = (_record.cp_master_id != null) ? _record.cp_master_id.toString() : "";
    if (MBLID.trim() == "") {
      alert("Invalid Record Selected");
      return;
    }

    this.errorMessage = '';
    var searchData = this.gs.UserInfo;
    searchData.MBLID = MBLID;
    searchData.company_code = this.gs.company_code;
    searchData.branch_code = this.gs.branch_code;

    this.mainservice.PayReqUploadInvoiceList(searchData)
      .subscribe(response => {
        this.InvoiceList = response.list;
        this.Invoketitle = "Check Copy";
        this.Invoketype = "INVOICE-LIST";
        if (this.InvoiceList != null) {
          if (this.InvoiceList.length <= 0)
            alert("Invoice Not Found");
          else if (this.InvoiceList.length == 1) {
            let TypeList: any[] = [];
            TypeList = [{ "code": "CHECK COPY", "name": "CHECK COPY" }];
            this.attach_title = "File Uploaded";
            this.attach_parentid = this.InvoiceList[0].inv_pkid;
            this.attach_type = "CHECK COPY";
            this.attach_typelist = TypeList;
            this.attach_tablename = "cargo_invoicem";
            this.attach_tablepkcolumn = "inv_pkid"
            this.attach_refno = this.InvoiceList[0].inv_no;
            this.attach_customername = this.InvoiceList[0].inv_name;
            this.modal = this.modalservice.open(payattachmodal, { centered: true });

          } else {
            this.modal = this.modalservice.open(payuploadmodal, { centered: true });
          }
        } else
          alert("Invoice Not Found");
      }, error => {
        this.errorMessage = this.gs.getError(error);
        alert(this.errorMessage);
      });
  }

  ArApList(_record: Tbl_Cargo_Payrequest, payarapmodal: any) {
    
    this.InvoiceList = <Tbl_cargo_invoicem[]>[];
    let MBLID: string = (_record.cp_master_id != null) ? _record.cp_master_id.toString() : "";
    if (MBLID.trim() == "") {
      alert("Invalid Record Selected");
      return;
    }

    this.errorMessage = '';
    var searchData = this.gs.UserInfo;
    searchData.MBLID = MBLID;
    searchData.company_code = this.gs.company_code;
    searchData.branch_code = this.gs.branch_code;

    this.mainservice.PayReqArApList(searchData)
      .subscribe(response => {
        this.InvoiceList = response.list;
        if (this.InvoiceList != null) {
          if (this.InvoiceList.length <= 0)
            alert("Invoice Not Found");
          else
            this.modal = this.modalservice.open(payarapmodal, { centered: true });
        } else
          alert("Invoice Not Found");
      }, error => {
        this.errorMessage = this.gs.getError(error);
        alert(this.errorMessage);
      });
  }

  CloseModal() {
    this.modal.close();
  }
  callbackevent() {

  }
}
