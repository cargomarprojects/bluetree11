import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_Search } from '../models/tbl_search';
import { SearchQuery } from '../models/tbl_search';
import { PageQuery } from '../../shared/models/pageQuery';

import { SearchPageService } from '../services/searchpage.service';

@Component({
  selector: 'app-searchpage',
  templateUrl: './searchpage.component.html'
})
export class SearchPageComponent implements OnInit {

    /*
   01-07-2019 Created By Ajith  

 */

  errorMessage$ : Observable<string> ;
  records$ :  Observable<Tbl_Search[]>;
  pageQuery$ : Observable<PageQuery>;
  searchQuery$ : Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: SearchPageService
  ) { }

  ngOnInit() {
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
  

  Close() {
    this.location.back();
  }

 
}
