import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { RiderPageService } from '../services/riderpage.service';
import { User_Menu } from '../../core/models/menum';
import { Table_Cargo_Remarks, vm_Table_Cargo_Remarks } from '../models/Table_Cargo_Remarks';
import { Tbl_cargo_exp_container } from '../models/Tbl_cargo_exp_container';
import { SearchTable } from '../../shared/models/searchtable';
//EDIT-AJITH-06-09-2021

@Component({
    selector: 'app-seaexp-riderpage',
    templateUrl: './seaexp-riderpage.component.html'
})
export class SeaExpRiderPageComponent implements OnInit {

    cntrrecords: Tbl_cargo_exp_container[] = [];
    @ViewChild('_cntr_chked') cntr_chked_field: ElementRef;
    @ViewChildren('_cntr_sealno') cntr_sealno_field: QueryList<ElementRef>;
    // 15-07-2019 Created By Ajith  

    pkid: string;
    source: string;
    refno: string = '';
    menuid: string;
    mode: string;
    title: string = '';
    isAdmin: boolean;
    canPrint: boolean;
    canCopyMbl: boolean;
    
    errorMessage: string;
    remarks: string;

    is_locked: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        private mainService: RiderPageService
    ) { }

    ngOnInit() {
        this.gs.checkAppVersion();
        if (this.route.snapshot.queryParams.parameter == null) {
            this.pkid = this.route.snapshot.queryParams.pkid;
            this.menuid = this.route.snapshot.queryParams.menuid;
            this.source = this.route.snapshot.queryParams.source;
            this.refno = this.route.snapshot.queryParams.refno;
            this.canPrint = JSON.parse(this.route.snapshot.queryParams.canPrint);
            this.canCopyMbl = JSON.parse(this.route.snapshot.queryParams.canCopyMbl);
            this.is_locked = JSON.parse(this.route.snapshot.queryParams.is_locked);
        } else {
            const options = JSON.parse(this.route.snapshot.queryParams.parameter);
            this.pkid = options.pkid;
            this.menuid = options.menuid;
            this.source = options.source;
            this.refno = options.refno;
            this.canPrint = options.canPrint;
            this.canCopyMbl = options.canCopyMbl;
            this.is_locked = options.is_locked;
        }
        this.initPage();
        this.actionHandler();
    }

    private initPage() {
        this.title = "Rider [ " + this.refno + " ]";
        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.errorMessage = '';
    }

    actionHandler() {
        this.errorMessage = '';
        this.List('LOAD');
    }

    List(action: string = '') {
        this.errorMessage = '';
        let filePath: string = "";
        filePath = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\xmlremarks\\";
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        SearchData.source = this.source;
        SearchData.SPATH = filePath;

        this.mainService.List(SearchData)
            .subscribe(response => {
                 
                this.cntrrecords = (response.cntrlist == undefined || response.cntrlist == null) ? <Tbl_cargo_exp_container[]>[] : response.cntrlist;
                this.remarks = response.remarks;
                for (let rec of this.cntrrecords) {
                    rec.cntr_selected = false;
                }
                if (!this.gs.isBlank(this.cntr_chked_field))
                    this.cntr_chked_field.nativeElement.focus();
            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }

    Save() {

        this.SaveParent();
        if (!this.Allvalid())
            return;
        if (!confirm("Save")) {
            return;
        }

        let sPath: string = "";
        sPath = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\xmlremarks\\";

        var rec = <Table_Cargo_Remarks>{};
        rec.pkid = this.pkid;
        rec.source = this.source;
        rec.remarks = this.remarks;

        const saveRecord = <vm_Table_Cargo_Remarks>{};
        saveRecord.record = rec;
        saveRecord.userinfo = this.gs.UserInfo;
        saveRecord.filepath = sPath;

        this.mainService.Save(saveRecord)
            .subscribe(response => {

                if (response.retvalue == false) {
                    this.errorMessage = response.error;
                    alert(this.errorMessage);
                }
                else {
                    this.errorMessage = 'Save Complete';
                    alert(this.errorMessage);
                }
            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);
            });
    }

    private SaveParent() {
        // let iCtr: number = 0;
        // this.cntrrecords.forEach(Rec => {
        //     iCtr++;
        //     Rec.cntr_hblid = this.pkid.toString();
        //     Rec.cntr_catg = "M";
        //     Rec.cntr_order = iCtr;
        //     Rec.cntr_weight_uom = "";
        //     Rec.cntr_packages = 0;
        //     Rec.cntr_yn = Rec.cntr_selected ? "Y" : "N";
        // })
 
    }

    private Allvalid(): boolean {

        var bRet = true;
        this.errorMessage = "";
         

        return bRet;
    }


    Close() {
        this.location.back();
    }


    LovSelected(_Record: SearchTable) {
 
    }

    onFocusout(field: string) {

        switch (field) {
            //   case 'mbl_no': {
            //     this.IsBLDupliation('MBL', this.record.mbl_no);
            //     break;
            //   }
        }
    }


    onBlur(field: string, rec: Tbl_cargo_exp_container = null) {
        switch (field) {
            

            case 'cntr_no': {
                rec.cntr_no = rec.cntr_no.toUpperCase();
                break;
            }
            case 'cntr_type': {
                rec.cntr_type = rec.cntr_type.toUpperCase();
                break;
            }
            case 'cntr_sealno': {
                rec.cntr_sealno = rec.cntr_sealno.toUpperCase();
                break;
            }
            case 'cntr_pieces': {
                rec.cntr_pieces = this.gs.roundNumber(rec.cntr_pieces, 0);
                break;
            }
            case 'cntr_weight_uom': {
                rec.cntr_weight_uom = rec.cntr_weight_uom.toUpperCase();
                break;
            }
            case 'cntr_packages_uom': {
                rec.cntr_packages_uom = rec.cntr_packages_uom.toUpperCase();
                break;
            }
            case 'cntr_weight': {
                rec.cntr_weight = this.gs.roundNumber(rec.cntr_weight, 3);
                break;
            }
            case 'cntr_cbm': {
                rec.cntr_cbm = this.gs.roundNumber(rec.cntr_cbm, 3);
                break;
            }
            case 'cntr_tare_weight': {
                rec.cntr_tare_weight = this.gs.roundNumber(rec.cntr_tare_weight, 0);
                break;
            }
        }
    }

     
    OnChange(field: string, _rec: Tbl_cargo_exp_container = null) {
        if (field == 'cntr_selected') {
            try {
                if (_rec.cntr_selected) {
                    if (this.remarks.trim() != "")
                        this.remarks += "\n";
                    this.remarks += _rec.cntr_no + "\t\t\t" + _rec.cntr_sealno + "\t\t\t" + _rec.cntr_pieces.toString().padStart(3, '0');
                }
            }
            catch (Exception) {
            }
        }

    }
}
