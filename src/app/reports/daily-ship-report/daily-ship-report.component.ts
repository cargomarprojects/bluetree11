import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Daily_Ship_Report_Model, Tbl_Daily_Ship_Report } from '../models/tbl_daily_ship_report';
import { SearchQuery } from '../models/tbl_daily_ship_report';
import { PageQuery } from '../../shared/models/pageQuery';
import {  DailyShipReportService } from '../services/daily_ship_report.service';
 
@Component({
  selector: 'app-daily-ship-report',
  templateUrl: './daily-ship-report.component.html'
})
export class DailyShipReportComponent implements OnInit {
 
  errorMessage$: Observable<string>;
  records$: Observable<Tbl_Daily_Ship_Report []>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: DailyShipReportService
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
    // this.mainservice.tab = 'main';
  }
}
