import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Tbl_cargo_hblformat } from '../models/Tbl_cargo_hblformat';
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

    @Output() callbackevent = new EventEmitter<any>();

    modal: any;
    public records: Tbl_cargo_hblformat[] = [];
    public SelectedRecord: Tbl_cargo_hblformat = <Tbl_cargo_hblformat>{};


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


}
