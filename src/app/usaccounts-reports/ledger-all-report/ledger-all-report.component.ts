import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { UsAccountReportService } from '../services/usaccounts-report.service';
import { Tbl_acc_ledger } from '../models/Tbl_acc_ledger';
import { SearchTable } from '../../shared/models/searchtable';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-ledger-all-report',
    templateUrl: './ledger-all-report.component.html'
})
export class LedgerAllReportComponent implements OnInit {

    title = 'Ledger ALL';
    pkid: string;
    urlid: string;
    url: string;
    menuid: string;
    currentTab = '';

    report_title: string;
    report_url: string;
    report_searchdata: any = {};
    report_menuid: string;

    fdate: string;
    tdate: string;
    cust_id: string;
    cust_name: string;
    comp_name: string = '';
    comp_code: string = '';
    radio_cust: string = 'LEDGER';
    is_ledger: string = 'Y';
    acc_parent_code: string = '';
    fy_start_month: number = 0;


    filename: string = '';
    filetype: string = '';
    filedisplayname: string = '';

    lov_where: string = "";

    sub: any;
    loading: boolean = false;
    errorMessage: string = '';
    SearchData: any = {};
    CompList: any[];


    constructor(
        public gs: GlobalService,
        private router: Router,
        private activatedroute: ActivatedRoute,
        private location: Location,
        private mainservice: UsAccountReportService
    ) {

        this.sub = this.activatedroute.queryParams.subscribe(params => {
            this.urlid = params.id;
            this.menuid = params.menuid;
            this.title = this.gs.getTitle(this.menuid);
            this.InitPage();
            this.LoadCompany();
        });

    }

    InitPage() {
        this.initLov();
        this.fdate = this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF);
        this.tdate = this.gs.defaultValues.today;
        this.comp_code = this.gs.branch_code;
        this.radio_cust = 'LEDGER';
        if (this.gs.FY_MONTHS.length > 0)
            this.fy_start_month = +this.gs.FY_MONTHS[0].code;
        else
            this.fy_start_month = +this.gs.FY_START_MONTH;
    }

    LoadCompany() {
        this.CompList = <any[]>[];
        this.gs.CompanyList.forEach(Rec => {
            if (Rec.comp_code != 'ALL')
                this.CompList.push(Rec);
        });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }



    Close() {
        this.location.back();
    }

    initLov(caption: string = '') {

    }

    LovSelected(_Record: SearchTable) {

    }

    Print() {

        let IS_LEDGER: string = "N";
        if (this.radio_cust === "LEDGER")
            IS_LEDGER = "Y";
        else if (this.radio_cust === "FIXEDASSET")
            IS_LEDGER = "F";
        else
            IS_LEDGER = "N";

        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.FDATE = this.fdate;
        SearchData.TDATE = this.tdate;
        SearchData.BRCODE = this.comp_code;
        SearchData.IS_LEDGER = IS_LEDGER;
        SearchData.FRONT_DATE_FORMAT = this.gs.FRONTEND_DATEFORMAT;
        SearchData.USERNAME = this.gs.user_code;
        SearchData.USERID = this.gs.MACADDRESS;
        SearchData.RETAINED_PROFIT = this.gs.RETAINED_PROFIT_ID;
        SearchData.FY_START_MONTH = this.fy_start_month;
        // SURL += "&FY_START_DATE=" + FY_START_DATE;
        // SURL += "&FY_END_DATE=" + FY_END_DATE;

        this.mainservice.LedgerAllReport(SearchData)
            .subscribe(response => {
                this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
            }, error => {
                this.errorMessage = this.gs.getError(error);
            });

    }

    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.GLOBAL_REPORT_FOLDER, filename, filetype, filedisplayname);
    }
}
