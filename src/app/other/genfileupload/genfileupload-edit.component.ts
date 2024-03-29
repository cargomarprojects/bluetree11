import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../shared/input/inputbox.component';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenFileUploadService } from '../services/genfileupload.service';
import { User_Menu } from '../../core/models/menum';
import { vm_Tbl_cargo_genfiles, Tbl_cargo_genfiles, Tbl_cargo_genfilesModel } from '../models/Tbl_cargo_genfiles';
import { SearchTable } from '../../shared/models/searchtable';

//EDIT-AJITH-06-09-2021

@Component({
    selector: 'app-genfileupload-edit',
    templateUrl: './genfileupload-edit.component.html'
})
export class GenFileUploadEditComponent implements OnInit {

    record: Tbl_cargo_genfiles = <Tbl_cargo_genfiles>{};

    tab: string = 'main';

    pkid: string;
    menuid: string;
    public mode: string = '';
    errorMessage: string;
    Foregroundcolor: string;

    next_chqno = 0;

    CFNO = "";

    title: string;
    isAdmin: boolean;
    refno: string = "";

    decplace = 0;

    isAccLocked = false;
    modal: any;
    showchqdt = true;

    where = " ACC_TYPE = 'BANK' ";

    oldrefno = '';

    HouseList: Tbl_cargo_genfiles[] = [];

    constructor(
        private modalconfig: NgbModalConfig,
        private modalservice: NgbModal,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainService: GenFileUploadService,
    ) {
        this.decplace = this.gs.foreign_amt_dec;
    }

    ngOnInit() {
        this.gs.checkAppVersion();
        //Route Change 29072021
        if (this.route.snapshot.queryParams.parameter == null) {
            this.menuid = this.route.snapshot.queryParams.menuid;
            this.pkid = this.route.snapshot.queryParams.pkid;
            this.mode = this.route.snapshot.queryParams.mode;

        } else {
            const options = JSON.parse(this.route.snapshot.queryParams.parameter);
            this.menuid = options.menuid;
            this.pkid = options.pkid;
            this.mode = options.mode;
        }

        this.setup();

        this.initPage();
        this.actionHandler();
    }

    setup() {

        if (this.gs.SHOW_CHECK_DATE == "N") {
            this.showchqdt = false;
        }

    }


    private initPage() {

        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.errorMessage = '';
        this.LoadCombo();
    }

    LoadCombo() {

    }

    NewRecord() {
        this.mode = 'ADD'
        this.actionHandler();
    }

    actionHandler() {
        this.errorMessage = '';
        this.isAccLocked = false;

        if (this.mode == 'ADD') {
            this.record = <Tbl_cargo_genfiles>{};
            this.pkid = this.gs.getGuid();
            this.init();
        }
        if (this.mode == 'EDIT') {
            this.GetRecord();
        }
    }

    init() {

        this.record.gf_pkid = this.pkid;
        this.record.gf_slno = 0;
        this.record.gf_type = 'BANK STATEMENT';


        this.record.rec_created_by = this.gs.user_code;
        this.record.rec_created_date = this.gs.defaultValues.today;
    }

    GetRecord() {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_cargo_genfiles>response.record;
                this.ProcessData();
                this.mode = 'EDIT';
                this.errorMessage = "";
            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }

    ProcessData() {
        if (this.record.gf_mmyy != null) {
            if (this.record.gf_mmyy.toString().indexOf("/") >= 0) {
                var sdata = this.record.gf_mmyy.toString().split('/');
                this.record.gf_month = +sdata[0];
                this.record.gf_year = +sdata[1];
            }
        }
    }

    SaveParent() {
        if (this.record.gf_month.toString().trim() != "" && this.record.gf_year.toString().trim() != "")
            this.record.gf_mmyy = this.record.gf_month.toString().trim().padStart(2, '0') + "/" + this.record.gf_year.toString().trim();
        else
            this.record.gf_mmyy = "";
        this.record.gf_category = "BANK STATEMENT";
    }


    Save() {

        this.FindTotal();

        if (!this.Allvalid())
            return;
        if (!confirm("Save")) {
            return;
        }

        this.SaveParent();
        const saveRecord = <vm_Tbl_cargo_genfiles>{};
        saveRecord.record = this.record;
        saveRecord.pkid = this.pkid;
        saveRecord.mode = this.mode;
        saveRecord.userinfo = this.gs.UserInfo;

        this.mainService.Save(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.errorMessage = response.error;
                    alert(this.errorMessage);
                }
                else {

                    if (this.mode === 'ADD')
                        this.record.gf_slno = response.slno;

                    this.mode = 'EDIT';
                    this.mainService.RefreshList(this.record);
                    this.errorMessage = 'Save Complete';
                    // alert(this.errorMessage);
                }

            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);
            });
    }


    private Allvalid(): boolean {

        var bRet = true;
        this.errorMessage = "";

        if (this.gs.isBlank(this.pkid)) {
            bRet = false;
            this.errorMessage = "Invalid ID";
            alert(this.errorMessage);
            return bRet;
        }

        if (this.gs.isBlank(this.record.gf_name)) {
            bRet = false;
            this.errorMessage = "Invalid Bank";
            alert(this.errorMessage);
            return bRet;
        }

        if (this.gs.isBlank(this.record.gf_accno)) {
            bRet = false;
            this.errorMessage = "Invalid A/c No";
            alert(this.errorMessage);
            return bRet;
        }

        if (this.gs.isZero(this.record.gf_month)) {
            bRet = false;
            this.errorMessage = "Invalid Month";
            alert(this.errorMessage);
            return bRet;
        }

        if (this.gs.isZero(this.record.gf_year)) {
            bRet = false;
            this.errorMessage = "Invalid Year";
            alert(this.errorMessage);
            return bRet;
        }





        return bRet;
    }


    Close() {
        this.location.back();
    }


    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "ACCTM") {
            this.record.gf_name = _Record.name;
            this.record.gf_accno = _Record.col5;
        }
    }




    OnChange(field: string) {
    }

    onFocusout(field: string) {
    }

    onBlur(field: string) {
    }

    onBlur2(cb: any) {
        /*
        if (field === 'group_name')
            this.record.acc_group_name = this.record.acc_group_name.toUpperCase();
        */
        if (cb.field == "op_famt") {
            this.FindTotal();
        }
        if (cb.field == "op_ex_rate") {
            this.FindTotal();
        }
    }

    FindTotal() {

        /*
        var nTot = 0;
        if (this.gs.IS_SINGLE_CURRENCY == true) {
            this.record.pay_curr_code = this.gs.base_cur_code;
            this.record.op_ex_rate = 1;
        }
        if (this.record.op_ex_rate <= 0)
            this.record.op_ex_rate = 1;

        nTot = this.record.op_famt * this.record.op_ex_rate;
        this.record.op_amt = this.gs.roundNumber(nTot, 2);
        */
    }

    Upload(attachmodal: any = null) {
        //this.tab = 'attachment';
        this.modal = this.modalservice.open(attachmodal, { centered: true });
    }

    callbackevent(event: any) {
        // this.tab = 'main';
    }

    CloseModal() {
        this.modal.close();
    }
}
