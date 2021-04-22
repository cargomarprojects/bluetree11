import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../core/services/global.service';
import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../shared/input/inputbox.component';
import { FormatPageService } from '../../master/services/formatpage.service';
import { vm_Tbl_cargo_hblformat, Tbl_cargo_hblformat } from '../../master/models/Tbl_cargo_hblformat';
import { SearchTable } from '../../shared/models/searchtable';
import { TBL_MAST_PARAM } from '../../master/models/Tbl_Mast_Param';

@Component({
    selector: 'app-formatpage',
    templateUrl: './formatpage.component.html'
})
export class FormatPageComponent implements OnInit {

    record: Tbl_cargo_hblformat = <Tbl_cargo_hblformat>{};
    records: Tbl_cargo_hblformat[] = [];
    tab: string = 'main';

    // @ViewChild('customer') customer_field: AutoComplete2Component;

    attach_title: string = '';
    attach_parentid: string = '';
    attach_subid: string = '';
    attach_type: string = '';
    attach_typelist: any = {};
    attach_tablename: string = '';
    attach_tablepkcolumn: string = '';
    attach_refno: string = '';
    attach_customername: string = '';
    attach_updatecolumn: string = '';
    attach_viewonlysource: string = '';
    attach_viewonlyid: string = '';
    attach_filespath: string = '';
    attach_filespath2: string = '';

    customer_id: string;
    customer_name: string;
    pkid: string;
    menuid: string;
    mode: string;
    errorMessage: string;
    Foregroundcolor: string;
    modal: any;

    formatList: TBL_MAST_PARAM[];
    title: string;
    isAdmin: boolean;
    param_type: string;
    format_id: string;

    constructor(
        private modalconfig: NgbModalConfig,
        private modalservice: NgbModal,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        private mainService: FormatPageService,
    ) {
        modalconfig.backdrop = 'static'; //true/false/static
        modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
    }

    ngOnInit() {
        if (this.route.snapshot.queryParams.parameter == null) {
            this.menuid = this.route.snapshot.queryParams.menuid;
            this.param_type = this.route.snapshot.queryParams.menu_param;
        } else {
            const options = JSON.parse(this.route.snapshot.queryParams.parameter);
            this.menuid = options.menuid;
            this.param_type = options.menu_param;
        }
        this.initPage();
        this.actionHandler();
    }

    private initPage() {
        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.errorMessage = '';
        this.LoadCombo();
    }

    LoadCombo() {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.param_type = this.param_type;
        this.mainService.GetFormats(SearchData)
            .subscribe(response => {
                this.formatList = <TBL_MAST_PARAM[]>response.list;

                if (response.list.length > 0)
                    this.format_id = response.list[0].param_pkid;
            }, error => {
                this.errorMessage = this.gs.getError(error);
            });

    }

    NewRecord() {
        this.mode = 'ADD'
        this.actionHandler();
    }

    actionHandler() {
        // this.errorMessage = '';
        // if (this.mode == 'ADD') {
        //     // this.custrecord = <Tbl_Mark_Contacts>{};
        //     // this.record = <Tbl_Cargo_Journals_Master>{};
        //     // this.custdetrecords = <Tbl_Mast_Contacts[]>[];
        //     this.pkid = this.gs.getGuid();
        //     this.init();
        // }
        // if (this.mode == 'EDIT') {
        //     this.LoadCustomerRecord();
        // }
    }

    init() {
        this.customer_id = '';
        this.customer_name = '';
        // this.record.cjm_pkid = this.pkid;
        // this.record.cjm_customer_id = '';
        // this.record.cjm_user_id = this.gs.user_pkid;
        // this.record.rec_files_attached = 'N';;
        // this.record.rec_created_by = this.gs.user_code;
        // this.record.rec_created_date = this.gs.defaultValues.today;
    }

    List() {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.format_id;
        this.mainService.List(SearchData)
            .subscribe(response => {
                this.records = <Tbl_cargo_hblformat[]>response.list;
            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }


    Save() {

        if (!this.Allvalid())
            return;
        this.SaveParent();
        const saveRecord = <vm_Tbl_cargo_hblformat>{};
        saveRecord.records = this.records;
        saveRecord.userinfo = this.gs.UserInfo;

        this.mainService.Save(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.errorMessage = response.error;
                    alert(this.errorMessage);
                }
                else {
                    this.mode = 'EDIT';
                    this.errorMessage = 'Save Complete';
                    // alert(this.errorMessage);
                }

            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);
            });
    }

    private SaveParent() {
        // this.record.cjm_pkid = this.pkid.toString();
        // this.record.cjm_customer_id = this.customer_id;
        // this.record.cjm_user_id = this.gs.user_pkid;
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

        if (this.gs.isBlank(this.customer_id)) {
            bRet = false;
            this.errorMessage = "Invalid Customer";
            alert(this.errorMessage);
            // this.customer_field.Focus();
            return bRet;
        }

        return bRet;
    }


    Close() {
        this.location.back();
    }

    LovSelected(_Record: SearchTable) {
        let bchange: boolean = false;


    }

    OnChange(field: string) {
    }
    onFocusout(field: string) {
    }

    onBlur(field: string) {
    }


    BtnNavigation(action: string, attachmodal: any = null) {
        switch (action) {
            // case 'ATTACHMENT': {
            //     this.attach_title = 'Documents';
            //     this.attach_parentid = this.pkid;
            //     this.attach_subid = '';
            //     this.attach_type = 'MARKETING';
            //     this.attach_typelist = [];
            //     this.attach_tablename = 'cargo_journals_master';
            //     this.attach_tablepkcolumn = 'cjm_pkid';
            //     this.attach_refno = '';
            //     this.attach_customername = '';
            //     this.attach_updatecolumn = 'REC_FILES_ATTACHED';
            //     this.attach_viewonlysource = '';
            //     this.attach_viewonlyid = '';
            //     this.attach_filespath = '';
            //     this.attach_filespath2 = '';
            //     // this.tab = 'attachment';
            //     this.modal = this.modalservice.open(attachmodal, { centered: true });
            //     break;
            // }
            // case 'MEMO': {
            //     let prm = {
            //         menuid: this.menuid,
            //         pkid: this.pkid,
            //         source: 'CONTACT-MEMO',
            //         title: 'Memo',
            //         origin: 'sales-journal-page'
            //     };
            //     this.gs.Naviagete('Silver.BusinessModule/XmlRemarksPage', JSON.stringify(prm));
            //     break;
            // }

        }
    }
    callbackevent(event: any) {
        this.tab = 'main';
    }
    CloseModal() {
        this.modal.close();
    }
    changepos(pos: string, rec: Tbl_cargo_hblformat) {
        if (pos == 'left') {
            rec.blf_col_x = rec.blf_col_x - 8;
        }
        if (pos == 'right') {
            rec.blf_col_x = rec.blf_col_x + 8;
        }
        if (pos == 'up') {
            rec.blf_col_y = rec.blf_col_y - 15;
        }
        if (pos == 'down') {
            rec.blf_col_y = rec.blf_col_y + 15;
        }
    }

}
