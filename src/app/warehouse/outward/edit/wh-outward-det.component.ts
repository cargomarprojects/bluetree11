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
        if (this.gs.isBlank(this._prodid) || this.gs.isBlank(this._uomid) || this.gs.isBlank(this._custid)) {
            alert('Invalid ID');
            return;
        }

        var SearchData = this.gs.UserInfo;
        SearchData.CUST_ID = this._custid;
        SearchData.PROD_ID = this._prodid;
        SearchData.UOM_ID = this._uomid;
        this.mainservice.GetPendingProductdetails(SearchData).subscribe(response => {
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

    onBlur(field: string, rec: Tbl_wh_inwarddet = null, idx: number = 0) {
        switch (field) {
            case 'indd_despatch_cqty': {
                if (!this.gs.isBlank(rec.indd_despatch_cqty)) {
                    if (!this.isValidCqty(rec.indd_despatch_cqty))
                        alert('Invalid despatch Qty ' + rec.indd_despatch_cqty);
                    else
                        if (!this.isValidUnitFactor(rec.indd_despatch_cqty, rec.indd_unit_factor)) {
                            alert('Loose quantity should be less than ' + rec.indd_unit_factor);
                        }
                }
                break;
            }
        }
    }

    CloseModal(_type: string) {

        let bRet: boolean = true;
        if (_type == "OK") {
            let iCtr = 0;
            if (!this.gs.isBlank(this.records)) {
                this.records.forEach(Rec => {
                    iCtr++;
                    if (!this.gs.isBlank(Rec.indd_despatch_cqty)) {
                        if (!this.isValidCqty(Rec.indd_despatch_cqty)) {
                            bRet = false;
                            alert("Invalid Qty, Row" + iCtr.toString())
                        }
                        else if (!this.isValidUnitFactor(Rec.indd_despatch_cqty, Rec.indd_unit_factor)) {
                            bRet = false;
                            alert("Loose quantity should be less than " + Rec.indd_unit_factor + ", Row" + iCtr.toString());
                        } else {
                            let pcs = this.convertToPieces(Rec.indd_despatch_cqty, Rec.indd_unit_factor);
                            if (pcs > Rec.indd_qty) {
                                bRet = false;
                                alert("Insufficient quantity, Row" + iCtr.toString())
                            }
                        }
                    }
                })
            }
        }
        if (!bRet)
            return;

        if (this.callbackevent)
            this.callbackevent.emit({ action: _type, parentid: this._parentid, records: this.records });

        this.modal.close();
    }

    isValidCqty(_str: string) {
        let bOk = false;
        let str2: string = "0123456789.";
        for (var i = 0; i < _str.length; i++) {
            if (str2.includes(_str[i])) {
                bOk = true;
            } else {
                bOk = false;
                break;
            }
        }
        if (bOk) {
            let _num: number = +_str;
            if (_num <= 0)
                bOk = false;
        }
        return bOk;
    }

    isValidUnitFactor(_cQty: string, _factor: number) {
        let bOk = true;

        if (_cQty.includes(".")) {
            var nStr = _cQty.split('.');
            if (nStr.length > 2)
                bOk = false;
            else {
                if (this.gs.isBlank(nStr[1]))
                    bOk = false;
                else {
                    let _dNum: number = +nStr[1];
                    if (_dNum > (_factor - 1))
                        bOk = false;
                }
            }
        }

        return bOk;
    }

    convertToPieces(_qty: string, _factor: number): number {
        var tempItem = _qty.split('.');
        let pcs: number = 0;
        if (tempItem.length > 0)
            pcs = +tempItem[0] * _factor;
        if (tempItem.length > 1)
            pcs += +tempItem[1];

        return pcs;
    }
}
