import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { SearchQuery, Tbl_Acc_Payment, AccPaymentModel } from '../models/Tbl_Acc_Payment';
import { PageQuery } from '../../shared/models/pageQuery';
import { DepositService } from '../services/deposit.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html'
})
export class DepositComponent implements OnInit {

  /*
   Joy
 */

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_Acc_Payment[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;



  report_url: string;
  report_searchdata: any = {};
  report_menuid: string;
  tab: string = 'main';



  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: DepositService
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
      origin: 'deposit-page',
      mode: 'ADD'
    };
    this.gs.Naviagete('Silver.USAccounts.Trans/DepositEditPage', JSON.stringify(parameter));

  }
  edit(_record: Tbl_Acc_Payment) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: _record.pay_pkid,
      type: '',
      origin: 'deposit-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete('Silver.USaccounts.Trans/DepositEditPage', JSON.stringify(parameter));
  }

  Close() {
    this.location.back();
  }


  Print(rec: Tbl_Acc_Payment, _type: string) {

    if (_type === 'simple') {
      this.report_url = '/api/Deposit/PrintSimple';
      this.report_searchdata = this.gs.UserInfo;
      this.report_searchdata.pkid = rec.pay_pkid;
      this.report_menuid = this.gs.MENU_AR_DEPOSIT;
      this.tab = 'report1';
    }

    if (_type === 'detail') {
      this.report_url = '/api/Deposit/PrintDetail';
      this.report_searchdata = this.gs.UserInfo;
      this.report_searchdata.pkid = rec.pay_pkid;
      this.report_menuid = this.gs.MENU_AR_DEPOSIT;
      this.tab = 'report2';
    }


  }

  callbackevent() {
    this.tab = 'main';
  }



}
