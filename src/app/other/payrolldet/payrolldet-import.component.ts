import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PayrollDetService } from '../services/payrolldet.service';
import { Tbl_Cargo_Payrolldet } from '../models/tbl_cargo_payrolldet';

@Component({
    selector: 'app-payrolldet-import',
    templateUrl: './payrolldet-import.component.html'
})
export class PayrolldetImportComponent implements OnInit {

    public errorMessage: string = '';
    public tab: string = 'main';

    public _title: string = '';
    @Input() set title(value: string) {
        this._title = value;
    }
    public _menuid: string = '';
    @Input() set menuid(value: string) {
        this._menuid = value;
    }

    public _refid: string = '';
    @Input() set refid(value: string) {
        this._refid = value;
    }

    public _refdate: string = '';
    @Input() set refdate(value: string) {
        this._refdate = value;
    }

    public _refno: string = '';
    @Input() set refno(value: string) {
        this._refno = value;
    }

    @Output() callbackevent = new EventEmitter<any>();

    RecordList: Tbl_Cargo_Payrolldet[] = [];
    modal: any;
    filename: string = '';
    filetype: string = 'PDF';
    filedisplayname: string = 'Payroll.pdf';
    missingnames: string = '';
    
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
        this.init();
    }

    private init() {
        this.RecordList = <Tbl_Cargo_Payrolldet[]>[];
        this.missingnames='';
    }
    ImportPayroll(payrollmodal: any = null) {
        if (this.gs.isBlank(this._refid)) {
            alert('Invalid Ref ID');
            return;
        }
        if (this.gs.isBlank(this._refdate)) {
            alert('Invalid Payroll Date');
            return;
        }
        this.init();
        var SearchData = this.gs.UserInfo;
        SearchData.MBL_ID = this._refid;
        SearchData.PAYROLL_DATE = this._refdate;
        this.mainservice.ImportPayroll(SearchData).subscribe(response => {
            this.filename = '';
            this.filetype = '';
            this.filedisplayname = '';
            if (response.files_id) {
                this.filename = this.gs.FS_APP_FOLDER + response.files_path + response.files_id;
                this.filetype = response.filestype;
                this.filedisplayname = response.files_desc;
            }
            this.modal = this.modalservice.open(payrollmodal, { windowClass: 'large-modal', centered: true });
        }, error => {
            alert(this.gs.getError(error));
        });

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

    getDisplayDate(_dt: string) {
        return this.gs.ConvertDate2DisplayFormat(_dt);
    }


    ExtractData() {
        var SearchData = this.gs.UserInfo;
        SearchData.FILES_NAME = this.filename;
        this.mainservice.ExtractData(SearchData)
            .subscribe(response => {
                this.RecordList = <Tbl_Cargo_Payrolldet[]>response.list;
                this.missingnames = response.missingnames;
            }, error => {
                alert(this.gs.getError(error));
            });
    }

    Generate() {
        if (this.callbackevent) {
            this.callbackevent.emit({ action: 'GENERATE', extractlist: this.RecordList });
            this.modal.close();
        }
    }
}
