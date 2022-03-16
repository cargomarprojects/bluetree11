import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GlobalService } from '../../core/services/global.service';

import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../shared/input/inputbox.component';

import { AiDocsService } from '../services/aidocs.service';
import { vm_Tbl_Mast_Filesm, Tbl_Mast_Filesm, DB_Tbl_Mast_Files } from '../models/Tbl_mast_filesm';

import { SearchTable } from '../../shared/models/searchtable';

import { jsPDF } from 'jspdf';
import { Tbl_aws_data } from '../models/Tbl_aws_data';


@Component({
    selector: 'app-aiveryfy',
    templateUrl: './aiverify.component.html'
})
export class aiverifyComponent implements OnInit {

    public mode: string = '';

    @ViewChild('pdfViewer') pdfViewer;
    @ViewChild("pdfViewer") pdf1: ElementRef;

    @ViewChild('canvas', { static: false }) canvas: ElementRef<HTMLCanvasElement>;
    private ctx: CanvasRenderingContext2D;

    tab = 0;
    pageno =1;

    selectedid = "";

    record: DB_Tbl_Mast_Files = <DB_Tbl_Mast_Files>{};
    records: Tbl_aws_data[] = <Tbl_aws_data[]>[];

    paged_records: Tbl_aws_data[] = <Tbl_aws_data[]>[];


    wd = 0;
    ht = 0;

    modal: any;
    canPrint: boolean = false;
    canDownload: boolean = false;
    canExcel: boolean = false;
    canEmail: boolean = false;


    pkid: string;
    menuid: string;
    parentid: string;

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
        private changeDetector: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.gs.checkAppVersion();
        //Route Change 29072021
        if (this.route.snapshot.queryParams.parameter == null) {
            this.menuid = this.route.snapshot.queryParams.menuid;
            this.pkid = this.route.snapshot.queryParams.pkid;
            this.parentid = this.route.snapshot.queryParams.parentid;
        } else {
            const options = JSON.parse(this.route.snapshot.queryParams.parameter);
            this.menuid = options.menuid;
            this.pkid = options.pkid;
            this.parentid = options.parentid;
        }

        this.initPage();
        this.GetRecord();
    }

    getCanvas() {
        if (this.canvas)
            this.ctx = this.canvas.nativeElement.getContext('2d');
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

    ngAfterViewInit() {
        this.init();
        this.getCanvas();
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
                this.records = <Tbl_aws_data[]>response.records;

                if (this.records.length > 0) {
                    this.wd = this.records[0].file_width;
                    this.ht = this.records[0].file_height;
                }

                this.showPreview(this.record);

            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }


    changeTab(_tab: number) {

        if (_tab == 0) {
            this.showPreview(this.record);
        }
        if (_tab == 1) {
            this.loadPageData();
        }
        this.tab = _tab;
    }

    loadPageData(){
        this.paged_records = this.records.filter(rec => rec.data_page == this.pageno);
    }

    getPos(x: number) {
        let tot = x;
        return tot.toString() + "pt";
    }

    btnClick(evt, _rec: Tbl_aws_data) {
        this.selectedid = _rec.data_pkid;
        navigator.clipboard.writeText(_rec.data_text);
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

    CloseModal() {
        this.modal.close();
    }


    showPreview(rec: DB_Tbl_Mast_Files) {
        this.width = rec.files_width + "px";
        this.height = rec.files_height + "px";

        let fname = this.gs.FS_APP_FOLDER + rec.files_path + rec.file_id;

        this.gs.getFile(this.gs.WWW_FILES_URL, fname, "pdf", rec.file_desc).subscribe(response => {

            this.pdfViewer.pdfSrc = response;
            this.pdfViewer.refresh();

        }, error => {
            this.errorMessage = this.gs.getError(error);
            alert(this.errorMessage);
        });

    }

    Generate() {

        var ipage = 1;
        let doc = new jsPDF({
            orientation: "portrait",
            unit: "pt",
            format: [this.wd, this.ht]
        });
        doc.setFontSize(8);
        for (var rec of this.records) {
            if (rec.data_page != ipage) {
                ipage = rec.data_page;
                doc.addPage();
            }
            doc.text(rec.data_text, rec.data_left, rec.data_top);
        }
        this.pdfViewer.pdfSrc = doc.output('blob');
        this.pdfViewer.refresh();
    }

    showData(_page: number) {
        this.changeDetector.detectChanges();
        this.paged_records = this.records.filter(rec => rec.data_page == _page);

        this.getCanvas();

        if (!this.ctx) {
            alert('! ctx');
            return;
        }
        this.ctx.clearRect(0, 0, this.wd, this.ht);
        for (var rec of this.paged_records) {
            this.ctx.font = "10px Arial";
            this.ctx.fillText(rec.data_text, rec.data_left * 2, rec.data_top * 2);
        }
    }

    onDragStart(event, _rec: Tbl_aws_data) {
        this.selectedid = _rec.data_pkid;
        event.dataTransfer.setData('data', _rec.data_text);
        navigator.clipboard.writeText(_rec.data_text);
    }

    changePage(_type : string ){
        if ( _type == 'next')
            this.pageno++;
        if ( _type == 'prev')
            this.pageno--;   
        if ( this.pageno <=0)         
            this.pageno =1;

        this.paged_records = this.records.filter(rec => rec.data_page == this.pageno);
    }   
}
