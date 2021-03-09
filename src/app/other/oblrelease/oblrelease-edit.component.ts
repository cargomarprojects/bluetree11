import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../shared/input/inputbox.component';

import { OblReleaseService } from '../services/oblrelease.service';
import { User_Menu } from '../../core/models/menum';
import { vm_tbl_OblRelease, Tbl_cargo_obl_released } from '../models/tbl_cargo_obl_released';
import { SearchTable } from '../../shared/models/searchtable';


@Component({
    selector: 'app-oblrelease-edit',
    templateUrl: './oblrelease-edit.component.html'
})
export class OblReleaseEditComponent implements OnInit {

    record: Tbl_cargo_obl_released = <Tbl_cargo_obl_released>{};

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

    showchqdt = true;

    where = " ACC_TYPE = 'BANK' ";

    oldrefno = '';

    HouseList: Tbl_cargo_obl_released[] = [];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainService: OblReleaseService,
    ) {
        this.decplace = this.gs.foreign_amt_dec;
    }

    ngOnInit() {
        const options = JSON.parse(this.route.snapshot.queryParams.parameter);


        this.menuid = options.menuid;
        this.pkid = options.pkid;
        this.mode = options.mode;


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
            this.record = <Tbl_cargo_obl_released>{};
            this.pkid = this.gs.getGuid();
            this.init();
        }
        if (this.mode == 'EDIT') {
            this.GetRecord();
        }
    }

    init() {

        this.record.obl_pkid = this.pkid;
        this.record.obl_date = this.gs.defaultValues.today;
        this.record.obl_slno = null;
        this.record.obl_refno = '';
        this.record.obl_houseno = '';
        this.record.obl_consignee_id = '';
        this.record.obl_consignee_code = '';
        this.record.obl_consignee_name = '';
        this.record.obl_handled_id = '';
        this.record.obl_handled_code = '';
        this.record.obl_handled_name = '';
        this.record.obl_remark   = '';

        this.oldrefno = this.record.obl_refno;
        
        this.HouseList = [];

        this.record.rec_created_by = this.gs.user_code;
        this.record.rec_created_date = this.gs.defaultValues.today;
    }

    GetRecord() {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_cargo_obl_released>response.record;
                this.oldrefno = this.record.obl_refno;                
                this.GetHouseDetails();                
                this.mode = 'EDIT';
                this.errorMessage = "";
            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }

    GetHouseDetails() {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData = { ...SearchData, "refno" : this.record.obl_refno ,  "comp_code": this.gs.company_code, "br_code": this.gs.branch_code };
        this.mainService.GetHouseList(SearchData)
            .subscribe(response => {
                this.HouseList = response.list;
            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);
            });
    }

    Save() {

        this.FindTotal();

        if (!this.Allvalid())
            return;

        const saveRecord = <vm_tbl_OblRelease>{};
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

                    if ( this.mode == 'ADD')
                        this.record.obl_slno = response.slno;
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
        if (this.gs.isBlank(this.record.obl_date)) {
            bRet = false;
            this.errorMessage = "Invalid Date";
            alert(this.errorMessage);
            return bRet;
        }


        if (this.gs.isBlank(this.record.obl_refno)) {
            bRet = false;
            this.errorMessage = "Invalid RefNo";
            alert(this.errorMessage);
            return bRet;
        }

        if (this.gs.isBlank(this.record.obl_houseno)) {
            bRet = false;
            this.errorMessage = "Invalid House";
            alert(this.errorMessage);
            return bRet;
        }        

        return bRet;
    }


    Close() {
        this.location.back();
    }


    LovSelected(_Record: SearchTable) {

        if (_Record.controlname == "CONSIGNEE") {
            this.record.obl_consignee_id = _Record.id;
            this.record.obl_consignee_code = _Record.code;
            this.record.obl_consignee_name = _Record.name;
        }

        if (_Record.controlname == "HANLEDBY") {
            this.record.obl_handled_id = _Record.id;
            this.record.obl_handled_code = _Record.code;
            this.record.obl_handled_name = _Record.name;
        }


    }

    onItmChange() {

        this.record.obl_consignee_id= '';
        this.record.obl_consignee_code = '';
        this.record.obl_consignee_name = '';
        this.record.obl_handled_id='';
        this.record.obl_handled_code ='';
        this.record.obl_handled_name = '';

        this.HouseList.forEach(rec => {
          if (rec.obl_houseno == this.record.obl_houseno) {
            this.record.obl_consignee_id= rec.obl_consignee_id;
            this.record.obl_consignee_code = rec.obl_consignee_code;
            this.record.obl_consignee_name = rec.obl_consignee_name;
            
            this.record.obl_handled_id= rec.obl_handled_id;
            this.record.obl_handled_code = rec.obl_handled_code;
            this.record.obl_handled_name = rec.obl_handled_name;
            
          }
        });
      }

      


    OnChange(field: string) {
    }

    onFocusout(field: string) {
    }

    onBlur(field: string) {
        if (field == 'obl_refno') {
            if (this.record.obl_refno != this.oldrefno) {
                this.oldrefno = this.record.obl_refno;
                this.GetHouseDetails();
            }
        }
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







}
