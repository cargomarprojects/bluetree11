import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../shared/input/inputbox.component';

import { AcOpeningService } from '../services/acopening.service';

import { User_Menu } from '../../core/models/menum';
import { vm_tbl_accOpening, Tbl_Acc_Opening } from '../models/Tbl_Acc_Opening';

import { SearchTable } from '../../shared/models/searchtable';



@Component({
    selector: 'app-acopen-edit',
    templateUrl: './acopen-edit.component.html'
})
export class AcopenEditComponent implements OnInit {

    record: Tbl_Acc_Opening = <Tbl_Acc_Opening>{};

    tab: string = 'main';

    pkid: string;
    menuid: string;
    public mode: string = '';
    errorMessage: string;
    Foregroundcolor: string;

    title: string;
    isAdmin: boolean;
    refno: string = "";

    decplace = 0;

    isAccLocked = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainService: AcOpeningService,
    ) {
        this.decplace = this.gs.foreign_amt_dec;
    }

    ngOnInit() {
        const options = JSON.parse(this.route.snapshot.queryParams.parameter);


        this.menuid = options.menuid;
        this.pkid = options.pkid;
        this.mode = options.mode;

        this.initPage();
        this.actionHandler();
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
            this.record = <Tbl_Acc_Opening>{};
            this.pkid = this.gs.getGuid();
            this.init();
        }
        if (this.mode == 'EDIT') {
            this.GetRecord();
        }
    }

    init() {

        this.record.op_pkid = this.pkid;
        this.record.op_docno = '';
        this.record.op_date = this.gs.year_start_date;

        this.record.op_vrno = '';
        this.record.op_type = 'OP';

        this.record.op_arap = '';

        this.record.op_year = +this.gs.year_code;

        this.record.op_acc_id = '';
        this.record.op_acc_code = '';
        this.record.op_acc_name = '';

        this.record.op_cust_id = '';
        this.record.op_cust_code = '';
        this.record.op_cust_name = '';


        this.record.op_curr_code = this.gs.base_cur_code;
        this.record.op_ex_rate = 1;

        this.record.op_famt = 0;
        this.record.op_amt = 0;

        this.record.op_drcr = "DR";

        this.record.op_mbl_refno = '';
        this.record.op_inv_refno = '';
        this.record.op_invno = '';
        this.record.op_invdate = '';

        this.record.rec_created_by = this.gs.user_code;
        this.record.rec_created_date = this.gs.defaultValues.today;

        if (this.gs.IS_SINGLE_CURRENCY == true) {
            this.record.op_curr_code = this.gs.base_cur_code;
            this.record.op_ex_rate = 1;
        }

    }

    GetRecord() {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_Acc_Opening>response.record;
                this.mode = 'EDIT';

                this.errorMessage  ="";
                if (this.record.op_is_paid == "Y") {
                    this.errorMessage  ="Invoice Settled, Cannot Edit";
                }
                else if (this.gs.IsDateLocked(this.record.op_date)) {
                    this.isAccLocked = true;
                    this.errorMessage  ="Accoutning Period Locked";
                }

            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }


    private SaveParent() {

        if (this.record.op_arap == 'NO') {
            this.record.op_cust_id = "";
            this.record.op_cust_code = "";
            this.record.op_cust_name = "";
            this.record.op_invno = "";
            this.record.op_invdate = null;
            this.record.op_inv_refno = "";
            this.record.op_mbl_refno = "";
            this.record.op_dr = 0;
            this.record.op_cr = 0;
        }
    }


    Save() {

        this.FindTotal();

        if (!this.Allvalid())
            return;

        this.SaveParent();

        const saveRecord = <vm_tbl_accOpening>{};
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
                    this.mode = 'EDIT';

                    this.record.op_docno = response.DOCNO;

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

        if (this.record.op_is_paid == "Y") {
            bRet = false;
            this.errorMessage = "Invoice Settled, Cannot Edit";
            alert(this.errorMessage);
            return bRet;
        }

        if (this.gs.IsDateLocked(this.record.op_date)) //Locked by locked date from br settings by 01/July/2018
        {
            bRet = false;
            this.errorMessage = "Accounting Period Locked";
            alert(this.errorMessage);
            return bRet;
        }

        if (this.gs.isBlank(this.record.op_arap)) {
            bRet = false;
            this.errorMessage = "Invalid A/c Code (AR/AP)";
            alert(this.errorMessage);
            return bRet;
        }


        if (this.gs.isBlank(this.record.op_date)) {
            bRet = false;
            this.errorMessage = "Invalid Date";
            alert(this.errorMessage);
            return bRet;
        }

        if (this.gs.isBlank(this.record.op_acc_id)) {
            bRet = false;
            this.errorMessage = "Invalid A/c Selected";
            alert(this.errorMessage);
            return bRet;
        }

        if (this.gs.isZero(this.record.op_famt)) {
            bRet = false;
            this.errorMessage = "Invalid Amount";
            alert(this.errorMessage);
            return bRet;
        }

        if (this.gs.isBlank(this.record.op_curr_code)) {
            bRet = false;
            this.errorMessage = "Invalid Currency";
            alert(this.errorMessage);
            return bRet;
        }        

        if (this.gs.isZero(this.record.op_ex_rate)) {
            bRet = false;
            this.errorMessage = "Invalid Ex.Rate";
            alert(this.errorMessage);
            return bRet;
        }

        if (this.gs.isZero(this.record.op_amt)) {
            bRet = false;
            this.errorMessage = "Invalid Amount";
            alert(this.errorMessage);
            return bRet;
        }        


        if (this.gs.isBlank(this.record.op_drcr)) {
            bRet = false;
            this.errorMessage = "Invalid A/c Type";
            alert(this.errorMessage);
            return bRet;
        }

        if ( this.record.op_arap === 'AR' ||  this.record.op_arap === 'AP')
        {
            if (this.gs.isBlank(this.record.op_cust_id)) {
                bRet = false;
                this.errorMessage = "Invalid Party";
                alert(this.errorMessage);
                return bRet;
            }
            if (this.gs.isBlank(this.record.op_invno)) {
                bRet = false;
                this.errorMessage = "Invalid Invoice No";
                alert(this.errorMessage);
                return bRet;
            }
            if (this.gs.isBlank(this.record.op_invdate)) {
                bRet = false;
                this.errorMessage = "Invalid Invoice Date";
                alert(this.errorMessage);
                return bRet;
            }
        }

        if ( this.record.op_arap === 'AR' ){
            if ( this.record.op_drcr == 'CR'){
                bRet = false;
                this.errorMessage = "A/c Type need to be DR";
                alert(this.errorMessage);
                return bRet;
            }
        }
        if ( this.record.op_arap === 'AP' ){
            if ( this.record.op_drcr == 'DR'){
                bRet = false;
                this.errorMessage = "A/c Type need to be CR";
                alert(this.errorMessage);
                return bRet;
            }
        }




        return bRet;
    }


    Close() {
        this.location.back();
    }


    LovSelected(_Record: SearchTable) {

        if (_Record.controlname == "ACCTM") {
            this.record.op_acc_id = _Record.id;
            this.record.op_acc_code = _Record.code;
            this.record.op_acc_name = _Record.name;
            this.record.op_arap = 'NO';
            if (_Record.col8 === 'R')
                this.record.op_arap = 'AR';
            if (_Record.col8 === 'P')
                this.record.op_arap = 'AP';
        }
        if (_Record.controlname == "CUSTOMER") {
            this.record.op_cust_id = _Record.id;
            this.record.op_cust_code = _Record.code;
            this.record.op_cust_name = _Record.name;
        }

    }

    OnChange(field: string) {
    }

    onFocusout(field: string) {
    }
    
    onBlur(field: string) {
    }

    onBlur2( cb : any) {
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
        var nTot = 0;
        if (this.gs.IS_SINGLE_CURRENCY == true) {
            this.record.op_curr_code = this.gs.base_cur_code;
            this.record.op_ex_rate = 1;
        }
        if (this.record.op_ex_rate <= 0)
            this.record.op_ex_rate = 1;

        nTot = this.record.op_famt * this.record.op_ex_rate;
        this.record.op_amt = this.gs.roundNumber(nTot, 2);

    }


}
