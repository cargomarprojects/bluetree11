import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/services/global.service';
import { AutoComplete2Component } from '../../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../../shared/input/inputbox.component';
import { WireTransferedService } from '../../services/wiretransfered.service';
import { Tbl_Cargo_Wiretransferm, vm_Tbl_Cargo_Wiretransferm, Tbl_Cargo_Wiretransferd } from '../../models/tbl_cargo_wiretransferm';
import { SearchTable } from '../../../shared/models/searchtable';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-wiretransfered-edit',
    templateUrl: './wiretransfered-edit.component.html'
})
export class WireTransferedEditComponent implements OnInit {

    @ViewChild('_btnret') btnret_field: ElementRef;
    @ViewChild('_company_name') company_name_field: InputBoxComponent;
    @ViewChildren('_beneficiary_name') beneficiary_name_field: QueryList<AutoComplete2Component>;
    @ViewChildren('_bank_name') bank_name_field: QueryList<InputBoxComponent>;

    record: Tbl_Cargo_Wiretransferm = <Tbl_Cargo_Wiretransferm>{};
    records: Tbl_Cargo_Wiretransferd[] = [];

    tab: string = 'main';
    report_title: string = '';
    report_url: string = '';
    report_searchdata: any = {};
    report_menuid: string = '';


    pkid: string;
    menuid: string;
    mode: string;
    errorMessage: string[] = [];
    Foregroundcolor: string;
    foreign_amt_decplace: number = 2;
    modal: any;

    title: string;
    isAdmin: boolean;
    refno: string = "";

    constructor(
        private modalconfig: NgbModalConfig,
        private modalservice: NgbModal,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        private mainService: WireTransferedService,
    ) {
        modalconfig.backdrop = 'static'; //true/false/static
        modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
    }

    ngOnInit() {
        if (this.route.snapshot.queryParams.parameter == null) {
            this.menuid = this.route.snapshot.queryParams.menuid;
            this.pkid = this.route.snapshot.queryParams.pkid;
            this.mode = this.route.snapshot.queryParams.mode;
        } else {
            const options = JSON.parse(this.route.snapshot.queryParams.parameter);
            this.menuid = options.menuid;
            this.pkid = options.pkid;
            this.mode = options.mode;
        }
        this.initPage();
        this.actionHandler();
    }
    ngAfterViewInit() {

        if (!this.gs.isBlank(this.btnret_field))
            this.btnret_field.nativeElement.focus();

    }
    private initPage() {
        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.errorMessage = [];
        this.LoadCombo();
    }

    LoadCombo() {

    }

    NewRecord() {
        this.mode = 'ADD'
        this.actionHandler();
    }

    actionHandler() {
        this.errorMessage = [];
        if (this.mode == 'ADD') {
            this.record = <Tbl_Cargo_Wiretransferm>{};
            this.records = <Tbl_Cargo_Wiretransferd[]>[];
            this.pkid = this.gs.getGuid();
            this.init();
        }
        if (this.mode == 'EDIT') {
            this.GetRecord();
        }
    }

    init() {
        this.record.cwm_pkid = this.pkid;
        this.record.cwm_slno = null;
        this.record.cwm_refno = '';
        this.record.cwm_to_name = '';
        this.record.cwm_company_id = '';
        this.record.cwm_company_code = '';
        this.record.cwm_company_name = '';
        this.record.cwm_company_fax = '';
        this.record.cwm_company_tel = '';
        this.record.cwm_acc_number = '';
        this.record.cwm_request_type = '';
        this.record.cwm_from_name = '';
        this.record.cwm_date = '';
        this.record.cwm_senders_reference = '';
        this.record.cwm_your_reference = '';
        this.record.cwm_is_urgent = false;
        this.record.cwm_is_review = false;
        this.record.cwm_is_comment = false;
        this.record.cwm_is_reply = false;
        this.record.cwm_is_recycle = false;
        this.record.cwm_remarks = '';

        // if (!this.gs.isBlank(this.to_code_field))
        //     this.to_code_field.Focus();
    }

    GetRecord() {

        this.errorMessage = [];
        let filepath: string = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\xmlremarks\\";

        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        SearchData.PATH = filepath;

        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_Cargo_Wiretransferm>response.record;
                this.records = <Tbl_Cargo_Wiretransferd[]>response.records;
                this.mode = 'EDIT';

                // if (this.record.rec_files_attached == "Y")
                //     this.Foregroundcolor = "red";
                // else
                //     this.Foregroundcolor = "white";

                if (!this.gs.isBlank(this.btnret_field))
                    this.btnret_field.nativeElement.focus();
            }, error => {
                this.errorMessage.push(this.gs.getError(error));
            });
    }


    Save() {

        if (!this.Allvalid())
            return;
        this.SaveParent();

        let filepath: string = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\xmlremarks\\";
        let filter: any = {};
        filter.PATH = filepath;

        const saveRecord = <vm_Tbl_Cargo_Wiretransferm>{};
        saveRecord.record = this.record;
        saveRecord.records = this.records;
        saveRecord.pkid = this.pkid;
        saveRecord.mode = this.mode;
        saveRecord.userinfo = this.gs.UserInfo;
        saveRecord.filter = filter;

        this.mainService.Save(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.errorMessage.push(response.error);
                    alert(this.errorMessage);
                }
                else {
                    if (this.mode == "ADD" && response.slno != '')
                        this.record.cwm_refno = response.slno;
                    this.mode = 'EDIT';
                    this.mainService.RefreshList(this.record);
                    this.errorMessage.push('Save Complete');
                    //alert(this.errorMessage);
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

        if (this.gs.isBlank(this.pkid)) {
            bRet = false;
            this.errorMessage.push("Invalid ID");
        }
        if (this.gs.isBlank(this.record.cwm_to_name)) {
            bRet = false;
            this.errorMessage.push("To Cannot blank");
        }
        if (this.gs.isBlank(this.record.cwm_date)) {
            bRet = false;
            this.errorMessage.push("Date Cannot blank");
        }
        if (this.gs.isBlank(this.record.cwm_company_id) || this.gs.isBlank(this.record.cwm_company_name)) {
            bRet = false;
            this.errorMessage.push("Company Cannot blank");
        }

        let iCtr: number = 0;
        this.records.forEach(Rec => {
            iCtr++;
            if (this.gs.isBlank(Rec.cwd_beneficiary_id)) {
                bRet = false;
                this.errorMessage.push("Beneficiary Cannot blank");
            }
            if (this.gs.isBlank(Rec.pb_bank_name)) {
                bRet = false;
                this.errorMessage.push("Bank Cannot blank");
            }
            if (this.gs.isBlank(Rec.cwd_beneficiary_bank_id)) {
                bRet = false;
                this.errorMessage.push("Bank Details Not Found");
            }
            if (this.gs.isZero(Rec.cwd_transfer_amt)) {
                bRet = false;
                this.errorMessage.push("Amount Cannot blank");
            }
            if (Rec.pb_parent_id != Rec.cwd_beneficiary_id) {
                bRet = false;
                this.errorMessage.push("Invalid Bank Details");
            }
        })

        if (iCtr == 0) {
            bRet = false;
            this.errorMessage.push("No Detail Rows To Save");
        }

        if (!bRet)
            alert('Error While Saving');

        return bRet;
    }


    Close() {
        this.location.back();
    }

    AddRow() {
        var rec = <Tbl_Cargo_Wiretransferd>{};
        rec.cwd_pkid = this.gs.getGuid();
        rec.cwd_parent_id = this.pkid;
        rec.cwd_beneficiary_id = '';
        rec.cwd_type = 'INTERNATIONAL WIRE TRANSFER';
        rec.cwd_beneficiary_reference = '';
        rec.cwd_beneficiary_bank_id = '';
        rec.pb_parent_id = '';
        rec.pb_bank_name = '';
        rec.cwd_transfer_amt = 0;
        this.records.push(rec);

        this.beneficiary_name_field.changes
            .subscribe((queryChanges) => {
                this.beneficiary_name_field.last.Focus();
            });
    }

    LovSelected(_Record: SearchTable, idx: number = 0) {

        if (_Record.controlname == "COMPANY") {

            this.record.cwm_company_id = _Record.id;
            this.record.cwm_company_code = _Record.code;
            this.record.cwm_company_name = _Record.name;
            if (_Record.col8.toString() != "")
                this.record.cwm_company_name = _Record.col8.toString();

            this.record.cwm_company_tel = _Record.col6.toString();
            this.record.cwm_company_fax = _Record.col7.toString();
            
            if (!this.gs.isBlank(this.company_name_field))
                this.company_name_field.focus();
        }

        if (_Record.controlname == "BENIFICIARY") {
            this.records.forEach(rec => {
                if (rec.cwd_pkid == _Record.uid) {
                    rec.cwd_beneficiary_id = _Record.id;
                    rec.cwd_beneficiary_code = _Record.code;
                    rec.cwd_beneficiary_name = _Record.name;
                    if (idx < this.bank_name_field.toArray().length)
                        this.bank_name_field.toArray()[idx].focus();
                }
            });
        }
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
            // case 'qtnm_lbs': {
            //     this.record.qtnm_lbs = this.gs.roundNumber(this.record.qtnm_lbs, 3);
            //     break;
            // }
            // case 'qtnm_cbm': {
            //     this.record.qtnm_cbm = this.gs.roundNumber(this.record.qtnm_cbm, 3);
            //     break;
            // }
            // case 'hbl_cft': {
            //     this.record.qtnm_cft = this.gs.roundNumber(this.record.qtnm_cft, 3);
            //     break;
            // }
        }
    }



    BtnNavigation(action: string) {
        switch (action) {
            case 'PRINT': {
                let filepath: string = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\xmlremarks\\";
                this.report_title = 'Wire Transfer';
                this.report_url = '/api/Other/WireTransfered/GetWireTransferReport';
                this.report_searchdata = this.gs.UserInfo;
                this.report_searchdata.pkid = this.pkid;
                this.report_searchdata.PATH = filepath;
                this.report_menuid = this.menuid;
                this.tab = 'report';
                break;
            }
        }
    }
    callbackevent(event: any) {
        this.tab = 'main';
    }

    RemoveRow(_rec: Tbl_Cargo_Wiretransferd) {
        this.records.splice(this.records.findIndex(rec => rec.cwd_pkid == _rec.cwd_pkid), 1);
    }

    CloseModal() {
        this.modal.close();
    }


}

