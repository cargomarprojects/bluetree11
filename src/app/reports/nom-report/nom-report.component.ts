import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { SearchQuery, NomReportModel, TBL_NOM_LIST } from '../models/tbl_nom_list';
import { PageQuery } from '../../shared/models/pageQuery';
import { NomReportService } from '../services/nomreport.service';

@Component({
  selector: 'app-nom-report',
  templateUrl: './nom-report.component.html'
})
export class NomReportComponent implements OnInit {

  /*
   Joy
 */
  tab: string = 'main';
  report_title: string = '';
  report_url: string = '';
  report_searchdata: any = {};
  report_menuid: string = '';

  errorMessage$: Observable<string>;
  records$: Observable<TBL_NOM_LIST[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: NomReportService
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
      this.PrintNom(actions);
    else
      this.mainservice.Search(actions, 'SEARCH');
  }

  pageEvents(actions: any) {
    this.mainservice.Search(actions, 'PAGE');
  }

  callbackevent(event: any) {
    this.tab = 'main';
  }

  PrintNom(_searchdata: any) {

    let compids = "";
    if (!this.mainservice.canPrint) {
      alert('Insufficient User Rights')
      return;
    }

    this.report_title = 'Nomination List';
    this.report_url = '/api/Report/NomReport/GetNomRpt';
    this.report_searchdata = this.gs.UserInfo;
    this.report_searchdata.pkid = this.gs.getGuid();
    this.report_searchdata.HANDLED_ID = _searchdata.searchQuery.handled_id;
    if (_searchdata.searchQuery.comp_code == 'ALL') {
      compids = "";
      this.gs.CompanyList.forEach(Rec => {
        if (Rec.comp_code != "ALL") {
          if (compids != "")
            compids += ",";
          compids += "'" + Rec.comp_pkid.toString() + "'";
        }
      })
      this.report_searchdata.COMP_TYPE = "ALL";
      this.report_searchdata.COMP_CODE = compids;
      this.report_searchdata.COMP_NAME = "ALL";
    }
    else {
      this.report_searchdata.COMP_TYPE = "SINGLE";
      this.report_searchdata.COMP_CODE = _searchdata.searchQuery.comp_code;
      this.report_searchdata.COMP_NAME = this.GetCompName(_searchdata.searchQuery.comp_code);
    }
    this.report_menuid = this.mainservice.menuid;
    this.tab = 'report';
  }

  Close() {
    this.location.back();
  }

  GetCompName(_code: string) {
    let _sName = '';
    if (this.gs.CompanyList != null) {
      var REC = this.gs.CompanyList.find(rec => rec.comp_pkid == _code);
      if (REC != null) {
        _sName = REC.comp_name;
      }
    }
    return _sName;
  }

}
