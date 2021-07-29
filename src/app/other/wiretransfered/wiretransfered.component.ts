
import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_Cargo_Wiretransferm } from '../models/tbl_cargo_wiretransferm';
import { SearchQuery } from '../models/tbl_cargo_wiretransferm';
import { PageQuery } from '../../shared/models/pageQuery';

import {  WireTransferedService } from '../services/wiretransfered.service';


@Component({
  selector: 'app-wiretransfered',
  templateUrl: './wiretransfered.component.html'
})
export class WireTransferedComponent implements OnInit {

  // 02-07-2019 Created By Ajith  
  
  errorMessage$ : Observable<string> ;
  records$ :  Observable<Tbl_Cargo_Wiretransferm[]>;
  pageQuery$ : Observable<PageQuery>;
  searchQuery$ : Observable<SearchQuery>;
  
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: WireTransferedService
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
      appid : this.gs.appid,
      menuid: this.mainservice.menuid,
      pkid: '',
      mode: 'ADD',
      origin: 'wiretransfer-page'
    };
    this.gs.Naviagete2('Silver.Other.Trans/WireTransferEditPage', parameter);

  }
  
  edit(_record: Tbl_Cargo_Wiretransferm) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
        appid : this.gs.appid,
        menuid: this.mainservice.menuid,
        pkid: _record.cwm_pkid,
        mode: 'EDIT',
        origin: 'wiretransfer-edit-page',
      };
      this.gs.Naviagete2('Silver.Other.Trans/WireTransferEditPage', parameter);
  }

  Close() {
    this.location.back();
  }

 
}
