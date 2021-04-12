import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, UrlSerializer } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../shared/input/inputbox.component';

import { ModuleService } from '../services/modulem.service';
import { User_Menu } from '../../core/models/menum';
import { vm_Tbl_User_Access, Tbl_User_Access, Tbl_User_Rightsm } from '../models/Tbl_User_Rights';

import { SearchTable } from '../../shared/models/searchtable';
import { UserRightsService } from '../services/userRights.service';
import { HttpParams } from '@angular/common/http';


@Component({
    selector: 'app-rights-edit',
    templateUrl: './rights-edit.component.html'
})
export class RightsEditComponent implements OnInit {

    record: Tbl_User_Access = <Tbl_User_Access>{};

    records: Tbl_User_Rightsm[] = [];

    companyList: any[];
    userList: any[];

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
        public mainService: UserRightsService,
        
    ) { }

    ngOnInit() {

        const options = this.route.snapshot.queryParams;

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
        this.LoadCompany();
        this.LoadUser();
    }

    LoadCompany() {
        
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.CODE = "";
        SearchData.TYPE = "USR_BRANCH";
        SearchData.PKID = this.gs.company_pkid;

        this.mainService.getCompanyList(SearchData).subscribe(response => {
            this.companyList = <any>response.list;
        }, error => {
            this.errorMessage = this.gs.getError(error);
        });
    }

    LoadUser() {
        
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.CODE = "";
        SearchData.TYPE = "";

        this.mainService.getUserList(SearchData).subscribe(response => {
            this.userList = <any>response.list;
        }, error => {
            this.errorMessage = this.gs.getError(error);
        });
    }


    NewRecord() {
        this.mode = 'ADD'
        this.actionHandler();
    }

    actionHandler() {
        this.errorMessage = '';
        if (this.mode == 'ADD') {
            this.record = <Tbl_User_Access>{};
            this.pkid = this.gs.getGuid();
            this.init();
        }
        if (this.mode == 'EDIT') {
            this.GetRecord();
        }
    }

    init() {

        this.record.ua_pkid = this.pkid;
        this.record.comp_name = '';
        this.record.rec_created_by = this.gs.user_code;
        this.record.rec_created_date = this.gs.defaultValues.today;

        
        let parameter = {
            menuid: this.mainService.menuid,
            pkid: this.pkid,
            type: this.mainService.param_type,
            origin: 'rights-page',
            mode: 'EDIT'
        };

        this.location.replaceState('Silver.UserAdmin/BranchEditPage', this.gs.getUrlParameter(parameter));
    }

    GetRecord() {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_User_Access>response.record;
                this.records = <Tbl_User_Rightsm[]>response.records;
                this.mode = 'EDIT';
            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }


    Save() {


        if (!this.Allvalid())
            return;
        this.SaveParent();
        const saveRecord = <vm_Tbl_User_Access>{};
        saveRecord.record = this.record;
        saveRecord.records = this.records;

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


        if (this.gs.isBlank(this.record.comp_name)) {
            bRet = false;
            this.errorMessage = "Name Cannot be blank";
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

    }




}
