import { Component, OnInit, ViewChild, ElementRef, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { InputBoxComponent } from '../../shared/input/inputbox.component';
import { InputBoxNumberComponent } from '../../shared/inputnumber/inputboxnumber.component';

import { GlobalService } from '../../core/services/global.service';
import { User_Menu } from '../../core/models/menum';
import { SearchTable } from '../../shared/models/searchtable';

import { CertOrgService } from '../services/certorg.service';

import { Tbl_cargo_exp_mbldet, vm_Tbl_cargo_exp_mbldet } from '../models/Tbl_cargo_exp_mbldet';
import { Tbl_cargo_exp_desc } from '../models/Tbl_cargo_exp_desc';
import { Tbl_cargo_container } from 'src/app/other/models/tbl_cargo_general';
import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';

@Component({
  selector: 'app-certorgpage',
  templateUrl: './certorgpage.component.html'
})
export class CertOrgPageComponent implements OnInit {


  private pkid: string;
  private menuid: string;
  private mode: string = "ADD";


  private errorMessage: string[] = [];

  private title: string;
  private isAdmin: boolean;
  is_locked: boolean = false;

  report_url: string;
  report_searchdata: any = {};
  report_menuid: string;
  tab: string = 'main';

  record: Tbl_cargo_exp_mbldet = <Tbl_cargo_exp_mbldet>{};
  records: Tbl_cargo_exp_desc[] = [];

  recorddet: Tbl_cargo_exp_desc[] = [];

  cntrs: Tbl_cargo_container[] = [];

  ShipmentType: string = '';


  @ViewChild('_mbld_shipper_name') mbld_shipper_name_ctrl: InputBoxComponent;
  @ViewChild('_mbld_shipper_code') mbld_shipper_code_ctrl: AutoComplete2Component;
  @ViewChild('_mbld_consigned_to1') mbld_consigned_to1_ctrl: InputBoxComponent;
  @ViewChild('_mbld_notify_name') mbld_notify_name_ctrl: InputBoxComponent;
  @ViewChild('_mbld_place_receipt') mbld_place_receipt_ctrl: InputBoxComponent;
  // @ViewChild('_mbld_sendto_code') mbld_sendto_code_ctrl: AutoComplete2Component;
  // @ViewChild('_mbld_sendto_name') mbld_sendto_name_ctrl: InputBoxComponent;
  @ViewChild('_btnretcert') btnretcert_ctrl: ElementRef;


  DESC_TYPE: string = "COODESC";

  canSave: boolean = false;
  canPrint: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: CertOrgService,
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

        this.record = <Tbl_cargo_exp_mbldet>response.record;
        this.records = <Tbl_cargo_exp_desc[]>response.records;

        this.ShipmentType = this.record.mbld_cntr_type;

        this.mode = "EDIT";
        if (this.record.mbld_pkid == "") {
          this.mode = "ADD";
          this.record.mbld_type_move = this.record.mbld_ship_term;//default data
          this.record.mbld_notify_name = "SAME AS CONSIGNEE";

          this.record.mbld_is_cntrized = (this.record.mbld_cntr_type != "OTHERS") ? "Y" : "N";

          this.record.mbld_print_kgs = "N";
          this.record.mbld_print_lbs = "N";

          if (this.record.mbld_cntr_type == "FCL" || this.record.mbld_cntr_type == "CONSOLE") {
            this.record.desc1 = "SHIPPERS'S LOAD, COUNT, AND SEALED";
            this.record.desc2 = "SAID TO CONTAIN";
          }
          else if (this.record.mbld_cntr_type == "LCL") {
            this.record.desc1 = "SAID TO CONTAIN";
          }

        }

        this.canSave = this.gs.canSave(this.menuid, this.mode);
        this.canPrint = this.gs.canPrint(this.menuid);

        this.InitDesc();

        if (this.records != null) {

          this.records.forEach(rec => {
            this.ShowDesc(rec);
          });

        }

        this.record._mbld_is_cntrized = (this.record.mbld_is_cntrized == "Y") ? true : false;
        this.record._mbld_print_kgs = (this.record.mbld_print_kgs == "Y") ? true : false;
        this.record._mbld_print_lbs = (this.record.mbld_print_lbs == "Y") ? true : false;

        if (!this.gs.isBlank(this.btnretcert_ctrl))
          this.btnretcert_ctrl.nativeElement.focus();


      }, error => {
        this.errorMessage.push(this.gs.getError(error));

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

    if (!this.gs.isBlank(this.record.mbld_notify_id)) {

      if (this.gs.isBlank(this.record.mbld_notify_code)) {
        this.errorMessage.push("Notify Code cannot be blank");
        bret = false;
      }
      if (this.gs.isBlank(this.record.mbld_notify_name)) {
        this.errorMessage.push("Notify Name cannot be blank");
        bret = false;
      }
    }

    if (this.gs.isBlank(this.record.mbld_pol_name)) {
      this.errorMessage.push("Pol cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.mbld_pod_name)) {
      this.errorMessage.push("Pod cannot be blank");
      bret = false;
    }

    if (this.gs.isBlank(this.record.mbld_handled_id) || this.gs.isBlank(this.record.mbld_handled_name)) {
      this.errorMessage.push("Handled By cannot be blank");
      bret = false;
    }

    // if (this.gs.isBlank(this.record.mbld_sendto_id) || this.gs.isBlank(this.record.mbld_sendto_code)) {
    //   this.errorMessage.push("Send To cannot be blank");
    //   bret = false;
    // }


    if (this.gs.BRANCH_REGION == "USA") {
      if (this.gs.isZero(this.record.mbld_lbs)) {
        this.errorMessage.push("LBS cannot be blank");
        bret = false;
      }

      if (this.gs.isZero(this.record.mbld_cft) && this.ShipmentType != "FCL") {
        this.errorMessage.push("CFT cannot be blank");
        bret = false;
      }
    }

    if (this.gs.isZero(this.record.mbld_weight)) {
      this.errorMessage.push("Weight cannot be blank");
      bret = false;
    }

    if (this.gs.isZero(this.record.mbld_cbm) && this.ShipmentType != "FCL") {
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

    this.record.mbld_is_cntrized = (this.record._mbld_is_cntrized) ? "Y" : "N";
    this.record.mbld_print_kgs = (this.record._mbld_print_kgs) ? "Y" : "N";
    this.record.mbld_print_lbs = (this.record._mbld_print_lbs) ? "Y" : "N";


    this.SaveDescList();

    const saverec = <vm_Tbl_cargo_exp_mbldet>{};

    saverec.mode = this.mode;
    saverec.pkid = this.pkid;
    saverec.record = this.record;
    saverec.records = this.recorddet;
    saverec.userinfo = this.gs.UserInfo;

    this.mainService.Save(saverec).subscribe(response => {

      if (response.retvalue) {
        this.mode = 'EDIT';
        this.errorMessage.push('Save Complete');
        // alert(this.errorMessage);
      } else {
        this.errorMessage.push(response.error);
        alert(this.errorMessage);
      }

    }, error => {
      this.errorMessage.push(this.gs.getError(error));
      alert(this.errorMessage[0]);

    }
    );

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
      if (!this.gs.isBlank(this.mbld_consigned_to1_ctrl))
        this.mbld_consigned_to1_ctrl.focus();
    }

    if (rec.controlname == "NOTIFY") {
      this.record.mbld_notify_id = rec.id;
      this.record.mbld_notify_code = rec.code;
      this.record.mbld_notify_name = rec.name;
      if (rec.col8 != "")
        this.record.mbld_notify_name = rec.col8;
      this.record.mbld_notify_add1 = rec.col1;
      this.record.mbld_notify_add2 = rec.col2;
      this.record.mbld_notify_add3 = rec.col3;
      this.record.mbld_notify_add4 = this.gs.GetTelFax(rec.col6, rec.col7);
      if (!this.gs.isBlank(this.mbld_notify_name_ctrl))
        this.mbld_notify_name_ctrl.focus();
    }


    if (rec.controlname == "AGENT") {
      this.record.mbld_agent_id = rec.id;
      this.record.mbld_agent_code = rec.code;
      if (!this.gs.isBlank(this.mbld_place_receipt_ctrl))
        this.mbld_place_receipt_ctrl.focus();
    }

    if (rec.controlname == "HANDLEDBY") {
      this.record.mbld_handled_id = rec.id;
      this.record.mbld_handled_code = rec.code;
    }

    if (rec.controlname == "SALEMSAN") {

    }

  }

  FindWeight(_type: string) {
    if (_type == "Kgs2Lbs")
      this.record.mbld_lbs = this.gs.Convert_Weight("KG2LBS", this.record.mbld_weight, 3);
    else if (_type == "Lbs2Kgs")
      this.record.mbld_weight = this.gs.Convert_Weight("LBS2KG", this.record.mbld_lbs, 3);
    else if (_type == "Cbm2Cft")
      this.record.mbld_cft = this.gs.Convert_Weight("CBM2CFT", this.record.mbld_cbm, 3);
    else if (_type == "Cft2Cbm")
      this.record.mbld_cbm = this.gs.Convert_Weight("CFT2CBM", this.record.mbld_cft, 3);
  }

  Close() {
    this.location.back();
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


  Print() {

    this.report_url = '/api/SeaExport/CertOrgPage/CertOrgBlankReport';
    this.report_searchdata = this.gs.UserInfo;
    this.report_searchdata.pkid = this.pkid;
    this.report_searchdata.dock_type = 'COODESC';
    this.report_menuid = this.gs.MENU_SE_MASTER_CERTIFICATE_ORIGIN;
    this.tab = 'report';

  }

  callbackevent() {
    this.tab = 'main';
  }





}
