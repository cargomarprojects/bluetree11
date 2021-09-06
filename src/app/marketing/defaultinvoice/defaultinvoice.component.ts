import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../shared/input/inputbox.component';
import { DefaultInvoiceService } from '../../marketing/services/defaultinvoice.service';
import { Tbl_Cargo_Qtnm, vm_Tbl_Cargo_Qtnd_Lcl, Tbl_Cargo_Qtnd_Lcl } from '../../marketing/models/tbl_cargo_qtnm';
import { SearchTable } from '../../shared/models/searchtable';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
//EDIT-AJITH-06-09-2021

@Component({
    selector: 'app-defaultinvoice',
    templateUrl: './defaultinvoice.component.html'
})
export class DefaultInvoiceComponent implements OnInit {

    @ViewChild('_btnretdinv') btnretdinv_field: ElementRef;
    @ViewChild('to_code') to_code_field: AutoComplete2Component;
    @ViewChildren('_qtnd_desc_code') qtnd_desc_code_field: QueryList<AutoComplete2Component>;
    @ViewChildren('_qtnd_desc_name') qtnd_desc_name_field: QueryList<InputBoxComponent>;


    records: Tbl_Cargo_Qtnd_Lcl[] = [];

    tab: string = 'main';

    pkid: string;
    menuid: string;
    mode: string;
    errorMessage: string[] = [];
    modal: any;
    title: string;
    isAdmin: boolean;
    client_id: string;
    client_name: string;
    foreign_amt_decplace: number = 2;

    constructor(
        private modalconfig: NgbModalConfig,
        private modalservice: NgbModal,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        private mainService: DefaultInvoiceService,
    ) {
        modalconfig.backdrop = 'static'; //true/false/static
        modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
    }

    ngOnInit() {
        this.gs.checkAppVersion();
        this.mainService.init(this.route.snapshot.queryParams);
        this.initPage();

    }
    ngAfterViewInit() {

        if (!this.gs.isBlank(this.to_code_field))
            this.to_code_field.Focus();

    }
    private initPage() {

        this.foreign_amt_decplace = this.gs.foreign_amt_dec;
        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.errorMessage = [];
        this.client_name = 'DEFAULT';
        this.client_id = 'DEFAULT';
        this.GetCustomer();
        this.LoadCombo();
    }

    LoadCombo() {

    }

    init() {

    }

    Save() {

        if (!this.Allvalid())
            return;
        if (!confirm("Save")) {
            return;
        }

        this.SaveParent();

        const saveRecord = <vm_Tbl_Cargo_Qtnd_Lcl>{};
        saveRecord.records = this.records;
        saveRecord.userinfo = this.gs.UserInfo;

        this.mainService.Save(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.errorMessage.push(response.error);
                    alert(this.errorMessage);
                }
                else {
                    this.errorMessage.push('Save Complete');
                    alert('Save Complete');
                }
            }, error => {
                this.errorMessage.push(this.gs.getError(error));
                alert(this.errorMessage);
            });
    }

    private SaveParent() {

    }
    private Allvalid(): boolean {

        var bRet = true;
        this.errorMessage = [];

        let iCtr: number = 0;
        this.records.forEach(Rec => {
            iCtr++;
            if (Rec.qtnd_amt <= 0) {
                bRet = false;
                this.errorMessage.push("Amount Cannot blank (" + Rec.qtnd_desc_code + ")");
            }
        })

        if (iCtr == 0) {
            bRet = false;
            this.errorMessage.push("No Detail Rows To Save");
        }


        if (!bRet)
            alert(this.errorMessage);

        return bRet;
    }


    Close() {
        this.location.back();
    }

    AddRow() {

        var rec = <Tbl_Cargo_Qtnd_Lcl>{};
        rec.qtnd_pkid = this.gs.getGuid();
        if (this.gs.isBlank(this.client_id))
            rec.qtnd_parent_id = 'DEFAULT';
        else
            rec.qtnd_parent_id = this.client_id;
        rec.qtnd_desc_id = '';
        rec.qtnd_desc_code = '';
        rec.qtnd_desc_name = '';
        rec.qtnd_per = '';
        rec.qtnd_amt = 0;
        rec.qtnd_old_pkid = '';
        rec.qtnd_old_amt = 0;
        this.records.push(rec);
        this.qtnd_desc_code_field.changes
            .subscribe((queryChanges) => {
                this.qtnd_desc_code_field.last.Focus();
            });
    }

    LovSelected(_Record: SearchTable, idx: number = 0) {

        if (_Record.controlname == "CUSTOMER") {
            this.client_id = _Record.id;
            this.client_name = _Record.name;
            this.GetCustomer();
        }
        if (_Record.controlname == "INVOICE-CODE") {
            this.records.forEach(rec => {
                if (rec.qtnd_pkid == _Record.uid) {
                    rec.qtnd_desc_id = _Record.id;
                    rec.qtnd_desc_code = _Record.code;
                    rec.qtnd_desc_name = _Record.name;
                    if (idx < this.qtnd_desc_name_field.toArray().length)
                        this.qtnd_desc_name_field.toArray()[idx].focus();
                }
            });
        }
    }

    GetCustomer() {
        this.errorMessage = [];
        var SearchData = this.gs.UserInfo;
        SearchData.CLIENT_ID = this.client_id;
        this.mainService.List(SearchData)
            .subscribe(response => {
                this.records = (response.list == undefined || response.list == null) ? <Tbl_Cargo_Qtnd_Lcl[]>[] : <Tbl_Cargo_Qtnd_Lcl[]>response.list;
            }, error => {
                this.errorMessage.push(this.gs.getError(error));
            });
    }


    OnChange(field: string) {
    }
    onFocusout(field: string) {
    }

    onBlur(field: string) {
        switch (field) {

            // case 'qtnm_kgs': {
            //     this.record.qtnm_kgs = this.gs.roundNumber(this.record.qtnm_kgs, 3);
            //     break;
            // }
        }
    }

    callbackevent(event: any) {
        this.tab = 'main';
    }

    RemoveRow(_rec: Tbl_Cargo_Qtnd_Lcl) {
        if (!confirm("Delete Y/N")) {
            return;
        }
        this.records.splice(this.records.findIndex(rec => rec.qtnd_pkid == _rec.qtnd_pkid), 1);
    }




    CloseModal() {
        this.modal.close();
    }
}

