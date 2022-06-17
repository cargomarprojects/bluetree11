import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Stock_Report_Model, Tbl_Stock_Report } from '../models/Tbl_stock_report';
import { SearchQuery } from '../models/Tbl_stock_report';
import { PageQuery } from '../../shared/models/pageQuery';
import {  StockReportService } from '../services/stock_report.service';

@Component({
  selector: 'app-stock-report',
  templateUrl: './stock-report.component.html'
})
export class StockReportComponent implements OnInit {
 
  errorMessage$: Observable<string>;
  records$: Observable<Tbl_Stock_Report []>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: StockReportService
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
    this.mainservice.Search(actions, 'SEARCH');
  }

  pageEvents(actions: any) {
    this.mainservice.Search(actions, 'PAGE');
  }

  
  Close() {
    this.location.back();
  }

  callbackevent() {
    this.mainservice.tab = 'main';
  }
}
