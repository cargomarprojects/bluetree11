import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { User_Menu } from '../../core/models/menum';
import { SearchTable } from '../../shared/models/searchtable';
import { strictEqual } from 'assert';
import { MawbPageService } from '../services/mawbpage.service';
import { Tbl_cargo_exp_mbldet } from '../models/tbl_cargo_exp_mbldet';

@Component({
    selector: 'app-manifestpage',
    templateUrl: './manifestpage.component.html'
})
export class ManifestPageComponent implements OnInit {

    // @ViewChild('mbl_no') mbl_no_field: ElementRef;

    // 15-07-2019 Created By Ajith  

    tab: string = 'main';
    report_title: string = '';
    report_url: string = '';
    report_searchdata: any = {};
    report_menuid: string = '';


    private pkid: string;
    private menuid: string;
    private mode: string;
    private title: string = '';
    private isAdmin: boolean;
    private mbl_no: string = '';
    private mbl_refno: string = '';

    IsMaster: boolean = false;

    FM_ID: string = '';
    FM_CODE: string = '';
    FM_NAME: string = '';
    FM_ADDR1: string = '';
    FM_ADDR2: string = '';
    FM_ADDR3: string = '';
    FM_ADDR4: string = '';

    TO_ID: string = '';
    TO_CODE: string = '';
    TO_NAME: string = '';
    TO_ADDR1: string = '';
    TO_ADDR2: string = '';
    TO_ADDR3: string = '';
    TO_ADDR4: string = '';

    record: Tbl_cargo_exp_mbldet = <Tbl_cargo_exp_mbldet>{};

    private errorMessage: string[] = [];


    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        private mainService: MawbPageService,
    ) { }

    ngOnInit() {
        const options = JSON.parse(this.route.snapshot.queryParams.parameter);
        this.pkid = options.pkid;
        this.menuid = options.menuid;
        this.mbl_no = options.mbl_no;
        this.mbl_refno = options.mbl_refno;
        this.initPage();
        this.actionHandler();
    }

    private initPage() {
        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.errorMessage = [];
        this.LoadCombo();
    }

    LoadCombo() {

    }


    actionHandler() {
        this.GetManifestRecord();
    }

    GetManifestRecord() {

        this.errorMessage = [];
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        this.mainService.GetManifestRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_cargo_exp_mbldet>response.record;

                if (this.record != null) {
                    this.FM_NAME = this.record.mbld_shipper_name;
                    this.FM_ADDR1 = this.record.mbld_shipper_add1;
                    this.FM_ADDR2 = this.record.mbld_shipper_add2;
                    this.FM_ADDR3 = "";
                    this.FM_ADDR4 = this.record.mbld_shipper_add3;

                    this.TO_NAME = this.record.mbld_consigned_to1;
                    this.TO_ADDR1 = this.record.mbld_consigned_to2;
                    this.TO_ADDR2 = this.record.mbld_consigned_to3;
                    this.TO_ADDR3 = "";
                    this.TO_ADDR4 = this.record.mbld_consigned_to4;
                }

            }, error => {
                this.errorMessage.push(this.gs.getError(error));

            });
    }


    Close() {
        this.location.back();
    }


    LovSelected(_Rec: SearchTable) {

        if (_Rec.controlname == "CONSOLIDATOR") {
            this.record.mbld_shipper_id = _Rec.id;
            this.record.mbld_shipper_code = _Rec.code;
            this.record.mbld_shipper_name = _Rec.name;

            this.FM_NAME = _Rec.name;
            this.FM_ADDR1 = _Rec.col1;
            this.FM_ADDR2 = _Rec.col2;
            this.FM_ADDR3 = _Rec.col3;
            this.FM_ADDR4 = this.gs.GetTelFax(_Rec.col6, _Rec.col7);
        }

        if (_Rec.controlname == "DECONSOLIDATOR") {
            this.record.mbld_consignee_id = _Rec.id;
            this.record.mbld_consignee_code = _Rec.code;
            this.record.mbld_consigned_to1 = _Rec.name;

            this.TO_NAME = _Rec.name;
            this.TO_ADDR1 = _Rec.col1;
            this.TO_ADDR2 = _Rec.col2;
            this.TO_ADDR3 = _Rec.col3;
            this.TO_ADDR4 = this.gs.GetTelFax(_Rec.col6, _Rec.col7);

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

        }
    }

    BtnNavigation(action: string) {

        switch (action) {

            case 'MANIFEST': {
                this.report_title = 'Air Cargo Manifest';
                this.report_url = '/api/AirExport/MawbPage/GetManifestReport';
                this.report_searchdata = this.gs.UserInfo;
                this.report_searchdata.pkid = this.pkid;
                this.report_searchdata.ISMASTER = this.IsMaster ? "Y" : "N";
                this.report_searchdata.FM_NAME = this.FM_NAME;
                this.report_searchdata.FM_ADDR1 = this.FM_ADDR1;
                this.report_searchdata.FM_ADDR2 = this.FM_ADDR2;
                this.report_searchdata.FM_ADDR3 = this.FM_ADDR3;
                this.report_searchdata.FM_ADDR4 = this.FM_ADDR4;
                this.report_searchdata.TO_NAME = this.TO_NAME;
                this.report_searchdata.TO_ADDR1 = this.TO_ADDR1;
                this.report_searchdata.TO_ADDR2 = this.TO_ADDR2;
                this.report_searchdata.TO_ADDR3 = this.TO_ADDR3;
                this.report_searchdata.TO_ADDR4 = this.TO_ADDR4;

                this.report_menuid = this.gs.MENU_AE_MASTER_MANIFEST;

                this.tab = 'report';
                break;
            }


        }
    }
    callbackevent(event: any) {
        this.tab = 'main';
    }

}
