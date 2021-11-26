import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_Addr_Catgory, Tbl_Cargo_BulkMail } from '../models/Tbl_Addr_Catgory';

import { BulkmailService } from '../services/bulkmail.service';
import { SearchQuery } from '../models/Tbl_Addr_Catgory';
import { PageQuery } from '../../shared/models/pageQuery';

@Component({
  selector: 'app-bulkmail',
  templateUrl: './bulkmail.component.html'
})
export class BulkmailComponent implements OnInit {

  // 26-11-2021 Created By Ajith  
  errorMessage$: Observable<string>;
  records$: Observable<Tbl_Addr_Catgory[]>;
  records2$: Observable<Tbl_Cargo_BulkMail[]>;
  pageQuery$ : Observable<PageQuery>;
  searchQuery$ : Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: BulkmailService
  ) { }

  ngOnInit() {
    this.gs.checkAppVersion();
    this.mainservice.init(this.route.snapshot.queryParams);
    this.initPage();
  }

  initPage() {
    
    this.records$ = this.mainservice.data$.pipe(map(res => res.records));
    this.records2$ = this.mainservice.data$.pipe(map(res => res.records2));
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
  
  onBlur(_feild:string)
  {

  }

  Close() {
    this.location.back();
  }
  

}
