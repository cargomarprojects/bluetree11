import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/services/global.service';

import { AutoComplete2Component } from '../../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../../shared/input/inputbox.component';

import { WhProductService } from '../../services/whproductm.service';
import { vm_Tbl_wh_productm, Tbl_wh_productm } from '../../models/Tbl_wh_productm';
import { SearchTable } from '../../../shared/models/searchtable';

declare var $: any;

@Component({
    selector: 'app-wh-product-edit',
    templateUrl: './wh-product-edit.component.html'
})
export class WhProductEditComponent implements OnInit {

    public _pkid: string = "";
    @Input() set pkid(value: string) {
        this._pkid = value;
    }

    public _menuid: string = "";
    @Input() set menuid(value: string) {
        this._menuid = value;
    }

    public _mode: string = "";
    @Input() set mode(value: string) {
        this._mode = value;
    }


    record: Tbl_wh_productm = <Tbl_wh_productm>{};

    tab: string = 'main';

    errorMessage: string;

    title: string = 'Product Master';
    isAdmin: boolean;
    refno: string = "";

    where = "";


    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainService: WhProductService,
    ) { }


    ngOnInit() {
        this.gs.checkAppVersion();
        // if (this.route.snapshot.queryParams.parameter == null) {
        //     this.pkid = this.route.snapshot.queryParams.pkid;
        //     this.menuid = this.route.snapshot.queryParams.menuid;
        //     this.mode = this.route.snapshot.queryParams.mode;
        // }
        // else {
        //     const options = JSON.parse(this.route.snapshot.queryParams.parameter);
        //     this.pkid = options.pkid;
        //     this.menuid = options.menuid;
        //     this.mode = options.mode;
        // }
        this.initPage();
        this.actionHandler();

        $(function () {
            $('.modal-dialog').draggable();
        });
    }

    private initPage() {
        this.isAdmin = this.gs.IsAdmin(this._menuid);
        this.title = this.gs.getTitle(this._menuid);
        this.errorMessage = '';
        this.LoadCombo();
    }

    LoadCombo() {

    }

    NewRecord() {
        this._mode = 'ADD'
        this.actionHandler();
    }

    actionHandler() {
        this.errorMessage = '';
        if (this._mode == 'ADD') {
            this.record = <Tbl_wh_productm>{};
            this._pkid = this.gs.getGuid();
            this.init();
        }
        if (this._mode == 'EDIT') {
            this.GetRecord();
        }
    }

    init() {

        this.record.prod_pkid = this._pkid;
        this.record.prod_code = '';
        this.record.prod_name = '';

        this.record.rec_created_by = this.gs.user_code;
        this.record.rec_created_date = this.gs.defaultValues.today;

    }

    GetRecord() {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this._pkid;
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_wh_productm>response.record;
                this._mode = 'EDIT';
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
        const saveRecord = <vm_Tbl_wh_productm>{};
        saveRecord.record = this.record;
        saveRecord.pkid = this._pkid;
        saveRecord.mode = this._mode;
        saveRecord.userinfo = this.gs.UserInfo;


        this.mainService.Save(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.errorMessage = response.error;
                    alert(this.errorMessage);
                }
                else {
                    this._mode = 'EDIT';
                    this.mainService.RefreshList(this.record);
                    alert('Save Complete');
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

        if (this.gs.isBlank(this._pkid)) {
            bRet = false;
            this.errorMessage = "Invalid ID";
            alert(this.errorMessage);
            return bRet;
        }

        if (this.gs.isBlank(this.record.prod_code)) {
            bRet = false;
            this.errorMessage = "Code Cannot be blank";
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
        if (field == 'prod_code') {
            this.record.prod_code = this.record.prod_code.toString().toUpperCase().trim();
        }
        if (field == 'prod_name') {
            this.record.prod_name = this.record.prod_name.toString().toUpperCase().trim();
        }
    }

}
