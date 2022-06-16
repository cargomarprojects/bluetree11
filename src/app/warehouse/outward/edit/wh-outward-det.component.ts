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

    private _headerid: string;
    @Input() set headerid(value: string) {
        this._headerid = value;
    }
    private _prodid: string;
    @Input() set prodid(value: string) {
        this._prodid = value;
    }

    private _uomid: string = '';
    @Input() set uomid(value: string) {
        this._uomid = value;
    }

    public _prodname: string;
    @Input() set prodname(value: string) {
        this._prodname = value;
    }

    public _uomname: string = '';
    @Input() set uomname(value: string) {
        this._uomname = value;
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
        SearchData.HEADER_ID = this._headerid;
        
        this.mainservice.GetPendingProductdetails(SearchData).subscribe(response => {
            this.records = response.list;

            this.detrecords.forEach(Rec => {
                this.records.forEach(Rec2 => {
                    if (Rec.indd_xref_id == Rec2.indd_xref_id) {
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

    SelectRecord(_rec: Tbl_wh_inwarddet) {

        _rec.indd_selected = !_rec.indd_selected;

    }

    onBlur(field: string, rec: Tbl_wh_inwarddet = null, idx: number = 0) {
        switch (field) {
            case 'indd_despatch_cqty': {
                rec.indd_selected = false;
                if (!this.gs.isBlank(rec.indd_despatch_cqty)) {
                    if (!this.gs.isValidCqty(rec.indd_despatch_cqty))
                        alert('Invalid despatch Qty ' + rec.indd_despatch_cqty);
                    else if (!this.gs.isValidLooseCqty(rec.indd_despatch_cqty, rec.indd_unit_factor)) {
                        alert('Loose quantity should be less than ' + rec.indd_unit_factor);
                    }
                    else {
                        if (+rec.indd_despatch_cqty > 0)
                            rec.indd_selected = true;
                    }
                }
                break;
            }
        }
    }
    onChange(field: string, rec: Tbl_wh_inwarddet = null) {
        if (rec.indd_selected)
            rec.indd_despatch_cqty = rec.indd_bal_cqty;
        else
            rec.indd_despatch_cqty = "";
    }
    CloseModal(_type: string) {

        let bRet: boolean = true;
        if (_type == "OK") {
            let iCtr = 0;
            if (!this.gs.isBlank(this.records)) {
                this.records.forEach(Rec => {
                    iCtr++;
                    if (!this.gs.isBlank(Rec.indd_despatch_cqty)) {
                        if (!this.gs.isValidCqty(Rec.indd_despatch_cqty)) {
                            bRet = false;
                            alert("Invalid Qty, Row" + iCtr.toString())
                        }
                        else if (!this.gs.isValidLooseCqty(Rec.indd_despatch_cqty, Rec.indd_unit_factor)) {
                            bRet = false;
                            alert("Loose quantity should be less than " + Rec.indd_unit_factor + ", Row" + iCtr.toString());
                        } else {
                            let pcs = this.gs.convertToPieces(Rec.indd_despatch_cqty, Rec.indd_unit_factor);
                            if (pcs > Rec.indd_qty) {
                                bRet = false;
                                alert("Insufficient quantity, Row" + iCtr.toString())
                            }
                        }
                    }
                })
            }

            if (!bRet)
                return;

            var i;
            for (i = this.detrecords.length - 1; i >= 0; i -= 1) {
                if (this.detrecords[i].indd_parent_id === this._parentid) {
                    this.detrecords.splice(i, 1);
                }
            }

            this.records.forEach(Rec => {
                if (+Rec.indd_despatch_cqty > 0) {
                    Rec.indd_pkid = this.gs.getGuid();
                    Rec.indd_parent_id = this._parentid;
                    this.detrecords.push(Rec)
                }
            })
        }

        if (this.callbackevent)
            this.callbackevent.emit({ action: _type, parentid: this._parentid, detrecords: this.detrecords });

        this.modal.close();
    }


}
