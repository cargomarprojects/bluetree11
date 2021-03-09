import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../shared/input/inputbox.component';

import { AcGroupService } from '../services/acgroup.service';
import { User_Menu } from '../../core/models/menum';
import { vm_tbl_accgroup, Tbl_acc_groupm } from '../models/tbl_acc_groupm';

import { SearchTable } from '../../shared/models/searchtable';



@Component({
    selector: 'app-acgroup-edit',
    templateUrl: './acgroup-edit.component.html'
})
export class AcgroupEditComponent implements OnInit {

    record: Tbl_acc_groupm = <Tbl_acc_groupm>{};

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
        public mainService: AcGroupService,
    ) { }

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
            this.record = <Tbl_acc_groupm>{};
            this.pkid = this.gs.getGuid();
            this.init();
        }
        if (this.mode == 'EDIT') {
            this.GetRecord();
        }
    }

    init() {

        this.record.acc_group_pkid = this.pkid;
        this.record.acc_parent_code = '1A';
        this.record.acc_parent_name = 'DIRECT INCOME';
        this.record.acc_group_name = '';
        this.record.acc_sub_group_name = '';
        this.record.acc_order = 0;
        this.record.rec_created_by = this.gs.user_code;
        this.record.rec_created_date = this.gs.defaultValues.today;
    }

    GetRecord() {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_acc_groupm>response.record;
                this.mode = 'EDIT';
            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }


    Save() {

        this.record.acc_parent_code = this.getParentCode();

        if (!this.Allvalid())
            return;
        this.SaveParent();
        const saveRecord = <vm_tbl_accgroup>{};
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

        if (this.gs.isBlank(this.record.acc_parent_name) || this.gs.isBlank(this.record.acc_parent_code)) {
            bRet = false;
            this.errorMessage = "Level1 Cannot be blank";
            alert(this.errorMessage);
            return bRet;
        }


        if (this.gs.isBlank(this.record.acc_group_name)) {
            bRet = false;
            this.errorMessage = "Level2 Cannot be blank";
            alert(this.errorMessage);
            return bRet;
        }

        if (this.gs.isBlank(this.record.acc_sub_group_name)) {
            bRet = false;
            this.errorMessage = "Level3 Cannot be blank";
            alert(this.errorMessage);
            return bRet;
        }

        if (this.gs.isZero(this.record.acc_order)) {
            bRet = false;
            this.errorMessage = "Order Cannot be blank";
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
        }

    }

    OnChange(field: string) {
    }

    onFocusout(field: string) {
    }

    onBlur(field: string) {

        if (field === 'group_name')
            this.record.acc_group_name = this.record.acc_group_name.toUpperCase();
        if (field === 'sub_group_name')
            this.record.acc_sub_group_name = this.record.acc_sub_group_name.toUpperCase();


    }

    getParentCode() {
        var sCode = "";
        if (this.record.acc_parent_name == "DIRECT INCOME")
            sCode = "1A";
        else if (this.record.acc_parent_name == "DIRECT EXPENSE")
            sCode = "1B";
        else if (this.record.acc_parent_name == "INDIRECT INCOME")
            sCode = "2A";
        else if (this.record.acc_parent_name == "INDIRECT EXPENSE")
            sCode = "2B";
        else if (this.record.acc_parent_name == "ASSET")
            sCode = "3A";
        else if (this.record.acc_parent_name == "LIABILITY")
            sCode = "3B";
        else
            sCode = "";
        return sCode;
    }




}
