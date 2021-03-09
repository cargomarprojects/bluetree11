import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/services/global.service';
import { AutoComplete2Component } from '../../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../../shared/input/inputbox.component';
import { SalesJournalService } from '../../../marketing/services/salesjournals.service';
import { User_Menu } from '../../../core/models/menum';
import { vm_Tbl_Cargo_Journals_Master, Tbl_Cargo_Journals_Master, Tbl_Mark_Contacts, Tbl_Mast_Contacts } from '../../../marketing/models/tbl_cargo_journals_master';
import { SearchTable } from '../../../shared/models/searchtable';
import { strictEqual } from 'assert';

@Component({
    selector: 'app-salesjournals-edit',
    templateUrl: './salesjournals-edit.component.html'
})
export class SalesJournalsEditComponent implements OnInit {

    record: Tbl_Cargo_Journals_Master = <Tbl_Cargo_Journals_Master>{};
    custrecord: Tbl_Mark_Contacts = <Tbl_Mark_Contacts>{};
    custdetrecords: Tbl_Mast_Contacts[] = [];
    tab: string = 'main';

    @ViewChild('customer') customer_field: AutoComplete2Component;

    attach_title: string = '';
    attach_parentid: string = '';
    attach_subid: string = '';
    attach_type: string = '';
    attach_typelist: any = {};
    attach_tablename: string = '';
    attach_tablepkcolumn: string = '';
    attach_refno: string = '';
    attach_customername: string = '';
    attach_updatecolumn: string = '';
    attach_viewonlysource: string = '';
    attach_viewonlyid: string = '';
    attach_filespath: string = '';
    attach_filespath2: string = '';

    customer_id: string;
    customer_name: string;
    pkid: string;
    menuid: string;
    mode: string;
    errorMessage: string;
    Foregroundcolor: string;

    title: string;
    isAdmin: boolean;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        private mainService: SalesJournalService,
    ) { }

    ngOnInit() {
        if (this.route.snapshot.queryParams.parameter == null) {
            this.menuid = this.route.snapshot.queryParams.menuid;
            this.pkid = this.route.snapshot.queryParams.pkid;
            this.customer_id = this.route.snapshot.queryParams.custid;
            this.mode = this.route.snapshot.queryParams.mode;
        } else {
            const options = JSON.parse(this.route.snapshot.queryParams.parameter);
            this.menuid = options.menuid;
            this.pkid = options.pkid;
            this.customer_id = options.custid;
            this.mode = options.mode;
        }
        this.initPage();
        this.actionHandler();
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
            this.custrecord = <Tbl_Mark_Contacts>{};
            this.record = <Tbl_Cargo_Journals_Master>{};
            this.custdetrecords = <Tbl_Mast_Contacts[]>[];
            this.pkid = this.gs.getGuid();
            this.init();
        }
        if (this.mode == 'EDIT') {
            this.LoadCustomerRecord();
        }
    }

    init() {
        this.customer_id = '';
        this.customer_name = '';
        this.record.cjm_pkid = this.pkid;
        this.record.cjm_customer_id = '';
        this.record.cjm_user_id = this.gs.user_pkid;
        this.record.rec_files_attached = 'N';;
        this.record.rec_created_by = this.gs.user_code;
        this.record.rec_created_date = this.gs.defaultValues.today;
    }

    GetRecord() {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_Cargo_Journals_Master>response.record;
                this.mode = 'EDIT';

                this.customer_id = this.record.cjm_customer_id;
                this.LoadCustomerRecord();
                if (this.record.rec_files_attached == "Y")
                    this.Foregroundcolor = "red";
                else
                    this.Foregroundcolor = "white";

            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }

    getCustomer() {
        this.errorMessage = "";
        if (this.gs.isBlank(this.customer_id)) {
            this.errorMessage = "Customer cannot be empty";
            alert(this.errorMessage);
            return;
        }
        this.LoadCustomerRecord();
    }

    LoadCustomerRecord() {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        SearchData.customer_id = this.customer_id;

        this.mainService.LoadCustomerRecord(SearchData)
            .subscribe(response => {
                this.custrecord = <Tbl_Mark_Contacts>response.record;
                this.custdetrecords = <Tbl_Mast_Contacts[]>response.records;
                if (this.mode === "EDIT") {
                    this.customer_name = this.custrecord.gen_name.toString();
                    this.customer_id = this.custrecord.gen_pkid;
                }

                if (this.mode === "ADD" && this.custrecord.cjm_customer_id === this.customer_id && this.custrecord.cjm_user_id === this.gs.user_pkid) {
                    this.pkid = this.custrecord.cjm_pkid;
                    this.mode = "EDIT";
                }

                if (this.custrecord.rec_files_attached == "Y")
                    this.Foregroundcolor = "red";
                else
                    this.Foregroundcolor = "white";

            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }


    Save() {

        if (!this.Allvalid())
            return;
        this.SaveParent();
        const saveRecord = <vm_Tbl_Cargo_Journals_Master>{};
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
                    this.errorMessage = 'Save Complete';
                    // alert(this.errorMessage);
                }

            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);
            });
    }

    private SaveParent() {
        this.record.cjm_pkid = this.pkid.toString();
        this.record.cjm_customer_id = this.customer_id;
        this.record.cjm_user_id = this.gs.user_pkid;
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

        if (this.gs.isBlank(this.customer_id)) {
            bRet = false;
            this.errorMessage = "Invalid Customer";
            alert(this.errorMessage);
            this.customer_field.Focus();
            return bRet;
        }

        return bRet;
    }


    Close() {
        this.location.back();
    }

    LovSelected(_Record: SearchTable) {
        let bchange: boolean = false;

        if (_Record.controlname == "CUSTOMER") {
            bchange = false;
            if (this.customer_id != _Record.id)
                bchange = true;
            this.customer_id = _Record.id;
            this.customer_name = _Record.name;
            if (bchange) {
                this.custrecord = <Tbl_Mark_Contacts>{};
                this.custdetrecords = <Tbl_Mast_Contacts[]>[];
            }
        }
    }

    OnChange(field: string) {
    }
    onFocusout(field: string) {
    }

    onBlur(field: string) {
    }


    BtnNavigation(action: string) {
        switch (action) {
            case 'ATTACHMENT': {
                this.attach_title = 'Documents';
                this.attach_parentid = this.pkid;
                this.attach_subid = '';
                this.attach_type = 'MARKETING';
                this.attach_typelist = [];
                this.attach_tablename = 'cargo_journals_master';
                this.attach_tablepkcolumn = 'cjm_pkid';
                this.attach_refno = '';
                this.attach_customername = '';
                this.attach_updatecolumn = 'REC_FILES_ATTACHED';
                this.attach_viewonlysource = '';
                this.attach_viewonlyid = '';
                this.attach_filespath = '';
                this.attach_filespath2 = '';
                this.tab = 'attachment';
                break;
            }
            case 'MEMO': {
                let prm = {
                    menuid: this.menuid,
                    pkid: this.pkid,
                    source: 'CONTACT-MEMO',
                    title: 'Memo',
                    origin: 'sales-journal-page'
                };
                this.gs.Naviagete('Silver.BusinessModule/XmlRemarksPage', JSON.stringify(prm));
                break;
            }
        }
    }
    callbackevent(event: any) {
        this.tab = 'main';
    }
}
