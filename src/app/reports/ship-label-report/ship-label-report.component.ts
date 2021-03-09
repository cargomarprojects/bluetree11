import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { ReportService } from '../services/report.service';
import { TBL_LABELM } from '../models/tbl_label_report';
import { SearchTable } from '../../shared/models/searchtable';

import { Store, State, select } from '@ngrx/store';
import *  as myActions from './store/ship-label-report.actions';
import *  as myReducer from './store/ship-label-report.reducer';
import { ReportState } from './store/ship-label-report.models'

import { Observable } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';

@Component({
    selector: 'app-ship-label-report',
    templateUrl: './ship-label-report.component.html',
    styleUrls: ['./ship-label-report.component.css']
})
export class ShipLabelReportComponent implements OnInit {

    title: string = 'Shipment Label Report ';

    @ViewChild('chkbox') mChkBox: ElementRef;

    tab: string = 'main';
    report_title: string = '';
    report_url: string = '';
    report_searchdata: any = {};
    report_menuid: string = '';
    mbl_ids: string = '';


    pkid: string;
    urlid: string;
    url: string;
    menuid: string;

    currentTab: string = '';
    from_date: string;
    to_date: string;
    group: string = '';
    mbl_pkid: string = '';

    page_count: number = 0;
    page_current: number = 0;
    page_rows: number = 0;
    page_rowcount: number = 0;

    storesub: any;
    sub: any;

    loading: boolean = false;
    errorMessage: string = '';

    SearchData: any = {};

    mainState: ReportState;

    MainList: TBL_LABELM[];
    private chkallselected: boolean = false;
    private selectdeselect: boolean = false;
    // USERRECORD: SearchTable = new SearchTable();

    constructor(
        public gs: GlobalService,
        private router: Router,
        public route: ActivatedRoute,
        private location: Location,
        private store: Store<myReducer.AppState>,
        private mainservice: ReportService
    ) {

        this.sub = this.route.queryParams.subscribe(params => {
            this.urlid = params.id;
            this.menuid = params.menuid;
            this.mbl_pkid = params.mbl_pkid;
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
                this.from_date = rec.from_date;
                this.to_date = rec.to_date;
                this.group = rec.group;
                this.mbl_pkid = rec.mbl_pkid;
                this.mbl_ids = rec.mbl_ids;

                this.page_rows = rec.page_rows;
                this.page_count = rec.page_count;
                this.page_current = rec.page_current;
                this.page_rowcount = rec.page_rowcount;

                this.SearchData = this.gs.UserInfo;
                this.SearchData.SDATE = this.from_date;
                this.SearchData.EDATE = this.to_date;
                this.SearchData.COMP_CODE = this.gs.branch_codes;
                this.SearchData.VIEW_MODE = this.group;
            }
            else {

                this.MainList = Array<TBL_LABELM>();

                this.page_rows = this.gs.ROWS_TO_DISPLAY;
                this.page_count = 0;
                this.page_current = 0;
                this.page_rowcount = 0;

                this.currentTab = 'LIST';
                this.from_date = this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF);
                this.to_date = this.gs.defaultValues.today;
                this.group = 'OCEAN EXPORT';
                this.mbl_pkid = this.mbl_pkid;
                this.mbl_ids = '';
                this.SearchData = this.gs.UserInfo;
            }
            // this.MainList.forEach(Rec => {
            //     Rec.lblm_yn_b = false;
            //     this.chkallselected = false;
            // })
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

        if (this.gs.isBlank(this.from_date))
            this.from_date = this.gs.year_start_date;
        if (this.gs.isBlank(this.to_date))
            this.to_date = this.gs.defaultValues.today;

        this.SearchData.outputformat = _outputformat;
        this.SearchData.pkid = this.urlid;
        this.SearchData.action = _action;
        this.SearchData.page_count = this.page_count;
        this.SearchData.page_current = this.page_current;
        this.SearchData.page_rows = this.page_rows;
        this.SearchData.page_rowcount = this.page_rowcount;

        if (_outputformat == "SCREEN" && _action == 'NEW') {
            this.SearchData.SDATE = this.from_date;
            this.SearchData.EDATE = this.to_date;
            this.SearchData.COMP_CODE = this.gs.branch_codes;
            this.SearchData.MODE = this.group;
            this.SearchData.MBL_PKID = this.mbl_pkid;
        }

        this.loading = true;

        this.mainservice.ShipmentLabelReport(this.SearchData)
            .subscribe(response => {
                this.chkallselected = false;
                this.selectdeselect = false;
                if (_outputformat == "SCREEN") {
                    this.mainState = {
                        pkid: this.pkid,
                        urlid: this.urlid,
                        menuid: this.menuid,
                        currentTab: this.currentTab,
                        from_date: this.SearchData.SDATE,
                        to_date: this.SearchData.EDATE,
                        group: this.SearchData.MODE,
                        mbl_pkid: this.SearchData.MBL_PKID,
                        mbl_ids: '',
                        page_rows: response.page_rows,
                        page_count: response.page_count,
                        page_current: response.page_current,
                        page_rowcount: response.page_rowcount,
                        records: response.list
                    };
                    this.store.dispatch(new myActions.Update({ id: this.urlid, changes: this.mainState }));
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
        // if (_Record.controlname == "SALESMAN") {
        //     this.handled_id = _Record.id;
        //     this.handled_name = _Record.name;
        // }
    }

    SelectDeselect() {
        this.selectdeselect = !this.selectdeselect;
        // this.MainList.forEach(Rec => {
        //     Rec.lblm_yn_b = this.selectdeselect;
        //     this.chkallselected = this.selectdeselect;
        // })
        this.store.dispatch(new myActions.SelectDeselect({ id: this.urlid, flag: this.selectdeselect }));
    }

    SelectDeselect2(rec: TBL_LABELM) {
        this.store.dispatch(new myActions.SingleSelectDeselect({ urlid: this.urlid, id: rec.lblm_mbl_pkid, flag: this.mChkBox.nativeElement.checked }));

    }

    BtnNavigation(action: string) {

        switch (action) {

            case 'SHIP-LABEL-PRINT': {
                this.report_title = 'Shipment Label';
                this.report_url = '/api/Report/ShipmentLabelReport';
                this.report_searchdata = this.gs.UserInfo;
                this.report_searchdata.outputformat = 'PRINT';
                this.report_searchdata.pkid = this.urlid;
                this.report_searchdata.action = 'NEW';
                this.report_searchdata.SDATE = this.from_date;
                this.report_searchdata.EDATE = this.to_date;
                this.report_searchdata.COMP_CODE = this.gs.branch_codes;
                this.report_searchdata.MODE = this.group;
                this.report_searchdata.MBL_PKID = this.mbl_pkid;
                this.report_searchdata.mbl_ids = this.mbl_ids;
                this.report_menuid = this.gs.MENU_SHIPMENT_LABEL;
                this.tab = 'report';
                break;
            }

        }
    }
    callbackevent(event: any) {
        this.tab = 'main';
    }

    printShipLabels() {
        if (this.MainList == null) {
            this.errorMessage = "No List Found", "Print";
            alert(this.errorMessage);
            return;
        }
        this.mbl_ids = "";
        for (let rec of this.MainList) {
            if (rec.lblm_yn_b) {
                if (this.mbl_ids.trim() != "")
                    this.mbl_ids += ",";
                this.mbl_ids += rec.lblm_mbl_pkid.toString();
            }
        }
        if (this.gs.isBlank(this.mbl_ids)) {
            this.errorMessage = "No Rows Selected";
            alert(this.errorMessage);
            return;
        }
        this.BtnNavigation('SHIP-LABEL-PRINT');
    }

}
