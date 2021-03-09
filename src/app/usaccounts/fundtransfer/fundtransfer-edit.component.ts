import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../shared/input/inputbox.component';

import { FundTransferService } from '../services/fundtransfer.service';
import { User_Menu } from '../../core/models/menum';
import { vm_tbl_accPayment, Tbl_Acc_Payment } from '../models/Tbl_Acc_Payment';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
    selector: 'app-fundtransfer-edit',
    templateUrl: './fundtransfer-edit.component.html'
})
export class FundTransferEditComponent implements OnInit {

    record: Tbl_Acc_Payment = <Tbl_Acc_Payment>{};

    tab: string = 'main';

    pkid: string;
    menuid: string;
    public mode: string = '';
    errorMessage: string;
    Foregroundcolor: string;

    next_chqno = 0;

    CFNO = "";

    title: string;
    isAdmin: boolean;
    refno: string = "";

    decplace = 0;

    isAccLocked = false;

    showchqdt = true;

    where = "ACC_TYPE IN('BANK','CASH', 'PETTY CASH', 'CAPITAL', 'RETAINED-PROFIT')";

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainService: FundTransferService,
    ) {
        this.decplace = this.gs.foreign_amt_dec;
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

        if (this.gs.SHOW_CHECK_DATE == "N") {
            this.showchqdt = false;
        }

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
        this.isAccLocked = false;

        if (this.mode == 'ADD') {
            this.record = <Tbl_Acc_Payment>{};
            this.pkid = this.gs.getGuid();
            this.init();
        }
        if (this.mode == 'EDIT') {
            this.GetRecord();
        }
    }

    init() {

        this.record.pay_pkid = this.pkid;
        this.record.pay_vrno = '';
        this.record.pay_docno = '';
        this.record.pay_date = this.gs.defaultValues.today;

        this.record.pay_type = 'FT';
        this.record.pay_year = +this.gs.year_code;


        this.record.pay_from_id=  '';
        this.record.pay_from_acc_code=  '';
        this.record.pay_from_acc_name = '';

        this.record.pay_to_id=  '';
        this.record.pay_to_acc_code=  '';
        this.record.pay_to_acc_name = '';

        this.record.pay_amt =0;
        this.record.pay_narration = '';

        this.record.pay_mode = 'CHECK';

        this.record.rec_created_by = this.gs.user_code;
        this.record.rec_created_date = this.gs.defaultValues.today;

    }

    GetRecord() {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_Acc_Payment>response.record;
                this.mode = 'EDIT';
                this.errorMessage = "";
                if (this.gs.IsDateLocked(this.record.pay_date)) {
                    this.isAccLocked = true;
                    this.errorMessage = "Accounting Period Locked";
                }
            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }



    Save() {

        this.FindTotal();

        if (!this.Allvalid())
            return;

        const saveRecord = <vm_tbl_accPayment>{};
        saveRecord.record = this.record;
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
                    
                    this.record.pay_vrno = response.CFNO;
                    this.record.pay_docno = response.DOCNO;

                    this.mode = 'EDIT';
                    this.mainService.RefreshList(this.record);
                    this.errorMessage = 'Save Complete';
                    alert(this.errorMessage);
                }

            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);
            });
    }


    private Allvalid(): boolean {

        var bRet = true;
        this.errorMessage = "";

        if (this.gs.isBlank(this.pkid)) {
            bRet = false;
            this.errorMessage = "Invalid ID";
            alert(this.errorMessage);
            return bRet;
        }

        if (this.isAccLocked) {
            bRet = false;
            this.errorMessage = "Accounting Period Locked";
            alert(this.errorMessage);
            return bRet;
        }

        /*
        if (this.record.op_is_paid == "Y") {
            bRet = false;
            this.errorMessage = "Invoice Settled, Cannot Edit";
            alert(this.errorMessage);
            return bRet;
        }
*/
        if (this.gs.IsDateLocked(this.record.pay_date)) //Locked by locked date from br settings by 01/July/2018
        {
            bRet = false;
            this.errorMessage = "Accounting Period Locked";
            alert(this.errorMessage);
            return bRet;
        }


        if (this.gs.isBlank(this.record.pay_date)) {
            bRet = false;
            this.errorMessage = "Invalid Date";
            alert(this.errorMessage);
            return bRet;
        }

        if (this.gs.isBlank(this.record.pay_from_id) || this.gs.isBlank(this.record.pay_from_acc_code)) {
            bRet = false;
            this.errorMessage = "Invalid From A/c Code";
            alert(this.errorMessage);
            return bRet;
        }

        if (this.gs.isBlank(this.record.pay_to_id) || this.gs.isBlank(this.record.pay_to_acc_code)) {
            bRet = false;
            this.errorMessage = "Invalid To A/c Code";
            alert(this.errorMessage);
            return bRet;
        }


        if (this.record.pay_mode === "CHECK") {
            if (this.gs.isBlank(this.record.pay_chqno)) {

                bRet = false;
                this.errorMessage = "CHECK NO Need to be entered";
                alert(this.errorMessage);
                return bRet;
            }

        }

        if (this.gs.isZero(this.record.pay_amt)) {
            bRet = false;
            this.errorMessage = "Invalid Amount";
            alert(this.errorMessage);
            return bRet;
        }

        if (this.gs.isBlank(this.record.pay_narration)) {
            bRet = false;
            this.errorMessage = "Remarks cannot be blank";
            alert(this.errorMessage);
            return bRet;
        }


        return bRet;
    }


    Close() {
        this.location.back();
    }


    LovSelected(_Record: SearchTable) {

        if (_Record.controlname == "FROM_ACCTM") {
            this.record.pay_from_id = _Record.id;
            this.record.pay_from_acc_code = _Record.code;
            this.record.pay_from_acc_name = _Record.name;
        }
        if (_Record.controlname == "TO_ACCTM") {
            this.record.pay_to_id = _Record.id;
            this.record.pay_to_acc_code = _Record.code;
            this.record.pay_to_acc_name = _Record.name;
        }

    }

    OnChange(field: string) {
    }

    onFocusout(field: string) {
    }

    onBlur(field: string) {
    }

    onBlur2(cb: any) {
        /*
        if (field === 'group_name')
            this.record.acc_group_name = this.record.acc_group_name.toUpperCase();
        */
        if (cb.field == "op_famt") {
            this.FindTotal();
        }
        if (cb.field == "op_ex_rate") {
            this.FindTotal();
        }
    }

    FindTotal() {

        /*
        var nTot = 0;
        if (this.gs.IS_SINGLE_CURRENCY == true) {
            this.record.pay_curr_code = this.gs.base_cur_code;
            this.record.op_ex_rate = 1;
        }
        if (this.record.op_ex_rate <= 0)
            this.record.op_ex_rate = 1;

        nTot = this.record.op_famt * this.record.op_ex_rate;
        this.record.op_amt = this.gs.roundNumber(nTot, 2);
        */
    }

    getchqno() {

        var sType = "PAYMENT";
        var sMode = "";
        this.errorMessage = '';
        if ( this.gs.isBlank(this.record.pay_mode)) {
            alert('Pay mode Has to be selected');
            return;
        }
        sMode = this.record.pay_mode;

        if (sMode == "CHECK") {
            if (this.gs.isBlank(this.record.pay_from_id)) {
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
            "DATE": this.record.pay_date,
            "pkid": this.record.pay_from_id,
            "REC_COMPANY_CODE": this.gs.company_code,
            "REC_BRANCH_CODE": this.gs.branch_code
        }

        this.mainService.GetNextChqNo(searchData).subscribe(
            res => {
                this.next_chqno = res.chqno;
                this.SetNextChqNo();
            },
            err => {
                this.errorMessage = this.gs.getError(err);
                alert(this.errorMessage);
            }
        )

        /*
                Dictionary<string, string> Filter = new Dictionary<string, string>();
                Filter.Add("DOCTYPE", sMode);
                Filter.Add("TRANSTYPE", sType);
                Filter.Add("DATE", Dt_Date.SelectedDate.Value.ToString("yyMMdd"));
        
                */

    }

    SetNextChqNo() {

        var nChq = 0;
        var sPrefix = "";

        if (this.record.pay_mode === "NA")
            return;

        if (this.record.pay_mode === "CHECK") {
            nChq = this.next_chqno + 1;
            this.record.pay_chqno = nChq.toString();
            return;
        }

        //if (TOT_DIFF > 0)
        //   sPrefix = "R";

        if (this.record.pay_mode == "WIRE TRANSFER")
            sPrefix += "TT";
        if (this.record.pay_mode == "CASH")
            sPrefix += "CH";
        if (this.record.pay_mode == "ONLINE/ACH PAYMENT")
            sPrefix += "OP";
        if (this.record.pay_mode == "CREDIT CARD")
            sPrefix += "CC";
        if (this.record.pay_mode == "OTHERS")
            sPrefix += "OT";

        var yymmdd = this.record.pay_date.replace("-", "");
        yymmdd = yymmdd.substring(2, 6);

        if (this.next_chqno == 0)
            this.record.pay_chqno = sPrefix + yymmdd; //  Dt_Date.SelectedDate.Value.ToString("yyMMdd");
        else {

            var chqno = this.next_chqno.toString();
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
