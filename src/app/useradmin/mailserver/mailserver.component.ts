import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_User_Server } from '../models/Tbl_User_Server';
import { SearchQuery } from '../models/Tbl_User_Server';
import { PageQuery } from '../../shared/models/pageQuery';
import { MailServerService } from '../services/mailserver.service';

@Component({
  selector: 'app-mailserver',
  templateUrl: './mailserver.component.html'
})
export class MailServerComponent implements OnInit {

  /*
   Joy
 */

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_User_Server[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: MailServerService
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
      type: '',
      origin: 'mailserver-page',
      mode: 'ADD'
    };
    this.gs.Naviagete('Silver.UserAdmin/MailServerEditPage', JSON.stringify(parameter));

  }
  edit(_record: Tbl_User_Server) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      appid:this.gs.appid,
      menuid: this.mainservice.menuid,
      pkid: _record.mail_pkid ,
      type: '',
      origin: 'mailserver-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete('Silver.UserAdmin/MailServerEditPage', JSON.stringify(parameter));
  }

  Close() {
    this.location.back();
  }


}
