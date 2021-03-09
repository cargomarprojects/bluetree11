import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../shared/input/inputbox.component';

import { MblUsageService} from '../services/mblusage.service';
import { User_Menu } from '../../core/models/menum';
import { vm_Tbl_cargo_mblusage, Tbl_cargo_mblusage } from '../models/Tbl_cargo_mblusage';
import { SearchTable } from '../../shared/models/searchtable';


@Component({
    selector: 'app-mblusage-edit',
    templateUrl: './mblusage-edit.component.html'
})
export class MlbUsageEditComponent implements OnInit {

    record: Tbl_cargo_mblusage  = <Tbl_cargo_mblusage>{};

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

    where = " ACC_TYPE = 'BANK' ";

    oldrefno = '';

    HouseList: Tbl_cargo_mblusage [] = [];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainService: MblUsageService,
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
            this.record = <Tbl_cargo_mblusage>{};
            this.pkid = this.gs.getGuid();
            this.init();
        }
        if (this.mode == 'EDIT') {
            this.GetRecord();
        }
    }

    init() {

        this.record.mu_pkid = this.pkid;
        this.record.mu_sent_on = this.gs.defaultValues.today;

        
        this.HouseList = [];

        this.record.rec_created_by = this.gs.user_code;
        this.record.rec_created_date = this.gs.defaultValues.today;
    }

    GetRecord() {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_cargo_mblusage>response.record;

                this.mode = 'EDIT';
                this.errorMessage = "";
            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }



    Save() {

        this.FindTotal();

        if (!this.Allvalid())
            return;

        const saveRecord = <vm_Tbl_cargo_mblusage>{};
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
                    this.mainService.RefreshList(this.record);
                    this.errorMessage = 'Save Complete';
                   // alert(this.errorMessage);
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


        if (this.gs.isBlank(this.record.mu_agent_id)) {
            bRet = false;
            this.errorMessage = "Invalid House";
            alert(this.errorMessage);
            return bRet;
        }        

        return bRet;
    }


    Close() {
        this.location.back();
    }


    LovSelected(_Record: SearchTable) {

        if (_Record.controlname == "AGENT") {
            this.record.mu_agent_id = _Record.id;
            this.record.mu_agent_code = _Record.code;
            this.record.mu_agent_name = _Record.name;
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
