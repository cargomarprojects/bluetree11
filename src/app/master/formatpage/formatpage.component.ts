import { Component, OnInit,  Input, Output, EventEmitter, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../core/services/global.service';
import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../shared/input/inputbox.component';
import { FormatPageService } from '../../master/services/formatpage.service';
import { vm_Tbl_cargo_hblformat, Tbl_cargo_hblformat } from '../../master/models/Tbl_cargo_hblformat';
import { SearchTable } from '../../shared/models/searchtable';
import { TBL_MAST_PARAM } from '../../master/models/Tbl_Mast_Param';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SearchQuery } from '../models/Tbl_cargo_hblformat';
import { PageQuery } from '../../shared/models/pageQuery';


@Component({
    selector: 'app-formatpage',
    templateUrl: './formatpage.component.html'
})
export class FormatPageComponent implements OnInit {

    
    @ViewChild('canvas', { static: false }) canvas: ElementRef<HTMLCanvasElement>;
    private ctx: CanvasRenderingContext2D;  

    @ViewChild('_btnretf') btnretf_ctrl: ElementRef;
    @ViewChildren('btn') btns: QueryList<ElementRef>;
    
    selected_btn: ElementRef;

    errorMessage$: Observable<string>;
    records$: Observable<Tbl_cargo_hblformat[]>;
    pageQuery$: Observable<PageQuery>;
    searchQuery$: Observable<SearchQuery>;

    tab: string = 'main';
    report_title: string = '';
    report_url: string = '';
    report_searchdata: any = {};
    report_menuid: string = '';
    modal: any;

    record :  Tbl_cargo_hblformat;

    
    selectedItem = -1;
    btnx = 0;
    btny =0;

    mouseX = 0;
    mouseY = 0;

    destX = 0;
    destY = 0;

    remarks = '';

    ht = 1200;
    wd = 900;


    last_x = 0;
    last_y = 0;


    constructor(
        private modalconfig: NgbModalConfig,
        private modalservice: NgbModal,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        private mainservice: FormatPageService,
    ) {
        modalconfig.backdrop = 'static'; //true/false/static
        modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
    }

    ngOnInit() {
        this.gs.checkAppVersion();
        this.mainservice.init(this.route.snapshot.queryParams);
        this.initPage();

        this.getCanvas();
        this.drawPage();
    }





    private initPage() {
        
        this.records$ = this.mainservice.data$.pipe(map(res => res.records));
        this.searchQuery$ = this.mainservice.data$.pipe(map(res => res.searchQuery));
        this.pageQuery$ = this.mainservice.data$.pipe(map(res => res.pageQuery));
        this.errorMessage$ = this.mainservice.data$.pipe(map(res => res.errorMessage));
    }

    ngAfterViewInit() {
        if (!this.gs.isBlank(this.btnretf_ctrl)) {
            this.btnretf_ctrl.nativeElement.focus();
        }


        this.getCanvas();
        this.drawPage();
    }
    searchEvents(actions: any) {
        if (actions.outputformat === "PRINT")
            this.PrintFormat(actions);
        else {
            this.remarks = '';
            this.mainservice.Search(actions, 'SEARCH');
        }
    }


    pageEvents(actions: any) {
        this.mainservice.Search(actions, 'PAGE');
    }

    Close() {
        this.location.back();
    }

    LovSelected(_Record: SearchTable) {
        let bchange: boolean = false;


    }

    OnChange(field: string) {
    }
    onFocusout(field: string) {
    }

    OnBlur(field: string, _rec: Tbl_cargo_hblformat = null) {
        if (field == "blf_col_x")
            _rec.blf_col_x = this.gs.roundNumber(_rec.blf_col_x, 0);
        if (field == "blf_col_y")
            _rec.blf_col_y = this.gs.roundNumber(_rec.blf_col_y, 0);
        if (field == "blf_width")
            _rec.blf_width = this.gs.roundNumber(_rec.blf_width, 0);
    }


    BtnNavigation(action: string, attachmodal: any = null) {
        switch (action) {
            // case 'MEMO': {
            //     let prm = {
            //         menuid: this.menuid,
            //         pkid: this.pkid,
            //         source: 'CONTACT-MEMO',
            //         title: 'Memo',
            //         origin: 'sales-journal-page'
            //     };
            //     this.gs.Naviagete('Silver.BusinessModule/XmlRemarksPage', JSON.stringify(prm));
            //     break;
            // }

        }
    }
    callbackevent(event: any) {
        this.tab = 'main';
    }
    CloseModal() {
        this.modal.close();
    }

    PrintFormat(_searchdata: any) {

        // if (!this.mainservice.canPrint) {
        //     alert('Insufficient User Rights')
        //     return;
        // }

        // this.report_title = this.mainservice.title;
        // this.report_url = '/api/Master/FormatPage/GetFormatRpt';
        // this.report_searchdata = this.gs.UserInfo;
        // this.report_searchdata.pkid = this.gs.getGuid();
        // this.report_searchdata.FORMAT_ID = _searchdata.searchQuery.format_id;
        // this.report_searchdata.FORMAT_TYPE = _searchdata.searchQuery.fromdate;
        // this.report_menuid = this.mainservice.menuid;
        // this.tab = 'report';
    }

    changepos(pos: string, rec: Tbl_cargo_hblformat) {
        if (pos == 'left') {
            rec.blf_col_x = rec.blf_col_x - 8;
        }
        if (pos == 'right') {
            rec.blf_col_x = rec.blf_col_x + 8;
        }
        if (pos == 'up') {
            rec.blf_col_y = rec.blf_col_y - 15;
        }
        if (pos == 'down') {
            rec.blf_col_y = rec.blf_col_y + 15;
        }
    }


    getPos( x : number)
    {   
        let tot = x *  this.mainservice.zoom;
        return tot.toString() + "px";
    }

    onKeydown(event : KeyboardEvent, _rec  : Tbl_cargo_hblformat) {
        console.log(event.key);
        this.disableScrolling();
        var _factor = 1;
        if (event.key === "ArrowDown") {
            _rec.blf_col_y += _factor;
        }
        if (event.key === "ArrowUp") {
            _rec.blf_col_y -= _factor;
        }
        if (event.key === "ArrowLeft") {
            _rec.blf_col_x -= _factor;
        }
        if (event.key === "ArrowRight") {
            _rec.blf_col_x += _factor;
        }

        
    }
    onKeyup(event : KeyboardEvent, _rec  : Tbl_cargo_hblformat) {
        this.enableScrolling();
    }


 
    
    setRemarks(){
        var str = "";
        str = "Pos : (" + this.btnx.toString() + "," + this.btny.toString();
        str += ")-(" + this.mouseX.toString() + "," + this.mouseY.toString() + ")";
        this.remarks = str;
    }

    btnClick(evt  , _rec  : Tbl_cargo_hblformat)
    {
        this.btnx = evt.x;
        this.btny = evt.y;
        this.setRemarks();     

        this.last_x = _rec.blf_col_x;
        this.last_y = _rec.blf_col_y;
        this.DrawXYLines(_rec.blf_col_x, _rec.blf_col_y);
        //#btn

    }

    onDragStart(evt,_rec  : Tbl_cargo_hblformat, i :number){
        this.record = _rec;        
        this.selectedItem = i; 
        this.btnx = evt.x;
        this.btny = evt.y;
        this.setRemarks();
    }

    allowDrop(evt) {
        this.mouseX =  evt.x;
        this.mouseY =  evt.y;
        this.setRemarks();
        evt.preventDefault();
    }
   
    onDrop(evt) {
        if ( this.selectedItem == -1)
            return;
        this.setRemarks();
        var x = 0;
        var y = 0;
        if (evt.x > this.btnx) {
            x = (evt.x - this.btnx ) / this.mainservice.zoom;
            this.record.blf_col_x = this.record.blf_col_x + x;
        }
        if (evt.x < this.btnx) {
            x = (this.btnx - evt.x) / this.mainservice.zoom;
            this.record.blf_col_x = this.record.blf_col_x - x;
        }

        if (evt.y > this.btny) {
            y = (evt.y - this.btny) / this.mainservice.zoom;
            this.record.blf_col_y = this.record.blf_col_y + y;
        }
        if (evt.y < this.btny) {
            y = (this.btny - evt.y) / this.mainservice.zoom;
            this.record.blf_col_y = this.record.blf_col_y - y;
        }
        this.destX = x;
        this.destY = y;
        this.setRemarks();
        this.selectedItem = -1;
    }

    getCanvas(){
        if ( this.canvas)
            this.ctx = this.canvas.nativeElement.getContext('2d');
    }

    drawPage(){
        if ( !this.ctx)
            return;
        this.ctx.clearRect(0, 0, this.wd, this.ht);

        this.ctx.beginPath();
        //this.ctx.fillStyle = 'gray';

        this.ctx.strokeStyle = "gray";
        this.ctx.lineWidth = 0.2;
        for ( var k=0; k <= this.wd ; k+=50){
            this.ctx.moveTo(k, 0);
            this.ctx.lineTo(k,this.ht);
        }

        for ( var k=0; k <= this.ht ; k+=50){
            this.ctx.moveTo(0, k);
            this.ctx.lineTo(this.wd,k);
        }

        this.ctx.stroke();
    }

    
    onDrag(evt : MouseEvent,_rec  : Tbl_cargo_hblformat, i=0){
        //this.DrawXYLines(evt.x, evt.y);
        //if ( this.inputs.toArray()[index])
        //this.inputs.toArray()[index].nativeElement.focus();
        var x = this.btns.toArray()[i].nativeElement.style.left;
        var y = this.btns.toArray()[i].nativeElement.style.top;
        this.findXy(x,y);
    }

    findXy(x : number, y : number){


        if (x > this.btnx) {
            x = (x - this.btnx ) / this.mainservice.zoom;
            x = this.record.blf_col_x + x;
        }
        if (x < this.btnx) {
            x = (this.btnx - x) / this.mainservice.zoom;
            x = this.record.blf_col_x - x;
        }

        if (y > this.btny) {
            y = (y - this.btny) / this.mainservice.zoom;
            y = this.record.blf_col_y + y;
        }
        if (y < this.btny) {
            y = (this.btny - y) / this.mainservice.zoom;
            y = this.record.blf_col_y - y;
        }
        //this.DrawXYLines(x,y);
    }


    DrawXYLines(x : number, y : number, color : string = 'blue'){
        if ( !this.ctx)
            return;
        
        x -= 3;
        y -= 3;

        this.drawPage();            
        this.ctx.beginPath();
        this.ctx.lineWidth = 0.4;
        this.ctx.strokeStyle = "blue";
        
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x,this.ht);

        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.wd,y);

        this.ctx.stroke();
    }


    disableScrolling(){
        var x=window.scrollX;
        var y=window.scrollY;
        window.onscroll=function(){window.scrollTo(x, y);};
    }
    
    enableScrolling(){
        window.onscroll=function(){};
    }



}
