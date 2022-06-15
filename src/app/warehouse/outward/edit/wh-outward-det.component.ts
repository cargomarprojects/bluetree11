import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../../core/services/global.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Tbl_wh_inwardd, Tbl_wh_inwarddet } from '../../models/Tbl_wh_inwardm';
import { WhOutwardService } from '../../services/whoutward.service';

@Component({
    selector: 'app-wh-outward-det',
    templateUrl: './wh-outward-det.component.html'
})
export class WhOutwardDetComponent implements OnInit {

    public errorMessage: string = '';
    public tab: string = 'main';

    private _custid: string;
    @Input() set custid(value: string) {
        this._custid = value;
    }

    private _prodid: string;
    @Input() set prodid(value: string) {
        this._prodid = value;
    }

    private _uomid: string = '';
    @Input() set uomid(value: string) {
        this._uomid = value;
    }

    private _parentid: string = '';
    @Input() set parentid(value: string) {
        this._parentid = value;
    }

    @Input() public detrecords: Tbl_wh_inwarddet[];
    @Output() callbackevent = new EventEmitter<any>();

    modal: any;
    public records: Tbl_wh_inwarddet[] = [];
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
        if (this.gs.isBlank(this._prodid) || this.gs.isBlank(this._uomid)|| this.gs.isBlank(this._custid)) {
            alert('Invalid ID');
            return;
        }

        var SearchData = this.gs.UserInfo;
        SearchData.CUST_ID = this._custid;
        SearchData.PROD_ID = this._prodid;
        SearchData.UOM_ID = this._uomid;
        this.mainservice.GetProductdetails(SearchData).subscribe(response => {
            this.records = response.list;

              this.detrecords.forEach(Rec => {
                this.records.forEach(Rec2 => {
                  if (Rec.indd_parent_id == Rec2.indd_parent_id) {
                    Rec2.indd_despatch_cqty = Rec.indd_despatch_cqty;
                    Rec2.indd_selected = true;
                  }
                });
              });

            this.modal = this.modalservice.open(detmodal, { centered: true });

        }, error => {
            alert(this.gs.getError(error));
        });

    }

    SelectRecord(_rec: Tbl_wh_inwardd) {

    }

    CloseModal(_type: string) {

        if (this.callbackevent)
            this.callbackevent.emit({ action: _type, parentid: this._parentid, records: this.records });

        this.modal.close();
    }


}
