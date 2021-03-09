import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../shared/input/inputbox.component';

import { PayrollDetService } from '../services/payrolldet.service';
import { User_Menu } from '../../core/models/menum';
import { vm_Tbl_Cargo_Payrolldet, Tbl_Cargo_Payrolldet } from '../models/tbl_cargo_payrolldet';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
    selector: 'app-payrolldet-edit',
    templateUrl: './payrolldet-edit.component.html'
})
export class PayrollDetEditComponent implements OnInit {

    record: Tbl_Cargo_Payrolldet = <Tbl_Cargo_Payrolldet>{};

    tab: string = 'main';

    emp_name: string = '';
    pkid: string;
    menuid: string;
    public mode: string = '';
    errorMessage: string;
    Foregroundcolor: string;
    bValueChanged: Boolean = false;

    title: string;
    isAdmin: boolean;
    refno: string = "";

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainService: PayrollDetService,
    ) {
        // this.decplace = this.gs.foreign_amt_dec;
    }

    ngOnInit() {
        const options = JSON.parse(this.route.snapshot.queryParams.parameter);

        this.menuid = options.menuid;
        this.pkid = options.pkid;
        this.mode = options.mode;
        this.emp_name = options.emp_name;
        this.setup();
        this.initPage();
        this.actionHandler();
    }

    setup() {


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
            this.record = <Tbl_Cargo_Payrolldet>{};
            this.pkid = this.gs.getGuid();
            this.init();
        }
        if (this.mode == 'EDIT') {
            this.GetRecord();
        }
    }

    init() {

        this.record.cpd_pkid = this.pkid;
        this.record.A1 = 0;
        this.record.A2 = 0;
        this.record.A3 = 0;
        this.record.A4 = 0;
        this.record.A5 = 0;
        this.record.A6 = 0;
        this.record.A7 = 0;
        this.record.A8 = 0;

        this.record.D1 = 0;
        this.record.D2 = 0;
        this.record.D3 = 0;
        this.record.D4 = 0;
        this.record.D5 = 0;
        this.record.D6 = 0;
        this.record.D7 = 0;

        this.record.DTOT = 0;;
        this.record.ATOT = 0;
        this.record.NET = 0;
    }

    GetRecord() {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_Cargo_Payrolldet>response.record;
                this.mode = 'EDIT';
                this.errorMessage = "";
            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }

    Save() {

        this.FindTotal();

        if (!this.Allvalid())
            return;

        const saveRecord = <vm_Tbl_Cargo_Payrolldet>{};
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
                  //  alert(this.errorMessage);
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
        // if (this.gs.isBlank(this.record.obl_date)) {
        //     bRet = false;
        //     this.errorMessage = "Invalid Date";
        //     alert(this.errorMessage);
        //     return bRet;
        // }


        // if (this.gs.isBlank(this.record.obl_refno)) {
        //     bRet = false;
        //     this.errorMessage = "Invalid RefNo";
        //     alert(this.errorMessage);
        //     return bRet;
        // }

        // if (this.gs.isBlank(this.record.obl_houseno)) {
        //     bRet = false;
        //     this.errorMessage = "Invalid House";
        //     alert(this.errorMessage);
        //     return bRet;
        // }

        return bRet;
    }


    Close() {
        this.location.back();
    }


    LovSelected(_Record: SearchTable) {

        // if (_Record.controlname == "HANLEDBY") {
        //     this.record.obl_handled_id = _Record.id;
        //     this.record.obl_handled_code = _Record.code;
        //     this.record.obl_handled_name = _Record.name;
        // }

    }


    onChange(field: string) {
        this.bValueChanged = true;
    }

    onFocus(field: string) {
        this.bValueChanged = false;
    }

    onBlur(field: string) {
        // if (field == 'obl_refno') {
        //     if (this.record.obl_refno != this.oldrefno) {
        //         this.oldrefno = this.record.obl_refno;
        //         this.GetHouseDetails();
        //     }
        // }
        if (field == 'A1') {
            this.record.A1 = this.gs.roundNumber(this.record.A1, 2)
            this.FindTotal();
        }
        if (field == 'A2') {
            this.record.A2 = this.gs.roundNumber(this.record.A2, 2)
            this.FindTotal();
        }
        if (field == 'A3') {
            this.record.A3 = this.gs.roundNumber(this.record.A3, 2)
            this.FindTotal();
        }
        if (field == 'A4') {
            this.record.A4 = this.gs.roundNumber(this.record.A4, 2)
            this.FindTotal();
        }
        if (field == 'A5') {
            this.record.A5 = this.gs.roundNumber(this.record.A5, 2)
            this.FindTotal();
        }
        if (field == 'A6') {
            this.record.A6 = this.gs.roundNumber(this.record.A6, 2)
            this.FindTotal();
        }
        if (field == 'A7') {
            this.record.A7 = this.gs.roundNumber(this.record.A7, 2)
            this.FindTotal();
        }
        if (field == 'A8') {
            this.record.A8 = this.gs.roundNumber(this.record.A8, 2)
            this.FindTotal();
        }

        if (field == 'D1') {
            this.record.D1 = this.gs.roundNumber(this.record.D1, 2)
            this.FindTotal();
        }
        if (field == 'D2') {
            this.record.D2 = this.gs.roundNumber(this.record.D2, 2)
            this.FindTotal();
        }
        if (field == 'D3') {
            this.record.D3 = this.gs.roundNumber(this.record.D3, 2)
            this.FindTotal();
        }
        if (field == 'D4') {
            this.record.D4 = this.gs.roundNumber(this.record.D4, 2)
            this.FindTotal();
        }
        if (field == 'D5') {
            this.record.D5 = this.gs.roundNumber(this.record.D5, 2)
            this.FindTotal();
        }
        if (field == 'D6') {
            this.record.D6 = this.gs.roundNumber(this.record.D6, 2)
            this.FindTotal();
        }
        if (field == 'D7') {
            this.record.D7 = this.gs.roundNumber(this.record.D7, 2)
            this.FindTotal();
        }
    }

    FindTotal() {

        if (this.bValueChanged == false)
            return;

        this.record.ATOT = 0;
        this.record.DTOT = 0;
        this.record.NET = 0;

        this.record.ATOT = this.record.A1;
        this.record.ATOT += this.record.A2;
        this.record.ATOT += this.record.A3;
        this.record.ATOT += this.record.A4;
        this.record.ATOT += this.record.A5;
        this.record.ATOT += this.record.A6;
        this.record.ATOT += this.record.A7;
        this.record.ATOT += this.record.A8;

        this.record.DTOT = this.record.D1;
        this.record.DTOT += this.record.D2;
        this.record.DTOT += this.record.D3;
        this.record.DTOT += this.record.D4;
        this.record.DTOT += this.record.D5;
        this.record.DTOT += this.record.D6;
        this.record.DTOT += this.record.D7;

        this.record.ATOT = this.gs.roundNumber(this.record.ATOT, 2);
        this.record.DTOT = this.gs.roundNumber(this.record.DTOT, 2);

        this.record.NET = this.record.ATOT - this.record.DTOT;
        this.record.NET = this.gs.roundNumber(this.record.NET, 2);
    }







}
