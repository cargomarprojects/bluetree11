import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../shared/input/inputbox.component';

import { CompanyService } from '../services/companym.service';
import { User_Menu } from '../../core/models/menum';
import { vm_Tbl_User_Companym, Tbl_User_Companym } from '../models/Tbl_User_Companym';

import { SearchTable } from '../../shared/models/searchtable';


@Component({
    selector: 'app-company-edit',
    templateUrl: './company-edit.component.html'
})
export class CompanyEditComponent implements OnInit {

    record: Tbl_User_Companym = <Tbl_User_Companym>{};

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
        public mainService: CompanyService,
    ) { }

    ngOnInit() {
        this.gs.checkAppVersion();
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
            this.record = <Tbl_User_Companym>{};
            this.pkid = this.gs.getGuid();
            this.init();
        }
        if (this.mode == 'EDIT') {
            this.GetRecord();
        }
    }

    init() {

        this.record.comp_pkid = this.pkid;
        this.record.comp_name = '';
        this.record.comp_order = 0;


        this.record.comp_scolor = 'WHITE';
        this.record.comp_ecolor = 'GREEN';
        this.record.comp_offset = 0;
        this.record.comp_ncolor = "";
        this.record.comp_linkcolor = 'RED';

        this.record.rec_created_by = this.gs.user_code;
        this.record.rec_created_date = this.gs.defaultValues.today;
    }

    GetRecord() {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_User_Companym>response.record;
                this.mode = 'EDIT';
            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }


    Save() {


        if (!this.Allvalid())
            return;
        this.SaveParent();
        const saveRecord = <vm_Tbl_User_Companym>{};
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

        this.record.comp_type = 'C';

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


        if (this.gs.isBlank(this.record.comp_code)) {
            bRet = false;
            this.errorMessage = "Code Cannot be blank";
            alert(this.errorMessage);
            return bRet;
        }


        if (this.gs.isBlank(this.record.comp_name)) {
            bRet = false;
            this.errorMessage = "Name Cannot be blank";
            alert(this.errorMessage);
            return bRet;
        }

        if (this.gs.isBlank(this.record.comp_add1)) {
            bRet = false;
            this.errorMessage = "Address1 Cannot be blank";
            alert(this.errorMessage);
            return bRet;
        }
        if (this.gs.isBlank(this.record.comp_add2)) {
            bRet = false;
            this.errorMessage = "Address2 Cannot be blank";
            alert(this.errorMessage);
            return bRet;
        }




        if (this.gs.isZero(this.record.comp_order)) {
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

        if (_Record.controlname == "ACCTM") {
            this.record.comp_bankid = _Record.id;
            this.record.comp_bank_name = _Record.name;
        }

    }

    OnChange(field: string) {
    }

    onFocusout(field: string) {
    }

    onBlur(field: string) {

    }






}
