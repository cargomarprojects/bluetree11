import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_Mast_Filesm } from '../models/Tbl_mast_filesm';
import { SearchQuery } from '../models/Tbl_mast_filesm';
import { PageQuery } from '../../shared/models/pageQuery';
import { AiDocsService } from '../services/aidocs.service';


@Component({
  selector: 'app-aidocs',
  templateUrl: './aidocs.component.html'
})
export class aidocsComponent implements OnInit {

  /*
   Joy
 */

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_Mast_Filesm []>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: AiDocsService
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
      appid:this.gs.appid,
      menuid: this.mainservice.menuid,
      pkid: '',
      type: this.mainservice.file_type,
      origin: 'aidocs-page',
      mode: 'ADD'
    };
    this.gs.Naviagete2('Silver.UserAdmin/ModulemEditPage',  parameter);

  }
  edit(_record: Tbl_Mast_Filesm) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      appid:this.gs.appid,
      menuid: this.mainservice.menuid,
      pkid: _record.file_pkid ,
      type: '',
      origin: 'aidocs-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete2('Silver.UserAdmin/ModulemEditPage',  parameter);
  }

  Close() {
    this.location.back();
  }


}
