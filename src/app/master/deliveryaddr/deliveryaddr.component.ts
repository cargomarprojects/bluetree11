import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { InputBoxComponent } from '../../shared/input/inputbox.component';
//import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { DeliveryAddrService } from '../services/deliveryaddr.service';
import { User_Menu } from '../../core/models/menum';
import { Tbl_Mast_Addressm, vm_Tbl_Mast_Addressm } from '../models/Tbl_Mast_Addressm';
import { SearchTable } from '../../shared/models/searchtable';
import { strictEqual } from 'assert';

@Component({
    selector: 'app-deliveryaddr',
    templateUrl: './deliveryaddr.component.html'
})
export class DeliveryAddrComponent implements OnInit {

    // @ViewChild('request_to_code') request_to_code_ctrl: AutoComplete2Component;
    // @ViewChild('request_to_name') request_to_name_ctrl: InputBoxComponent;
    // @ViewChild('cargo_loc_name') cargo_loc_name_ctrl: InputBoxComponent;
    record: Tbl_Mast_Addressm = <Tbl_Mast_Addressm>{};

    // 15-07-2019 Created By Ajith  

    private pkid: string;
    private menuid: string;
    private mode: string;
    private title: string = '';
    private isAdmin: boolean;

    errorMessage: string;

    is_locked: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        private mainService: DeliveryAddrService,
    ) { }

    ngOnInit() {
        const options = JSON.parse(this.route.snapshot.queryParams.parameter);
        this.pkid = options.pkid;
        this.menuid = options.menuid;
        this.mode = 'EDIT';
        this.initPage();
        this.actionHandler();
    }

    private initPage() {
        this.title = '';
        this.isAdmin = this.gs.IsAdmin(this.menuid);
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
            this.record = <Tbl_Mast_Addressm>{};
            this.init();
        }
        if (this.mode == 'EDIT') {
            this.GetRecord();
        }
    }

    init() {

        this.record.add_pkid = this.gs.getGuid();
        this.record.add_parent_id = this.pkid;
        this.record.add_address1 = '';
        this.record.add_address2 = '';
        this.record.add_address3 = '';
        this.record.add_location = '';
        this.record.add_state = '';
        this.record.add_tel = '';
        this.record.add_contact = '';
        this.record.add_is_same = "N";

        // this.request_to_code_ctrl.Focus();

    }

    GetRecord() {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.mode = response.mode;
                if (this.mode == 'ADD') {
                    this.actionHandler();
                }
                else {
                    this.record = <Tbl_Mast_Addressm>response.record;
                }
            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }


    Save() {

        if (!this.Allvalid())
            return;

        this.record.add_pkid = this.gs.getGuid();
        this.record.add_parent_id = this.pkid;
        
        const saveRecord = <vm_Tbl_Mast_Addressm>{};
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
        if (this.gs.isBlank(this.record.add_address1)) {
            bRet = false;
            this.errorMessage = "Address cannot be empty";
            alert(this.errorMessage);
            //  this.request_to_code_ctrl.Focus();
            return bRet;
        }

        return bRet;
    }


    Close() {
        this.location.back();
    }


    LovSelected(_Record: SearchTable) {

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
