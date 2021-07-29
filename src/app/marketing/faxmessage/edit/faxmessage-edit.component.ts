import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/services/global.service';
import { AutoComplete2Component } from '../../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../../shared/input/inputbox.component';
import { FaxMessageService } from '../../../marketing/services/faxmessage.service';
import { User_Menu } from '../../../core/models/menum';
import { vm_tbl_cargo_message, Tbl_Cargo_Message } from '../../../marketing/models/tbl_cargo_message';
import { SearchTable } from '../../../shared/models/searchtable';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-faxmessage-edit',
    templateUrl: './faxmessage-edit.component.html'
})
export class FaxMessageEditComponent implements OnInit {

    @ViewChild('_btnretfax') btnretrate_field: ElementRef;
    // @ViewChild('_qtnr_agent_name') qtnr_agent_name_field: AutoComplete2Component;
    // @ViewChild('_qtnr_pol_cntry_name') qtnr_pol_cntry_name_field: AutoComplete2Component;
    // @ViewChild('_qtnr_pod_cntry_name') qtnr_pod_cntry_name_field: AutoComplete2Component;
    // @ViewChild('_qtnr_mode') qtnr_mode_field: ElementRef;

    record: Tbl_Cargo_Message = <Tbl_Cargo_Message>{};

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

    modal: any;
    mbl_pkid: string;
    pkid: string;
    menuid: string;
    mode: string;
    errorMessage: string;
    Foregroundcolor: string;

    msgFontFamily: string = "Calibri";
    msgFontSize: string = "14px";
    msgForeground: string = "Black";
    msgFontWeight: string = "normal";
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
        private mainService: FaxMessageService,
    ) {
        modalconfig.backdrop = 'static'; //true/false/static
        modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
    }

    ngOnInit() {
        this.gs.checkAppVersion();
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
            // if (!this.gs.isBlank(this.qtnr_agent_name_field))
            //     this.qtnr_agent_name_field.Focus();
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
            this.record = <Tbl_Cargo_Message>{};
            this.pkid = this.gs.getGuid();
            this.init();
        }
        if (this.mode == 'EDIT') {
            this.GetRecord();
        }
    }

    init() {

        this.record.msg_pkid = this.pkid;
        this.record.msg_date = this.gs.defaultValues.today;
        this.record.msg_page_nos = 0;
        this.record.msg_from_id = this.gs.user_pkid;
        this.record.msg_from_name = this.gs.user_name;
        this.record.msg_from_email = this.gs.user_email;
        this.record.msg_party_code = '';
        this.record.msg_party_name = '';
        this.record.msg_party_id = '';
        this.record.msg_party_attn = '';
        this.record.msg_party_telfax = '';
        this.record.msg_subject = '';
        this.record.msg_body = '';;
        this.record.rec_created_by = this.gs.user_code;
        this.record.rec_created_date = this.gs.defaultValues.today;
    }

    GetRecord() {
        this.errorMessage = '';
        let filepath: string = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\fax\\";
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        SearchData.PATH = filepath;
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_Cargo_Message>response.record;
                this.mode = 'EDIT';

                this.record.msg_is_urgent_b = this.record.msg_is_urgent == 'Y' ? true : false;
                this.record.msg_is_review_b = this.record.msg_is_review == 'Y' ? true : false;
                this.record.msg_is_comment_b = this.record.msg_is_comment == 'Y' ? true : false;
                this.record.msg_is_reply_b = this.record.msg_is_reply == 'Y' ? true : false;
                // if (this.record.rec_files_attached == "Y")
                //     this.Foregroundcolor = "red";
                // else
                //     this.Foregroundcolor = "white";
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
        let filepath: string = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\fax\\";
        let filter: any = {};
        filter.PATH = filepath;

        const saveRecord = <vm_tbl_cargo_message>{};
        saveRecord.record = this.record;
        saveRecord.pkid = this.pkid;
        saveRecord.mode = this.mode;
        saveRecord.userinfo = this.gs.UserInfo;
        saveRecord.filter = filter;

        this.mainService.Save(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.errorMessage = response.error;
                    alert(this.errorMessage);
                }
                else {
                    if (this.mode == "ADD" && response.code != '')
                        this.record.msg_refno = response.code;
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
        this.record.msg_is_urgent = this.record.msg_is_urgent_b ? 'Y' : 'N';
        this.record.msg_is_review = this.record.msg_is_review_b ? 'Y' : 'N';
        this.record.msg_is_comment = this.record.msg_is_comment_b ? 'Y' : 'N';
        this.record.msg_is_reply = this.record.msg_is_reply_b ? 'Y' : 'N';
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

        if (this.gs.isBlank(this.record.msg_date)) {
            bRet = false;
            this.errorMessage = "Date Cannot be blank";
            alert(this.errorMessage);
            return bRet;
        }
        if (this.gs.isBlank(this.record.msg_body)) {
            bRet = false;
            this.errorMessage = "Message Body cannot be blank";
            alert(this.errorMessage);
            return bRet;
        }

        return bRet;
    }


    Close() {
        this.location.back();
    }

    LovSelected(_Record: SearchTable) {

        if (_Record.controlname == "CUSTOMER") {
            this.record.msg_party_id = _Record.id;
            this.record.msg_party_code = _Record.code;
            this.record.msg_party_name = _Record.name;
            // if (!this.gs.isBlank(this.qtnr_pol_cntry_name_field))
            //     this.qtnr_pol_cntry_name_field.Focus();
        }


    }

    OnChange(field: string) {
    }

    onFocusout(field: string) {
    }

    onBlur(field: string) {
        if (field == "msg_from_name")
            this.record.msg_from_name = this.record.msg_from_name.toUpperCase();
        if (field == "msg_party_name")
            this.record.msg_party_name = this.record.msg_party_name.toUpperCase();
        if (field == "msg_party_attn")
            this.record.msg_party_attn = this.record.msg_party_attn.toUpperCase();
        if (field == "msg_party_telfax")
            this.record.msg_party_telfax = this.record.msg_party_telfax.toUpperCase();
        if (field == "msg_subject")
            this.record.msg_subject = this.record.msg_subject.toUpperCase();

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

    FaxMessageRptPrint() {

        this.report_title = this.mainService.title;
        this.report_url = '/api/Marketing/FaxMessagePage/GetFaxMessageReport';
        this.report_searchdata = this.gs.UserInfo;
        this.report_searchdata.pkid = this.pkid;
        this.report_searchdata.PATH = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\fax\\";
        this.report_menuid = this.menuid;
        this.tab = 'report';
    }
}
