import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../shared/input/inputbox.component';

import { DepositService } from '../services/deposit.service';
import { User_Menu } from '../../core/models/menum';
import { Tbl_Acc_Payment, vm_tbl_accPayment, AccPaymentModel } from '../models/Tbl_Acc_Payment';
import { SearchTable } from '../../shared/models/searchtable';



@Component({
    selector: 'app-deposit-edit',
    templateUrl: './deposit-edit.component.html'
})
export class DepositEditComponent implements OnInit {

    record: Tbl_Acc_Payment = <Tbl_Acc_Payment>{};

    tab: string = 'main';

    pkid: string;
    menuid: string;
    public mode: string = '';
    errorMessage: string;
    Foregroundcolor: string;

    total_amount = 0;
    iTotChq = 0;

    docno = '';
    sdate = '';
    id = '';
    code = '';
    name = '';
    remarks = '';

    next_chqno = 0;

    CFNO = "";

    title: string;
    isAdmin: boolean;
    refno: string = "";

    decplace = 0;

    isAccLocked = false;

    showchqdt = true;

    where = " ACC_TYPE = 'BANK' ";

    oldrefno = '';

    arPendingList: Tbl_Acc_Payment[] = [];

    DetailList: Tbl_Acc_Payment[] = [];



    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainService: DepositService,
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
            this.arPendingList = <Tbl_Acc_Payment[]>[];
            this.DetailList = <Tbl_Acc_Payment[]>[];
            this.total_amount = 0;
            this.pkid = this.gs.getGuid();
            this.init();
        }
    }

    init() {

        this.record.pay_pkid = this.pkid;
        this.record.pay_vrno = '';
        this.remarks = '';

        this.record.rec_created_by = this.gs.user_code;
        this.record.rec_created_date = this.gs.defaultValues.today;
    }



    ProcessData() {
    }

    SaveParent() {
        
        this.record = <Tbl_Acc_Payment>{};
        this.record.pay_pkid = this.pkid;
        this.record.pay_cust_id = "";
        this.record.pay_acc_id = this.id;
        this.record.pay_date = this.sdate;
        this.record.pay_narration = this.remarks;
        this.record.pay_type = "DEPOSIT";
        this.record.pay_year = +this.gs.year_code;
        this.record.pay_total = this.total_amount ;
        this.record.pay_status = "POSTED";
        this.record.pay_posted = "Y";
        this.record.pay_memo = "";
        this.record.pay_tot_chq = this.iTotChq;

    }




    Save() {

        this.FindTotal();

        if (!this.Allvalid())
            return;

        this.SaveParent();
        const saveRecord = <vm_tbl_accPayment>{};
        saveRecord.record = this.record;
        saveRecord.records = this.DetailList;

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

                    this.record.pay_docno =  response.DOCNO;
                    this.record.pay_date = this.sdate ;
                    this.record.pay_acc_name = this.name ;
                    this.record.pay_diff = this.total_amount ;
                    this.record.pay_tot_chq = this.iTotChq ;
                    this.record.pay_posted = "Y" ;
                    this.record.pay_narration = this.remarks ;
                    this.mainService.RefreshList(this.record);
                    this.errorMessage = 'Save Complete';
                    alert(this.errorMessage);
                    this.mode = "ADD";
                    this.actionHandler();
                }

            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);
            });
    }


    private Allvalid(): boolean {

        var bRet = true;
        this.errorMessage = "";

        if (this.gs.isBlank(this.sdate)) {
            bRet = false;
            this.errorMessage = "Invalid Date";
            alert(this.errorMessage);
            return bRet;
        }

        
        if (this.gs.isBlank(this.id) || this.gs.isBlank(this.code) || this.gs.isBlank(this.name)) {
            bRet = false;
            this.errorMessage = "Invalid Bank";
            alert(this.errorMessage);
            return bRet;
        }


        if (this.gs.isZero( this.total_amount) ) {
            bRet = false;
            this.errorMessage = "No Rows Selected";
            alert(this.errorMessage);
            return bRet;
        }



        var iCtr = 0;
        this.arPendingList.forEach(Record => {
            if (Record.pay_flag2) {
                iCtr++;
            }
        });
        if (iCtr == 0) {
            alert("No Detail Rows To Save")
            return;
        }

        var nAmt = 0;
        this.iTotChq = 0;

        this.DetailList = <Tbl_Acc_Payment[]>[];

        this.arPendingList.forEach(Record => {

            if (Record.pay_flag2 && Record.pay_total > 0) {
                var DetailRow = <Tbl_Acc_Payment>{};
                DetailRow.pay_pkid = Record.pay_pkid;
                DetailRow.pay_total = Record.pay_total;
                nAmt += Record.pay_total;
                nAmt =  this.gs.roundNumber( nAmt ,2);                
                this.iTotChq++;
                this.DetailList.push(DetailRow);
            }
        });

        if (nAmt != this.total_amount) {
            alert("Difference in Total Amount And selected Amount");
            return false;
        }
        return bRet;
    }

    pendingList() {
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        this.mainService.DepositPendingList(SearchData).subscribe(
            res => {
                this.arPendingList = res.list;

            },
            err => {
                this.errorMessage = this.gs.getError(err);
                alert(this.errorMessage);
            });

    }

    swapSelection(rec: Tbl_Acc_Payment) {
        rec.pay_flag2 = !rec.pay_flag2;
        this.total_amount = 0;
        this.arPendingList.forEach(Record => {
            if (Record.pay_flag2) {
                this.total_amount += Record.pay_total;
                this.total_amount =  this.gs.roundNumber( this.total_amount,2);                
            }
        })
        
    }


    Close() {
        this.location.back();
    }


    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "ACCTM") {
            this.id = _Record.id;
            this.code = _Record.code;
            this.name = _Record.name;
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

}
