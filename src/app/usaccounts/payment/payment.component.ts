import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { SearchQuery, Tbl_Acc_Payment, AccPaymentModel } from '../models/Tbl_Acc_Payment';
import { PageQuery } from '../../shared/models/pageQuery';
import { PaymentService } from '../services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html'
})
export class PaymentComponent implements OnInit {

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

  upload_pay_pkid = '';
  upload_pay_docno = '';




  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: PaymentService
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
      origin: 'payment-page',
      mode: 'ADD'
    };
    this.gs.Naviagete('Silver.USAccounts.Trans/PaymentEditPage', JSON.stringify(parameter));

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
      origin: 'payment-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete('Silver.USaccounts.Trans/PaymentEditPage', JSON.stringify(parameter));
  }

  Close() {
    this.location.back();
  }

  Print(rec: Tbl_Acc_Payment, _type: string) {
    if (_type === 'chq') {
      if (rec.pay_rp == "RECEIPT" || rec.pay_rp == "ADJUSTMENT") {
        alert("Check Cannot Be Printed For Receipts");
        return;
      }
      this.report_url = '/api/Payment/PrintCheque';
      this.report_searchdata = this.gs.UserInfo;
      this.report_searchdata.PKID = rec.pay_pkid;
      this.report_searchdata.BANKID = rec.pay_acc_id;
      this.report_searchdata.PRINT_SIGNATURE = "N";
      this.report_menuid = this.gs.MENU_ACC_ARAP_SETTLMENT;
      this.tab = 'chq';
    }
    if (_type === 'simple') {
      this.report_url = '/api/Payment/PrintSimple';
      this.report_searchdata = this.gs.UserInfo;
      this.report_searchdata.PKID = rec.pay_pkid;
      this.report_searchdata.TYPE = rec.pay_type;
      this.report_menuid = this.gs.MENU_ACC_ARAP_SETTLMENT;
      this.tab = 'simple';
    }
    if (_type === 'cash') {
      this.report_url = '/api/Payment/PrintCash';
      this.report_searchdata = this.gs.UserInfo;
      this.report_searchdata.PKID = rec.pay_pkid;
      this.report_searchdata.PAY_RP = rec.pay_rp;
      this.report_searchdata.TYPE = rec.pay_type;
      if (rec.pay_acc_name == "CASH")
        this.report_searchdata.REPORT_CAPTION = "CASH " + rec.pay_rp;
      else
        this.report_searchdata.REPORT_CAPTION = "BANK " + rec.pay_rp;
      

      this.report_menuid = this.gs.MENU_ACC_ARAP_SETTLMENT;
      this.tab = 'simple';
    }

  }




  upload(rec: Tbl_Acc_Payment) {
    this.upload_pay_pkid = rec.pay_pkid;
    this.upload_pay_docno = rec.pay_docno;
    this.tab = 'attachment';
  }


  callbackevent() {
    this.tab = 'main';
  }



}
