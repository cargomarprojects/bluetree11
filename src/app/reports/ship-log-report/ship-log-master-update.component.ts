import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportService } from '../services/report.service';
import { Tbl_cargo_general } from '../../other/models/tbl_cargo_general'
import { DateComponent } from '../../shared/date/date.component';
// declare var $: any;

@Component({
    selector: 'app-ship-log-master-update',
    templateUrl: './ship-log-master-update.component.html'
})
export class ShipLogMasterUpdateComponent implements OnInit {

    @ViewChild('_mbl_pod_eta') mbl_eta_field: DateComponent;

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

        let SMENU_ID = '';
        let sType: string = this.record.mbl_mode != null ? this.record.mbl_mode.toString() : "";
        if (sType == "SEA IMPORT")
            SMENU_ID = this.gs.MENU_SI_MASTER;
        else if (sType == "SEA EXPORT")
            SMENU_ID = this.gs.MENU_SE_MASTER;
        else if (sType == "AIR IMPORT")
            SMENU_ID = this.gs.MENU_AI_MASTER;
        else if (sType == "AIR EXPORT")
            SMENU_ID = this.gs.MENU_AE_MASTER;
        else if (sType == "OTHERS")
            SMENU_ID = this.gs.MENU_OT_OPERATION;

        if (this.gs.canEdit(SMENU_ID)) {
            this.Dt_Eta = this.record.mbl_pod_eta;
            // if (!this.gs.isBlank(this.mbl_eta_field))
            //     this.mbl_eta_field.Focus();
            this.modal = this.modalservice.open(mastermodal, { centered: true });
        } else
            alert('Insufficient User Rights');
    }


    Save() {

        if (this.gs.isBlank(this.Dt_Eta)) {
            alert('Invalid ETA');
            return;
        }

        var searchData = this.gs.UserInfo;
        searchData.MBL_PKID = this.record.mbl_pkid;
        searchData.ETD = this.record.mbl_pol_etd;
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
