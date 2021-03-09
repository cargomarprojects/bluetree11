import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_Acc_Opening } from '../models/Tbl_Acc_Opening';
import { SearchQuery } from '../models/Tbl_Acc_Opening';
import { PageQuery } from '../../shared/models/pageQuery';
import { AcOpeningService } from '../services/acopening.service';

@Component({
  selector: 'app-acopen',
  templateUrl: './acopen.component.html'
})
export class AcopenComponent implements OnInit {

  /*
   Joy
 */

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_Acc_Opening[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: AcOpeningService
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
      origin: 'acopen-page',
      mode: 'ADD'
    };
    this.gs.Naviagete('Silver.USAccounts.Master/OpenEditPage', JSON.stringify(parameter));

  }
  edit(_record: Tbl_Acc_Opening) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: _record.op_pkid,
      type: '',
      origin: 'acopen-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete('Silver.USAccounts.Master/OpenEditPage', JSON.stringify(parameter));
  }

  Close() {
    this.location.back();
  }


}
