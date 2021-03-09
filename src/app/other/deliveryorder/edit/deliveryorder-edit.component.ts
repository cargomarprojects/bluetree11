import { Component, OnInit, ViewChild, ElementRef, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { InputBoxComponent } from '../../../shared/input/inputbox.component';
import { InputBoxNumberComponent } from '../../../shared/inputnumber/inputboxnumber.component';

import { GlobalService } from '../../../core/services/global.service';
import { User_Menu } from '../../../core/models/menum';
import { SearchTable } from '../../../shared/models/searchtable';
import { DeliveryOrderService } from '../../services/deliveryorder.service';
import { Tbl_cargo_imp_pickup, vm_tbl_cargo_imp_pickup } from '../../models/tbl_cargo_imp_pickup';
import { Tbl_cargo_container, Tbl_cargo_general } from '../../models/tbl_cargo_general';
import { DateComponent } from '../../../shared/date/date.component';

@Component({
  selector: 'app-deliveryorder-edit',
  templateUrl: './deliveryorder-edit.component.html'
})
export class DeliveryOrderEditComponent implements OnInit {

  @ViewChild('_pick_order_date') pick_order_date_ctrl: DateComponent;
  @ViewChild('_pick_truk_name') pick_truk_name_ctrl: InputBoxComponent;
  @ViewChild('_pick_fromname') pick_fromname_ctrl: InputBoxComponent;
  @ViewChild('_pick_toname') pick_toname_ctrl: InputBoxComponent;

  private pkid: string;
  private menuid: string;
  private mode: string = "ADD";
  private errorMessage: string[] = [];

  private title: string;
  private isAdmin: boolean;
  bValueChanged: boolean = false;
  private chkallselected: boolean = false;
  private selectdeselect: boolean = false;

  record: Tbl_cargo_imp_pickup = <Tbl_cargo_imp_pickup>{};
  cntrrecords: Tbl_cargo_container[] = [];
  defaultrecord: Tbl_cargo_imp_pickup = <Tbl_cargo_imp_pickup>{};


  tab: string = 'main';
  report_title: string = '';
  report_url: string = '';
  report_searchdata: any = {};
  report_menuid: string = '';

  is_locked: boolean = false;


  private parentid: string = '';
  private pickCategory: string;
  private deliveryCntrsToPrint: string = '';
  private mbl_refno: string;
  private type: string;

  private refno: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: DeliveryOrderService,
  ) { }


  ngOnInit() {
    if (this.route.snapshot.queryParams.parameter == null) {
      this.menuid = this.route.snapshot.queryParams.menuid;
      this.parentid = this.route.snapshot.queryParams.parentid;
      this.pickCategory = this.route.snapshot.queryParams.pickCategory;
      this.pkid = this.route.snapshot.queryParams.pkid;
      this.mode = this.route.snapshot.queryParams.mode;
    } else {
      const options = JSON.parse(this.route.snapshot.queryParams.parameter);
      this.menuid = options.menuid;
      this.parentid = options.parentid;
      this.pickCategory = options.pickCategory;
      this.pkid = options.pkid;
      this.mode = options.mode;
    }
    this.initPage();
    this.actionHandler();
  }

  initPage() {
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.errorMessage = [];
  }
  ngAfterViewInit() {
    if (!this.gs.isBlank(this.pick_order_date_ctrl))
      this.pick_order_date_ctrl.Focus();
  }
  actionHandler() {

    this.errorMessage = [];
    this.is_locked = false;
    this.chkallselected = false;
    this.selectdeselect = false;
    if (this.mode == 'ADD') {
      this.pkid = this.gs.getGuid();
      this.record = <Tbl_cargo_imp_pickup>{};
      this.cntrrecords = <Tbl_cargo_container[]>[];
      this.InitRecord();
      if (this.parentid.trim() != "")
        this.LoadDefaultData();
    }
    if (this.mode == 'EDIT')
      this.GetRecord();

  }
  InitRecord() {
    this.record.pick_pkid = this.pkid;
    this.record.pick_parentid = this.parentid;
    this.record.pick_truk_code = '';
    this.record.pick_truk_name = '';
    this.record.pick_truk_id = '';
    this.record.pick_truk_attn = '';
    this.record.pick_truk_tel = '';
    this.record.pick_truk_fax = '';
    this.record.pick_truk_cc = '';
    this.record.pick_pickup = '';
    this.record.pick_addr1 = '';
    this.record.pick_addr2 = '';
    this.record.pick_addr3 = '';
    this.record.pick_date = '';
    this.record.pick_time = '';
    this.record.pick_attn = '';
    this.record.pick_tel = '';
    this.record.pick_from_code = '';
    this.record.pick_from_id = '';
    this.record.pick_fromname = '';
    this.record.pick_fromaddr1 = '';
    this.record.pick_fromaddr2 = '';
    this.record.pick_fromaddr3 = '';
    this.record.pick_fromaddr4 = '';
    this.record.pick_to_code = '';
    this.record.pick_to_id = '';
    this.record.pick_toname = '';
    this.record.pick_toaddr1 = '';
    this.record.pick_toaddr2 = '';
    this.record.pick_toaddr3 = '';
    this.record.pick_toaddr4 = '';
    this.record.pick_desc1 = '';
    this.record.pick_tot_piece1 = 0;
    this.record.pick_uom1 = '';
    this.record.pick_wt1 = 0;
    this.record.pick_cbm_cft1 = 0;
    this.record.pick_desc2 = '';
    this.record.pick_tot_piece2 = 0;
    this.record.pick_uom2 = '';
    this.record.pick_wt2 = 0;
    this.record.pick_cbm_cft2 = 0;
    this.record.pick_desc3 = '';
    this.record.pick_tot_piece3 = 0;
    this.record.pick_uom3 = '';
    this.record.pick_wt3 = 0;
    this.record.pick_cbm_cft3 = 0;
    this.record.pick_desc4 = '';
    this.record.pick_tot_piece4 = 0;
    this.record.pick_uom4 = '';
    this.record.pick_wt4 = 0;
    this.record.pick_cbm_cft4 = 0;
    this.record.pick_remark_1 = '';
    this.record.pick_remark_2 = '';
    this.record.pick_remark_3 = '';
    this.record.pick_remark_4 = '';
    this.record.pick_danger_goods = 'NO';
    this.record.pick_terms_ship = 'AIR';
    this.record.pick_freight = '';
    this.record.pick_export_doc = '';

    this.record.IS_EXW = false;
    this.record.IS_FOB = false;
    this.record.IS_FCA = false;
    this.record.IS_CPU = false;
    this.record.IS_DDU = false;
    this.record.IS_FRT_OTH = false;
    this.record.IS_Commercial = false;
    this.record.IS_CopyLC = false;
    this.record.IS_Certificate = false;
    this.record.IS_PktList = false;
    this.record.IS_ExDeclaration = false;
    this.record.IS_Export_OTH = false;

    this.record.freightothers = '';
    this.record.exportothers = '';
    this.record.pick_orderno = '';
    this.record.pick_order_date = this.gs.defaultValues.today;
    this.record.pick_is_delivery_sent = false;
    this.record.pick_delivery_date = '';
  }

  LoadDefaultData() {
    this.errorMessage = [];
    var SearchData = this.gs.UserInfo;
    SearchData.parentid = this.parentid;
    this.mainService.LoadDefaultData(SearchData)
      .subscribe(response => {
        var HouseRec = <Tbl_cargo_general>response.record;
        this.cntrrecords = <Tbl_cargo_container[]>response.cntrrecords;

        if (HouseRec != null) {
          this.record.pick_orderno = HouseRec.mbl_refno;
          this.record.pick_order_date = this.gs.defaultValues.today;
          this.record.pick_from_id = HouseRec.hbl_shipper_id;
          this.record.pick_from_code = HouseRec.hbl_shipper_code;
          this.record.pick_fromname = HouseRec.hbl_shipper_name;
          this.record.pick_fromaddr1 = HouseRec.hbl_shipper_add1;
          this.record.pick_fromaddr2 = HouseRec.hbl_shipper_add2;
          this.record.pick_fromaddr3 = HouseRec.hbl_shipper_add3;
          this.record.pick_fromaddr4 = HouseRec.hbl_shipper_add4;

          this.record.pick_to_id = HouseRec.hbl_consignee_id;
          this.record.pick_to_code = HouseRec.hbl_consignee_code;
          this.record.pick_toname = HouseRec.hbl_consignee_name;
          this.record.pick_toaddr1 = HouseRec.hbl_consignee_add1;
          this.record.pick_toaddr2 = HouseRec.hbl_consignee_add2;
          this.record.pick_toaddr3 = HouseRec.hbl_consignee_add3;
          this.record.pick_toaddr4 = HouseRec.hbl_consignee_add4;

          this.record.pick_desc1 = HouseRec.hbl_commodity;
          this.record.pick_tot_piece1 = HouseRec.hbl_packages;
          if (this.gs.BRANCH_REGION == "USA")
            this.record.pick_wt1 = (HouseRec.hbl_chwt_lbs > 0) ? HouseRec.hbl_chwt_lbs : HouseRec.hbl_lbs;
          else
            this.record.pick_wt1 = (HouseRec.hbl_chwt > 0) ? HouseRec.hbl_chwt : HouseRec.hbl_weight;
          this.record.pick_cbm_cft1 = HouseRec.hbl_cbm;
          this.record.pick_uom1 = HouseRec.hbl_uom;
          this.record.pick_remark_1 = "PLEASE CONTACT CONSIGNEE FOR DELIVERY APPOINTMENT!";

        }
        if (!this.gs.isBlank(this.pick_order_date_ctrl))
          this.pick_order_date_ctrl.Focus();

      }, error => {
        this.errorMessage.push(this.gs.getError(error));
        alert(this.errorMessage[0]);
      });
  }

  GetRecord() {

    this.errorMessage = [];
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;
    SearchData.parentid = this.parentid;
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {

        this.record = <Tbl_cargo_imp_pickup>response.record;
        this.cntrrecords = <Tbl_cargo_container[]>response.cntrrecords;

        let str: string = "";
        var sData = null;

        str = this.record.pick_freight.toString();
        this.record.IS_EXW = (str.includes("EXW")) ? true : false;
        this.record.IS_FOB = (str.includes("FOB")) ? true : false;
        this.record.IS_FCA = (str.includes("FCA")) ? true : false;
        this.record.IS_CPU = (str.includes("CPU")) ? true : false;
        this.record.IS_DDU = (str.includes("DDU")) ? true : false;
        this.record.IS_FRT_OTH = (str.includes("Others")) ? true : false;
        this.record.freightothers = '';
        if (this.record.IS_FRT_OTH) {
          sData = str.split(':');
          this.record.freightothers = sData[1];
        }

        str = this.record.pick_export_doc.toString();
        this.record.IS_Commercial = (str.includes("CINV")) ? true : false;
        this.record.IS_CopyLC = (str.includes("CLC")) ? true : false;
        this.record.IS_Certificate = (str.includes("CORG")) ? true : false;
        this.record.IS_PktList = (str.includes("PLST")) ? true : false;
        this.record.IS_ExDeclaration = (str.includes("EDEC")) ? true : false;
        this.record.IS_Export_OTH = (str.includes("OTH")) ? true : false;
        this.record.exportothers = '';
        if (this.record.IS_Export_OTH) {
          sData = str.split(':');
          this.record.exportothers = sData[1];
        }

        if (!this.gs.isBlank(this.pick_order_date_ctrl))
          this.pick_order_date_ctrl.Focus();

      }, error => {
        this.errorMessage.push(this.gs.getError(error));

      });
  }


  Allvalid() {
    let bret = true;

    if (this.gs.isBlank(this.pkid)) {
      this.errorMessage.push("Invalid ID");
      bret = false;
    }

    if (this.gs.isBlank(this.record.pick_order_date)) {
      this.errorMessage.push("Date cannot be blank");
      bret = false;
    }

    if (this.pickCategory == "OTHERS" || this.pickCategory == "EXTRA") {
      if (this.gs.isBlank(this.record.pick_truk_code) || this.gs.isBlank(this.record.pick_truk_id)) {
        this.errorMessage.push("Trucker Code cannot be empty");
        bret = false;
      }

      if (this.gs.isBlank(this.record.pick_truk_name)) {
        this.errorMessage.push("Trucker Name cannot be empty");
        bret = false;
      }
      if (this.gs.isBlank(this.record.pick_pickup)) {
        this.errorMessage.push("Pick-up  cannot be empty");
        bret = false;
      }
      if (this.gs.isBlank(this.record.pick_addr1)) {
        this.errorMessage.push("Pick-up address cannot be empty");
        bret = false;
      }

      if (this.gs.isBlank(this.record.pick_toname)) {
        this.errorMessage.push("To Name cannot be empty");
        bret = false;
      }

      if (this.gs.isBlank(this.record.pick_toaddr1)) {
        this.errorMessage.push("To address cannot be empty");
        bret = false;
      }

      if (this.gs.isBlank(this.record.pick_danger_goods)) {
        this.errorMessage.push("Dangerous goods not selected");
        bret = false;
      }

      if (this.gs.isBlank(this.record.pick_terms_ship)) {
        this.errorMessage.push("Terms of shipment not selected");
        bret = false;
      }

    }


    if (!bret)
      alert('Error While Saving');

    return bret;
  }

  onChange(field: string) {

    if (field == 'hbl_rate' || field == 'hbl_chwt' || field == 'hbl_rate1' || field == 'hbl_rate2' ||
      field == 'hbl_rate3' || field == 'hbl_rate4' || field == 'hbl_rate5' || field == 'hbl_rate1_carrier' || field == 'hbl_rate2_carrier'
      || field == 'hbl_rate3_carrier' || field == 'hbl_rate4_carrier')
      this.bValueChanged = true;

  }

  onFocus(field: string) {

    if (field == 'hbl_rate' || field == 'hbl_chwt' || field == 'hbl_rate1' || field == 'hbl_rate2' ||
      field == 'hbl_rate3' || field == 'hbl_rate4' || field == 'hbl_rate5' || field == 'hbl_rate1_carrier' || field == 'hbl_rate2_carrier'
      || field == 'hbl_rate3_carrier' || field == 'hbl_rate4_carrier')
      this.bValueChanged = false;

  }

  onBlur(field: string) {

    switch (field) {
      // case 'hbl_rate': {
      //     this.record.hbl_rate = this.gs.roundNumber(this.record.hbl_rate, 2);
      //     this.FindTotal();
      //     break;
      // }
      // case 'hbl_chwt': {
      //     this.record.hbl_chwt = this.gs.roundNumber(this.record.hbl_chwt, 3);
      //     this.FindTotal();
      //     this.FindOther("");
      //     break;
      // }
      // case 'hbl_rate1': {
      //     this.record.hbl_rate1 = this.gs.roundNumber(+this.record.hbl_rate1, 2).toString();
      //     this.FindOther("A1");
      //     break;
      // }
      // case 'hbl_rate2': {
      //     this.record.hbl_rate2 = this.gs.roundNumber(+this.record.hbl_rate2, 2).toString();
      //     this.FindOther("A2");
      //     break;
      // }
      // case 'hbl_rate3': {
      //     this.record.hbl_rate3 = this.gs.roundNumber(+this.record.hbl_rate3, 2).toString();
      //     this.FindOther("A3");
      //     break;
      // }
      // case 'hbl_rate4': {
      //     this.record.hbl_rate4 = this.gs.roundNumber(+this.record.hbl_rate4, 2).toString();
      //     this.FindOther("A4");
      //     break;
      // }
      // case 'hbl_rate5': {
      //     this.record.hbl_rate5 = this.gs.roundNumber(+this.record.hbl_rate5, 2).toString();
      //     this.FindOther("A5");
      //     break;
      // }

      // case 'hbl_rate1_carrier': {
      //     this.record.hbl_rate1_carrier = this.gs.roundNumber(+this.record.hbl_rate1_carrier, 2).toString();
      //     this.FindOther("C1");
      //     break;
      // }

      // case 'hbl_rate2_carrier': {
      //     this.record.hbl_rate2_carrier = this.gs.roundNumber(+this.record.hbl_rate2_carrier, 2).toString();
      //     this.FindOther("C2");
      //     break;
      // }

      // case 'hbl_rate3_carrier': {
      //     this.record.hbl_rate3_carrier = this.gs.roundNumber(+this.record.hbl_rate3_carrier, 2).toString();
      //     this.FindOther("C3");
      //     break;
      // }
      case 'pick_truk_name': {
        this.record.pick_truk_name = this.record.pick_truk_name.toUpperCase();
        break;
      }
      case 'pick_truk_attn': {
        this.record.pick_truk_attn = this.record.pick_truk_attn.toUpperCase();
        break;
      }
      case 'pick_truk_tel': {
        this.record.pick_truk_tel = this.record.pick_truk_tel.toUpperCase();
        break;
      }
      case 'pick_truk_fax': {
        this.record.pick_truk_fax = this.record.pick_truk_fax.toUpperCase();
        break;
      }
      case 'pick_truk_cc': {
        this.record.pick_truk_cc = this.record.pick_truk_cc.toUpperCase();
        break;
      }
      case 'pick_pickup': {
        this.record.pick_pickup = this.record.pick_pickup.toUpperCase();
        break;
      }
      case 'pick_addr1': {
        this.record.pick_addr1 = this.record.pick_addr1.toUpperCase();
        break;
      }
      case 'pick_addr2': {
        this.record.pick_addr2 = this.record.pick_addr2.toUpperCase();
        break;
      }
      case 'pick_addr3': {
        this.record.pick_addr3 = this.record.pick_addr3.toUpperCase();
        break;
      }
      case 'pick_time': {
        this.record.pick_time = this.record.pick_time.toUpperCase();
        break;
      }
      case 'pick_attn': {
        this.record.pick_attn = this.record.pick_attn.toUpperCase();
        break;
      }
      case 'pick_tel': {
        this.record.pick_tel = this.record.pick_tel.toUpperCase();
        break;
      }
      case 'pick_fromname': {
        this.record.pick_fromname = this.record.pick_fromname.toUpperCase();
        break;
      }
      case 'pick_fromaddr1': {
        this.record.pick_fromaddr1 = this.record.pick_fromaddr1.toUpperCase();
        break;
      }
      case 'pick_fromaddr2': {
        this.record.pick_fromaddr2 = this.record.pick_fromaddr2.toUpperCase();
        break;
      }
      case 'pick_fromaddr3': {
        this.record.pick_fromaddr3 = this.record.pick_fromaddr3.toUpperCase();
        break;
      }
      case 'pick_fromaddr4': {
        this.record.pick_fromaddr4 = this.record.pick_fromaddr4.toUpperCase();
        break;
      }
      case 'pick_toname': {
        this.record.pick_toname = this.record.pick_toname.toUpperCase();
        break;
      }
      case 'pick_toaddr1': {
        this.record.pick_toaddr1 = this.record.pick_toaddr1.toUpperCase();
        break;
      }
      case 'pick_toaddr2': {
        this.record.pick_toaddr2 = this.record.pick_toaddr2.toUpperCase();
        break;
      }
      case 'pick_toaddr3': {
        this.record.pick_toaddr3 = this.record.pick_toaddr3.toUpperCase();
        break;
      }
      case 'pick_toaddr4': {
        this.record.pick_toaddr4 = this.record.pick_toaddr4.toUpperCase();
        break;
      }
      case 'pick_desc1': {
        this.record.pick_desc1 = this.record.pick_desc1.toUpperCase();
        break;
      }
      case 'pick_tot_piece1': {
        this.record.pick_tot_piece1 = this.gs.roundNumber(this.record.pick_tot_piece1, 0);
        break;
      }
      case 'pick_uom1': {
        this.record.pick_uom1 = this.record.pick_uom1.toUpperCase();
        break;
      }
      case 'pick_wt1': {
        this.record.pick_wt1 = this.gs.roundNumber(this.record.pick_wt1, 3);
        break;
      }
      case 'pick_cbm_cft1': {
        this.record.pick_cbm_cft1 = this.gs.roundNumber(this.record.pick_cbm_cft1, 3);
        break;
      }
      case 'pick_desc2': {
        this.record.pick_desc2 = this.record.pick_desc2.toUpperCase();
        break;
      }
      case 'pick_tot_piece2': {
        this.record.pick_tot_piece2 = this.gs.roundNumber(this.record.pick_tot_piece2, 0);
        break;
      }
      case 'pick_uom2': {
        this.record.pick_uom2 = this.record.pick_uom2.toUpperCase();
        break;
      }
      case 'pick_wt2': {
        this.record.pick_wt2 = this.gs.roundNumber(this.record.pick_wt2, 3);
        break;
      }
      case 'pick_cbm_cft2': {
        this.record.pick_cbm_cft2 = this.gs.roundNumber(this.record.pick_cbm_cft2, 3);
        break;
      }
      case 'pick_desc3': {
        this.record.pick_desc3 = this.record.pick_desc3.toUpperCase();
        break;
      }
      case 'pick_tot_piece3': {
        this.record.pick_tot_piece3 = this.gs.roundNumber(this.record.pick_tot_piece3, 0);
        break;
      }
      case 'pick_uom3': {
        this.record.pick_uom3 = this.record.pick_uom3.toUpperCase();
        break;
      }
      case 'pick_wt3': {
        this.record.pick_wt3 = this.gs.roundNumber(this.record.pick_wt3, 3);
        break;
      }
      case 'pick_cbm_cft3': {
        this.record.pick_cbm_cft3 = this.gs.roundNumber(this.record.pick_cbm_cft3, 3);
        break;
      }
      case 'pick_desc4': {
        this.record.pick_desc4 = this.record.pick_desc4.toUpperCase();
        break;
      }
      case 'pick_tot_piece4': {
        this.record.pick_tot_piece4 = this.gs.roundNumber(this.record.pick_tot_piece4, 0);
        break;
      }
      case 'pick_uom4': {
        this.record.pick_uom4 = this.record.pick_uom4.toUpperCase();
        break;
      }
      case 'pick_wt4': {
        this.record.pick_wt4 = this.gs.roundNumber(this.record.pick_wt4, 3);
        break;
      }
      case 'pick_cbm_cft4': {
        this.record.pick_cbm_cft4 = this.gs.roundNumber(this.record.pick_cbm_cft4, 3);
        break;
      }
      case 'pick_remark_1': {
        this.record.pick_remark_1 = this.record.pick_remark_1.toUpperCase();
        break;
      }
      case 'pick_remark_2': {
        this.record.pick_remark_2 = this.record.pick_remark_2.toUpperCase();
        break;
      }
      case 'pick_remark_3': {
        this.record.pick_remark_3 = this.record.pick_remark_3.toUpperCase();
        break;
      }
      case 'pick_remark_4': {
        this.record.pick_remark_4 = this.record.pick_remark_4.toUpperCase();
        break;
      }
      case 'freightothers': {
        this.record.freightothers = this.record.freightothers.toUpperCase();
        break;
      }
      case 'exportothers': {
        this.record.exportothers = this.record.exportothers.toUpperCase();
        break;
      }

    }

  }

  SelectDeselect() {
    this.selectdeselect = !this.selectdeselect;
    for (let rec of this.cntrrecords) {
      rec.cntr_selected = this.selectdeselect;
    }
    this.chkallselected = this.selectdeselect;
  }

  Save() {
    this.errorMessage = [];
    if (!this.Allvalid())
      return;


    this.SaveParent();

    const saveRecord = <vm_tbl_cargo_imp_pickup>{};
    saveRecord.record = this.record;
    saveRecord.pkid = this.pkid;
    saveRecord.category = this.pickCategory;
    saveRecord.mode = this.mode;
    saveRecord.userinfo = this.gs.UserInfo;

    this.mainService.Save(saveRecord)
      .subscribe(response => {
        this.mode = 'EDIT';
        if (response.retvalue == false) {
          this.errorMessage.push(response.error);
        }
        else {
          this.errorMessage.push('Save Complete');
          // alert(this.errorMessage);
        }
      }, error => {
        this.errorMessage.push(this.gs.getError(error));
        alert(this.errorMessage);
      });
  }
  private SaveParent() {
    let str = "";
    if (this.record.IS_EXW == true) {
      str += "EXW";
    }
    if (this.record.IS_FOB == true) {
      if (str != "")
        str += ",";
      str += "FOB";
    }
    if (this.record.IS_FCA == true) {
      if (str != "")
        str += ",";
      str += "FCA";
    }
    if (this.record.IS_CPU == true) {
      if (str != "")
        str += ",";
      str += "CPU";
    }
    if (this.record.IS_DDU == true) {
      if (str != "")
        str += ",";
      str += "DDU";
    }
    if (this.record.IS_FRT_OTH == true || this.record.freightothers.trim().length > 1) {
      if (str != "")
        str += ",";
      str += "Others :" + this.record.freightothers.replace(":", "");
    }
    this.record.pick_freight = str;

    str = "";
    if (this.record.IS_Commercial == true) {
      str += "CINV";
    }
    if (this.record.IS_CopyLC == true) {
      if (str != "")
        str += ",";
      str += "CLC";
    }
    if (this.record.IS_Certificate == true) {
      if (str != "")
        str += ",";
      str += "CORG";
    }
    if (this.record.IS_PktList == true) {
      if (str != "")
        str += ",";
      str += "PLST";
    }
    if (this.record.IS_ExDeclaration == true) {
      if (str != "")
        str += ",";
      str += "EDEC";
    }
    if (this.record.IS_Export_OTH == true || this.record.exportothers.trim().length > 1) {
      if (str != "")
        str += ",";
      str += "OTH :" + this.record.exportothers.replace(":", "");
    }
    this.record.pick_export_doc = str;
  }



  LovSelected(_Record: SearchTable) {

    if (_Record.controlname == "TRUCKER") {
      this.record.pick_truk_id = _Record.id;
      this.record.pick_truk_code = _Record.code;
      this.record.pick_truk_name = _Record.name;
      if (_Record.col8.toString() != "")
        this.record.pick_truk_name = _Record.col8.toString();
      this.record.pick_truk_attn = _Record.col5.toString();
      this.record.pick_truk_tel = _Record.col6.toString();
      this.record.pick_truk_fax = _Record.col7.toString();
      // Dispatcher.BeginInvoke(() => { Txt_Truker.Focus(); });
      if (!this.gs.isBlank(this.pick_truk_name_ctrl))
        this.pick_truk_name_ctrl.focus();

    }

    if (_Record.controlname == "FROM") {

      this.record.pick_from_id = _Record.id;
      this.record.pick_from_code = _Record.code;
      this.record.pick_fromname = _Record.name;
      if (_Record.col8.toString() != "")
        this.record.pick_fromname = _Record.col8.toString();
      this.record.pick_fromaddr1 = _Record.col1.toString();
      this.record.pick_fromaddr2 = _Record.col2.toString();
      this.record.pick_fromaddr3 = this.gs.GetTelFax(_Record.col6.toString(), _Record.col7.toString());
      this.record.pick_fromaddr4 = this.gs.GetAttention(_Record.col5.toString())
      //        Dispatcher.BeginInvoke(() => { Txt_From_Name.Focus(); });
      if (!this.gs.isBlank(this.pick_fromname_ctrl))
        this.pick_fromname_ctrl.focus();
    }

    if (_Record.controlname == "TO") {

      this.record.pick_to_id = _Record.id;
      this.record.pick_to_code = _Record.code;
      this.record.pick_toname = _Record.name;
      if (_Record.col8.toString() != "")
        this.record.pick_toname = _Record.col8.toString();
      this.record.pick_toaddr1 = _Record.col1.toString();
      this.record.pick_toaddr2 = _Record.col2.toString();
      this.record.pick_toaddr3 = this.gs.GetTelFax(_Record.col6.toString(), _Record.col7.toString());
      this.record.pick_toaddr4 = this.gs.GetAttention(_Record.col5.toString())
      //        Dispatcher.BeginInvoke(() => { Txt_to_Name.Focus(); });
      if (!this.gs.isBlank(this.pick_toname_ctrl))
        this.pick_toname_ctrl.focus();
    }

  }


  BtnNavigation(action: string) {

    switch (action) {

      case 'DELIVERYORDER-PRINT': {
        this.report_title = 'Delivery Order';
        this.report_url = '/api/Other/DeliveryOrder/GetDeliveryOrderReport';
        this.report_searchdata = this.gs.UserInfo;
        this.report_searchdata.pkid = this.pkid;
        this.report_searchdata.parentid = this.parentid;
        this.report_searchdata.pickcategory = this.pickCategory;
        this.report_searchdata.cntrstoprint = this.deliveryCntrsToPrint;
        this.report_menuid = this.gs.MENU_OT_PICKUP_DELIVERY_ORDER;
        this.tab = 'report';
        break;
      }
      // case 'BLANK-FORMAT': {
      //     this.report_title = 'House Print';
      //     this.report_url = '/api/AirExport/House/GetHAWBBlankReport';
      //     this.report_searchdata = this.gs.UserInfo;
      //     this.report_searchdata.pkid = this.pkid;
      //     this.report_searchdata.invoketype = this.Client_Category;
      //     this.report_searchdata.desc_type = this.DESC_TYPE;
      //     if (this.Client_Category == "SHPR" || this.Client_Category == "CNOR")
      //         this.report_menuid = this.gs.MENU_AE_HOUSE_HAWB_SHIPPER;
      //     else
      //         this.report_menuid = this.gs.MENU_AE_HOUSE_HAWB_CONSIGNEE;
      //     this.tab = 'report';
      //     break;
      // }

    }
  }
  callbackevent(event: any) {
    this.tab = 'main';
  }

  Close() {
    this.location.back();
  }

  printDeliveryOrder() {
    this.deliveryCntrsToPrint = "";
    if (this.pickCategory == "OTHERS") {
      if (this.cntrrecords != null) {
        for (let rec of this.cntrrecords) {
          if (rec.cntr_selected) {
            if (this.deliveryCntrsToPrint.trim() != "")
              this.deliveryCntrsToPrint += ",";
            this.deliveryCntrsToPrint += rec.cntr_no.toString();
          }
        }
      }
    }
    this.BtnNavigation('DELIVERYORDER-PRINT');
  }

}
