import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { WhStockService } from '../services/whstock.service';

import { Tbl_cargo_whstock, vm_tbl_cargo_whstock } from '../models/tbl_cargo_whstock';
import { SearchTable } from '../../shared/models/searchtable';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateComponent } from '../../shared/date/date.component';
import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';

@Component({
    selector: 'app-whstock',
    templateUrl: './whstock.component.html'
})
export class WhStockComponent implements OnInit {

    // @ViewChild('_inm_doc_date') inm_doc_date_field: DateComponent;
    // @ViewChild('_customer_lov') customer_lov_field: AutoComplete2Component;
    @ViewChild('_btn_Add_product') btn_Add_product_field: ElementRef;

    // @ViewChildren('_cntr_no') cntr_no_field: QueryList<ElementRef>;
    // @ViewChildren('_cntr_sealno') cntr_sealno_field: QueryList<ElementRef>;
    @ViewChildren('_ind_code_field') ind_code_field: QueryList<AutoComplete2Component>;
    @ViewChildren('_ind_product') ind_product_field: QueryList<ElementRef>;

    @ViewChildren('_ind_packages') ind_packages_field: QueryList<ElementRef>;
    @ViewChildren('_ind_weight') ind_weight_field: QueryList<ElementRef>;
    @ViewChildren('_ind_pallets') ind_pallets_field: QueryList<ElementRef>;
    @ViewChildren('_ind_cqty') ind_cqty_field: QueryList<ElementRef>;
    @ViewChildren('_ind_volume') ind_volume_field: QueryList<ElementRef>;

    detrecords: Tbl_cargo_whstock[] = [];
    tab: string = 'main';

    public pkid: string;
    menuid: string;
    private hbl_pkid: string = '';
    private hbl_mode: string = '';
    mode: string;
    private type: string;
    public inm_cust_id: string = '';
    public inm_cust_code: string = '';
    public inm_cust_name: string = '';
    inm_wh_id: string = '';
    inm_wh_code: string = '';
    inm_wh_name: string = '';
    inm_arrival_date: string = '';

    modal: any;
    // private errorMessage: string;
    private errorMessage: string[] = [];
    private closeCaption: string = 'Return';

    private title: string;
    private isAdmin: boolean;

    private cmbList = {};



    is_locked: boolean = false;
    bChanged = false;

    constructor(
        private modalconfig: NgbModalConfig,
        private modalservice: NgbModal,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        private mainService: WhStockService,
    ) {
        modalconfig.backdrop = 'static'; //true/false/static
        modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
    }

    ngOnInit() {

        this.gs.checkAppVersion();
        if (this.route.snapshot.queryParams.parameter == null) {
            this.pkid = this.route.snapshot.queryParams.pkid;
            this.menuid = this.route.snapshot.queryParams.menuid;
            this.type = this.route.snapshot.queryParams.type;
            this.inm_cust_id = this.route.snapshot.queryParams.cust_id;
            this.inm_cust_code = this.route.snapshot.queryParams.cust_code;
            this.inm_cust_name = this.route.snapshot.queryParams.cust_name;
        }
        else {
            const options = JSON.parse(this.route.snapshot.queryParams.parameter);
            this.pkid = options.pkid;
            this.menuid = options.menuid;
            this.type = options.type;
            this.inm_cust_id = options.cust_id;
            this.inm_cust_code = options.cust_code;
            this.inm_cust_name = options.cust_name;
        }
        this.closeCaption = 'Return';
        this.initPage();



        /*     $(document).ready(function() {
              let modalContent: any = $('.modal-content');
              modalContent.draggable({
                handle: '.modal-header'
              });
            });
         */

    }

    private initPage() {
        this.inm_arrival_date = this.gs.defaultValues.today;
        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.errorMessage = [];
        this.LoadCombo();
        this.GetRecord();
    }

    LoadCombo() {

    }

    ngAfterViewInit() {

    }


    GetRecord() {
        this.errorMessage = [];
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.is_locked = response.islocked;
                this.detrecords = (response.records == undefined || response.records == null) ? <Tbl_cargo_whstock[]>[] : <Tbl_cargo_whstock[]>response.records;
                this.mode = 'EDIT';
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

        this.SaveDetails();

        const saveRecord = <vm_tbl_cargo_whstock>{};
        saveRecord.records = this.detrecords;
        saveRecord.mode = this.mode;
        saveRecord.parentid = this.pkid;
        saveRecord.userinfo = this.gs.UserInfo;

        this.mainService.Save(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.errorMessage.push(response.error);
                    alert(this.errorMessage);
                }
                else {

                    this.mode = 'EDIT';
                    alert('Save Complete');
                }
            }, error => {
                this.errorMessage.push(this.gs.getError(error));
                alert(this.errorMessage);
            });
    }


    private SaveDetails() {
        let iCtr: number = 0;
        this.detrecords.forEach(Rec => {
            iCtr++;
            Rec.ind_parent_id = this.pkid.toString();
            Rec.ind_type = this.type.toString();
            Rec.ind_slno = iCtr;
        })
    }

    private Allvalid(): boolean {

        var bRet = true;
        this.errorMessage = [];



        let iCtr: number = 0;
        if (!this.gs.isBlank(this.detrecords)) {
            this.detrecords.forEach(Rec => {
                iCtr++;
                // if (this.gs.isBlank(Rec.ind_code_id)) {
                //     bRet = false;
                //     this.errorMessage.push("Code cannot be blank, Row" + iCtr.toString());
                // }
                if (this.gs.isBlank(Rec.ind_product)) {
                    bRet = false;
                    this.errorMessage.push("Product cannot be blank, Row" + iCtr.toString());
                }
                if (this.gs.isBlank(Rec.ind_cqty)) {
                    bRet = false;
                    this.errorMessage.push("Qty cannot be blank, Row" + iCtr.toString());
                }
                if (this.gs.isZero(Rec.ind_unit_factor)) {
                    bRet = false;
                    this.errorMessage.push("Pcs/Carton cannot be Zero, Row" + iCtr.toString());
                }

                if (!this.gs.isValidCqty(Rec.ind_cqty)) {
                    bRet = false;
                    this.errorMessage.push("Invalid Qty, Row" + iCtr.toString());
                }
                else
                    if (!this.gs.isBlank(Rec.ind_qty_uom_id)) {
                        if (!this.gs.isValidLooseCqty(Rec.ind_cqty, Rec.ind_unit_factor)) {
                            bRet = false;
                            this.errorMessage.push("Loose quantity should be less than " + Rec.ind_unit_factor);
                        }
                    }

                if (this.gs.isBlank(Rec.ind_qty_uom_id)) {
                    bRet = false;
                    this.errorMessage.push("Qty Unit cannot be blank, Row" + iCtr.toString());
                }

                if (!this.gs.isBlank(Rec.ind_volume) && !this.gs.isBlank(Rec.ind_volume_uom_code)) {
                    if (Rec.ind_volume_uom_code != "CBM") {
                        if (!this.gs.isValidVolume(Rec.ind_volume)) {
                            bRet = false;
                            this.errorMessage.push('Invalid Volume ' + Rec.ind_volume);
                        }
                    } else {
                        if (!this.gs.isValidNumber(Rec.ind_volume)) {
                            bRet = false;
                            this.errorMessage.push('Invalid Volume ' + Rec.ind_volume);
                        }
                    }
                }

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

        // let prm = {
        //     appid: this.gs.appid,
        //     id: this.gs.MENU_WH_INWARD,
        //     menuid: this.gs.MENU_WH_INWARD,
        //     menu_param: '',
        //     origin: 'wh-inward-page',
        //     rnd: this.gs.getRandomInt()
        // };
        // this.gs.AutoReloadReturn(prm);

        this.location.back();
    }

    AddDetRow() {

        var rec = <Tbl_cargo_whstock>{};
        rec.ind_pkid = this.gs.getGuid();
        rec.ind_parent_id = this.pkid;
        rec.ind_code_id = '';
        rec.ind_code = '';
        rec.ind_product = '';
        rec.ind_desc = '';
        rec.ind_refno = '';
        rec.ind_cqty = '0';
        rec.ind_qty_uom_id = 'CTN';
        rec.ind_qty_uom_code = 'CTN';
        rec.ind_qty_uom_name = '';
        rec.ind_unit_factor = 1;
        rec.ind_packages = 0;
        rec.ind_packages_uom_id = '';
        rec.ind_packages_uom_code = '';
        rec.ind_packages_uom_name = '';
        rec.ind_weight = 0;
        rec.ind_weight_uom_id = '';
        rec.ind_weight_uom_code = '';
        rec.ind_weight_uom_name = '';
        rec.ind_pallets = 0;
        rec.ind_volume = '';
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

        //Details
        if (_Record.controlname == "PRODUCT") {
            this.detrecords.forEach(rec => {
                if (rec.ind_pkid == _Record.uid) {
                    rec.ind_code_id = _Record.id;
                    rec.ind_code = _Record.code;
                    rec.ind_product = _Record.name;
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
                    if (!this.gs.isValidLooseCqty(rec.ind_cqty, rec.ind_unit_factor)) {
                        alert('Loose quantity should be less than ' + rec.ind_unit_factor);
                    }
                    if (idx < this.ind_cqty_field.toArray().length)
                        this.ind_cqty_field.toArray()[idx].nativeElement.focus();
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
                    if (idx < this.ind_weight_field.toArray().length)
                        this.ind_weight_field.toArray()[idx].nativeElement.focus();
                }
            });
        }
        if (_Record.controlname == "VOLUME-UOM") {
            this.detrecords.forEach(rec => {
                if (rec.ind_pkid == _Record.uid) {
                    rec.ind_volume_uom_id = _Record.id;
                    rec.ind_volume_uom_code = _Record.code;
                    rec.ind_volume_uom_name = _Record.name;
                    this.validateVolume(rec.ind_volume, rec.ind_volume_uom_code);
                    if (idx < this.ind_volume_field.toArray().length)
                        this.ind_volume_field.toArray()[idx].nativeElement.focus();
                }
            });
        }

        if (_Record.controlname == "WAREHOUSE") {
            this.inm_wh_id = _Record.id;
            this.inm_wh_code = _Record.code;
            this.inm_wh_name = _Record.name;
        }
        if (_Record.controlname == "CUSTOMER") {
            this.inm_cust_id = _Record.id;
            this.inm_cust_code = _Record.code;
            this.inm_cust_name = _Record.name;
            if (_Record.col8 != "")
                this.inm_cust_name = _Record.col8;


        }
    }

    onFocusout(field: string, rec: Tbl_cargo_whstock = null, idx: number = 0) {

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


    onFocus(field: string) {
        this.bChanged = false;
    }

    onChange(field: string) {
        this.bChanged = true;
    }

    onBlur(field: string, rec: Tbl_cargo_whstock = null, idx: number = 0) {
        switch (field) {

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
            case 'ind_cqty': {
                if (this.bChanged) {
                    if (!this.gs.isValidCqty(rec.ind_cqty))
                        alert('Invalid Qty ' + rec.ind_cqty);
                    else
                        if (!this.gs.isBlank(rec.ind_qty_uom_id)) {
                            if (!this.gs.isValidLooseCqty(rec.ind_cqty, rec.ind_unit_factor)) {
                                alert('Loose quantity should be less than ' + rec.ind_unit_factor);
                            }
                        }
                }
                break;
            }
            case 'ind_unit_factor': {
                if (this.bChanged) {
                    if (this.gs.isZero(rec.ind_unit_factor))
                        alert('Pcs/Carton cannot be zero ');
                    else
                        if (!this.gs.isBlank(rec.ind_qty_uom_id)) {
                            if (!this.gs.isValidLooseCqty(rec.ind_cqty, rec.ind_unit_factor)) {
                                alert('Loose quantity should be less than ' + rec.ind_unit_factor);
                            }
                        }
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
                rec.ind_volume = rec.ind_volume.toUpperCase().trim();
                this.validateVolume(rec.ind_volume, rec.ind_volume_uom_code);
                //rec.ind_volume = this.gs.roundNumber(rec.ind_volume, 3);
                // this.findRowTotal(field, rec);
                break;
            }
            // case 'ind_volume_uom': {
            //     rec.ind_volume_uom = rec.ind_volume_uom.toUpperCase().trim();
            //     break;
            // }
        }
    }

    validateVolume(_strVol: string, _strVolUnit: string) {
        if (!this.gs.isBlank(_strVol) && !this.gs.isBlank(_strVolUnit)) {
            if (_strVolUnit != "CBM") {
                if (!this.gs.isValidVolume(_strVol)) {
                    alert('Invalid Volume ' + _strVol);
                }
            } else {
                if (!this.gs.isValidNumber(_strVol)) {
                    alert('Invalid Volume ' + _strVol);
                }
            }
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

    RemoveDetRow(_rec: Tbl_cargo_whstock) {
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
            return "/warehouse/WhInwardPage";
        else
            return "/warehouse/WhInwardEditPage";
    }

    getParam(_mode: string = "") {

        if (_mode == "LIST") {
            return {
                appid: this.gs.appid,
                id: this.gs.MENU_WH_INWARD,
                menuid: this.gs.MENU_WH_INWARD,
                menu_param: '',
                origin: 'wh-inward-page',
                rnd: this.gs.getRandomInt()
            };
        } else {
            return {
                appid: this.gs.appid,
                menuid: this.menuid,
                pkid: '',
                type: 'IN',
                origin: 'wh-inward-page',
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

    ModifiedRecords(event: any) {

        if (event.action == 'OK') {
           
        }
    
      }

}


