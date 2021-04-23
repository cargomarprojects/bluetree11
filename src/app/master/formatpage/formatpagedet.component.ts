import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Tbl_cargo_hblformat, vm_Tbl_cargo_hblformat } from '../models/Tbl_cargo_hblformat';
import { FormatPageService } from '../services/formatpage.service';

@Component({
    selector: 'app-formatpagedet',
    templateUrl: './formatpagedet.component.html'
})
export class FormatPageDetComponent implements OnInit {

    public errorMessage: string = '';
    public tab: string = 'main';

    private _formatid: string;
    @Input() set formatid(value: string) {
        this._formatid = value;
    }

    private _formatname: string = '';
    @Input() set formatname(value: string) {
        this._formatname = value;
    }

    private _formattype: string = '';
    @Input() set formattype(value: string) {
        this._formattype = value;
    }

    private _title: string = '';
    @Input() set title(value: string) {
        this._title = value;
    }

    @Output() callbackevent = new EventEmitter<any>();

    modal: any;
    public records: Tbl_cargo_hblformat[] = [];
    public SelectedRecord: Tbl_cargo_hblformat = <Tbl_cargo_hblformat>{};
    private chkallselected: boolean = false;
    private selectdeselect: boolean = false;

    constructor(
        private modalconfig: NgbModalConfig,
        private modalservice: NgbModal,
        private http2: HttpClient,
        private mainservice: FormatPageService,
        private gs: GlobalService) {
        modalconfig.backdrop = 'static'; //true/false/static
        modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
    }

    ngOnInit() {

    }

    FormatUpdate(formatmodal: any = null) {

        if (this.gs.isBlank(this._formatid)) {
            alert('Invalid Format');
            return;
        }

        var SearchData = this.gs.UserInfo;
        SearchData.FORMAT_ID = this._formatid;
        this.mainservice.ListDet(SearchData).subscribe(response => {
            this.records = response.list;
            this.records.forEach(rec => {
                if (rec.blf_enabled == 'Y')
                    rec.blf_enabled_b = true;
                else
                    rec.blf_enabled_b = false;
            });
            this.modal = this.modalservice.open(formatmodal, { centered: true });

        }, error => {
            alert(this.gs.getError(error));
        });

    }

    SelectRecord(_rec: Tbl_cargo_hblformat) {
        _rec.blf_enabled_b = !_rec.blf_enabled_b;
        _rec.blf_enabled = _rec.blf_enabled_b ? 'Y' : 'N';
        this.SelectedRecord = _rec;
    }



    CloseModal(_type: string) {

        if (this.callbackevent)
            this.callbackevent.emit({ action: _type, rec: this.SelectedRecord });

        this.modal.close();
    }

    SaveDet() {

        if (this.gs.isBlank(this.records)) {
            alert('No List Found');
            return;
        }
        if (!confirm('Save Selected Rows, Format Print')) {
            return;
        }

        const saveRecord = <vm_Tbl_cargo_hblformat>{};
        saveRecord.records = this.records;
        saveRecord.userinfo = this.gs.UserInfo;
        this.mainservice.SaveDet(saveRecord).subscribe(response => {
            if (response.retvalue == false) {
                this.errorMessage = response.error;
                alert(this.errorMessage);
            }
            else {
                this.errorMessage = "Save Complete";
                // alert(this.errorMessage);
                this.modal.close();
            }
        }, error => {
            alert(this.gs.getError(error));
        });

    }

    ReUpdateDet() {

        if (this.gs.isBlank(this._formatid)) {
            alert('Invalid Format ID');
            return;
        }
        if (this.gs.isBlank(this._formattype)) {
            alert('Invalid Format Type');
            return;
        }

        var SearchData = this.gs.UserInfo;
        SearchData.FORMAT_ID = this._formatid;
        SearchData.FORMAT_TYPE = this._formattype;

        this.mainservice.ReUpdateDet(SearchData).subscribe(response => {
            if (response.retvalue == false) {
                this.errorMessage = response.error;
                alert(this.errorMessage);
            }
            else {
                this.errorMessage = "Save Complete";
                // alert(this.errorMessage);
                this.modal.close();
            }
        }, error => {
            alert(this.gs.getError(error));
        });
    }

    SelectDeselect() {
        this.selectdeselect = !this.selectdeselect;
        this.records.forEach(Rec => {
            Rec.blf_enabled_b = this.selectdeselect;
            this.chkallselected = this.selectdeselect;
            Rec.blf_enabled = Rec.blf_enabled_b ? 'Y' : 'N';
        })
    }


}
