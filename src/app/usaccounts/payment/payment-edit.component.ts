import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../shared/input/inputbox.component';

import { PaymentEditService } from '../services/paymentEditservice';
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

    //record: Tbl_cargo_invoicem = <Tbl_cargo_invoicem>{};

    DetailList: Tbl_cargo_invoicem[] = [];

    
    InvoiceList: Tbl_cargo_invoicem[] = [];

    @ViewChildren('_inv_pay_amt') inv_pay_amt_field: QueryList<ElementRef>;
    modal: any;
    mPayRecord = {};


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
        public ms: PaymentEditService,
    ) {
        modalconfig.backdrop = 'static'; //true/false/static
        modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
    }

    ngOnInit() {
        this.gs.checkAppVersion();

        if (this.route.snapshot.queryParams.parameter == null) {
            this.ms.menuid = this.route.snapshot.queryParams.menuid;
            this.ms.pkid = this.route.snapshot.queryParams.pkid;
            this.ms.mode = this.route.snapshot.queryParams.mode;
        } else {
            const options = JSON.parse(this.route.snapshot.queryParams.parameter);
            this.ms.menuid = options.menuid;
            this.ms.pkid = options.pkid;
            this.ms.mode = options.mode;
        }
         
        this.ms.setup();
        if ( this.ms.mode == 'ADD' ) {
            this.actionHandler();
            this.replaceUrlMode();
        }
    }


    replaceUrlMode(){
        this.ms.mode = "EDIT";
        let parameter = {
            appid: this.gs.appid,
            menuid: this.ms.menuid,
            pkid: '',
            type: '',
            origin: 'payment-page',
            mode: 'EDIT'
        };
        this.location.replaceState('Silver.USAccounts.Trans/PaymentEditPage', this.gs.getUrlParameter(parameter));
    }

    NewRecord() {
        this.ms.mode = 'ADD'
        this.actionHandler();
    }

    actionHandler() {
        this.ms.errorMessage = '';
        if (this.ms.mode == 'ADD') {
            this.ms.pendingList = <Tbl_cargo_invoicem[]>[];
            this.ms.pkid = this.gs.getGuid();
            this.ms.init();
        }
    }

    ProcessData() {
    }

    SaveParent() {

    }


    Save(paymentModalContent) {
        this.ms.FindTotal();
        if (this.Allvalid())
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

        this.ms.pendingList.forEach(Record => {
            if (Record.inv_flag == "Y") {
                iCtr++;
                if (Record.inv_pay_amt < 0) {
                    sErrMsg = "Invalid Amount " + Record.inv_pay_amt.toString();
                    //break;
                }

                if (this.gs.IS_SINGLE_CURRENCY == false) {
                    if (this.ms.cust_code != this.gs.base_cur_code) {
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
            bRet = false;
            return false;
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

        this.DetailList = this.ms.pendingList.filter(Record => Record.inv_flag == "Y" && Record.inv_pay_amt > 0);


        this.DetailList.forEach(Record => {

            Record.inv_curr_code = this.ms.curr_code;
            if (Record.inv_type == "PR")
                IS_PAYROLL_RECORD = "Y";
            if (Record.inv_type == "CM")
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


        nAp = this.gs.roundNumber(nAp, 2);
        nAp_Base = this.gs.roundNumber(nAp_Base, 2);

        nAr = this.gs.roundNumber(nAr, 2);
        nAr_Base = this.gs.roundNumber(nAr_Base, 2);

        Customer_Type = this.ms.Search_Mode;


        if (this.ms.Search_Mode != "CUSTOMER" && this.ms.Search_Mode != "GROUP") {
            if (IsSingleCustID == true) {
                Customer_Type = "CUSTOMER";
                this.ms.Customer_ID = mID;
            }
            else {
                //Customer_ID = "";
                //Customer_Type = "MULTIPLE";
                alert("Settlement with multiple customers not allowed");
                bRet = false;
                return false;
            }
        }



        nDiff = nAr - nAp;
        nDiff_Base = nAr_Base - nAp_Base;

        nDiff = this.gs.roundNumber(nDiff, 2);
        nDiff_Base = this.gs.roundNumber(nDiff_Base, 2);

        if (nAr != this.ms.txt_tot_AR) {
            alert("Mismatch in Total A/R");
            bRet = false;
            return false;
        }
        if (nAp != this.ms.txt_tot_AP) {
            alert("Mismatch in Total A/P");
            bRet = false;
            return false;
        }
        if (nDiff != this.ms.txt_tot_diff) {
            alert("Mismatch in Difference Amt");
            bRet = false;
            return false;
        }

        if (this.ms.Customer_ID == "") {
            alert("Invalid Customer");
            bRet = false;
            return false;
        }


        if (this.gs.IS_SINGLE_CURRENCY == true)
            this.ms.IsMultiCurrency = "N";
        else {
            if (this.ms.curr_code == this.gs.base_cur_code)
                this.ms.IsMultiCurrency = "N";
            else
                this.ms.IsMultiCurrency = "Y";
        }

        if (nDiff != 0) {
            if (this.ms.IsMultiCurrency == "Y") {
                if (Math.sign(nDiff) != Math.sign(nDiff_Base)) {
                    bRet = false;
                    alert("Mismatch in Foreign Currency And Local Currency due to huge variation in Exchange Rate");
                    bRet = false;
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
            FCURR_CODE: this.ms.curr_code,
            IsMultiCurrency: this.ms.IsMultiCurrency,
            IS_PAYROLL_RECORD: IS_PAYROLL_RECORD,
            DetailList: this.DetailList,
            IsAdmin: this.ms.isAdmin,
            Customer_ID: this.ms.Customer_ID,
            Customer_Name: this.ms.cust_name,
            Customer_Type: Customer_Type,
        };

        //Process();
        //Show();


        //this.tab = 'payment';


        return bRet;
    }


    callbackevent(data: any) {
        if (data.action == 'CLOSE') {
            this.ms.tab = 'main';
            this.CloseModal();
        }
        if (data.action == 'PRINTCHECK') {

            this.ms.ResetGrid();
            this.ms.FindPartyBalance();

            this.CloseModal();

            if (this.gs.BRANCH_REGION == "USA") {
                if (data.printchq == 'Y') {
                    this.report_url = '/api/Payment/PrintCheque';
                    this.report_searchdata = this.gs.UserInfo;
                    this.report_searchdata.PKID = data.pkid;
                    this.report_searchdata.BANKID = data.bankid;
                    this.report_searchdata.PRINT_SIGNATURE = "N";
                    this.report_menuid = this.gs.MENU_ACC_ARAP_SETTLMENT;
                    this.ms.tab = 'chq';
                }
                else {
                    this.ms.tab = 'main';
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
                this.ms.tab = 'cash';
            }
        }
    }

    Close() {
        this.location.back();
    }


    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "CUSTOMER") {
            this.ms.cust_id = _Record.id;
            this.ms.cust_code = _Record.code;
            this.ms.cust_name = _Record.name;
            //this.NewRecord();
        }
        if (_Record.controlname == "CURRENCY") {
            this.ms.curr_code = _Record.code;
        }
    }

    onChange(field: string) {
        if (field == "CUSTOMER") {
            this.ms.cust_id = '';
            this.ms.cust_code = '';
            this.ms.cust_name = '';
            //this.NewRecord();
        }
    }

    onFocusout(field: string) {
    }

    onBlur(field: string, _rec: Tbl_cargo_invoicem = null, idx: number = 0) {
        if (field == 'inv_pay_amt') {
            _rec.inv_pay_amt = this.gs.roundNumber(_rec.inv_pay_amt, 2);
            if (_rec.inv_flag2) {
                if (_rec.inv_pay_amt < 0) {
                    alert('Invalid Payment Amount, ' + _rec.inv_no)
                    if (idx < this.inv_pay_amt_field.toArray().length)
                        this.inv_pay_amt_field.toArray()[idx].nativeElement.focus();
                    _rec.inv_pay_amt = _rec.inv_balance;
                }
            }
            this.ms.FindTotal('', _rec);
        }

        if ( field =='refno'){
            this.ms.refno = this.ms.refno.trim();
            this.ms.refno = this.ms.refno.toUpperCase();
        }
        if ( field =='invno'){
            this.ms.invno = this.ms.invno.trim();
            this.ms.invno = this.ms.invno.toUpperCase();
        }
        if ( field =='custrefno'){
            this.ms.custrefno = this.ms.custrefno.trim();
            this.ms.custrefno = this.ms.custrefno.toUpperCase();
        }

    }

    onBlur2(cb: any) {
    }


    importExport(_flag : string ){
        var iCtr = 0;
        if ( _flag == "COPY") {
            let str = "INVNO\tDATE\tCUST-NAME\tREF-NO\tCUST-REFNO\tINV-AMT\tAR\tAP\tSELECTED\tPAY-AMT\n";
            this.ms.pendingList.forEach( rec =>{
                str += this.gs.isBlank(rec.inv_no) ? "" : rec.inv_no.toString() ;str += "\t";
                str += this.gs.isBlank(rec.inv_date) ? "" : rec.inv_date.toString() ;str += "\t";

                str += this.gs.isBlank(rec.inv_cust_name) ? "" : rec.inv_cust_name.toString() ;str += "\t";
                str += this.gs.isBlank(rec.inv_mbl_refno) ? "" : rec.inv_mbl_refno.toString() ;str += "\t";
                str += this.gs.isBlank(rec.inv_refno) ? "" : rec.inv_refno.toString() ;str += "\t";

                str += this.gs.isBlank(rec.inv_total) ? "" : rec.inv_total.toString() ;str += "\t";
                str += this.gs.isBlank(rec.inv_ar_total) ? "" : rec.inv_ar_total.toString();str += "\t";
                str += this.gs.isBlank(rec.inv_ap_total) ? "" : rec.inv_ap_total.toString();str += "\t";
                str +=  rec.inv_flag2 ? "Y"  : "N" ;str += "\t";
                str += this.gs.isBlank(rec.inv_pay_amt) ? "" : rec.inv_pay_amt.toString();
                str += "\n";
            });
            this.gs.writeClipboard(str);
            alert('Copy Completed');
        }
        if ( _flag == "PASTE") {
            var data = "";
            const str1 = this.gs.readClipboard().then ( value =>{
                if( value == null)
                {
                    alert('Data Invalid');
                    return;
                }
                var lines = value.split('\n');

                for ( let i =0; i< lines.length ; i++ ){
                    var rec  = lines[i].split('\t');
                    if ( iCtr == 0)
                    {
                        if ( rec.length !=10){
                            alert('Invalid List(INVNO,DATE,INV-AMT,AR,AP,SELECTED,PAY-AMT)');
                            break;
                        }
                        data = rec[0];
                        if ( this.gs.isBlank( data)){
                            alert('Invalid Data List ( column INVNO not found)');
                            break;
                        }
                        if ( data != "INVNO" ){
                            alert('Invalid Data List ( column INVNO not found)');
                            break;
                        }
                        data = rec[8];
                        if ( this.gs.isBlank( data)){
                            alert('Invalid Data List ( column SELECTED not found)');
                            break;
                        }
                        if ( data != "SELECTED"){
                            alert('Invalid Data List ( SELECTED Column not found)');
                            break;
                        }
                    }
                    iCtr++;
                    var itm = this.ms.pendingList.find( r => r.inv_no == rec[0].toString());
                    if ( itm) {
                        data = rec[8];
                        if ( this.gs.isBlank( data)){
                            alert('Invalid Data, no Data In Column(SELECTED) Row Number ' + iCtr.toString());
                            break;
                        }
                        data = data.toString().toUpperCase();
                        itm.inv_flag2 = data.startsWith("Y") ? true : false;
                        itm.inv_flag  = data.startsWith("Y") ? "Y" : "N";
                        this.ms.FindTotal("CHKBOX", itm);

                        data = rec[9];
                        if ( !this.gs.isBlank( data)){
                            var  paid_amt = this.gs.conv2Number(data,2);
                            if ( paid_amt > 0   ) {
                                itm.inv_pay_amt = paid_amt;
                                this.ms.FindTotal("", itm);
                            }
                        }
                    }
                }
                alert('Paste Completed');
            });
        }
    }


    swapSelection(rec: Tbl_cargo_invoicem) {
        rec.inv_flag2 = !rec.inv_flag2;
        rec.inv_flag = (rec.inv_flag2) ? 'Y' : 'N';
        this.ms.FindTotal("CHKBOX", rec);
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
            this.ms.tab = 'chq';
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

        this.ms.errorMessage = '';
        var searchData = this.gs.UserInfo;
        searchData.MBLID = MBLID;
        searchData.company_code = this.gs.company_code;
        searchData.branch_code = this.gs.branch_code;

        this.ms.InvoiceList(searchData)
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
                this.ms.errorMessage = this.gs.getError(error);
                alert(this.ms.errorMessage);
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
