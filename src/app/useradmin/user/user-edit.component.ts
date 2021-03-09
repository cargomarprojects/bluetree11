import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../shared/input/inputbox.component';

import { UserService } from '../services/userm.service';
import { User_Menu } from '../../core/models/menum';
import { vm_Tbl_User_Userm, Tbl_User_Userm } from '../models/Tbl_User_Userm';

import { SearchTable } from '../../shared/models/searchtable';


@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html'
})
export class UserEditComponent implements OnInit {

    record: Tbl_User_Userm = <Tbl_User_Userm>{};

    tab: string = 'main';

    pkid: string;
    menuid: string;
    public mode: string = '';
    errorMessage: string;
    Foregroundcolor: string;

    title: string;
    isAdmin: boolean;
    refno: string = "";

    where = " ACC_TYPE = 'BANK' ";


    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainService: UserService,
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
            this.record = <Tbl_User_Userm>{};
            this.pkid = this.gs.getGuid();
            this.init();
        }
        if (this.mode == 'EDIT') {
            this.GetRecord();
        }
    }

    init() {

        this.record.usr_pkid = this.pkid;
        this.record.usr_name = '';

        this.record.usr_isadmin = 'N';
        this.record.usr_hide_payroll = 'N'
        this.record.usr_confirm = 'N'
        this.record.usr_islocked = 'N'
        this.record.usr_disable_edit_si_mblstatus = 'N'
        this.record.usr_email_auto_bcc = 'N'

        this.record.usr_scolor = 'WHITE';
        this.record.usr_ecolor = 'GREEN';
        this.record.usr_offset = 0;
        this.record.usr_ncolor = "";
        this.record.usr_linkcolor = 'RED';

        this.record.usr_sign_font = 'Calibri';
        this.record.usr_sign_size = '16';
        this.record.usr_sign_color = 'BLACK';

        this.record.usr_sign_bold = 'N';

        this.record.rec_created_by = this.gs.user_code;
        this.record.rec_created_date = this.gs.defaultValues.today;
    }

    GetRecord() {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_User_Userm>response.record;
                this.mode = 'EDIT';
            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }


    Save() {


        if (!this.Allvalid())
            return;
        this.SaveParent();
        const saveRecord = <vm_Tbl_User_Userm>{};
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


        if (this.gs.isBlank(this.record.usr_code)) {
            bRet = false;
            this.errorMessage = "Code Cannot be blank";
            alert(this.errorMessage);
            return bRet;
        }


        if (this.gs.isBlank(this.record.usr_name)) {
            bRet = false;
            this.errorMessage = "Name Cannot be blank";
            alert(this.errorMessage);
            return bRet;
        }

        if (this.gs.isBlank(this.record.usr_pwd)) {
            bRet = false;
            this.errorMessage = "Password Cannot be blank";
            alert(this.errorMessage);
            return bRet;
        }
        return bRet;
    }


    Close() {
        this.location.back();
    }


    LovSelected(_Record: SearchTable) {

        if (_Record.controlname == "ACCTM") {

        }

    }

    OnChange(field: string) {
    }

    onFocusout(field: string) {
    }

    onBlur(field: string) {
        if ( field == 'usr_code') {
            this.record.usr_code = this.record.usr_code.toString().toUpperCase();
        }
        if ( field == 'usr_name') {
            this.record.usr_name = this.record.usr_name.toString().toUpperCase();
        }
    }






}
