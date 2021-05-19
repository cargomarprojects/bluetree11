import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { InputBoxComponent } from '../../shared/input/inputbox.component';
//import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { EhblService } from '../services/ehbl.service';
import { User_Menu } from '../../core/models/menum';
import { Tbl_cargo_ehbld, vm_Tbl_cargo_ehbl, Tbl_cargo_ehbl } from '../models/Tbl_cargo_ehbl';
import { SearchTable } from '../../shared/models/searchtable';


@Component({
    selector: 'app-ehbl',
    templateUrl: './ehbl.component.html'
})
export class EhblComponent implements OnInit {

    // @ViewChild('request_to_code') request_to_code_ctrl: AutoComplete2Component;
    // @ViewChild('request_to_name') request_to_name_ctrl: InputBoxComponent;
    // @ViewChild('cargo_loc_name') cargo_loc_name_ctrl: InputBoxComponent;
    record: Tbl_cargo_ehbl = <Tbl_cargo_ehbl>{};
    records: Tbl_cargo_ehbl[] = [];
    // 15-07-2019 Created By Ajith  
    currentTab = 'LIST';
    private pkid: string;
    private menuid: string;
    private mode: string = '';
    public title: string = '';
    public isAdmin: boolean;

    errorMessage: string;

    is_locked: boolean = false;
    searchstring: string = '';

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        private mainService: EhblService,
    ) { }

    ngOnInit() {
        this.currentTab = 'LIST';
        if (this.route.snapshot.queryParams.parameter == null) {
            this.pkid = this.route.snapshot.queryParams.pkid;
            this.menuid = this.route.snapshot.queryParams.menuid;
        } else {
            const options = JSON.parse(this.route.snapshot.queryParams.parameter);
            this.pkid = options.pkid;
            this.menuid = options.menuid;
        }

        this.initPage();
        this.List("NEW");
    }

    private initPage() {
        this.title = 'E-hbl Setting';
        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.errorMessage = '';
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
        this.record.rec_mode = this.mode;

    }


    List(_type: string) {


        let SearchData = {
            searchstring: this.searchstring.toUpperCase(),
            agentid: '',
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,

        };

        this.errorMessage = '';
        this.mainService.List(SearchData)
            .subscribe(response => {

                this.records = response.list;

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
                this.mode = 'EDIT';
            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }


    Save() {

        if (!this.Allvalid())
            return;

        // this.record.add_pkid = this.gs.getGuid();
        // this.record.add_parent_id = this.pkid;

        const saveRecord = <vm_Tbl_cargo_ehbl>{};
        saveRecord.record = this.record;
        saveRecord.pkid = this.pkid;
        saveRecord.userinfo = this.gs.UserInfo;

        this.mainService.Save(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.errorMessage = response.error;
                    alert(this.errorMessage);
                }
                else {
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
        // if (this.gs.isBlank(this.record.add_address1)) {
        //     bRet = false;
        //     this.errorMessage = "Address cannot be empty";
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

}
