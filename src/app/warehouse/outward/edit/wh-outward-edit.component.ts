import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/services/global.service';

import { WhOutwardService } from '../../services/whoutward.service';
import { User_Menu } from '../../../core/models/menum';
import { Tbl_wh_inwardm, Tbl_wh_inwardd, Tbl_wh_container, vm_tbl_wh_inwardm } from '../../models/Tbl_wh_inwardm';
import { SearchTable } from '../../../shared/models/searchtable';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateComponent } from '../../../shared/date/date.component';
import { AutoComplete2Component } from '../../../shared/autocomplete2/autocomplete2.component';

@Component({
    selector: 'app-wh-outward-edit',
    templateUrl: './wh-outward-edit.component.html'
})
export class WhOutwardEditComponent implements OnInit {

    @ViewChild('_inm_doc_date') inm_doc_date_field: DateComponent;
    @ViewChild('_customer_lov') customer_lov_field: AutoComplete2Component;
    @ViewChild('_btn_Add_product') btn_Add_product_field: ElementRef;

    @ViewChildren('_cntr_no') cntr_no_field: QueryList<ElementRef>;
    @ViewChildren('_cntr_sealno') cntr_sealno_field: QueryList<ElementRef>;
    @ViewChildren('_ind_code_field') ind_code_field: QueryList<AutoComplete2Component>;
    @ViewChildren('_ind_product') ind_product_field: QueryList<ElementRef>;

    @ViewChildren('_ind_packages') ind_packages_field: QueryList<ElementRef>;
    @ViewChildren('_ind_weight') ind_weight_field: QueryList<ElementRef>;
    @ViewChildren('_ind_pallets') ind_pallets_field: QueryList<ElementRef>;
    @ViewChildren('_ind_cqty') ind_cqty_field: QueryList<ElementRef>;

    record: Tbl_wh_inwardm = <Tbl_wh_inwardm>{};

    detrecords: Tbl_wh_inwardd[] = [];
    cntrrecords: Tbl_wh_container[] = [];


    tab: string = 'main';
    report_title: string = '';
    report_url: string = '';
    report_searchdata: any = {};
    report_menuid: string = '';

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


    showPayReq: boolean = false;
    private pkid: string;
    private menuid: string;
    private hbl_pkid: string = '';
    private hbl_mode: string = '';
    private mode: string;
    private type: string;

    modal: any;
    // private errorMessage: string;
    private errorMessage: string[] = [];
    private closeCaption: string = 'Return';

    private title: string;
    private isAdmin: boolean;

    private cmbList = {};
    MblStatusList: any[] = [];
    BlStatusList: any[] = [];

    is_cntr_addrow: boolean = false;
    is_locked: boolean = false;
    bChanged = false;

    constructor(
        private modalconfig: NgbModalConfig,
        private modalservice: NgbModal,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        private mainService: WhOutwardService,
    ) {
        modalconfig.backdrop = 'static'; //true/false/static
        modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
    }

    ngOnInit() {

        this.gs.checkAppVersion();
        if (this.route.snapshot.queryParams.parameter == null) {
            this.pkid = this.route.snapshot.queryParams.pkid;
            this.menuid = this.route.snapshot.queryParams.menuid;
            this.mode = this.route.snapshot.queryParams.mode;
            this.type = this.route.snapshot.queryParams.type;
        }
        else {
            const options = JSON.parse(this.route.snapshot.queryParams.parameter);
            this.pkid = options.pkid;
            this.menuid = options.menuid;
            this.mode = options.mode;
            this.type = options.type;
        }
        this.closeCaption = 'Return';
        this.initPage();
        this.actionHandler();


        /*     $(document).ready(function() {
              let modalContent: any = $('.modal-content');
              modalContent.draggable({
                handle: '.modal-header'
              });
            });
         */

    }

    private initPage() {
        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.errorMessage = [];
        this.LoadCombo();
    }

    LoadCombo() {

    }

    ngAfterViewInit() {
        if (!this.gs.isBlank(this.inm_doc_date_field))
            this.inm_doc_date_field.Focus();
    }

    NewRecord() {
        this.mode = 'ADD'
        this.actionHandler();
    }

    actionHandler() {
        this.errorMessage = [];
        this.is_locked = false;
        if (this.mode == 'ADD') {
            this.record = <Tbl_wh_inwardm>{};
            this.detrecords = <Tbl_wh_inwardd[]>[];
            this.cntrrecords = <Tbl_wh_container[]>[];
            this.pkid = this.gs.getGuid();
            this.init();
        }
        if (this.mode == 'EDIT') {
            this.GetRecord();
        }
    }

    init() {

        this.record.inm_pkid = this.pkid;
        this.record.inm_type = this.type;
        this.record.inm_refno = '';
        this.record.inm_doc_date = this.gs.defaultValues.today;

        this.record.inm_arrival_date = '';
        this.record.inm_cust_id = '';
        this.record.inm_cust_code = '';
        this.record.inm_cust_name = '';
        this.record.inm_cust_add1 = '';
        this.record.inm_cust_add2 = '';
        this.record.inm_cust_add3 = '';
        this.record.inm_cust_add4 = '';
        this.record.inm_wh_id = '';
        this.record.inm_wh_code = '';
        this.record.inm_wh_name = '';
        this.record.inm_supplier_id = '';
        this.record.inm_supplier_code = '';
        this.record.inm_supplier_name = '';
        this.record.inm_supplier_add1 = '';
        this.record.inm_supplier_add2 = '';
        this.record.inm_supplier_add3 = '';
        this.record.inm_supplier_add4 = '';
        this.record.inm_transport_id = '';
        this.record.inm_transport_code = '';
        this.record.inm_transport_name = '';
        this.record.inm_transport_add1 = '';
        this.record.inm_transport_add2 = '';
        this.record.inm_transport_add3 = '';
        this.record.inm_transport_add4 = '';
        this.record.rec_created_by = this.gs.user_code;
        this.record.rec_created_date = this.gs.defaultValues.today;
        this.record.inm_prefix = this.gs.WH_OUTWARD_DOCNO_PREFIX;
        this.record.inm_startingno = this.gs.WH_OUTWARD_DOCNO_STARTING_NO;
    }

    GetRecord() {

        this.errorMessage = [];
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;

        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_wh_inwardm>response.record;
                this.detrecords = (response.detrecords == undefined || response.detrecords == null) ? <Tbl_wh_inwardd[]>[] : <Tbl_wh_inwardd[]>response.detrecords;
                this.cntrrecords = (response.cntrrecords == undefined || response.cntrrecords == null) ? <Tbl_wh_container[]>[] : <Tbl_wh_container[]>response.cntrrecords;
                this.mode = 'EDIT';

                if (!this.gs.isBlank(this.inm_doc_date_field))
                    this.inm_doc_date_field.Focus();
            }, error => {
                this.errorMessage.push(this.gs.getError(error));
            });
    }

    Save() {
        if (!this.Allvalid())
            return;
        if (!confirm("Save")) {
            return;
        }
        this.SaveContainer();
        this.SaveDetails();
        this.FindTotTeus();
        this.record.inm_type = this.type;
        const saveRecord = <vm_tbl_wh_inwardm>{};
        saveRecord.record = this.record;
        saveRecord.detrecords = this.detrecords;
        saveRecord.cntrrecords = this.cntrrecords;
        saveRecord.mode = this.mode;
        saveRecord.userinfo = this.gs.UserInfo;

        this.mainService.Save(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.errorMessage.push(response.error);
                    alert(this.errorMessage);
                }
                else {
                    if (this.mode == "ADD" && response.code != '')
                        this.record.inm_doc_no = response.code;
                    this.mode = 'EDIT';

                    let parameter = {
                        appid: this.gs.appid,
                        menuid: this.menuid,
                        pkid: this.pkid,
                        type: this.type,
                        origin: 'wh-outward-page',
                        mode: 'EDIT'
                    };
                    this.location.replaceState('warehouse/WhOutwardEditPage', this.gs.getUrlParameter(parameter));

                    this.mainService.RefreshList(this.record);
                    // this.errorMessage.push('Save Complete');
                    alert('Save Complete');
                }
            }, error => {
                this.errorMessage.push(this.gs.getError(error));
                alert(this.errorMessage);
            });
    }

    private FindTotTeus() {
        // var Tot_Teu = 0, Teu = 0, Tot_Cbm = 0;
        // var Tot_20 = 0, Tot_40 = 0, Tot_40HQ = 0, Tot_45 = 0;
        // var Cntr_Tot = 0;
        // let sCntrType: string = "";
        // this.records.forEach(Rec => {
        //     Cntr_Tot++;
        //     Teu = 0;
        //     if (Rec.cntr_type.indexOf("20") >= 0)
        //         Teu = 1;
        //     else if (Rec.cntr_type.indexOf("40") >= 0) {
        //         if (Rec.cntr_type.indexOf("HC") >= 0)
        //             Teu = 2.25;
        //         else
        //             Teu = 2;
        //     }
        //     else if (Rec.cntr_type.indexOf("45") >= 0)
        //         Teu = 2.50;

        //     if (this.record.mbl_cntr_type.toString() == "LCL")
        //         Teu = 0;
        //     Tot_Teu += Teu;
        //     Tot_Cbm += Rec.cntr_cbm;
        //     Rec.cntr_teu = Teu;
        //     if (Teu > 0) {
        //         if (Rec.cntr_type.indexOf("20") >= 0)
        //             Tot_20 += 1;
        //         else if (Rec.cntr_type.indexOf("40HC") >= 0 || Rec.cntr_type.indexOf("40HQ") >= 0)
        //             Tot_40HQ += 1;
        //         else if (Rec.cntr_type.indexOf("40") >= 0)
        //             Tot_40 += 1;
        //         else if (Rec.cntr_type.indexOf("45") >= 0)
        //             Tot_45 += 1;
        //     }

        //     if (sCntrType.indexOf(Rec.cntr_type) < 0) {
        //         if (sCntrType != "")
        //             sCntrType += ",";
        //         sCntrType += Rec.cntr_type;
        //     }

        // })
        // this.record.mbl_teu = Tot_Teu;
        // this.record.mbl_20 = Tot_20;
        // this.record.mbl_40 = Tot_40;
        // this.record.mbl_40HQ = Tot_40HQ;
        // this.record.mbl_45 = Tot_45;
        // this.record.mbl_cntr_cbm = Tot_Cbm;
        // this.record.mbl_container_tot = Cntr_Tot;
        // if (sCntrType.length > 100)
        //     sCntrType = sCntrType.substring(0, 100);

        // this.record.mbl_cntr_desc = sCntrType;
    }
    private SaveContainer() {
        let iCtr: number = 0;
        this.cntrrecords.forEach(Rec => {
            iCtr++;
            Rec.cntr_parent_id = this.pkid.toString();
            Rec.cntr_order = iCtr;
        })
    }
    private SaveDetails() {
        let iCtr: number = 0;
        this.detrecords.forEach(Rec => {
            iCtr++;
            Rec.ind_parent_id = this.pkid.toString();
            Rec.ind_slno = iCtr;
        })
    }

    private Allvalid(): boolean {

        var bRet = true;
        this.errorMessage = [];

        if (this.gs.isBlank(this.record.inm_refno)) {
            bRet = false;
            this.errorMessage.push("Ref# cannot be blank");;
        }
        if (this.gs.isBlank(this.record.inm_doc_date)) {
            bRet = false;
            this.errorMessage.push("Doc Date cannot be blank");;
        }
        if (this.gs.isBlank(this.record.inm_arrival_date)) {
            bRet = false;
            this.errorMessage.push("Arrival Date cannot be blank");;
        }

        if (this.gs.isBlank(this.record.inm_wh_id)) {
            bRet = false;
            this.errorMessage.push("Warehouse cannot be blank");
        }

        if (this.gs.isBlank(this.record.inm_cust_id)) {
            bRet = false;
            this.errorMessage.push("Customer cannot be blank");
        }
        if (this.gs.isBlank(this.record.inm_supplier_id)) {
            bRet = false;
            this.errorMessage.push("Supplier cannot be blank");
        }

        if (this.gs.isBlank(this.record.inm_transport_id)) {
            bRet = false;
            this.errorMessage.push("Transporter cannot be blank");
        }


        if (!this.gs.isBlank(this.cntrrecords)) {
            this.cntrrecords.forEach(Rec => {
                if (Rec.cntr_no.length != 11) {
                    bRet = false;
                    this.errorMessage.push("Container( " + Rec.cntr_no + " ) Invalid");
                }
                if (Rec.cntr_type.length <= 0) {
                    bRet = false;
                    this.errorMessage.push("Container( " + Rec.cntr_no + " ) type has to be selected");
                }

                // if (Rec.cntr_packages <= 0) {
                //     bRet = false;
                //     this.errorMessage.push("Container( " + Rec.cntr_no + " ) Packages cannot be zero");
                // }

            })
        }

        let iCtr: number = 0;
        if (!this.gs.isBlank(this.detrecords)) {
            this.detrecords.forEach(Rec => {
                iCtr++;
                if (this.gs.isBlank(Rec.ind_code_id)) {
                    bRet = false;
                    this.errorMessage.push("Code cannot be blank, Row" + iCtr.toString());
                }
                if (this.gs.isBlank(Rec.ind_product)) {
                    bRet = false;
                    this.errorMessage.push("Product cannot be blank, Row" + iCtr.toString());
                }
                if (this.gs.isBlank(Rec.ind_req_cqty)) {
                    bRet = false;
                    this.errorMessage.push("Qty cannot be blank, Row" + iCtr.toString());
                }

                if (!this.isValidCqty(Rec.ind_req_cqty)) {
                    bRet = false;
                    this.errorMessage.push("Invalid Qty, Row" + iCtr.toString());
                }
                else
                    if (!this.isValidUnitFactor(Rec.ind_req_cqty, Rec.ind_unit_factor)) {
                        bRet = false;
                        this.errorMessage.push("Loose quantity should be less than " + Rec.ind_unit_factor+", Row" + iCtr.toString());
                    }

                // if (this.gs.isBlank(Rec.ind_qty_uom_id)) {
                //     bRet = false;
                //     this.errorMessage.push("Qty Unit cannot be blank, Row" + iCtr.toString());
                // }

            })
        }



        if (!bRet) {
            alert(this.errorMessage);
            this.errorMessage = [];
        }

        return bRet;
    }


    Close() {
        // if (window.history.length == this.gs.HISTORY_MIN_LENGTH) {
        //   let prm = {
        //     appid: this.gs.appid,
        //     id: this.gs.MENU_SI_MASTER,
        //     menuid: this.gs.MENU_SI_MASTER,
        //     menu_param: '',
        //     origin: 'seaimp-master-page',
        //     rnd: this.gs.getRandomInt()
        //   };
        //   this.gs.Naviagete2('Silver.SeaImport/SeaImpMasterPage', prm);

        // } else
        //   this.location.back();

        let prm = {
            appid: this.gs.appid,
            id: this.gs.MENU_WH_OUTWARD,
            menuid: this.gs.MENU_WH_OUTWARD,
            menu_param: this.mainService.param_type,
            origin: 'wh-outward-page',
            rnd: this.gs.getRandomInt()
        };
        this.gs.AutoReloadReturn(prm);
    }


    AddCntrRow() {
        var rec = <Tbl_wh_container>{};
        rec.cntr_pkid = this.gs.getGuid();
        rec.cntr_parent_id = this.pkid.toString();
        rec.cntr_no = "";
        rec.cntr_type = "";
        rec.cntr_sealno = '';
        rec.cntr_packages_uom = '';
        rec.cntr_packages = 0;
        rec.cntr_weight = 0;
        rec.cntr_cbm = 0;
        rec.cntr_weight_uom = '';
        rec.cntr_order = 1;
        rec.cntr_pallets = 0;
        this.cntrrecords.push(rec);

        this.cntr_no_field.changes
            .subscribe((queryChanges) => {
                this.cntr_no_field.last.nativeElement.focus();
            });
    }

    AddDetRow() {

        var rec = <Tbl_wh_inwardd>{};
        rec.ind_pkid = this.gs.getGuid();
        rec.ind_parent_id = this.pkid;
        rec.ind_code_id = '';
        rec.ind_code = '';
        rec.ind_product = '';
        rec.ind_desc = '';
        rec.ind_refno = '';
        rec.ind_cqty = '0';
        rec.ind_req_cqty = '0';
        rec.ind_qty_uom_id = '';
        rec.ind_qty_uom_code = '';
        rec.ind_qty_uom_name = '';
        rec.ind_unit_factor = 0;
        rec.ind_packages = 0;
        rec.ind_packages_uom_id = '';
        rec.ind_packages_uom_code = '';
        rec.ind_packages_uom_name = '';
        rec.ind_weight = 0;
        rec.ind_weight_uom_id = '';
        rec.ind_weight_uom_code = '';
        rec.ind_weight_uom_name = '';
        rec.ind_pallets = 0;
        rec.ind_volume = 0;
        rec.ind_volume_uom_id = '';
        rec.ind_volume_uom_code = '';
        rec.ind_volume_uom_name = '';
        rec.ind_slno = this.findDetNextCtr();
        this.detrecords.push(rec);

        this.ind_code_field.changes
            .subscribe((queryChanges) => {
                this.ind_code_field.last.Focus();
            });
    }

    findDetNextCtr() {
        let max: number = 0;
        this.detrecords.forEach(Rec => {
            max = Rec.ind_slno > max ? Rec.ind_slno : max;
        })
        return max + 1;
    }

    LovSelected(_Record: SearchTable, idx: number = 0) {

        if (_Record.controlname == "CUSTOMER") {
            this.record.inm_cust_id = _Record.id;

            this.record.inm_cust_name = _Record.name;
            if (_Record.col8 != "")
                this.record.inm_cust_name = _Record.col8;

            this.record.inm_cust_add1 = _Record.col1;
            this.record.inm_cust_add2 = _Record.col2;
            this.record.inm_cust_add3 = _Record.col3;
            this.record.inm_cust_add4 = this.gs.GetTelFax(_Record.col6.toString(), _Record.col7.toString());
            // this.mbl_cargo_locname_field.nativeElement.focus();
        }

        if (_Record.controlname == "SUPPLIER") {
            this.record.inm_supplier_id = _Record.id;

            this.record.inm_supplier_name = _Record.name;
            if (_Record.col8 != "")
                this.record.inm_supplier_name = _Record.col8;

            this.record.inm_supplier_add1 = _Record.col1;
            this.record.inm_supplier_add2 = _Record.col2;
            this.record.inm_supplier_add3 = _Record.col3;
            this.record.inm_supplier_add4 = this.gs.GetTelFax(_Record.col6.toString(), _Record.col7.toString());
            // this.mbl_devan_locname_field.nativeElement.focus();
        }

        if (_Record.controlname == "TRANSPORTER") {
            this.record.inm_transport_id = _Record.id;

            this.record.inm_transport_name = _Record.name;
            if (_Record.col8 != "")
                this.record.inm_transport_name = _Record.col8;

            this.record.inm_transport_add1 = _Record.col1;
            this.record.inm_transport_add2 = _Record.col2;
            this.record.inm_transport_add3 = _Record.col3;
            this.record.inm_transport_add4 = this.gs.GetTelFax(_Record.col6.toString(), _Record.col7.toString());
            // this.mbl_devan_locname_field.nativeElement.focus();
        }
        if (_Record.controlname == "WAREHOUSE") {
            this.record.inm_wh_id = _Record.id;
            this.record.inm_wh_code = _Record.code;
            this.record.inm_wh_name = _Record.name;
        }

        //Container
        if (_Record.controlname == "CONTAINER TYPE") {
            this.cntrrecords.forEach(rec => {
                if (rec.cntr_pkid == _Record.uid) {
                    rec.cntr_type = _Record.code;
                    if (idx < this.cntr_sealno_field.toArray().length)
                        this.cntr_sealno_field.toArray()[idx].nativeElement.focus();
                }
            });
        }

        //Details
        if (_Record.controlname == "PRODUCT") {
            this.detrecords.forEach(rec => {
                if (rec.ind_pkid == _Record.uid) {
                    rec.ind_code_id = _Record.id;
                    rec.ind_code = _Record.code;
                    rec.ind_product = _Record.name;
                    rec.ind_unit_factor = +_Record.col4;
                    rec.ind_qty_uom_code = _Record.col1;
                    rec.ind_qty_uom_id = _Record.col5;
                    if (idx < this.ind_product_field.toArray().length)
                        this.ind_product_field.toArray()[idx].nativeElement.focus();
                }
            });
        }

        if (_Record.controlname == "QTY-UOM") {
            this.detrecords.forEach(rec => {
                if (rec.ind_pkid == _Record.uid) {
                    rec.ind_qty_uom_id = _Record.id;
                    rec.ind_qty_uom_code = _Record.code;
                    rec.ind_qty_uom_name = _Record.name;
                    rec.ind_unit_factor = +_Record.col3;
                    if (!this.isValidUnitFactor(rec.ind_cqty, rec.ind_unit_factor)) {
                        alert('Loose quantity should be less than ' + rec.ind_unit_factor);
                    }
                    if (idx < this.ind_packages_field.toArray().length)
                        this.ind_packages_field.toArray()[idx].nativeElement.focus();
                }
            });
        }

        if (_Record.controlname == "PACKAGES-UOM") {
            this.detrecords.forEach(rec => {
                if (rec.ind_pkid == _Record.uid) {
                    rec.ind_packages_uom_id = _Record.id;
                    rec.ind_packages_uom_code = _Record.code;
                    rec.ind_packages_uom_name = _Record.name;
                    if (idx < this.ind_weight_field.toArray().length)
                        this.ind_weight_field.toArray()[idx].nativeElement.focus();
                }
            });
        }
        if (_Record.controlname == "WEIGHT-UOM") {
            this.detrecords.forEach(rec => {
                if (rec.ind_pkid == _Record.uid) {
                    rec.ind_weight_uom_id = _Record.id;
                    rec.ind_weight_uom_code = _Record.code;
                    rec.ind_weight_uom_name = _Record.name;
                    if (idx < this.ind_pallets_field.toArray().length)
                        this.ind_pallets_field.toArray()[idx].nativeElement.focus();
                }
            });
        }
        if (_Record.controlname == "VOLUME-UOM") {
            this.detrecords.forEach(rec => {
                if (rec.ind_pkid == _Record.uid) {
                    rec.ind_volume_uom_id = _Record.id;
                    rec.ind_volume_uom_code = _Record.code;
                    rec.ind_volume_uom_name = _Record.name;
                    if (!this.gs.isBlank(this.btn_Add_product_field))
                        this.btn_Add_product_field.nativeElement.focus();
                }
            });
        }
    }

    onFocusout(field: string, rec: Tbl_wh_inwardd = null, idx: number = 0) {

        switch (field) {
            case 'ind_cqty': {

                // if (!this.isValidUnitFactor(rec.ind_cqty, rec.ind_unit_factor)) {
                //     alert('ind_unit_factor ' + rec.ind_cqty);
                //     if (idx < this.ind_cqty_field.toArray().length)
                //         this.ind_cqty_field.toArray()[idx].nativeElement.focus();
                // }
                break;
            }
            case 'mbl_liner_bookingno': {

                // this.IsBLDupliation('BOOKING', this.record.mbl_liner_bookingno);
                // break;
            }
            case 'mbl_pol_etd': {
                // if (this.bChanged) {
                //     this.bChanged = false;
                //     if (this.isDate1GreaterDate2(this.record.mbl_ref_date, this.record.mbl_pol_etd)) {
                //         alert('ETD is less than Reference Date');
                //     }
                //     break;
                // }
            }
            case 'mbl_pod_eta': {
                // if (this.bChanged) {
                //     this.bChanged = false;
                //     if (this.isDate1GreaterDate2(this.record.mbl_ref_date, this.record.mbl_pod_eta)) {
                //         alert('Pod ETA is less than Reference Date');
                //     }
                //     break;
                // }
            }
            case 'mbl_pofd_eta': {
                // if (this.bChanged) {
                //     this.bChanged = false;
                //     if (this.isDate1GreaterDate2(this.record.mbl_ref_date, this.record.mbl_pofd_eta)) {
                //         alert('Pofd ETA is less than Reference Date');
                //     }
                //     break;
                // }
            }
        }
    }

    isDate1GreaterDate2(_date1: string, _date2: string) {
        if (!this.gs.isBlank(_date1) && !this.gs.isBlank(_date2)) {
            var date1 = new Date(_date1);
            // date1.setDate(date1.getDate() - 30);
            var date2 = new Date(_date2);
            if (date1 > date2) {
                return true;
            }
        }
        return false;
    }

    onChange(field: string) {
        // if (field == 'mbl_pol_etd') {
        //     this.bChanged = true;
        // }
        // if (field == 'mbl_pod_eta') {
        //     this.bChanged = true;
        // }
        // if (field == 'mbl_pofd_eta') {
        //     this.bChanged = true;
        // }

    }


    onBlur(field: string, rec: Tbl_wh_inwardd = null, rec2: Tbl_wh_container = null, idx: number = 0) {
        switch (field) {

            case 'cntr_no': {
                rec2.cntr_no = rec2.cntr_no.toUpperCase().trim();
                break;
            }
            case 'cntr_type': {
                rec2.cntr_type = rec2.cntr_type.toUpperCase().trim();
                break;
            }
            case 'cntr_sealno': {
                rec2.cntr_sealno = rec2.cntr_sealno.toUpperCase().trim();
                break;
            }
            case 'cntr_packages': {
                rec2.cntr_packages = this.gs.roundNumber(rec2.cntr_packages, 0);
                break;
            }
            case 'cntr_packages_uom': {
                rec2.cntr_packages_uom = rec2.cntr_packages_uom.toUpperCase().trim();
                break;
            }


            case 'ind_product': {
                rec.ind_product = rec.ind_product.toUpperCase().trim();
                break;
            }
            case 'ind_desc': {
                rec.ind_desc = rec.ind_desc.toUpperCase().trim();
                break;
            }
            case 'ind_refno': {
                rec.ind_refno = rec.ind_refno.toUpperCase().trim();
                break;
            }
            case 'ind_req_cqty': {
                if (!this.isValidCqty(rec.ind_req_cqty))
                    alert('Invalid Qty ' + rec.ind_req_cqty);
                else
                    if (!this.isValidUnitFactor(rec.ind_req_cqty, rec.ind_unit_factor)) {
                        alert('Loose quantity should be less than ' + rec.ind_unit_factor);
                    }
                break;
            }
            // case 'ind_qty_uom': {
            //     rec.ind_qty_uom = rec.ind_qty_uom.toUpperCase().trim();
            //     break;
            // }
            case 'ind_packages': {
                rec.ind_packages = this.gs.roundNumber(rec.ind_packages, 0);
                // this.findRowTotal(field, rec);
                break;
            }
            // case 'ind_packages_uom': {
            //     rec.ind_packages_uom = rec.ind_packages_uom.toUpperCase().trim();
            //     break;
            // }
            case 'ind_weight': {
                rec.ind_weight = this.gs.roundNumber(rec.ind_weight, 3);
                // this.findRowTotal(field, rec);
                break;
            }
            // case 'ind_weight_uom': {
            //     rec.ind_weight_uom = rec.ind_weight_uom.toUpperCase().trim();
            //     break;
            // }
            case 'ind_pallets': {
                rec.ind_pallets = this.gs.roundNumber(rec.ind_pallets, 3);
                // this.findRowTotal(field, rec);
                break;
            }
            case 'ind_volume': {
                rec.ind_volume = this.gs.roundNumber(rec.ind_volume, 3);
                // this.findRowTotal(field, rec);
                break;
            }
            // case 'ind_volume_uom': {
            //     rec.ind_volume_uom = rec.ind_volume_uom.toUpperCase().trim();
            //     break;
            // }
        }
    }




    BtnNavigation2(action: string, _type: string, attachmodal: any = null) {
        // if (action == "ARAP") {
        //     if (_type == "L")
        //         return '/Silver.USAccounts.Trans/InvoicePage';
        //     if (_type == 'P')
        //         return {
        //             appid: this.gs.appid,
        //             menuid: this.gs.MENU_SI_MASTER_ARAP,
        //             mbl_pkid: this.pkid,
        //             mbl_refno: this.record.mbl_refno,
        //             mbl_type: 'OI',
        //             origin: 'seaimp-master-page',
        //         };
        // } else if (action == "DEVANING") {
        //     if (_type == "L")
        //         return '/Silver.SeaImport/DevanInstructionPage';
        //     if (_type == 'P')
        //         return {
        //             appid: this.gs.appid,
        //             menuid: this.gs.MENU_SI_MASTER_DEVANNING_INSTRUCTION,
        //             pkid: this.pkid,
        //             mbl_refno: this.record.mbl_refno,
        //             origin: 'seaimp-master-page',
        //             is_locked: this.is_locked
        //         };
        // } 
    }

    BtnNavigation(action: string, attachmodal: any = null) {

        switch (action) {

            // case 'ATTACHMENT': {
            //     let TypeList: any[] = [];
            //     TypeList = [{ "code": "EMAIL", "name": "E-MAIL" }, { "code": "HOUSEBL", "name": "HOUSE B/L" }, { "code": "MASTER", "name": "MASTER" }, { "code": "PAYMENT SETTLEMENT", "name": "OTHERS" }];
            //     this.attach_title = 'Documents';
            //     this.attach_parentid = this.pkid;
            //     this.attach_subid = '';
            //     this.attach_type = 'PAYMENT SETTLEMENT';
            //     this.attach_typelist = TypeList;
            //     this.attach_tablename = 'cargo_masterm';
            //     this.attach_tablepkcolumn = 'mbl_pkid';
            //     this.attach_refno = this.record.inm_refno;
            //     this.attach_customername = '';
            //     this.attach_updatecolumn = 'REC_FILES_ATTACHED';
            //     this.attach_viewonlysource = '';
            //     this.attach_viewonlyid = '';
            //     this.attach_filespath = '';
            //     this.attach_filespath2 = '';
            //     this.modal = this.modalservice.open(attachmodal, { centered: true });
            //     break;
            // }
        }
    }
    callbackevent(event: any) {
        this.tab = 'main';
    }


    RemoveCntrRow(_rec: Tbl_wh_container) {
        if (!confirm("Delete Y/N")) {
            return;
        }
        this.cntrrecords.splice(this.cntrrecords.findIndex(rec => rec.cntr_pkid == _rec.cntr_pkid), 1);
    }

    RemoveDetRow(_rec: Tbl_wh_inwardd) {
        if (!confirm("Delete Y/N")) {
            return;
        }
        this.detrecords.splice(this.detrecords.findIndex(rec => rec.ind_pkid == _rec.ind_pkid), 1);
    }

    CloseModal() {
        this.modal.close();
    }

    getLink(_mode: string) {
        if (_mode == "LIST")
            return "/warehouse/WhOutwardPage";
        else
            return "/warehouse/WhOutwardEditPage";
    }

    getParam(_mode: string = "") {

        if (_mode == "LIST") {
            return {
                appid: this.gs.appid,
                id: this.gs.MENU_WH_OUTWARD,
                menuid: this.gs.MENU_WH_OUTWARD,
                menu_param: this.mainService.param_type,
                origin: 'wh-outward-page',
                rnd: this.gs.getRandomInt()
            };
        } else {
            return {
                appid: this.gs.appid,
                menuid: this.menuid,
                pkid: '',
                type: this.mainService.param_type,
                origin: 'wh-outward-page',
                mode: 'ADD',
                rnd: this.gs.getRandomInt()
            };
        }
    }

    getRouteDet(_format: string, _type: string) {
        if (_format == "L") {
            // if (_type == "DEVANING")
            //     return "/Silver.SeaImport/DevanInstructionPage";
            // else
            //     return null;
        } else if (_format == "P") {
            // if (_type == "DEVANING") {
            //     return {
            //         appid: this.gs.appid,
            //         menuid: this.gs.MENU_SI_MASTER_DEVANNING_INSTRUCTION,
            //         pkid: this.pkid,
            //         mbl_refno: this.record.inm_refno,
            //         origin: 'seaimp-master-page',
            //         is_locked: this.is_locked
            //     };
            // } else
            //     return null;
        } else
            return null;
    }


    openWebSite(_url: string) {
        if (this.gs.isBlank(_url))
            return;
        window.open(_url, "_blank");
    }

    isValidCqty(_str: string) {
        let bOk = false;
        let str2: string = "0123456789.";
        for (var i = 0; i < _str.length; i++) {
            if (str2.includes(_str[i])) {
                bOk = true;
            } else {
                bOk = false;
                break;
            }
        }
        if (bOk) {
            let _num: number = +_str;
            if (_num <= 0)
                bOk = false;
        }
        return bOk;
    }

    isValidUnitFactor(_cQty: string, _factor: number) {
        let bOk = true;

        if (_cQty.includes(".")) {
            var nStr = _cQty.split('.');
            if (nStr.length > 2)
                bOk = false;
            else {
                if (this.gs.isBlank(nStr[1]))
                    bOk = false;
                else {
                    let _dNum: number = +nStr[1];
                    if (_dNum > (_factor - 1))
                        bOk = false;
                }
            }
        }

        return bOk;
    }

}


