import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../shared/input/inputbox.component';

import { MailServerService } from '../services/mailserver.service';
import { User_Menu } from '../../core/models/menum';
import { vm_Tbl_User_Server, Tbl_User_Server } from '../models/Tbl_User_Server';

import { SearchTable } from '../../shared/models/searchtable';

//EDIT-AJITH-06-09-2021
//EDIT-AJITH-26-11-2021

@Component({
    selector: 'app-mailserver-edit',
    templateUrl: './mailserver-edit.component.html'
})
export class MailServerEditComponent implements OnInit {

    record: Tbl_User_Server = <Tbl_User_Server>{};

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
        public mainService: MailServerService,
    ) { }

    ngOnInit() {
        this.gs.checkAppVersion();
        //Route Change 29072021
        if (this.route.snapshot.queryParams.parameter == null) {
            this.menuid = this.route.snapshot.queryParams.menuid;
            this.pkid = this.route.snapshot.queryParams.pkid;
            this.mode = this.route.snapshot.queryParams.mode;
        } else {
            const options = JSON.parse(this.route.snapshot.queryParams.parameter);

            this.menuid = options.menuid;
            this.pkid = options.pkid;
            this.mode = options.mode;
        }
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
            this.record = <Tbl_User_Server>{};
            this.pkid = this.gs.getGuid();
            this.init();
        }
        if (this.mode == 'EDIT') {
            this.GetRecord();
        }
    }

    init() {

        this.record.mail_pkid = this.pkid;
        this.record.mail_name = '';
        this.record.mail_smtp_name = '';
        this.record.mail_smtp_port = '587';
        this.record.mail_is_auth_required = 'Y';
        this.record.mail_is_spa_required = 'Y';
        this.record.mail_is_ssl_required = 'Y';
        this.record.mail_bulk_sub = 100;
        this.record.mail_bulk_tot = 1000;
        this.record.mail_smtp_user = '';
        this.record.mail_smtp_pwd = '';
        this.record.rec_created_by = this.gs.user_code;
        this.record.rec_created_date = this.gs.defaultValues.today;
    }

    GetRecord() {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_User_Server>response.record;
                this.mode = 'EDIT';
            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }


    Save() {

        if (!this.Allvalid())
            return;
        if (!confirm("Save")) {
            return;
        }

        this.SaveParent();
        const saveRecord = <vm_Tbl_User_Server>{};
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


        if (this.gs.isBlank(this.record.mail_name)) {
            bRet = false;
            this.errorMessage = "Name Cannot be blank";
            alert(this.errorMessage);
            return bRet;
        }
        if (this.gs.isBlank(this.record.mail_smtp_name)) {
            bRet = false;
            this.errorMessage = "Smtp Name Cannot be blank";
            alert(this.errorMessage);
            return bRet;
        }

        if (this.gs.isBlank(this.record.mail_smtp_port)) {
            bRet = false;
            this.errorMessage = "Smtp Port Cannot be blank";
            alert(this.errorMessage);
            return bRet;
        }

        if (+this.record.mail_bulk_sub > +this.record.mail_bulk_tot) {
            bRet = false;
            this.errorMessage = " Bulkmail Subtotal must be less than Btachtotal";
            alert(this.errorMessage);
            return bRet;
        }

        return bRet;
    }


    Close() {
        this.location.back();
    }


    LovSelected(_Record: SearchTable) {


    }

    OnChange(field: string) {
    }

    onFocusout(field: string) {
    }

    onBlur(field: string) {

    }






}
