import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../../core/services/global.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchTable } from '../../../shared/models/searchtable';
import { Tbl_Cargo_Wiretransferm, Tbl_Cargo_Wiretransferd } from '../../models/tbl_cargo_wiretransferm';
import { WireTransferedService } from '../../services/wiretransfered.service';

@Component({
    selector: 'app-wiretransfered-bank',
    templateUrl: './wiretransfered-bank.component.html'
})
export class WireTransferedBankComponent implements OnInit {

    public errorMessage: string = '';
    public tab: string = 'main';

    private _mRecord: Tbl_Cargo_Wiretransferd = <Tbl_Cargo_Wiretransferd>{};
    @Input() set mRecord(value: Tbl_Cargo_Wiretransferd) {
        this._mRecord = value;
    }

    @Output() callbackevent = new EventEmitter<any>();

    modal: any;
    public records: Tbl_Cargo_Wiretransferd[] = [];
    public SelectedRecord: Tbl_Cargo_Wiretransferd = <Tbl_Cargo_Wiretransferd>{};


    constructor(
        private modalconfig: NgbModalConfig,
        private modalservice: NgbModal,
        private http2: HttpClient,
        private mainservice: WireTransferedService,
        private gs: GlobalService) {
        modalconfig.backdrop = 'static'; //true/false/static
        modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
    }

    ngOnInit() {

    }

    BankFill(bankmodal: any = null) {

        if (this.gs.isBlank(this._mRecord.cwd_beneficiary_id)) {
            alert('Invalid Bank ID');
            return;
        }

        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this._mRecord.cwd_beneficiary_id;
        this.mainservice.LoadGenList(SearchData).subscribe(response => {
            this.records = response.records;
            if (this.gs.isBlank(this.records))
                alert("Bank Details Not Found");
            else {
                this.records.forEach(rec => {
                        rec.pb_row_selected = false;
                });
                if (this.records.length == 1) {
                    this._mRecord.cwd_beneficiary_bank_id = this.records[0].pb_pkid;
                    this._mRecord.pb_bank_name = this.records[0].pb_bank_name;
                    this._mRecord.pb_parent_id = this.records[0].pb_parent_id;
                } else
                    this.modal = this.modalservice.open(bankmodal, { centered: true });
            }

        }, error => {
            alert(this.gs.getError(error));
        });

    }

    SelectRecord(_rec: Tbl_Cargo_Wiretransferd) {
        this._mRecord.cwd_beneficiary_bank_id = _rec.pb_pkid;
        this._mRecord.pb_bank_name = _rec.pb_bank_name;
        this._mRecord.pb_parent_id = _rec.pb_parent_id;
        this.modal.close();
    }

    CloseModal(_type: string) {

        // if (this.callbackevent)
        //     this.callbackevent.emit({ action: _type, rec: this.SelectedRecord });

        this.modal.close();
    }


}
