import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { SearchQuery, AccPaymentModel, Tbl_Acc_Payment } from '../models/Tbl_Acc_Payment';
import { PageQuery } from '../../shared/models/pageQuery';
import { PaySearchService } from '../services/paysearch.service';

@Component({
  selector: 'app-paysearch',
  templateUrl: './paysearch.component.html'
})
export class PaySearchComponent implements OnInit {

  /*
   Joy
 */

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_Acc_Payment[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: PaySearchService
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
      origin: 'mblusage-page',
      mode: 'ADD'
    };
    this.gs.Naviagete('Silver.Other.Trans/MblUsageEditPage', JSON.stringify(parameter));

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
      origin: 'mblusage-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete('Silver.Other.Trans/MblUsageEditPage', JSON.stringify(parameter));
  }

  Close() {
    this.location.back();
  }

  editinvoice(_record: Tbl_Acc_Payment) {

    let sID: string = (_record.pay_mblid != null) ? _record.pay_mblid.toString() : "";
    let REFNO: string = _record.pay_invtype != null ? _record.pay_invtype.toString() : "";
    let sMode: string = "";
    let INVID: string = (_record.pay_invid != null) ? _record.pay_invid.toString() : "";
    let HBLID: string = (_record.pay_hblid != null) ? _record.pay_hblid.toString() : "";

    if (REFNO == "OI")
      sMode = "SEA IMPORT";
    else if (REFNO == "OE")
      sMode = "SEA EXPORT";
    else if (REFNO == "AI")
      sMode = "AIR IMPORT";
    else if (REFNO == "AE")
      sMode = "AIR EXPORT";
    else if (REFNO == "OT")
      sMode = "OTHERS";

    if (INVID == "" || sID == "") {
      alert("Invalid Record Selected");
      return;
    }

    this.gs.LinkPage("INVNO", sMode, REFNO, sID, HBLID, INVID);

  }

  editmaster(_record: Tbl_Acc_Payment) {
    let sID: string = (_record.pay_mblid != null) ? _record.pay_mblid.toString() : "";
    let REFNO: string = _record.pay_invtype != null ? _record.pay_invtype.toString() : "";
    let sMode: string = "";
    if (REFNO == "OI")
      sMode = "SEA IMPORT";
    else if (REFNO == "OE")
      sMode = "SEA EXPORT";
    else if (REFNO == "AI")
      sMode = "AIR IMPORT";
    else if (REFNO == "AE")
      sMode = "AIR EXPORT";
    else if (REFNO == "OT")
      sMode = "OTHERS";

    if (sID == "") {
      alert("Invalid Record Selected");
      return;
    }
    this.gs.LinkPage("REFNO", sMode, REFNO, sID);
  }

}
