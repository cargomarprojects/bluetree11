import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../../core/services/global.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Tbl_wh_inwardd } from '../../models/Tbl_wh_inwardm';
import { WhOutwardService } from '../../services/whoutward.service';

@Component({
    selector: 'app-wh-outward-det',
    templateUrl: './wh-outward-det.component.html'
})
export class WhOutwardDetComponent implements OnInit {

    public errorMessage: string = '';
    public tab: string = 'main';

    private _prodid: string;
    @Input() set prodid(value: string) {
        this._prodid = value;
    }

    private _uomid: string = '';
    @Input() set uomid(value: string) {
        this._uomid = value;
    }

    @Output() callbackevent = new EventEmitter<any>();

    modal: any;
    public records: Tbl_wh_inwardd[] = [];
    public SelectedRecord: Tbl_wh_inwardd = <Tbl_wh_inwardd>{};

    constructor(
        private modalconfig: NgbModalConfig,
        private modalservice: NgbModal,
        private http2: HttpClient,
        private mainservice: WhOutwardService,
        private gs: GlobalService) {
        modalconfig.backdrop = 'static'; //true/false/static
        modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
    }

    ngOnInit() {
        this.gs.checkAppVersion();
    }

    LoadList(detmodal: any = null) {
        if (this.gs.isBlank(this._prodid)||this.gs.isBlank(this._uomid)) {
            alert('Invalid ID');
            return;
        }

        var SearchData = this.gs.UserInfo;
        SearchData.PROD_ID = this._prodid;
        SearchData.UOM_ID = this._uomid;
        this.mainservice.GetProductdetails(SearchData).subscribe(response => {
            this.records = response.list;
            // this.records.forEach(rec => {
            //     if (rec.invd_payroll_yn == 'Y')
            //         rec.invd_payroll_b = true;
            //     else
            //         rec.invd_payroll_b = false;
            // });
            this.modal = this.modalservice.open(detmodal, { centered: true });

        }, error => {
            alert(this.gs.getError(error));
        });

    }

    SelectRecord(_rec: Tbl_wh_inwardd) {
        // _rec.invd_payroll_yn = 'Y';
        // this.SelectedRecord = _rec;

        // this.records.forEach(Rec => {
        //     if (Rec.invd_payroll_date == _rec.invd_payroll_date) {
        //         Rec.invd_payroll_yn = 'Y';
        //         Rec.invd_payroll_b = true;
        //     } else {
        //         Rec.invd_payroll_yn = 'N';
        //         Rec.invd_payroll_b = false;
        //     }
        // })
    }

    CloseModal(_type: string) {

        if (this.callbackevent)
            this.callbackevent.emit({ action: _type, rec: this.SelectedRecord });

        this.modal.close();
    }


}
