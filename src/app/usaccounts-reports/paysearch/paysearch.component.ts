import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
   attach_title: string = '';
   attach_parentid: string = '';
   attach_subid: string = '';
   attach_type: string = '';
   attach_typelist: any = {};
   attach_tablename: string = '';
   attach_tablepkcolumn: string = '';
   attach_refno: string = '';
   attach_customername: string = '';
   attach_updatecolumn: string = '';
   attach_viewonlysource: string = '';
   attach_viewonlyid: string = '';
   attach_uploadefiles: boolean = true;
   attach_filespath: string = '';
   attach_filespath2: string = '';
   modal: any;

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_Acc_Payment[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private modalconfig: NgbModalConfig,
    private modalservice: NgbModal,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: PaySearchService
  ) { 
    modalconfig.backdrop = 'static'; //true/false/static
    modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
  }

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
      menuid: this.mainservice.menuid,
      pkid: '',
      type: this.mainservice.param_type,
      origin: 'mblusage-page',
      mode: 'ADD'
    };
    this.gs.Naviagete2('Silver.Other.Trans/MblUsageEditPage', parameter);

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
      origin: 'mblusage-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete2('Silver.Other.Trans/MblUsageEditPage', parameter);
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

  getRouteDet(_format: string, _rec: Tbl_Acc_Payment, _type: string) {
    let sID: string = (_rec.pay_mblid != null) ? _rec.pay_mblid.toString() : "";
    let REFNO: string = _rec.pay_invtype != null ? _rec.pay_invtype.toString() : "";
    let INVID: string = (_rec.pay_invid != null) ? _rec.pay_invid.toString() : "";
    let HBLID: string = (_rec.pay_hblid != null) ? _rec.pay_hblid.toString() : "";
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
    else
      sMode = REFNO;

    if (_type == 'MASTER')
      return this.gs.Link2Page('REFNO', sMode, REFNO, sID, '', '', _format);
    else
      return this.gs.Link2Page('INVNO', sMode, REFNO, sID, HBLID, INVID, _format);
  }

  BtnNavigation(action: string,_rec: Tbl_Acc_Payment, _modal: any = null) {
    switch (action) {
      case 'ATTACHMENT': {
        let TypeList: any[] = [];
        if (this.gs.HIDE_DOCTYPE_INVOICE == "N")
          TypeList = [{ "code": "AR/AP", "name": "AR/AP" }, { "code": "EMAIL", "name": "EMAIL" }, { "code": "HOUSEBL", "name": "HOUSE B/L" }, { "code": "MASTER", "name": "MASTER" }, { "code": "PAYMENT SETTLEMENT", "name": "OTHERS" }];
        this.attach_title = 'Documents';
        this.attach_parentid = _rec.pay_mblid; //inv_mbl_id
        this.attach_subid = _rec.pay_invid; //this.pkid
        if (this.gs.HIDE_DOCTYPE_INVOICE == "N")
          this.attach_type = 'PAYMENT SETTLEMENT';
        else
          this.attach_type = 'AR/AP';
        this.attach_typelist = TypeList;
        this.attach_tablename = 'cargo_masterm';
        this.attach_tablepkcolumn = 'mbl_pkid';
        this.attach_refno = _rec.pay_invrefno; //inv_refno;
        this.attach_customername =_rec.pay_cust_name; //inv_cust_name;
        this.attach_updatecolumn = 'rec_files_attached';
        this.attach_viewonlysource = '';
        this.attach_uploadefiles = true;
        this.attach_viewonlyid = '';
        this.attach_filespath = '';
        this.attach_filespath2 = '';
        this.modal = this.modalservice.open(_modal, { centered: true });
        break;
      }
      case 'CHECKCOPY': {
        let TypeList: any[] = [];
        if (this.gs.HIDE_DOCTYPE_INVOICE == "N")
          TypeList = [{ "code": "CHECK COPY", "name": "CHECK COPY" }];
        this.attach_title = 'Documents';
        this.attach_parentid = _rec.pay_invid; //this.pkid
        this.attach_subid = '';
        this.attach_type = 'CHECK COPY';
        this.attach_typelist = TypeList;
        this.attach_tablename = 'cargo_invoicem';
        this.attach_tablepkcolumn = 'inv_pkid';
        this.attach_refno =  _rec.pay_invrefno; //inv_refno;
        this.attach_customername = _rec.pay_cust_name; //inv_cust_name;
        this.attach_updatecolumn = 'rec_files_attached';
        this.attach_viewonlysource = '';
        this.attach_viewonlyid = '';
        this.attach_uploadefiles = true;
        this.attach_filespath = '';
        this.attach_filespath2 = '';
        this.modal = this.modalservice.open(_modal, { centered: true });
        break;
      }
      // case 'CHECKCOPYAP': {
      //   let TypeList: any[] = [];
      //   this.attach_title = 'Documents';
      //   this.attach_parentid = '';
      //   this.attach_subid = '';
      //   this.attach_type = 'PAYMENT';
      //   this.attach_typelist = TypeList;
      //   this.attach_tablename = 'acc_paymenth';
      //   this.attach_tablepkcolumn = 'pay_pkid';
      //   this.attach_refno = '';
      //   this.attach_customername = '';
      //   this.attach_updatecolumn = 'rec_files_attached_chk';
      //   this.attach_viewonlysource = 'INVOICE';
      //   this.attach_viewonlyid = this.pkid;
      //   this.attach_uploadefiles = false;
      //   this.attach_filespath = '';
      //   this.attach_filespath2 = '';
      //   this.modal = this.modalservice.open(_modal, { centered: true });
      //   break;
      // }
    }
  }

  callbackevent(event: any) {

  }

  CloseModal() {
    this.modal.close();
  }

}
