import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_User_Access } from '../models/Tbl_User_Rights';
import { SearchQuery } from '../models/Tbl_User_Rights';
import { PageQuery } from '../../shared/models/pageQuery';
import { UserRightsService } from '../services/userRights.service';

@Component({
  selector: 'app-rights',
  templateUrl: './rights.component.html'
})
export class RightsComponent implements OnInit {

  /*
   Joy
 */

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_User_Access []>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: UserRightsService
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
      type: '',
      origin: 'rights-page',
      mode: 'ADD'
    };
    this.gs.Naviagete2('Silver.UserAdmin/RightsEditPage', parameter);

  }
  edit(_record: Tbl_User_Access) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: _record.ua_pkid ,
      type: '',
      origin: 'rights-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete2('Silver.UserAdmin/RightsEditPage', parameter);
  }

  Close() {
    this.location.back();
  }


}
