import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../shared/input/inputbox.component';

import { AcctmService } from '../services/acctm.service';
import { User_Menu } from '../../core/models/menum';
import { vm_tbl_acctm, Tbl_acc_acctm } from '../models/tbl_acc_acctm';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
    selector: 'app-acctm-edit',
    templateUrl: './acctm-edit.component.html'
})
export class AcctmEditComponent implements OnInit {

    record: Tbl_acc_acctm = <Tbl_acc_acctm>{};

    tab: string = 'main';

    pkid: string;
    menuid: string;
    public mode: string = '';
    errorMessage: string;
    Foregroundcolor: string;

    title: string;
    isAdmin: boolean;
    refno: string = "";

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainService: AcctmService,
    ){}

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
        if (this.mode == 'ADD') {
            this.record = <Tbl_acc_acctm>{};
            this.pkid = this.gs.getGuid();
            this.init();
        }
        if (this.mode == 'EDIT') {
            this.GetRecord();
        }
    }

    init() {

        this.record.acc_pkid = this.pkid;
        this.record.acc_code = '';
        this.record.acc_name = '';
        this.record.acc_short_name = '';        
        
        this.record.acc_branch = '';        

        this.record.acc_type = 'OTHERS';        

        this.record.acc_budget_id = '';

        this.record.acc_address1 = '';        
        this.record.acc_address2 = '';        
        this.record.acc_address3 = '';        
        this.record.acc_address4 = '';        
        this.record.acc_address5 = '';        

        this.record.acc_chq_format_id = 'NIL';


        this.record.rec_created_by = this.gs.user_code;
        this.record.rec_created_date = this.gs.defaultValues.today;
    }

    GetRecord() {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_acc_acctm>response.record;
                this.mode = 'EDIT';
            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }


    Save() {

        if (!this.Allvalid())
            return;
        this.SaveParent();
        const saveRecord = <vm_tbl_acctm>{};
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
                    alert(this.errorMessage);
                }

            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);
            });
    }

    private SaveParent() {

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

        if (this.gs.isBlank(this.record.acc_code) || this.gs.isBlank(this.record.acc_name)) {
            bRet = false;
            this.errorMessage = "Code/Name Cannot be blank";
            alert(this.errorMessage);
            return bRet;
        }
        
        if (this.gs.isBlank(this.record.acc_group_id)) {
            bRet = false;
            this.errorMessage = "Group Cannot be blank";
            alert(this.errorMessage);
            return bRet;
        }

        if (this.gs.isBlank(this.record.acc_type)) {
            bRet = false;
            this.errorMessage = "Type Cannot be blank";
            alert(this.errorMessage);
            return bRet;
        }


        if (this.gs.isBlank(this.record.acc_chq_format_id)) {
            bRet = false;
            this.errorMessage = "check Format Cannot be blank";
            alert(this.errorMessage);
            return bRet;
        }



        return bRet;
    }


    Close() {
        this.location.back();
    }


    LovSelected(_Record: SearchTable) {

        if (_Record.controlname == "ACC_GROUPM") {
            this.record.acc_group_id = _Record.id;
            this.record.acc_group_name = _Record.name;
        }

    }

    OnChange(field: string) {
    }

    onFocusout(field: string) {
    }

    onBlur(field: string) {

        if (field === 'acc_code')
            this.record.acc_code = this.record.acc_code.toUpperCase();
        if (field === 'acc_name')
            this.record.acc_name = this.record.acc_name.toUpperCase();
        if (field === 'acc_short_name')
            this.record.acc_short_name = this.record.acc_short_name.toUpperCase();


        if (field === 'acc_address1')
            this.record.acc_address1 = this.record.acc_address1.toUpperCase();

        if (field === 'acc_address2')
            this.record.acc_address2 = this.record.acc_address2.toUpperCase();

        if (field === 'acc_address3')
            this.record.acc_address3 = this.record.acc_address3.toUpperCase();

        if (field === 'acc_address4')
            this.record.acc_address4 = this.record.acc_address4.toUpperCase();

        if (field === 'acc_address1')
            this.record.acc_address5 = this.record.acc_address5.toUpperCase();


    }

}
