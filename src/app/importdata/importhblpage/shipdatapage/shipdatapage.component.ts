import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../../core/services/global.service';
import { Tbl_edi_master } from '../../models/tbl_edi_master';
import { SearchQuery } from '../../models/tbl_edi_master';
import { PageQuery } from '../../../shared/models/pageQuery';
import { ShipDataPageService } from '../../services/shipdatapage.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

//EDIT-AJITH-20-11-2021

@Component({
    selector: 'app-shipdatapage',
    templateUrl: './shipdatapage.component.html'
})
export class ShipDataPageComponent implements OnInit {

    // @Input() routeparams: any = null;
    modal: any;
    errorMessage$: Observable<string>;
    records$: Observable<Tbl_edi_master[]>;
    pageQuery$: Observable<PageQuery>;
    searchQuery$: Observable<SearchQuery>;
    mrecord: Tbl_edi_master;

    constructor(
        private modalconfig: NgbModalConfig,
        private modalservice: NgbModal,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainservice: ShipDataPageService
    ) {
        modalconfig.backdrop = 'static'; //true/false/static
        modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
    }

    ngOnInit() {
        this.gs.checkAppVersion();
        this.mainservice.init(this.route.snapshot.queryParams);
        this.initPage();
    }

    initPage() {

        this.records$ = this.mainservice.data$.pipe(map(res => res.records));
        this.searchQuery$ = this.mainservice.data$.pipe(map(res => res.searchQuery));
        this.pageQuery$ = this.mainservice.data$.pipe(map(res => res.pageQuery));
        this.errorMessage$ = this.mainservice.data$.pipe(map(res => res.errormessage));
    }

    searchEvents(actions: any) {
        this.mainservice.Search(actions, 'SEARCH');
    }

    pageEvents(actions: any) {
        this.mainservice.Search(actions, 'PAGE');
    }

    Close() {
        this.location.back();
    }
    DownloadEdiFile(_record: Tbl_edi_master) {
        if (this.gs.isBlank(_record.update_files_id))
            return;
        let filename = this.gs.FS_APP_FOLDER + 'EDI\\' + _record.update_files_id;
        let filedisplayname = _record.update_files_desc;
        this.Downloadfile(filename, "XML", filedisplayname);
    }
    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.GLOBAL_REPORT_FOLDER, filename, filetype, filedisplayname);
    }

    CheckMaster(_record: Tbl_edi_master) {

        if (_record.rec_updated == "Y") {
            alert('Record is already Transfered')
            return;
        }
        if (_record.rec_updated == "D") {
            alert('Deleted Record')
            return;
        }

        this.mainservice.CheckMaster(_record.masterid);
    }

    //not in use
    editmaster(_record: Tbl_edi_master) {
        let sID: string = (_record.mbl_pkid != null) ? _record.mbl_pkid.toString() : "";
        let REFNO: string = _record.mbl_refno != null ? _record.mbl_refno.toString() : "";
        let BranchCode: string = _record.mbl_branch_code != null ? _record.mbl_branch_code.toString() : "";
        let sMode: string = "SEA IMPORT";

        if (sID == "") {
            alert("Invalid Record Selected");
            return;
        }
        if (BranchCode == this.gs.branch_code)
            this.gs.LinkPage("REFNO", sMode, REFNO, sID);
        else
            alert('Cannot Show Details from another Branch');
    }

    transferdata(_record: Tbl_edi_master, transfermodal: any = null) {

        this.mrecord = _record;

        this.modal = this.modalservice.open(transfermodal, { centered: true });
    }


    ModifiedRecords(params: any) {
        if (params.saction == "CLOSE")
            this.modal.close();
    }

    getRouteDet(_format: string, _rec: Tbl_edi_master, _type: string) {
        let sID: string = (_rec.mbl_pkid != null) ? _rec.mbl_pkid.toString() : "";
        let REFNO: string = _rec.mbl_refno != null ? _rec.mbl_refno.toString() : "";
        let BranchCode: string = _rec.mbl_branch_code != null ? _rec.mbl_branch_code.toString() : "";
        let sMode: string = "SEA IMPORT";

        return this.gs.Link2Page('REFNO', sMode, REFNO, sID, '', '', _format, BranchCode);
    }
}
