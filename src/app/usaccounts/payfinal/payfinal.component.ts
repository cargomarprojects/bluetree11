import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../shared/input/inputbox.component';

import { PaymentService } from '../services/payment.service';
import { User_Menu } from '../../core/models/menum';
import { Tbl_Acc_Payment, vm_tbl_accPayment, AccPaymentModel } from '../models/Tbl_Acc_Payment';
import { SearchTable } from '../../shared/models/searchtable';
import { Tbl_cargo_invoicem } from '../models/Tbl_cargo_Invoicem';


@Component({
    selector: 'app-pay-final',
    templateUrl: './payfinal.component.html'
})
export class PayFinalComponent implements OnInit {

    bSave = true;


    // @ViewChild('content') contentRef: ElementRef;


    private payrecord: any;
    @Input() set mpayrecrod(value: any) {
        this.payrecord = value;
        if (value != null) {
            this.initdata();
            this.Process();
        }
    }

    canSave = true;

    @Output() callbackevent = new EventEmitter<any>();

    record: Tbl_Acc_Payment = <Tbl_Acc_Payment>{};

    ParentRec: Tbl_Acc_Payment;

    tab: string = 'main';

    pkid: string;
    menuid: string;
    mode: string = '';
    errorMessage: string;
    Foregroundcolor: string;



    title: string;
    IsAdmin: boolean;
    refno: string = "";

    decplace = 0;


    showchqdt = true;
    sdate = "";

    where = " ACC_IS_PAYMENT_CODE = 'Y' AND ACC_BRANCH IN ('ALL','" + this.gs.branch_code + "')";


    arPendingList: Tbl_Acc_Payment[] = [];

    DetailList: Tbl_cargo_invoicem[] = [];


    TOT_AR = 0;
    TOT_AP = 0;
    TOT_DIFF = 0;
    TOT_AR_BASE = 0;
    TOT_AP_BASE = 0;
    TOT_DIFF_BASE = 0;
    FCURR_CODE = "";
    IsMultiCurrency = "N";
    IS_PAYROLL_RECORD = "N";
    Customer_ID = "";
    Customer_Name = "";
    Customer_Type = "";
    IsPayment = "N";

    nUSD = 0;
    nBankUSD = 0;
    nBank = 0;
    nCharges = 0;
    nParty = 0;
    nExRate = 0;
    nExDiff_Dr = 0;
    nExDiff_Cr = 0;

    nDr = 0;
    nCr = 0;
    nBal = 0;

    Txt_CfNo = "";
    Txt_Bank_Id = '';
    Txt_Bank_Code = '';
    Txt_Bank_Name = '';
    Txt_Address1 = '';
    Txt_Address2 = '';
    Txt_Address3 = '';
    Txt_Address4 = '';
    paymode = 'CHECK';
    Txt_Next_ChqNo = '';
    Txt_ChqNo = '';
    Dt_ChqDt = '';
    Txt_Chq_Bank = '';
    Txt_Memo = '';

    LBL_AMT = 'Amount';
    LBL_BASE_CURR_AMT = 'Base Currency Amt';
    LBL_BANK_PAID = 'Bank';
    LBL_BANK_CHARGES = 'Charges';


    TXT_AMT = 0;
    Txt_Amt_Base = 0;
    Txt_Currency = '';
    Txt_ExRate = 0;
    TxT_Bank_Paid = 0;
    Txt_Bank_Charges = 0;
    LBL_BANK_DR = 0;
    LBL_BANK_CR = 0;
    LBL_CHARGES_DR = 0;
    LBL_CHARGES_CR = 0;
    LBL_PARTY_DR = 0;
    LBL_PARTY_CR = 0;
    LBL_EX_DIFF_DR = 0;
    LBL_EX_DIFF_CR = 0;
    LBL_TOTAL_DR = 0;
    LBL_TOTAL_CR = 0;


    paymode_enabled = true;
    chqno_enabled = true;
    next_chqno_enabled = true;

    chqdt_enabled = false;
    chq_bank_enabled = false;

    memo_enabled = true;

    
    amt_enabled = true;
    amt_base_enabled = true;
    currency_enabled = true;
    exrate_enabled = true;
    bank_paid_enabled = true;
    bank_charges_enabled = true;


    posting_enabled = true;

    is_bank_Changed = true;
    is_exrate_Changed = true;


    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainService: PaymentService,
        private modalService: NgbModal        
    ) {
        this.decplace = this.gs.foreign_amt_dec;
        this.sdate = this.gs.defaultValues.today;
    }

    ngOnInit() {
        const options = JSON.parse(this.route.snapshot.queryParams.parameter);

        this.menuid = options.menuid;
        this.pkid = options.pkid;
        this.mode = options.mode;

        this.setup();

        this.initPage();
        this.actionHandler();
    }

    initdata() {
        this.TOT_AR = this.payrecord.TOT_AR;
        this.TOT_AP = this.payrecord.TOT_AP;
        this.TOT_DIFF = this.payrecord.TOT_DIFF;
        this.TOT_AR_BASE = this.payrecord.TOT_AR_BASE;
        this.TOT_AP_BASE = this.payrecord.TOT_AP_BASE;
        this.TOT_DIFF_BASE = this.payrecord.TOT_DIFF_BASE;
        this.FCURR_CODE = this.payrecord.FCURR_CODE;
        this.IsMultiCurrency = this.payrecord.IsMultiCurrency;
        this.IS_PAYROLL_RECORD = this.payrecord.IS_PAYROLL_RECORD;
        this.IsAdmin = this.payrecord.IsAdmin;
        this.Customer_ID = this.payrecord.Customer_ID;
        this.Customer_Name = this.payrecord.Customer_Name;
        this.Customer_Type = this.payrecord.Customer_Type;
        this.DetailList = this.payrecord.DetailList;
    }

    setup() {

        if (this.gs.SHOW_CHECK_DATE == "N") {
            this.showchqdt = false;
        }
    }


    private initPage() {
        //this.title = this.gs.getTitle(this.menuid);
        this.title = 'Payment';

        this.errorMessage = '';
        this.LoadCombo();
    }

    LoadCombo() {

    }

    NewRecord() {
        this.mode = 'ADD'
        this.actionHandler();
    }

    actionHandler() {
        this.errorMessage = '';

        if (this.mode == 'ADD') {
            this.record = <Tbl_Acc_Payment>{};
            this.pkid = this.gs.getGuid();
            this.init();
        }
    }

    init() {

        this.record.pay_pkid = this.pkid;
        this.record.pay_vrno = '';

        this.record.rec_created_by = this.gs.user_code;
        this.record.rec_created_date = this.gs.defaultValues.today;
    }



    Process() {

        this.IsPayment = "Y";
        //Txt_ChqNo.IsEnabled = true;
        this.chqno_enabled = true;


        if (this.TOT_DIFF >= 0) {
            this.memo_enabled = false;
        }

        if (this.TOT_DIFF == 0) {
            this.paymode_enabled = false;
            this.chqno_enabled = false;
            this.next_chqno_enabled = false;
            this.chqdt_enabled = false;
            this.chq_bank_enabled = false;
        }

        if (this.TOT_DIFF >= 0)
            this.IsPayment = "N";

        this.sdate = this.gs.defaultValues.today;


        this.TXT_AMT = Math.abs(this.TOT_DIFF);
        this.Txt_Amt_Base = Math.abs(this.TOT_DIFF_BASE);
        this.Txt_ExRate = 1;

        if (this.TOT_DIFF != 0)
            this.TxT_Bank_Paid = this.Txt_Amt_Base;



        this.FindTotal("BANK");

        /*
        if ( this.IsPayment == "N")
            Chk_Signature.Visibility = System.Windows.Visibility.Collapsed;
        */

        if (this.IsMultiCurrency == "N") {

            this.amt_base_enabled = false;
            this.exrate_enabled = false;
            this.currency_enabled = false;

            if (this.gs.IS_SINGLE_CURRENCY == false && this.FCURR_CODE != "") {
                this.bank_charges_enabled = false;
            }
            if (this.gs.IS_SINGLE_CURRENCY == true || this.TOT_DIFF == 0) {
                this.bank_paid_enabled = false;
                this.bank_charges_enabled = false;
                this.posting_enabled = false;
            }
        }
        else {
            this.amt_base_enabled = true;
            this.exrate_enabled = true;
            this.bank_paid_enabled = true;
            this.bank_charges_enabled = true;
            this.currency_enabled = true;
            this.posting_enabled = true;
        }

        if (this.IsMultiCurrency == "N") {
            this.LBL_AMT = "Amount(" + this.gs.base_cur_code + ")";
            this.Txt_Currency = this.gs.base_cur_code;
        }
        else {
            this.LBL_AMT = "Amount(" + this.FCURR_CODE + ")";
            this.Txt_Currency = this.FCURR_CODE;

            if (this.IsPayment == "N") {
                this.LBL_BANK_PAID = this.gs.base_cur_code + "Amt Received";
            }
            else {
                this.LBL_BANK_PAID = this.gs.base_cur_code + "Amt Paid";
            }
            this.LBL_BANK_CHARGES = "Charges In " + this.gs.base_cur_code + "";
        }

        this.LBL_BASE_CURR_AMT = "Amount In " + this.gs.base_cur_code + "";


    }

    SaveParent() {


    }




    Save() {

        let PrintChq = "";
        let print_signature = "";
        let PrintCash = "";

        let pay_rp = "";



        this.pkid = this.gs.getGuid();

        this.ParentRec = <Tbl_Acc_Payment>{};

        this.ParentRec.pay_pkid = this.pkid;
        this.ParentRec.pay_cust_id = this.Customer_ID;

        this.ParentRec.pay_cust_name = this.Customer_Name;

        this.ParentRec.pay_is_payroll = this.IS_PAYROLL_RECORD;

        this.ParentRec.pay_acc_id = this.Txt_Bank_Id;
        this.ParentRec.pay_date = this.sdate;
        this.ParentRec.pay_cust_type = this.Customer_Type;
        this.ParentRec.pay_narration = "";
        this.ParentRec.pay_type = "PAYMENT";
        this.ParentRec.pay_year = +this.gs.year_code;
        this.ParentRec.pay_basecurr = this.gs.base_cur_code;
        if (this.IsMultiCurrency == "N")
            this.ParentRec.pay_isbasecurr = "Y";
        else
            this.ParentRec.pay_isbasecurr = "N";

        this.ParentRec.pay_currency_code = this.Txt_Currency;

        if (this.IsMultiCurrency == "N") {
            this.ParentRec.pay_ar_total_FC = 0;
            this.ParentRec.pay_ap_total_FC = 0;
            this.ParentRec.pay_total_FC = 0;
            this.ParentRec.pay_diff_FC = 0;

            this.ParentRec.pay_total = 0;
            this.ParentRec.pay_ar_total = this.TOT_AR;
            this.ParentRec.pay_ap_total = this.TOT_AP;
            this.ParentRec.pay_diff = this.TOT_DIFF;
            if (this.ParentRec.pay_ar_total > this.ParentRec.pay_ap_total)
                this.ParentRec.pay_total = this.ParentRec.pay_ar_total;
            else if (this.ParentRec.pay_ap_total > this.ParentRec.pay_ar_total)
                this.ParentRec.pay_total = this.ParentRec.pay_ap_total;

            this.ParentRec.pay_bank_amt = this.TxT_Bank_Paid;
            this.ParentRec.pay_bank_charges = this.Txt_Bank_Charges;
            this.ParentRec.pay_exrate = 1;
            this.ParentRec.pay_exchange_diff_dr = 0;
            this.ParentRec.pay_exchange_diff_cr = 0;

        }
        else {

            this.ParentRec.pay_total_FC = 0;
            this.ParentRec.pay_ar_total_FC = this.TOT_AR;
            this.ParentRec.pay_ap_total_FC = this.TOT_AP;
            this.ParentRec.pay_diff_FC = this.TOT_DIFF;
            if (this.ParentRec.pay_ar_total_FC > this.ParentRec.pay_ap_total_FC)
                this.ParentRec.pay_total_FC = this.ParentRec.pay_ar_total_FC;
            else if (this.ParentRec.pay_ap_total_FC > this.ParentRec.pay_ar_total_FC)
                this.ParentRec.pay_total_FC = this.ParentRec.pay_ap_total_FC;


            this.ParentRec.pay_total = 0;
            this.ParentRec.pay_ar_total = this.TOT_AR_BASE;
            this.ParentRec.pay_ap_total = this.TOT_AP_BASE;
            this.ParentRec.pay_diff = this.TOT_DIFF_BASE;
            if (this.ParentRec.pay_ar_total > this.ParentRec.pay_ap_total)
                this.ParentRec.pay_total = this.ParentRec.pay_ar_total;
            else if (this.ParentRec.pay_ap_total > this.ParentRec.pay_ar_total)
                this.ParentRec.pay_total = this.ParentRec.pay_ap_total;

            this.ParentRec.pay_bank_amt = this.TxT_Bank_Paid;

            this.ParentRec.pay_bank_charges = this.Txt_Bank_Charges;
            this.ParentRec.pay_exrate = this.Txt_ExRate;
            this.ParentRec.pay_exchange_diff_dr = this.LBL_EX_DIFF_DR;
            this.ParentRec.pay_exchange_diff_cr = this.LBL_EX_DIFF_CR;
        }

        //ParentRec.pay_charges_acc_id = "B7767170-50B9-4B56-9769-ED0042BCE992";
        //ParentRec.pay_exdiff_acc_id = "B484585E-C43A-43FD-A71F-C33643299B29";

        this.ParentRec.pay_charges_acc_id = this.gs.SETTINGS_AC_BANK_CHARGES_ID;
        this.ParentRec.pay_exdiff_acc_id = this.gs.SETTINGS_AC_EX_DIFF_ID;


        this.ParentRec.pay_mode = this.paymode;
        /*
        if (Chk_Signature.IsChecked == true)
            this.ParentRec.pay_signature = "Y";
        else
            this.ParentRec.pay_signature = "N";
        */

        this.ParentRec.pay_signature = "N";

        if (this.TOT_DIFF == 0) {
            this.ParentRec.pay_mode = "OFFSET/CONTRA";
        }


        if (this.IsPayment == "Y") {
            this.ParentRec.pay_chq_ctr = 0;
            this.ParentRec.pay_chqno = this.Txt_ChqNo;
        }
        else {
            this.ParentRec.pay_chq_ctr = 0;
            this.ParentRec.pay_chqno = this.Txt_ChqNo;
        }

        if (this.gs.isBlank(this.Dt_ChqDt))
            this.ParentRec.pay_chq_date = null;
        else
            this.ParentRec.pay_chq_date = this.Dt_ChqDt;

        this.ParentRec.pay_chq_bank = this.Txt_Chq_Bank;

        /*
        if (Dt_Chq_Date.SelectedDate != null)
            ParentRec.pay_chq_date = Dt_Chq_Date.SelectedDate.Value;
        */
        this.ParentRec.pay_status = "NOT POSTED";
        this.ParentRec.pay_posted = "N";
        this.ParentRec.pay_memo = this.Txt_Memo;
        if (this.ParentRec.pay_diff <= 0) {
            this.ParentRec.pay_status = "POSTED";
            this.ParentRec.pay_posted = "Y";
        }

        let Jv_Narration = "";
        Jv_Narration = "";
        if (this.ParentRec.pay_diff > 0) {
            Jv_Narration = "RECVD " + this.ParentRec.pay_bank_amt + " FROM " + this.ParentRec.pay_cust_name;
            pay_rp = 'RECEIPT';
        }
        else if (this.ParentRec.pay_diff < 0) {
            Jv_Narration = "PAID " + this.ParentRec.pay_bank_amt + " TO " + this.ParentRec.pay_cust_name;
            pay_rp = 'PAYMENT';
        }
        else
            Jv_Narration = "ADJUSTMENT ( " + this.ParentRec.pay_cust_name + " )";
        Jv_Narration += this.ParentRec.pay_date != null ? " DATED: " + this.ParentRec.pay_date : "";
        if (this.ParentRec.pay_chqno != null)
            Jv_Narration += !this.gs.isBlank(this.ParentRec.pay_chqno) ? ", " + this.ParentRec.pay_mode + " / " + this.ParentRec.pay_chqno : "";
        Jv_Narration = Jv_Narration.trim();
        if (Jv_Narration.length > 250)
            Jv_Narration = Jv_Narration.substring(0, 250);
        this.ParentRec.pay_narration = Jv_Narration;


        this.mode = "ADD";

        const saveRecord = <vm_tbl_accPayment>{};
        saveRecord.record = this.ParentRec;
        saveRecord.invoiceList = this.DetailList;
        saveRecord.pkid = this.pkid;
        saveRecord.mode = this.mode;
        saveRecord.userinfo = this.gs.UserInfo;

        this.mainService.Save(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.errorMessage = response.error;
                    alert(this.errorMessage);
                }
                else {

                    this.canSave = false;

                    this.Txt_CfNo = response.DOCNO;

                    if (this.TOT_DIFF == 0)
                        this.IsPayment = "N";

                    PrintChq = "N"; PrintCash = "N";
                    if (this.paymode == "CHECK") {
                        if (this.IsPayment == "Y")
                            PrintChq = "Y";
                    }
                    else if (this.paymode == "CASH") {
                        PrintCash = "Y";
                    }

                    /* 
                     if (Chk_Signature.IsChecked == true)
                         print_signature = "Y";
                     else
                         print_signature = "N";
                     */

                    print_signature = "N";

                    if (this.gs.BRANCH_REGION == "USA") {
                        if (this.callbackevent != null) {
                            let data = {
                                action : 'PRINTCHECK',
                                printchq: PrintChq,
                                pkid: this.pkid,
                                bankid: this.Txt_Bank_Id,
                                printsignature: print_signature,
                                printcash: 'N',
                                payrp : pay_rp
                            }
                            this.callbackevent.emit(data);
                        }
                    }
                    else {

                        if (this.callbackevent != null) {
                            let data = {
                                action : 'PRINTCHECK',
                                printchq: PrintChq,
                                pkid: this.pkid,
                                bankid: this.Txt_Bank_Id,
                                printsignature: print_signature,
                                printcash: PrintCash,
                                payrp : pay_rp
                            }
                            this.callbackevent.emit(data);
                        }
                    }
                    this.errorMessage = 'Save Complete';
                    alert(this.errorMessage);
                }

            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);
            });
    }


    private AllValid(): boolean {

        var bRet = true;
        this.errorMessage = "";

        if (this.gs.isBlank(this.sdate)) {
            alert("Date Cannot blank");
            return false;
        }

        if (this.gs.isBlank(this.Txt_Bank_Id) || this.gs.isBlank(this.Txt_Bank_Code)) {
            alert("Invalid Bank");
            return false;
        }


        if (this.TOT_DIFF != 0) {
            if (this.gs.isZero(this.TxT_Bank_Paid)) {
                alert("Invalid Paid Amount");
                return false;
            }
            if (this.IsMultiCurrency == "Y") {
                if (this.nDr != this.nCr) {
                    alert("Total Debit and Credit does not match");
                    return false;
                }
            }
        }

        if (this.IsPayment == "Y") {
            if (this.paymode == "CHECK") {
                if (this.gs.isBlank(this.Txt_ChqNo)) {
                    alert("INVALID CHECK NO ");
                    return false;
                }
            }
        }

        if (!this.gs.isZero(this.Txt_Bank_Charges)) {
            if (this.gs.isBlank(this.gs.SETTINGS_AC_BANK_CHARGES_ID)) {
                alert("Bank Charges A/c code not found");
                return false;
            }
        }

        if (this.IsMultiCurrency == "Y") {
            if (this.LBL_EX_DIFF_DR != 0 || this.LBL_EX_DIFF_CR != 0) {
                if (this.gs.isBlank(this.gs.SETTINGS_AC_EX_DIFF_ID)) {
                    alert("Exchange Difference A/c code not found");
                    return false;
                }
            }
        }

        if (this.gs.IS_SINGLE_CURRENCY == false && this.TOT_DIFF != 0) {
            if (this.IsMultiCurrency == "N" && this.FCURR_CODE != "") {
                if (this.IsPayment == "Y") {
                    if (this.TxT_Bank_Paid < this.TXT_AMT) {
                        alert("paid amount should not be below due amount");
                        return false;
                    }
                }
                if (this.IsPayment == "N") {
                    if (this.TxT_Bank_Paid > this.TXT_AMT) {
                        alert("paid amount should not be above due amount");
                        return false;
                    }
                }
            }
        }

        /*
        if (MessageBox.Show("Save Payment", "Save", MessageBoxButton.OKCancel) == MessageBoxResult.Cancel)
            return false;
        */
        this.Save();

        return bRet;

    }

    Close() {
        if (this.callbackevent)
            this.callbackevent.emit({ action: 'CLOSE'});
    }



    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "ACCTM") {
            this.Txt_Bank_Id = _Record.id;
            this.Txt_Bank_Code = _Record.code;
            this.Txt_Bank_Name = _Record.name;
            this.Txt_Address1 = _Record.col3;
            this.Txt_Address2 = _Record.col4;
            this.Txt_Address3 = _Record.col5;
            this.Txt_Address4 = _Record.col6;
        }
    }


    OnChange(field: string) {
    }

    onFocusout(field: string) {
    }

    onBlur(field: string) {
        //FindTotal("EXRATE");
        //FindTotal("BANKUSD");
        if ( field == 'TxT_Bank_Paid')
            this.FindTotal('BANK');
        if ( field == 'Txt_Bank_Charges')
            this.FindTotal("CHARGES");
    }

    onBlur2(cb: any) {
        /*
        if (field === 'group_name')
            this.record.acc_group_name = this.record.acc_group_name.toUpperCase();
        */
    }

    FindTotal(sType = "") {
        if (this.IsMultiCurrency == "N" && this.FCURR_CODE == "")
            return;

        this.LBL_BANK_DR = null;
        this.LBL_BANK_CR = null;
        this.LBL_CHARGES_DR = null;
        this.LBL_CHARGES_CR = null;
        this.LBL_PARTY_DR = null;
        this.LBL_PARTY_CR = null;
        this.LBL_EX_DIFF_DR = null;
        this.LBL_EX_DIFF_CR = null;
        this.LBL_TOTAL_DR = null;
        this.LBL_TOTAL_CR = null;


        if (this.TOT_DIFF == 0) {

            this.nExDiff_Dr = 0;
            this.nExDiff_Cr = 0;
            if (this.TOT_DIFF_BASE > 0) {
                this.nExDiff_Dr = this.TOT_DIFF_BASE;
                this.LBL_EX_DIFF_DR = this.nExDiff_Dr;
            }
            else if (this.TOT_DIFF_BASE < 0) {
                this.nExDiff_Cr = Math.abs(this.TOT_DIFF_BASE);
                this.LBL_EX_DIFF_CR = this.nExDiff_Cr;
            }
            return;
        }

        if (sType == "EXRATE") {
            if (this.is_exrate_Changed) {
                this.nExRate = this.Txt_ExRate;
                this.nBankUSD = this.TXT_AMT;
                this.nBank = this.TxT_Bank_Paid;

                this.nBank = this.nBankUSD * this.nExRate;
                this.nBank = this.gs.roundNumber(this.nBank, 2);
                this.TxT_Bank_Paid = this.nBank;
            }
        }
        if (sType == "BANK") {
            if (this.is_bank_Changed) {

                this.nExRate = this.Txt_ExRate;
                this.nBankUSD = this.TXT_AMT;
                this.nBank = this.TxT_Bank_Paid;

                if (this.nBankUSD == 0)
                    this.nBankUSD = 1;
                this.nExRate = this.nBank / this.nBankUSD;
                this.nExRate = this.gs.roundNumber(this.nExRate, 5);
                this.Txt_ExRate = this.nExRate;
            }
        }


        if (this.IsMultiCurrency == "N" && this.FCURR_CODE != "") {
            this.nUSD = this.TXT_AMT;
            this.nBank = this.TxT_Bank_Paid;
            if (this.IsPayment == "Y")
                this.nCharges = this.nBank - this.nUSD;
            else
                this.nCharges = this.nUSD - this.nBank;
            this.Txt_Bank_Charges = this.nCharges;
        }


        this.nUSD = this.TXT_AMT;
        this.nBankUSD = this.TXT_AMT;
        this.nBank = this.TxT_Bank_Paid;
        this.nCharges = this.Txt_Bank_Charges;
        this.nParty = this.Txt_Amt_Base;


        if (this.IsPayment == "N") {

            this.nBal = (this.nBank + this.nCharges) - this.nParty;

            this.nExDiff_Dr = 0;
            this.nExDiff_Cr = 0;

            if (this.nBal < 0)
                this.nExDiff_Dr = Math.abs(this.nBal);
            if (this.nBal > 0)
                this.nExDiff_Cr = this.nBal;

            this.nDr = this.nBank + this.nCharges + this.nExDiff_Dr;
            this.nCr = this.nParty + this.nExDiff_Cr;
            this.nBal = this.nDr - this.nCr;

            if (this.nBank != 0)
                this.LBL_BANK_DR = this.nBank;
            if (this.nCharges != 0)
                this.LBL_CHARGES_DR = this.nCharges;
            if (this.nParty != 0)
                this.LBL_PARTY_CR = this.nParty;
            if (this.nExDiff_Dr != 0)
                this.LBL_EX_DIFF_DR = this.nExDiff_Dr;
            if (this.nExDiff_Cr != 0)
                this.LBL_EX_DIFF_CR = this.nExDiff_Cr;

            if (this.nDr != 0)
                this.LBL_TOTAL_DR = this.nDr;
            if (this.nCr != 0)
                this.LBL_TOTAL_CR = this.nCr;
        }
        else {

            this.nExDiff_Dr = 0;
            this.nExDiff_Cr = 0;

            this.nBal = (this.nBank - this.nCharges) - this.nParty;
            if (this.nBal < 0)
                this.nExDiff_Cr = Math.abs(this.nBal);
            if (this.nBal > 0)
                this.nExDiff_Dr = this.nBal;

            this.nDr = this.nBank + this.nExDiff_Cr;
            this.nCr = this.nParty + this.nCharges + this.nExDiff_Dr;
            this.nBal = this.nDr - this.nCr;

            if (this.nBank != 0)
                this.LBL_BANK_CR = this.nBank;
            if (this.nCharges != 0)
                this.LBL_CHARGES_DR = this.nCharges;
            if (this.nParty != 0)
                this.LBL_PARTY_DR = this.nParty;
            if (this.nExDiff_Dr != 0)
                this.LBL_EX_DIFF_DR = this.nExDiff_Dr;
            if (this.nExDiff_Cr != 0)
                this.LBL_EX_DIFF_CR = this.nExDiff_Cr;

            if (this.nDr != 0)
                this.LBL_TOTAL_DR = this.nDr;
            if (this.nCr != 0)
                this.LBL_TOTAL_CR = this.nCr;

        }

        this.nExDiff_Dr = this.gs.roundNumber(this.nExDiff_Dr, 5);
        this.nExDiff_Cr = this.gs.roundNumber(this.nExDiff_Cr, 5);

    }


    LoadNextChqNo() {
        let sType = "";
        if (this.TOT_DIFF > 0)
            sType = "RECEIPT";
        else if (this.TOT_DIFF < 0)
            sType = "PAYMENT";
        else
            return;


        if (this.gs.isBlank(this.paymode)) {
            alert("Pay mode Has to be selected");
            return;
        }

        if (this.gs.isBlank(this.Txt_Bank_Id)) {
            alert("bank Has to be selected");
            return;
        }

        let sMode = this.paymode;
        if (sMode == "CHECK") {
            if (this.gs.isBlank(this.Txt_Bank_Id) || this.gs.isBlank(this.Txt_Bank_Code)) {
                alert("Bank Has to be enterd");
                return;
            }
        }

        if (sMode == "CHECK" && sType == "RECEIPT")
            return;


        var searchData = this.gs.UserInfo;

        searchData = {
            ...searchData,
            "DOCTYPE": sMode,
            "TRANSTYPE": sType,
            "DATE": this.sdate,
            "pkid": this.Txt_Bank_Id,
            "REC_COMPANY_CODE": this.gs.company_code,
            "REC_BRANCH_CODE": this.gs.branch_code
        }

        this.mainService.GetNextChqNo(searchData).subscribe(
            res => {
                let iNo = res.chqno;
                this.Txt_Next_ChqNo = iNo;
                this.SetNextChqNo();

            },
            err => {
                this.errorMessage = this.gs.getError(err);
                alert(this.errorMessage);
            }
        )
    }

    SetNextChqNo() {

        let nChq = 0;
        let sPrefix = "";

        //if (Cmb_Mode.SelectedItem.ToString() == "NA" || Cmb_Mode.SelectedItem.ToString() == "CHECK")
        //  return;

        if (this.paymode == "NA")
            return;

        if (this.paymode == "CHECK") {
            this.Txt_ChqNo = (+this.Txt_Next_ChqNo + 1).toString();
            return;
        }

        if (this.TOT_DIFF > 0)
            sPrefix = "R";

        if (this.paymode == "WIRE TRANSFER")
            sPrefix += "TT";
        if (this.paymode == "CASH")
            sPrefix += "CH";
        if (this.paymode == "ONLINE/ACH PAYMENT")
            sPrefix += "OP";
        if (this.paymode == "CREDIT CARD")
            sPrefix += "CC";
        if (this.paymode == "OTHERS")
            sPrefix += "OT";

        var yymmdd = this.sdate.replace("-", "");
        yymmdd = yymmdd.substring(2, 6);

        if (this.gs.isBlank(this.Txt_Next_ChqNo) || this.gs.isZero(this.Txt_Next_ChqNo))
            this.Txt_ChqNo = sPrefix + yymmdd;
        else {
            var chqno = this.Txt_Next_ChqNo;
            var sChar = chqno.charAt(chqno.length - 1);
            var sCharCode = chqno.charCodeAt(chqno.length - 1) + 1;
            if (sChar >= '0' && sChar <= '9')
                this.record.pay_chqno = sPrefix + yymmdd + "A"; // Dt_Date.SelectedDate.Value.ToString("yyMMdd") + "A";
            else {
                //sChar++;
                //Txt_ChqNo.Text = sPrefix + Dt_Date.SelectedDate.Value.ToString("yyMMdd") + sChar.ToString();
                sChar = String.fromCharCode(sCharCode);
                this.record.pay_chqno = sPrefix + yymmdd + sChar;
            }
        }

    }
      


}
