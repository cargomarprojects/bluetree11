import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_acc_groupm } from '../models/tbl_acc_groupm';
import { SearchQuery } from '../models/tbl_acc_groupm';
import { PageQuery } from '../../shared/models/pageQuery';
import { AcGroupService } from '../services/acgroup.service';

@Component({
  selector: 'app-acgroup',
  templateUrl: './acgroup.component.html'
})
export class AcgroupComponent implements OnInit {

  /*
   Joy
 */

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_acc_groupm[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: AcGroupService
  ) { }

  ngOnInit() {
    this.mainservice.init(this.route.snapshot.queryParams);
    this.initPage();
  }

  initPage() {
    this.gs.checkAppVersion();
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
      appid: this.gs.appid,
      menuid: this.mainservice.menuid,
      pkid: '',
      type: this.mainservice.param_type,
      origin: 'acgroup-page',
      mode: 'ADD'
    };
    this.gs.Naviagete('Silver.USAccounts.Master/AccGroupEditPage', JSON.stringify(parameter));

  }
  edit(_record: Tbl_acc_groupm) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      appid: this.gs.appid,
      menuid: this.mainservice.menuid,
      pkid: _record.acc_group_pkid,
      type: '',
      origin: 'acgroup-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete('Silver.USAccounts.Master/AccGroupEditPage', JSON.stringify(parameter));
  }

  getRouteDet(_type: string, _mode: string, _record: Tbl_acc_groupm = null) {

    if (_type == "L") {
      if ((_mode == "ADD" && this.mainservice.canAdd) || (_mode == "EDIT" && this.mainservice.canEdit))
        return "/Silver.USAccounts.Master/AccGroupEditPage";
      else
        return null;
    } else if (_type == "P") {

      if (_record == null) {
        if (!this.mainservice.canAdd)
          return null;
        return {
          appid: this.gs.appid,
          menuid: this.mainservice.menuid,
          pkid: '',
          type: this.mainservice.param_type,
          origin: 'acgroup-page',
          mode: 'ADD'
        };
      }
      if (!this.mainservice.canEdit)
        return null;
      return {
        appid: this.gs.appid,
        menuid: this.mainservice.menuid,
        pkid: _record.acc_group_pkid,
        type: '',
        origin: 'acgroup-page',
        mode: 'EDIT'
      };
    } else
      return null;
  }
  Close() {
    this.location.back();
  }


}
