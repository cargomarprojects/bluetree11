import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_invoicem } from '../models/Tbl_cargo_Invoicem';
import { invoiceService } from '../services/invoice.service';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html'
})
export class InvoiceComponent implements OnInit {

  errorMessage: string;
  mbl_pkid: string;
  mbl_refno: string;
  mbl_type: string;
  showdeleted: boolean;

  id: string;
  menuid: string;

  title: string;
  isAdmin: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canSave: boolean;

  income: number = 0;
  expense: number = 0;
  profit: number = 0;
  ar_bal: number = 0;
  ap_bal: number = 0;

  MBL_LOSS_APPROVED: boolean = false;
  MBL_PROFIT_REQ: boolean = false;
  MBL_LOSS_MEMO: string = '';


  records: Tbl_cargo_invoicem[]

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: invoiceService
  ) { }

  ngOnInit() {
    this.init(this.route.snapshot.queryParams.parameter);
    this.List('SCREEN');
  }


  public init(params: any) {

    const options = JSON.parse(params);


    this.menuid = options.menuid;
    this.mbl_type = options.mbl_type;
    this.mbl_pkid = options.mbl_pkid;
    this.id = this.mbl_pkid;
    this.mbl_refno = options.mbl_refno;
    this.showdeleted = false;


    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.canAdd = this.gs.canAdd(this.menuid);
    this.canEdit = this.gs.canEdit(this.menuid);
    this.canSave = this.canAdd || this.canEdit;

  }

  List(action: string = '') {

    var SearchData = this.gs.UserInfo;
    SearchData.outputformat = 'SCREEN';
    SearchData.action = 'NEW';
    SearchData.MBL_PKID = this.mbl_pkid;
    SearchData.INV_TYPE = this.mbl_type;
    SearchData.ISADMIN = (this.isAdmin) ? 'Y' : 'N';
    SearchData.SHOWDELETED = (this.showdeleted) ? 'Y' : 'N';
    SearchData.BR_REGION = this.gs.BRANCH_REGION;

    SearchData.page_count = 0;
    SearchData.page_rows = 0;
    SearchData.page_current = -1;
    SearchData.page_rowcount = 0;



    this.mainservice.List(SearchData).subscribe(response => {
      this.records = response.list;

      this.MBL_LOSS_APPROVED = response.MBL_LOSS_APPROVED;
      this.MBL_PROFIT_REQ = response.MBL_PROFIT_REQ;
      this.MBL_LOSS_MEMO = response.MBL_LOSS_MEMO;

      this.DisplayProfit();
    }, error => {
      this.errorMessage = this.gs.getError(error)
    });
  }

  UpdateStatus() {

    var SearchData = this.gs.UserInfo;
    SearchData.MBL_PKID = this.mbl_pkid;

    SearchData.MBL_LOSS_MEMO = this.MBL_LOSS_MEMO;
    SearchData.MBL_PROFIT_REQ = (this.MBL_PROFIT_REQ) ? 'Y' : 'N';
    SearchData.MBL_LOSS_APPROVED = (this.MBL_LOSS_APPROVED) ? 'Y' : 'N';

    this.errorMessage = '';
    this.mainservice.MasterLoss_Status_Save(SearchData).subscribe(response => {
       alert('Update Complete');
    }, error => {
      alert(this.gs.getError(error));
    });

  }


  DisplayProfit() {
    var nInc = 0;
    var nExp = 0;
    var nProfit = 0;

    var nAr_Bal = 0;
    var nAp_Bal = 0;

    if (this.records == null)
      return;

    this.records.forEach(Rec => {
      if (Rec.rec_deleted == "N") {
        if (Rec.inv_arap == "AR") {
          nInc += Rec.inv_ar_total;
          nAr_Bal += Rec.inv_balance;
        }
        else {
          nExp += Rec.inv_ap_total;
          nAp_Bal += Rec.inv_balance;
        }
      }
    })


    nProfit = this.gs.roundNumber(nInc - nExp, 2);
    this.income = this.gs.roundNumber(nInc, 2);
    this.expense = this.gs.roundNumber(nExp, 2);
    this.profit = this.gs.roundNumber(nProfit, 2);
    this.ar_bal = this.gs.roundNumber(nAr_Bal, 2);
    this.ap_bal = this.gs.roundNumber(nAp_Bal, 2);

  }


  NewRecord(arorap: string) {
    if (!this.canAdd) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.menuid,
      pkid: '',
      mode: 'ADD',
      mbl_pkid: this.mbl_pkid,
      mbl_type: this.mbl_type,
      mbl_refno: this.mbl_refno,
      inv_arap: arorap,
      arrival_notice: '',
      origin: 'invoice-list-page',
    };
    this.gs.Naviagete('Silver.USAccounts.Trans/InvoiceEditPage', JSON.stringify(parameter));

  }
  edit(_record: Tbl_cargo_invoicem) {
    if (!this.canEdit) {
      alert('Insufficient User Rights')
      return;
    }
 
    if (_record.inv_cust_name == "***") {
      if (_record.rec_created_by != this.gs.user_code) {
        alert("Cannot Load Details");
        return;
      }
    }

    let parameter = {
      menuid: this.menuid,
      pkid: _record.inv_pkid,
      mode: 'EDIT',
      mbl_pkid: this.mbl_pkid,
      mbl_type: this.mbl_type,
      inv_arap: '',
      mbl_refno: this.mbl_refno,
      arrival_notice: '',
      origin: 'invoice-list-page',
    };
    this.gs.Naviagete('Silver.USAccounts.Trans/InvoiceEditPage', JSON.stringify(parameter));
  }



  removeRow(rec : Tbl_cargo_invoicem ){
    


    var remarks = "Delete Invoice " +  rec.inv_no;
    if ( rec.rec_deleted  == "Y" && this.isAdmin)
      remarks += " Permanently."

    if ( !confirm(remarks))
      return; 
      

    var SearchData = this.gs.UserInfo;
    SearchData.pkid = rec.inv_pkid;
    SearchData.IS_ADMIN = (this.isAdmin) ? 'Y' : 'N';
    SearchData.DELETE_STATUS = rec.rec_deleted == "Y" ? "Y" : "N";
    SearchData.REMARKS = remarks;

    this.mainservice.DeletRecord(SearchData).subscribe(response => {
      if (rec.rec_deleted == "Y" && this.isAdmin)
        this.records.splice( this.records.findIndex( r => r.inv_pkid == rec.inv_pkid),1 );
      else
        rec.rec_deleted = "Y";
    }, error => {
      this.errorMessage = this.gs.getError(error);
      alert( this.errorMessage);
    });
  
  }



  Close() {
    this.location.back();
  }





}
