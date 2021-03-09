import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { SeaImpCargoPickupService } from '../services/seaimp-cargopickup.service';
import { User_Menu } from '../../core/models/menum';
import { Tbl_cargo_imp_pickup, vm_tbl_cargo_imp_pickup } from '../models/tbl_cargo_imp_pickup';
import { SearchTable } from '../../shared/models/searchtable';
import { strictEqual } from 'assert';
import { Tbl_cargo_imp_container } from '../models/tbl_cargo_imp_housem';
import { InputBoxComponent } from '../../shared/input/inputbox.component';
import { DateComponent } from '../../shared/date/date.component';

@Component({
  selector: 'app-seaimp-cargopickup',
  templateUrl: './seaimp-cargopickup.component.html'
})
export class SeaImpCargoPickupComponent implements OnInit {

  @ViewChild('_pick_order_date') pick_order_date_field: DateComponent;
  @ViewChild('_pick_truk_name') pick_truk_name_field: InputBoxComponent;
  @ViewChild('_pick_fromname') pick_fromname_field: InputBoxComponent;
  @ViewChild('_pick_toname') pick_toname_field: InputBoxComponent;


  record: Tbl_cargo_imp_pickup = <Tbl_cargo_imp_pickup>{};
  defaultrecord: Tbl_cargo_imp_pickup = <Tbl_cargo_imp_pickup>{};
  cntrrecords: Tbl_cargo_imp_container[] = [];
  // 17-07-2019 Created By Ajith  

  tab: string = 'main';
  report_title: string = '';
  report_url: string = '';
  report_searchdata: any = {};
  report_menuid: string = '';

  origin: string = '';
  pkid: string;
  menuid: string;
  mode: string;
  title: string = '';
  isAdmin: boolean;
  chkallselected: boolean = false;
  selectdeselect: boolean = false;
  errorMessage: string;
  IsLocked: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: SeaImpCargoPickupService,
  ) { }

  ngOnInit() {
    const options = JSON.parse(this.route.snapshot.queryParams.parameter);
    this.pkid = options.pkid;
    this.menuid = options.menuid;
    this.origin = options.origin;
    this.IsLocked = options.is_locked;
    this.mode = 'EDIT';
    this.initPage();
    this.actionHandler();
  }

  private initPage() {
    this.title = 'Delivery Order';
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.errorMessage = '';
    this.LoadCombo();
  }

  LoadCombo() {

  }

  NewRecord() {
    this.mode = 'ADD'
    this.actionHandler();
  }

  actionHandler() {
    this.errorMessage = '';
    if (this.mode == 'ADD') {
      this.record = <Tbl_cargo_imp_pickup>{};
      //this.cntrrecords = <Tbl_cargo_imp_container[]>[];
      this.init();
      this.LoadDefault();
    }
    if (this.mode == 'EDIT') {
      this.GetRecord();
    }
  }

  init() {

    this.record.pick_parentid = this.pkid;
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
    this.record.pick_terms_ship = 'OCEAN';
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
    this.record.pick_order_date = '';
    this.record.pick_is_delivery_sent = false;
    this.record.pick_delivery_date = '';
    this.record.pick_vessel = '';
    this.record.pick_voyage = '';

  }

  GetRecord() {
    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;
    SearchData.origin = this.origin;
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.chkallselected = false;
        this.selectdeselect = false;
        this.cntrrecords = <Tbl_cargo_imp_container[]>response.cntrrecords;
        this.mode = response.mode;
        if (this.mode == 'ADD') {
          this.defaultrecord = <Tbl_cargo_imp_pickup>response.defaultrecord;
          this.actionHandler();
        }
        else {
          let str: string = "";
          var sData = null;
          this.record = <Tbl_cargo_imp_pickup>response.record;

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
          this.SelectDeselect();
          //cmd_cntr_selectAll_Click(null, null);
        }
        this.pick_order_date_field.Focus();
      }, error => {
        this.errorMessage = this.gs.getError(error);
      });
  }
  private LoadDefault() {
    this.pick_order_date_field.Focus();
    if (this.defaultrecord == null)
      return;

    this.record.pick_orderno = this.GetStrVal(this.defaultrecord.pick_orderno);
    this.record.pick_order_date = this.GetStrVal(this.gs.defaultValues.today);
    this.record.pick_pickup = this.GetStrVal(this.defaultrecord.pick_pickup);
    this.record.pick_addr1 = this.GetStrVal(this.defaultrecord.pick_addr1);
    this.record.pick_addr2 = this.GetStrVal(this.defaultrecord.pick_addr2);
    this.record.pick_addr3 = this.GetStrVal(this.defaultrecord.pick_addr3);
    this.record.pick_tel = this.GetTelNumberOnly(this.defaultrecord.pick_tel);
    this.record.pick_from_id = this.GetStrVal(this.defaultrecord.pick_from_id);
    this.record.pick_from_code = this.GetStrVal(this.defaultrecord.pick_from_code);
    this.record.pick_fromname = this.GetStrVal(this.defaultrecord.pick_fromname);
    this.record.pick_fromaddr1 = this.GetStrVal(this.defaultrecord.pick_fromaddr1);
    this.record.pick_fromaddr2 = this.GetStrVal(this.defaultrecord.pick_fromaddr2);
    this.record.pick_fromaddr3 = this.GetStrVal(this.defaultrecord.pick_fromaddr3);
    this.record.pick_fromaddr4 = this.GetStrVal(this.defaultrecord.pick_fromaddr4);
    this.record.pick_to_id = this.GetStrVal(this.defaultrecord.pick_to_id);
    this.record.pick_to_code = this.GetStrVal(this.defaultrecord.pick_to_code);
    this.record.pick_toname = this.GetStrVal(this.defaultrecord.pick_toname);
    this.record.pick_toaddr1 = this.GetStrVal(this.defaultrecord.pick_toaddr1);
    this.record.pick_toaddr2 = this.GetStrVal(this.defaultrecord.pick_toaddr2);
    this.record.pick_toaddr3 = this.GetStrVal(this.defaultrecord.pick_toaddr3);
    this.record.pick_toaddr4 = this.GetStrVal(this.defaultrecord.pick_toaddr4);
    this.record.pick_desc1 = this.GetStrVal(this.defaultrecord.pick_desc1);
    this.record.pick_tot_piece1 = this.GetNumVal(this.defaultrecord.pick_tot_piece1);
    if (this.gs.BRANCH_REGION == "USA")
      this.record.pick_wt1 = this.GetNumVal(this.defaultrecord.pick_wt1); // hbl_lbs;
    else
      this.record.pick_wt1 = this.GetNumVal(this.defaultrecord.pick_wt2); // hbl_weight;

    this.record.pick_cbm_cft1 = this.GetNumVal(this.defaultrecord.pick_cbm_cft1);
    this.record.pick_uom1 = this.GetStrVal(this.defaultrecord.pick_uom1);
    this.record.pick_remark_1 = "PLEASE CONTACT CONSIGNEE FOR DELIVERY APPOINTMENT!";
    this.record.pick_vessel = this.GetStrVal(this.defaultrecord.pick_vessel);
    this.record.pick_voyage = this.GetStrVal(this.defaultrecord.pick_voyage);
    this.record.pick_terms_ship = this.GetStrVal(this.defaultrecord.pick_terms_ship);
    if (this.gs.company_code != "MNYC") {
      this.record.pick_truk_code = this.GetStrVal(this.defaultrecord.pick_truk_code);
      this.record.pick_truk_name = this.GetStrVal(this.defaultrecord.pick_truk_name);
      this.record.pick_truk_id = this.GetStrVal(this.defaultrecord.pick_truk_id);
      this.record.pick_truk_attn = this.GetStrVal(this.defaultrecord.pick_truk_attn);
      this.record.pick_truk_tel = this.GetStrVal(this.defaultrecord.pick_truk_tel);
      this.record.pick_truk_fax = this.GetStrVal(this.defaultrecord.pick_truk_fax);
      this.record.pick_truk_cc = this.GetStrVal(this.defaultrecord.pick_truk_cc);
      this.record.pick_remark_1 = this.GetStrVal(this.defaultrecord.pick_remark_1);
      this.record.pick_remark_2 = this.GetStrVal(this.defaultrecord.pick_remark_2);
      this.record.pick_remark_3 = this.GetStrVal(this.defaultrecord.pick_remark_3);
      this.record.pick_remark_4 = this.GetStrVal(this.defaultrecord.pick_remark_4);
    }

  }

  GetStrVal(_obj: any) {
    if (_obj == null || _obj == undefined)
      _obj = "";
    return _obj;
  }
  GetNumVal(_obj: any) {
    if (_obj == null || _obj == undefined)
      _obj = 0;
    return _obj;
  }
  private GetTelNumberOnly(sValue: string) {
    try {
      if (sValue.trim().length <= 0)
        return sValue;

      if (sValue.toUpperCase().includes("FAX")) {
        var NewStr = sValue.split(' ');
        sValue = "";
        for (let k = 0; k < NewStr.length; k++) {
          if (NewStr[k].toUpperCase().includes("FAX"))
            break;
          if (sValue != "")
            sValue += " ";
          sValue += NewStr[k];
        }
      }

      return sValue;
    }
    catch (Exception) {
      return sValue;
    }
  }




  Save() {

    if (!this.Allvalid())
      return;

    this.SaveParent();

    const saveRecord = <vm_tbl_cargo_imp_pickup>{};
    saveRecord.record = this.record;
    saveRecord.pkid = this.pkid;
    saveRecord.userinfo = this.gs.UserInfo;

    this.mainService.Save(saveRecord)
      .subscribe(response => {
        this.mode = response.mode;
        if (response.retvalue == false) {
          this.errorMessage = response.error;
          alert(this.errorMessage);
        }
        else {
           this.errorMessage = 'Save Complete';
          // alert(this.errorMessage);
        }
      }, error => {
        this.errorMessage = this.gs.getError(error);
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
  private Allvalid(): boolean {

    var bRet = true;
    this.errorMessage = "";
    if (this.record.pick_parentid == "") {
      bRet = false;
      this.errorMessage = "Invalid ID";
      alert(this.errorMessage);
      return bRet;
    }

    if (this.record.pick_truk_id == "") {
      this.errorMessage = "Truker Code cannot be empty";
      alert(this.errorMessage);
      //  Txt_Truker_Code.TxtLovBox.Focus();
      return false;
    }
    if (this.record.pick_truk_name == "") {
      this.errorMessage = "Truker Name cannot be empty";
      alert(this.errorMessage);
      //    Txt_Truker.Focus();
      return false;
    }
    if (this.record.pick_pickup == "") {
      this.errorMessage = "Pick-up  cannot be empty";
      alert(this.errorMessage);
      //  Txt_Pickup.Focus();
      return false;
    }
    if (this.record.pick_addr1 == "") {
      this.errorMessage = "Pick-up address cannot be empty";
      alert(this.errorMessage);
      //Txt_Pick_Addr1.Focus();
      return false;
    }
    if (this.record.pick_toname == "") {
      this.errorMessage = "To Name cannot be empty"
      alert(this.errorMessage);
      // Txt_To_Name.Focus();
      return false;
    }
    if (this.record.pick_toaddr1 == "") {
      this.errorMessage = "To address cannot be empty"
      alert(this.errorMessage);
      // Txt_To_Addr1.Focus();
      return false;
    }
    if (this.record.pick_danger_goods == '') {
      this.errorMessage = "Dangerous goods not selected"
      alert(this.errorMessage);
      // cmb_Danger_Goods.Focus();
      return false;
    }
    if (this.record.pick_terms_ship == '') {
      this.errorMessage = "Terms of shipment not selected";
      alert(this.errorMessage);
      // cmb_Term_shipment.Focus();
      return false;
    }

    return bRet;
  }


  Close() {
    this.location.back();
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
      this.pick_truk_name_field.focus();
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
      this.pick_fromname_field.focus();
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
      this.pick_toname_field.focus();
    }

  }

  onFocusout(field: string) {

    switch (field) {
      //   case 'mbl_no': {
      //     this.IsBLDupliation('MBL', this.record.mbl_no);
      //     break;
      //   }
    }
  }


  onBlur(field: string) {
    switch (field) {

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
      case 'pick_vessel': {
        this.record.pick_vessel = this.record.pick_vessel.toUpperCase();
        break;
      }
      case 'pick_voyage': {
        this.record.pick_voyage = this.record.pick_voyage.toUpperCase();
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

  DeliveryRptPrint() {
    let cntr2print = "";
    if (this.cntrrecords != null) {
      this.cntrrecords.forEach(Rec => {
        if (Rec.cntr_selected) {
          if (cntr2print != "")
            cntr2print += ",";
          cntr2print += Rec.cntr_no;
        }
      })
    }
    this.report_title = 'DELIVERY ORDER';
    this.report_url = '/api/SeaImport/House/GetDeliveryReport';
    this.report_searchdata = this.gs.UserInfo;
    this.report_searchdata.pkid = this.pkid;
    this.report_searchdata.cntrs = cntr2print;
    if (this.origin == "seaimp-master-page") {
      this.report_searchdata.invokefrom = 'MASTER';
      this.report_menuid = this.gs.MENU_SI_MASTER_DELIVERY_ORDER;
    } else {
      this.report_searchdata.invokefrom = 'HOUSE';
      this.report_menuid = this.gs.MENU_SI_HOUSE_DELIVERY_ORDER;
    }

    this.tab = 'report';
  }
  callbackevent(event: any) {
    this.tab = 'main';
  }

}
