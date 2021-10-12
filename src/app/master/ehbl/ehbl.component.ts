import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { InputBoxComponent } from '../../shared/input/inputbox.component';
import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { EhblService } from '../services/ehbl.service';
import { User_Menu } from '../../core/models/menum';
import { Tbl_cargo_ehbld, vm_Tbl_cargo_ehbl, Tbl_cargo_ehbl } from '../models/Tbl_cargo_ehbl';
import { SearchTable } from '../../shared/models/searchtable';
import { PageQuery } from '../../shared/models/pageQuery';
import { Tbl_Audit } from '../../reports/models/Tbl_Audit';
//EDIT-AJITH-06-09-2021
//EDIT-AJITH-11-10-2021
//EDIT-AJITH-12-10-2021

@Component({
    selector: 'app-ehbl',
    templateUrl: './ehbl.component.html'
})
export class EhblComponent implements OnInit {

    @ViewChild('_agent_lov') agent_lov_ctrl: AutoComplete2Component;
    @ViewChild('_start_no') start_no_ctrl: ElementRef;

    record: Tbl_cargo_ehbl = <Tbl_cargo_ehbl>{};
    records: Tbl_cargo_ehbl[] = [];
    precords: Tbl_Audit[] = [];
    // 15-07-2019 Created By Ajith  
    currentTab = 'LIST';
    private pkid: string;
    private menuid: string;
    private mode: string = '';
    public title: string = '';
    public isAdmin: boolean;

    errorMessage: string;
    id: string;
    param_type: string;
    is_locked: boolean = false;
    searchstring: string = '';
    pageQuery: PageQuery;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        private mainService: EhblService,
    ) { }

    ngOnInit() {
        this.gs.checkAppVersion();
        this.currentTab = 'LIST';
        if (this.route.snapshot.queryParams.parameter == null) {
            this.id = this.route.snapshot.queryParams.id;
            this.menuid = this.route.snapshot.queryParams.menuid;
            this.param_type = this.route.snapshot.queryParams.menu_param;
        } else {
            const options = JSON.parse(this.route.snapshot.queryParams.parameter);
            this.id = options.id;
            this.menuid = options.menuid;
            this.param_type = options.menu_param;
        }

        this.initPage();
        this.List("NEW");
    }

    private initPage() {

        this.title = 'E-hbl Setting';
        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.errorMessage = '';
        this.pageQuery = <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 };
        this.LoadCombo();
    }

    LoadCombo() {

    }



    actionHandler(action: string, id: string, _selectedRowIndex: number = -1) {
        this.errorMessage = '';

        if (action == 'LIST') {
            this.mode = '';
            this.pkid = '';
            this.currentTab = 'LIST';
        }
        else if (action === 'ADD') {
            this.currentTab = 'DETAILS';
            this.mode = 'ADD';
            // this.ResetControls();
            this.NewRecord();
        }
        else if (action === 'EDIT') {
            // this.selectedRowIndex = _selectedRowIndex;
            this.currentTab = 'DETAILS';
            this.mode = 'EDIT';
            // this.ResetControls();
            this.pkid = id;
            this.GetRecord(id);
        }
    }

    NewRecord() {
        this.pkid = this.gs.getGuid();
        this.record = <Tbl_cargo_ehbl>{};
        this.record.ebl_pkid = this.pkid;
        this.record.ebl_agent_id = "";
        this.record.ebl_agent_code = "";
        this.record.ebl_agent_name = "";
        this.record.ebl_download_max_no = 0;
        this.record.ebl_start_no = 0;
        this.record.ebl_pending_nos = '';
        this.record.rec_mode = this.mode;
        if (!this.gs.isBlank(this.agent_lov_ctrl))
            this.agent_lov_ctrl.Focus();
    }


    List(_type: string) {
        let SearchData = {
            searchstring: this.searchstring.toUpperCase(),
            agentid: '',
            company_code: this.gs.company_code,
            branch_code: this.gs.branch_code,
            page_rowcount: this.gs.ROWS_TO_DISPLAY,
            action: 'NEW',
            page_count: 0,
            page_rows: 0,
            page_current: -1
        };

        if (_type == 'PAGE') {
            SearchData.action = this.pageQuery.action;
            SearchData.page_count = this.pageQuery.page_count;
            SearchData.page_rows = this.pageQuery.page_rows;
            SearchData.page_current = this.pageQuery.page_current;
        }
        this.errorMessage = '';
        SearchData.searchstring = this.searchstring.toUpperCase();
        SearchData.agentid = '';
        SearchData.company_code = this.gs.company_code;
        SearchData.branch_code = this.gs.branch_code;
        this.mainService.List(SearchData)
            .subscribe(response => {
                this.records = response.list;
                this.pageQuery = <PageQuery>{ action: response.action, page_count: response.page_count, page_current: response.page_current, page_rows: response.page_rows };
            },
                error => {
                    this.errorMessage = this.gs.getError(error);
                });
    }

    GetRecord(Id: string) {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_cargo_ehbl>response.record;
                this.precords = (response.precords == undefined || response.precords == null) ? <Tbl_Audit[]>[] : <Tbl_Audit[]>response.precords;
                this.mode = 'EDIT';
                if (!this.gs.isBlank(this.agent_lov_ctrl))
                    this.agent_lov_ctrl.Focus();
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
        // this.record.add_pkid = this.gs.getGuid();
        // this.record.add_parent_id = this.pkid;
        this.record.rec_mode = this.mode;
        const saveRecord = <vm_Tbl_cargo_ehbl>{};
        saveRecord.record = this.record;
        saveRecord.pkid = this.pkid;
        saveRecord.userinfo = this.gs.UserInfo;
        saveRecord.mode = this.mode;

        this.mainService.Save(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.errorMessage = response.error;
                    alert(this.errorMessage);
                }
                else {
                    this.mode = 'EDIT';
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
        if (this.gs.isBlank(this.record.ebl_agent_id)) {
            bRet = false;
            this.errorMessage = "Agent cannot be empty";
            alert(this.errorMessage);
            //  this.request_to_code_ctrl.Focus();
            return bRet;
        }


        if (this.gs.isZero(this.record.ebl_start_no)) {
            bRet = false;
            this.errorMessage = "Invalid Starting Number";
            alert(this.errorMessage);
            //  this.request_to_code_ctrl.Focus();
            return bRet;
        }
        if (this.gs.isZero(this.record.ebl_download_max_no)) {
            bRet = false;
            this.errorMessage = "Invalid MaxDownload Number";
            alert(this.errorMessage);
            //  this.request_to_code_ctrl.Focus();
            return bRet;
        }

        // if (this.record.ebl_download_max_no<this.record.ebl_start_no) {
        //     bRet = false;
        //     this.errorMessage = "Invalid Starting Number";
        //     alert(this.errorMessage);
        //     //  this.request_to_code_ctrl.Focus();
        //     return bRet;
        // }

        // if (this.record.ebl_download_max_no<this.record.ebl_start_no) {
        //     bRet = false;
        //     this.errorMessage = "Invalid MaxDownload Number";
        //     alert(this.errorMessage);
        //     //  this.request_to_code_ctrl.Focus();
        //     return bRet;
        // }
        return bRet;
    }


    Close() {
        this.location.back();
    }


    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "AGENT") {
            this.record.ebl_agent_id = _Record.id;
            this.record.ebl_agent_name = _Record.name;
            if (!this.gs.isBlank(this.start_no_ctrl))
                this.start_no_ctrl.nativeElement.focus();
        }
    }

    onFocusout(field: string) {

        switch (field) {
            //   case 'mbl_no': {
            //     this.IsBLDupliation('MBL', this.record.mbl_no);
            //     break;
            //   }
        }
    }


    onBlur(field: string) {
        switch (field) {
            case 'searchstring': {
                this.searchstring = this.searchstring.toUpperCase();
                break;
            }
            //   case 'cntr_pieces': {
            //     rec.cntr_pieces = this.gs.roundNumber(rec.cntr_pieces, 0);
            //     break;
            //   }
        }
    }

    pageEvents(actions: any) {

        this.pageQuery = <PageQuery>{ action: actions.action, page_count: actions.pageQuery.page_count, page_current: actions.pageQuery.page_current, page_rows: actions.pageQuery.page_rows }
        this.List('PAGE');
    }

    SavePendingNos() {
        this.errorMessage = '';
        if (this.gs.isBlank(this.record.ebl_agent_id)) {
            this.errorMessage = "Agent cannot be empty";
            alert(this.errorMessage);
            return;
        }

        if (!confirm("Save pending Nos")) {
            return;
        }

        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.ebl_pending_nos = this.record.ebl_pending_nos;
        SearchData.ebl_agent_id = this.record.ebl_agent_id;
        this.mainService.SavePendingNos(SearchData)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.errorMessage = response.error;
                    alert(this.errorMessage);
                }
                else {
                    this.precords = (response.precords == undefined || response.precords == null) ? <Tbl_Audit[]>[] : <Tbl_Audit[]>response.precords;
                    // this.errorMessage = 'Save Complete';
                    // alert(this.errorMessage);
                    this.record.ebl_pending_nos = '';
                }

            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);
            });
    }
}
