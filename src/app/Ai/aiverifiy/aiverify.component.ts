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

import { Tbl_aws_data } from '../models/Tbl_aws_data';

//import * as pdfjs from 'pdfjs-dist/legacy/build/pdf';

import * as pdfjs from 'pdfjs-dist';

import * as printJS from "print-js";


@Component({
    selector: 'app-aiveryfy',
    templateUrl: './aiverify.component.html'
})
export class aiverifyComponent implements OnInit {

    public mode: string = '';

    pdf: any;
    scale = 1;
    fileURL : any;

    xy = "";
    mousedata = "";
    selecteddata = "";


    @ViewChild('pdfCanvas') pdfCanvas: { nativeElement: HTMLCanvasElement };
    @ViewChild('pdfCanvas2') pdfCanvas2: { nativeElement: HTMLCanvasElement };


    tab = 2;
    pageno = 1;
    totpages = 1;

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
                this.showPDf(this.record);

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

    CloseModal() {
        this.modal.close();
    }




    onDragStart(event, _rec: Tbl_aws_data) {
        this.selectedid = _rec.data_pkid;
        event.dataTransfer.setData('data', _rec.data_text);
        navigator.clipboard.writeText(_rec.data_text);
    }

    changePage(_type: string) {
        if (_type == 'first')
        this.pageno =1;      
        if (_type == 'next')
            this.pageno++;
        if (_type == 'prev')
            this.pageno--;
        if (_type == 'last')
            this.pageno = this.totpages;            
        
        if (this.pageno <= 0)
            this.pageno = 1;
        if ( this.pageno > this.totpages)
            this.pageno--;

        this.showPdfPage(this.scale, this.pageno);
    }

    zoom(_type: string) {
        if (_type == "+")
            this.scale += .10;
        if (_type == "-")
            this.scale -= .10;
        this.showPdfPage(this.scale, this.pageno);
    }

    // pdf js

    printpdf(){
        printJS(this.fileURL);
    }


    async showPDf(rec: DB_Tbl_Mast_Files): Promise<void> {
        let fname = this.gs.FS_APP_FOLDER + rec.files_path + rec.file_id;
        const data = await this.gs.getFileaSync(this.gs.WWW_FILES_URL, fname, "pdf", rec.file_desc);
        this.fileURL = URL.createObjectURL(data);
        this.pdf = await pdfjs.getDocument(this.fileURL).promise;
        //this.pdf = null;
        this.totpages = this.pdf._pdfInfo.numPages;
        
        this.showPdfPage(this.scale, 1);
    }


    private async showPdfPage(
        scale: number,
        pageNumber: number
    ): Promise<void> {

        this.paged_records = this.records.filter(rec => rec.data_page == pageNumber);

        var canvas1 = this.pdfCanvas.nativeElement;
        var canvas2 = this.pdfCanvas2.nativeElement;

        const page = await this.pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale });
        const canvasContext = canvas1.getContext('2d');

        canvas1.height = viewport.height;
        canvas1.width = viewport.width;
        canvas1.style.height = this.ht.toString();
        canvas1.style.width = this.wd.toString();

        canvas2.height = viewport.height;
        canvas2.width = viewport.width;
        canvas2.style.height = this.ht.toString();
        canvas2.style.width = this.wd.toString();

        await page.render({ canvasContext, viewport }).promise;
    }

    onCanvasMove(evt: MouseEvent) {

        var str = "";
        const canvas1 = this.pdfCanvas.nativeElement;
        const canvas2 = this.pdfCanvas2.nativeElement;
        const ctx = canvas2.getContext('2d');

        for (var rec of this.paged_records) {
            if (evt.offsetX >= rec.data_left * this.scale && evt.offsetX <= rec.data_right * this.scale && evt.offsetY >= rec.data_top * this.scale && evt.offsetY <= rec.data_bottom * this.scale) {
                str = rec.data_text;
                break;
            }
        }
        if (str != "") {
            this.mousedata = str;
            canvas2.style.cursor = "pointer";
        }
        else {
            this.mousedata = "";
            canvas2.style.cursor = "default";
        }
    }

    onCanvasClick(evt: MouseEvent) {
        this.selectCanvasText(evt);
    }

    selectCanvasText(evt: MouseEvent) {
        var str = "";
        const canvas2 = this.pdfCanvas2.nativeElement;
        var ctx = canvas2.getContext('2d');
        ctx.clearRect(0, 0, canvas2.width, canvas2.height);
        for (var rec of this.paged_records) {
            if (evt.offsetX >= rec.data_left * this.scale && evt.offsetX <= rec.data_right * this.scale && evt.offsetY >= rec.data_top * this.scale && evt.offsetY <= rec.data_bottom * this.scale) {
                str = rec.data_text;
                navigator.clipboard.writeText(str);
                ctx.beginPath();
                ctx.moveTo(rec.data_x1 * this.scale, rec.data_y1 * this.scale);
                ctx.lineTo(rec.data_x2 * this.scale, rec.data_y2 * this.scale);
                ctx.lineTo(rec.data_x3 * this.scale, rec.data_y3 * this.scale);
                ctx.lineTo(rec.data_x4 * this.scale, rec.data_y4 * this.scale);

                ctx.closePath();
                ctx.stroke();
                break;
            }
        }
        if (str != "")
            this.selecteddata = str;
        else
            this.selecteddata = "";

        return this.selecteddata;
    }

    onDragStartCanvas(event) {
        var str = this.selectCanvasText(event);
        event.dataTransfer.setData('data', str);
    }

}
