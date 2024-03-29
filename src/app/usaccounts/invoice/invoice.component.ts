import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_invoicem } from '../models/Tbl_cargo_Invoicem';
import { invoiceService } from '../services/invoice.service';
//EDIT-AJITH-21-09-2021
//EDIT-AJITH-04-10-2021
//EDIT-AJITH-13-10-2021
//EDIT-AJITH-29-10-2021
//EDIT-AJITH-19-11-2021

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
  sortCol = 'inv_no';
  sortOrder = true;

  id: string;
  menuid: string;

  title: string;
  isAdmin: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canSave: boolean;
  canDelete: boolean;

  income: number = 0;
  expense: number = 0;
  profit: number = 0;
  ar_bal: number = 0;
  ap_bal: number = 0;

  MBL_LOSS_APPROVED: boolean = false;
  MBL_PROFIT_REQ: boolean = false;
  MBL_LOSS_MEMO: string = '';
  MBL_BO_STATUS: string = 'NA';
  MBL_BO_ATTENDED_CODE: string = '';
  MBL_BO_REMARKS_EXIST: string = 'N';
  MBL_STAGE: string = '';

  inv_verson: string = "9";
  origin: string;
  records: Tbl_cargo_invoicem[]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    public gs: GlobalService,
    public mainservice: invoiceService
  ) { }

  ngOnInit() {
    this.gs.checkAppVersion();
    if (this.route.snapshot.queryParams.parameter == null)
      this.init(this.route.snapshot.queryParams);
    else
      this.init(this.route.snapshot.queryParams.parameter);

    this.List('SCREEN');
  }


  public init(params: any) {



    //const options = JSON.parse(params);
    const options = params;


    this.menuid = options.menuid;
    this.mbl_type = options.mbl_type;
    this.mbl_pkid = options.mbl_pkid;
    this.id = this.mbl_pkid;
    this.mbl_refno = options.mbl_refno;
    this.origin = options.origin;
    this.showdeleted = false;


    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.canAdd = this.gs.canAdd(this.menuid);
    this.canEdit = this.gs.canEdit(this.menuid);
    this.canSave = this.canAdd || this.canEdit;
    this.canDelete = this.gs.canDelete(this.menuid);

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
    SearchData.VERSION = this.inv_verson;
    SearchData.page_count = 0;
    SearchData.page_rows = 0;
    SearchData.page_current = -1;
    SearchData.page_rowcount = 0;



    this.mainservice.List(SearchData).subscribe(response => {
      this.records = response.list;

      this.MBL_LOSS_APPROVED = response.MBL_LOSS_APPROVED;
      this.MBL_PROFIT_REQ = response.MBL_PROFIT_REQ;
      this.MBL_LOSS_MEMO = response.MBL_LOSS_MEMO;
      this.MBL_BO_STATUS = response.MBL_BO_STATUS;
      this.MBL_BO_ATTENDED_CODE = response.MBL_BO_ATTENDED_CODE;
      this.MBL_BO_REMARKS_EXIST = response.MBL_BO_REMARKS_EXIST;
      this.MBL_STAGE = response.MBL_STAGE;
      this.DisplayProfit();
    }, error => {
      this.errorMessage = this.gs.getError(error)
      alert(this.errorMessage);
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
      appid: this.gs.appid,
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
    this.router.navigate(['Silver.USAccounts.Trans/InvoiceEditPage'], { queryParams: parameter });
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
      appid: this.gs.appid,
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
    this.router.navigate(['Silver.USAccounts.Trans/InvoiceEditPage'], { queryParams: parameter });
  }


  removeRow(rec: Tbl_cargo_invoicem) {


    if (rec.rec_closed == "Y") {
      alert("Record Locked Cannot Delete");
      return;
    }


    var remarks = "Delete Invoice " + rec.inv_no;
    if (rec.rec_deleted == "Y" && this.isAdmin)
      remarks += " Permanently."

    if (!confirm(remarks))
      return;


    var SearchData = this.gs.UserInfo;
    SearchData.pkid = rec.inv_pkid;
    SearchData.IS_ADMIN = (this.isAdmin) ? 'Y' : 'N';
    SearchData.DELETE_STATUS = rec.rec_deleted == "Y" ? "Y" : "N";
    SearchData.REMARKS = remarks;

    this.mainservice.DeletRecord(SearchData).subscribe(response => {
      if (rec.rec_deleted == "Y" && this.isAdmin)
        this.records.splice(this.records.findIndex(r => r.inv_pkid == rec.inv_pkid), 1);
      else
        rec.rec_deleted = "Y";
    }, error => {
      this.errorMessage = this.gs.getError(error);
      alert(this.errorMessage);
    });

  }

  restoreRow(rec: Tbl_cargo_invoicem) {

    if (rec.rec_closed == "Y") {
      alert("Record Locked Cannot Restore");
      return;
    }

    if (rec.rec_deleted == "N") {
      return;
    }

    var remarks = "";
    if (rec.rec_deleted == "Y" && this.isAdmin) {
      remarks = "Restore Invoice " + rec.inv_no;
      if (!confirm(remarks))
        return;
    } else
      return;


    var SearchData = this.gs.UserInfo;
    SearchData.pkid = rec.inv_pkid;
    SearchData.IS_ADMIN = (this.isAdmin) ? 'Y' : 'N';
    SearchData.DELETE_STATUS = rec.rec_deleted == "Y" ? "Y" : "N";
    SearchData.REMARKS = remarks;

    this.mainservice.RestoreRecord(SearchData).subscribe(response => {
      rec.rec_deleted = "N";
    }, error => {
      this.errorMessage = this.gs.getError(error);
      alert(this.errorMessage);
    });

  }

  Close() {
    // if (this.origin == "seaexp-master-page" || this.origin == "seaimp-master-page" || this.origin == "airexp-master-page" || this.origin == "airimp-master-page" || this.origin == "other-general-page")
    //   this.gs.LinkReturn(this.origin, this.mbl_pkid, '');
    // else
    this.location.back();
  }

  public getSortCol() {
    return this.sortCol;
  }
  public getSortOrder() {
    return this.sortOrder;
  }

  public getIcon(col: string) {
    if (col == this.sortCol) {
      if (this.sortOrder)
        return 'fa fa-arrow-down';
      else
        return 'fa fa-arrow-up';
    }
    else
      return null;
  }

  public sort(col: string) {
    if (col == this.sortCol) {
      this.sortOrder = !this.sortOrder;
    }
    else {
      this.sortCol = col;
      this.sortOrder = true;
    }
  }

  getRouteDet(_format: string, _rec: Tbl_cargo_invoicem, _type: string) {

    let MBLID: string = (_rec.inv_mbl_id != null) ? _rec.inv_mbl_id.toString() : "";
    let HBLID: string = (_rec.inv_hbl_id != null) ? _rec.inv_hbl_id.toString() : "";
    let REFNO: string = _rec.inv_mbl_refno != null ? _rec.inv_mbl_refno.toString() : "";
    let shbl_mode: string = _rec.inv_hbl_mode != null ? _rec.inv_hbl_mode.toString() : "";
    let sMode: string = "";
    let _refno: string = _rec.inv_type != null ? _rec.inv_type.toString() : "";
    sMode = this.getMode(_refno);
    
    if (_type == 'MASTER')
      return this.gs.Link2Page('REFNO', sMode, REFNO, MBLID, '', '', _format, '', '');
    else if (_type == 'HOUSE')
      return this.gs.Link2Page('HOUSE', shbl_mode, REFNO, MBLID, HBLID, '', _format, '', '');
    else
      return null;
  }

  getMode(refno: string) {

    let sMode: string = "";
    if (refno == "OI")
      sMode = "SEA IMPORT";
    else if (refno == "OE")
      sMode = "SEA EXPORT";
    else if (refno == "AI")
      sMode = "AIR IMPORT";
    else if (refno == "AE")
      sMode = "AIR EXPORT";
    else if (refno == "OT")
      sMode = "OTHERS";
    else if (refno == "EX")
      sMode = "EXTRA";
    else if (refno == "CM")
      sMode = "CM";
    else if (refno == "PR")
      sMode = "PR";
    else if (refno == "FA")
      sMode = "FA";
    else if (refno == "GE")
      sMode = "GE";
    else if (refno == "PS")
      sMode = "PS";

    return sMode;
  }

  onBlur(field: string) {
    switch (field) {
      case 'MBL_LOSS_MEMO': {
        this.MBL_LOSS_MEMO = this.MBL_LOSS_MEMO.toUpperCase();
        break;
      }
    }
  }

  UpdateBOStatus() {

    var SearchData = this.gs.UserInfo;
    SearchData.MBL_PKID = this.mbl_pkid;
    SearchData.MBL_BO_STATUS = this.MBL_BO_STATUS;
    SearchData.MBL_BO_ATTENDED_CODE = this.gs.user_code;
    SearchData.MBL_BO_ATTENDED_DATE = this.getBoAttendedDate();
    this.errorMessage = '';
    this.mainservice.BO_Status_Save(SearchData).subscribe(response => {
      this.MBL_BO_ATTENDED_CODE = this.gs.user_code;
      // alert('Update Complete');
    }, error => {
      alert(this.gs.getError(error));
    });

  }

  getBoAttendedDate() {
    let adate: string = this.gs.defaultValues.today;
    try {
      let nowDate = new Date();
      adate = this.gs.defaultValues.today + ' ' + nowDate.toLocaleTimeString('en-US',{ hour12: false });
    }
    catch (Exception) {
      adate = this.gs.defaultValues.today;
    }
    return adate;
  }

}
