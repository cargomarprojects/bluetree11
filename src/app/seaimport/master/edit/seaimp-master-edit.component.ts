import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/services/global.service';

import { SeaImpMasterService } from '../../services/seaimp-master.service';
import { User_Menu } from '../../../core/models/menum';
import { Tbl_cargo_imp_masterm, Tbl_cargo_imp_container, Tbl_cargo_imp_housem, vm_tbl_cargo_imp_masterm } from '../../models/tbl_cargo_imp_masterm';
import { SearchTable } from '../../../shared/models/searchtable';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateComponent } from '../../../shared/date/date.component';
import { AutoComplete2Component } from '../../../shared/autocomplete2/autocomplete2.component';

@Component({
  selector: 'app-seaimp-master-edit',
  templateUrl: './seaimp-master-edit.component.html'
})
export class SeaImpMasterEditComponent implements OnInit {

  @ViewChild('mbl_no') mbl_no_field: ElementRef;
  @ViewChild('mbl_liner_bookingno') mbl_liner_bookingno_field: ElementRef;
  @ViewChild('_mbl_ref_date') mbl_ref_date_field: DateComponent;
  @ViewChild('_agent_lov') agent_lov_field: AutoComplete2Component;
  @ViewChild('_liner_lov') liner_lov_field: AutoComplete2Component;
  @ViewChild('_coloader_lov') coloader_lov_field: AutoComplete2Component;
  @ViewChild('_handled_lov') handled_lov_field: AutoComplete2Component;
  @ViewChild('_salesman_lov') salesman_lov_field: AutoComplete2Component;
  @ViewChild('_mbl_frt_status') mbl_frt_status_field: ElementRef;
  @ViewChild('_mbl_pol_etd') mbl_pol_etd_field: DateComponent;
  @ViewChild('_mbl_pod_eta') mbl_pod_eta_field: DateComponent;
  @ViewChild('_mbl_vessel') mbl_vessel_field: ElementRef;
  @ViewChild('_mbl_cargo_locname') mbl_cargo_locname_field: ElementRef;
  @ViewChild('_mbl_devan_locname') mbl_devan_locname_field: ElementRef;
  @ViewChildren('_cntr_no') cntr_no_field: QueryList<ElementRef>;
  @ViewChildren('_cntr_sealno') cntr_sealno_field: QueryList<ElementRef>;

  record: Tbl_cargo_imp_masterm = <Tbl_cargo_imp_masterm>{};
  hrecords: Tbl_cargo_imp_housem[] = [];
  records: Tbl_cargo_imp_container[] = [];

  // 24-05-2019 Created By Joy  
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
  constructor(
    private modalconfig: NgbModalConfig,
    private modalservice: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: SeaImpMasterService,
  ) {
    modalconfig.backdrop = 'static'; //true/false/static
    modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
  }

  ngOnInit() {
    if (this.route.snapshot.queryParams.parameter == null) {
    this.pkid =this.route.snapshot.queryParams.pkid;
    this.menuid = this.route.snapshot.queryParams.menuid;
    this.mode = this.route.snapshot.queryParams.mode;
    }
    else 
    {
      const options = JSON.parse(this.route.snapshot.queryParams.parameter);
      this.pkid = options.pkid;
      this.menuid = options.menuid;
      this.mode = options.mode;
    }
    this.closeCaption = 'Return';
    this.initPage();
    this.actionHandler();
  }

  private initPage() {
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.errorMessage = [];
    this.LoadCombo(); 
  }

  LoadCombo() {

    if (this.gs.company_name == "MOTHERLINES INC USA") {
      this.MblStatusList = [{ "name": "NIL" }
        , { "name": "OMBL WITH ACCOUNTING" }, { "name": "OMBL SENT TO CARRIER" }
        , { "name": "OMBL WITH LAX OFFICE" }, { "name": "OMBL SENT BY LAX OFFICE" }, { "name": "OMBL WITH NYC OFFICE" }
        , { "name": "OMBL SENT BY NYC OFFICE" }];
    } else {
      this.MblStatusList = [{ "name": "NIL" }, { "name": "OMBL WITH OPERATION" },
      { "name": "OMBL WITH ACCOUNTING" }, { "name": "OMBL SENT TO CARRIER" }];
    }

    this.BlStatusList = [{ "name": "NIL" }
      , { "name": "PENDING SEAWAY" }, { "name": "SEAWAY BILL" }
      , { "name": "PENDING TELEX RELEASED" }, { "name": "TELEX RELEASED" }];
  }

  ngAfterViewInit() {
    if (!this.gs.isBlank(this.mbl_ref_date_field))
      this.mbl_ref_date_field.Focus();
  }

  NewRecord() {
    this.mode = 'ADD'
    this.actionHandler();
  }

  actionHandler() {
    this.errorMessage = [];
    this.is_locked = false;
    if (this.mode == 'ADD') {
      this.record = <Tbl_cargo_imp_masterm>{};
      this.records = <Tbl_cargo_imp_container[]>[];
      this.hrecords = <Tbl_cargo_imp_housem[]>[];
      this.pkid = this.gs.getGuid();
      this.init();
    }
    if (this.mode == 'EDIT') {
      this.GetRecord();
    }
  }

  init() {

    this.record.mbl_pkid = this.pkid;
    this.record.mbl_no = '';
    this.record.mbl_ref_date = this.gs.defaultValues.today;
    this.record.mbl_country_id = '';
    this.record.mbl_country_name = '';
    this.record.mbl_handled_id = '';
    this.record.mbl_handled_name = '';
    this.record.mbl_cargo_loc_id = '';
    this.record.mbl_devan_loc_id = '';
    this.record.mbl_cargo_loccode = '';
    this.record.mbl_cargo_locname = '';
    this.record.mbl_cargo_locaddr1 = '';
    this.record.mbl_cargo_locaddr2 = '';
    this.record.mbl_cargo_locaddr3 = '';
    this.record.mbl_cargo_locaddr4 = '';
    this.record.mbl_devan_loccode = '';
    this.record.mbl_devan_locname = '';
    this.record.mbl_devan_locaddr1 = '';
    this.record.mbl_devan_locaddr2 = '';
    this.record.mbl_devan_locaddr3 = '';
    this.record.mbl_devan_locaddr4 = '';
    this.record.mbl_is_held = false;
    this.record.mbl_it_no = '';
    this.record.mbl_it_port = '';
    this.record.mbl_it_date = '';
    this.record.rec_created_by = this.gs.user_code;
    this.record.rec_created_date = this.gs.defaultValues.today;
    this.record.mbl_cntr_type = '';//FCL
    this.record.mbl_container_tot = 0;
    this.record.mbl_lock = '';
    this.record.mbl_unlock_date = '';
    if (this.gs.JOB_TYPE_OI.length > 0) {
      this.record.mbl_jobtype_id = this.gs.JOB_TYPE_OI[0].code;
      this.record.mbl_jobtype_name = this.gs.JOB_TYPE_OI[0].name;
    } else {
      this.record.mbl_jobtype_id = '';
      this.record.mbl_jobtype_name = '';
    }
    this.record.mbl_boeno = '';
    this.record.mbl_shipment_stage = 'NIL';
    this.record.mbl_salesman_id = '';
    this.record.mbl_salesman_name = '';
    this.record.mbl_status = 'NIL';
    this.record.rec_files_attached = '';
    this.record.mbl_is_sea_waybill = 'NIL';
    this.record.mbl_ismemo_attached = 'N';
    this.record.mbl_prefix = this.gs.SEA_IMPORT_REFNO_PREFIX;
    this.record.mbl_startingno = this.gs.SEA_IMPORT_REFNO_STARTING_NO;
    this.record.mbl_vessel = '';
    this.record.mbl_voyage = '';
    this.record.mbl_ombl_sent_on = '';
    this.record.mbl_of_sent_on = '';
    this.record.mbl_coloader_code = '';
    this.record.mbl_coloader_id = '';
    this.record.mbl_coloader_name = '';
    var curr_date = new Date();
    var curr_hh = curr_date.getHours();
    if (curr_hh >= 12)
      this.record.mbl_ombl_sent_ampm = "PM";
    else
      this.record.mbl_ombl_sent_ampm = "AM";

    if (!this.gs.isBlank(this.mbl_ref_date_field))
      this.mbl_ref_date_field.Focus();
  }

  GetRecord() {

    this.errorMessage = [];
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;

    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.record = <Tbl_cargo_imp_masterm>response.record;
        this.records = (response.records == undefined || response.records == null) ? <Tbl_cargo_imp_container[]>[] : <Tbl_cargo_imp_container[]>response.records;
        this.hrecords = (response.hrecords == undefined || response.hrecords == null) ? <Tbl_cargo_imp_housem[]>[] : <Tbl_cargo_imp_housem[]>response.hrecords;
        this.mode = 'EDIT';
        this.is_locked = this.gs.IsShipmentClosed("SEA IMPORT", this.record.mbl_ref_date, this.record.mbl_lock, this.record.mbl_unlock_date);
        if (!this.gs.isBlank(this.mbl_ref_date_field))
          this.mbl_ref_date_field.Focus();
      }, error => {
        this.errorMessage.push(this.gs.getError(error));
      });
  }

  IsBLDupliation(stype: string, no: string) {

    if (no == null)
      return;
    if (no == '')
      return;

    this.errorMessage = [];
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;
    SearchData.blno = no;
    SearchData.stype = stype;
    SearchData.company_code = this.gs.company_code;
    SearchData.branch_code = this.gs.branch_code;
    SearchData.mode = this.mode;

    this.mainService.Isblnoduplication(SearchData)
      .subscribe(response => {
        if (response.retvalue) {
          this.errorMessage.push(response.retstring);
          if (stype == 'MBL') {
            if (!this.gs.isBlank(this.mbl_no_field))
              this.mbl_no_field.nativeElement.focus();
          }
        }
      }, error => {
        this.errorMessage.push(this.gs.getError(error));
      });

  }


  Save() {
    if (!this.Allvalid())
      return;
    this.SaveContainer();
    this.FindTotTeus();
    const saveRecord = <vm_tbl_cargo_imp_masterm>{};
    saveRecord.record = this.record;
    saveRecord.cntrs = this.records;
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
            this.record.mbl_refno = response.code;
          this.mode = 'EDIT';
          this.errorMessage.push('Save Complete');
          // alert(this.errorMessage);
        }
      }, error => {
        this.errorMessage.push(this.gs.getError(error));
        alert(this.errorMessage);
      });
  }

  private FindTotTeus() {
    var Tot_Teu = 0, Teu = 0, Tot_Cbm = 0;
    var Tot_20 = 0, Tot_40 = 0, Tot_40HQ = 0, Tot_45 = 0;
    var Cntr_Tot = 0;
    let sCntrType: string = "";
    this.records.forEach(Rec => {
      Cntr_Tot++;
      Teu = 0;
      if (Rec.cntr_type.indexOf("20") >= 0)
        Teu = 1;
      else if (Rec.cntr_type.indexOf("40") >= 0) {
        if (Rec.cntr_type.indexOf("HC") >= 0)
          Teu = 2.25;
        else
          Teu = 2;
      }
      else if (Rec.cntr_type.indexOf("45") >= 0)
        Teu = 2.50;

      if (this.record.mbl_cntr_type.toString() == "LCL")
        Teu = 0;
      Tot_Teu += Teu;
      Tot_Cbm += Rec.cntr_cbm;
      Rec.cntr_teu = Teu;
      if (Teu > 0) {
        if (Rec.cntr_type.indexOf("20") >= 0)
          Tot_20 += 1;
        else if (Rec.cntr_type.indexOf("40HC") >= 0 || Rec.cntr_type.indexOf("40HQ") >= 0)
          Tot_40HQ += 1;
        else if (Rec.cntr_type.indexOf("40") >= 0)
          Tot_40 += 1;
        else if (Rec.cntr_type.indexOf("45") >= 0)
          Tot_45 += 1;
      }

      if (sCntrType.indexOf(Rec.cntr_type) < 0) {
        if (sCntrType != "")
          sCntrType += ",";
        sCntrType += Rec.cntr_type;
      }

    })
    this.record.mbl_teu = Tot_Teu;
    this.record.mbl_20 = Tot_20;
    this.record.mbl_40 = Tot_40;
    this.record.mbl_40HQ = Tot_40HQ;
    this.record.mbl_45 = Tot_45;
    this.record.mbl_cntr_cbm = Tot_Cbm;
    this.record.mbl_container_tot = Cntr_Tot;
    if (sCntrType.length > 100)
      sCntrType = sCntrType.substring(0, 100);

    this.record.mbl_cntr_desc = sCntrType;
  }
  private SaveContainer() {
    let iCtr: number = 0;
    this.records.forEach(Rec => {
      iCtr++;
      Rec.cntr_hblid = this.pkid.toString();
      Rec.cntr_catg = "M";
      Rec.cntr_order = iCtr;
      Rec.cntr_weight_uom = "";
      Rec.cntr_packages = 0;
    })
  }

  private Allvalid(): boolean {

    var bRet = true;
    this.errorMessage = [];

    if (this.gs.isBlank(this.record.mbl_no)) {
      bRet = false;
      this.errorMessage.push("Master BL# cannot be blank");;
    }
    if (this.gs.isBlank(this.record.mbl_ref_date)) {
      bRet = false;
      this.errorMessage.push("Ref Date cannot be blank");;
    }
    if (this.gs.JOB_TYPE_OI.length > 0 && this.gs.isBlank(this.record.mbl_jobtype_id)) {
      bRet = false;
      this.errorMessage.push("Job Type cannot be blank");;
    }
    if (this.gs.isBlank(this.record.mbl_shipment_stage)) {
      bRet = false;
      this.errorMessage.push("Shipment Stage cannot be blank");;
    }
    if (this.gs.isBlank(this.record.mbl_agent_id)) {
      bRet = false;
      this.errorMessage.push("Master Agent cannot be blank");
    }
    if (this.gs.isBlank(this.record.mbl_liner_id)) {
      bRet = false;
      this.errorMessage.push("Carrier cannot be blank");
    }

    if (this.gs.isBlank(this.record.mbl_handled_id)) {
      bRet = false;
      this.errorMessage.push("A/N Handled By cannot be blank");
    }

    if (this.gs.isBlank(this.record.mbl_frt_status)) {
      bRet = false;
      this.errorMessage.push("Freight status cannot be blank");
    }

    if (this.gs.isBlank(this.record.mbl_ship_term_id)) {
      bRet = false;
      this.errorMessage.push("Shipping Term cannot be blank");
    }
    if (this.gs.isBlank(this.record.mbl_cntr_type)) {
      bRet = false;
      this.errorMessage.push("Container Type cannot be blank");
    }
    if (this.gs.isBlank(this.record.mbl_pol_id)) {
      bRet = false;
      this.errorMessage.push("Port of Loading cannot be blank");
    }
    if (this.gs.isBlank(this.record.mbl_pol_etd)) {
      bRet = false;
      this.errorMessage.push("ETD cannot be blank");
    }
    if (this.gs.isBlank(this.record.mbl_pod_id)) {
      bRet = false;
      this.errorMessage.push("Port of Discharge cannot be blank");
    }
    if (this.gs.isBlank(this.record.mbl_pod_eta)) {
      bRet = false;
      this.errorMessage.push("ETA cannot be blank");
    }

    if (this.gs.isBlank(this.record.mbl_country_id)) {
      bRet = false;
      this.errorMessage.push("Country Cannot be blank");
    }

    if (this.gs.isBlank(this.record.mbl_vessel)) {
      bRet = false;
      this.errorMessage.push("Vessel cannot be blank");
    }
    if (this.gs.isBlank(this.record.mbl_voyage)) {
      bRet = false;
      this.errorMessage.push("Voyage cannot be blank");
    }

    if (this.record.mbl_status.toString().trim() == "OMBL SENT TO CARRIER") {
      if (this.gs.isBlank(this.record.mbl_ombl_sent_on.toString().trim())) {
        bRet = false;
        this.errorMessage.push("OMBL Sent Date cannot be blank");
      }
    }

    if (this.record.mbl_cntr_type != "OTHERS") {
      this.records.forEach(Rec => {
        if (Rec.cntr_no.length != 11) {
          bRet = false;
          this.errorMessage.push("Container( " + Rec.cntr_no + " ) Invalid");
        }
        if (Rec.cntr_type.length <= 0) {
          bRet = false;
          this.errorMessage.push("Container( " + Rec.cntr_no + " ) type has to be selected");
        }
        if (Rec.cntr_type == "LCL") {
          if (Rec.cntr_cbm <= 0) {
            bRet = false;
            this.errorMessage.push("Container( " + Rec.cntr_no + " ) CBM cannot be zero");
          }
        }
      })
    }
    if (!bRet)
      alert('Error While Saving');

    return bRet;
  }


  Close() {
    this.location.back();
  }


  AddRow() {
    var rec = <Tbl_cargo_imp_container>{};
    rec.cntr_pkid = this.gs.getGuid();
    rec.cntr_hblid = this.pkid.toString();
    rec.cntr_catg = "M";
    rec.cntr_no = "";
    rec.cntr_type = "";
    rec.cntr_sealno = '';
    rec.cntr_pieces = 0;
    rec.cntr_packages_uom = '';
    rec.cntr_packages = 0;
    rec.cntr_weight = 0;
    rec.cntr_tare_weight = 0;
    rec.cntr_cbm = 0;
    rec.cntr_pick_date = '';
    rec.cntr_return_date = '';
    rec.cntr_weight_uom = '';
    rec.cntr_order = 1;
    rec.cntr_lfd = '';
    rec.cntr_discharge_date = '';
    this.records.push(rec);

    this.cntr_no_field.changes
      .subscribe((queryChanges) => {
        this.cntr_no_field.last.nativeElement.focus();
      });
  }


  LovSelected(_Record: SearchTable, idx: number = 0) {

    if (_Record.controlname == "AGENT") {
      this.record.mbl_agent_id = _Record.id;
      this.record.mbl_agent_name = _Record.name;
      this.liner_lov_field.Focus();
    }
    if (_Record.controlname == "CARRIER") {
      this.record.mbl_liner_id = _Record.id;
      this.record.mbl_liner_name = _Record.name;
      this.coloader_lov_field.Focus();
    }
    if (_Record.controlname == "HANDLEDBY") {
      this.record.mbl_handled_id = _Record.id;
      this.record.mbl_handled_name = _Record.name;
      this.salesman_lov_field.Focus();
    }
    if (_Record.controlname == "SALESMAN") {
      this.record.mbl_salesman_id = _Record.id;
      this.record.mbl_salesman_name = _Record.name;
      this.mbl_frt_status_field.nativeElement.focus();
    }
    if (_Record.controlname == "POL") {
      this.record.mbl_pol_id = _Record.id;
      this.record.mbl_pol_name = _Record.name;
      this.mbl_pol_etd_field.Focus();
    }

    if (_Record.controlname == "POD") {
      this.record.mbl_pod_id = _Record.id;
      this.record.mbl_pod_name = _Record.name;
      this.mbl_pod_eta_field.Focus();
    }

    if (_Record.controlname == "POFD") {
      this.record.mbl_pofd_id = _Record.id;
      this.record.mbl_pofd_name = _Record.name;
    }

    if (_Record.controlname == "COUNTRY") {
      this.record.mbl_country_id = _Record.id;
      this.record.mbl_country_name = _Record.name;
      this.mbl_vessel_field.nativeElement.focus();
    }

    if (_Record.controlname == "CARGO-LOC") {
      this.record.mbl_cargo_loc_id = _Record.id;

      this.record.mbl_cargo_locname = _Record.name;
      if (_Record.col8 != "")
        this.record.mbl_cargo_locname = _Record.col8;

      this.record.mbl_cargo_locaddr1 = _Record.col1;
      this.record.mbl_cargo_locaddr2 = _Record.col2;
      this.record.mbl_cargo_locaddr3 = _Record.col3;
      this.record.mbl_cargo_locaddr4 = this.gs.GetTelFax(_Record.col6.toString(), _Record.col7.toString());
      this.mbl_cargo_locname_field.nativeElement.focus();
    }

    if (_Record.controlname == "DEVAN-LOC") {
      this.record.mbl_devan_loc_id = _Record.id;

      this.record.mbl_devan_locname = _Record.name;
      if (_Record.col8 != "")
        this.record.mbl_devan_locname = _Record.col8;

      this.record.mbl_devan_locaddr1 = _Record.col1;
      this.record.mbl_devan_locaddr2 = _Record.col2;
      this.record.mbl_devan_locaddr3 = _Record.col3;
      this.record.mbl_devan_locaddr4 = this.gs.GetTelFax(_Record.col6.toString(), _Record.col7.toString());
      this.mbl_devan_locname_field.nativeElement.focus();
    }

    if (_Record.controlname == "COLOADER") {
      this.record.mbl_coloader_id = _Record.id;
      this.record.mbl_coloader_name = _Record.name;
      this.handled_lov_field.Focus();
    }

    // Container
    if (_Record.controlname == "CONTAINER TYPE") {
      this.records.forEach(rec => {
        if (rec.cntr_pkid == _Record.uid) {
          rec.cntr_type = _Record.code;
          if (idx < this.cntr_sealno_field.toArray().length)
            this.cntr_sealno_field.toArray()[idx].nativeElement.focus();
        }
      });
    }
  }

  onFocusout(field: string) {

    switch (field) {
      case 'mbl_no': {

        this.IsBLDupliation('MBL', this.record.mbl_no);
        break;
      }
      case 'mbl_liner_bookingno': {

        // this.IsBLDupliation('BOOKING', this.record.mbl_liner_bookingno);
        // break;
      }
    }
  }


  onBlur(field: string, rec: Tbl_cargo_imp_container) {
    switch (field) {
      case 'mbl_refno': {
        this.record.mbl_refno = this.record.mbl_refno.toUpperCase();
        break;
      }
      case 'mbl_no': {
        this.record.mbl_no = this.record.mbl_no.toUpperCase();
        break;
      }

      //   case 'mbl_sub_houseno': {
      //     this.record.mbl_sub_houseno = this.record.mbl_sub_houseno.toUpperCase();
      //     break;
      //   }
      //   case 'mbl_liner_bookingno': {
      //     this.record.mbl_liner_bookingno = this.record.mbl_liner_bookingno.toUpperCase();
      //     break;
      //   }
      case 'mbl_place_delivery': {
        this.record.mbl_place_delivery = this.record.mbl_place_delivery.toUpperCase();
        break;
      }
      case 'mbl_vessel': {
        this.record.mbl_vessel = this.record.mbl_vessel.toUpperCase();
        break;
      }
      case 'mbl_voyage': {
        this.record.mbl_voyage = this.record.mbl_voyage.toUpperCase();
        break;
      }

      case 'mbl_cargo_locname': {
        this.record.mbl_cargo_locname = this.record.mbl_cargo_locname.toUpperCase();
        break;
      }
      case 'mbl_cargo_locaddr1': {
        this.record.mbl_cargo_locaddr1 = this.record.mbl_cargo_locaddr1.toUpperCase();
        break;
      }
      case 'mbl_cargo_locaddr2': {
        this.record.mbl_cargo_locaddr2 = this.record.mbl_cargo_locaddr2.toUpperCase();
        break;
      }
      case 'mbl_cargo_locaddr3': {
        this.record.mbl_cargo_locaddr3 = this.record.mbl_cargo_locaddr3.toUpperCase();
        break;
      }
      case 'mbl_cargo_locaddr4': {
        this.record.mbl_cargo_locaddr4 = this.record.mbl_cargo_locaddr4.toUpperCase();
        break;
      }
      case 'mbl_devan_locname': {
        this.record.mbl_devan_locname = this.record.mbl_devan_locname.toUpperCase();
        break;
      }
      case 'mbl_devan_locaddr1': {
        this.record.mbl_devan_locaddr1 = this.record.mbl_devan_locaddr1.toUpperCase();
        break;
      }
      case 'mbl_devan_locaddr2': {
        this.record.mbl_devan_locaddr2 = this.record.mbl_devan_locaddr2.toUpperCase();
        break;
      }
      case 'mbl_devan_locaddr3': {
        this.record.mbl_devan_locaddr3 = this.record.mbl_devan_locaddr3.toUpperCase();
        break;
      }
      case 'mbl_devan_locaddr4': {
        this.record.mbl_devan_locaddr4 = this.record.mbl_devan_locaddr4.toUpperCase();
        break;
      }

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

  AddHouse() {
    if (!this.gs.canAdd(this.gs.MENU_SI_HOUSE)) {
      alert('Insufficient User Rights')
      return;
    }

    this.hbl_pkid = "";
    this.hbl_mode = "ADD";
    this.BtnNavigation('HOUSE')
  }

  EditHouse(_record: Tbl_cargo_imp_housem) {

    if (!this.gs.canEdit(this.gs.MENU_SI_HOUSE)) {
      alert('Insufficient User Rights')
      return;
    }

    this.hbl_pkid = _record.hbl_pkid;
    this.hbl_mode = "EDIT";
    this.BtnNavigation('HOUSE')
  }


  BtnNavigation(action: string, attachmodal: any = null) {

    switch (action) {
      case 'ARAP': {
        let prm = {
          menuid: this.gs.MENU_SI_MASTER_ARAP,
          mbl_pkid: this.pkid,
          mbl_refno: this.record.mbl_refno,
          mbl_type: 'OI',
          origin: 'seaimp-master-page',
        };
        this.gs.Naviagete('Silver.USAccounts.Trans/InvoicePage', JSON.stringify(prm));
        break;
      }
      case 'PROFITREPORT': {
        let prm = {
          menuid: this.gs.MENU_SI_MASTER_PROFIT_REPORT,
          mbl_pkid: this.pkid,
          mbl_refno: this.record.mbl_refno,
          mbl_type: 'OI',
          origin: 'seaimp-master-page',
        };
        this.gs.Naviagete('Silver.USAccounts.Trans/ProfitReportPage', JSON.stringify(prm));
        break;
      }
      case 'HOUSE': {
        let prm = {
          menuid: this.gs.MENU_SI_HOUSE,
          parentid: this.pkid,
          pkid: this.hbl_pkid,
          refno: this.record.mbl_refno,
          type: 'OI',
          origin: 'seaimp-master-page',
          mode: this.hbl_mode
        };
        this.gs.Naviagete('Silver.SeaImport/SeaImpHouseEditPage', JSON.stringify(prm));
        break;
      }
      case 'DEVAN-INSTRUCTION': {
        let prm = {
          menuid: this.gs.MENU_SI_MASTER_DEVANNING_INSTRUCTION,
          pkid: this.pkid,
          mbl_refno: this.record.mbl_refno,
          origin: 'seaimp-master-page',
          is_locked: this.is_locked
        };
        this.gs.Naviagete('Silver.SeaImport/DevanInstructionPage', JSON.stringify(prm));
        break;
      }
      case 'PAYMENT-REQUEST': {
        let prm = {
          menuid: this.gs.MENU_SI_PAYMENT_REQUEST,
          cp_master_id: this.pkid,
          cp_source: 'SEA-MASTER',
          cp_mode: 'SEA IMPORT',
          cp_ref_no: this.record.mbl_refno,
          is_locked: this.is_locked,
          origin: 'seaimp-master-page'
        };
        this.gs.Naviagete('Silver.BusinessModule/PaymentRequestPage', JSON.stringify(prm));
        break;
      }
      case 'MESSENGER-SLIP': {
        let prm = {
          menuid: this.gs.MENU_SI_MESSENGER_SLIP,
          mbl_pkid: this.pkid,
          mbl_mode: 'SEA IMPORT',
          mbl_refno: this.record.mbl_refno,
          islocked: false,
          origin: 'seaimp-master-page',
          is_locked: this.is_locked
        };
        this.gs.Naviagete('Silver.Other.Trans/MessengerSlipList', JSON.stringify(prm));
        break;
      }
      case 'FOLLOWUP': {
        let prm = {
          menuid: this.gs.MENU_SI_MASTER,
          master_id: this.pkid,
          master_refno: this.record.mbl_refno,
          master_refdate: this.record.mbl_ref_date,
          is_locked: this.is_locked,
          origin: 'seaimp-master-page'
        };
        this.gs.Naviagete('Silver.BusinessModule/FollowUpPage', JSON.stringify(prm));
        break;
      }
      case 'REQUEST-APPROVAL': {
        let prm = {
          menuid: this.gs.MENU_SI_MASTER_REQUEST_APPROVAL,
          mbl_pkid: this.pkid,
          mbl_refno: this.record.mbl_refno,
          doc_type: 'SEA IMPORT',
          req_type: 'REQUEST',
          is_locked: this.is_locked,
          origin: 'seaimp-master-page'
        };
        this.gs.Naviagete('Silver.Other.Trans/ApprovedPageList', JSON.stringify(prm));
        break;
      }
      case 'INERNALMEMO': {
        let prm = {
          menuid: this.gs.MENU_SI_MASTER_INTERNAL_MEMO,
          refno: "REF : " + this.record.mbl_refno,
          pkid: this.pkid,
          origin: 'seaimp-master-page',
          oprgrp: 'SEA IMPORT',
          parentType: 'SEAIMP-CNTR',
          paramType: 'CNTR-MOVE-STATUS',
          hideTracking: 'Y',
          is_locked: this.is_locked
        };
        this.gs.Naviagete('Silver.Other.Trans/TrackingPage', JSON.stringify(prm));
        break;
      }
      case 'CARGOPICKUP': {
        let prm = {
          menuid: this.gs.MENU_SI_MASTER_DELIVERY_ORDER,
          pkid: this.pkid,
          origin: 'seaimp-master-page',
          is_locked: this.is_locked
        };
        this.gs.Naviagete('Silver.SeaImport/CargoPickupPage', JSON.stringify(prm));
        break;
      }
      case 'COPY-CNTR': {
        let prm = {
          menuid: this.gs.MENU_SI_MASTER,
          pkid: this.pkid,
          mbl_cntr_type: this.record.mbl_cntr_type,
          origin: 'seaimp-master-page',
          is_locked: this.is_locked
        };
        this.gs.Naviagete('Silver.SeaImport/CopyCntrPage', JSON.stringify(prm));
        break;
      }
      case 'SHIP-LABEL': {
        let parameter = {
          id: this.gs.MENU_SHIPMENT_LABEL,
          menuid: this.gs.MENU_SHIPMENT_LABEL,
          mbl_pkid: this.pkid,
          origin: 'seaimp-master-page',
        };
        this.gs.Naviagete('Silver.Reports.General/ShipLabelPage', JSON.stringify(parameter));
        break;
      }
      case 'POD': {
        this.report_title = 'POD';
        this.report_url = '/api/SeaImport/Master/GetPODSeaImpRpt';
        this.report_searchdata = this.gs.UserInfo;
        this.report_searchdata.pkid = this.pkid;
        this.report_menuid = this.gs.MENU_SI_MASTER_POD;
        this.tab = 'report';
        break;
      }
      case 'SHIP-LABEL-PRINT': {
        this.report_title = 'Shipment Label';
        this.report_menuid = this.gs.MENU_SHIPMENT_LABEL;
        this.report_url = '/api/Report/ShipmentLabelReport';
        this.report_searchdata = this.gs.UserInfo;
        this.report_searchdata.outputformat = 'PRINT';
        this.report_searchdata.pkid = this.gs.getGuid();
        this.report_searchdata.action = 'NEW';
        this.report_searchdata.MODE = 'SEA IMPORT';
        this.report_searchdata.MBL_PKID = this.pkid;
        this.tab = 'report';
        break;
      }
      case 'ATTACHMENT': {
        let TypeList: any[] = [];
        TypeList = [{ "code": "EMAIL", "name": "E-MAIL" }, { "code": "HOUSEBL", "name": "HOUSE B/L" }, { "code": "MASTER", "name": "MASTER" }, { "code": "PAYMENT SETTLEMENT", "name": "OTHERS" }];
        this.attach_title = 'Documents';
        this.attach_parentid = this.pkid;
        this.attach_subid = '';
        this.attach_type = 'PAYMENT SETTLEMENT';
        this.attach_typelist = TypeList;
        this.attach_tablename = 'cargo_masterm';
        this.attach_tablepkcolumn = 'mbl_pkid';
        this.attach_refno = this.record.mbl_refno;
        this.attach_customername = '';
        this.attach_updatecolumn = 'REC_FILES_ATTACHED';
        this.attach_viewonlysource = '';
        this.attach_viewonlyid = '';
        this.attach_filespath = '';
        this.attach_filespath2 = '';
        this.modal = this.modalservice.open(attachmodal, { centered: true });
        break;
      }
    }
  }
  callbackevent(event: any) {
    this.tab = 'main';
  }


  ShowCntrMovement(_rec: Tbl_cargo_imp_container) {

    if (!this.gs.isBlank(_rec.cntr_pkid)) {
      let prm = {
        menuid: this.gs.MENU_SI_CONTAINER_MOVEMENT,
        refno: "REF : " + this.record.mbl_refno + "  CNTR : " + _rec.cntr_no,
        pkid: _rec.cntr_pkid,
        origin: 'seaimp-Master-page',
        oprgrp: 'SEA IMPORT',
        parentType: 'SEAIMP-CNTR',
        paramType: 'CNTR-MOVE-STATUS',
        hideTracking: 'N',
        is_locked: this.is_locked
      };
      this.gs.Naviagete('Silver.Other.Trans/TrackingPage', JSON.stringify(prm));
    }
  }
  RemoveRow(_rec: Tbl_cargo_imp_container) {
    this.records.splice(this.records.findIndex(rec => rec.cntr_pkid == _rec.cntr_pkid), 1);
  }

  CopyLoc2House() {
    this.errorMessage = [];
    if (this.mode != 'EDIT') {
      this.errorMessage.push('Please Save and Continue...');
      return;
    }

    if (!confirm("Copy To House...")) {
      return;
    }

    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;
    this.mainService.CopyLoc2House(SearchData)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage.push(response.error);
          alert(this.errorMessage);
        }
        else {

          this.errorMessage.push('Copy Complete');
          alert(this.errorMessage);
        }

      }, error => {
        this.errorMessage.push(this.gs.getError(error));
      });

  }

  UpdatePuEr() {

    this.errorMessage = [];
    if (this.mode != 'EDIT') {
      this.errorMessage.push('Please Save and Continue...');
      return;
    }


    if (!confirm("Update P/U. & E/R.")) {
      return;
    }

    const updateRecord = <vm_tbl_cargo_imp_masterm>{};
    updateRecord.cntrs = this.records;
    updateRecord.userinfo = this.gs.UserInfo;
    this.mainService.UpdatePuEr(updateRecord)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage.push(response.error);
          alert(this.errorMessage);
        }
        else {
          this.errorMessage.push('Update P/U. & E/R. Complete');
          alert(this.errorMessage);
        }
      }, error => {
        this.errorMessage.push(this.gs.getError(error));
      });
  }
  /*
    GetPODSeaImpRpt() {
      this.errorMessage = '';
      var SearchData = this.gs.UserInfo;
      SearchData.pkid = this.pkid;
          
      this.mainService.GetPODSeaImpRpt(SearchData)
        .subscribe(response => {
          
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
          
        }, error => {
          this.errorMessage = this.gs.getError(error);
        });
    }
    
    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
      this.gs.DownloadFile(this.gs.GLOBAL_REPORT_FOLDER, filename, filetype, filedisplayname);
    }
  */

  CopyCntrClipboard() {
    let strcntr: string = "";
    this.records.forEach(Rec => {
      if (strcntr != "")
        strcntr += ",";
      strcntr += Rec.cntr_no.trim();
    })
    if (strcntr != "") {
      alert(strcntr)
      this.gs.copyToClipboard(strcntr);
    }
  }
  CloseModal() {
    this.modal.close();
  }
}



