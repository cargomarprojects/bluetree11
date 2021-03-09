import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_VoidCheck } from '../models/Tbl_VoidCheck';
import { SearchQuery } from '../models/Tbl_VoidCheck';
import { PageQuery } from '../../shared/models/pageQuery';
import { VoidCheckService } from '../services/voidcheck.service';

@Component({
  selector: 'app-voidcheck',
  templateUrl: './voidcheck.component.html'
})
export class VoidCheckComponent implements OnInit {

  /*
   Joy
 */

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_VoidCheck[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: VoidCheckService
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
      menuid: this.mainservice.menuid,
      pkid: '',
      type: this.mainservice.param_type,
      origin: 'voidcheck-page',
      mode: 'ADD'
    };
    this.gs.Naviagete('Silver.USAccounts.Trans/VoidCheckEditPage', JSON.stringify(parameter));

  }
  edit(_record: Tbl_VoidCheck) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: _record.void_pkid,
      type: '',
      origin: 'voidcheck-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete('Silver.USAccounts.Trans/VoidCheckEditPage', JSON.stringify(parameter));
  }

  Close() {    
    this.location.back();
  }


}
