import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_Cargo_Qtnm } from '../models/tbl_cargo_qtnm';
import { SearchQuery } from '../models/tbl_cargo_qtnm';
import { PageQuery } from '../../shared/models/pageQuery';

import { QtnLclService } from '../services/qtnlcl.service';

@Component({
  selector: 'app-qtnlcl',
  templateUrl: './qtnlcl.component.html'
})
export class QtnLclComponent implements OnInit {

  // 02-07-2019 Created By Ajith  

  tab: string = 'main';
  report_title: string = '';
  report_url: string = '';
  report_searchdata: any = {};
  report_menuid: string = '';

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_Cargo_Qtnm[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: QtnLclService
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
      this.PrintQtn(actions);
    else
      this.mainservice.Search(actions, 'SEARCH');
  }

  pageEvents(actions: any) {
    this.mainservice.Search(actions, 'PAGE');
  }

  NewRecord() {

    if (!this.mainservice.canAdd) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      appid:this.gs.appid,
      menuid: this.mainservice.menuid,
      pkid: '',
      origin: 'qtnm-lcl-page',
      mode: 'ADD'
    };
    this.gs.Naviagete2('Silver.Marketing.Quotation/QuotationLclEditPage',  parameter);
  }
  edit(_record: Tbl_Cargo_Qtnm) {

    // if (_record.qtnr_slno == null || _record.qtnr_slno.toString().trim() == "") {
    //   alert('Cannot View/Edit This Row')
    //   return;
    // }

    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      appid:this.gs.appid,
      menuid: this.mainservice.menuid,
      pkid: _record.qtnm_pkid,
      origin: 'qtnm-lcl-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete2('Silver.Marketing.Quotation/QuotationLclEditPage',  parameter);

  }

  CopyRecord(_record: Tbl_Cargo_Qtnm) {

    if (!this.mainservice.canAdd) {
      alert('Insufficient User Rights')
      return;
    }

    if (!confirm("Copy Record " + _record.qtnm_no)) {
      return;
    }
    let parameter = {
      appid:this.gs.appid,
      menuid: this.mainservice.menuid,
      pkid: _record.qtnm_pkid,
      origin: 'qtnm-lcl-page',
      mode: 'COPY'
    };
    this.gs.Naviagete2('Silver.Marketing.Quotation/QuotationLclEditPage',  parameter);
  }


  PrintQtn(_searchdata: any) {

    if (!this.mainservice.canPrint) {
      alert('Insufficient User Rights')
      return;
    }

    this.report_title = 'Quotation LCL';
    this.report_url = '/api/Marketing/QtnReport/GetQuotationRpt';
    this.report_searchdata = this.gs.UserInfo;
    this.report_searchdata.pkid = this.gs.getGuid();
    this.report_searchdata.CODE = _searchdata.searchQuery.searchString;
    this.report_searchdata.SDATE = _searchdata.searchQuery.fromdate;
    this.report_searchdata.EDATE = _searchdata.searchQuery.todate;
    this.report_searchdata.COLUMN_NAME = _searchdata.searchQuery.searchtype;
    this.report_searchdata.STYPE = 'LCL';
    this.report_menuid = this.gs.MENU_QUOTATION_LCL;
    this.tab = 'report';
  }

  
  callbackevent(event: any) {
    this.tab = 'main';
  }

  Close() {
    this.location.back();
  }
}
