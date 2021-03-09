import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_User_Menum } from '../models/Tbl_User_Menum';
import { SearchQuery } from '../models/Tbl_User_Menum';
import { PageQuery } from '../../shared/models/pageQuery';
import { MenuService } from '../services/menum.service';

@Component({
  selector: 'app-menum',
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {

  /*
   Joy
 */

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_User_Menum []>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: MenuService
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
      origin: 'module-page',
      mode: 'ADD'
    };
    this.gs.Naviagete('Silver.UserAdmin/MenuEditPage', JSON.stringify(parameter));

  }
  edit(_record: Tbl_User_Menum) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: _record.menu_pkid ,
      type: '',
      origin: 'menu-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete('Silver.UserAdmin/MenuEditPage', JSON.stringify(parameter));
  }

  Close() {
    this.location.back();
  }


}
