import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GlobalService } from '../../core/services/global.service';

import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../shared/input/inputbox.component';

import { AiDocsService } from '../services/aidocs.service';
import { vm_Tbl_Mast_Filesm, Tbl_Mast_Filesm, DB_Tbl_Mast_Files } from '../models/Tbl_mast_filesm';

import { SearchTable } from '../../shared/models/searchtable';


@Component({
    selector: 'app-aiveryfy',
    templateUrl: './aiverify.component.html'
})
export class aiverifyComponent implements OnInit {

    public mode: string = '';

    @ViewChild('pdfViewerAutoLoad') pdfViewerAutoLoad;

    
    record: DB_Tbl_Mast_Files = <DB_Tbl_Mast_Files>{};

    tab: string = 'main';

    modal: any;


    canPrint: boolean = false;
    canDownload: boolean = false;
    canExcel: boolean = false;
    canEmail: boolean = false;

    
    pkid: string;
    menuid: string;
    
    errorMessage: string;
    Foregroundcolor: string;

    width = "";
    height = "";


    title: string;
    isAdmin: boolean;
    refno: string = "";


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
        } else {
            const options = JSON.parse(this.route.snapshot.queryParams.parameter);
            this.menuid = options.menuid;
            this.pkid = options.pkid;
        }
        this.initPage();
        this.GetRecord();
    }

    private initPage() {
        this.canPrint = this.gs.canPrint(this.menuid);
        this.canDownload = this.gs.canDownload(this.menuid);
        this.canExcel = this.gs.canExel(this.menuid);
        this.canEmail = this.gs.canEmail(this.menuid);
        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.errorMessage = '';
    }


    init() {
        
    }

    GetRecord() {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        this.mainService.GetDocumentRecord(SearchData)
            .subscribe(response => {
                this.record = <DB_Tbl_Mast_Files>response.record;
                this.showPreview(this.record);

            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
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

    CloseModal(){
        this.modal.close();
    }


    showPreview(rec : DB_Tbl_Mast_Files){
        this.width = rec.files_width + "px";
        this.height = rec.files_height + "px";

        let fname = this.gs.FS_APP_FOLDER + rec.files_path  +  rec.file_id;

        this.gs.getFile(this.gs.WWW_FILES_URL , fname, "pdf", rec.file_desc).subscribe(response => {

            this.pdfViewerAutoLoad.pdfSrc = response;
            this.pdfViewerAutoLoad.refresh();
      
          }, error => {
            this.errorMessage = this.gs.getError(error);
            alert(this.errorMessage);
          });

    }


}
