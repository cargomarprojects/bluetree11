
import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_general } from '../models/tbl_cargo_general';
import { SearchQuery } from '../models/tbl_cargo_general';
import { PageQuery } from '../../shared/models/pageQuery';

import { OthGeneralService } from '../services/oth-general.service';
//EDIT-AJITH-09-11-2021

@Component({
  selector: 'app-oth-general',
  templateUrl: './oth-general.component.html'
})
export class OthGeneralComponent implements OnInit {

  // 24-05-2019 Created By Joy  
 
  errorMessage$ : Observable<string> ;
  records$ :  Observable<Tbl_cargo_general[]>;
  pageQuery$ : Observable<PageQuery>;
  searchQuery$ : Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: OthGeneralService
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
      origin: 'oth-general-page',
      mode: 'ADD'
    };
    this.gs.Naviagete2('Silver.Other.Trans/OthGeneralEditPage',  parameter);

  }
  edit(_record: Tbl_cargo_general) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      appid: this.gs.appid,
      menuid: this.mainservice.menuid,
      pkid: _record.mbl_pkid,
      type: this.mainservice.param_type,
      origin: 'oth-general-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete2('Silver.Other.Trans/OthGeneralEditPage', parameter);
  }

  Close() {
    this.location.back();
  }

 
}
