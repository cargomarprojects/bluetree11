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
    // @ViewChild('to_code') to_code_field: AutoComplete2Component;
    // @ViewChild('to_name') to_name_field: InputBoxComponent;
    // @ViewChild('quot_by') quot_by_field: InputBoxComponent;
    // @ViewChild('salesman_name') salesman_name_field: AutoComplete2Component;
    // @ViewChild('move_type') move_type_field: InputBoxComponent;
    // @ViewChild('por') por_field: InputBoxComponent;
    // @ViewChild('pol') pol_field: InputBoxComponent;
    // @ViewChild('pod') pod_field: InputBoxComponent;
    // @ViewChild('_qtnm_subjects') qtnm_subjects_field: ElementRef;
    // @ViewChild('_qtnm_commodity') qtnm_commodity_field: InputBoxComponent;
    // @ViewChild('_qtnm_remarks') qtnm_remarks_field: ElementRef;
    // @ViewChildren('_qtnd_desc_code') qtnd_desc_code_field: QueryList<AutoComplete2Component>;
    // @ViewChildren('_qtnd_desc_name') qtnd_desc_name_field: QueryList<InputBoxComponent>;


    record: Tbl_Cargo_Wiretransferm = <Tbl_Cargo_Wiretransferm>{};
    records: Tbl_Cargo_Wiretransferd[] = [];

    tab: string = 'main';
    report_title: string = '';
    report_url: string = '';
    report_searchdata: any = {};
    report_menuid: string = '';

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
        // if (this.mode == 'ADD') {
        //     if (!this.gs.isBlank(this.to_code_field))
        //         this.to_code_field.Focus();
        // }
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
        let filepath: string = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\quotation\\";

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
                // if (!this.gs.isBlank(this.btnretlcl_field))
                //     this.btnretlcl_field.nativeElement.focus();

            }, error => {
                this.errorMessage.push(this.gs.getError(error));
            });
    }


    Save() {

        if (!this.Allvalid())
            return;
        this.SaveParent();

        let filepath: string = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\quotation\\";
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
                    // if (this.mode == "ADD" && response.code != '')
                    //     this.record.qtnm_no = response.code;
                    this.mode = 'EDIT';
                    // this.mainService.RefreshList(this.record);
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

        // if (this.gs.isBlank(this.record.qtnr_agent_id) || this.gs.isBlank(this.record.qtnr_agent_name)) {
        //     bRet = false;
        //     this.errorMessage = "Agent Cannot be blank";
        //     alert(this.errorMessage);
        //     return bRet;
        // }
        // if (this.gs.isBlank(this.record.qtnr_validity)) {
        //     bRet = false;
        //     this.errorMessage = "Validity cannot be blank";
        //     alert(this.errorMessage);
        //     return bRet;
        // }


        // if (this.gs.isBlank(this.record.qtnm_to_name)) {
        //     bRet = false;
        //     this.errorMessage.push("Quote To Cannot blank");
        // }
        // if (this.gs.isBlank(this.record.qtnm_date)) {
        //     bRet = false;
        //     this.errorMessage.push("Quote Date Cannot blank");
        // }
        // if (this.gs.isBlank(this.record.qtnm_salesman_id) || this.gs.isBlank(this.record.qtnm_salesman_name)) {
        //     bRet = false;
        //     this.errorMessage.push("Sales Rep. Cannot blank");
        // }

        let iCtr: number = 0;
        this.records.forEach(Rec => {
            iCtr++;
            // if (Rec.qtnd_amt <= 0) {
            //     bRet = false;
            //     this.errorMessage.push("Amount Cannot blank (" + Rec.qtnd_desc_code + ")");
            // }
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
        rec.cwd_type='INTERNATIONAL WIRE TRANSFER';
        rec.cwd_beneficiary_id = '';
        rec.cwd_beneficiary_code = '';
        rec.cwd_beneficiary_name = '';
        rec.cwd_transfer_amt=0;

        this.records.push(rec);
        // this.qtnd_desc_code_field.changes
        //     .subscribe((queryChanges) => {
        //         this.qtnd_desc_code_field.last.Focus();
        //     });
    }

    LovSelected(_Record: SearchTable, idx: number = 0) {

        if (_Record.controlname == "COMPANY") {

            this.record.cwm_company_id = _Record.id;
            this.record.cwm_company_code = _Record.code;
            this.record.cwm_company_name = _Record.name;
            if (_Record.col8.toString() != "")
                this.record.cwm_company_name = _Record.col8.toString();
            
            this.record.cwm_company_tel = _Record.col6.toString();
            this.record.cwm_company_fax =  _Record.col7.toString();
            // Dispatcher.BeginInvoke(() => { Txt_QuoteTo_Name.Focus(); });
        }
        // if (_Record.controlname == "SALESMAN") {
        //     this.record.qtnm_salesman_id = _Record.id;
        //     this.record.qtnm_salesman_name = _Record.name;
        //     if (!this.gs.isBlank(this.move_type_field))
        //         this.move_type_field.focus();
        // }
        // if (_Record.controlname == "POR") {
        //     this.record.qtnm_por_id = _Record.id;
        //     this.record.qtnm_por_code = _Record.code;
        //     this.record.qtnm_por_name = _Record.name;
        //     if (!this.gs.isBlank(this.por_field))
        //         this.por_field.focus();
        // }
        // if (_Record.controlname == "POL") {
        //     this.record.qtnm_pol_id = _Record.id;
        //     this.record.qtnm_pol_code = _Record.code;
        //     this.record.qtnm_pol_name = _Record.name;
        //     if (!this.gs.isBlank(this.pol_field))
        //         this.pol_field.focus();
        // }
        // if (_Record.controlname == "POD") {
        //     this.record.qtnm_pod_id = _Record.id;
        //     this.record.qtnm_pod_code = _Record.code;
        //     this.record.qtnm_pod_name = _Record.name;
        //     if (!this.gs.isBlank(this.pod_field))
        //         this.pod_field.focus();
        // }
        // if (_Record.controlname == "CURR") {
        //     this.record.qtnm_curr_code = _Record.code;
        //     if (!this.gs.isBlank(this.qtnm_commodity_field))
        //         this.qtnm_commodity_field.focus();
        // }

        // if (_Record.controlname == "INVOICE-CODE") {
        //     this.records.forEach(rec => {
        //         if (rec.qtnd_pkid == _Record.uid) {
        //             rec.qtnd_desc_id = _Record.id;
        //             rec.qtnd_desc_code = _Record.code;
        //             rec.qtnd_desc_name = _Record.name;
        //             if (idx < this.qtnd_desc_name_field.toArray().length)
        //                 this.qtnd_desc_name_field.toArray()[idx].focus();
        //         }
        //     });
        // }
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

   

    BtnNavigation(action: string, attachmodal: any = null) {
        switch (action) {
            case 'ATTACHMENT': {
                this.attach_title = 'Documents';
                this.attach_parentid = this.pkid;
                this.attach_subid = '';
                this.attach_type = 'QUOT-LCL';
                this.attach_typelist = [];
                this.attach_tablename = 'cargo_qtnm';
                this.attach_tablepkcolumn = 'qtnm_pkid';
                this.attach_refno = '';
                this.attach_customername = '';
                this.attach_updatecolumn = 'REC_FILES_ATTACHED';
                this.attach_viewonlysource = '';
                this.attach_viewonlyid = '';
                this.attach_filespath = '';
                this.attach_filespath2 = '';
                this.modal = this.modalservice.open(attachmodal, { centered: true });
                break;
            } 
            case 'PRINT': {
                let filepath: string = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\quotation\\";
                this.report_title = 'Quotation LCL';
                this.report_url = '/api/Marketing/QtnReport/GetQuotationLclRpt';
                this.report_searchdata = this.gs.UserInfo;
                this.report_searchdata.pkid = this.pkid;
                this.report_searchdata.PATH = filepath;
                this.report_menuid = this.gs.MENU_QUOTATION_LCL;
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

