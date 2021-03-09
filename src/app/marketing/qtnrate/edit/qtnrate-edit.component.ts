import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/services/global.service';
import { AutoComplete2Component } from '../../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../../shared/input/inputbox.component';
import { QtnRateService } from '../../../marketing/services/qtnrate.service';
import { User_Menu } from '../../../core/models/menum';
import { vm_tbl_cargo_qtn_rates, Tbl_Cargo_Qtn_Rates } from '../../../marketing/models/tbl_cargo_qtn_rates';
import { SearchTable } from '../../../shared/models/searchtable';
import { strictEqual } from 'assert';
import { Tbl_Cargo_Qtnd_Lcl } from '../../models/tbl_cargo_qtnm';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-qtnrate-edit',
    templateUrl: './qtnrate-edit.component.html'
})
export class QtnRateEditComponent implements OnInit {

    @ViewChild('_btnretrate') btnretrate_field: ElementRef;
    @ViewChild('_qtnr_agent_name') qtnr_agent_name_field: AutoComplete2Component;
    @ViewChild('_qtnr_pol_cntry_name') qtnr_pol_cntry_name_field: AutoComplete2Component;
    @ViewChild('_qtnr_pod_cntry_name') qtnr_pod_cntry_name_field: AutoComplete2Component;
    @ViewChild('_qtnr_mode') qtnr_mode_field: ElementRef;

    record: Tbl_Cargo_Qtn_Rates = <Tbl_Cargo_Qtn_Rates>{};

    tab: string = 'main';

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

    modal: any;
    mbl_pkid: string;
    pkid: string;
    menuid: string;
    mode: string;
    errorMessage: string;
    Foregroundcolor: string;

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
        private mainService: QtnRateService,
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
            if (!this.gs.isBlank(this.qtnr_agent_name_field))
                this.qtnr_agent_name_field.Focus();
        }
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
            this.record = <Tbl_Cargo_Qtn_Rates>{};
            this.pkid = this.gs.getGuid();
            this.init();
        }
        if (this.mode == 'EDIT') {
            this.GetRecord();
        }
    }

    init() {

        this.record.qtnr_pkid = this.pkid;
        this.record.qtnr_agent_id = '';
        this.record.qtnr_agent_code = '';
        this.record.qtnr_agent_name = '';
        this.record.qtnr_pol_cntry_id = '';
        this.record.qtnr_pol_cntry_code = '';
        this.record.qtnr_pol_cntry_name = '';
        this.record.qtnr_pod_cntry_id = '';
        this.record.qtnr_pod_cntry_code = '';
        this.record.qtnr_pod_cntry_name = '';
        this.record.qtnr_mode = 'AIR';
        this.record.qtnr_validity = this.gs.defaultValues.today;
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
                this.record = <Tbl_Cargo_Qtn_Rates>response.record;
                this.mode = 'EDIT';

                if (this.record.rec_files_attached == "Y")
                    this.Foregroundcolor = "red";
                else
                    this.Foregroundcolor = "white";
                if (!this.gs.isBlank(this.btnretrate_field))
                    this.btnretrate_field.nativeElement.focus();

            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }


    Save() {

        if (!this.Allvalid())
            return;
        this.SaveParent();
        const saveRecord = <vm_tbl_cargo_qtn_rates>{};
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
                    if (this.mode == "ADD" && response.code != '')
                        this.record.qtnr_slno = response.code;
                    this.mode = 'EDIT';
                    this.mainService.RefreshList(this.record);
                    this.errorMessage = 'Save Complete';
                    // alert(this.errorMessage);
                }

            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);
            });
    }

    private SaveParent() {

    }
    private Allvalid(): boolean {

        var bRet = true;
        this.errorMessage = "";

        if (this.gs.isBlank(this.pkid)) {
            bRet = false;
            this.errorMessage = "Invalid ID";
            alert(this.errorMessage);
            // this.csdate_field.Focus();
            return bRet;
        }

        if (this.gs.isBlank(this.record.qtnr_agent_id) || this.gs.isBlank(this.record.qtnr_agent_name)) {
            bRet = false;
            this.errorMessage = "Agent Cannot be blank";
            alert(this.errorMessage);
            return bRet;
        }
        if (this.gs.isBlank(this.record.qtnr_validity)) {
            bRet = false;
            this.errorMessage = "Validity cannot be blank";
            alert(this.errorMessage);
            return bRet;
        }

        return bRet;
    }


    Close() {
        this.location.back();
    }

    LovSelected(_Record: SearchTable) {

        if (_Record.controlname == "AGENT") {
            this.record.qtnr_agent_id = _Record.id;
            this.record.qtnr_agent_code = _Record.code;
            this.record.qtnr_agent_name = _Record.name;
            if (!this.gs.isBlank(this.qtnr_pol_cntry_name_field))
                this.qtnr_pol_cntry_name_field.Focus();
        }

        if (_Record.controlname == "POL-COUNTRY") {
            this.record.qtnr_pol_cntry_id = _Record.id;
            this.record.qtnr_pol_cntry_name = _Record.name;
            if (!this.gs.isBlank(this.qtnr_pod_cntry_name_field))
                this.qtnr_pod_cntry_name_field.Focus();
        }
        if (_Record.controlname == "POD-COUNTRY") {
            this.record.qtnr_pod_cntry_id = _Record.id;
            this.record.qtnr_pod_cntry_name = _Record.name;
            if (!this.gs.isBlank(this.qtnr_mode_field))
                this.qtnr_mode_field.nativeElement.focus();
        }
    }

    OnChange(field: string) {
    }

    onFocusout(field: string) {
    }

    onBlur(field: string) {
    }


    BtnNavigation(action: string, attachmodal: any = null) {
        switch (action) {
            case 'ATTACHMENT': {
                this.attach_title = 'Documents';
                this.attach_parentid = this.pkid;
                this.attach_subid = '';
                this.attach_type = 'QUOTATION RATES';
                this.attach_typelist = [];
                this.attach_tablename = 'cargo_qtn_rates';
                this.attach_tablepkcolumn = 'qtnr_pkid';
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
        }
    }
    callbackevent(event: any) {
        this.tab = 'main';
    }

    CloseModal() {
        this.modal.close();
    }
}
