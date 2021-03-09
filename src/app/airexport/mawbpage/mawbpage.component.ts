import { Component, OnInit, ViewChild, ElementRef, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { InputBoxComponent } from '../../shared/input/inputbox.component';
import { InputBoxNumberComponent } from '../../shared/inputnumber/inputboxnumber.component';

import { GlobalService } from '../../core/services/global.service';
import { User_Menu } from '../../core/models/menum';
import { SearchTable } from '../../shared/models/searchtable';

import { MawbPageService } from '../services/mawbpage.service';

import { Tbl_cargo_exp_mbldet, vm_Tbl_cargo_exp_mbldet, Tbl_desc } from '../models/tbl_cargo_exp_mbldet';
import { Tbl_cargo_exp_desc } from '../models/Tbl_cargo_exp_desc';
import { NgModel } from '@angular/forms';
import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';

@Component({
  selector: 'app-mawbpage',
  templateUrl: './mawbpage.component.html'
})
export class MawbPageComponent implements OnInit {


  private pkid: string;
  private menuid: string;
  private mode: string = "ADD";

  tab: string = 'main';
  report_title: string = '';
  report_url: string = '';
  report_searchdata: any = {};
  report_menuid: string = '';
  Client_Category: string = "SHPR";
  bValueChanged: boolean = false;

  private errorMessage: string[] = [];

  private title: string;
  private isAdmin: boolean;

  record: Tbl_cargo_exp_mbldet = <Tbl_cargo_exp_mbldet>{};
  records: Tbl_cargo_exp_desc[] = [];
  recorddet: Tbl_desc = <Tbl_desc>{};

  @ViewChild('_mbld_shipper_name') mbld_shipper_name_ctrl: InputBoxComponent;
  @ViewChild('_mbld_shipper_code') mbld_shipper_code_ctrl: AutoComplete2Component;
  @ViewChild('_mbld_consigned_to1') mbld_consigned_to1_ctrl: InputBoxComponent;
  @ViewChild('_btnret') btnret_ctrl: ElementRef;

  DESC_TYPE: string = "AE-MDESC";
  is_locked: boolean = false;
  canSave: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: MawbPageService,
  ) { }


  ngOnInit() {
    const options = JSON.parse(this.route.snapshot.queryParams.parameter);
    this.pkid = options.pkid;
    this.menuid = options.menuid;
    this.is_locked = options.is_locked;
    this.initPage();
    this.actionHandler();
  }

  initPage() {

    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.errorMessage = [];

  }

  actionHandler() {

    this.errorMessage = [];

    this.record = <Tbl_cargo_exp_mbldet>{};
    this.records = <Tbl_cargo_exp_desc[]>[];
    this.recorddet = <Tbl_desc>{};
    this.InitDesc();
    this.GetRecord();

  }

  GetRecord() {

    this.errorMessage = [];
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;
    SearchData.desc_type = this.DESC_TYPE;
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {

        this.mode = response.mode;
        this.record = <Tbl_cargo_exp_mbldet>response.record;
        this.records = <Tbl_cargo_exp_desc[]>response.records;
        if (this.mode == "ADD" || this.mode == undefined) {
          this.mode = "ADD";
          this.InitRecord();

        } else {
          this.mode = "EDIT";
          if (this.records != null) {
            this.records.forEach(rec => {
              this.ShowDesc(rec);
            });
          }

          this.record.mbld_asarranged_shipper_b = (this.record.mbld_asarranged_shipper == "Y") ? true : false;
          this.record.mbld_asarranged_consignee_b = (this.record.mbld_asarranged_consignee == "Y") ? true : false;
          this.record.mbld_print_shpr1_b = (this.record.mbld_print_shpr1 == "Y") ? true : false;
          this.record.mbld_print_shpr2_b = (this.record.mbld_print_shpr2 == "Y") ? true : false;
          this.record.mbld_print_shpr3_b = (this.record.mbld_print_shpr3 == "Y") ? true : false;
          this.record.mbld_print_shpr4_b = (this.record.mbld_print_shpr4 == "Y") ? true : false;
          this.record.mbld_print_shpr5_b = (this.record.mbld_print_shpr5 == "Y") ? true : false;
          this.record.mbld_print_cons1_b = (this.record.mbld_print_cons1 == "Y") ? true : false;
          this.record.mbld_print_cons2_b = (this.record.mbld_print_cons2 == "Y") ? true : false;
          this.record.mbld_print_cons3_b = (this.record.mbld_print_cons3 == "Y") ? true : false;
          this.record.mbld_print_cons4_b = (this.record.mbld_print_cons4 == "Y") ? true : false;
          this.record.mbld_print_cons5_b = (this.record.mbld_print_cons5 == "Y") ? true : false;
          this.record.mbld_print_shpr1_carrier_b = (this.record.mbld_print_shpr1_carrier == "Y") ? true : false;
          this.record.mbld_print_shpr2_carrier_b = (this.record.mbld_print_shpr2_carrier == "Y") ? true : false;
          this.record.mbld_print_shpr3_carrier_b = (this.record.mbld_print_shpr3_carrier == "Y") ? true : false;
          this.record.mbld_print_cons1_carrier_b = (this.record.mbld_print_cons1_carrier == "Y") ? true : false;
          this.record.mbld_print_cons2_carrier_b = (this.record.mbld_print_cons2_carrier == "Y") ? true : false;
          this.record.mbld_print_cons3_carrier_b = (this.record.mbld_print_cons3_carrier == "Y") ? true : false;
        }


        this.canSave = this.gs.canSave(this.menuid, this.mode);

        // if (!this.gs.isBlank(this.mbld_shipper_code_ctrl))
        //   this.mbld_shipper_code_ctrl.Focus();

        if (!this.gs.isBlank(this.btnret_ctrl))
          this.btnret_ctrl.nativeElement.focus();

      }, error => {
        this.errorMessage.push(this.gs.getError(error));

      });
  }


  InitRecord() {

    this.record.mbld_pkid = this.pkid;

    this.record.mbld_weight_unit = "KG";
    this.record.mbld_iata = this.gs.HBL_IATA;

    this.record.mbld_carriage_value = "NVD";
    this.record.mbld_customs_value = "NCV";
    this.record.mbld_ins_amt = "NIL";
    this.record.mbld_rout1 = "PLEASE CONTACT WITH CONSIGNEE UPON SHIPMENT ARRIVAL.";
    this.recorddet.desc1 = "CONSOL SHIPMENT AS PER";
    this.recorddet.desc2 = "ATTACHED CARGO MANIFEST";
    this.record.mbld_agent_name = this.gs.ISSUE_AGENT_NAME;
    this.record.mbld_agent_city = this.gs.ISSUE_AGENT_CITY;
    this.record.mbld_pol_name = this.gs.GetAirportCode(this.record.mbld_pol_code, this.record.mbld_pol_name, this.record.mbld_pol_cntry_code);
    this.record.mbld_pod_name = this.gs.GetAirportCode(this.record.mbld_pod_code, this.record.mbld_pod_name, this.record.mbld_pod_cntry_code);;

    this.record.mbld_charges1 = "";
    this.record.mbld_charges2 = "";
    this.record.mbld_charges3 = "";
    this.record.mbld_charges4 = "";
    this.record.mbld_charges5 = "";
    this.record.mbld_pp1 = "";
    this.record.mbld_pp2 = "";
    this.record.mbld_pp3 = "";
    this.record.mbld_pp4 = "";
    this.record.mbld_pp5 = "";
    this.record.mbld_cc1 = "";
    this.record.mbld_cc2 = "";
    this.record.mbld_cc3 = "";
    this.record.mbld_cc4 = "";
    this.record.mbld_cc5 = "";

    this.record.mbld_charges1_carrier = "";
    this.record.mbld_charges2_carrier = "";
    this.record.mbld_charges3_carrier = "";
    this.record.mbld_charges4_carrier = "";
    this.record.mbld_pp1_carrier = "";
    this.record.mbld_pp2_carrier = "";
    this.record.mbld_pp3_carrier = "";
    this.record.mbld_pp4_carrier = "";
    this.record.mbld_cc1_carrier = "";
    this.record.mbld_cc2_carrier = "";
    this.record.mbld_cc3_carrier = "";
    this.record.mbld_cc4_carrier = "";

    this.record.mbld_asarranged_shipper = "N";
    this.record.mbld_asarranged_consignee = "N";
    this.record.mbld_print_shpr1 = "N";
    this.record.mbld_print_shpr2 = "N";
    this.record.mbld_print_shpr3 = "N";
    this.record.mbld_print_shpr4 = "N";
    this.record.mbld_print_shpr5 = "N";
    this.record.mbld_print_cons1 = "N";
    this.record.mbld_print_cons2 = "N";
    this.record.mbld_print_cons3 = "N";
    this.record.mbld_print_cons4 = "N";
    this.record.mbld_print_cons5 = "N";
    this.record.mbld_print_shpr1_carrier = "N";
    this.record.mbld_print_shpr2_carrier = "N";
    this.record.mbld_print_shpr3_carrier = "N";
    this.record.mbld_print_shpr4_carrier = "N";
    this.record.mbld_print_cons1_carrier = "N";
    this.record.mbld_print_cons2_carrier = "N";
    this.record.mbld_print_cons3_carrier = "N";
    this.record.mbld_print_cons4_carrier = "N";


    this.record.mbld_asarranged_shipper_b = false;
    this.record.mbld_asarranged_consignee_b = false;



    this.record.mbld_print_shpr1_b = false;
    this.record.mbld_print_cons1_b = false;

    this.record.mbld_print_shpr2_b = false;
    this.record.mbld_print_cons2_b = false;

    this.record.mbld_print_shpr3_b = false;
    this.record.mbld_print_cons3_b = false;

    this.record.mbld_print_shpr4_b = false;
    this.record.mbld_print_cons4_b = false;

    this.record.mbld_print_shpr5_b = false;
    this.record.mbld_print_cons5_b = false;

    this.record.mbld_print_shpr1_carrier_b = false;
    this.record.mbld_print_cons1_carrier_b = false;

    this.record.mbld_print_shpr2_carrier_b = false;
    this.record.mbld_print_cons2_carrier_b = false;

    this.record.mbld_print_shpr3_carrier_b = false;
    this.record.mbld_print_cons3_carrier_b = false;

    this.record.mbld_print_shpr4_carrier_b = false;
    this.record.mbld_print_cons4_carrier_b = false;

  }

  ShowDesc(Rec: Tbl_cargo_exp_desc) {
    if (Rec.cargo_ctr == 1) {
      this.recorddet.mark1 = Rec.cargo_marks; this.recorddet.desc1 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 2) {
      this.recorddet.mark2 = Rec.cargo_marks; this.recorddet.desc2 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 3) {
      this.recorddet.mark3 = Rec.cargo_marks; this.recorddet.desc3 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 4) {
      this.recorddet.mark4 = Rec.cargo_marks; this.recorddet.desc4 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 5) {
      this.recorddet.mark5 = Rec.cargo_marks; this.recorddet.desc5 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 6) {
      this.recorddet.mark6 = Rec.cargo_marks; this.recorddet.desc6 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 7) {
      this.recorddet.mark7 = Rec.cargo_marks; this.recorddet.desc7 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 8) {
      this.recorddet.mark8 = Rec.cargo_marks; this.recorddet.desc8 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 9) {
      this.recorddet.mark9 = Rec.cargo_marks; this.recorddet.desc9 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 10) {
      this.recorddet.mark10 = Rec.cargo_marks; this.recorddet.desc10 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 11) {
      this.recorddet.desc11 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 12) {
      this.recorddet.desc12 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 13) {
      this.recorddet.desc13 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 14) {
      this.recorddet.desc14 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 15) {
      this.recorddet.desc15 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 16) {
      this.recorddet.desc16 = Rec.cargo_description;
    }
    if (Rec.cargo_ctr == 17) {
      this.recorddet.desc17 = Rec.cargo_description;
    }
  }

  InitDesc() {
    this.recorddet.mark1 = ""; this.recorddet.desc1 = "";
    this.recorddet.mark2 = ""; this.recorddet.desc2 = "";
    this.recorddet.mark3 = ""; this.recorddet.desc3 = "";
    this.recorddet.mark4 = ""; this.recorddet.desc4 = "";
    this.recorddet.mark5 = ""; this.recorddet.desc5 = "";
    this.recorddet.mark6 = ""; this.recorddet.desc6 = "";
    this.recorddet.mark7 = ""; this.recorddet.desc7 = "";
    this.recorddet.mark8 = ""; this.recorddet.desc8 = "";
    this.recorddet.mark9 = ""; this.recorddet.desc9 = "";
    this.recorddet.mark10 = ""; this.recorddet.desc10 = "";
    this.recorddet.desc11 = "";
    this.recorddet.desc12 = "";
    this.recorddet.desc13 = "";
    this.recorddet.desc14 = "";
    this.recorddet.desc15 = "";
    this.recorddet.desc16 = "";
    this.recorddet.desc17 = "";
  }



  Allvalid() {
    let bret = true;

    if (this.gs.isBlank(this.record.mbld_shipper_id) || this.gs.isBlank(this.record.mbld_shipper_code)) {
      this.errorMessage.push("Shipper Code cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.mbld_shipper_name)) {
      this.errorMessage.push("Shipper Name cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.mbld_shipper_add1)) {
      this.errorMessage.push("Shipper Address1 cannot be blank");
      bret = false;
    }


    if (this.gs.isBlank(this.record.mbld_consignee_id) || this.gs.isBlank(this.record.mbld_consignee_code)) {
      this.errorMessage.push("Consignee Code cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.mbld_consigned_to1)) {
      this.errorMessage.push("Consignee Name cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.mbld_consigned_to2)) {
      this.errorMessage.push("Consignee Address1 cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.mbld_agent_name)) {
      this.errorMessage.push("Agent cannot be blank");
      bret = false;
    }

    this.record.mbld_frt_status = this.record.mbld_frt_status.trim();
    if (this.record.mbld_frt_status != "") {
      if (this.record.mbld_frt_status != "P" && this.record.mbld_frt_status != "C") {
        this.errorMessage.push("Invalid Frt/PC, P or C has to be enterd(P-Prepaid,C-Collect)");
        bret = false;
      }
    }

    this.record.mbld_oc_status = this.record.mbld_oc_status.trim();
    if (this.record.mbld_oc_status != "") {
      if (this.record.mbld_oc_status != "P" && this.record.mbld_oc_status != "C") {
        this.errorMessage.push("Invalid Other/PC, P or C has to be enterd(P-Prepaid,C-Collect)");
        bret = false;
      }
    }

    if (this.gs.isBlank(this.record.mbld_pol_name)) {
      this.errorMessage.push("Departure cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.mbld_pod_name)) {
      this.errorMessage.push("Destination cannot be blank");
      bret = false;
    }

    if (this.gs.isZero(this.record.mbld_pcs)) {
      this.errorMessage.push("Pcs cannot be blank");
      bret = false;
    }

    if (this.gs.isZero(this.record.mbld_weight)) {
      this.errorMessage.push("Weight cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.mbld_weight_unit)) {
      this.errorMessage.push("Kg/Lb cannot be blank");
      bret = false;
    }

    if (this.gs.isZero(this.record.mbld_chwt)) {
      this.errorMessage.push("Ch.Wt cannot be blank");
      bret = false;
    }

    if (!bret)
      alert('Error While Saving');

    return bret;
  }


  onChange(field: string) {

    if (field == 'mbld_rate' || field == 'mbld_chwt' || field == 'mbld_rate1' || field == 'mbld_rate2' ||
      field == 'mbld_rate3' || field == 'mbld_rate4' || field == 'mbld_rate5' || field == 'mbld_rate1_carrier' || field == 'mbld_rate2_carrier'
      || field == 'mbld_rate3_carrier' || field == 'mbld_rate4_carrier')
      this.bValueChanged = true;

  }

  onFocus(field: string) {

    if (field == 'mbld_rate' || field == 'mbld_chwt' || field == 'mbld_rate1' || field == 'mbld_rate2' ||
      field == 'mbld_rate3' || field == 'mbld_rate4' || field == 'mbld_rate5' || field == 'mbld_rate1_carrier' || field == 'mbld_rate2_carrier'
      || field == 'mbld_rate3_carrier' || field == 'mbld_rate4_carrier')
      this.bValueChanged = false;

  }

  onBlur(field: string) {

    switch (field) {
      case 'mbld_rate': {
        this.record.mbld_rate = this.gs.roundNumber(this.record.mbld_rate, 2);
        this.FindTotal();
        break;
      }
      case 'mbld_chwt': {
        this.record.mbld_chwt = this.gs.roundNumber(this.record.mbld_chwt, 3);
        this.FindTotal();
        this.FindOther("");
        break;
      }
      case 'mbld_rate1': {
        this.record.mbld_rate1 = this.gs.roundNumber(+this.record.mbld_rate1, 2).toString();
        this.FindOther("A1");
        break;
      }
      case 'mbld_rate2': {
        this.record.mbld_rate2 = this.gs.roundNumber(+this.record.mbld_rate2, 2).toString();
        this.FindOther("A2");
        break;
      }
      case 'mbld_rate3': {
        this.record.mbld_rate3 = this.gs.roundNumber(+this.record.mbld_rate3, 2).toString();
        this.FindOther("A3");
        break;
      }
      case 'mbld_rate4': {
        this.record.mbld_rate4 = this.gs.roundNumber(+this.record.mbld_rate4, 2).toString();
        this.FindOther("A4");
        break;
      }
      case 'mbld_rate5': {
        this.record.mbld_rate5 = this.gs.roundNumber(+this.record.mbld_rate5, 2).toString();
        this.FindOther("A5");
        break;
      }

      case 'mbld_rate1_carrier': {
        this.record.mbld_rate1_carrier = this.gs.roundNumber(+this.record.mbld_rate1_carrier, 2).toString();
        this.FindOther("C1");
        break;
      }

      case 'mbld_rate2_carrier': {
        this.record.mbld_rate2_carrier = this.gs.roundNumber(+this.record.mbld_rate2_carrier, 2).toString();
        this.FindOther("C2");
        break;
      }

      case 'mbld_rate3_carrier': {
        this.record.mbld_rate3_carrier = this.gs.roundNumber(+this.record.mbld_rate3_carrier, 2).toString();
        this.FindOther("C3");
        break;
      }

      case 'mbld_rate4_carrier': {
        this.record.mbld_rate4_carrier = this.gs.roundNumber(+this.record.mbld_rate4_carrier, 2).toString();
        this.FindOther("C4");
        break;
      }
    }

  }

  Save() {

    this.errorMessage = [];

    if (!this.Allvalid())
      return;

    this.SaveParent();
    this.SaveDescList();

    const saverec = <vm_Tbl_cargo_exp_mbldet>{};

    saverec.mode = this.mode;
    saverec.pkid = this.pkid;
    saverec.record = this.record;
    saverec.records = this.records;
    saverec.userinfo = this.gs.UserInfo;

    this.mainService.Save(saverec).subscribe(response => {

      if (response.retvalue)
        this.mode = 'EDIT';
      this.errorMessage.push('Save Complete');
    }, error => {
      this.errorMessage.push(this.gs.getError(error));
      alert(this.errorMessage[0]);

    }
    );

  }



  private SaveParent() {
    this.record.mbld_pkid = this.pkid;

    this.record.mbld_asarranged_shipper = (this.record.mbld_asarranged_shipper_b) ? "Y" : "N";
    this.record.mbld_asarranged_consignee = (this.record.mbld_asarranged_consignee_b) ? "Y" : "N";
    this.record.mbld_print_shpr1 = (this.record.mbld_print_shpr1_b) ? "Y" : "N";
    this.record.mbld_print_shpr2 = (this.record.mbld_print_shpr2_b) ? "Y" : "N";
    this.record.mbld_print_shpr3 = (this.record.mbld_print_shpr3_b) ? "Y" : "N";
    this.record.mbld_print_shpr4 = (this.record.mbld_print_shpr4_b) ? "Y" : "N";
    this.record.mbld_print_shpr5 = (this.record.mbld_print_shpr5_b) ? "Y" : "N";
    this.record.mbld_print_cons1 = (this.record.mbld_print_cons1_b) ? "Y" : "N";
    this.record.mbld_print_cons2 = (this.record.mbld_print_cons2_b) ? "Y" : "N";
    this.record.mbld_print_cons3 = (this.record.mbld_print_cons3_b) ? "Y" : "N";
    this.record.mbld_print_cons4 = (this.record.mbld_print_cons4_b) ? "Y" : "N";
    this.record.mbld_print_cons5 = (this.record.mbld_print_cons5_b) ? "Y" : "N";
    this.record.mbld_print_shpr1_carrier = (this.record.mbld_print_shpr1_carrier_b) ? "Y" : "N";
    this.record.mbld_print_shpr2_carrier = (this.record.mbld_print_shpr2_carrier_b) ? "Y" : "N";
    this.record.mbld_print_shpr3_carrier = (this.record.mbld_print_shpr3_carrier_b) ? "Y" : "N";
    this.record.mbld_print_shpr4_carrier = (this.record.mbld_print_shpr4_carrier_b) ? "Y" : "N";
    this.record.mbld_print_cons1_carrier = (this.record.mbld_print_cons1_carrier_b) ? "Y" : "N";
    this.record.mbld_print_cons2_carrier = (this.record.mbld_print_cons2_carrier_b) ? "Y" : "N";
    this.record.mbld_print_cons3_carrier = (this.record.mbld_print_cons3_carrier_b) ? "Y" : "N";
    this.record.mbld_print_cons4_carrier = (this.record.mbld_print_cons4_carrier_b) ? "Y" : "N";
  }

  SaveDescList() {

    this.records = <Tbl_cargo_exp_desc[]>[];

    this.SaveDesc(1, this.recorddet.mark1, "", this.recorddet.desc1);
    this.SaveDesc(2, this.recorddet.mark2, "", this.recorddet.desc2);
    this.SaveDesc(3, this.recorddet.mark3, "", this.recorddet.desc3);

    this.SaveDesc(4, this.recorddet.mark4, '', this.recorddet.desc4);
    this.SaveDesc(5, this.recorddet.mark5, '', this.recorddet.desc5);
    this.SaveDesc(6, this.recorddet.mark6, '', this.recorddet.desc6);
    this.SaveDesc(7, this.recorddet.mark7, '', this.recorddet.desc7);
    this.SaveDesc(8, this.recorddet.mark8, '', this.recorddet.desc8);
    this.SaveDesc(9, this.recorddet.mark9, '', this.recorddet.desc9);
    this.SaveDesc(10, this.recorddet.mark10, '', this.recorddet.desc10);
    this.SaveDesc(11, "", '', this.recorddet.desc11);

    this.SaveDesc(12, "", '', this.recorddet.desc12);
    this.SaveDesc(13, "", '', this.recorddet.desc13);
    this.SaveDesc(14, "", '', this.recorddet.desc14);
    this.SaveDesc(15, "", '', this.recorddet.desc15);
    this.SaveDesc(16, "", '', this.recorddet.desc16);
    this.SaveDesc(17, "", '', this.recorddet.desc17);

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
      this.records.push(Rec);
    }
  }



  LovSelected(rec: SearchTable) {

    if (rec.controlname == "SHIPPER") {
      this.record.mbld_shipper_id = rec.id;
      this.record.mbld_shipper_code = rec.code;
      this.record.mbld_shipper_name = rec.name;
      if (rec.col8 != "")
        this.record.mbld_shipper_name = rec.col8;
      this.record.mbld_shipper_add1 = rec.col1;
      this.record.mbld_shipper_add2 = rec.col2;
      this.record.mbld_shipper_add3 = rec.col3;
      this.record.mbld_shipper_add4 = this.gs.GetTelFax(rec.col6, rec.col7);
      if (this.record.mbld_direct == "Y") {
        //Txt_Agnt_for_Shipper.Text =  "MOTHERLINES INC. AS AGENT FOR ";
        this.record.mbld_by1 = this.gs.ADDRESS_LINE1 + " AS AGENT FOR ";
        this.record.mbld_by2 = this.record.mbld_shipper_name;
      }
      else {
        this.record.mbld_by1 = "";
        this.record.mbld_by2 = this.record.mbld_shipper_name;
      }
      if (rec.col9 == "Y") {
        this.gs.ShowAccAlert(this.record.mbld_shipper_id);
      }
      if (!this.gs.isBlank(this.mbld_shipper_name_ctrl))
        this.mbld_shipper_name_ctrl.focus();
    }

    if (rec.controlname == 'CONSIGNEE') {

      this.record.mbld_consignee_id = rec.id;
      this.record.mbld_consignee_code = rec.code;
      this.record.mbld_consigned_to1 = rec.name;
      this.record.mbld_consigned_to2 = rec.col1;
      this.record.mbld_consigned_to3 = rec.col2;
      this.record.mbld_consigned_to4 = rec.col3;
      this.record.mbld_consigned_to5 = this.gs.GetTelFax(rec.col6, rec.col7);
      this.record.mbld_consigned_to6 = this.gs.GetAttention(rec.col5);

      if (rec.col9 == "Y") {
        this.gs.ShowAccAlert(this.record.mbld_consignee_id);
      }
      if (!this.gs.isBlank(this.mbld_consigned_to1_ctrl))
        this.mbld_consigned_to1_ctrl.focus();
    }

  }
  BtnNavigation(action: string) {

    switch (action) {

      case 'FULL-FORMAT': {
        this.report_title = 'Master B/L Instruction';
        this.report_url = '/api/AirExport/MawbPage/GetMAWBReport';
        this.report_searchdata = this.gs.UserInfo;
        this.report_searchdata.pkid = this.pkid;
        this.report_searchdata.invoketype = this.Client_Category;
        this.report_searchdata.desc_type = this.DESC_TYPE;
        this.report_menuid = this.gs.MENU_AE_MASTER_PRINT_MAWB;
        this.tab = 'report';
        break;
      }


    }
  }
  callbackevent(event: any) {
    this.tab = 'main';
  }

  Close() {
    this.location.back();
  }

  private FindTotal() {
    if (!this.bValueChanged)
      return;

    let nTot: number = this.record.mbld_rate * this.record.mbld_chwt;
    this.record.mbld_total = this.gs.roundNumber(nTot, 2);
  }

  private FindOther(_type: string = "") {
    if (!this.bValueChanged)
      return;

    let nAmt: number = 0;

    if (+this.record.mbld_rate1 > 0 && (_type == "A1" || _type == "")) {
      nAmt = +this.record.mbld_rate1 * this.record.mbld_chwt; this.record.mbld_total1 = this.gs.roundNumber(nAmt, 2).toString();
    }

    if (+this.record.mbld_rate2 > 0 && (_type == "A2" || _type == "")) {
      nAmt = +this.record.mbld_rate2 * this.record.mbld_chwt; this.record.mbld_total2 = this.gs.roundNumber(nAmt, 2).toString();
    }

    if (+this.record.mbld_rate3 > 0 && (_type == "A3" || _type == "")) {
      nAmt = +this.record.mbld_rate3 * this.record.mbld_chwt; this.record.mbld_total3 = this.gs.roundNumber(nAmt, 2).toString();
    }
    if (+this.record.mbld_rate4 > 0 && (_type == "A4" || _type == "")) {
      nAmt = +this.record.mbld_rate4 * this.record.mbld_chwt; this.record.mbld_total4 = this.gs.roundNumber(nAmt, 2).toString();
    }
    if (+this.record.mbld_rate5 > 0 && (_type == "A5" || _type == "")) {
      nAmt = +this.record.mbld_rate5 * this.record.mbld_chwt; this.record.mbld_total5 = this.gs.roundNumber(nAmt, 2).toString();
    }

    if (+this.record.mbld_rate1_carrier > 0 && (_type == "C1" || _type == "")) {
      nAmt = +this.record.mbld_rate1_carrier * this.record.mbld_chwt; this.record.mbld_total1_carrier = this.gs.roundNumber(nAmt, 2).toString();
    }

    if (+this.record.mbld_rate2_carrier > 0 && (_type == "C2" || _type == "")) {
      nAmt = +this.record.mbld_rate2_carrier * this.record.mbld_chwt; this.record.mbld_total2_carrier = this.gs.roundNumber(nAmt, 2).toString();
    }
    if (+this.record.mbld_rate3_carrier > 0 && (_type == "C3" || _type == "")) {
      nAmt = +this.record.mbld_rate3_carrier * this.record.mbld_chwt; this.record.mbld_total3_carrier = this.gs.roundNumber(nAmt, 2).toString();
    }
    if (+this.record.mbld_rate4_carrier > 0 && (_type == "C4" || _type == "")) {
      nAmt = +this.record.mbld_rate4_carrier * this.record.mbld_chwt; this.record.mbld_total4_carrier = this.gs.roundNumber(nAmt, 2).toString();
    }

  }
}
