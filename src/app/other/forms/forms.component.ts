import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { SearchQuery, Tbl_cargo_genfilesModel, Tbl_cargo_genfiles } from '../models/Tbl_cargo_genfiles';
import { PageQuery } from '../../shared/models/pageQuery';
import { FormsService } from '../services/forms.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html'
})
export class FormsComponent implements OnInit {

  /*
   Joy
 */

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_cargo_genfiles[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: FormsService
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
      origin: 'forms-page',
      mode: 'ADD'
    };
    // this.gs.Naviagete('Silver.Other.Trans/MblUsageEditPage', JSON.stringify(parameter));

  }
  
  edit(_record: Tbl_cargo_genfiles) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: _record.gf_pkid,
      type: '',
      origin: 'forms-page',
      mode: 'EDIT'
    };
    // this.gs.Naviagete('Silver.Other.Trans/MblUsageEditPage', JSON.stringify(parameter));
  }

  getRouteDet(_type: string, _mode: string, _record: Tbl_cargo_genfiles = null) {

    if (_type == "L") {
      if ((_mode == "ADD" && this.mainservice.canAdd) || (_mode == "EDIT" && this.mainservice.canEdit))
        return "/Silver.Other.Trans/FormsUploadEditPage"
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
          origin: 'forms-page',
          mode: 'ADD'
        };
      }
      if (!this.mainservice.canEdit)
        return null;
      return {
        appid: this.gs.appid,
        menuid: this.mainservice.menuid,
        pkid: _record.gf_pkid,
        type: '',
        origin: 'forms-page',
        mode: 'EDIT'
      };
    } else
      return null;
  }
  Close() {
    this.location.back();
  }


}
