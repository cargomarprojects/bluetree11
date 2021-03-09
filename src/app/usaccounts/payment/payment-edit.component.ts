import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
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
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-payment-edit',
    templateUrl: './payment-edit.component.html'
})
export class PaymentEditComponent implements OnInit {

    record: Tbl_cargo_invoicem = <Tbl_cargo_invoicem>{};
    pendingList: Tbl_cargo_invoicem[] = [];
    DetailList: Tbl_cargo_invoicem[] = [];

    Old_List: Tbl_cargo_invoicem[] = [];
    InvoiceList: Tbl_cargo_invoicem[] = [];

    modal: any;
    tab: string = 'main';

    mPayRecord = {};

    pkid: string;
    menuid: string;
    public mode: string = '';
    errorMessage: string;
    Foregroundcolor: string;

    title: string;
    isAdmin: boolean;

    IsRefresh = "";

    IsMultiCurrency = "N";

    txt_Bal_AR = 0;
    txt_Bal_AP = 0;
    txt_Bal_diff = 0;

    txt_tot_AR = 0;
    txt_tot_AP = 0;
    txt_tot_diff = 0;

    txt_diff = 0;

    LBL_COUNT = 0;
    LBL_STATUS = '';

    Pay_RP = "";

    decplace = 0;

    group = 'customer';
    cust_id = "";
    cust_code = "";
    cust_name = "";
    refno = '';
    invno = '';
    custrefno = '';
    curr_code = '';
    str_id = "";
    Search_Mode = "";
    showall: boolean = false;

    Customer_ID = '';

    report_url: string;
    report_searchdata: any = {};
    report_menuid: string;

    where = " ";


    constructor(
        private modalconfig: NgbModalConfig,
        private modalservice: NgbModal,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainService: PaymentService,
    ) {
        this.decplace = this.gs.foreign_amt_dec;
        modalconfig.backdrop = 'static'; //true/false/static
        modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
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

    setup() {
        if (!this.gs.IS_SINGLE_CURRENCY)
            this.curr_code = this.gs.base_cur_code;
    }


    private initPage() {
        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
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

            this.record = <Tbl_cargo_invoicem>{};
            this.pendingList = <Tbl_cargo_invoicem[]>[];

            this.pkid = this.gs.getGuid();
            this.init();
        }
    }

    init() {


        this.Pay_RP = "";

        this.txt_Bal_AP = 0;
        this.txt_Bal_AR = 0;
        this.txt_Bal_diff = 0;

        this.txt_tot_AP = 0;
        this.txt_tot_AR = 0;
        this.txt_tot_diff = 0;

        this.txt_diff = 0;

        this.LBL_COUNT = 0;
        this.LBL_STATUS = '';

        //this.record.rec_created_by = this.gs.user_code;
        //this.record.rec_created_date = this.gs.defaultValues.today;
    }

    RefreshList() {
        this.IsRefresh = "YES";
        this.Old_List = this.pendingList.filter(rec => rec.inv_flag === 'Y' && rec.inv_pay_amt > 0);
        this.FindInvoice();
    }

    FindInvoice() {
        if (this.gs.IS_SINGLE_CURRENCY == false) {
            if (this.curr_code.length <= 0) {
                alert("Currency Code Has to be entered");
                return;
            }
        }

        var SearchData = this.gs.UserInfo;

        SearchData.pkid = this.pkid;
        if (this.cust_id != '') {
            this.Customer_ID = this.cust_id;
            this.str_id = this.cust_id;
            this.Search_Mode = "CUSTOMER";
            //this.Search_Mode = "GROUP";
        }
        else if (this.refno != '') {
            this.str_id = this.refno;
            this.Search_Mode = "MASTER";
        }
        else if (this.invno != '') {
            this.str_id = this.invno;
            this.Search_Mode = "INVNO";
        }
        else if (this.custrefno != '') {
            this.str_id = this.custrefno;
            this.Search_Mode = "REFNO";
        }
        if (this.Search_Mode == "") {
            alert("Search Data Not Found");
            return;
        }
        SearchData.PKID = this.str_id;
        SearchData.MODE = this.Search_Mode;
        SearchData.SHOWALL = (this.showall) ? "Y" : "N";
        if (this.gs.IS_SINGLE_CURRENCY == true) {
            SearchData.CURRENCY = "";
            SearchData.ISBASECURRENCY = "Y";
        }
        else {
            SearchData.CURRENCY = this.curr_code;
            if (this.curr_code == this.gs.base_cur_code)
                SearchData.ISBASECURRENCY = "Y";
            else
                SearchData.ISBASECURRENCY = "N";
        }
        SearchData.HIDE_PAYROLL = this.gs.user_hide_payroll;

        this.mainService.PendingList(SearchData).subscribe(
            res => {

                if (this.Search_Mode == "INVNO" || this.Search_Mode == "REFNO" || this.Search_Mode == "MASTER") {
                    if (res.partyname != '')
                        this.cust_name = res.partyname;
                }
                this.pendingList = res.list;

                if (this.IsRefresh == "YES")
                    this.ReProcessInvoiceList();

                this.IsRefresh = "";

                this.FindPartyBalance();

                this.FindTotal();

            },
            err => {
                this.errorMessage = this.gs.getError(err);
                alert(this.errorMessage);
            });
    }

    FindPartyBalance() {
        let nAR = 0;
        let nAP = 0;
        let nDiff = 0;
        nAR = 0;
        nAP = 0;
        nDiff = 0;
        this.pendingList.forEach(mRec => {
            nAR += mRec.inv_ar_total;
            nAP += mRec.inv_ap_total;
            nAR = this.gs.roundNumber(nAR, 2);
            nAP = this.gs.roundNumber(nAP, 2);
        });
        nDiff = nAR - nAP;
        nDiff = this.gs.roundNumber(nDiff, 2);
        this.txt_Bal_AR = nAR;
        this.txt_Bal_AP = nAP;
        this.txt_Bal_diff = nDiff;
        this.txt_diff = nDiff;
    }


    ReProcessInvoiceList() {
        let iCount = 0;
        this.Old_List.forEach(mRec => {
            this.pendingList.forEach(dRec => {
                if (mRec.inv_pkid == dRec.inv_pkid) {
                    dRec.inv_flag = mRec.inv_flag;
                    dRec.inv_flag2 = mRec.inv_flag2;
                    dRec.inv_pay_amt = mRec.inv_pay_amt;
                    iCount++;
                }
            });
        });
        this.LBL_COUNT = iCount;
    }


    ProcessData() {
    }

    SaveParent() {

    }


    Save(paymentModalContent) {
        this.FindTotal();
        this.Allvalid();
        this.modal = this.modalservice.open(paymentModalContent, { centered: true });
    }

    Allvalid() {
        let bRet = true;
        let iCtr = 0;
        let sErrMsg = "";

        let IS_PAYROLL_RECORD = "N";

        //if (Lib.ValidFinYear_IsLocked(GLOBALCONTANTS.year_code))
        //{
        //    MessageBox.Show("Financail Year Closed, No Changes Allowed", "Save", MessageBoxButton.OK);
        //    return false;
        //}

        sErrMsg = "";
        iCtr = 0;

        this.pendingList.forEach(Record => {
            if (Record.inv_flag == "Y") {
                iCtr++;
                if (Record.inv_pay_amt < 0) {
                    sErrMsg = "Invalid Amount " + Record.inv_pay_amt.toString();
                    //break;
                }

                if (this.gs.IS_SINGLE_CURRENCY == false) {
                    if (this.cust_code != this.gs.base_cur_code) {
                        if (Record.inv_pay_amt > Record.inv_balance) {
                            sErrMsg = "Amount cannot be above available balance " + Record.inv_pay_amt.toString();
                            //break;
                        }
                    }
                }

            }
        });

        if (iCtr == 0)
            sErrMsg = "No Detail Rows To Save";

        if (sErrMsg.length > 0) {
            alert(sErrMsg);
            return bRet;
        }

        let mID = "";
        let IsSingleCustID = true;
        let Customer_Type = "";

        let nAr = 0;
        let nAp = 0;

        let nAr_Base = 0;
        let nAp_Base = 0;

        let nTotBase = 0;

        let nDiff = 0;
        let nDiff_Base = 0;

        this.DetailList = this.pendingList.filter(Record => Record.inv_flag == "Y" && Record.inv_pay_amt > 0);


        this.DetailList.forEach(Record => {

            Record.inv_curr_code = this.curr_code;
            if (Record.inv_type == "PR")
                IS_PAYROLL_RECORD = "Y";




            // MULTI-CURRENCY CHANGE
            Record.inv_ar_pay_amt_base = 0;
            Record.inv_ap_pay_amt_base = 0;
            if (Record.inv_ar_total > 0) {
                nTotBase = (Record.inv_pay_amt * Record.inv_exrate);
                nTotBase = this.gs.roundNumber(nTotBase, 2);

                Record.inv_ar_pay_amt_base = nTotBase;
                Record.inv_pay_amt_base = nTotBase;
            }
            if (Record.inv_ap_total > 0) {
                nTotBase = Record.inv_pay_amt * Record.inv_exrate;
                nTotBase = this.gs.roundNumber(nTotBase, 2);
                Record.inv_ap_pay_amt_base = nTotBase;
                Record.inv_pay_amt_base = nTotBase;
            }

            if (IsSingleCustID == true) {
                if (mID == "")
                    mID = Record.inv_cust_id;
                else if (mID != Record.inv_cust_id)
                    IsSingleCustID = false;
            }
            if (Record.inv_ar_total > 0) {
                nAr += Record.inv_pay_amt;
                nAr_Base += Record.inv_ar_pay_amt_base;
            }
            else {
                nAp += Record.inv_pay_amt;
                nAp_Base += Record.inv_ap_pay_amt_base;
            }

        });


        Customer_Type = this.Search_Mode;


        if (this.Search_Mode != "CUSTOMER" && this.Search_Mode != "GROUP") {
            if (IsSingleCustID == true) {
                Customer_Type = "CUSTOMER";
                this.Customer_ID = mID;
            }
            else {
                //Customer_ID = "";
                //Customer_Type = "MULTIPLE";
                alert("Settlement with multiple customers not allowed");
                return false;
            }
        }



        nDiff = nAr - nAp;
        nDiff_Base = nAr_Base - nAp_Base;

        if (nAr != this.txt_tot_AR) {
            alert("Mismatch in Total A/R");
            return false;
        }
        if (nAp != this.txt_tot_AP) {
            alert("Mismatch in Total A/P");
            return false;
        }
        if (nDiff != this.txt_tot_diff) {
            alert("Mismatch in Difference Amt");
            return false;
        }

        if (this.Customer_ID == "") {
            alert("Invalid Customer");
            return false;
        }


        if (this.gs.IS_SINGLE_CURRENCY == true)
            this.IsMultiCurrency = "N";
        else {
            if (this.curr_code == this.gs.base_cur_code)
                this.IsMultiCurrency = "N";
            else
                this.IsMultiCurrency = "Y";
        }

        if (nDiff != 0) {
            if (this.IsMultiCurrency == "Y") {
                if (Math.sign(nDiff) != Math.sign(nDiff_Base)) {
                    bRet = false;
                    alert("Mismatch in Foreign Currency And Local Currency due to huge variation in Exchange Rate");
                    return false;
                }
            }
        }

        this.mPayRecord = {
            TOT_AR: nAr,
            TOT_AP: nAp,
            TOT_DIFF: nDiff,
            TOT_AR_BASE: nAr_Base,
            TOT_AP_BASE: nAp_Base,
            TOT_DIFF_BASE: nDiff_Base,
            // for single currency always currency code will be blank.
            // for multi currency if the settlement is in base    currency, currency code will be base    currency code.
            // for multi currency if the settlement is in foreign currency, currency code will be foreign currency code.
            FCURR_CODE: this.curr_code,
            IsMultiCurrency: this.IsMultiCurrency,
            IS_PAYROLL_RECORD: IS_PAYROLL_RECORD,
            DetailList: this.DetailList,
            IsAdmin: this.isAdmin,
            Customer_ID: this.Customer_ID,
            Customer_Name: this.cust_name,
            Customer_Type: Customer_Type,
        };

        //Process();
        //Show();
        
        
        //this.tab = 'payment';


        

        return bRet;
    }


    callbackevent(data: any) {
        if (data.action == 'CLOSE') {
            this.tab = 'main';
            this.CloseModal();
        }
        if (data.action == 'PRINTCHECK') {

            this.ResetGrid();
            this.FindPartyBalance();

            this.CloseModal();

            if (this.gs.BRANCH_REGION == "USA") {
                if (data.printchq == 'Y') {
                    this.report_url = '/api/Payment/PrintCheque';
                    this.report_searchdata = this.gs.UserInfo;
                    this.report_searchdata.PKID = data.pkid;
                    this.report_searchdata.BANKID = data.bankid;
                    this.report_searchdata.PRINT_SIGNATURE = "N";
                    this.report_menuid = this.gs.MENU_ACC_ARAP_SETTLMENT;
                    this.tab = 'chq';
                }
                else {
                    this.tab = 'main';
                }

            } else {
                this.report_url = '/api/Payment/PrintCash';
                this.report_searchdata = this.gs.UserInfo;
                this.report_searchdata.PKID = data.pkid;
                this.report_searchdata.PAY_RP = data.payrp;
                this.report_searchdata.TYPE = "PAYMENT" //this.pay_type;
                if (data.printcash == "Y")
                    this.report_searchdata.REPORT_CAPTION = "CASH " + data.payrp;
                else
                    this.report_searchdata.REPORT_CAPTION = "BANK " + data.payrp;
                this.report_menuid = this.gs.MENU_ACC_ARAP_SETTLMENT;
                this.tab = 'cash';
            }
        }
    }


    ResetGrid() {
        let nAR = 0;
        let nAP = 0;
        let nPayAmt = 0;

        this.pendingList.forEach(Rec => {

            if (Rec.inv_flag == "Y") {
                nPayAmt = Rec.inv_pay_amt;
                if (Rec.inv_ar_total > 0) {
                    nAR = Rec.inv_ar_total;
                    nAR = nAR - nPayAmt;
                    nAR = this.gs.roundNumber(nAR, 2);
                    Rec.inv_balance = Math.abs(nAR);
                    if (nAR == 0)
                        Rec.inv_ar_total = null;
                    else if (nAR > 0)
                        Rec.inv_ar_total = nAR;
                    else {
                        Rec.inv_ar_total = null;
                        Rec.inv_ap_total = Math.abs(nAR);
                    }
                }
                else {
                    nAP = Rec.inv_ap_total;
                    nAP = nAP - nPayAmt;
                    nAP = this.gs.roundNumber(nAP, 2);
                    Rec.inv_balance = Math.abs(nAP);
                    if (nAP == 0)
                        Rec.inv_ap_total = null;
                    else if (nAP > 0)
                        Rec.inv_ap_total = nAP;
                    else {
                        Rec.inv_ap_total = null;
                        Rec.inv_ar_total = Math.abs(nAP);
                    }
                }
                Rec.inv_pay_amt = null;
                Rec.inv_flag = "N";
                Rec.inv_flag2 = false;

            }
        });

        this.txt_tot_AR = 0;
        this.txt_tot_AP = 0;
        this.txt_tot_diff = 0;
        this.LBL_STATUS = '';
    }




    Close() {
        this.location.back();
    }


    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "CUSTOMER") {
            this.cust_id = _Record.id;
            this.cust_code = _Record.code;
            this.cust_name = _Record.name;
        }
        if (_Record.controlname == "CURRENCY") {
            this.curr_code = _Record.code;
        }
    }


    OnChange(field: string) {
    }

    onFocusout(field: string) {
    }

    onBlur(field: string) {
    }

    onBlur2(cb: any) {
    }


    swapSelection(rec: Tbl_cargo_invoicem) {
        rec.inv_flag2 = !rec.inv_flag2;
        rec.inv_flag = (rec.inv_flag2) ? 'Y' : 'N';
        this.FindTotal("CHKBOX", rec);

    }


    FindTotal(sType: string = '', Rec: Tbl_cargo_invoicem = null) {
        var nAR = 0;
        var nAP = 0;
        var nDiff = 0;
        var nPayAmt = 0;

        var iCount = 0;


        if (sType == "CHKBOX") {
            if (Rec != null) {
                if (Rec.inv_ar_total <= 0 && Rec.inv_ap_total <= 0) {
                    Rec.inv_flag = "N";
                    Rec.inv_flag2 = false;
                    return;
                }
                if (Rec.inv_flag == "Y")
                    Rec.inv_pay_amt = Rec.inv_balance;
                else
                    Rec.inv_pay_amt = null;
            }
        }

        if (Rec != null) {
            nAR = Rec.inv_ar_total;
            nAP = Rec.inv_ap_total;
            nPayAmt = Rec.inv_pay_amt;
            if (nAR > 0)
                nDiff = nAR;
            if (nAP > 0)
                nDiff = nAP;
            nAR = 0;
            nAP = 0;
            nDiff = 0;
        }

        this.pendingList.forEach(mRec => {
            if (mRec.inv_flag == "Y") {
                iCount++;
                if (mRec.inv_ar_total > 0) {
                    nAR += mRec.inv_pay_amt;
                    nAR = this.gs.roundNumber(nAR, 2);
                }
                else {
                    nAP += mRec.inv_pay_amt;
                    nAP = this.gs.roundNumber(nAP, 2);
                }
            }
            else {
                mRec.inv_pay_amt = null;
            }
        })

        nDiff = nAR - nAP;

        nDiff = this.gs.roundNumber(nDiff, 2);

        this.txt_tot_AR = nAR;
        this.txt_tot_AP = nAP;
        this.txt_tot_diff = nDiff;

        this.LBL_COUNT = iCount;

        this.LBL_STATUS = "";
        this.Pay_RP = "";
        if (nDiff > 0) {
            this.Pay_RP = "RECEIPT";
            this.LBL_STATUS = "RECEIPT AMT " + nDiff.toString();
        }
        else if (nDiff < 0) {
            this.Pay_RP = "PAYMENT";
            this.LBL_STATUS = "PAYMENT AMT " + Math.abs(nDiff).toString();
        }


        var nBal2 = this.txt_Bal_diff;
        nDiff = nBal2 - nDiff;
        nDiff = this.gs.roundNumber(nDiff, 2);
        this.txt_diff = nDiff;

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

    }


    editmaster(_record: Tbl_cargo_invoicem) {
        
        let sID: string = (_record.inv_mbl_id != null) ? _record.inv_mbl_id.toString() : "";
        let REFNO: string = _record.inv_mbl_refno != null ? _record.inv_mbl_refno.toString() : "";
        let sType: string = _record.inv_type != null ? _record.inv_type.toString() : "";
        let sMode: string = this.getmode(sType);
        if (sID == "") {
            alert('Invalid Record Selected');
            return;
        }
        this.gs.LinkPage("REFNO", sMode, REFNO, sID);
    }

    editinvoice(_record: Tbl_cargo_invoicem) {

        let sID: string = (_record.inv_mbl_id != null) ? _record.inv_mbl_id.toString() : "";
        let REFNO: string = _record.inv_mbl_refno != null ? _record.inv_mbl_refno.toString() : "";
        let sType: string = _record.inv_type != null ? _record.inv_type.toString() : "";
        let sMode: string = this.getmode(sType);
        let INVID: string = _record.inv_pkid != null ? _record.inv_pkid.toString() : "";
        if (sID == "" || INVID == "") {
            alert('Invalid Record Selected');
            return;
        }
        this.gs.LinkPage("INVNO", sMode, REFNO, sID, "", INVID);
    }


    ArApList(_record: Tbl_cargo_invoicem, arapModalContent: any) {

        this.InvoiceList = <Tbl_cargo_invoicem[]>[];
        let MBLID: string = (_record.inv_mbl_id != null) ? _record.inv_mbl_id.toString() : "";
        if (MBLID.trim() == "") {
            alert("Invalid Record Selected");
            return;
        }

        this.errorMessage = '';
        var searchData = this.gs.UserInfo;
        searchData.MBLID = MBLID;
        searchData.company_code = this.gs.company_code;
        searchData.branch_code = this.gs.branch_code;

        this.mainService.InvoiceList(searchData)
            .subscribe(response => {
                this.InvoiceList = response.list;
                if (this.InvoiceList != null) {
                    if (this.InvoiceList.length <= 0)
                        alert("Invoice Not Found");
                    else
                        this.modal = this.modalservice.open(arapModalContent, { centered: true });
                } else
                    alert("Invoice Not Found");
            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);
            });
    }


    CloseModal() {
        this.modal.close();
    }

    getmode(sType: string) {
        let sMode: string = "";
        if (sType == "OI")
            sMode = "SEA IMPORT";
        else if (sType == "OE")
            sMode = "SEA EXPORT";
        else if (sType == "AI")
            sMode = "AIR IMPORT";
        else if (sType == "AE")
            sMode = "AIR EXPORT";
        else if (sType == "OT")
            sMode = "OTHERS";
        else if (sType == "EX")
            sMode = "EXTRA";
        else if (sType == "CM" || sType == "PR" || sType == "FA" || sType == "GE" || sType == "PS")
            sMode = sType.trim();
        else
            sMode = "";

        return sMode;
    }

}
