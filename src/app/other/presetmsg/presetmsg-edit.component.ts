import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../shared/input/inputbox.component';

import { PreSetMsgService } from '../services/presetmsg.service';
import { User_Menu } from '../../core/models/menum';
import { vm_Table_Cargo_Remarks, Table_Cargo_Remarks, Table_Cargo_RemarksModel } from '../models/table_cargo_remarks';
import { SearchTable } from '../../shared/models/searchtable';


@Component({
    selector: 'app-presetmsg-edit',
    templateUrl: './presetmsg-edit.component.html'
})
export class PreSetMsgEditComponent implements OnInit {

    record: Table_Cargo_Remarks = <Table_Cargo_Remarks>{};

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

    isAccLocked = false;

    showchqdt = true;

    where = "";



    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainService: PreSetMsgService,
    ) {

    }

    ngOnInit() {

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
            this.record = <Table_Cargo_Remarks>{};
            this.pkid = this.gs.getGuid();
            this.init();
        }
        if (this.mode == 'EDIT') {
            this.GetRecord();
        }
    }

    init() {
        this.record.pkid = this.pkid;
        this.record.source = 'ADD TO FOLLOW UP';
        this.record.remarks = '';
    }

    GetRecord() {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Table_Cargo_Remarks>response.record;
                this.mode = 'EDIT';
                this.errorMessage = "";
            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }



    Save() {

        if (!this.Allvalid())
            return;
        const saveRecord = <vm_Table_Cargo_Remarks>{};
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

        if (this.gs.isBlank(this.record.source)) {
            bRet = false;
            this.errorMessage = "Type cannot be blank";
            alert(this.errorMessage);
            return bRet;
        }

        if (this.gs.isBlank(this.record.remarks)) {
            bRet = false;
            this.errorMessage = "Message cannot be blank";
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


    getRouteDet(_type: string, _mode: string, _record: Table_Cargo_Remarks = null) {
        if (_type == "L") {
            if ((_mode == "ADD" && this.gs.canAdd(this.menuid)) || (_mode == "EDIT" && this.gs.canEdit(this.menuid)))
                return "/Silver.Other.Trans/SystemMessageEditPage";
            else
                return null;
        } else if (_type == "P") {

            if (_record == null) {
                if (!this.gs.canAdd(this.menuid))
                    return null;
                return {
                    appid: this.gs.appid,
                    menuid: this.menuid,
                    pkid: '',
                    type: this.mainService.param_type,
                    origin: 'presetmsg-page',
                    mode: 'ADD'
                };
            }
            if (!this.gs.canEdit(this.menuid))
                return null;
            return {
                appid: this.gs.appid,
                menuid: this.menuid,
                pkid: _record.pkid,
                type: '',
                origin: 'presetmsg-page',
                mode: 'EDIT'
            };
        } else
            return null;
    }






}
