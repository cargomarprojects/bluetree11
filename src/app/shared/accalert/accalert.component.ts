import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Table_Cargo_Remarks } from '../../shared/models/table_cargo_remarks';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

declare var $: any;

@Component({
    selector: 'app-accalert',
    templateUrl: './accalert.component.html',
})
export class AccAlertComponent {
    // Local Variables 
    title = 'Accounting Alert';
    @ViewChild('accalertmodal') AccAlertModal: any;

    RecordList: Table_Cargo_Remarks[] = [];
    modal: any;

    constructor(
        private modalService: NgbModal,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        // URL Query Parameter 
    }

    // Init Will be called After executing Constructor
    ngOnInit() {

    }

    ngAfterViewInit() {

    }

    InitComponent() {
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }

    open(content: any) {
        this.modal = this.modalService.open(content, { size: "sm", backdrop: 'static', centered: true, keyboard: true, windowClass: 'accalert-modal' });
        setTimeout(() => {
            $('.accalert-modal .modal-dialog').draggable({
                handle: ".modal-header"
            });
        });
    }

    OnBlur(field: string) {

    }

    OnChange(field: string) {

    }

    Close() {
        this.modal.close();
    }

    public show(_alertRecords: Table_Cargo_Remarks[]) {
        this.RecordList = _alertRecords;
        if (!this.gs.isBlank(this.RecordList)) {
            if (this.RecordList.length > 0)
                this.open(this.AccAlertModal);
        }
    }


}