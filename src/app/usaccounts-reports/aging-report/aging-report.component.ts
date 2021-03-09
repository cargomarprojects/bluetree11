import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { UsAccountReportService } from '../services/usaccounts-report.service';
import { Tbl_OS_REPORT } from '../models/Tbl_OS_Report';
import { SearchTable } from '../../shared/models/searchtable';


import { Store, State, select } from '@ngrx/store';
import *  as myActions from './store/aging-report.actions';
import *  as myReducer from './store/aging-report.reducer';
import { ReportState } from './store/aging-report.models'

import { Observable } from 'rxjs';

@Component({
    selector: 'app-aging-report',
    templateUrl: './aging-report.component.html',
})
export class AgingReportComponent implements OnInit {

    title: string = 'Aging Report';

    pkid: string;
    urlid: string;
    url: string;
    menuid: string;

    currentTab: string = '';

    report_url: string;
    report_searchdata: any = {};
    report_menuid: string;



    edate: string;
    basedon: string;
    comp_type: string = '';
    report_arap: string = '';
    currency: string = '';
    radio_cust: string = 'MASTER';
    showall: boolean = false;
    cust_name: string = '';
    show_advance: boolean = false;
    group_by_parent: boolean = false;
    report_type: string = '';
    radio_days: string = '30to60';
    filename: string = '';
    filetype: string = '';
    filedisplayname: string = '';
    filename2: string = '';
    filetype2: string = '';
    filedisplayname2: string = '';

    jv_year: string = this.gs.year_code;
    comp_code: string = '';
    comp_name: string = '';
    cust_id: string = '';
    iscustomer: string = 'N';
    isparent: string = 'N';
    hide_payroll: string = 'N';

    page_count: number = 0;
    page_current: number = 0;
    page_rows: number = 0;
    page_rowcount: number = 0;

    storesub: any;
    sub: any;
    tab: string = 'main';

    loading: boolean = false;
    errorMessage: string = '';


    SearchData: any = {};

    Reportstate1: Observable<ReportState>;

    MainList: Tbl_OS_REPORT[];

    constructor(
        public gs: GlobalService,
        private router: Router,
        private activatedroute: ActivatedRoute,
        private location: Location,
        private store: Store<myReducer.AppState>,
        private mainservice: UsAccountReportService
    ) {
        this.sub = this.activatedroute.queryParams.subscribe(params => {
            this.urlid = params.id;
            this.menuid = params.menuid;
            this.title = this.gs.getTitle(this.menuid);
            this.InitPage();
        });
    }

    InitPage() {

        this.storesub = this.store.select(myReducer.getState(this.urlid)).subscribe(rec => {
            this.initLov();
            if (rec) {

                this.MainList = rec.records;
                this.pkid = rec.pkid;
                this.currentTab = rec.currentTab;


                this.jv_year = rec.jv_year;
                this.edate = rec.edate;
                this.basedon = rec.basedon;
                this.comp_type = rec.comp_type;
                this.comp_code = rec.comp_code;
                this.comp_name = rec.comp_name;
                this.report_arap = rec.report_arap;
                this.currency = rec.currency;
                this.radio_cust = rec.radio_cust;
                this.showall = rec.showall;
                this.cust_name = rec.cust_name;
                this.cust_id = rec.cust_id;
                this.show_advance = rec.show_advance;
                this.group_by_parent = rec.group_by_parent;
                this.report_type = rec.report_type;
                this.radio_days = rec.radio_days;
                this.iscustomer = rec.iscustomer;
                this.isparent = rec.isparent;
                this.hide_payroll = rec.hide_payroll;

                this.filename = rec.filename;
                this.filetype = rec.filetype;
                this.filedisplayname = rec.filedisplayname;
                this.filename2 = rec.filename2;
                this.filetype2 = rec.filetype2;
                this.filedisplayname2 = rec.filedisplayname2;

                this.page_rows = rec.page_rows;
                this.page_count = rec.page_count;
                this.page_current = rec.page_current;
                this.page_rowcount = rec.page_rowcount;


                this.SearchData = this.gs.UserInfo;
                this.SearchData.JV_YEAR = this.jv_year;
                this.SearchData.EDATE = this.edate;
                this.SearchData.COMP_TYPE = this.comp_type;
                if (this.comp_type == 'ALL')
                    this.SearchData.COMP_CODE = this.gs.branch_codes;
                else
                    this.SearchData.COMP_CODE = this.comp_type;
                this.SearchData.COMP_NAME = this.comp_name;
                this.SearchData.CUST_ID = this.cust_id;
                this.SearchData.ARAP = this.report_arap;
                this.SearchData.RPTTYPE = this.report_type;
                this.SearchData.SHOWALL = this.showall == true ? 'Y' : 'N';

                this.SearchData.ISCUSTOMER = this.radio_cust === 'MASTER' ? 'Y' : 'N';
                this.SearchData.ISPARENT = this.group_by_parent == true ? 'Y' : 'N';
                this.SearchData.SHOW_ADVANCE = this.show_advance == true ? 'Y' : 'N';

                this.SearchData.BASEDON = this.basedon;

                this.SearchData.HIDE_PAYROLL = this.gs.user_hide_payroll;

                if (this.currency == undefined || this.currency === '')
                    this.currency = this.gs.base_cur_code;

                if (this.gs.IS_SINGLE_CURRENCY == true || this.currency.trim().length <= 0 || this.currency == this.gs.base_cur_code)
                    this.SearchData.CURRENCY = '';
                else
                    this.SearchData.CURRENCY = this.currency;


            }
            else {
                this.MainList = Array<Tbl_OS_REPORT>();

                this.page_rows = this.gs.ROWS_TO_DISPLAY;
                this.page_count = 0;
                this.page_current = 0;
                this.page_rowcount = 0;

                this.currentTab = 'LIST';

                this.jv_year = this.gs.year_code;
                this.edate = this.gs.defaultValues.today;
                this.basedon = 'INVOICE DATE';
                this.comp_type = this.gs.branch_code;
                this.comp_code = this.gs.branch_code;
                this.comp_name = this.gs.branch_name;
                this.report_arap = 'AR';
                this.currency = '';
                this.radio_cust = 'MASTER';
                this.showall = false;
                this.cust_name = '';
                this.cust_id = '';
                this.show_advance = false;
                this.group_by_parent = false;
                this.report_type = 'SUMMARY';
                this.radio_days = '30to60';
                this.iscustomer = 'N';
                this.isparent = 'N';
                this.hide_payroll = this.gs.user_hide_payroll;
                this.filename = '';
                this.filetype = '';
                this.filedisplayname = '';
                this.filename2 = '';
                this.filetype2 = '';
                this.filedisplayname2 = '';
                
                this.SearchData = this.gs.UserInfo;

            }
        });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        this.storesub.unsubscribe();
    }

    PageEvents(actions) {
        this.List(actions.outputformat, actions.action);
    }

    List(_outputformat: string, _action: string = 'NEW') {


        this.errorMessage = '';
        // if (this.topnum <= 0) {
        //   this.errorMessage = 'Invalid Top Value';
        //   alert(this.errorMessage);
        //   return;
        // }


        this.SearchData.outputformat = _outputformat;
        this.SearchData.pkid = this.urlid;
        this.SearchData.action = _action;
        this.SearchData.page_count = this.page_count;
        this.SearchData.page_current = this.page_current;
        this.SearchData.page_rows = this.page_rows;
        this.SearchData.page_rowcount = this.page_rowcount;

        if (_outputformat == "SCREEN" && _action == 'NEW') {

            this.SearchData.JV_YEAR = this.gs.year_code;
            this.SearchData.EDATE = this.edate;
            this.SearchData.COMP_TYPE = this.comp_type;
            if (this.comp_type == 'ALL')
                this.SearchData.COMP_CODE = this.gs.branch_codes;
            else
                this.SearchData.COMP_CODE = this.comp_type;
            this.SearchData.COMP_NAME = this.comp_name;
            this.SearchData.CUST_ID = this.cust_id;
            this.SearchData.ARAP = this.report_arap;
            this.SearchData.RPTTYPE = this.report_type;
            this.SearchData.SHOWALL = this.showall == true ? 'Y' : 'N';

            this.SearchData.ISCUSTOMER = this.radio_cust === 'MASTER' ? 'Y' : 'N';
            this.SearchData.ISPARENT = this.group_by_parent == true ? 'Y' : 'N';
            this.SearchData.SHOW_ADVANCE = this.show_advance == true ? 'Y' : 'N';

            this.SearchData.BASEDON = this.basedon;
            this.SearchData.radio_cust = this.radio_cust;
            this.SearchData.radio_days = this.radio_days;

            this.SearchData.HIDE_PAYROLL = this.gs.user_hide_payroll;

            if (this.currency == undefined || this.currency === '')
                this.currency = this.gs.base_cur_code;

            if (this.gs.IS_SINGLE_CURRENCY == true || this.currency.trim().length <= 0 || this.currency == this.gs.base_cur_code)
                this.SearchData.CURRENCY = '';
            else
                this.SearchData.CURRENCY = this.currency;
        }

        this.loading = true;

        this.mainservice.AgingReport(this.SearchData)
            .subscribe(response => {

                if (_outputformat == "SCREEN") {

                    if (_action == "NEW") {
                        this.SearchData.filename = response.filename;
                        this.SearchData.filedisplayname = response.filedisplayname;
                        this.SearchData.filetype = response.filetype;
                        this.SearchData.filename2 = response.filename2;
                        this.SearchData.filedisplayname2 = response.filedisplayname2;
                        this.SearchData.filetype2 = response.filetype2;
                    }
                    const state: ReportState = {
                        pkid: this.pkid,
                        urlid: this.urlid,
                        menuid: this.menuid,
                        currentTab: this.currentTab,
                        jv_year: this.gs.year_code,
                        edate: this.SearchData.EDATE,
                        basedon:this.SearchData.BASEDON,
                        comp_type:this.SearchData.COMP_TYPE,
                        comp_code:this.SearchData.COMP_CODE,
                        comp_name:this.SearchData.COMP_NAME,
                        report_arap:this.SearchData.ARAP,
                        currency: this.SearchData.CURRENCY,
                        radio_cust:this.SearchData.ISCUSTOMER=='Y'?'MASTER':'OVERSEAAGENT',
                        showall :this.SearchData.SHOWALL=='Y'?true:false,
                        cust_name:'',
                        cust_id:this.SearchData.CUST_ID,
                        show_advance:this.SearchData.SHOW_ADVANCE=='Y'?true:false,
                        group_by_parent:this.SearchData.ISPARENT=='Y'?true:false, 
                        report_type: this.SearchData.RPTTYPE,
                        radio_days : this.SearchData.radio_days,
                        iscustomer:this.SearchData.ISCUSTOMER,
                        isparent:this.SearchData.ISPARENT,
                        hide_payroll:this.SearchData.HIDE_PAYROLL,
                        page_rows: response.page_rows,
                        page_count: response.page_count,
                        page_current: response.page_current,
                        page_rowcount: response.page_rowcount,
                        records: response.list,
                        filename: this.SearchData.filename,
                        filetype: this.SearchData.filetype,
                        filedisplayname: this.SearchData.filedisplayname,
                        filename2: this.SearchData.filename2,
                        filetype2: this.SearchData.filetype2,
                        filedisplayname2: this.SearchData.filedisplayname2

                    };
                    this.store.dispatch(new myActions.Update({ id: this.urlid, changes: state }));
                }

                this.loading = false;
            }, error => {
                this.loading = false;
                this.errorMessage = error.error.error_description;
                alert(this.errorMessage);
            });
    }

    Close() {
        this.store.dispatch(new myActions.Delete({ id: this.urlid }));
        this.location.back();
    }

    initLov(caption: string = '') {


    }

    LovSelected(_Record: SearchTable) {

        this.cust_id = _Record.id;
        this.cust_name = _Record.name;
    }
    OnChange(field: string) {
        if (field == 'report_category') {
            try {
                // if (this.report_category == "SHIPPER" || this.report_category == "CONSIGNEE" ||
                //     this.report_category == "OVERSEAS AGENT" || this.report_category == "POL" ||
                //     this.report_category == "POD") {
                //     this.radio_exp = 'REVENUE';
                //     this.radio_Visibility = true;
                // }
                // else {
                //     this.radio_exp = 'EXPENSE';
                //     this.radio_Visibility = false;
                // }
            }
            catch (Exception) {
            }
        }
    }

    
    Print() {
        this.errorMessage = "";
        if (this.MainList.length <= 0) {
            this.errorMessage = "List Not Found";
            alert(this.errorMessage);
            return;
        }
        this.report_url = '';
        this.report_searchdata = this.gs.UserInfo;
        this.report_searchdata.pkid = '';
        this.report_menuid = this.menuid;
        this.tab = 'report';
    }

    callbackevent() {
        this.tab = 'main';
    }

    onBlur(field: string = '') {

    }
}
