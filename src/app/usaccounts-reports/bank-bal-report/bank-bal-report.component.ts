import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { UsAccountReportService } from '../services/usaccounts-report.service';
import { Tbl_acc_ledger } from '../models/Tbl_acc_ledger';
import { SearchTable } from '../../shared/models/searchtable';

import { Store, State, select } from '@ngrx/store';
import * as myActions from './store/bank-bal-report.actions';
import * as myReducer from './store/bank-bal-report.reducer';
import { ReportState } from './store/bank-bal-report.models'

import { Observable } from 'rxjs';
import { Tbl_Bank_List } from '../models/Tbl_Bank_List';

@Component({
    selector: 'app-bank-bal-report',
    templateUrl: './bank-bal-report.component.html'
})
export class BankBalReportComponent implements OnInit {

    title = 'Bank Balance';
    pkid: string;
    urlid: string;
    url: string;
    menuid: string;
    currentTab = '';

    tdate: string;
    allbankchecked: boolean = false;
    selectdeselect: boolean = false;

    comp_type: string = '';
    comp_name: string = '';
    comp_code: string = '';

    page_count: number = 0;
    page_current: number = 0;
    page_rows: number = 0;
    page_rowcount: number = 0;

    storesub: any;
    sub: any;

    bankfullrecords: Tbl_Bank_List[] = [];
    bankrecords: Tbl_Bank_List[] = [];
    loading: boolean = false;
    errorMessage: string = '';
    SearchData: any = {};
    Reportstate1: Observable<ReportState>;
    MainList: Tbl_acc_ledger[];

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
            this.LoadBank();
        });

    }

    InitPage() {

        this.storesub = this.store.select(myReducer.getState(this.urlid)).subscribe(rec => {
            this.initLov();
            if (rec) {

                this.MainList = rec.records;
                // this.bankfullrecords = rec.bankfullrecords;
                // this.bankrecords = rec.bankrecords;
                this.pkid = rec.pkid;
                this.currentTab = rec.currentTab;
                this.tdate = rec.tdate;
                this.comp_type = rec.comp_type;
                this.comp_name = rec.comp_name;
                this.comp_code = rec.comp_code;

                this.page_rows = rec.page_rows;
                this.page_count = rec.page_count;
                this.page_current = rec.page_current;
                this.page_rowcount = rec.page_rowcount;

                this.SearchData = this.gs.UserInfo;

                this.SearchData.TDATE = this.tdate;
                this.SearchData.JV_ACC_ID = rec.bankids;
                this.SearchData.COMPANY_TYPE = this.comp_type;
                if (this.comp_type == 'ALL') {
                    this.SearchData.COMP_TYPE = 'ALL';
                    this.SearchData.COMP_CODE = this.gs.branch_codes;
                }
                else {
                    this.SearchData.COMP_TYPE = 'SINGLE';
                    this.SearchData.COMP_CODE = this.comp_type;
                }

            } else {

                this.MainList = Array<Tbl_acc_ledger>();
                // this.bankrecords = Array<Tbl_Bank_List>();
                // this.bankfullrecords = Array<Tbl_Bank_List>();
                this.page_rows = this.gs.ROWS_TO_DISPLAY;
                this.page_count = 0;
                this.page_current = 0;
                this.page_rowcount = 0;

                this.currentTab = 'LIST';
                this.tdate = this.gs.defaultValues.today;

                this.comp_type = this.gs.branch_code;
                this.comp_code = this.gs.branch_code;
                this.comp_name = this.gs.branch_name;
                this.SearchData = this.gs.UserInfo;
            }
        });

    }

    LoadBank() {
        var SearchData = this.gs.UserInfo;
        this.mainservice.BankList(SearchData).subscribe(response => {
            this.bankfullrecords = response.list;
            this.FillChkListBox(this.gs.branch_code);
        }, error => {
            this.errorMessage = this.gs.getError(error)
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

        if (this.gs.isBlank(this.tdate)) {
            this.tdate = this.gs.defaultValues.today;
        }

        let BANK_IDS: string = "";
        this.bankrecords.forEach(Rec => {
            if (Rec.bnk_checked) {
                if (BANK_IDS.trim() != "")
                    BANK_IDS += ",";
                BANK_IDS += "'" + Rec.bnk_acc_pkid.trim() + "'";
            }
        })

        if (BANK_IDS.trim() == "") {
            this.errorMessage = "No banks selected";
            alert(this.errorMessage);
            return;
        }

        this.errorMessage = "";
        this.SearchData.outputformat = _outputformat;
        this.SearchData.pkid = this.urlid;
        this.SearchData.action = _action;
        this.SearchData.page_count = this.page_count;
        this.SearchData.page_current = this.page_current;
        this.SearchData.page_rows = this.page_rows;
        this.SearchData.page_rowcount = this.page_rowcount;

        if (_outputformat === 'SCREEN' && _action === 'NEW') {

            this.SearchData.JV_ACC_ID = BANK_IDS;
            this.SearchData.TDATE = this.tdate;
            this.SearchData.COMPANY_TYPE = this.comp_type;
            if (this.comp_type == 'ALL') {
                this.SearchData.COMP_TYPE = 'ALL';
                this.SearchData.COMP_CODE = this.gs.branch_codes;
            }
            else {
                this.SearchData.COMP_TYPE = 'SINGLE';
                this.SearchData.COMP_CODE = this.comp_type;
            }
        }


        this.loading = true;

        this.mainservice.BankBalance(this.SearchData)
            .subscribe(response => {

                if (_outputformat === 'SCREEN') {

                    const state: ReportState = {
                        pkid: this.pkid,
                        urlid: this.urlid,
                        menuid: this.menuid,
                        currentTab: this.currentTab,
                        tdate: this.SearchData.TDATE,
                        comp_name: this.SearchData.COMP_NAME,
                        comp_code: this.SearchData.COMP_CODE,
                        comp_type: this.SearchData.COMPANY_TYPE,
                        bankids: this.SearchData.JV_ACC_ID,

                        page_rows: response.page_rows,
                        page_count: response.page_count,
                        page_current: response.page_current,
                        page_rowcount: response.page_rowcount,
                        records: response.list
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
        if (_Record.controlname === 'ACCTM') {

        }
        // if (_Record.controlname === 'PARENT') {
        //   this.cust_parent_id = _Record.id;
        //   this.cust_parent_name = _Record.name;
        // }
    }

    SelectBank(_rec: Tbl_Bank_List) {
        _rec.bnk_checked = true;
    }

    SelectDeselect() {
        this.selectdeselect = !this.selectdeselect;
        this.bankrecords.forEach(Rec => {
            Rec.bnk_checked = this.selectdeselect;
            this.allbankchecked = this.selectdeselect;
        })
    }

    onChange(field: string) {

       this.FillChkListBox(this.comp_type);
      }

    FillChkListBox(sCode: string) {
        this.bankrecords = <Tbl_Bank_List[]>[];
        this.allbankchecked=false;
        this.selectdeselect = false;
        if (sCode.trim() == "ALL") {
            this.bankfullrecords.forEach(Rec => {
                Rec.bnk_checked = false;
                this.bankrecords.push(Rec);
            })
        }
        else {

            this.bankfullrecords.filter(rec => rec.bnk_acc_branch == sCode || rec.bnk_acc_branch == "ALL").forEach(Rec => {
                Rec.bnk_checked = false;
                this.bankrecords.push(Rec);
            })

            // for (let Rec of this.bankfullrecords.filter(rec => rec.bnk_acc_branch == sCode || rec.bnk_acc_branch == "ALL")) {
            //     Rec.bnk_checked = false;
            //     this.bankrecords.push(Rec);
            // }
        }

    }

}
