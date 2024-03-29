import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { ignoreElements, map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { SearchQuery, Tbl_Acc_Payment, AccPaymentModel } from '../models/Tbl_Acc_Payment';
import { PageQuery } from '../../shared/models/pageQuery';
import { PaymentService } from '../services/payment.service';

//EDIT-AJITH-09-09-2021
//EDIT-AJITH-19-10-2021

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
      appid: this.gs.appid,
      menuid: this.mainservice.menuid,
      pkid: '',
      type: this.mainservice.param_type,
      origin: 'payment-page',
      mode: 'ADD'
    };
    this.gs.Naviagete2('Silver.USAccounts.Trans/PaymentEditPage', parameter);

  }

  edit(_record: Tbl_Acc_Payment) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      appid: this.gs.appid,
      menuid: this.mainservice.menuid,
      pkid: _record.pay_pkid,
      type: '',
      origin: 'payment-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete2('Silver.USAccounts.Trans/PaymentEditPage', parameter);
  }

  getRouteDet(_type: string, _mode: string, _record: Tbl_Acc_Payment = null) {

    if (_type == "L") {
      if ((_mode == "ADD" && this.mainservice.canAdd) || (_mode == "EDIT" && this.mainservice.canEdit))
        return "/Silver.USAccounts.Trans/PaymentEditPage";
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
          origin: 'payment-page',
          mode: 'ADD'
        };
      }
      if (!this.mainservice.canEdit)
        return null;
      return {
        appid: this.gs.appid,
        menuid: this.mainservice.menuid,
        pkid: _record.pay_pkid,
        type: '',
        origin: 'payment-page',
        mode: 'EDIT'
      };
    } else
      return null;
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
      this.report_searchdata.CONT_GROUP = this.gs.FOR_REMITTANCE;
      this.report_searchdata.CUSTOMER_ID = rec.pay_cust_id;
      this.report_searchdata.CUSTOMER_NAME = rec.pay_cust_name;

      this.report_menuid = this.gs.MENU_ACC_ARAP_SETTLMENT;
      let sub: string = '';
      if (this.gs.company_code === 'MNYC' && rec.pay_mode === 'ONLINE/ACH PAYMENT')
        sub = 'MOTHERLINES ACH PAYMENT'
      else
        sub = rec.pay_mode;
      sub += ' - ' + rec.pay_cust_name + ' ' + this.gs.ConvertDate2DisplayFormat(rec.pay_date) + ' $' + this.gs.roundNumber(rec.pay_diff, 2);
      this.report_searchdata.MAIL_SUBJECT = sub;
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

  paydateupdatecallbackevent(event: any) {

  }

  payupdatecallbackevent(event: any) {

  }

  paybankupdatecallbackevent(event: any) {

  }

}
