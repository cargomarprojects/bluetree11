import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_User_Userm } from '../models/Tbl_User_Userm';
import { SearchQuery } from '../models/Tbl_User_Userm';
import { PageQuery } from '../../shared/models/pageQuery';
import { UserService } from '../services/userm.service';

@Component({
  selector: 'app-userm',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {

  /*
   Joy
 */

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_User_Userm []>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: UserService
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
      origin: 'user-page',
      mode: 'ADD'
    };
    this.gs.Naviagete('Silver.UserAdmin/UserEditPage', JSON.stringify(parameter));

  }
  edit(_record: Tbl_User_Userm) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: _record.usr_pkid ,
      type: '',
      origin: 'user-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete('Silver.UserAdmin/UserEditPage', JSON.stringify(parameter));
  }

  Close() {
    this.location.back();
  }


}
