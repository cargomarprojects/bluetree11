import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { InputBoxComponent } from '../../shared/input/inputbox.component';
import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { EhblReqService } from '../services/ehblreq.service';
import { User_Menu } from '../../core/models/menum';
import { Tbl_cargo_ehbld, vm_Tbl_cargo_ehbld, vm_Tbl_cargo_ehbl, Tbl_cargo_ehbl } from '../models/Tbl_cargo_ehbl';
import { SearchTable } from '../../shared/models/searchtable';
import { PageQuery } from '../../shared/models/pageQuery';
import * as printJS from "print-js";

//EDIT-AJITH-06-09-2021
//EDIT-AJITH-17-09-2021
//EDIT-AJITH-11-10-2021

@Component({
    selector: 'app-ehbl-req',
    templateUrl: './ehbl-req.component.html'
})
export class EhblReqComponent implements OnInit {

    @ViewChild('_agent_lov_req') agent_lov_req_ctrl: AutoComplete2Component;
    @ViewChild('_ebld_req_nos') ebld_req_nos_ctrl: ElementRef;
    // @ViewChild('request_to_name') request_to_name_ctrl: InputBoxComponent;
    // @ViewChild('cargo_loc_name') cargo_loc_name_ctrl: InputBoxComponent;
    record: Tbl_cargo_ehbld = <Tbl_cargo_ehbld>{};
    records: Tbl_cargo_ehbld[] = [];
    // 15-07-2019 Created By Ajith  
    currentTab = 'LIST';
    tab: string = 'main';
    report_title: string = '';
    report_url: string = '';
    report_searchdata: any = {};
    report_menuid: string = '';
    download_agent_id: string = '';
    download_agent_name: string = '';
    download_agent_code: string = '';
    download_req_nos: number = 1;
    private pkid: string;
    id: string;
    param_type: string;
    private menuid: string;
    private mode: string = '';
    public title: string = '';
    public isAdmin: boolean;
    public canDelete: boolean;
    public canPrint: boolean;
    errorMessage: string;

    filename: string = '';
    filetype: string = '';
    filedisplayname: string = '';
    filename2: string = '';
    filetype2: string = '';
    filedisplayname2: string = '';

    is_locked: boolean = false;
    searchstring: string = '';
    starting_no: number = 0;
    running_no: number = 0;
    ending_no: number = 0;
    balance_no: number = 0;
    now_printing_no: string = '';
    pageQuery: PageQuery;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        private mainService: EhblReqService,
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

        this.title = 'E-hbl Request';
        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.canDelete = this.gs.canDelete(this.menuid);
        this.canPrint = this.gs.canPrint(this.menuid);
        this.errorMessage = '';
        this.pageQuery = <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 };
        if (this.gs.User_Role == "AGENT") {
            this.download_agent_id = this.gs.User_Customer_Id;
            this.download_agent_name = this.gs.user_name;
            this.download_agent_code = this.gs.user_code;
            this.GetBalanceBL(this.download_agent_id)
        }
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
        this.record = <Tbl_cargo_ehbld>{};
        this.record.ebld_pkid = this.pkid;
        this.record.ebld_agent_id = "";
        this.record.ebld_agent_code = "";
        this.record.ebld_agent_name = "";
        this.record.ebld_req_nos = 0;
        this.record.ebld_approved = false;
        if (this.gs.User_Role == "AGENT") {
            this.record.ebld_agent_id = this.gs.User_Customer_Id;
            this.record.ebld_agent_name = this.gs.user_name;
            this.record.ebld_agent_code = this.gs.user_code;
        }
        if (!this.gs.isBlank(this.agent_lov_req_ctrl))
            this.agent_lov_req_ctrl.Focus();
    }


    List(_type: string) {
        let SearchData = {
            searchstring: this.searchstring.toUpperCase(),
            pkid: '',
            company_code: this.gs.company_code,
            branch_code: this.gs.branch_code,
            user_category: this.gs.User_Category,
            user_role: this.gs.User_Role,
            user_customer_id: this.gs.User_Customer_Id,
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
                this.record = <Tbl_cargo_ehbld>response.record;
                this.mode = 'EDIT';
                if (!this.gs.isBlank(this.agent_lov_req_ctrl))
                    this.agent_lov_req_ctrl.Focus();
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
        const saveRecord = <vm_Tbl_cargo_ehbld>{};
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
                    this.RefreshList(this.record);
                }
            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);
            });
    }

    RefreshList(_rec: Tbl_cargo_ehbld) {
        if (this.gs.isBlank(this.records))
            return;
        if (this.records == null)
            return;
        var REC = this.records.find(rec => rec.ebld_pkid == _rec.ebld_pkid);
        if (REC == null) {
            this.records.push(_rec);
        }
        else {
            REC.ebld_approved = _rec.ebld_approved;
            REC.ebld_req_nos = _rec.ebld_req_nos;
            REC.ebld_req_start_no = _rec.ebld_req_start_no;
            REC.ebld_req_end_no = _rec.ebld_req_end_no;
        }
    }
    private Allvalid(): boolean {

        var bRet = true;
        this.errorMessage = "";
        if (this.gs.isZero(this.record.ebld_req_nos)) {
            bRet = false;
            this.errorMessage = "No of BLs Required Cannot be Blank";
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
            this.record.ebld_agent_id = _Record.id;
            this.record.ebld_agent_code = _Record.code;
            this.record.ebld_agent_name = _Record.name;
            if (!this.gs.isBlank(this.ebld_req_nos_ctrl))
                this.ebld_req_nos_ctrl.nativeElement.focus();
        }
        if (_Record.controlname == "AGENT2") {
            this.download_agent_id = _Record.id;
            this.download_agent_code = _Record.code;
            this.download_agent_name = _Record.name;
            this.GetBalanceBL(_Record.id)
            // this.liner_lov_field.Focus();
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
            //   case 'cust_title': {
            //     this.record.cust_title = this.record.cust_title.toUpperCase();
            //     break;
            //   }
            //   case 'cntr_pieces': {
            //     rec.cntr_pieces = this.gs.roundNumber(rec.cntr_pieces, 0);
            //     break;
            //   }
        }
    }


    Approve(_rec: Tbl_cargo_ehbld) {

        if (!confirm("Approve  " + _rec.ebld_agent_name)) {
            return;
        }

        const saveRecord = <vm_Tbl_cargo_ehbld>{};
        saveRecord.record = _rec;
        saveRecord.pkid = '';
        saveRecord.userinfo = this.gs.UserInfo;
        this.mainService.Approve(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.errorMessage = response.error;
                    alert(this.errorMessage);
                }
                else {

                    this.errorMessage = 'Save Complete';
                    // alert(this.errorMessage);
                    _rec.ebld_approved = true;
                    _rec.ebld_req_start_no = response.req_startno;
                    _rec.ebld_req_end_no = response.req_endno;
                    this.RefreshList(_rec);
                }
            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);
            });
    }

    DeleteRow(_rec: Tbl_cargo_ehbld) {

        if (_rec.ebld_approved) {
            this.errorMessage = "Cannot Delete, Approved";
            alert(this.errorMessage);
            return;
        }
        if (!confirm("DELETE " + _rec.ebld_agent_name + "(TOTAL BL REQUESTED " + _rec.ebld_req_nos + ")")) {
            return;
        }

        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = _rec.ebld_pkid;
        SearchData.remarks = _rec.ebld_agent_name + ", created " + _rec.rec_created_date;

        this.mainService.DeleteRecord(SearchData)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.errorMessage = response.error;
                    alert(this.errorMessage);
                }
                else {
                    this.records.splice(this.records.findIndex(rec => rec.ebld_pkid == _rec.ebld_pkid), 1);
                }

            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);

            });
    }

    GenerateValid() {

        this.errorMessage = '';
        if (this.gs.isBlank(this.download_agent_id)) {
            this.errorMessage = "Agent cannot be blank";
            alert(this.errorMessage);
            return;
        }
        if (this.gs.isZero(this.download_req_nos) || this.download_req_nos < 0) {
            this.errorMessage = "Invalid, No. of BLs to download";
            alert(this.errorMessage);
            return;
        }

        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.gs.getGuid();
        SearchData.download_agent_id = this.download_agent_id;
        SearchData.download_req_nos = this.download_req_nos;
        this.mainService.GenerateValid(SearchData)
            .subscribe(response => {
                if (response.retvalue == false) {
                    // this.errorMessage = response.error;
                    // alert(this.errorMessage);
                    alert(response.error);
                }
                else {
                    this.Generate();
                }

            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);

            });
    }
    Generate() {

        // this.report_title = 'HBL';
        // this.report_url = '/api/Master/EhblReq/GetBlankBLReport';
        // this.report_searchdata = this.gs.UserInfo;
        // this.report_searchdata.pkid = this.gs.getGuid();
        // this.report_searchdata.download_agent_id = this.download_agent_id;
        // this.report_searchdata.download_req_nos = this.download_req_nos;
        // this.report_menuid = this.menuid;
        // this.tab = 'report2';

        this.errorMessage = '';

        let remarks: string = '';
        remarks = this.download_agent_name + ', START# ' + this.starting_no.toString() + ', ENDING# ' + this.ending_no.toString();
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.gs.getGuid();
        SearchData.download_agent_id = this.download_agent_id;
        SearchData.download_req_nos = this.download_req_nos;
        SearchData.remarks = remarks;
        this.mainService.GetBlankBLReport(SearchData)
            .subscribe(response => {
                this.filename = response.filename;
                this.filetype = response.filetype;
                this.filedisplayname = response.filedisplayname;
                this.filename2 = response.filename2;
                this.filetype2 = response.filetype2;
                this.filedisplayname2 = response.filedisplayname2;
                this.now_printing_no = response.now_printing_no;
                this.tab = 'report2';


                if (!this.gs.isBlank(this.download_agent_id))
                    this.GetBalanceBL(this.download_agent_id);

            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);

            });


    }

    callbackevent(event: any) {
        this.tab = 'main';
        if (!this.gs.isBlank(this.download_agent_id))
            this.GetBalanceBL(this.download_agent_id);
    }

    GetBalanceBL(_agentid: string) {

        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.agentid = _agentid;
        this.mainService.GetBalanceBL(SearchData)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.errorMessage = response.error;
                    alert(this.errorMessage);
                }
                else {
                    this.starting_no = response.starting_no;
                    this.running_no = response.running_no;
                    this.ending_no = response.ending_no;
                    this.balance_no = response.balance_no;
                }

            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);

            });
    }

    pageEvents(actions: any) {

        this.pageQuery = <PageQuery>{ action: actions.action, page_count: actions.pageQuery.page_count, page_current: actions.pageQuery.page_current, page_rows: actions.pageQuery.page_rows }
        this.List('PAGE');
    }

    Cancel() {
        this.tab = 'main';
        if (!this.gs.isBlank(this.download_agent_id))
            this.GetBalanceBL(this.download_agent_id);
    }

    GetBLBackside() {

        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.gs.getGuid();
        this.mainService.GetBLBackside(SearchData)
            .subscribe(response => {
                this.filename = response.filename;
                this.filetype = response.filetype;
                this.filedisplayname = response.filedisplayname;
                this.now_printing_no = "";
                //this.tab = 'report2';
                 this.PrintPdf();
            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);

            });

    }

    PrintPdf() {

        this.gs.getFile(this.gs.GLOBAL_REPORT_FOLDER, this.filename, this.filetype, this.filedisplayname).subscribe(response => {

            var file = new Blob([response], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            printJS(fileURL);

        }, error => {
            this.errorMessage = this.gs.getError(error);
            alert(this.errorMessage);
        });

    }
}

