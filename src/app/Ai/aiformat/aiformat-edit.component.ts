import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GlobalService } from '../../core/services/global.service';

import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../shared/input/inputbox.component';

import { AiFormatService } from '../services/aiformat.service';
import { vm_Tbl_Ai_Formatm, Tbl_Ai_Formatm, Tbl_Ai_Formatd } from '../models/Tbl_Ai_Format';

import { SearchTable } from '../../shared/models/searchtable';


@Component({
    selector: 'app-aiformat-edit',
    templateUrl: './aiformat-edit.component.html'
})
export class aiformatEditComponent implements OnInit {

    record: Tbl_Ai_Formatm = <Tbl_Ai_Formatm>{};

    records: Tbl_Ai_Formatd [] = <Tbl_Ai_Formatd[]>[];

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


    bLoaded = false;



    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        private modalservice: NgbModal,
        public mainService: AiFormatService,
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
            this.pkid = this.gs.getGuid();
            this.record = <Tbl_Ai_Formatm>{};
            if ( !this.bLoaded)
                this.records = <Tbl_Ai_Formatd[]>[];
            this.init();
        }
        if (this.mode == 'EDIT') {
            this.GetRecord();
        }
    }

    init() {

        this.record.fmt_pkid = this.pkid;
        this.record.fmt_name = '';
        this.record.fmt_type = 'HBL';
        this.record.rec_created_by = this.gs.user_code;
        this.record.rec_created_date = this.gs.defaultValues.today;

        if( this.bLoaded) {
            this.records.forEach( rec =>{
                rec.fmt_parent_id = this.pkid;
            })
        }
        
    }

    GetRecord() {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_Ai_Formatm>response.record;
                this.records = <Tbl_Ai_Formatd[]>response.records;
                this.mode = 'EDIT';
                this.bLoaded = true;
            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }


    Save() {


        if (!this.Allvalid())
            return;
        this.SaveParent();
        const saveRecord = <vm_Tbl_Ai_Formatm>{};
        saveRecord.record = this.record;
        saveRecord.records = this.records;
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


        if (this.gs.isBlank(this.record.fmt_name)) {
            bRet = false;
            this.errorMessage = "Format Cannot be blank";
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
        switch (field) {
          case 'gen_pincode': {
            break;
          }
          case 'gen_short_name': {
            break;
          }
    
        }
    }


    AddRow() {
        this.errorMessage = "";
        if (this.records == null)
          this.records = <Tbl_Ai_Formatd[]>[];
    
        let bOk: Boolean = true;
        this.records.forEach(Rec => {
          if (Rec.fmt_text == null)
            bOk = false;
        })
        if (bOk == false) {
          this.errorMessage = "Text Cannot Be Empty";
          alert(this.errorMessage);
        }
        else {
          var rec = <Tbl_Ai_Formatd>{};
          rec.fmt_pkid = this.gs.getGuid();
          rec.fmt_parent_id = this.pkid;
          rec.fmt_caption  = 'CAPTION';
          rec.fmt_text  = '';

          rec.fmt_type  = 'NA';
          rec.fmt_position  = 'NA';

          this.records.push(rec);
        }
    }

    RemoveRow(_rec: Tbl_Ai_Formatd) {
        this.errorMessage = '';
        if (!confirm("Delete Y/N")) {
          return;
        }
        this.records.splice(this.records.findIndex(rec => rec.fmt_pkid == _rec.fmt_pkid), 1);
    }



    CloseModal(){
        this.modal.close();
    }

    callbackparent(rec : any){
        alert( rec.file_desc);
    }


}
