import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_User_Companym } from '../models/Tbl_User_Companym';
import { SearchQuery } from '../models/Tbl_User_Companym';
import { PageQuery } from '../../shared/models/pageQuery';
import { CompanyService } from '../services/companym.service';

@Component({
  selector: 'app-branchm',
  templateUrl: './branch.component.html'
})
export class BranchComponent implements OnInit {

  /*
   Joy
 */

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_User_Companym []>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: CompanyService
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
    this.mainservice.Search(actions, 'SEARCH', 'B');
  }

  pageEvents(actions: any) {
    this.mainservice.Search(actions, 'PAGE', 'B');
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
      origin: 'branch-page',
      mode: 'ADD'
    };
    this.gs.Naviagete('Silver.UserAdmin/BranchEditPage', JSON.stringify(parameter));

  }
  edit(_record: Tbl_User_Companym) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: _record.comp_pkid ,
      type: '',
      origin: 'branch-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete('Silver.UserAdmin/BranchEditPage', JSON.stringify(parameter));
  }

  Close() {
    this.location.back();
  }


}
