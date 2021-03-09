import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { tap, share } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';

import { TBL_MAST_PARAM } from '../models/Tbl_Mast_Param';
import { SearchQuery } from '../store/param/param-page.models';
import { PageQuery } from '../../shared/models/pageQuery';

import * as fromparamactions from '../store/param/param-page.actions';
import * as fromparamreducer from '../store/param/param-page.reducer';


@Component({
  selector: 'app-param-page',
  templateUrl: './param-page.component.html'

})
export class ParamPageComponent implements OnInit, OnDestroy {

  // 24-05-2019 Created By Joy  

  id: string;
  menuid: string;
  menu_param: string;
  sub: any;

  title: string;
  isAdmin: boolean;

  tab: string = 'main';
  report_title: string;
  report_url: string;
  report_searchdata: any = {};
  report_menuid: string;

  loading: boolean;


  private SearchData: any;

  data$: Observable<TBL_MAST_PARAM[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;
  errorMessage$: Observable<string>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private store: Store<fromparamreducer.ParamState>,
    public gs: GlobalService,
  ) { }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      this.id = params.id;
      this.menuid = params.id;
      this.menu_param = params.menu_param;
      this.initPage();
    });
  }

  private initPage() {

    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);

    this.SearchData = this.gs.UserInfo;

    this.data$ = this.store.select(fromparamreducer.SelectRecords);
    this.pageQuery$ = this.store.pipe(select(fromparamreducer.SelectPageData));
    this.searchQuery$ = this.store.pipe(select(fromparamreducer.SelectSearchData));
    this.errorMessage$ = this.store.pipe(select(fromparamreducer.getErrorMessage));

  }

  searchEvents(actions: any) {
    if (actions.outputformat == 'EXCEL') {
      let _code: string = "";
      _code = actions.searchQuery.searchString;
      this.Print(_code);
    }
    else
      this.store.dispatch(new fromparamactions.LoadParamRequest({ type: "SEARCH", Query: actions.searchQuery }))
  }

  pageEvents(actions: any) {
    this.store.dispatch(new fromparamactions.LoadParamRequest({ type: "PAGE", Query: actions.pageQuery }))
  }


  NewRecord() {
    if (!this.gs.canAdd(this.menuid)) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.menuid,
      pkid: '',
      type: this.menu_param,
      origin: 'param-page',
      mode: 'ADD'
    };
    this.gs.Naviagete('Silver.Master/ParamEdit', JSON.stringify(parameter));
  }


  edit(_record: TBL_MAST_PARAM) {

    if (!this.gs.canEdit(this.menuid)) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.menuid,
      pkid: _record.param_pkid,
      type: _record.param_type,
      origin: 'param-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete('Silver.Master/ParamEdit', JSON.stringify(parameter));
  }


  Close() {
    this.location.back();
  }

  ngOnDestroy() {
    this.sub.unsubscribe;
  }

  Print(_code: string) {
    if (!this.gs.canPrint(this.menuid)) {
      alert('Insufficient User Rights')
      return;
    }

    this.report_title = this.title;
    this.report_url = '/api/Master/Param/ParamPagePrint';
    this.report_menuid = this.menuid;
    this.report_searchdata.pkid = '';
    this.report_searchdata = this.gs.UserInfo;
    this.report_searchdata.CODE = _code;
    this.report_searchdata.TYPE = this.menu_param;
    this.report_searchdata.STABLE = 'mast_param';

    this.tab = 'report';
  }

  callbackevent() {
    this.tab = 'main';
  }

  getRouteDet(_type: string, _mode: string, _record: TBL_MAST_PARAM = null) {

    if (_type == "L") {
      if ((_mode == "ADD" && this.gs.canAdd(this.menuid)) || (_mode == "EDIT" && this.gs.canEdit(this.menuid)))
        return "/Silver.Master/ParamEdit";
      else
        return null;
    } else if (_type == "P") {

      if (_record == null) {
        if (!this.gs.canAdd(this.menuid))
          return null;
        return {
          appid: this.gs.appid,
          menuid: this.menuid,
          pkid: '',
          type: this.menu_param,
          origin: 'param-page',
          mode: 'ADD'
        };
      }
      if (!this.gs.canEdit(this.menuid))
        return null;
      return {
        appid: this.gs.appid,
        menuid: this.menuid,
        pkid: _record.param_pkid,
        type: _record.param_type,
        origin: 'param-page',
        mode: 'EDIT'
      };
    } else
      return null;
  }
}
