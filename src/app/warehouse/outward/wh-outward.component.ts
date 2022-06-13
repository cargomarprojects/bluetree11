
import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_wh_inwardm } from '../models/Tbl_wh_inwardm';
import { SearchQuery } from '../models/Tbl_wh_inwardm';
import { PageQuery } from '../../shared/models/pageQuery';

import { WhOutwardService } from '../services/whoutward.service';

@Component({
  selector: 'app-wh-outward',
  templateUrl: './wh-outward.component.html'
})
export class WhOutwardComponent implements OnInit {

  errorMessage$ : Observable<string> ;
  records$ :  Observable<Tbl_wh_inwardm[]>;
  pageQuery$ : Observable<PageQuery>;
  searchQuery$ : Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: WhOutwardService
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
    this.mainservice.Search(actions,  'SEARCH');
  }

  pageEvents(actions: any) {
    this.mainservice.Search(actions,'PAGE');
  }

  NewRecord() {
    if (!this.mainservice.canAdd) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      appid: this.gs.appid,
      menuid: this.mainservice.menuid,
      pkid: '',
      type: this.mainservice.param_type,
      origin: 'wh-outward-page',
      mode: 'ADD'
    };
    // this.gs.Naviagete2('Silver.SeaImport/SeaImpMasterEditPage', parameter);
  }
  
  edit(_record: Tbl_wh_inwardm) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      appid: this.gs.appid,
      menuid: this.mainservice.menuid,
      pkid: _record.inm_pkid,
      type: this.mainservice.param_type,
      origin: 'wh-outward-page',
      mode: 'EDIT'
    };
    // this.gs.Naviagete2('Silver.SeaImport/SeaImpMasterEditPage',  parameter);
  }

  Close() {
    this.location.back();
  }

 
}
