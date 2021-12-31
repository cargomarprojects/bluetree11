import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GlobalService } from '../../../core/services/global.service';

import { AutoComplete2Component } from '../../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../../shared/input/inputbox.component';

import { AiHblService } from '../../services/aihbl.service';
import { vm_Tbl_Ai_Hblm, Ai_Hblm_Model, Tbl_Ai_Hblm } from '../../models/Tbl_ai_hbl';

import { SearchTable } from '../../../shared/models/searchtable';
import { Tbl_Ai_Formatm } from '../../models/Tbl_Ai_Format';


@Component({
    selector: 'app-ai-hbl',
    templateUrl: './aihbl.component.html'
})
export class aiHblComponent implements OnInit {

    record: Tbl_Ai_Hblm = <Tbl_Ai_Hblm>{};

    formats: Tbl_Ai_Formatm [] = <Tbl_Ai_Formatm []>[];

    tab: string = 'main';

    modal: any;
    
    
    menuid: string;
    public mode: string = '';
    errorMessage: string;
    Foregroundcolor: string;

    

    title: string;
    isAdmin: boolean;
    refno: string = "";


    bLoaded = false;

    private pkid: string;
    @Input() set _pkid(value: string) {
      this.pkid = value;
      if ( this.pkid != "")
        this.GetRecord();
    }



    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        private modalservice: NgbModal,
        public mainService: AiHblService,
    ) { }

    ngOnInit() {
        this.gs.checkAppVersion();
        //Route Change 29072021
    }

    private initPage() {
        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.errorMessage = '';
    }



    GetRecord() {
        this.initPage();
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;

        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_Ai_Hblm>response.record;
                this.formats = <Tbl_Ai_Formatm []> response.formats;
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
        const saveRecord = <vm_Tbl_Ai_Hblm>{};
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





    CloseModal(){
        this.modal.close();
    }

    callbackparent(rec : any){
        alert( rec.file_desc);
    }


}
