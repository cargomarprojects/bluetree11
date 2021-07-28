import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../shared/input/inputbox.component';

import { DepositEditService } from '../services/depositEdit.service';
import { DepositService } from '../services/deposit.service';
import { User_Menu } from '../../core/models/menum';
import { Tbl_Acc_Payment, vm_tbl_accPayment, AccPaymentModel } from '../models/Tbl_Acc_Payment';
import { SearchTable } from '../../shared/models/searchtable';



@Component({
    selector: 'app-deposit-edit',
    templateUrl: './deposit-edit.component.html'
})
export class DepositEditComponent implements OnInit {

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public msEdit: DepositEditService,
        public msList: DepositService,
    ) {
        this.msEdit.decplace = this.gs.foreign_amt_dec;
        this.msEdit.sdate = this.gs.defaultValues.today;
    }

    ngOnInit() {
        if (this.route.snapshot.queryParams.parameter == null) {
            this.msEdit.menuid = this.route.snapshot.queryParams.menuid;
            this.msEdit.pkid = this.route.snapshot.queryParams.pkid;
            this.msEdit.mode = this.route.snapshot.queryParams.mode;
        } else {
            const options = JSON.parse(this.route.snapshot.queryParams.parameter);
            this.msEdit.menuid = options.menuid;
            this.msEdit.pkid = options.pkid;
            this.msEdit.mode = options.mode;
        }

        this.msEdit.setup();
        this.msEdit.initPage();
        if (this.msEdit.mode == 'ADD') {
            this.actionHandler();
            this.replaceUrlMode();
        }
    }

    replaceUrlMode() {
        this.msEdit.mode = "EDIT";
        let parameter = {
            menuid: this.msList.menuid,
            pkid: '',
            type: this.msList.param_type,
            origin: 'deposit-page',
            mode: 'EDIT'
        };
        this.location.replaceState('Silver.USAccounts.Trans/DepositEditPage', this.gs.getUrlParameter(parameter));

    }

    NewRecord() {
        this.msEdit.mode = 'ADD'
        this.actionHandler();
    }

    actionHandler() {
        this.msEdit.errorMessage = '';
        this.msEdit.isAccLocked = false;

        if (this.msEdit.mode == 'ADD') {
            this.msEdit.record = <Tbl_Acc_Payment>{};
            this.msEdit.arPendingList = <Tbl_Acc_Payment[]>[];
            this.msEdit.DetailList = <Tbl_Acc_Payment[]>[];
            this.msEdit.total_amount = 0;
            this.msEdit.pkid = this.gs.getGuid();
            this.init();
        }
    }

    init() {

        this.msEdit.record.pay_pkid = this.msEdit.pkid;
        this.msEdit.record.pay_vrno = '';
        this.msEdit.remarks = '';
        this.msEdit.id = '';
        this.msEdit.code = '';
        this.msEdit.name = '';

        this.msEdit.record.rec_created_by = this.gs.user_code;
        this.msEdit.record.rec_created_date = this.gs.defaultValues.today;
    }



    ProcessData() {
    }



    Save() {

        this.FindTotal();

        if (!this.msEdit.Allvalid())
            return;

        this.msEdit.SaveParent();
        const saveRecord = <vm_tbl_accPayment>{};
        saveRecord.record = this.msEdit.record;
        saveRecord.records = this.msEdit.DetailList;

        saveRecord.pkid = this.msEdit.pkid;
        saveRecord.mode = "ADD";
        saveRecord.userinfo = this.gs.UserInfo;

        this.msEdit.Save(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.msEdit.errorMessage = response.error;
                    alert(this.msEdit.errorMessage);
                }
                else {

                    this.msEdit.record.pay_docno = response.DOCNO;
                    this.msEdit.record.pay_date = this.msEdit.sdate;
                    this.msEdit.record.pay_acc_name = this.msEdit.name;
                    this.msEdit.record.pay_diff = this.msEdit.total_amount;
                    this.msEdit.record.pay_tot_chq = this.msEdit.iTotChq;
                    this.msEdit.record.pay_posted = "Y";
                    this.msEdit.record.pay_narration = this.msEdit.remarks;
                    this.msList.RefreshList(this.msEdit.record);
                    this.msEdit.errorMessage = 'Save Complete';
                    alert(this.msEdit.errorMessage);

                    this.msEdit.mode = "ADD";
                    // this.actionHandler();
                    this.msEdit.DetailList.forEach(_rec => {
                        this.msEdit.arPendingList.splice(this.msEdit.arPendingList.findIndex(rec => rec.pay_pkid == _rec.pay_pkid), 1);
                    });

                    this.msEdit.errorMessage = '';
                    this.msEdit.isAccLocked = false;
                    this.msEdit.record = <Tbl_Acc_Payment>{};
                    this.msEdit.DetailList = <Tbl_Acc_Payment[]>[];
                    this.msEdit.total_amount = 0;
                    this.msEdit.pkid = this.gs.getGuid();
                    this.init();
                }

            }, error => {
                this.msEdit.errorMessage = this.gs.getError(error);
                alert(this.msEdit.errorMessage);
            });
    }





    pendingList() {
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.msEdit.pkid;
        this.msEdit.DepositPendingList(SearchData).subscribe(
            res => {
                this.msEdit.arPendingList = res.list;
            },
            err => {
                this.msEdit.errorMessage = this.gs.getError(err);
                alert(this.msEdit.errorMessage);
            });

    }


    swapSelection(rec: Tbl_Acc_Payment) {
        rec.pay_flag2 = !rec.pay_flag2;
        this.msEdit.total_amount = 0;
        this.msEdit.arPendingList.forEach(Record => {
            if (Record.pay_flag2) {
                this.msEdit.total_amount += Record.pay_total;
                this.msEdit.total_amount = this.gs.roundNumber(this.msEdit.total_amount, 2);
            }
        })

    }


    Close() {
        this.location.back();
    }


    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "ACCTM") {
            this.msEdit.id = _Record.id;
            this.msEdit.code = _Record.code;
            this.msEdit.name = _Record.name;
        }
    }




    OnChange(field: string) {
    }

    onFocusout(field: string) {
    }

    onBlur(field: string) {
        if (field === 'remarks')
            this.msEdit.remarks = this.msEdit.remarks.toUpperCase();
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
