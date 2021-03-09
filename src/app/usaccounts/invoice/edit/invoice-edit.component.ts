import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { GlobalService } from '../../../core/services/global.service';
import { SearchTable } from '../../../shared/models/searchtable';

import { Tbl_cargo_invoicem, vm_tbl_cargo_invoicem } from '../../models/Tbl_cargo_Invoicem';
import { Tbl_Cargo_Invoiced } from '../../models/Tbl_cargo_Invoicem';
import { Tbl_PayHistory } from '../../models/Tbl_cargo_Invoicem';

import { Tbl_House } from '../../models/tbl_house';
import { invoiceService } from '../../services/invoice.service';
import { DateComponent } from '../../../shared/date/date.component';
import { AutoComplete2Component } from '../../../shared/autocomplete2/autocomplete2.component';


@Component({
  selector: 'app-invoice-edit',
  templateUrl: './invoice-edit.component.html'
})
export class InvoiceEditComponent implements OnInit {

  @ViewChild('_inv_refno') inv_refno_ctrl: ElementRef;
  @ViewChild('_inv_date') inv_date_ctrl: DateComponent;
  @ViewChildren('_invd_desc_code') invd_desc_code_ctrl: QueryList<AutoComplete2Component>;
  @ViewChildren('_invd_desc_name') invd_desc_name_ctrl: QueryList<ElementRef>;
  @ViewChildren('_invd_qty') invd_qty_ctrl: QueryList<ElementRef>;
  @ViewChildren('_invd_exrate') invd_exrate_ctrl: QueryList<ElementRef>;
  errorMessage: string;

  qtnno: string;

  mode: string;
  mbl_pkid: string;
  hbl_pkid: string;
  mbl_refno: string;
  mbl_type: string; // OE OI AE AI ...etc
  showdeleted: boolean;
  paid_amt: number;
  bal_amt: number;

  inv_arap: string; // AR OR AP
  arrival_notice: string = '';

  ArAp_Where_Condition: string = '';
  acc_code_Where_Condition: string = '';

  pkid: string;
  menuid: string;

  title: string;
  isAdmin: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canSave: boolean;

  inv_verson: string = "7";
  tab: string = 'main';
  report_title: string = '';
  report_url: string = '';
  report_searchdata: any = {};
  report_menuid: string = '';

  acc_id: string = '';
  acc_code: string = '';
  acc_name: string = '';

  inv_mbl_id: string = "";
  inv_hbl_id: string = "";

  inv_house_id: string = "";
  old_amt: number = 0;

  enable_customer_control: boolean = false;
  enable_arap_control: boolean = false;
  enable_acc_control: boolean = false;

  enable_currency: boolean = false;

  show_currency: boolean = false;
  show_cc_control: boolean = false;
  show_vat: boolean = false;
  show_confirm: boolean = false;
  show_invstage: boolean = false;

  isVat: boolean = false;
  isConfirmed: boolean = true;

  public record: Tbl_cargo_invoicem = <Tbl_cargo_invoicem>{};
  public records: Tbl_Cargo_Invoiced[] = [];
  history: Tbl_PayHistory[] = [];

  HouseList: Tbl_House[] = [];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: invoiceService
  ) { }

  ngOnInit() {
    if (this.route.snapshot.queryParams.parameter == null) {
      this.menuid = this.route.snapshot.queryParams.menuid;
      this.pkid = this.route.snapshot.queryParams.pkid;
      this.mbl_pkid = this.route.snapshot.queryParams.mbl_pkid;
      this.mbl_type = this.route.snapshot.queryParams.mbl_type;
      this.inv_arap = this.route.snapshot.queryParams.inv_arap;
      this.mode = this.route.snapshot.queryParams.mode;
      this.mbl_refno = this.route.snapshot.queryParams.mbl_refno;
      this.arrival_notice = this.route.snapshot.queryParams.arrival_notice;
    } else {
      const options = JSON.parse(this.route.snapshot.queryParams.parameter);
      this.menuid = options.menuid;
      this.pkid = options.pkid;
      this.mbl_pkid = options.mbl_pkid;
      this.mbl_type = options.mbl_type;
      this.inv_arap = options.inv_arap;
      this.mode = options.mode;
      this.mbl_refno = options.mbl_refno;
      this.arrival_notice = options.arrival_notice;
    }
    this.initpage();
    this.GetHouseList();
    this.initControls();

    this.SetIncomeExpenseCodesForLineItems();
    // this.enableAll();
    this.actionHandler();
  }


  initpage() {
    this.old_amt = 0;
    this.showdeleted = false;
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.canAdd = this.gs.canAdd(this.menuid);
    this.canEdit = this.gs.canEdit(this.menuid);
    this.canSave = this.canAdd || this.canEdit;
    this.showTitle();
  }



  private GetHouseList() {

    let SearchData: any = {
      pkid: this.mbl_pkid,
      TYPE: 'HOUSE',
      INV_TYPE: this.mbl_type

    };

    this.mainservice.GetHouseList(SearchData).subscribe(response => {
      this.HouseList = <Tbl_House[]>response.records;
      this.inv_date_ctrl.Focus();
    }, Error => {
      this.gs.getError(Error);
    });
  }



  showTitle() {
    if (this.inv_arap == 'AR')
      this.title = 'A/R INVOICE'
    if (this.inv_arap == 'AP')
      this.title = 'A/P INVOICE'
  }



  initControls() {
    this.show_vat = (this.gs.VAT_PER > 0) ? true : false;
    this.show_confirm = (this.gs.VAT_PER > 0) ? true : false;
    this.show_currency = (this.gs.IS_SINGLE_CURRENCY) ? false : true;
    this.enable_currency = (this.gs.IS_SINGLE_CURRENCY) ? false : true;
    this.show_invstage = false;
    this.enable_customer_control = true;

  }

  enableAll() {

    this.enable_customer_control = true;
    this.enable_arap_control = true;
    this.enable_acc_control = true;

    this.show_vat = true;
    this.show_confirm = true;
    this.show_currency = true;
    this.show_invstage = true;
    this.show_cc_control = true;

    this.enable_currency = true;

  }


  SetIncomeExpenseCodesForLineItems() {
    if (this.inv_arap == "AR") {
      if (this.mbl_type == "AE") {
        this.acc_id = this.gs.INCOME_AE_ID;
        this.acc_code = this.gs.INCOME_AE_NAME;
      }
      if (this.mbl_type == "AI") {
        this.acc_id = this.gs.INCOME_AI_ID;
        this.acc_code = this.gs.INCOME_AI_NAME;
      }
      if (this.mbl_type == "OE") {
        this.acc_id = this.gs.INCOME_SE_ID;
        this.acc_code = this.gs.INCOME_SE_NAME;
      }
      if (this.mbl_type == "OI") {
        this.acc_id = this.gs.INCOME_SI_ID;
        this.acc_code = this.gs.INCOME_SI_NAME;
      }
      if (this.mbl_type == "OT") {
        this.acc_id = this.gs.INCOME_OT_ID;
        this.acc_code = this.gs.INCOME_OT_NAME;
      }
      if (this.mbl_type == "EX") {
        this.acc_id = this.gs.INCOME_EX_ID;
        this.acc_code = this.gs.INCOME_EX_NAME;
      }
    }
    if (this.inv_arap == "AP") {
      if (this.mbl_type == "AE") {
        this.acc_id = this.gs.EXPENSE_AE_ID;
        this.acc_code = this.gs.EXPENSE_AE_NAME;
      }
      if (this.mbl_type == "AI") {
        this.acc_id = this.gs.EXPENSE_AI_ID;
        this.acc_code = this.gs.EXPENSE_AI_NAME;
      }
      if (this.mbl_type == "OE") {
        this.acc_id = this.gs.EXPENSE_SE_ID;
        this.acc_code = this.gs.EXPENSE_SE_NAME;
      }
      if (this.mbl_type == "OI") {
        this.acc_id = this.gs.EXPENSE_SI_ID;
        this.acc_code = this.gs.EXPENSE_SI_NAME;
      }
      if (this.mbl_type == "OT") {
        this.acc_id = this.gs.EXPENSE_OT_ID;
        this.acc_code = this.gs.EXPENSE_OT_NAME;
      }
      if (this.mbl_type == "EX") {
        this.acc_id = this.gs.EXPENSE_EX_ID;
        this.acc_code = this.gs.EXPENSE_EX_NAME;
      }
    }


    if (this.mbl_type == "GE" || this.mbl_type == "PR" || this.mbl_type == "CM" || this.mbl_type == "PS" || this.mbl_type == "FA") {
      this.enable_acc_control = true;
      this.show_cc_control = true;
      this.enable_arap_control = false;

      if (this.gs.ALLOW_ARAP_CODE_SELECTION == "Y")
        this.enable_arap_control = true;
      else
        this.enable_arap_control = false;

      if (this.mbl_type == "PS") {
        if (this.inv_arap == "AR") {
          if (this.gs.INTERNAL_PAYMENT_SETTLMENT_AR_ID != "") {
            this.acc_id = this.gs.INTERNAL_PAYMENT_SETTLMENT_AR_ID;
            this.acc_code = this.gs.INTERNAL_PAYMENT_SETTLMENT_AR_NAME;
          }
        }
        if (this.inv_arap == "AP") {
          if (this.gs.INTERNAL_PAYMENT_SETTLMENT_AP_ID != "") {
            this.acc_id = this.gs.INTERNAL_PAYMENT_SETTLMENT_AP_ID;
            this.acc_code = this.gs.INTERNAL_PAYMENT_SETTLMENT_AP_NAME;
          }
        }
      }
    }
    else {
      this.enable_acc_control = false;
      this.show_cc_control = false;
      this.enable_arap_control = false;
    }

    /*
          if (INV_ARAP == "AR")
          {
              TXT_ARAP_CODE.PKID = GLOBALCONTANTS.SETTINGS_AC_RECEIVABLE;
              TXT_ARAP_CODE.Text = GLOBALCONTANTS.SETTINGS_AC_RECEIVABLE_NAME;
          }
          if (INV_ARAP == "AP")
          {
              TXT_ARAP_CODE.PKID = GLOBALCONTANTS.SETTINGS_AC_PAYABLE;
              TXT_ARAP_CODE.Text = GLOBALCONTANTS.SETTINGS_AC_PAYABLE_NAME;
          }


    if (this.inv_arap == "AR")
        TXT_ARAP_CODE.LOV_TABLE_WHERE = "ACC_IS_ARAP_CODE='R' ";
    else
        TXT_ARAP_CODE.LOV_TABLE_WHERE = "ACC_IS_ARAP_CODE='P' ";      
    */

  }


  AddRow() {

    this.SetIncomeExpenseCodesForLineItems();

    var rec = <Tbl_Cargo_Invoiced>{};
    rec.invd_pkid = this.gs.getGuid();
    rec.invd_parent_id = this.pkid;


    rec.invd_acc_id = this.acc_id;
    rec.invd_acc_code = this.acc_code;
    rec.invd_acc_name = this.acc_code;
    rec.invd_curr_code = this.record.inv_curr_code;
    rec.invd_exrate = this.record.inv_exrate;
    rec.invd_qty = 1;
    rec.invd_vat_per = 0;
    rec.invd_vat_amt = 0;
    rec.invd_fvat_amt = 0;
    rec.invd_frate = 0;

    rec.invd_cc_id = this.gs.branch_pkid;
    rec.invd_cc_code = this.gs.branch_code;

    rec.invd_remarks = '';

    this.records.push(rec);

    this.invd_desc_code_ctrl.changes
      .subscribe((queryChanges) => {
        this.invd_desc_code_ctrl.last.Focus();
      });
  }

  removeRow(_rec: Tbl_Cargo_Invoiced) {

    if (!confirm('Remove Invoice Line Item Y/N'))
      return;

    this.records.forEach((rec, index) => {
      if (rec == _rec) {
        this.records.splice(index, 1);
      }
    });
    this.FindGrandTotal();

  }


  NewRecord(arorap: string) {
    this.mode = 'ADD';
    this.inv_arap = arorap;
    this.actionHandler();
  }

  actionHandler() {
    this.errorMessage = '';

    if (this.mode == 'ADD') {
      this.record = <Tbl_cargo_invoicem>{};
      this.records = <Tbl_Cargo_Invoiced[]>[];
      this.history = <Tbl_PayHistory[]>[];
      this.pkid = this.gs.getGuid();
      this.SetInitialValues();
    }
    if (this.mode == 'EDIT') {
      this.GetRecord();
    }
  }


  SetInitialValues() {

    if (this.inv_arap == "AR") {
      this.record.inv_prefix = this.gs.AR_INVOICE_PREFIX;
      this.record.inv_startingno = this.gs.AR_INVOICE_STARTING_NO;
      this.record.inv_acc_id = this.gs.SETTINGS_AC_RECEIVABLE;
      this.record.inv_acc_name = this.gs.SETTINGS_AC_RECEIVABLE_NAME;
    }
    else {
      this.record.inv_prefix = this.gs.AP_INVOICE_PREFIX;
      this.record.inv_startingno = this.gs.AP_INVOICE_STARTING_NO;
      this.record.inv_acc_id = this.gs.SETTINGS_AC_PAYABLE;
      this.record.inv_acc_name = this.gs.SETTINGS_AC_PAYABLE_NAME;
    }

    this.record.inv_pkid = this.pkid;
    this.record.inv_mbl_id = this.mbl_pkid;
    this.record.inv_arap = this.inv_arap;
    this.record.inv_type = this.mbl_type;

    this.record.inv_date = this.gs.defaultValues.today;

    this.record.inv_year = +this.gs.year_code;
    this.record.inv_mbl_refno = this.mbl_refno;

    this.record.inv_arrnotice = 'N';

    this.record.inv_paid = 0;

    this.record.inv_curr_code = this.gs.base_cur_code;
    this.record.inv_exrate = 1;



    this.record.inv_vat = 0;
    this.record.inv_fvat = 0;
    this.record.inv_vat_per = 0;

    this.record.inv_confirmed = 'Y';

    this.record.inv_agent_drcr = 'N';
    this.record.inv_stage = '';

    this.record.inv_remarks = '';
    this.record.inv_remarks2 = '';
    this.record.inv_remarks3 = '';

    this.inv_house_id = '';

    this.isConfirmed = true;

    this.paid_amt = 0;
    this.bal_amt = 0;

    this.InitCommonValues();

    this.initControls();

    this.isVat = false;
    if (this.show_vat) {
      if (this.gs.CompareDate(this.record.inv_date, "2018-02-01") == ">")
        this.isVat = true;
    }

    if (!this.gs.isBlank(this.inv_date_ctrl))
      this.inv_date_ctrl.Focus();
  }


  InitCommonValues() {
    this.showTitle();
    if (this.record.inv_arap == 'AR')
      this.ArAp_Where_Condition = "ACC_IS_ARAP_CODE='R' ";
    if (this.record.inv_arap == 'AP')
      this.ArAp_Where_Condition = "ACC_IS_ARAP_CODE='P' ";

    this.acc_code_Where_Condition = "(ACC_PARENT_CODE IN('1A','1B','2A','2B') or ACC_TYPE in('ASSET', 'FIXED ASSET', 'CAPITAL','RETAINED-PROFIT') ) ";

  }


  GetRecord() {

    this.old_amt = 0;
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;
    SearchData.INV_TYPE = this.mbl_type;
    SearchData.ISADMIN = (this.isAdmin) ? 'Y' : 'N';

    this.mainservice.GetRecord(SearchData).subscribe(response => {
      this.record = <Tbl_cargo_invoicem>response.record;
      this.records = <Tbl_Cargo_Invoiced[]>response.records;
      this.history = <Tbl_PayHistory[]>response.history;
      this.paid_amt = response.paid;

      // this.paid_amt = 0;

      this.mbl_type = this.record.inv_type;
      this.inv_arap = this.record.inv_arap;
      this.mbl_pkid = this.record.inv_mbl_id;
      this.hbl_pkid = this.record.inv_hbl_id;

      this.inv_house_id = this.record.inv_hbl_id;
      if (this.record.inv_hbl_id == null || this.record.inv_hbl_id == '')
        this.inv_house_id = this.record.inv_mbl_id;

      this.old_amt = this.record.inv_total;

      this.InitCommonValues();

      this.DisplayBalance();

      this.isConfirmed = false;
      if (this.record.inv_confirmed == 'Y')
        this.isConfirmed = true;

      this.isVat = false;
      if (this.show_vat) {
        if (this.gs.CompareDate(this.record.inv_date, "2018-02-01") == ">")
          this.isVat = true;
      }

      this.inv_date_ctrl.Focus();
    }, error => {
      alert(this.gs.getError(error));
    });
  }

  SaveParent() {
    this.record.inv_confirmed = 'N';
    this.record.inv_stage = "N";

    if (this.isVat) {
      this.record.inv_vat_per = this.gs.VAT_PER;
      this.record.vat_acc_id = this.gs.VAT_ACC_ID;
      this.record.vat_acc_name = this.gs.VAT_ACC_NAME;
      this.record.vat_desc_id = this.gs.VAT_INVDESC_ID;
      this.record.vat_dsc_name = this.gs.VAT_INVDESC_NAME;
      this.record.vat_per = this.gs.VAT_PER;
    }

    if (this.isConfirmed)
      this.record.inv_confirmed = 'Y';

    let Jv_Narration = "";
    if (this.record.inv_arap == "AR")
      Jv_Narration = "DUE FROM ";
    else
      Jv_Narration = "DUE TO ";
    Jv_Narration += this.record.inv_cust_name;
    Jv_Narration += " AMOUNT: " + this.record.inv_total;
    Jv_Narration += " REFNO: " + this.record.inv_mbl_refno;
    Jv_Narration += this.record.inv_date != null ? " DATED: " + this.record.inv_date : "";
    Jv_Narration += this.record.inv_remarks != null ? " " + this.record.inv_remarks.trim() : "";
    Jv_Narration += this.record.inv_remarks2 != null ? " " + this.record.inv_remarks2.trim() : "";
    Jv_Narration += this.record.inv_remarks3 != null ? " " + this.record.inv_remarks3.trim() : "";

    if (Jv_Narration.length > 250)
      Jv_Narration = Jv_Narration.substring(0, 250);
    this.record.inv_narration = Jv_Narration;
  }

  Save() {

    this.FindGrandTotal();

    this.SaveParent();

    if (!this.Allvalid())
      return;

    this.errorMessage = '';

    var SearchData = this.gs.UserInfo;
    SearchData.IS_SINGLE_CURRENCY = (this.gs.IS_SINGLE_CURRENCY) ? "Y" : "N";
    SearchData.BASE_CURRENCY_CODE = this.gs.base_cur_code;
    SearchData.VERSION = this.inv_verson;

    const data = <vm_tbl_cargo_invoicem>{};
    data.record = this.record;
    data.records = this.records;
    data.mode = this.mode;
    data.userinfo = SearchData;
    data.old_amt = this.old_amt;

    this.mainservice.Save(data).subscribe(rec => {
      if (rec.retvalue) {
        if (this.mode == 'ADD') {
          this.record.inv_cfno = rec.cfno;
          this.record.inv_no = rec.docno;
        }
        this.mode = 'EDIT';
        this.old_amt = this.record.inv_total;
      }
      else {
        alert(this.errorMessage);
      }
    },
      error => {
        alert(this.gs.getError(error));
      }
    );


  }

  Allvalid(): boolean {
    let bret = true;

    if (this.record.rec_deleted == 'Y') {
      this.errorMessage = 'This a deleted Invoice';
      return false;
    }

    if (this.isVat) {
      if (this.gs.VAT_ACC_ID.length <= 0) {
        this.errorMessage = "Vat A/c Not Defined";
        return false;
      }
      if (this.gs.VAT_INVDESC_ID.length <= 0) {
        this.errorMessage = "Vat Invoice Description Not Defined";
        return false;
      }
    }


    if (this.gs.isBlank(this.record.inv_date)) {
      this.errorMessage = "Invalid Invoice Date";
      return false;
    }


    if (this.gs.isBlank(this.record.inv_acc_id)) {
      this.errorMessage = "AR or AP  A/c Not Found";
      return false;
    }


    if (this.gs.isBlank(this.record.inv_cust_id)) {
      this.errorMessage = "Invalid Customer";
      return false;
    }

    if (this.gs.isBlank(this.record.inv_curr_code)) {
      this.errorMessage = "Invalid Currency";
      return false;
    }


    if (this.gs.isZero(this.record.inv_exrate)) {
      this.errorMessage = "Invalid Ex.Rate";
      return false;
    }

    if (this.gs.isBlank(this.inv_house_id)) {
      this.errorMessage = "Invalid Master/House Selection";
      return false;
    }

    if (this.gs.isBlank(this.record.inv_cost_type)) {
      this.errorMessage = "Invalid Cost Type";
      return false;
    }

    if (this.gs.isZero(this.record.inv_total)) {
      this.errorMessage = "Invalid Invoice Total";
      return false;
    }


    if (this.gs.IS_SINGLE_CURRENCY == false) {
      if (this.record.inv_curr_code == this.gs.base_cur_code) {
        if (this.record.inv_exrate != 1) {
          this.errorMessage = "Invalid Exchange Rate";
          return false;
        }
      }
      else {
        if (this.record.inv_exrate == 0) {
          this.errorMessage = "Invalid Exchange Rate";
          return false;
        }
      }
    }

    let sErrMsg = "";
    let iCtr = 0;
    this.records.forEach(Rec => {
      iCtr++;
      Rec.invd_order = iCtr;

      if (this.gs.isBlank(Rec.invd_desc_id) || this.gs.isBlank(Rec.invd_desc_name)) {
        sErrMsg = 'Invalid Invoice Description in Invoice Detail';
      }
      if (this.gs.isBlank(Rec.invd_acc_id)) {
        sErrMsg = 'Invalid A/ Code in Invoice Detail';
      }
      if (this.gs.isBlank(Rec.invd_curr_code)) {
        sErrMsg = 'Invalid Currency in Invoice Detail';
      }

      if (this.gs.IS_SINGLE_CURRENCY == false) {
        if (Rec.invd_curr_code != this.record.inv_curr_code) {
          sErrMsg = 'Invalid Currency in Invoice Detail';
        }
      }
      if (this.gs.isZero(Rec.invd_exrate)) {
        sErrMsg = 'Invalid Ex.Rate in Invoice Detail';
      }

      if (this.gs.isZero(Rec.invd_ftotal) || this.gs.isZero(Rec.invd_total)) {
        sErrMsg = 'Invalid Amount in Invoice Detail';
      }

      if (this.record.inv_type == "GE" || this.record.inv_type == "PR" || this.record.inv_type == "CM" || this.record.inv_type == "PS" || this.record.inv_type == "FA") {
        if (this.gs.isBlank(Rec.invd_cc_id)) {
          sErrMsg = "Branch Has to be selected";
        }
      }

    });

    if (iCtr == 0) {
      sErrMsg = "No Detail Rows To Save";
    }
    if (sErrMsg != '') {
      this.errorMessage = sErrMsg;
      return false;
    }

    return bret;
  }



  onItmChange() {
    this.HouseList.forEach(rec => {
      if (rec.pkid == this.inv_house_id) {

        if (rec.type == 'A') {
          this.record.inv_hbl_id = '';
          this.record.inv_cost_type = 'M';
          this.record.inv_hbl_no = '';
        }
        if (rec.type == 'B') {
          this.record.inv_hbl_id = rec.pkid;
          this.record.inv_cost_type = 'B';
          this.record.inv_hbl_no = rec.houseno;
        }
        this.record.inv_hbl_shipper_name = rec.shipper.toString();
        this.record.inv_hbl_consignee_name = rec.consignee.toString();
        this.record.inv_hbl_packages = +rec.pkgs;
        this.record.inv_hbl_uom = rec.unit;
        this.record.inv_hbl_lbs = +rec.lbs;
        this.record.inv_hbl_weight = +rec.wt;
        this.record.inv_hbl_cbm = +rec.cbm;
        this.record.inv_hbl_cft = +rec.cft;
      }
    });
  }

  DisplayBalance() {
    this.bal_amt = this.record.inv_total - this.paid_amt;
    this.bal_amt = this.gs.roundNumber(this.bal_amt, 2);

    if (this.paid_amt != 0) {
      this.enable_customer_control = false;
      this.enable_arap_control = false;
      this.enable_currency = false;
    }
  }

  FindGrandTotal() {
    let nfTot = 0;
    let nTot = 0;
    let nBal = 0;
    let nPaid = 0;

    let nfVat = 0;
    let nVat = 0;

    this.records.forEach(Rec => {
      nTot += Rec.invd_total;
      nfTot += Rec.invd_ftotal;
      nVat += Rec.invd_vat_amt;
      nfVat += Rec.invd_fvat_amt;
    });

    nTot = this.gs.roundNumber(nTot, 2);
    nfTot = this.gs.roundNumber(nfTot, 2);

    nVat = this.gs.roundNumber(nVat, 2);
    nfVat = this.gs.roundNumber(nfVat, 2);


    this.record.inv_total1 = nTot;
    this.record.inv_ftotal1 = nfTot;

    this.record.inv_vat = nVat;
    this.record.inv_fvat = nfVat;



    nTot += nVat;
    nfTot += nfVat;

    nTot = this.gs.roundNumber(nTot, 2);
    nfTot = this.gs.roundNumber(nfTot, 2);

    this.record.inv_total = nTot;
    this.record.inv_ftotal = nfTot;

    nPaid = this.record.inv_paid;
    nBal = nTot - nPaid;

    this.record.inv_balance = nBal;

    this.DisplayBalance();

    /*
    Txt_Total1.Text = nTot.ToString();
    Txt_ftotal1.Text = nfTot.ToString();

    Txt_Vat.Text = nVat.ToString();
    Txt_FVat.Text = nfVat.ToString();

    nTot += nVat;
    nfTot += nfVat;

    Txt_Invoice_Total.Text = nTot.ToString();
    Txt_Invoice_FTotal.Text = nfTot.ToString();

    nPaid = Lib.Convert2Decimal(Txt_Paid.Text);
    nBal = nTot - nPaid;
    Txt_Balance.Text = nBal.ToString();
    */




  }






  FindWeight(_type: string) {
    if (_type == "Kgs2Lbs")
      this.record.inv_hbl_lbs = this.gs.Convert_Weight("KG2LBS", this.record.inv_hbl_weight, 3);
    else if (_type == "Lbs2Kgs")
      this.record.inv_hbl_weight = this.gs.Convert_Weight("LBS2KG", this.record.inv_hbl_lbs, 3);
    else if (_type == "Cbm2Cft")
      this.record.inv_hbl_cft = this.gs.Convert_Weight("CBM2CFT", this.record.inv_hbl_cbm, 3);
    else if (_type == "Cft2Cbm")
      this.record.inv_hbl_cbm = this.gs.Convert_Weight("CFT2CBM", this.record.inv_hbl_cft, 3);
  }

  onBlur(field: string, rec: Tbl_Cargo_Invoiced = null) {
    switch (field) {
      case 'inv_no': {
        break;
      }
      case 'mbl_refno': {
        break;
      }
      case 'invoice_code': {
        break;
      }
      case 'inv_cust_name': {
        this.record.inv_cust_name = this.record.inv_cust_name.toUpperCase();
        break;
      }
      case 'inv_refno': {
        this.record.inv_refno = this.record.inv_refno.toUpperCase();
        break;
      }

      case 'inv_hbl_shipper_name': {
        this.record.inv_hbl_shipper_name = this.record.inv_hbl_shipper_name.toUpperCase();
        break;
      }
      case 'inv_hbl_consignee_name': {
        this.record.inv_hbl_consignee_name = this.record.inv_hbl_consignee_name.toUpperCase();
        break;
      }
      case 'inv_hbl_uom': {
        this.record.inv_hbl_uom = this.record.inv_hbl_uom.toUpperCase();
        break;
      }
      case 'inv_remarks': {
        this.record.inv_remarks = this.record.inv_remarks.toUpperCase();
        break;
      }
      case 'inv_remarks2': {
        this.record.inv_remarks2 = this.record.inv_remarks2.toUpperCase();
        break;
      }
      case 'inv_remarks3': {
        this.record.inv_remarks3 = this.record.inv_remarks3.toUpperCase();
        break;
      }
      case 'invd_remarks': {
        rec.invd_remarks = rec.invd_remarks.toUpperCase();
        break;
      }
      case 'invd_desc_name': {
        rec.invd_desc_name = rec.invd_desc_name.toUpperCase();
        break;
      }


      case 'inv_hbl_packages': {
        this.record.inv_hbl_packages = this.gs.roundNumber(this.record.inv_hbl_packages, 0)
        break;
      }
      case 'inv_hbl_lbs': {
        this.record.inv_hbl_lbs = this.gs.roundNumber(this.record.inv_hbl_lbs, 3)
        break;
      }
      case 'inv_hbl_weight': {
        this.record.inv_hbl_weight = this.gs.roundNumber(this.record.inv_hbl_weight, 3)
        break;
      }
      case 'inv_hbl_cbm': {
        this.record.inv_hbl_cbm = this.gs.roundNumber(this.record.inv_hbl_cbm, 3)
        break;
      }
      case 'inv_hbl_cft': {
        this.record.inv_hbl_cft = this.gs.roundNumber(this.record.inv_hbl_cft, 3)
        break;
      }
      case 'invd_ftotal': {
        rec.invd_ftotal = this.gs.roundNumber(rec.invd_ftotal, 2)
        this.findRowTotal(field, rec);
        break;
      }
      case 'invd_total': {
        this.findRowTotal(field, rec);
        break;
      }
      case 'invd_exrate': {
        this.findRowTotal(field, rec);
        break;
      }
      case 'invd_vat_per': {
        this.findRowTotal(field, rec);
        break;
      }
      case 'invd_qty': {
        rec.invd_qty = this.gs.roundNumber(rec.invd_qty, 3);
        this.findRowTotal(field, rec);
        break;
      }
      case 'invd_rate': {
        rec.invd_rate = this.gs.roundNumber(rec.invd_rate, 2);
        this.findRowTotal(field, rec);
        break;
      }

    }
  }

  findRowTotal(field: string, rec: Tbl_Cargo_Invoiced) {

    let nQty = rec.invd_qty;
    let nRate = rec.invd_rate;

    let nAmt = rec.invd_ftotal;
    let nExRate = rec.invd_exrate;
    let nTotal = 0;

    let Row_FVat = 0;
    let Row_Vat = 0;

    if (field == "invd_qty" || field == "invd_rate") {
      nQty = rec.invd_qty;
      if (nQty == 0) {
        nQty = 1;
      }
      nRate = rec.invd_rate;
      if (nQty != 0 && nRate != 0) {
        nAmt = nQty * nRate;
        nAmt = this.gs.roundNumber(nAmt, 2);
        rec.invd_ftotal = nAmt;
      }
    }

    if (field == "invd_ftotal") {
      if (nQty == 0) {
        rec.invd_qty = 1;
        nQty = 1;
      }
      nRate = nAmt / nQty;
      nRate = this.gs.roundNumber(nRate, 2);
      rec.invd_rate = nRate;
    }


    rec.invd_frate = nAmt;

    if (nExRate <= 0) {
      rec.invd_exrate = 1;
      nExRate = 1;
    }
    nTotal = nAmt * nExRate;
    if (this.gs.IS_SINGLE_CURRENCY == false) {
      if (this.record.inv_curr_code != this.gs.base_cur_code && rec.invd_curr_code == this.gs.base_cur_code) {
        nTotal = nAmt / nExRate;
      }
    }
    nTotal = this.gs.roundNumber(nTotal, 2);


    rec.invd_total = nTotal;

    if (rec.invd_vat_per > 0) {
      Row_FVat = nAmt * rec.invd_vat_per / 100;
      Row_FVat = this.gs.roundNumber(Row_FVat, 2);
      Row_Vat = nTotal * rec.invd_vat_per / 100;
      Row_Vat = this.gs.roundNumber(Row_Vat, 2);
    }

    rec.invd_vat_amt = Row_Vat;
    rec.invd_fvat_amt = Row_FVat;


    this.FindGrandTotal();
  }

  LovSelected(_Record: SearchTable, idx: number = 0) {

    if (_Record.controlname == "CUSTOMER") {
      this.record.inv_cust_id = _Record.id;
      this.record.inv_cust_code = _Record.code;
      this.record.inv_cust_name = _Record.name;
      this.inv_refno_ctrl.nativeElement.focus();
    }

    if (_Record.controlname == "ARAP") {
      this.record.inv_acc_id = _Record.id;
      this.record.inv_acc_name = _Record.name;
    }

    if (_Record.controlname == "CURR") {
      this.record.inv_curr_code = _Record.code;
      this.record.inv_exrate = +_Record.col1;
      if (this.gs.IS_SINGLE_CURRENCY)
        this.record.inv_exrate = 1;

    }



    if (_Record.controlname == "INVOICED-CODE" || _Record.controlname == "INVOICED-CURR" || _Record.controlname == "INVOICED-ACCTM" || _Record.controlname == "INVOICED-BRANCH") {
      this.records.forEach(rec => {

        if (rec.invd_pkid == _Record.uid) {

          if (_Record.controlname == "INVOICED-CODE") {
            rec.invd_desc_id = _Record.id;
            rec.invd_desc_name = _Record.name;

            if (this.show_vat)
              rec.invd_vat_per = +_Record.col2;

            if (!this.gs.isBlank(this.invd_desc_name_ctrl))
              if (idx < this.invd_desc_name_ctrl.toArray().length)
                this.invd_desc_name_ctrl.toArray()[idx].nativeElement.focus();

            this.findRowTotal('invd_code', rec);

          }

          if (_Record.controlname == "INVOICED-CURR") {
            rec.invd_curr_id = _Record.id;
            rec.invd_curr_code = _Record.code;
            rec.invd_exrate = +_Record.col1;
            if (this.gs.IS_SINGLE_CURRENCY)
              rec.invd_exrate = 1;

            this.findRowTotal('invd_exrate', rec);

            if (!this.gs.isBlank(this.invd_exrate_ctrl))
              if (idx < this.invd_exrate_ctrl.toArray().length)
                this.invd_exrate_ctrl.toArray()[idx].nativeElement.focus();
          }

          if (_Record.controlname == "INVOICED-ACCTM") {
            rec.invd_acc_id = _Record.id;
            rec.invd_acc_code = _Record.code;
            rec.invd_acc_name = _Record.name;
            if (!this.gs.isBlank(this.invd_qty_ctrl))
              if (idx < this.invd_qty_ctrl.toArray().length)
                this.invd_qty_ctrl.toArray()[idx].nativeElement.focus();
          }

          if (_Record.controlname == "INVOICED-BRANCH") {
            rec.invd_cc_id = _Record.id;
            rec.invd_cc_code = _Record.code;
          }

        }
      });
    }

  }

  BtnNavigation(action: string) {
    switch (action) {
      case 'HISTORY': {
        let prm = {
          menuid: this.menuid,
          pkid: this.pkid,
          source: "INVOICE",
          title: "History [INVOICE NO : " + this.record.inv_no + "]",
          origin: 'invoice-page'
        };
        this.gs.Naviagete('Silver.BusinessModule/LogBookPage', JSON.stringify(prm));
        break;
      }
      case 'INVOICE-PRINT': {
        let sPath: string = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\quotation\\";
        this.report_title = 'Invoice';
        this.report_url = '/api/USAccounts/Invoice/InvoiceReport';
        this.report_searchdata = this.gs.UserInfo;
        this.report_searchdata.PKID = this.pkid;
        this.report_searchdata.INV_TYPE = this.mbl_type;
        this.report_searchdata.INV_ARAP = this.inv_arap;
        this.report_searchdata.BRANCH_REGION = this.gs.BRANCH_REGION;
        this.report_searchdata.FILE_PATH = sPath;
        this.report_menuid = this.menuid;
        this.tab = 'report';
        break;
      }

    }
  }

  callbackevent(event: any) {
    this.tab = 'main';
  }

  Close() {
    this.location.back();
  }

}
