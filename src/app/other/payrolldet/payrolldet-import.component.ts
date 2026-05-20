import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PayrollDetService } from '../services/payrolldet.service';

@Component({
    selector: 'app-payrolldet-import',
    templateUrl: './payrolldet-import.component.html'
})
export class PayrolldetImportComponent implements OnInit {

    public errorMessage: string = '';
    public tab: string = 'main';

    private _title: string = '';
    @Input() set title(value: string) {
        this._title = value;
    }
    private _menuid: string = '';
    @Input() set menuid(value: string) {
        this._menuid = value;
    }

    private _refid: string = '';
    @Input() set refid(value: string) {
        this._refid = value;
    }

    private _refdate: string = '';
    @Input() set refdate(value: string) {
        this._refdate = value;
    }

    private _refno: string = '';
    @Input() set refno(value: string) {
        this._refno = value;
    }

    @Output() callbackevent = new EventEmitter<any>();

    modal: any;
    filename: string = 'D:\\motherlines.us\\Files_Folder\\NewYork\\Files\\5EB04B048CF6B42B446E2F1B3C50ED6C.PDF';
    filetype: string = 'PDF';
    filedisplayname: string = 'Payroll.pdf';


    constructor(
        private modalconfig: NgbModalConfig,
        private modalservice: NgbModal,
        private http2: HttpClient,
        private mainservice: PayrollDetService,
        private gs: GlobalService) {
        modalconfig.backdrop = 'static'; //true/false/static
        modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
    }

    ngOnInit() {
        this.gs.checkAppVersion();
    }

    ImportPayroll(payrollmodal: any = null) {

        if (this.gs.isBlank(this._refid)) {
            alert('Invalid Ref ID');
            return;
        }
        if (this.gs.isBlank(this._refdate)) {
            alert('Invalid Ref Date');
            return;
        }

        this.modal = this.modalservice.open(payrollmodal, { centered: true });

        // var SearchData = this.gs.UserInfo;
        // SearchData.REF_ID = this._refid;
        // SearchData.REF_DATE = this._refdate;
        // this.mainservice.ImportPayroll(SearchData).subscribe(response => {
             

        //     this.modal = this.modalservice.open(payrollmodal, { centered: true });
        // }, error => {
        //     alert(this.gs.getError(error));
        // });

    }

    onBlur(field: string) {
        // if (field == '_remarks')
        //     this._remarks = this._remarks.toUpperCase();
    }


    Save() {

         

    }


    Close() {

        // if (this.callbackevent)
        //     this.callbackevent.emit({ action: 'CLOSE', rec: this.record });
        this.modal.close();
    }

}
