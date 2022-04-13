import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_Cust_Report } from '../models/tbl_cust_report';
import { SearchQuery } from '../models/tbl_cust_report';
import { PageQuery } from '../../shared/models/pageQuery';
import { CustReportService } from '../services/cust_report.service';
//CREATE-AJITH-08-10-2021

@Component({
  selector: 'app-cust-report',
  templateUrl: './cust-report.component.html'
})
export class CustReportComponent implements OnInit {

  /*
   Joy
 */

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_Cust_Report[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: CustReportService
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

  getRouteDet(_format: string, _rec: Tbl_Cust_Report) {
    let gen_pkid: string = (_rec.cust_pkid != null) ? _rec.cust_pkid.toString() : "";
    let sMenuID = this.gs.MENU_MASTER_DATA;

    if (this.gs.isBlank(gen_pkid))
      return null;

    if (this.gs.canEdit(sMenuID) || this.gs.canView(sMenuID)) {
      if (_format == "P") {
        return {
          appid: this.gs.appid,
          menuid: sMenuID,
          pkid: gen_pkid,
          type: 'PARTYS',
          origin: 'cust-report-page',
          mode: 'EDIT'
        };
      } else if (_format == "L") {
        return "/Silver.Master/PartyEditPage";
      } else
        return null;
    }
    else
      return null;
  }

}
