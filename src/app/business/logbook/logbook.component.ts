import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { Table_User_Logbook } from '../models/table_user_logbook';
import { LogBookService } from '../services/logbook.service';
import { User_Menu } from '../../core/models/menum';
import { strictEqual } from 'assert';

@Component({
    selector: 'app-logbook',
    templateUrl: './logbook.component.html'
})
export class LogBookComponent implements OnInit {

    //@ViewChild('mbl_no') mbl_no_field: ElementRef;

    // 15-07-2019 Created By Ajith  

    public ismodal = false;
    @Input() set modalview(value: boolean) {
        this.ismodal = value;
    }
    menuid = '';
    @Input() set setmenuid(value: string) {
        this.menuid = value;
    }
    pkid = '';
    @Input() set setpkid(value: string) {
        this.pkid = value;
    }
    source = '';
    @Input() set setsource(value: string) {
        this.source = value;
    }
    title = '';
    @Input() set settitle(value: string) {
        this.title = value;
    }

    records: Table_User_Logbook[] = [];
    mode = '';
    isAdmin = false;
    errorMessage = '';
    is_locked = false;
    report_format = 'LOGBOOK';

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        private mainService: LogBookService
    ) { }

    ngOnInit() {

        if (!this.ismodal) {
            const options = JSON.parse(this.route.snapshot.queryParams.parameter);
            this.menuid = options.menuid;
            this.pkid = options.pkid;
            this.source = options.source;
            this.title = options.title;
        }
        this.initPage();
        this.actionHandler();
    }

    private initPage() {
        this.gs.checkAppVersion();
        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.errorMessage = '';
        this.LoadCombo();
    }

    LoadCombo() {
        if (this.source === "INVOICE")
            this.report_format = "INVOICE";
        else if (this.source === "QUOTATION-LCL-RATE")
            this.report_format = "QUOTATION-LCL-RATE";
        else
            this.report_format = "LOGBOOK";
    }

    actionHandler() {
        this.List();
    }

    init() {

    }

    List() {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        SearchData.source = this.source;
        this.mainService.List(SearchData).subscribe(response => {
            this.records = <Table_User_Logbook[]>response.records;
        }, error => {
            this.errorMessage = this.gs.getError(error);
        });
    }


    OnChange(field: string) {

    }

    onBlur(field: string) {
        switch (field) {
            // case 'remarks': {
            //   this.record.remarks = this.record.remarks.toUpperCase();
            //   break;
            // }
        }
    }

    Close() {
        this.location.back();
    }

}
