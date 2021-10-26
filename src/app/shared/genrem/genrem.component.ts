import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenService } from '../services/gen.services';
//CREATED-AJITH-26-10-2021

@Component({
    selector: 'app-genrem',
    templateUrl: './genrem.component.html'
})
export class GenRemarkComponent implements OnInit {

    public errorMessage: string = '';
    public tab: string = 'main';

    private _pkid: string;
    @Input() set pkid(value: string) {
        this._pkid = value;
    }

    private _source: string = '';
    @Input() set source(value: string) {
        this._source = value;
    }

    private _refno: string = '';
    @Input() set refno(value: string) {
        this._refno = value;
    }

    @Output() callbackevent = new EventEmitter<any>();

    modal: any;
    _remarks:string; 


    constructor(
        private modalconfig: NgbModalConfig,
        private modalservice: NgbModal,
        private http2: HttpClient,
        private mainservice: GenService,
        private gs: GlobalService) {
        modalconfig.backdrop = 'static'; //true/false/static
        modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
    }

    ngOnInit() {
        this.gs.checkAppVersion();
    }

    GenRemarkFill(remmodal: any = null) {

        if (this.gs.isBlank(this._pkid)) {
            alert('Invalid ID');
            return;
        }
        if (this.gs.isBlank(this._source)) {
            alert('Invalid Source ID');
            return;
        }
 
        var SearchData = this.gs.UserInfo;
        SearchData.PKID = this._pkid;
        SearchData.SOURCE = this._source;
        this.mainservice.GenRemarksGet(SearchData).subscribe(response => {
            this._remarks = response.remarks;
            this.modal = this.modalservice.open(remmodal, { centered: true });
        }, error => {
            alert(this.gs.getError(error));
        });

    }

    onBlur(field: string) {
        if (field == '_remarks')
            this._remarks = this._remarks.toUpperCase();
    }


    Save() {

        if (this.gs.isBlank(this._remarks)) {
            alert('Remarks Cannot Be Empty');
            return;
        }

        var SearchData = this.gs.UserInfo;
        SearchData.PKID = this._pkid;
        SearchData.SOURCE = this._source;
        SearchData.REMARKS = this._remarks;
        this.mainservice.GenRemarksSave(SearchData)
            .subscribe(response => {
                if (response.retvalue) {
                    this.modal.close();
                }
            }, error => {
                alert(this.gs.getError(error));
            });

    }


    Close() {

        // if (this.callbackevent)
        //     this.callbackevent.emit({ action: 'CLOSE', rec: this.record });
        this.modal.close();
    }

}
