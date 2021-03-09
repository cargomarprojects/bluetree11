import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/services/global.service';
import { AutoComplete2Component } from '../../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../../shared/input/inputbox.component';
import { QtnLclService } from '../../../marketing/services/qtnlcl.service';
import { User_Menu } from '../../../core/models/menum';
import { Tbl_Cargo_Qtnm, vm_Tbl_Cargo_Qtnd_Lcl, Tbl_Cargo_Qtnd_Lcl } from '../../../marketing/models/tbl_cargo_qtnm';
import { SearchTable } from '../../../shared/models/searchtable';
import { strictEqual } from 'assert';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-qtnlcl-edit',
    templateUrl: './qtnlcl-edit.component.html'
})
export class QtnLclEditComponent implements OnInit {

    @ViewChild('_btnretlcl') btnretlcl_field: ElementRef;
    @ViewChild('to_code') to_code_field: AutoComplete2Component;
    @ViewChild('to_name') to_name_field: InputBoxComponent;
    @ViewChild('quot_by') quot_by_field: InputBoxComponent;
    @ViewChild('salesman_name') salesman_name_field: AutoComplete2Component;
    @ViewChild('move_type') move_type_field: InputBoxComponent;
    @ViewChild('por') por_field: InputBoxComponent;
    @ViewChild('pol') pol_field: InputBoxComponent;
    @ViewChild('pod') pod_field: InputBoxComponent;
    @ViewChild('_qtnm_subjects') qtnm_subjects_field: ElementRef;
    @ViewChild('_qtnm_commodity') qtnm_commodity_field: InputBoxComponent;
    @ViewChild('_qtnm_remarks') qtnm_remarks_field: ElementRef;
    @ViewChildren('_qtnd_desc_code') qtnd_desc_code_field: QueryList<AutoComplete2Component>;
    @ViewChildren('_qtnd_desc_name') qtnd_desc_name_field: QueryList<InputBoxComponent>;


    record: Tbl_Cargo_Qtnm = <Tbl_Cargo_Qtnm>{};
    records: Tbl_Cargo_Qtnd_Lcl[] = [];
    historyList: Tbl_Cargo_Qtnd_Lcl[] = [];

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

    mbl_pkid: string;
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
        private mainService: QtnLclService,
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
        if (this.mode == 'ADD') {
            if (!this.gs.isBlank(this.to_code_field))
                this.to_code_field.Focus();
        }
    }
    private initPage() {
        this.foreign_amt_decplace = this.gs.foreign_amt_dec;
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
            this.record = <Tbl_Cargo_Qtnm>{};
            this.records = <Tbl_Cargo_Qtnd_Lcl[]>[];
            this.pkid = this.gs.getGuid();
            this.init();
        }
        if (this.mode == 'EDIT') {
            this.GetRecord();
        }
        if (this.mode == 'COPY') {
            this.CopyRecord();
        }
    }

    init() {

        this.record.qtnm_pkid = this.pkid;
        this.record.qtnm_no = '';
        this.record.qtnm_to_id = '';
        this.record.qtnm_to_code = '';
        this.record.qtnm_to_name = '';
        this.record.qtnm_to_addr1 = '';
        this.record.qtnm_to_addr2 = '';
        this.record.qtnm_to_addr3 = '';
        this.record.qtnm_to_addr4 = '';
        this.record.qtnm_date = this.gs.defaultValues.today;
        this.record.qtnm_quot_by = this.gs.user_code;
        this.record.qtnm_valid_date = '';
        this.record.qtnm_salesman_id = '';
        this.record.qtnm_salesman_name = '';
        this.record.qtnm_move_type = '';
        this.record.qtnm_por_id = '';
        this.record.qtnm_por_code = '';
        this.record.qtnm_por_name = '';
        this.record.qtnm_pol_id = '';
        this.record.qtnm_pol_code = '';
        this.record.qtnm_pol_name = '';
        this.record.qtnm_pod_id = '';
        this.record.qtnm_pod_code = '';
        this.record.qtnm_pod_name = '';
        this.record.qtnm_pld_name = '';
        this.record.qtnm_plfd_name = '';
        this.record.qtnm_commodity = '';
        this.record.qtnm_package = '';
        this.record.qtnm_kgs = 0;
        this.record.qtnm_lbs = 0;
        this.record.qtnm_cbm = 0;
        this.record.qtnm_cft = 0;
        this.record.qtnm_tot_amt = 0;
        this.record.qtnm_subjects = '';
        this.record.qtnm_remarks = '';
        this.record.qtnm_office_use = '';
        this.record.qtnm_transtime = '';
        this.record.qtnm_routing = '';
        this.record.qtnm_curr_code = '';
        this.record.rec_files_attached = 'N';
        if (this.gs.BRANCH_REGION != "USA") {
            this.record.qtnm_curr_code = this.gs.base_cur_code;
            // this.record.qtnm_curr_id = this.gs.base_cur_pkid;
        }
        if (!this.gs.isBlank(this.to_code_field))
            this.to_code_field.Focus();
    }

    GetRecord() {
        this.errorMessage = [];
        let filepath: string = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\quotation\\";

        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        SearchData.PATH = filepath;

        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_Cargo_Qtnm>response.record;
                this.records = <Tbl_Cargo_Qtnd_Lcl[]>response.records;
                this.mode = 'EDIT';

                if (this.record.rec_files_attached == "Y")
                    this.Foregroundcolor = "red";
                else
                    this.Foregroundcolor = "white";

                this.historyList = new Array<Tbl_Cargo_Qtnd_Lcl>();
                this.records.forEach(rec => {
                    rec.qtnd_old_amt = rec.qtnd_amt;
                    rec.qtnd_old_pkid = rec.qtnd_pkid;
                });

                if (!this.gs.isBlank(this.btnretlcl_field))
                    this.btnretlcl_field.nativeElement.focus();

            }, error => {
                this.errorMessage.push(this.gs.getError(error));
            });
    }


    Save() {

        if (!this.Allvalid())
            return;
        this.FindGrandTotal();
        this.SaveParent();

        let filepath: string = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\quotation\\";
        let filter: any = {};
        filter.PATH = filepath;

        const saveRecord = <vm_Tbl_Cargo_Qtnd_Lcl>{};
        saveRecord.record = this.record;
        saveRecord.records = this.records;
        saveRecord.pkid = this.pkid;
        saveRecord.mode = this.mode;
        saveRecord.userinfo = this.gs.UserInfo;
        saveRecord.historys = this.historyList;
        saveRecord.filter = filter;

        this.mainService.Save(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.errorMessage.push(response.error);
                    alert(this.errorMessage);
                }
                else {
                    if (this.mode == "ADD" && response.code != '')
                        this.record.qtnm_no = response.code;
                    this.mode = 'EDIT';
                    this.mainService.RefreshList(this.record);
                    this.errorMessage.push('Save Complete');
                    //alert(this.errorMessage);
                }

                this.historyList = new Array<Tbl_Cargo_Qtnd_Lcl>();
            }, error => {
                this.errorMessage.push(this.gs.getError(error));
                alert(this.errorMessage);
            });
    }

    private SaveParent() {

        if (this.mode === "EDIT" && this.historyList != null) {
            this.records.forEach(rec => {
                if (rec.qtnd_old_amt != rec.qtnd_amt) {
                    rec.qtnd_old_amt = rec.qtnd_amt;
                    if (rec.qtnd_old_pkid == rec.qtnd_pkid)
                        this.AddhList("EDIT", rec.qtnd_desc_name, rec.qtnd_old_amt.toString(), rec.qtnd_amt.toString());
                    else
                        this.AddhList("ADD", rec.qtnd_desc_name, rec.qtnd_old_amt.toString(), rec.qtnd_amt.toString());
                }
            });
        }
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


        if (this.gs.isBlank(this.record.qtnm_to_name)) {
            bRet = false;
            this.errorMessage.push("Quote To Cannot blank");
        }
        if (this.gs.isBlank(this.record.qtnm_date)) {
            bRet = false;
            this.errorMessage.push("Quote Date Cannot blank");
        }
        if (this.gs.isBlank(this.record.qtnm_salesman_id) || this.gs.isBlank(this.record.qtnm_salesman_name)) {
            bRet = false;
            this.errorMessage.push("Sales Rep. Cannot blank");
        }

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
        var rec = <Tbl_Cargo_Qtnd_Lcl>{};
        rec.qtnd_pkid = this.gs.getGuid();
        rec.qtnd_parent_id = this.pkid;
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

        if (_Record.controlname == "QUOTE-TO") {

            this.record.qtnm_to_id = _Record.id;
            this.record.qtnm_to_code = _Record.code;
            this.record.qtnm_to_name = _Record.name;
            if (_Record.col8.toString() != "")
                this.record.qtnm_to_name = _Record.col8.toString();
            this.record.qtnm_to_addr1 = _Record.col1.toString();
            this.record.qtnm_to_addr2 = _Record.col2.toString();
            this.record.qtnm_to_addr3 = _Record.col3.toString();
            this.record.qtnm_to_addr4 = this.gs.GetAttention(_Record.col5.toString());
            // Dispatcher.BeginInvoke(() => { Txt_QuoteTo_Name.Focus(); });
            this.GetContactMemo(this.record.qtnm_to_id);
        }
        if (_Record.controlname == "SALESMAN") {
            this.record.qtnm_salesman_id = _Record.id;
            this.record.qtnm_salesman_name = _Record.name;
            if (!this.gs.isBlank(this.move_type_field))
                this.move_type_field.focus();
        }
        if (_Record.controlname == "POR") {
            this.record.qtnm_por_id = _Record.id;
            this.record.qtnm_por_code = _Record.code;
            this.record.qtnm_por_name = _Record.name;
            if (!this.gs.isBlank(this.por_field))
                this.por_field.focus();
        }
        if (_Record.controlname == "POL") {
            this.record.qtnm_pol_id = _Record.id;
            this.record.qtnm_pol_code = _Record.code;
            this.record.qtnm_pol_name = _Record.name;
            if (!this.gs.isBlank(this.pol_field))
                this.pol_field.focus();
        }
        if (_Record.controlname == "POD") {
            this.record.qtnm_pod_id = _Record.id;
            this.record.qtnm_pod_code = _Record.code;
            this.record.qtnm_pod_name = _Record.name;
            if (!this.gs.isBlank(this.pod_field))
                this.pod_field.focus();
        }
        if (_Record.controlname == "CURR") {
            this.record.qtnm_curr_code = _Record.code;
            if (!this.gs.isBlank(this.qtnm_commodity_field))
                this.qtnm_commodity_field.focus();
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

    OnChange(field: string) {
    }
    onFocusout(field: string) {
    }

    onBlur(field: string) {
        switch (field) {

            case 'qtnm_kgs': {
                this.record.qtnm_kgs = this.gs.roundNumber(this.record.qtnm_kgs, 3);
                break;
            }
            case 'qtnm_lbs': {
                this.record.qtnm_lbs = this.gs.roundNumber(this.record.qtnm_lbs, 3);
                break;
            }
            case 'qtnm_cbm': {
                this.record.qtnm_cbm = this.gs.roundNumber(this.record.qtnm_cbm, 3);
                break;
            }
            case 'hbl_cft': {
                this.record.qtnm_cft = this.gs.roundNumber(this.record.qtnm_cft, 3);
                break;
            }
        }
    }

    FindWeight(_type: string) {
        if (_type == "Kgs2Lbs")
            this.record.qtnm_lbs = this.gs.Convert_Weight("KG2LBS", this.record.qtnm_kgs, 3);
        else if (_type == "Lbs2Kgs")
            this.record.qtnm_kgs = this.gs.Convert_Weight("LBS2KG", this.record.qtnm_lbs, 3);
        else if (_type == "Cbm2Cft")
            this.record.qtnm_cft = this.gs.Convert_Weight("CBM2CFT", this.record.qtnm_cbm, 3);
        else if (_type == "Cft2Cbm")
            this.record.qtnm_cbm = this.gs.Convert_Weight("CFT2CBM", this.record.qtnm_cft, 3);
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
            } case 'HISTORY': {
                let prm = {
                    menuid: this.menuid,
                    pkid: this.pkid,
                    source: 'QUOTATION-LCL-RATE',
                    title: "History [Quote# : " + this.record.qtnm_no + "]",
                    origin: 'qtn-lcl-page'
                };
                this.gs.Naviagete('Silver.BusinessModule/LogBookPage', JSON.stringify(prm));
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

    RemoveRow(_rec: Tbl_Cargo_Qtnd_Lcl) {
        if (this.mode === "EDIT" && this.historyList != null) {
            this.records.forEach(rec => {
                if (rec.qtnd_pkid == _rec.qtnd_pkid)
                    this.AddhList("DELETE", rec.qtnd_desc_name, rec.qtnd_old_amt.toString(), rec.qtnd_amt.toString());
            });
        }
        this.records.splice(this.records.findIndex(rec => rec.qtnd_pkid == _rec.qtnd_pkid), 1);
    }

    GetMessage(_msgType: string) {
        this.errorMessage = [];
        let filepath: string = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\quotation\\";

        var SearchData = this.gs.UserInfo;
        SearchData.msgtype = _msgType;
        SearchData.filepath = filepath;

        this.mainService.GetMessage(SearchData)
            .subscribe(response => {

                if (_msgType == "LCLMSG6") {
                    this.record.qtnm_remarks = response.message;
                    //Txt_Remarks.Focus();
                    if (!this.gs.isBlank(this.qtnm_remarks_field))
                        this.qtnm_remarks_field.nativeElement.focus();
                }
                else {
                    this.record.qtnm_subjects = response.message;
                    // Txt_Subject.Focus();
                    if (!this.gs.isBlank(this.qtnm_subjects_field))
                        this.qtnm_subjects_field.nativeElement.focus();
                }

            }, error => {
                this.errorMessage.push(this.gs.getError(error));
            });
    }

    GetContactMemo(_contactId: string) {
        this.errorMessage = [];
        let filepath: string = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\xmlremarks\\";
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = _contactId;
        SearchData.SPATH = filepath;

        this.mainService.GetContactMemo(SearchData)
            .subscribe(response => {
                this.record.qtnm_subjects = response.message;

                if (!this.gs.isBlank(this.to_name_field))
                    this.to_name_field.focus();
                // Txt_Subject.Focus();
            }, error => {
                this.errorMessage.push(this.gs.getError(error));
            });
    }

    Copy() {
        if (!confirm("Copy Record " + this.record.qtnm_no)) {
            return;
        }
        this.CopyRecord();
    }

    CopyRecord() {
        this.errorMessage = [];
        let filepath: string = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\quotation\\";

        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        SearchData.PATH = filepath;

        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.NewRecord();
                this.record = <Tbl_Cargo_Qtnm>response.record;
                this.records = <Tbl_Cargo_Qtnd_Lcl[]>response.records;

                this.record.qtnm_cfno = 0;
                this.record.qtnm_no = "";
                this.record.qtnm_pkid = this.pkid;
                this.record.qtnm_quot_by = this.gs.user_name;

                this.records.forEach(rec => {
                    rec.qtnd_pkid = this.gs.getGuid();
                    rec.qtnd_parent_id = this.pkid;
                    rec.qtnd_old_amt = 0;
                    rec.qtnd_old_pkid = '';
                });

            }, error => {
                this.errorMessage.push(this.gs.getError(error));
            });
    }

    AddhList(_Action: string, _hDesc: string, OldDescAmt: string, NewDescAmt: string) {
        let Str: string = "";
        Str = _Action;
        Str += "~" + OldDescAmt;
        Str += "~" + NewDescAmt;
        Str += "~" + _hDesc.replace("~", "");

        var rec = <Tbl_Cargo_Qtnd_Lcl>{};
        rec.qtnd_desc_name = Str;
        this.historyList.push(rec);
    }

    FindGrandTotal() {
        let nTot: number = 0;
        this.records.forEach(rec => {
            nTot += rec.qtnd_amt;
        });
        this.record.qtnm_tot_amt = nTot;
    }
    CloseModal() {
        this.modal.close();
    }
}

