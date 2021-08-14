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
        //this.msEdit.decplace = this.gs.foreign_amt_dec;
        this.msEdit.sdate = this.gs.defaultValues.today;
    }

    ngOnInit() {
        this.gs.checkAppVersion();
        this.msEdit.init(this.route.snapshot.queryParams);
        //this.replaceUrlMode();
    }


    replaceUrlMode() {
        this.msEdit.mode = "EDIT";
        let parameter = {
            appid: this.gs.appid,            
            menuid: this.msEdit.menuid,
            pkid: '',
            type: '',
            origin: 'deposit-page',
            mode: 'EDIT'
        };
        this.location.replaceState('Silver.USAccounts.Trans/DepositEditPage', this.gs.getUrlParameter(parameter));
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
            this.msEdit.remarks = this.msEdit.remarks.toUpperCase().trim();
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
