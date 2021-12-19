import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GlobalService } from '../../core/services/global.service';

import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../shared/input/inputbox.component';

import { AiDocsService } from '../services/aidocs.service';
import { vm_Tbl_Mast_Filesm, Tbl_Mast_Filesm } from '../models/Tbl_mast_filesm';

import { SearchTable } from '../../shared/models/searchtable';



@Component({
    selector: 'app-aidocs-edit',
    templateUrl: './aidocs-edit.component.html'
})
export class aidocsEditComponent implements OnInit {

    record: Tbl_Mast_Filesm = <Tbl_Mast_Filesm>{};

    tab: string = 'main';

    modal: any;
    
    pkid: string;
    menuid: string;
    public mode: string = '';
    errorMessage: string;
    Foregroundcolor: string;

    title: string;
    isAdmin: boolean;
    refno: string = "";

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
  


    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        private modalservice: NgbModal,
        public mainService: AiDocsService,
    ) { }

    ngOnInit() {
        this.gs.checkAppVersion();
        //Route Change 29072021
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
            this.record = <Tbl_Mast_Filesm>{};
            this.pkid = this.gs.getGuid();
            this.init();
        }
        if (this.mode == 'EDIT') {
            this.GetRecord();
        }
    }

    init() {

        this.record.file_pkid = this.pkid;
        this.record.file_type = 'AI-BL';
        this.record.file_date = '';

        this.record.rec_files_attached = 'N';

        this.record.rec_created_by = this.gs.user_code;
        this.record.rec_created_date = this.gs.defaultValues.today;
    }

    GetRecord() {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_Mast_Filesm>response.record;
                this.mode = 'EDIT';
            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }


    Save() {


        if (!this.Allvalid())
            return;
        this.SaveParent();
        const saveRecord = <vm_Tbl_Mast_Filesm>{};
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
                    this.mainService.RefreshList(this.record);
                    this.errorMessage = 'Save Complete';
                    alert(this.errorMessage);
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
            return bRet;
        }


        if (this.gs.isBlank(this.record.file_remarks)) {
            bRet = false;
            this.errorMessage = "Remarks Cannot be blank";
            alert(this.errorMessage);
            return bRet;
        }

        return bRet;
    }


    Close() {
        this.location.back();
    }


    LovSelected(_Record: SearchTable) {

        if (_Record.controlname == "ACC_GROUPM") {
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
            let TypeList: any[] = [];
            TypeList = [{ "code": "MBL", "name": "MBL" }, { "code": "HBL", "name": "HBL" }, { "code": "SHIPMENT-INVOICE", "name": "SHIPMENT-INVOICE" }, { "code": "PACKING LIST", "name": "PACKING LIST" }];
            this.attach_title = 'Documents';
            this.attach_parentid = this.pkid;
            this.attach_subid = '';
            this.attach_type = '';
            this.attach_typelist = TypeList;
            this.attach_tablename = 'mast_filesm';
            this.attach_tablepkcolumn = 'file_pkid';
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
    CloseModal(){
        this.modal.close();
    }


}
