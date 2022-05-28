import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_User_Active } from '../models/Tbl_User_Active';
import { SearchQuery } from '../models/Tbl_User_Active';
import { PageQuery } from '../../shared/models/pageQuery';
import { UserActiveService } from '../services/useractive.service';

@Component({
  selector: 'app-useractive',
  templateUrl: './useractive.component.html'
})
export class UserActiveComponent implements OnInit {

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_User_Active[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: UserActiveService
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

  edit(_rec: Tbl_User_Active) {
    let parameter = {
      appid: this.gs.appid,
      id: this.mainservice.menuid,
      userid: _rec.user_userid,
      datetype: this.mainservice.datetype,
      origin: 'user-active-page'
    };
    this.gs.Naviagete2('Silver.Reports.General/UserActiveDet', parameter);
  }

  getRouteDet(_format: string, _rec: Tbl_User_Active) {
    let user_userid: string = (_rec.user_userid != null) ? _rec.user_userid.toString() : "";
    let sMenuID = this.mainservice.menuid;

    if (this.gs.isBlank(user_userid))
      return null;

    if (this.gs.canEdit(sMenuID) || this.gs.canView(sMenuID)) {
      if (_format == "P") {
        return {
          appid: this.gs.appid,
          menuid: sMenuID,
          userid: user_userid,
          datetype: this.mainservice.datetype,
          origin: 'user-active-page'
        };
      } else if (_format == "L") {
        return "/Silver.Reports.General/UserActiveDet";
      } else
        return null;
    }
    else
      return null;
  }
  Close() {
    this.location.back();
  }


}
