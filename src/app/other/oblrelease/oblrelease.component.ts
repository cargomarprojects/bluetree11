import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_obl_released  } from '../models/tbl_cargo_obl_released';
import { SearchQuery } from '../models/tbl_cargo_obl_released';
import { PageQuery } from '../../shared/models/pageQuery';
import { OblReleaseService } from '../services/oblrelease.service';

@Component({
  selector: 'app-oblrelease',
  templateUrl: './oblrelease.component.html'
})
export class OblReleaseComponent implements OnInit {

  /*
   Joy
 */

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_cargo_obl_released[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: OblReleaseService
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
      origin: 'oblrelease-page',
      mode: 'ADD'
    };
    this.gs.Naviagete('Silver.Other.Trans/OBLReleasedEditPage', JSON.stringify(parameter));

  }
  edit(_record: Tbl_cargo_obl_released) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: _record.obl_pkid,
      type: '',
      origin: 'oblrelease-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete('Silver.Other.Trans/OBLReleasedEditPage', JSON.stringify(parameter));
  }

  Close() {    
    this.location.back();
  }


}
