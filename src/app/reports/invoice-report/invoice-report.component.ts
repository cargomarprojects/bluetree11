import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { SearchQuery, InvoiceReportModel, TBL_INV_LIST } from '../models/tbl_inv_list';
import { PageQuery } from '../../shared/models/pageQuery';
import { InvoiceReportService } from '../services/invoicereport.service';

@Component({
  selector: 'app-invoice-report',
  templateUrl: './invoice-report.component.html'
})
export class InvoiceReportComponent implements OnInit {

   
  tab: string = 'main';
  report_title: string = '';
  report_url: string = '';
  report_searchdata: any = {};
  report_menuid: string = '';

  errorMessage$: Observable<string>;
  records$: Observable<TBL_INV_LIST[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: InvoiceReportService
  ) { }

  ngOnInit() {
    this.gs.checkAppVersion();
    
    this.mainservice.init(this.route.snapshot.queryParams);
    this.initPage();
  }

  initPage() {

    this.records$ = this.mainservice.data$.pipe(map(res => res.records));
    this.searchQuery$ = this.mainservice.data$.pipe(map(res => res.searchQuery));
    this.pageQuery$ = this.mainservice.data$.pipe(map(res => res.pageQuery));
    this.errorMessage$ = this.mainservice.data$.pipe(map(res => res.errormessage));

  }

  searchEvents(actions: any) {
    if (actions.outputformat === "PRINT")
      this.PrintInvoice(actions);
    else
      this.mainservice.Search(actions, 'SEARCH');
  }

  pageEvents(actions: any) {
    this.mainservice.Search(actions, 'PAGE');
  }

  callbackevent(event: any) {
    this.tab = 'main';
  }

  PrintInvoice(_searchdata: any) {

    let comp_codes = "";
    if (!this.mainservice.canPrint) {
      alert('Insufficient User Rights')
      return;
    }

    this.report_title = 'Invoice List';
    this.report_url = '/api/Report/InvoiceReport/GetInvoiceRpt';
    this.report_searchdata = this.gs.UserInfo;
    this.report_searchdata.pkid = this.gs.getGuid();
    this.report_searchdata.SDATE = _searchdata.searchQuery.fromdate;
    this.report_searchdata.EDATE = _searchdata.searchQuery.todate;
    this.report_searchdata.ARAP = _searchdata.searchQuery.type;
    if (_searchdata.searchQuery.comp_code == 'ALL') {
      comp_codes = "";
      this.gs.CompanyList.forEach(Rec => {
        if (Rec.comp_code != "ALL") {
          if (comp_codes != "")
          comp_codes += ",";
          comp_codes += "'" + Rec.comp_code.toString() + "'";
        }
      })
      this.report_searchdata.COMP_TYPE = "ALL";
      this.report_searchdata.COMP_CODE = comp_codes;
      this.report_searchdata.COMP_NAME = "ALL";
    }
    else {
      this.report_searchdata.COMP_TYPE = "SINGLE";
      this.report_searchdata.COMP_CODE = _searchdata.searchQuery.comp_code;
      this.report_searchdata.COMP_NAME = this.GetCompName(_searchdata.searchQuery.comp_code);
    }
    this.report_searchdata.CUST_ID = _searchdata.searchQuery.cust_id;
    this.report_searchdata.HIDE_PAYROLL = this.gs.user_hide_payroll;
    this.report_menuid = this.mainservice.menuid;
    this.tab = 'report';
  }

  Close() {
    this.location.back();
  }

  GetCompName(_code: string) {
    let _sName = '';
    if (this.gs.CompanyList != null) {
      var REC = this.gs.CompanyList.find(rec => rec.comp_code == _code);
      if (REC != null) {
        _sName = REC.comp_name;
      }
    }
    return _sName;
  }

}
