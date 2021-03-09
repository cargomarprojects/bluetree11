import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/services/global.service';

import { seaexpMasterService } from '../../services/seaexp-master.service';
import { User_Menu } from '../../../core/models/menum';
import { Tbl_cargo_exp_masterm, Tbl_cargo_exp_container, vm_tbl_cargo_exp_masterm } from '../../models/tbl_cargo_exp_masterm';

import { Tbl_cargo_exp_housem } from '../../models/Tbl_cargo_exp_housem';

import { SearchTable } from '../../../shared/models/searchtable';

import { InputBoxComponent } from '../../../shared/input/inputbox.component';

import { InputBoxNumberComponent } from '../../../shared/inputnumber/inputboxnumber.component';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateComponent } from '../../../shared/date/date.component';
import { AutoComplete2Component } from '../../../shared/autocomplete2/autocomplete2.component';

@Component({
  selector: 'app-seaexp-master-edit',
  templateUrl: './seaexp-master-edit.component.html'
})
export class SeaexpMasterEditComponent implements OnInit {

  @ViewChild('mbl_no') mbl_no_field: InputBoxComponent;
  @ViewChild('mbl_liner_bookingno') mbl_liner_bookingno_field: InputBoxComponent;
  @ViewChild('_mbl_ref_date') mbl_ref_date_field: DateComponent;
  @ViewChild('_mbl_liner_name') mbl_liner_name_field: AutoComplete2Component;
  @ViewChild('_mbl_salesman_name') mbl_salesman_name_field: AutoComplete2Component;
  @ViewChild('_mbl_handled_name') mbl_handled_name_field: AutoComplete2Component;
  @ViewChild('_mbl_frt_status') mbl_frt_status_field: ElementRef;

  @ViewChild('_mbl_pol_etd') mbl_pol_etd_field: DateComponent;
  @ViewChild('_mbl_pod_eta') mbl_pod_eta_field: DateComponent;
  @ViewChild('_mbl_pofd_eta') mbl_pofd_eta_field: DateComponent;
  @ViewChild('_mbl_vessel') mbl_vessel_field: InputBoxComponent;
  @ViewChildren('_cntr_no') cntr_no_field: QueryList<InputBoxComponent>;
  @ViewChildren('_cntr_sealno') cntr_sealno_field: QueryList<InputBoxComponent>;

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

  record: Tbl_cargo_exp_masterm = <Tbl_cargo_exp_masterm>{};

  records: Tbl_cargo_exp_container[] = [];

  hrecords: Tbl_cargo_exp_housem[] = [];

  // 24-05-2019 Created By Joy  

  private pkid: string;
  private menuid: string;

  private mode: string;

  // private errorMessage: string;
  private errorMessage: string[] = [];

  private closeCaption: string = 'Return';

  private title: string;
  private isAdmin: boolean;

  private cmbList = {};
  modal: any;

  is_locked: boolean = false;

  hblid: string;
  hblmode: string;


  constructor(
    private modalconfig: NgbModalConfig,
    private modalservice: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: seaexpMasterService,
  ) {
    modalconfig.backdrop = 'static'; //true/false/static
    modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
  }

  ngOnInit() {
    if (this.route.snapshot.queryParams.parameter == null) {
      this.pkid = this.route.snapshot.queryParams.pkid;
      this.menuid = this.route.snapshot.queryParams.menuid;
      this.mode = this.route.snapshot.queryParams.mode;
    } else {
      const options = JSON.parse(this.route.snapshot.queryParams.parameter);
      this.pkid = options.pkid;
      this.menuid = options.menuid;
      this.mode = options.mode;
    }
    this.closeCaption = 'Return';
    this.initPage();
    this.actionHandler();
  }

  ngAfterViewInit() {
    
    if (!this.gs.isBlank(this.mbl_ref_date_field))
      this.mbl_ref_date_field.Focus();
    
  }
  private initPage() {
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.errorMessage = [];
  }


  NewRecord() {
    this.mode = 'ADD'
    this.actionHandler();
  }

  actionHandler() {
    this.errorMessage = [];
    this.is_locked = false;
    if (this.mode == 'ADD') {
      this.record = <Tbl_cargo_exp_masterm>{};
      this.records = <Tbl_cargo_exp_container[]>[];
      this.hrecords = <Tbl_cargo_exp_housem[]>[];
      this.pkid = this.gs.getGuid();
      this.init();
    }
    if (this.mode == 'EDIT') {
      this.GetRecord();
    }
  }

  init() {
    this.record.mbl_pkid = this.pkid;
    this.record.mbl_cntr_type = '';//FCL
    this.record.rec_created_by = this.gs.user_code;
    this.record.rec_created_date = this.gs.defaultValues.today;
    this.record.mbl_ref_date = this.gs.defaultValues.today;
    this.record.mbl_direct = "N";
    this.record.mbl_direct_bool = false;
    this.record.mbl_shipment_stage = "NIL";
    this.record.mbl_prefix = this.gs.SEA_EXPORT_REFNO_PREFIX;
    this.record.mbl_startingno = this.gs.SEA_EXPORT_REFNO_STARTING_NO;
    this.record.mbl_no = '';
    this.record.mbl_liner_bookingno = '';
    this.record.mbl_sub_houseno = '';
    this.record.mbl_por = '';
    this.record.mbl_vessel = '';
    this.record.mbl_voyage = '';


    this.record.mbl_refno = '';
    this.record.mbl_date = '';
    this.record.mbl_frt_status = '';
    this.record.mbl_ship_term = '';
    this.record.mbl_ship_term_id = '';
    this.record.mbl_liner_id = '';
    this.record.mbl_liner_name = '';
    this.record.mbl_liner_code = '';
    this.record.mbl_agent_id = '';
    this.record.mbl_agent_name = '';
    this.record.mbl_agent_code = '';
    this.record.mbl_pod_id = '';
    this.record.mbl_pod_code = '';
    this.record.mbl_pod_name = '';
    this.record.mbl_pofd_id = '';
    this.record.mbl_pofd_code = '';
    this.record.mbl_pofd_name = '';
    this.record.mbl_pol_id = '';
    this.record.mbl_pol_code = '';
    this.record.mbl_pol_name = '';
    this.record.mbl_country_id = '';
    this.record.mbl_country_name = '';
    this.record.mbl_pol_etd = '';
    this.record.mbl_pod_eta = '';
    this.record.mbl_pofd_eta = '';
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
    //this.record.mbl_is_held 	='';
    this.record.mbl_it_no = '';
    this.record.mbl_it_port = '';
    this.record.mbl_it_date = '';
    if (this.gs.JOB_TYPE_OE.length > 0) {
      this.record.mbl_jobtype_id = this.gs.JOB_TYPE_OE[0].code;
      this.record.mbl_jobtype_name = this.gs.JOB_TYPE_OE[0].name;
    } else {
      this.record.mbl_jobtype_id = '';
      this.record.mbl_jobtype_name = '';
    }
    this.record.mbl_salesman_id = '';
    this.record.mbl_salesman_name = '';
    this.record.mbl_rotation_no = '';
    this.record.mbl_ismemo_attached = '';

    if (this.gs.PARAM_COO_FORMAT_BLANK.length > 0) {
      this.record.mbl_cooformat_id = this.gs.PARAM_COO_FORMAT_BLANK[0].code;
    }
    
    if (!this.gs.isBlank(this.mbl_ref_date_field))
      this.mbl_ref_date_field.Focus();
    
  }

  GetRecord() {

    this.errorMessage = [];
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;

    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.record = <Tbl_cargo_exp_masterm>response.record;
        this.records = <Tbl_cargo_exp_container[]>response.records;
        this.hrecords = <Tbl_cargo_exp_housem[]>response.hrecords;
        if (this.records == null)
          this.records = <Tbl_cargo_exp_container[]>[];
        if (this.hrecords == null)
          this.hrecords = <Tbl_cargo_exp_housem[]>[];
        this.mode = 'EDIT';
        this.record.mbl_direct_bool = this.record.mbl_direct === 'Y' ? true : false;
        this.is_locked = this.gs.IsShipmentClosed("SEA EXPORT", this.record.mbl_ref_date, this.record.mbl_lock, this.record.mbl_unlock_date);
        if (!this.gs.isBlank(this.mbl_ref_date_field))
          this.mbl_ref_date_field.Focus();
      }, error => {
        this.errorMessage.push(this.gs.getError(error));
      });
  }

  CheckData() {
    /*
        if (Lib.IsShipmentClosed("SEA EXPORT", (DateTime)ParentRec.mbl_ref_date, ParentRec.mbl_lock,ParentRec.mbl_unlock_date))
        {
            IsLocked = true;
            LBL_LOCK.Content = "LOCKED";
            CmdSave.IsEnabled = false;
            CmdCopyCntr.IsEnabled = false;
        }
        else
            LBL_LOCK.Content = "UNLOCKED";
    
    */
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
          if (stype == 'BOOKING')
            this.mbl_liner_bookingno_field.focus(); ''
          if (stype == 'MBL')
            this.mbl_no_field.focus();
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
    this.record.mbl_direct = this.record.mbl_direct_bool ? 'Y' : 'N';

    const saveRecord = <vm_tbl_cargo_exp_masterm>{};
    saveRecord.record = this.record;
    saveRecord.cntrs = this.records;
    saveRecord.mode = this.mode;
    saveRecord.userinfo = this.gs.UserInfo;


    this.mainService.Save(saveRecord)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage.push(response.error);
          alert(this.errorMessage[0]);
        }
        else {
          if (this.mode == "ADD" && response.code != '')
            this.record.mbl_refno = response.code;
          this.mode = 'EDIT';
          this.errorMessage.push('Save Complete');
          // alert(this.errorMessage[0]);
        }
      }, error => {
        this.errorMessage.push(this.gs.getError(error));
        alert(this.errorMessage[0]);
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
    if (this.record.mbl_ref_date == "") {
      bRet = false;
      this.errorMessage.push("Ref Date cannot be blank");
    }
    /*
    if (this.record.mbl_jobtype_id == "") {
      bRet = false;
      this.errorMessage = "Job Type cannot be blank";
      return bRet;
    }
    */
    if (this.gs.JOB_TYPE_OE.length > 0 && (this.record.mbl_jobtype_id == "" || this.record.mbl_jobtype_id == undefined)) {
      bRet = false;
      this.errorMessage.push("Job Type cannot be blank");
    }

    if (this.gs.isBlank(this.record.mbl_shipment_stage)) {
      bRet = false;
      this.errorMessage.push("Shipment Stage cannot be blank");
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
    if (this.gs.isBlank(this.record.mbl_pofd_id)) {
      bRet = false;
      this.errorMessage.push("Final Destination cannot be blank");
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

    if (this.record.mbl_cntr_type != "OTHERS") {

      this.records.forEach(Rec => {

        if (Rec.cntr_no.length != 11) {
          bRet = false;
          this.errorMessage.push("cntr No cannot be Blank");
        }
        if (Rec.cntr_type.length <= 0) {
          bRet = false;
          this.errorMessage.push("Container( " + Rec.cntr_no + " ) Type Has to be selected");
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

    var rec = <Tbl_cargo_exp_container>{};
    rec.cntr_pkid = this.gs.getGuid();
    rec.cntr_hblid = this.pkid.toString();
    rec.cntr_catg = "M";
    rec.cntr_no = "";
    rec.cntr_type = "";
    rec.cntr_sealno = '';
    rec.cntr_packages_uom = '';
    rec.cntr_movement = "";
    rec.cntr_weight = 0;
    rec.cntr_tare_weight = 0;
    rec.cntr_pieces = 0;
    rec.cntr_cbm = 0;
    rec.cntr_order = 1;
    this.records.push(rec);
    this.cntr_no_field.changes
      .subscribe((queryChanges) => {
        this.cntr_no_field.last.focus();
      });
  }


  LovSelected(_Record: SearchTable, idx: number = 0) {

    if (_Record.controlname == "AGENT") {
      this.record.mbl_agent_id = _Record.id;
      this.record.mbl_agent_name = _Record.name;
      if (!this.gs.isBlank(this.mbl_liner_name_field))
        this.mbl_liner_name_field.Focus();
    }
    if (_Record.controlname == "CARRIER") {
      this.record.mbl_liner_id = _Record.id;
      this.record.mbl_liner_name = _Record.name;
      if (!this.gs.isBlank(this.mbl_handled_name_field))
        this.mbl_handled_name_field.Focus();
    }
    if (_Record.controlname == "HANDLEDBY") {
      this.record.mbl_handled_id = _Record.id;
      this.record.mbl_handled_name = _Record.name;
      if (!this.gs.isBlank(this.mbl_salesman_name_field))
        this.mbl_salesman_name_field.Focus();
    }
    if (_Record.controlname == "SALESMAN") {
      this.record.mbl_salesman_id = _Record.id;
      this.record.mbl_salesman_name = _Record.name;
      if (!this.gs.isBlank(this.mbl_frt_status_field))
        this.mbl_frt_status_field.nativeElement.focus();
    }
    if (_Record.controlname == "POL") {
      this.record.mbl_pol_id = _Record.id;
      this.record.mbl_pol_name = _Record.name;
      if (!this.gs.isBlank(this.mbl_pol_etd_field))
        this.mbl_pol_etd_field.Focus();
    }

    if (_Record.controlname == "POD") {
      this.record.mbl_pod_id = _Record.id;
      this.record.mbl_pod_name = _Record.name;
      if (!this.gs.isBlank(this.mbl_pod_eta_field))
        this.mbl_pod_eta_field.Focus();
    }

    if (_Record.controlname == "POFD") {
      this.record.mbl_pofd_id = _Record.id;
      this.record.mbl_pofd_name = _Record.name;
      if (!this.gs.isBlank(this.mbl_pofd_eta_field))
        this.mbl_pofd_eta_field.Focus();
    }

    if (_Record.controlname == "COUNTRY") {
      this.record.mbl_country_id = _Record.id;
      this.record.mbl_country_name = _Record.name;
      if (!this.gs.isBlank(this.mbl_vessel_field))
        this.mbl_vessel_field.focus();
    }

    // Container
    if (_Record.controlname == "CONTAINER TYPE") {
      this.records.forEach(rec => {
        if (rec.cntr_pkid == _Record.uid) {
          rec.cntr_type = _Record.code;
          if (idx < this.cntr_sealno_field.toArray().length)
            this.cntr_sealno_field.toArray()[idx].focus();
        }

      });
    }
  }

  onFocusout(field: string) {

    switch (field) {
      case 'mbl_no': {
        break;
      }
      case 'mbl_liner_bookingno': {
        break;
      }
    }
  }

  onBlur(data: { field: string, rec: any }) {
    switch (data.field) {
      case 'mbl_no': {
        this.IsBLDupliation('MBL', this.record.mbl_no);
        break;
      }
      case 'mbl_liner_bookingno': {
        this.IsBLDupliation('BOOKING', this.record.mbl_liner_bookingno);
        break;
      }
      case 'cntr_sealno': {
        break;
      }

    }
  }

  onBlur11(field: string, rec: Tbl_cargo_exp_container) {
    switch (field) {
      case 'mbl_refno': {
        this.record.mbl_refno = this.record.mbl_refno.toUpperCase();
        break;
      }


      case 'mbl_por': {
        this.record.mbl_por = this.record.mbl_por.toUpperCase();
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

    this.hblid = "";
    this.hblmode = "ADD";
    this.BtnNavigation('HOUSE')
  }

  EditHouse(_record: Tbl_cargo_exp_housem) {

    if (!this.gs.canEdit(this.gs.MENU_SE_HOUSE)) {
      alert('Insufficient User Rights')
      return;
    }

    this.hblid = _record.hbl_pkid;
    this.hblmode = "EDIT";
    this.BtnNavigation('HOUSE')
  }


  BtnNavigation(action: string, attachmodal: any = null) {

    switch (action) {

      case 'BOOKING': {
        let prm = {
          menuid: this.gs.MENU_SE_BOOKING,
          pkid: this.pkid,
          origin: 'seaexp-master-page',
          is_locked: this.is_locked
        };
        this.gs.Naviagete('Silver.SeaExport.Trans/BookingPage', JSON.stringify(prm));
        break;
      }

      case 'HOUSE': {
        let prm = {
          menuid: this.gs.MENU_SE_HOUSE,
          parentid: this.pkid,
          pkid: this.hblid,
          refno: this.record.mbl_refno,
          type: 'OE',
          origin: 'seaexp-master-page',
          mode: this.hblmode
        };
        this.gs.Naviagete('Silver.SeaExport.Trans/SeaExpHouseEditPage', JSON.stringify(prm));
        break;
      }

      case 'MBLPAGE': {
        let prm = {
          menuid: this.gs.MENU_SE_MASTER_MBL_INSTRUCTION,
          pkid: this.pkid,
          origin: 'seaexp-master-page',
          is_locked: this.is_locked
        };
        this.gs.Naviagete('Silver.SeaExport.Trans/MBLPage', JSON.stringify(prm));
        break;
      }

      case 'DOCKPAGE': {
        let prm = {
          menuid: this.gs.MENU_SE_MASTER_DOCK_RECEIPT,
          pkid: this.pkid,
          origin: 'seaexp-master-page',
          is_locked: this.is_locked
        };
        this.gs.Naviagete('Silver.SeaExport.Trans/DockPage', JSON.stringify(prm));
        break;
      }

      case 'ARAP': {
        let prm = {
          menuid: this.gs.MENU_SE_MASTER_ARAP,
          mbl_pkid: this.pkid,
          mbl_refno: this.record.mbl_refno,
          mbl_type: 'OE',
          origin: 'seaexp-master-page',
        };
        this.gs.Naviagete('Silver.USAccounts.Trans/InvoicePage', JSON.stringify(prm));
        break;
      }

      case 'PROFITREPORT': {
        let prm = {
          menuid: this.gs.MENU_SE_MASTER_PROFIT_REPORT,
          mbl_pkid: this.pkid,
          mbl_refno: this.record.mbl_refno,
          mbl_type: 'OE',
          origin: 'seaexp-master-page',
        };
        this.gs.Naviagete('Silver.USAccounts.Trans/ProfitReportPage', JSON.stringify(prm));
        break;
      }


      case 'PAYMENT-REQUEST': {
        let prm = {
          menuid: this.gs.MENU_SE_PAYMENT_REQUEST,
          cp_master_id: this.pkid,
          cp_source: 'SEA-MASTER',
          cp_mode: 'SEA EXPORT',
          cp_ref_no: this.record.mbl_refno,
          islocked: false,
          origin: 'seaexp-master-page',
          is_locked: this.is_locked
        };
        this.gs.Naviagete('Silver.BusinessModule/PaymentRequestPage', JSON.stringify(prm));
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
      case 'MESSENGER-SLIP': {
        let prm = {
          menuid: this.gs.MENU_SE_MESSENGER_SLIP,
          mbl_pkid: this.pkid,
          mbl_mode: 'SEA EXPORT',
          mbl_refno: this.record.mbl_refno,
          islocked: false,
          origin: 'seaexp-master-page',
          is_locked: this.is_locked
        };
        this.gs.Naviagete('Silver.Other.Trans/MessengerSlipList', JSON.stringify(prm));
        break;
      }
      case 'FOLLOWUP': {
        let prm = {
          menuid: this.gs.MENU_SE_MASTER,
          master_id: this.pkid,
          master_refno: this.record.mbl_refno,
          master_refdate: this.record.mbl_ref_date,
          islocked: false,
          origin: 'seaexp-master-page',
          is_locked: this.is_locked
        };
        this.gs.Naviagete('Silver.BusinessModule/FollowUpPage', JSON.stringify(prm));
        break;
      }
      case 'REQUEST-APPROVAL': {
        let prm = {
          menuid: this.gs.MENU_SE_MASTER_REQUEST_APPROVAL,
          mbl_pkid: this.pkid,
          mbl_refno: this.record.mbl_refno,
          doc_type: 'SEA EXPORT',
          req_type: 'REQUEST',
          is_locked: this.is_locked,
          origin: 'seaexp-master-page'
        };
        this.gs.Naviagete('Silver.Other.Trans/ApprovedPageList', JSON.stringify(prm));
        break;
      }
      case 'INERNALMEMO': {
        let prm = {
          menuid: this.gs.MENU_SE_MASTER_INTERNAL_MEMO,
          refno: "REF : " + this.record.mbl_refno,
          pkid: this.pkid,
          origin: 'seaexp-master-page',
          oprgrp: 'SEA EXPORT',
          parentType: 'SEAEXP-CNTR',
          paramType: 'CNTR-MOVE-STATUS',
          hideTracking: 'Y',
          is_locked: this.is_locked
        };
        this.gs.Naviagete('Silver.Other.Trans/TrackingPage', JSON.stringify(prm));
        break;
      }
      case 'MANIFEST': {
        this.report_title = 'Ocean Export Manifest';
        this.report_url = '/api/SeaExport/Master/SeaExportManifest';
        this.report_searchdata = this.gs.UserInfo;
        this.report_searchdata.pkid = this.pkid;
        this.report_menuid = this.gs.MENU_SE_MASTER_MANIFEST;
        // this.tab = 'manifest';
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
        this.report_searchdata.MODE = 'SEA EXPORT';
        this.report_searchdata.MBL_PKID = this.pkid;
        this.tab = 'report';
        break;
      } case 'COPY-CNTR': {
        let prm = {
          menuid: this.gs.MENU_SE_MASTER,
          pkid: this.pkid,
          mbl_cntr_type: this.record.mbl_cntr_type,
          origin: 'seaexp-master-page',
          is_locked: this.is_locked
        };
        this.gs.Naviagete('Silver.SeaExport.Trans/CopyCntrPage', JSON.stringify(prm));
        break;
      }
      case 'CERTIFICATE-ORIGIN': {
        let prm = {
          menuid: this.gs.MENU_SE_MASTER_CERTIFICATE_ORIGIN,
          pkid: this.pkid,
          origin: 'seaexp-master-page',
          is_locked: this.is_locked
        };
        this.gs.Naviagete('Silver.SeaExport.Trans/CertOriginPage', JSON.stringify(prm));
        break;
      }

    }
  }

  callbackevent(event: any) {
    this.tab = 'main';
  }

  getManiFestReport1() {
    this.errorMessage = [];
    var SearchData = this.gs.UserInfo;

    SearchData.pkid = this.pkid;

    this.mainService.getManiFestReport(SearchData)
      .subscribe(response => {

        this.Downloadfile(response.filename, response.filetype, response.filedisplayname);

      }, error => {
        this.errorMessage.push(this.gs.getError(error));
      });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.GLOBAL_REPORT_FOLDER, filename, filetype, filedisplayname);
  }

  RemoveRow(_rec: Tbl_cargo_exp_container) {
    this.records.splice(this.records.findIndex(rec => rec.cntr_pkid == _rec.cntr_pkid), 1);
  }

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

  getLink(_mode: string) {
    return "/Silver.SeaExport.Trans/SeaExpMasterEditPage";
  }
  getParam(_record: Tbl_cargo_exp_masterm = null) {
    return {
      appid: this.gs.appid,
      menuid: this.menuid,
      pkid: '',
      type: '',
      origin: 'seaexp-master-page',
      mode: 'ADD'
    };
  }

}
