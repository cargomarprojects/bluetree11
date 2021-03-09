import { Component, OnInit, ViewChild, ElementRef, ANALYZE_FOR_ENTRY_COMPONENTS, ViewChildren, QueryList } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { InputBoxComponent } from '../../../shared/input/inputbox.component';
import { InputBoxNumberComponent } from '../../../shared/inputnumber/inputboxnumber.component';

import { GlobalService } from '../../../core/services/global.service';
import { User_Menu } from '../../../core/models/menum';
import { SearchTable } from '../../../shared/models/searchtable';

import { HouseService } from '../../services/house.service';

import { Tbl_cargo_exp_housem, vm_Tbl_cargo_exp_housem } from '../../models/Tbl_cargo_exp_housem';
import { Tbl_cargo_exp_desc } from '../../models/Tbl_cargo_exp_desc';
import { Tbl_cargo_exp_container } from '../../models/tbl_cargo_exp_masterm';
import { AutoComplete2Component } from '../../../shared/autocomplete2/autocomplete2.component';

@Component({
  selector: 'app-housepage',
  templateUrl: './housepage.component.html'
})
export class HousePageComponent implements OnInit {


  pkid: string;
  menuid: string;
  mode: string = "ADD";

  iStartNo: number = 0;
  iStep: number = 0;

  errorMessage: string[] = [];

  title: string;
  isAdmin: boolean;
  tab: string = 'main';
  report_title: string = '';
  report_url: string = '';
  report_searchdata: any = {};
  report_menuid: string = '';
  cntr_seal_hrzprint: boolean = true;
  bl_backside: boolean = false;
  bl_colour: boolean = true;
  record: Tbl_cargo_exp_housem = <Tbl_cargo_exp_housem>{};
  records: Tbl_cargo_exp_desc[] = [];

  recorddet: Tbl_cargo_exp_desc[] = [];

  cntrs: Tbl_cargo_exp_container[] = [];

  ShipmentType: string = '';
  @ViewChild('_btnret') btnret_ctrl: ElementRef;
  @ViewChild('_hbl_shipper_code') hbl_shipper_code_ctrl: AutoComplete2Component;
  @ViewChild('_hbl_shipper_name') hbl_shipper_name_ctrl: InputBoxComponent;
  @ViewChild('hbl_shipment_stage') hbl_shipment_stage_field: ElementRef;
  @ViewChild('_hbl_consigned_to1') hbl_consigned_to1_ctrl: InputBoxComponent;
  @ViewChild('_hbl_notify_name') hbl_notify_name_ctrl: InputBoxComponent;
  @ViewChild('_hbl_origin') hbl_origin_ctrl: InputBoxComponent;
  @ViewChild('_hbl_salesman_name') hbl_salesman_name_ctrl: AutoComplete2Component;
  @ViewChild('_hbl_goods_nature') hbl_goods_nature_ctrl: InputBoxComponent;
  @ViewChildren('_cntr_no') cntr_no_field: QueryList<InputBoxComponent>;
  @ViewChildren('_cntr_sealno') cntr_sealno_field: QueryList<InputBoxComponent>;


  DESC_TYPE: string = "SE-DESC";

  canSave: boolean = false;
  canPrintBlank: boolean = false;
  canPrintDraft: boolean = false;
  canPrintBL: boolean = false;

  is_locked: boolean = false;
  is_stage_locked = false;

  parentid: string;
  mbl_refno: string;
  type: string;

  refno: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: HouseService,
  ) { }


  ngOnInit() {
    if (this.route.snapshot.queryParams.parameter == null) {
      this.pkid = this.route.snapshot.queryParams.pkid;
      this.menuid = this.route.snapshot.queryParams.menuid;
      this.parentid = this.route.snapshot.queryParams.parentid;
      this.mbl_refno = this.route.snapshot.queryParams.refno;
      this.type = this.route.snapshot.queryParams.type;
      this.mode = this.route.snapshot.queryParams.mode;
    } else {
      const options = JSON.parse(this.route.snapshot.queryParams.parameter);
      this.pkid = options.pkid;
      this.menuid = options.menuid;
      this.parentid = options.parentid;
      this.mbl_refno = options.refno;
      this.type = options.type;
      this.mode = options.mode;
    }
    this.initPage();
    this.actionHandler();
  }

  initPage() {

    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.canSave = this.gs.canSave(this.menuid, this.mode);
    this.canPrintBL = this.gs.screenExists(this.gs.MENU_SE_HOUSE_PRINT_HBL);
    this.canPrintBlank = this.gs.screenExists(this.gs.MENU_SE_HOUSE_HBL_LASER);
    this.canPrintDraft = this.gs.screenExists(this.gs.MENU_SE_HOUSE_PRINT_HBL);

    this.errorMessage = [];

  }

  actionHandler() {

    this.errorMessage = [];
    this.InitDesc();

    this.is_stage_locked = false;
    this.is_locked = false;

    if (this.mode == 'ADD') {
      this.record = <Tbl_cargo_exp_housem>{};
      this.cntrs = <Tbl_cargo_exp_container[]>[];
      this.records = <Tbl_cargo_exp_desc[]>[];
      this.pkid = this.gs.getGuid();
      this.record.hbl_pkid = this.pkid;
      this.InitDesc();
      this.LoadData();
    }
    if (this.mode == 'EDIT')
      this.GetRecord();

  }

  LoadData() {
    this.record.hbl_is_cntrized = "N";
    this.record._hbl_is_cntrized = false;

    this.record.hbl_is_arranged = "Y";
    this.record._hbl_is_arranged = true;

    this.record.hbl_print_kgs = "Y";
    this.record._hbl_print_kgs = true;

    this.record.hbl_print_lbs = "N";
    this.record._hbl_print_lbs = false;

    this.record.hbl_charges1 = ""; this.record.hbl_charges2 = ""; this.record.hbl_charges3 = ""; this.record.hbl_charges4 = ""; this.record.hbl_charges5 = "";
    this.record.hbl_pp1 = ""; this.record.hbl_pp2 = ""; this.record.hbl_pp3 = ""; this.record.hbl_pp4 = ""; this.record.hbl_pp5 = "";
    this.record.hbl_cc1 = ""; this.record.hbl_cc2 = ""; this.record.hbl_cc3 = ""; this.record.hbl_cc4 = ""; this.record.hbl_cc5 = "";

    if (this.mode == "ADD") {
      this.record.hbl_mbl_id = this.parentid;
      this.record.rec_created_id = this.gs.user_pkid;
      this.record.hbl_frt_status = "";
      this.record.hbl_obl_telex = "N/A";
      this.record.hbl_bltype = "";
      this.record.rec_created_by = this.gs.user_code;
      this.record.rec_created_date = this.gs.defaultValues.today;
      this.record.hbl_notify_name = "SAME AS CONSIGNEE";
      this.record.hbl_shipment_stage = "NIL";
      this.record.hbl_is_arranged = 'Y';
      this.record._hbl_is_arranged = true;
      this.record.hbl_print_kgs = 'Y';
      this.record._hbl_print_kgs = true;
      if (this.parentid != "")
        this.LoadDefaultData();
      else {
        if (!this.gs.isBlank(this.hbl_shipper_code_ctrl))
          this.hbl_shipper_code_ctrl.Focus();
      }

      if (this.gs.PARAM_HBL_FORMAT_BLANK.length > 0) {
        this.record.hbl_format_id = this.gs.PARAM_HBL_FORMAT_BLANK[0].code;
        /*
        if (this.gs.DEFAULT_HBL_FORMAT.length > 0)
          this.record.hbl_format_id = this.gs.DEFAULT_HBL_FORMAT;
        */
      }
      if (this.gs.PARAM_HBL_FORMAT_DRAFT.length > 0) {
        this.record.hbl_draft_format_id = this.gs.PARAM_HBL_FORMAT_DRAFT[0].code;
        /*
        if (this.gs.DEFAULT_HBL_DRAFTFORMAT.length > 0)
          this.record.hbl_draft_format_id = this.gs.DEFAULT_HBL_DRAFTFORMAT;
        */
      }
    }

  }

  LoadDefaultData() {

    this.errorMessage = [];
    let SearchData = {
      pkid: this.parentid
    }
    this.mainService.GetHouseDefaultRecord(SearchData).subscribe(
      response => {
        var rec = response.record;

        this.record.mbl_refno = rec.mbl_refno;
        this.record.hbl_agent_id = rec.mbl_agent_id;
        this.record.hbl_agent_code = rec.mbl_agent_code;
        this.record.hbl_agent_name = rec.mbl_agent_name;
        this.record.hbl_pol_name = rec.mbl_pol_name;
        this.record.hbl_pod_name = rec.mbl_pod_name;
        this.record.hbl_pofd_id = rec.mbl_pofd_id;
        this.record.hbl_pofd_code = rec.mbl_pofd_code;
        this.record.hbl_pofd_name = rec.mbl_pofd_name;
        this.record.hbl_pofd_eta = rec.mbl_pofd_eta;

        this.record.mbl_no = rec.mbl_no;
        this.record.hbl_vessel = rec.mbl_vessel;
        this.record.hbl_voyage = rec.mbl_voyage;
        this.record.hbl_handled_id = rec.mbl_handled_id;
        this.record.hbl_handled_name = rec.mbl_handled_name;
        this.record.hbl_by1 = rec.mbl_handled_name;



        this.record.hbl_is_cntrized = (rec.mbl_cntr_type != "OTHERS") ? "Y" : "N";
        this.record._hbl_is_cntrized = (rec.mbl_cntr_type != "OTHERS") ? true : false;

        this.record.hbl_issued_date = rec.mbl_pol_etd;
        this.record.hbl_salesman_id = rec.mbl_salesman_id;
        this.record.hbl_salesman_name = rec.mbl_salesman_name;

        this.record.hbl_shipment_stage = rec.mbl_shipment_stage;
        if (rec.mbl_cntr_type == "FCL" || rec.mbl_cntr_type == "LCL") {
          this.record.hbl_shipment_stage = rec.mbl_shipment_stage;
          this.is_stage_locked = true;
        }
        if (rec.mbl_cntr_type == "FCL") {
          this.record.desc1 = "SHIPPERS'S LOAD, COUNT, AND SEALED";
          this.record.desc2 = "SAID TO CONTAIN";
        }
        else if (rec.mbl_cntr_type == "LCL" || rec.mbl_cntr_type == "CONSOLE") {
          this.record.desc1 = "SAID TO CONTAIN";
        }


        this.ShipmentType = rec.mbl_cntr_type;
        this.record.mbl_cntr_type = this.ShipmentType;
        this.is_locked = this.gs.IsShipmentClosed("SEA EXPORT", rec.mbl_ref_date, rec.mbl_lock, rec.mbl_unlock_date);

        this.cntrs = <Tbl_cargo_exp_container[]>response.cntrs;

        this.cntrs.forEach(rec => {
          rec.cntr_pkid = this.gs.getGuid();
        });


        if (!this.gs.isBlank(this.hbl_shipper_code_ctrl))
          this.hbl_shipper_code_ctrl.Focus();
      },
      error => {
        this.errorMessage.push(this.gs.getError(error));
        alert(this.errorMessage[0]);
      }
    );



  }

  GetRecord() {

    this.errorMessage = [];
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;
    SearchData.desc_type = this.DESC_TYPE;
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {

        this.record = <Tbl_cargo_exp_housem>response.record;
        this.cntrs = <Tbl_cargo_exp_container[]>response.cntrs;
        this.records = <Tbl_cargo_exp_desc[]>response.records;
        if (this.cntrs == null)
          this.cntrs = <Tbl_cargo_exp_container[]>[];
        if (this.records == null)
          this.records = <Tbl_cargo_exp_desc[]>[];

        this.ShipmentType = this.record.mbl_cntr_type;

        if (this.ShipmentType == "FCL" || this.ShipmentType == "LCL")
          this.is_stage_locked = true;

        this.is_locked = this.gs.IsShipmentClosed("SEA EXPORT", this.record.mbl_ref_date, this.record.mbl_lock, this.record.mbl_unlock_date);

        this.InitDesc();
        if (this.records != null) {
          this.records.forEach(rec => {
            this.ShowDesc(rec);
          });
        }

        this.record._hbl_is_cntrized = (this.record.hbl_is_cntrized == "Y") ? true : false;
        this.record._hbl_is_arranged = (this.record.hbl_is_arranged == "Y") ? true : false;
        this.record._hbl_print_kgs = (this.record.hbl_print_kgs == "Y") ? true : false;
        this.record._hbl_print_lbs = (this.record.hbl_print_lbs == "Y") ? true : false;

        // if (!this.gs.isBlank(this.hbl_shipper_code_ctrl))
        //   this.hbl_shipper_code_ctrl.Focus();
        if (!this.gs.isBlank(this.btnret_ctrl))
          this.btnret_ctrl.nativeElement.focus();


      }, error => {
        this.errorMessage.push(this.gs.getError(error));

      });
  }


  LoadMBL() {
    this.LoadMBLWeight();
    this.LoadMBLDesc();
  }


  LoadMBLWeight() {

    this.errorMessage = [];

    let SearchData = {
      pkid: this.parentid,
    }
    this.mainService.GetMblWeight(SearchData).subscribe(response => {
      if (response.record) {
        this.record.hbl_weight = response.record.mbld_weight;
        this.record.hbl_lbs = response.record.mbld_lbs;
        this.record.hbl_cbm = response.record.mbld_cbm;
        this.record.hbl_cft = response.record.mbld_cft;
      }
    }, error => {
      this.errorMessage.push(this.gs.getError(error));
      alert(this.errorMessage[0]);
    });


  }


  LoadMBLDesc() {

    this.errorMessage = [];

    let SearchData = {
      pkid: this.parentid,
      desc_type: 'MBLDESC',
    }
    this.mainService.GetDesc(SearchData).subscribe(response => {

      if (response.records != null) {
        this.InitDesc();
        response.records.forEach(rec => {
          this.ShowDesc(rec);
        });
      }


    }, error => {
      this.errorMessage.push(this.gs.getError(error));
      alert(this.errorMessage[0]);
    });


  }



  LoadContainer() {
    this.errorMessage = [];
    let SearchData = {
      pkid: this.pkid,
    }
    this.mainService.GetContainer(SearchData).subscribe(response => {
      this.cntrs = response.records;
      this.showContainer();
    }, error => {
      this.errorMessage.push(this.gs.getError(error));
      alert(this.errorMessage[0]);
    });
  }

  GetCntrInfo(CntrNo: string, CntrSealNo: string) {
    if (CntrSealNo.length > 0)
      CntrNo += "/ " + CntrSealNo;
    return CntrNo;
  }

  showContainer() {
    this.record.mark6 = "CONTAINER NO./ SEAL NO.";
    if (this.cntrs.length > 0)
      this.record.mark7 = this.GetCntrInfo(this.cntrs[0].cntr_no, this.cntrs[0].cntr_sealno);
    if (this.cntrs.length > 1)
      this.record.mark8 = this.GetCntrInfo(this.cntrs[1].cntr_no, this.cntrs[1].cntr_sealno);
    if (this.cntrs.length > 2)
      this.record.mark9 = this.GetCntrInfo(this.cntrs[2].cntr_no, this.cntrs[2].cntr_sealno);
    if (this.cntrs.length > 3)
      this.record.mark10 = this.GetCntrInfo(this.cntrs[10].cntr_no, this.cntrs[10].cntr_sealno);
    if (this.cntrs.length > 4)
      this.record.mark11 = this.GetCntrInfo(this.cntrs[11].cntr_no, this.cntrs[11].cntr_sealno);
    if (this.cntrs.length > 5)
      this.record.mark12 = this.GetCntrInfo(this.cntrs[12].cntr_no, this.cntrs[12].cntr_sealno);
    if (this.cntrs.length > 6)
      this.record.mark13 = this.GetCntrInfo(this.cntrs[13].cntr_no, this.cntrs[13].cntr_sealno);
    if (this.cntrs.length > 7)
      this.record.mark14 = this.GetCntrInfo(this.cntrs[14].cntr_no, this.cntrs[14].cntr_sealno);
    if (this.cntrs.length > 8)
      this.record.mark15 = this.GetCntrInfo(this.cntrs[15].cntr_no, this.cntrs[15].cntr_sealno);
    if (this.cntrs.length > 9)
      this.record.mark16 = this.GetCntrInfo(this.cntrs[16].cntr_no, this.cntrs[16].cntr_sealno);
    if (this.cntrs.length > 10)
      this.record.mark17 = this.GetCntrInfo(this.cntrs[17].cntr_no, this.cntrs[17].cntr_sealno);
  }

  ShowDesc(Rec: Tbl_cargo_exp_desc) {
    if (Rec.cargo_ctr == 1) {
      this.record.mark1 = Rec.cargo_marks; this.record.pkg1 = Rec.cargo_packages; this.record.desc1 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 2) {
      this.record.mark2 = Rec.cargo_marks; this.record.pkg2 = Rec.cargo_packages; this.record.desc2 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 3) {
      this.record.mark3 = Rec.cargo_marks; this.record.pkg3 = Rec.cargo_packages; this.record.desc3 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 4) {
      this.record.mark4 = Rec.cargo_marks; this.record.desc4 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 5) {
      this.record.mark5 = Rec.cargo_marks; this.record.desc5 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 6) {
      this.record.mark6 = Rec.cargo_marks; this.record.desc6 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 7) {
      this.record.mark7 = Rec.cargo_marks; this.record.desc7 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 8) {
      this.record.mark8 = Rec.cargo_marks; this.record.desc8 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 9) {
      this.record.mark9 = Rec.cargo_marks; this.record.desc9 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 10) {
      this.record.mark10 = Rec.cargo_marks; this.record.desc10 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 11) {
      this.record.mark11 = Rec.cargo_marks; this.record.desc11 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 12) {
      this.record.mark12 = Rec.cargo_marks; this.record.desc12 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 13) {
      this.record.mark13 = Rec.cargo_marks; this.record.desc13 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 14) {
      this.record.mark14 = Rec.cargo_marks; this.record.desc14 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 15) {
      this.record.mark15 = Rec.cargo_marks; this.record.desc15 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 16) {
      this.record.mark16 = Rec.cargo_marks; this.record.desc16 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 17) {
      this.record.mark17 = Rec.cargo_marks; this.record.desc17 = Rec.cargo_description;
    }
  }

  InitDesc() {
    this.record.mark1 = ""; this.record.pkg1 = ""; this.record.desc1 = "";
    this.record.mark2 = ""; this.record.pkg2 = ""; this.record.desc2 = "";
    this.record.mark3 = ""; this.record.pkg3 = ""; this.record.desc3 = "";
    this.record.mark4 = ""; this.record.desc4 = "";
    this.record.mark5 = ""; this.record.desc5 = "";
    this.record.mark6 = ""; this.record.desc6 = "";
    this.record.mark7 = ""; this.record.desc7 = "";
    this.record.mark8 = ""; this.record.desc8 = "";
    this.record.mark9 = ""; this.record.desc9 = "";
    this.record.mark10 = ""; this.record.desc10 = "";
    this.record.mark11 = ""; this.record.desc11 = "";
    this.record.mark12 = ""; this.record.desc12 = "";
    this.record.mark13 = ""; this.record.desc13 = "";
    this.record.mark14 = ""; this.record.desc14 = "";
    this.record.mark15 = ""; this.record.desc15 = "";
    this.record.mark16 = ""; this.record.desc16 = "";
    this.record.mark17 = ""; this.record.desc17 = "";

  }



  Allvalid() {
    let bret = true;

    if (this.gs.isBlank(this.parentid)) {
      this.errorMessage.push("Invalid MBL ID");
      bret = false;
    }

    this.iStartNo = +this.gs.SEA_EXPORT_HOUSE_STARTING_NO;
    this.iStep = +this.gs.SEA_EXPORT_HOUSE_INCR_BY;

    if (this.iStartNo <= 0 || this.iStep <= 0) {
      this.errorMessage.push("Invalid HBL Starting/Increment No");
      bret = false;
    }

    if (!this.hbl_shipment_stage_field.nativeElement.disabled) {
      if (this.gs.isBlank(this.record.hbl_shipment_stage)) {
        this.errorMessage.push("Shipment Stage cannot be blank");
        bret = false;
      }
    }


    if (this.gs.isBlank(this.record.hbl_shipper_id) || this.gs.isBlank(this.record.hbl_shipper_code)) {
      this.errorMessage.push("Shipper Code cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.hbl_shipper_name)) {
      this.errorMessage.push("Shipper Name cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.hbl_shipper_add1)) {
      this.errorMessage.push("Shipper Address1 cannot be blank");
      bret = false;
    }


    if (this.gs.isBlank(this.record.hbl_consignee_id) || this.gs.isBlank(this.record.hbl_consignee_code)) {
      this.errorMessage.push("Consignee Code cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.hbl_consigned_to1)) {
      this.errorMessage.push("Consignee Name cannot be blank");
      bret = false;
    }

    if (!this.gs.isBlank(this.record.hbl_notify_id)) {

      if (this.gs.isBlank(this.record.hbl_notify_code)) {
        this.errorMessage.push("Notify Code cannot be blank");
        bret = false;
      }
      if (this.gs.isBlank(this.record.hbl_notify_name)) {
        this.errorMessage.push("Notify Name cannot be blank");
        bret = false;
      }
    }

    if (this.gs.isBlank(this.record.hbl_pol_name)) {
      this.errorMessage.push("Pol cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.hbl_pod_name)) {
      this.errorMessage.push("Pod cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.hbl_handled_id) || this.gs.isBlank(this.record.hbl_handled_name)) {
      this.errorMessage.push("Handled By cannot be blank");
      bret = false;
    }



    if (this.gs.BRANCH_REGION == "USA") {
      if (this.gs.isZero(this.record.hbl_lbs)) {
        this.errorMessage.push("LBS cannot be blank");
        bret = false;
      }

      if (this.gs.isZero(this.record.hbl_cft) && this.ShipmentType != "FCL") {
        this.errorMessage.push("CFT cannot be blank");
        bret = false;
      }
    }

    if (this.gs.isZero(this.record.hbl_weight)) {
      this.errorMessage.push("Weight cannot be blank");
      bret = false;
    }

    if (this.gs.isZero(this.record.hbl_cbm) && this.ShipmentType != "FCL") {
      this.errorMessage.push("CBM cannot be blank");
      bret = false;
    }

    if (!bret)
      alert('Error While Saving');

    return bret;
  }

  onBlur(field: string) {

  }


  Save() {

    this.errorMessage = [];

    if (!this.Allvalid())
      return;

    this.record.hbl_is_cntrized = (this.record._hbl_is_cntrized) ? "Y" : "N";
    this.record.hbl_is_arranged = (this.record._hbl_is_arranged) ? "Y" : "N";
    this.record.hbl_print_kgs = (this.record._hbl_print_kgs) ? "Y" : "N";
    this.record.hbl_print_lbs = (this.record._hbl_print_lbs) ? "Y" : "N";

    this.SaveParent();
    this.SaveContainer();
    this.SaveDescList();

    const saverec = <vm_Tbl_cargo_exp_housem>{};

    saverec.mode = this.mode;
    saverec.pkid = this.pkid;
    saverec.HousePrefix = this.gs.SEA_EXPORT_HOUSE_PREFIX;
    saverec.IsPol = this.gs.SEA_EXPORT_HOUSE_PREFIX_POL.toString();
    saverec.IsPod = this.gs.SEA_EXPORT_HOUSE_PREFIX_POD.toString();
    saverec.iStartNo = this.iStartNo;
    saverec.iStep = this.iStep;

    saverec.record = this.record;
    saverec.cntrs = this.cntrs;
    saverec.records = this.recorddet;
    saverec.userinfo = this.gs.UserInfo;

    this.mainService.Save(saverec).subscribe(response => {

      // if (response.retvalue) {

      //   this.record.hbl_houseno = response.refno;
      //   this.mode = 'EDIT';

      // }

      if (response.retvalue == false) {
        this.errorMessage.push(response.error);
        alert(this.errorMessage);
      }
      else {
        if (this.mode == "ADD" && response.refno != '')
          this.record.hbl_houseno = response.refno;
        this.mode = 'EDIT';
        this.errorMessage.push('Save Complete');
        // alert(this.errorMessage);
      }

    }, error => {
      this.errorMessage.push(this.gs.getError(error));
      alert(this.errorMessage[0]);

    }
    );

  }


  LovSelected(rec: SearchTable, idx: number = 0) {

    if (rec.controlname == "SHIPPER") {
      this.record.hbl_shipper_id = rec.id;
      this.record.hbl_shipper_code = rec.code;
      this.record.hbl_shipper_name = rec.name;
      if (rec.col8 != "")
        this.record.hbl_shipper_name = rec.col8;
      this.record.hbl_shipper_add1 = rec.col1;
      this.record.hbl_shipper_add2 = rec.col2;
      this.record.hbl_shipper_add3 = rec.col3;
      this.record.hbl_shipper_add4 = this.gs.GetTelFax(rec.col6, rec.col7);
      if (rec.col9 == "Y") {
        this.gs.ShowAccAlert(this.record.hbl_shipper_id);
      }
      if (!this.gs.isBlank(this.hbl_shipper_name_ctrl))
        this.hbl_shipper_name_ctrl.focus();
    }

    if (rec.controlname == 'CONSIGNEE') {

      this.record.hbl_consignee_id = rec.id;
      this.record.hbl_consignee_code = rec.code;
      this.record.hbl_consigned_to1 = rec.name;
      this.record.hbl_consigned_to2 = rec.col1;
      this.record.hbl_consigned_to3 = rec.col2;
      this.record.hbl_consigned_to4 = rec.col3;
      this.record.hbl_consigned_to5 = this.gs.GetTelFax(rec.col6, rec.col7);

      var sNom = rec.type;
      if (sNom == "NOMINATION" || sNom == "MUTUAL")
        this.record.hbl_bltype = sNom;
      else
        this.record.hbl_bltype = "FREEHAND";

      if (rec.col9 == "Y") {
        this.gs.ShowAccAlert(this.record.hbl_consignee_id);
      }
      if (!this.gs.isBlank(this.hbl_consigned_to1_ctrl))
        this.hbl_consigned_to1_ctrl.focus();
    }

    if (rec.controlname == "NOTIFY") {
      this.record.hbl_notify_id = rec.id;
      this.record.hbl_notify_code = rec.code;
      this.record.hbl_notify_name = rec.name;
      if (rec.col8 != "")
        this.record.hbl_notify_name = rec.col8;
      this.record.hbl_notify_add1 = rec.col1;
      this.record.hbl_notify_add2 = rec.col2;
      this.record.hbl_notify_add3 = rec.col3;
      this.record.hbl_notify_add4 = this.gs.GetTelFax(rec.col6, rec.col7);
      if (rec.col9 == "Y") {
        this.gs.ShowAccAlert(this.record.hbl_notify_id);
      }
      if (!this.gs.isBlank(this.hbl_notify_name_ctrl))
        this.hbl_notify_name_ctrl.focus();
    }


    if (rec.controlname == "AGENT") {
      this.record.hbl_agent_id = rec.id;
      if (!this.gs.isBlank(this.hbl_origin_ctrl))
        this.hbl_origin_ctrl.focus();
    }

    if (rec.controlname == "HANDLEDBY") {
      this.record.hbl_handled_id = rec.id;
      this.record.hbl_by1 = rec.name;
      if (!this.gs.isBlank(this.hbl_salesman_name_ctrl))
        this.hbl_salesman_name_ctrl.Focus();
    }

    if (rec.controlname == "SALEMSAN") {
      this.record.hbl_salesman_id = rec.id;

      if (!this.gs.isBlank(this.hbl_goods_nature_ctrl))
        this.hbl_goods_nature_ctrl.focus();
    }

    // Container
    if (rec.controlname == "CONTAINER TYPE") {
      this.cntrs.forEach(mrec => {
        if (mrec.cntr_pkid == rec.uid) {
          mrec.cntr_type = rec.code;
          if (idx < this.cntr_sealno_field.toArray().length)
            this.cntr_sealno_field.toArray()[idx].focus();
        }
      });
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
  }

  Close() {
    this.location.back();
  }

  private SaveParent() {
    if (this.mode == "ADD") {
      this.record.hbl_mbl_id = this.parentid;
      this.record.rec_created_id = this.gs.user_pkid;
    }

    if (this.gs.BRANCH_REGION != "USA")
      this.record.hbl_goods_nature = this.record.hbl_commodity;

  }

  private SaveContainer() {
    let iCtr: number = 0;
    this.cntrs.forEach(Rec => {
      iCtr++;
      Rec.cntr_hblid = this.pkid.toString();
      Rec.cntr_catg = "H";
      Rec.cntr_order = iCtr;
      Rec.cntr_weight_uom = "";
      Rec.cntr_packages = 0;
    })
  }

  SaveDescList() {

    this.recorddet = <Tbl_cargo_exp_desc[]>[];

    this.SaveDesc(1, this.record.mark1, this.record.pkg1, this.record.desc1);
    this.SaveDesc(2, this.record.mark2, this.record.pkg2, this.record.desc2);
    this.SaveDesc(3, this.record.mark3, this.record.pkg3, this.record.desc3);

    this.SaveDesc(4, this.record.mark4, '', this.record.desc4);
    this.SaveDesc(5, this.record.mark5, '', this.record.desc5);
    this.SaveDesc(6, this.record.mark6, '', this.record.desc6);
    this.SaveDesc(7, this.record.mark7, '', this.record.desc7);
    this.SaveDesc(8, this.record.mark8, '', this.record.desc8);
    this.SaveDesc(9, this.record.mark9, '', this.record.desc9);
    this.SaveDesc(10, this.record.mark10, '', this.record.desc10);
    this.SaveDesc(11, this.record.mark11, '', this.record.desc11);

    this.SaveDesc(12, this.record.mark12, '', this.record.desc12);
    this.SaveDesc(13, this.record.mark13, '', this.record.desc13);
    this.SaveDesc(14, this.record.mark14, '', this.record.desc14);
    this.SaveDesc(15, this.record.mark15, '', this.record.desc15);
    this.SaveDesc(16, this.record.mark16, '', this.record.desc16);
    this.SaveDesc(17, this.record.mark17, '', this.record.desc17);

  }

  SaveDesc(iCtr: number, M1: string, P1: string, D1: string) {
    if (M1.length > 0 || P1.length > 0 || D1.length > 0) {
      var Rec: Tbl_cargo_exp_desc = <Tbl_cargo_exp_desc>{};
      Rec.parentid = this.pkid;
      Rec.parent_type = this.DESC_TYPE;
      Rec.cargo_ctr = iCtr;
      Rec.cargo_marks = M1;
      Rec.cargo_packages = P1;
      Rec.cargo_description = D1;
      this.recorddet.push(Rec);
    }
  }

  AddRow() {

    var rec = <Tbl_cargo_exp_container>{};
    rec.cntr_pkid = this.gs.getGuid();
    rec.cntr_no = "";
    rec.cntr_type = "";
    rec.cntr_sealno = '';
    rec.cntr_packages_uom = '';
    rec.cntr_movement = "";
    rec.cntr_weight = 0;
    rec.cntr_pieces = 0;
    rec.cntr_cbm = 0;
    this.cntrs.push(rec);
    this.cntr_no_field.changes
      .subscribe((queryChanges) => {
        this.cntr_no_field.last.focus();
      });
  }

  RemoveRow(_rec: Tbl_cargo_exp_container) {
    this.cntrs.splice(this.cntrs.findIndex(rec => rec.cntr_pkid == _rec.cntr_pkid), 1);
  }

  BtnNavigation(action: string) {
    switch (action) {
      case 'HBLREPORT': {
        this.report_title = 'HBL';
        this.report_url = '/api/SeaExport/HousePage/GetHBLReport';
        this.report_searchdata = this.gs.UserInfo;
        this.report_searchdata.pkid = this.pkid;
        this.report_menuid = this.gs.MENU_SE_HOUSE_PRINT_HBL;
        this.tab = 'report';
        break;
      }
      case 'BLANK': {
        this.report_title = 'HBL LASER';
        this.report_url = '/api/SeaExport/HousePage/GetHBLBlankReport';
        this.report_searchdata = this.gs.UserInfo;
        this.report_searchdata.pkid = this.pkid;
        this.report_searchdata.format_type = 'BLANK';
        this.report_searchdata.bl_backside = this.bl_backside == true ? 'Y' : 'N';
        this.report_searchdata.bl_colour = this.bl_colour == true ? '2' : '0';
        this.report_searchdata.cntr_seal_hrzprint = this.cntr_seal_hrzprint == true ? 'Y' : 'N';
        this.report_menuid = this.gs.MENU_SE_HOUSE_HBL_LASER;
        this.tab = 'report';
        break;
      }
      case 'DRAFT': {
        this.report_title = 'HBL DRAFT';
        this.report_url = '/api/SeaExport/HousePage/GetHBLBlankReport';
        this.report_searchdata = this.gs.UserInfo;
        this.report_searchdata.pkid = this.pkid;
        this.report_searchdata.format_type = 'DRAFT';
        this.report_searchdata.bl_backside = this.bl_backside == true ? 'Y' : 'N';
        this.report_searchdata.bl_colour = this.bl_colour == true ? '2' : '0';
        this.report_searchdata.cntr_seal_hrzprint = this.cntr_seal_hrzprint == true ? 'Y' : 'N';
        this.report_menuid = this.gs.MENU_SE_HOUSE_HBL_LASER;
        this.tab = 'report';
        break;
      }
      case 'TELEX': {
        this.report_title = 'HBL TELEX';
        this.report_url = '/api/SeaExport/HousePage/GetHBLBlankReport';
        this.report_searchdata = this.gs.UserInfo;
        this.report_searchdata.pkid = this.pkid;
        this.report_searchdata.format_type = 'TELEX';
        this.report_searchdata.bl_backside = this.bl_backside == true ? 'Y' : 'N';
        this.report_searchdata.bl_colour = this.bl_colour == true ? '2' : '0';
        this.report_searchdata.cntr_seal_hrzprint = this.cntr_seal_hrzprint == true ? 'Y' : 'N';
        this.report_menuid = this.gs.MENU_SE_HOUSE_HBL_LASER;
        this.tab = 'report';
        break;
      }

    }
  }
  callbackevent(event: any) {
    this.tab = 'main';
  }


}
