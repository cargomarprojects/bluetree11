
import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_general } from '../models/tbl_cargo_general';
import { SearchQuery } from '../models/tbl_cargo_general';
import { PageQuery } from '../../shared/models/pageQuery';

import { LockUnlockService } from '../services/lockunlock.service';


@Component({
  selector: 'app-lockunlock',
  templateUrl: './lockunlock.component.html'
})
export class LockUnlockComponent implements OnInit {

  // 24-05-2019 Created By Joy  

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_cargo_general[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;


  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: LockUnlockService
  ) { }

  ngOnInit() {
    this.gs.checkAppVersion();
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
    if (actions.outputformat == 'SAVE') {
      this.mainservice.LockUnlockRecord();
    }
    else if (actions.outputformat == 'INSTANT-LOCK') {
      this.mainservice.Instant_Lock_Unlock(actions, 'LOCK')
    }
    else if (actions.outputformat == 'INSTANT-UNLOCK') {
      this.mainservice.Instant_Lock_Unlock(actions, 'UNLOCK')
    }
    else if (actions.outputformat == 'RESET-LOCK') {
      this.mainservice.Reset_Lock(actions)
    }
    else
      this.mainservice.Search(actions, 'SEARCH');
  }

  pageEvents(actions: any) {
    this.mainservice.Search(actions, 'PAGE');
  }

  Close() {
    this.location.back();
  }

  getRouteDet(_format: string, _rec: Tbl_cargo_general, _type: string) {
    let sID: string = (_rec.mbl_pkid != null) ? _rec.mbl_pkid.toString() : "";
    let REFNO: string = _rec.mbl_refno != null ? _rec.mbl_refno.toString() : "";
    let sMode: string = _rec.mbl_mode != null ? _rec.mbl_mode.toString() : "";
    let branch_name: string = _rec.mbl_branch != null ? _rec.mbl_branch.toString() : "";

    if (branch_name == this.gs.branch_name) {
      if (_type == 'MASTER')
        return this.gs.Link2Page('REFNO', sMode, REFNO, sID, '', '', _format, '', branch_name);
      else
        return null;
    } else
      return null;
  }

}
