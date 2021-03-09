import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_general } from '../models/tbl_cargo_general';
import { Tbl_cargo_followup, vm_Tbl_cargo_followup } from '../models/tbl_cargo_followup';
import { SearchQuery } from '../models/tbl_cargo_general';
import { PageQuery } from '../../shared/models/pageQuery';

import { AlertLogPageService } from '../services/alertlogpage.service';

@Component({
    selector: 'app-alertlogpage',
    templateUrl: './alertlogpage.component.html'
})
export class AlertLogPageComponent implements OnInit {

    /*
   01-07-2019 Created By Ajith  
  
  */
    frecords: Tbl_cargo_followup[]
    ErrorMessage: string = "";
    _artab: boolean = true;
    chkallselected: boolean = false;
    selectdeselect: boolean = false;

    errorMessage$: Observable<string>;
    records$: Observable<Tbl_cargo_general[]>;
    pageQuery$: Observable<PageQuery>;
    searchQuery$: Observable<SearchQuery>;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainservice: AlertLogPageService
    ) { }

    ngOnInit() {
        this.mainservice.init(this.route.snapshot.queryParams);
        this.initPage();
        this.List('SCREEN');
    }

    List(action: string = '') {
        this.ErrorMessage = "";
        this.chkallselected = false;
        this.selectdeselect = false;
        var SearchData = this.gs.UserInfo;
        this.mainservice.FollowupList(SearchData).subscribe(response => {
            this.frecords = response.list;

        }, error => {
            this.ErrorMessage = this.gs.getError(error)
        });
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

    ngOnDestroy() {
    }


    RemoveRecord() {

        if (this.frecords == null)
            return;

        let bChecked: boolean = false;
        this.frecords.forEach(rec => {
            rec.cf_yn = 'N';
            if (rec.cf_yn_b) {
                rec.cf_yn = 'Y';
                bChecked = true;
            }
        });

        if (!bChecked) {
            this.ErrorMessage = "No Records Selected";
            alert(this.ErrorMessage);
            return;
        }

        if (!confirm("Delete Selected Records")) {
            return;
        }

        const saveRecord = <vm_Tbl_cargo_followup>{};
        saveRecord.records = this.frecords;
        saveRecord.userinfo = this.gs.UserInfo;
        this.mainservice.DeleteRecord(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.ErrorMessage = response.error;
                    alert(this.ErrorMessage);
                } else {

                    let flist: Tbl_cargo_followup[];
                    flist = this.frecords;
                    this.frecords = <Tbl_cargo_followup[]>[];
                    flist.forEach(rec => {
                        if (!rec.cf_yn_b)
                            this.frecords.push(rec);
                    });
                }

            }, error => {
                this.ErrorMessage = this.gs.getError(error);
                alert(this.ErrorMessage);
            });
    }

    SelectDeselect() {
        this.selectdeselect = !this.selectdeselect;
        for (let rec of this.frecords) {
            rec.cf_yn_b = this.selectdeselect;
        }
        this.chkallselected = this.selectdeselect;
    }

    editmasterfup(_record: Tbl_cargo_followup) {
        let sID: string = (_record.cf_master_id != null) ? _record.cf_master_id.toString() : "";
        let REFNO: string = _record.cf_refno != null ? _record.cf_refno.toString() : "";
        let sMode: string = _record.cf_mbl_mode != null ? _record.cf_mbl_mode.toString() : "";
        let branch_code: string = _record.cf_branch_code != null ? _record.cf_branch_code.toString() : "";
        if (sID == "") {
            alert('Invalid Record Selected');
            return;
        }
        if (branch_code == this.gs.branch_code) {
            this.gs.LinkPage("REFNO", sMode, REFNO, sID);
        }
        else {
            alert("Cannot Show Details from another Branch");
        }
    }

    editfup(_record: Tbl_cargo_followup) {

        let branch_code: string = _record.cf_branch_code != null ? _record.cf_branch_code.toString() : "";
        let IsLocked: boolean = false;
        IsLocked = this.gs.IsShipmentClosed(_record.cf_mbl_mode, _record.cf_ref_date, _record.cf_mbl_lock, _record.cf_mbl_unlock_date);
        let prm = {
            menuid: this.mainservice.menuid,
            master_id: _record.cf_master_id,
            master_refno: _record.cf_refno,
            master_refdate: _record.cf_ref_date,
            is_locked: IsLocked,
            origin: 'alert-log-page'
        };
        if (branch_code == this.gs.branch_code) {
            this.gs.Naviagete('Silver.BusinessModule/FollowUpPage', JSON.stringify(prm));
        }
        else {
            alert("Cannot Show Details from another Branch");
        }
    }

    editmaster(_record: Tbl_cargo_general) {
        let sID: string = (_record.mbl_pkid != null) ? _record.mbl_pkid.toString() : "";
        let REFNO: string = _record.mbl_refno != null ? _record.mbl_refno.toString() : "";
        let branch_code: string = _record.mbl_branch != null ? _record.mbl_branch.toString() : "";
        let sMode: string = this.getmode(REFNO);
        if (sID == "") {
            alert('Invalid Record Selected');
            return;
        }
        if (branch_code == this.gs.branch_code) {
            this.gs.LinkPage("REFNO", sMode, REFNO, sID);
        }
        else {
            alert("Cannot Show Details from another Branch");
        }
    }

    edithouse(_record: Tbl_cargo_general) {
        let sID: string = (_record.mbl_pkid != null) ? _record.mbl_pkid.toString() : "";
        let REFNO: string = _record.mbl_refno != null ? _record.mbl_refno.toString() : "";
        let sMode: string = this.getmode(REFNO);
        let HBLID: string = _record.hbl_pkid != null ? _record.hbl_pkid.toString() : "";
        let branch_code: string = _record.mbl_branch != null ? _record.mbl_branch.toString() : "";

        if (HBLID == "") {
            alert('Invalid Record Selected');
            return;
        }
        if (branch_code == this.gs.branch_code) {
            this.gs.LinkPage("HOUSE", sMode, REFNO, sID, HBLID);
        }
        else {
            alert("Cannot Show Details from another Branch");
        }
    }

    getmode(sRefno: string) {
        let smode: string = "";
        let sType: string = "";
        if (sRefno.length >= 2)
            sType = sRefno.substring(0, 2);

        if (sType == "OI")
            smode = "SEA IMPORT";
        else if (sType == "OE")
            smode = "SEA EXPORT";
        else if (sType == "AI")
            smode = "AIR IMPORT";
        else if (sType == "AE")
            smode = "AIR EXPORT";
        else
            smode = "OTHERS";

        return smode;
    }

}
