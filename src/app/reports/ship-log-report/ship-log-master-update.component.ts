import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportService } from '../services/report.service';
import { Tbl_cargo_general } from '../../other/models/tbl_cargo_general'

// declare var $: any;

@Component({
    selector: 'app-ship-log-master-update',
    templateUrl: './ship-log-master-update.component.html'
})
export class ShipLogMasterUpdateComponent implements OnInit {

    public errorMessage: string = '';
    public tab: string = 'main';


    @Input() record: Tbl_cargo_general;
    @Output() callbackevent = new EventEmitter<any>();

    modal: any;
    Dt_Eta: string = '';

    constructor(
        private modalconfig: NgbModalConfig,
        private modalservice: NgbModal,
        private http2: HttpClient,
        private mainservice: ReportService,
        public gs: GlobalService) {
        modalconfig.backdrop = 'static'; //true/false/static
        modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
    }

    ngOnInit() {
        this.gs.checkAppVersion();
        // $(function () {
        //     $('.modal-dialog').draggable();
        // });
    }

    onBlur(field: string) {
        // if (field == 'Dt_Eta')
        //     this.Dt_Eta = this.Dt_Eta.toUpperCase();
    }


    Showmodal(mastermodal: any = null) {
        this.Dt_Eta = this.record.mbl_pod_eta;
        this.modal = this.modalservice.open(mastermodal, { centered: true });
    }


    Save() {

        if (this.gs.isBlank(this.Dt_Eta)) {
            alert('Invalid ETA');
            return;
        }

        var searchData = this.gs.UserInfo;
        searchData.MBL_PKID = this.record.mbl_pkid;
        searchData.ETA = this.Dt_Eta;
        searchData.company_code = this.gs.company_code;
        searchData.branch_code = this.gs.branch_code;

        this.mainservice.MasterUpdate(searchData)
            .subscribe(response => {
                if (response.retvalue) {
                    if (this.callbackevent)
                        this.callbackevent.emit({ action: 'SAVE', pkid: this.record.mbl_pkid, eta: this.Dt_Eta });
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
