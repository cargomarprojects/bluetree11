import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/services/global.service';

import { OthGeneralService } from '../../services/oth-general.service';
import { User_Menu } from '../../../core/models/menum';
import { Tbl_cargo_general, Tbl_cargo_container, vm_tbl_cargo_general } from '../../models/tbl_cargo_general';
import { SearchTable } from '../../../shared/models/searchtable';
// import { strictEqual } from 'assert';
// import { forEach } from '@angular/router/src/utils/collection';
// import { TBL_MBL_REPORT } from 'src/app/reports/models/tbl_mbl_report';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateComponent } from '../../../shared/date/date.component';
import { AutoComplete2Component } from '../../../shared/autocomplete2/autocomplete2.component';

@Component({
  selector: 'app-oth-general-edit',
  templateUrl: './oth-general-edit.component.html'
})
export class OthGeneralEditComponent implements OnInit {

  @ViewChild('mbl_no') mbl_no_field: ElementRef;
  @ViewChild('mbl_liner_bookingno') mbl_liner_bookingno_field: ElementRef;
  @ViewChild('_mbl_ref_date') mbl_ref_date_field: DateComponent;
  @ViewChild('_mbl_liner_name') mbl_liner_name_field: AutoComplete2Component;
  @ViewChild('_mbl_handled_name') mbl_handled_name_field: AutoComplete2Component;
  @ViewChild('_mbl_salesman_name') mbl_salesman_name_field: AutoComplete2Component;
  @ViewChild('_mbl_frt_status') mbl_frt_status_field: ElementRef;
  @ViewChild('_mbl_pol_etd') mbl_pol_etd_field: DateComponent;
  @ViewChild('_mbl_pod_eta') mbl_pod_eta_field: DateComponent;
  @ViewChild('_mbl_vessel') mbl_vessel_field: ElementRef;
  @ViewChild('_hbl_shipper_name') hbl_shipper_name_field: ElementRef;
  @ViewChild('_hbl_consignee_name') hbl_consignee_name_field: ElementRef;
  @ViewChildren('_cntr_no') cntr_no_field: QueryList<ElementRef>;
  @ViewChildren('_cntr_sealno') cntr_sealno_field: QueryList<ElementRef>;

  record: Tbl_cargo_general = <Tbl_cargo_general>{};
  records: Tbl_cargo_container[] = [];

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

  private pkid: string;
  private menuid: string;

  private mode: string;
  modal: any;
  // private errorMessage: string;
  private errorMessage: string[] = [];

  private closeCaption: string = 'Return';

  private title: string;
  private isAdmin: boolean;

  private cmbList = {};
  OPERATION_MODE: string = "OTHERS";
  MblStatusList: any[] = [];
  BlStatusList: any[] = [];

  is_locked: boolean = false;

  constructor(
    private modalconfig: NgbModalConfig,
    private modalservice: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: OthGeneralService,
  ) {
    modalconfig.backdrop = 'static'; //true/false/static
    modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
  }

  ngOnInit() {
    if (this.route.snapshot.queryParams.parameter == null) {
      this.pkid = this.route.snapshot.queryParams.pkid;
      this.menuid = this.route.snapshot.queryParams.menuid;
      this.mode = this.route.snapshot.queryParams.mode;
      this.OPERATION_MODE = this.route.snapshot.queryParams.type;
    } else {
      const options = JSON.parse(this.route.snapshot.queryParams.parameter);
      this.pkid = options.pkid;
      this.menuid = options.menuid;
      this.mode = options.mode;
      this.OPERATION_MODE = options.type;
    }
    if (this.gs.isBlank(this.OPERATION_MODE))
      this.OPERATION_MODE = "OTHERS";
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

  ngAfterViewInit() {
    if (!this.gs.isBlank(this.mbl_ref_date_field))
      this.mbl_ref_date_field.Focus();
  }

  LoadCombo() {

    // if (this.gs.company_name == "MOTHERLINES INC USA") {
    //   this.MblStatusList = [{ "name": "NIL" }
    //     , { "name": "OMBL WITH ACCOUNTING" }, { "name": "OMBL SENT TO CARRIER" }
    //     , { "name": "OMBL WITH LAX OFFICE" }, { "name": "OMBL SENT BY LAX OFFICE" }, { "name": "OMBL WITH NYC OFFICE" }
    //     , { "name": "OMBL SENT BY NYC OFFICE" }];
    // } else {
    //   this.MblStatusList = [{ "name": "NIL" }, { "name": "OMBL WITH OPERATION" },
    //   { "name": "OMBL WITH ACCOUNTING" }, { "name": "OMBL SENT TO CARRIER" }];
    // }

    // this.BlStatusList = [{ "name": "NIL" }
    //   , { "name": "PENDING SEAWAY" }, { "name": "SEAWAY BILL" }
    //   , { "name": "PENDING TELEX RELEASED" }, { "name": "TELEX RELEASED" }];
  }

  NewRecord() {
    this.mode = 'ADD'
    this.actionHandler();
  }

  actionHandler() {
    this.errorMessage = [];
    if (this.mode == 'ADD') {
      this.record = <Tbl_cargo_general>{};
      this.records = <Tbl_cargo_container[]>[];
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
    this.record.mbl_cfno = 0;
    this.record.mbl_refno = '';
    this.record.mbl_ref_date = this.gs.defaultValues.today;
    this.record.mbl_frt_status = '';
    this.record.mbl_liner_id = '';
    this.record.mbl_liner_name = '';
    this.record.mbl_liner_code = '';
    this.record.mbl_agent_id = '';
    this.record.mbl_agent_name = '';
    this.record.mbl_agent_code = '';
    this.record.mbl_pod_id = '';
    this.record.mbl_pod_code = '';
    this.record.mbl_pod_name = '';
    this.record.mbl_pol_id = '';
    this.record.mbl_pol_code = '';
    this.record.mbl_pol_name = '';
    this.record.mbl_vessel = '';
    this.record.mbl_voyage = '';
    this.record.mbl_country_id = '';
    this.record.mbl_country_name = '';
    this.record.mbl_handled_id = '';
    this.record.mbl_handled_name = '';
    this.record.rec_created_by = this.gs.user_code;
    this.record.rec_created_date = this.gs.defaultValues.today;
    this.record.mbl_type = '';
    this.record.mbl_place_delivery = '';
    this.record.hbl_pkid = '';
    this.record.hbl_mbl_id = '';
    this.record.hbl_houseno = '';
    this.record.hbl_frt_status = '';
    this.record.hbl_consignee_id = '';
    this.record.hbl_consignee_code = '';
    this.record.hbl_consignee_name = '';
    this.record.hbl_consignee_add1 = '';
    this.record.hbl_consignee_add2 = '';
    this.record.hbl_consignee_add3 = '';
    this.record.hbl_consignee_add4 = '';
    this.record.hbl_consignee_add5 = '';
    this.record.hbl_shipper_id = '';
    this.record.hbl_shipper_code = '';
    this.record.hbl_shipper_name = '';
    this.record.hbl_shipper_add1 = '';
    this.record.hbl_shipper_add2 = '';
    this.record.hbl_shipper_add3 = '';
    this.record.hbl_shipper_add4 = '';
    this.record.hbl_shipper_add5 = '';
    this.record.hbl_commodity = '';
    this.record.hbl_uom = '';
    this.record.hbl_pcs = 0;
    this.record.hbl_packages = 0;
    this.record.hbl_weight = 0;
    this.record.hbl_lbs = 0;
    this.record.hbl_cbm = 0;
    this.record.hbl_cft = 0;
    this.record.hbl_chwt = 0;
    this.record.hbl_chwt_lbs = 0;
    this.record.mbl_lock = '';
    this.record.hbl_isf_no = '';
    this.record.mbl_salesman_id = '';
    this.record.mbl_salesman_name = '';
    this.record.rec_files_attached = '';
    this.record.mbl_shipment_stage = 'NIL';
    this.record.hbl_it_no = '';
    this.record.hbl_it_port = '';
    this.record.mbl_ismemo_attached = '';
    this.record.hbl_is_pl = 'N';
    this.record.hbl_is_ci = 'N';
    this.record.hbl_is_carr_an = 'N';
    this.record.hbl_custom_reles_status = 'NA';
    this.record.hbl_is_delivery = 'NA';

    if (this.OPERATION_MODE.trim() == "EXTRA") {
      this.record.mbl_prefix = this.gs.EXTRA_OPERATION_REFNO_PREFIX;
      this.record.mbl_startingno = this.gs.EXTRA_OPERATION_REFNO_STARTING_NO;
    }
    else {
      this.record.mbl_prefix = this.gs.OTHER_OPERATION_REFNO_PREFIX;
      this.record.mbl_startingno = this.gs.OTHER_OPERATION_REFNO_STARTING_NO;
    }

    // CmdAttachments.Foreground = new SolidColorBrush(Colors.Black);
    // CmdInternalMemo.Foreground = new SolidColorBrush(Colors.Black);

    if (this.gs.JOB_TYPE_OT.length > 0) {
      this.record.mbl_jobtype_id = this.gs.JOB_TYPE_OT[0].code;
      this.record.mbl_jobtype_name = this.gs.JOB_TYPE_OT[0].name;
    } else {
      this.record.mbl_jobtype_id = '';
      this.record.mbl_jobtype_name = '';
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
        this.record = <Tbl_cargo_general>response.record;
        this.record.hbl_is_pl_bool = this.record.hbl_is_pl == "Y" ? true : false;
        this.record.hbl_is_ci_bool = this.record.hbl_is_ci == "Y" ? true : false;
        this.record.hbl_is_carr_an_bool = this.record.hbl_is_carr_an == "Y" ? true : false;
        this.records = <Tbl_cargo_container[]>response.records;
        this.mode = 'EDIT';
        this.is_locked = this.gs.IsShipmentClosed(this.OPERATION_MODE, this.record.mbl_ref_date, this.record.mbl_lock, this.record.mbl_unlock_date);
        if (!this.gs.isBlank(this.mbl_ref_date_field))
          this.mbl_ref_date_field.Focus();
      }, error => {
        this.errorMessage.push(this.gs.getError(error));
        alert(this.errorMessage);
      });
  }

  CheckData() {
    /*
        if (Lib.IsShipmentClosed("SEA EXPORT", (DateTime)ParentRec.mbl_ref_date, ParentRec.mbl_lock,ParentRec.mbl_unlock_date))
        {
            is_locked = true;
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
          alert(this.errorMessage);
          if (stype == 'MBL') {
            if (!this.gs.isBlank(this.mbl_no_field))
              this.mbl_no_field.nativeElement.focus();
          }
        }
      }, error => {
        this.errorMessage.push(this.gs.getError(error));
        alert(this.errorMessage);
      });

  }


  Save() {

    if (!this.Allvalid())
      return;

    this.SaveParent();
    this.SaveContainer();
    this.FindTotTeus();
    const saveRecord = <vm_tbl_cargo_general>{};
    saveRecord.record = this.record;
    saveRecord.cntrs = this.records;
    saveRecord.mode = this.mode;
    saveRecord.userinfo = this.gs.UserInfo;
    saveRecord.operationmode = this.OPERATION_MODE;

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
    if (this.records != null) {
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

        // if (this.record.mbl_cntr_type.toString() == "LCL")
        //   Teu = 0;
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
    }
    this.record.mbl_teu = Tot_Teu;
    this.record.mbl_20 = Tot_20;
    this.record.mbl_40 = Tot_40;
    this.record.mbl_40HQ = Tot_40HQ;
    this.record.mbl_45 = Tot_45;
    //this.record.mbl_cntr_cbm = Tot_Cbm;
    this.record.mbl_container_tot = Cntr_Tot;
    if (sCntrType.length > 100)
      sCntrType = sCntrType.substring(0, 100);

    // this.record.mbl_cntr_desc = sCntrType;
  }
  private SaveParent() {
    if (this.mode == "ADD") {
      this.record.rec_created_id = this.gs.user_pkid;
      this.record.hbl_pkid = this.gs.getGuid();
      this.record.hbl_mbl_id = this.pkid;
    }
    this.record.hbl_is_pl = this.record.hbl_is_pl_bool ? 'Y' : 'N';
    this.record.hbl_is_ci = this.record.hbl_is_ci_bool ? 'Y' : 'N';
    this.record.hbl_is_carr_an = this.record.hbl_is_carr_an_bool ? 'Y' : 'N';
  }
  private SaveContainer() {
    if (this.records == null) {
      this.records = <Tbl_cargo_container[]>[];
      return;
    }
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
    if (this.gs.isBlank(this.record.mbl_ref_date)) {
      bRet = false;
      this.errorMessage.push("Ref Date cannot be blank");
    }
    if (this.gs.JOB_TYPE_OT.length > 0 && this.gs.isBlank(this.record.mbl_jobtype_id)) {
      bRet = false;
      this.errorMessage.push("Job Type cannot be blank");
    }
    if (this.gs.isBlank(this.record.mbl_shipment_stage)) {
      bRet = false;
      this.errorMessage.push("Shipment Stage cannot be blank");
    }

    if (this.gs.isBlank(this.record.mbl_handled_id)) {
      bRet = false;
      this.errorMessage.push("A/N Handled By cannot be blank");
    }

    let cntrList: string = "";
    if (this.records != null) {
      this.records.forEach(Rec => {
        if (cntrList.indexOf(Rec.cntr_no.trim()) < 0)
          cntrList += Rec.cntr_no.trim() + ",";
        else {
          bRet = false;
          this.errorMessage.push("Container( " + Rec.cntr_no + " ) Duplication in Container List");
        }

        if (Rec.cntr_no.length != 11) {
          bRet = false;
          this.errorMessage.push("Container( " + Rec.cntr_no + " ) Invalid");
        }
        if (Rec.cntr_type.length <= 0) {
          bRet = false;
          this.errorMessage.push("Container( " + Rec.cntr_no + " ) type has to be selected");
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
    if (this.records == null)
      this.records = <Tbl_cargo_container[]>[];

    var rec = <Tbl_cargo_container>{};
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
    //  rec.cntr_tare_weight = 0;
    rec.cntr_cbm = 0;
    // rec.cntr_pick_date = '';
    // rec.cntr_return_date = '';
    rec.cntr_weight_uom = '';
    rec.cntr_order = 1;
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
    }

    if (_Record.controlname == "COUNTRY") {
      this.record.mbl_country_id = _Record.id;
      this.record.mbl_country_name = _Record.name;
      if (!this.gs.isBlank(this.mbl_vessel_field))
        this.mbl_vessel_field.nativeElement.focus();
    }

    if (_Record.controlname == "SHIPPER") {

      this.record.hbl_shipper_id = _Record.id;
      this.record.hbl_shipper_code = _Record.code;
      this.record.hbl_shipper_name = _Record.name;
      if (_Record.col8 != "")
        this.record.hbl_shipper_name = _Record.col8;

      this.record.hbl_shipper_add1 = _Record.col1;
      this.record.hbl_shipper_add2 = _Record.col2;
      this.record.hbl_shipper_add3 = _Record.col3;
      this.record.hbl_shipper_add4 = this.gs.GetTelFax(_Record.col6.toString(), _Record.col7.toString());
      if (_Record.col9 == "Y") {

        // MsgAlertBox mPage = new MsgAlertBox();
        // mPage.PKID = Txt_Shipper_Code.PKID;
        // mPage.SOURCE = "ACCOUNTING-ALERT";
        // mPage.parentpage += delegate(object sender2, string objectName2)
        // {
        //     Dispatcher.BeginInvoke(() => { Txt_Shipper_Name.Focus(); });
        // };
        // mPage.Show();
      }
      if (!this.gs.isBlank(this.hbl_shipper_name_field))
        this.hbl_shipper_name_field.nativeElement.focus();
    }

    if (_Record.controlname == "CONSIGNEE") {
      this.record.hbl_consignee_id = _Record.id;
      this.record.hbl_consignee_code = _Record.code;
      this.record.hbl_consignee_name = _Record.name;
      if (_Record.col8 != "")
        this.record.hbl_consignee_name = _Record.col8;

      this.record.hbl_consignee_add1 = _Record.col1;
      this.record.hbl_consignee_add2 = _Record.col2;
      this.record.hbl_consignee_add3 = this.gs.GetAttention(_Record.col5);
      this.record.hbl_consignee_add4 = this.gs.GetTelFax(_Record.col6.toString(), _Record.col7.toString());
      if (_Record.col9 == "Y") {
        // MsgAlertBox mPage = new MsgAlertBox();
        // mPage.PKID = Txt_Shipper_Code.PKID;
        // mPage.SOURCE = "ACCOUNTING-ALERT";
        // mPage.parentpage += delegate(object sender2, string objectName2)
        // {
        //     Dispatcher.BeginInvoke(() => { Txt_Shipper_Name.Focus(); });
        // };
        // mPage.Show();
      }
      if (!this.gs.isBlank(this.hbl_consignee_name_field))
        this.hbl_consignee_name_field.nativeElement.focus();
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


  onBlur(field: string, rec: Tbl_cargo_container = null) {
    switch (field) {
      case 'mbl_refno': {
        this.record.mbl_refno = this.record.mbl_refno.toUpperCase();
        break;
      }
      case 'mbl_no': {
        this.record.mbl_no = this.record.mbl_no.toUpperCase();
        break;
      }

      case 'hbl_houseno': {
        this.record.hbl_houseno = this.record.hbl_houseno.toUpperCase();
        break;
      }
      case 'hbl_shipper_name': {
        this.record.hbl_shipper_name = this.record.hbl_shipper_name.toUpperCase();
        break;
      }

      case 'hbl_shipper_add1': {
        this.record.hbl_shipper_add1 = this.record.hbl_shipper_add1.toUpperCase();
        break;
      }
      case 'hbl_shipper_add2': {
        this.record.hbl_shipper_add2 = this.record.hbl_shipper_add2.toUpperCase();
        break;
      }
      case 'hbl_shipper_add3': {
        this.record.hbl_shipper_add3 = this.record.hbl_shipper_add3.toUpperCase();
        break;
      }
      case 'hbl_shipper_add4': {
        this.record.hbl_shipper_add4 = this.record.hbl_shipper_add4.toUpperCase();
        break;
      }

      case 'hbl_consignee_name': {
        this.record.hbl_consignee_name = this.record.hbl_consignee_name.toUpperCase();
        break;
      }

      case 'hbl_consignee_add1': {
        this.record.hbl_consignee_add1 = this.record.hbl_consignee_add1.toUpperCase();
        break;
      }
      case 'hbl_consignee_add2': {
        this.record.hbl_consignee_add2 = this.record.hbl_consignee_add2.toUpperCase();
        break;
      }
      case 'hbl_consignee_add3': {
        this.record.hbl_consignee_add3 = this.record.hbl_consignee_add3.toUpperCase();
        break;
      }
      case 'hbl_consignee_add4': {
        this.record.hbl_consignee_add4 = this.record.hbl_consignee_add4.toUpperCase();
        break;
      }
      case 'hbl_commodity': {
        this.record.hbl_commodity = this.record.hbl_commodity.toUpperCase();
        break;
      }
      case 'hbl_isf_no': {
        this.record.hbl_isf_no = this.record.hbl_isf_no.toUpperCase();
        break;
      }

      case 'hbl_packages': {
        this.record.hbl_packages = this.gs.roundNumber(this.record.hbl_packages, 0);
        break;
      }

      case 'hbl_weight': {
        this.record.hbl_weight = this.gs.roundNumber(this.record.hbl_weight, 3);
        break;
      }
      case 'hbl_lbs': {
        this.record.hbl_lbs = this.gs.roundNumber(this.record.hbl_lbs, 3);
        break;
      }
      case 'hbl_cbm': {
        this.record.hbl_cbm = this.gs.roundNumber(this.record.hbl_cbm, 3);
        break;
      }
      case 'hbl_cft': {
        this.record.hbl_cft = this.gs.roundNumber(this.record.hbl_cft, 3);
        break;
      }
      case 'hbl_chwt': {
        this.record.hbl_chwt = this.gs.roundNumber(this.record.hbl_chwt, 3);
        break;
      }
      case 'hbl_chwt_lbs': {
        this.record.hbl_chwt_lbs = this.gs.roundNumber(this.record.hbl_chwt_lbs, 3);
        break;
      }

      case 'hbl_it_no': {
        this.record.hbl_it_no = this.record.hbl_it_no.toUpperCase();
        break;
      }
      case 'hbl_it_port': {
        this.record.hbl_it_port = this.record.hbl_it_port.toUpperCase();
        break;
      }

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
      //   case 'cntr_tare_weight': {
      //     rec.cntr_tare_weight = this.gs.roundNumber(rec.cntr_tare_weight, 0);
      //     break;
      //   }
    }
  }

  FindWeight(_type: string) {
    if (_type == "Kgs2Lbs")
      this.record.hbl_lbs = this.gs.Convert_Weight("KG2LBS", this.record.hbl_weight, 3);
    else if (_type == "Lbs2Kgs")
      this.record.hbl_weight = this.gs.Convert_Weight("LBS2KG", this.record.hbl_lbs, 3);
    else if (_type == "Cbm2Cft")
      this.record.hbl_cft = this.gs.Convert_Weight("CBM2CFT", this.record.hbl_cbm, 3);
    else if (_type == "Cft2Cbm")
      this.record.hbl_cbm = this.gs.Convert_Weight("CFT2CBM", this.record.hbl_cft, 3);
    else if (_type == "Chwt2Lbs")
      this.record.hbl_chwt_lbs = this.gs.Convert_Weight("KG2LBS", this.record.hbl_chwt, 3);
    else if (_type == "Lbs2Chwt")
      this.record.hbl_chwt = this.gs.Convert_Weight("LBS2KG", this.record.hbl_chwt_lbs, 3);
  }

  BtnNavigation(action: string, attachmodal: any = null) {

    switch (action) {
      case 'DELIVERY-ORDER': {
        let prm = {
          menuid: this.gs.MENU_OT_OPERATION_DELIVERY_ORDER,
          parentid: this.pkid,
          pickCategory: 'OTHERS',
          is_locked: this.is_locked,
          origin: 'other-general-page'
        };
        this.gs.Naviagete('Silver.Other.Trans/DeliveryOrderList', JSON.stringify(prm));
        break;
      }

      case 'ARAP': {
        let prm = {
          menuid: this.gs.MENU_OT_OPERATION_ARAP,
          mbl_pkid: this.pkid,
          mbl_refno: this.record.mbl_refno,
          mbl_type: 'OT',
          origin: 'other-general-page',
        };
        this.gs.Naviagete('Silver.USAccounts.Trans/InvoicePage', JSON.stringify(prm));
        break;
      }
      case 'PROFITREPORT': {
        let prm = {
          menuid: this.gs.MENU_OT_OPERATION_PROFIT_REPORT,
          mbl_pkid: this.pkid,
          mbl_refno: this.record.mbl_refno,
          mbl_type: 'OT',
          origin: 'other-general-page',
        };
        this.gs.Naviagete('Silver.USAccounts.Trans/ProfitReportPage', JSON.stringify(prm));
        break;
      }
      case 'PAYMENT-REQUEST': {
        let prm = {
          menuid: this.gs.MENU_OT_PAYMENT_REQUEST,
          cp_master_id: this.pkid,
          cp_source: 'OTHER OPERATION',
          cp_mode: 'OTHERS',
          cp_ref_no: this.record.mbl_refno,
          is_locked: this.is_locked,
          origin: 'other-general-page'
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
          menuid: this.gs.MENU_OT_MESSENGER_SLIP,
          mbl_pkid: this.pkid,
          mbl_mode: 'OTHERS',
          mbl_refno: this.record.mbl_refno,
          is_locked: this.is_locked,
          origin: 'other-general-page'
        };
        this.gs.Naviagete('Silver.Other.Trans/MessengerSlipList', JSON.stringify(prm));
        break;
      }
      case 'FOLLOWUP': {
        let prm = {
          menuid: this.gs.MENU_OT_OPERATION,
          master_id: this.pkid,
          master_refno: this.record.mbl_refno,
          master_refdate: this.record.mbl_ref_date,
          is_locked: this.is_locked,
          origin: 'other-general-page'
        };
        this.gs.Naviagete('Silver.BusinessModule/FollowUpPage', JSON.stringify(prm));
        break;
      }
      case 'REQUEST-APPROVAL': {
        let prm = {
          menuid: this.gs.MENU_OT_MASTER_REQUEST_APPROVAL,
          mbl_pkid: this.pkid,
          mbl_refno: this.record.mbl_refno,
          doc_type: 'OTHERS',
          req_type: 'REQUEST',
          is_locked: this.is_locked,
          origin: 'other-general-page'
        };
        this.gs.Naviagete('Silver.Other.Trans/ApprovedPageList', JSON.stringify(prm));
        break;
      }
      case 'INERNALMEMO': {
        let prm = {
          menuid: this.gs.MENU_OT_MASTER_INTERNAL_MEMO,
          refno: "REF : " + this.record.mbl_refno,
          pkid: this.pkid,
          origin: 'other-general-page',
          oprgrp: 'OTHERS',
          parentType: 'OTH-CNTR',
          paramType: 'OTH-CNTR-MOVE-STATUS',
          is_locked: this.is_locked,
          hideTracking: 'Y'
        };
        this.gs.Naviagete('Silver.Other.Trans/TrackingPage', JSON.stringify(prm));
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
        this.report_searchdata.MODE = 'OTHERS';
        this.report_searchdata.MBL_PKID = this.pkid;
        this.tab = 'report';
        break;
      }

    }
  }
  callbackevent(event: any) {
    this.tab = 'main';
  }

  RemoveRow(_rec: Tbl_cargo_container) {
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
}
