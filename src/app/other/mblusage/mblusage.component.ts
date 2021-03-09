import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { SearchQuery, Tbl_cargo_mblusageModel, Tbl_cargo_mblusage } from '../models/Tbl_cargo_mblusage';
import { PageQuery } from '../../shared/models/pageQuery';
import { MblUsageService  } from '../services/mblusage.service';

@Component({
  selector: 'app-mblusage',
  templateUrl: './mblusage.component.html'
})
export class MblUsageComponent implements OnInit {

  /*
   Joy
 */

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_cargo_mblusage []>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: MblUsageService
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
      origin: 'mblusage-page',
      mode: 'ADD'
    };
    this.gs.Naviagete('Silver.Other.Trans/MblUsageEditPage', JSON.stringify(parameter));

  }
  edit(_record: Tbl_cargo_mblusage) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: _record.mu_pkid ,
      type: '',
      origin: 'mblusage-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete('Silver.Other.Trans/MblUsageEditPage', JSON.stringify(parameter));
  }

  Close() {    
    this.location.back();
  }


}
