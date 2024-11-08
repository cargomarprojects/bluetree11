import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../../core/services/global.service';

import { PartyService } from '../../services/party.service';
import { User_Menu } from '../../../core/models/menum';
import { Tbl_Mast_Partym, vm_Tbl_Mast_Partym } from '../../models/Tbl_Mast_Partym';
import { SearchTable } from '../../../shared/models/searchtable';
import { Tbl_Mast_Contacts } from '../../../marketing/models/tbl_cargo_journals_master';
//EDIT-AJITH-06-09-2021
//EDIT-AJITH-04-10-2021

@Component({
  selector: 'app-party-edit',
  templateUrl: './party-edit.component.html'
})
export class PartyEditComponent implements OnInit {

  @ViewChild('mbl_no') mbl_no_field: ElementRef;
  //@ViewChild('mbl_liner_bookingno') mbl_liner_bookingno_field: ElementRef;

  record: Tbl_Mast_Partym = <Tbl_Mast_Partym>{};
  records: Tbl_Mast_Contacts[] = [];
  /*
    01-07-2019 Created By Ajith  
  */

  locationList: any[] = [];

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

  SetAddressToLine: string = "";
  selectedRowIndex: number = -1;
  selectedId: string = '';

  private pkid: string = "";
  private menuid: string;
  private type: string = '';
  private origin: string = '';

  private ms_type = "";
  private ms_from = "";
  private ms_name = "";

  private mode: string;

  private errorMessage: string;

  private closeCaption: string = 'Return';

  private title: string;
  private isAdmin: boolean = false;
  private isCompany: boolean = false;

  private cmbList = {};

  //IsLocked: boolean = false;
  is_locked: boolean = false;
  gen_branch_b: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: PartyService,
  ) { }

  ngOnInit() {
    this.gs.checkAppVersion();
    if (this.route.snapshot.queryParams.parameter == null) {
      this.pkid = this.route.snapshot.queryParams.pkid;
      this.menuid = this.route.snapshot.queryParams.menuid;
      this.mode = this.route.snapshot.queryParams.mode;
      this.type = this.route.snapshot.queryParams.type;
      this.origin = this.route.snapshot.queryParams.origin;
      if (this.origin === "EXTERNAL") {
        this.ms_type = this.route.snapshot.queryParams.ms_type;
        this.ms_from = this.route.snapshot.queryParams.ms_from;
        this.ms_name = this.route.snapshot.queryParams.ms_name;
        this.ms_name = this.ms_name.replace("#", ",");
      }
    } else {
      const options = JSON.parse(this.route.snapshot.queryParams.parameter);
      this.pkid = options.pkid;
      this.menuid = options.menuid;
      this.mode = options.mode;
      this.type = options.type;
      this.origin = options.origin;
      if (this.origin === "EXTERNAL") {
        this.ms_type = options.ms_type;
        this.ms_from = options.ms_from;
        this.ms_name = options.ms_name;
        this.ms_name = this.ms_name.replace("#", ",");
      }
    }

    this.closeCaption = 'Return';
    this.initPage();
    this.actionHandler();
  }

  private initPage() {
    this.gs.checkAppVersion();
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.isCompany = this.gs.IsCompany(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.locationList = <any[]>[];
    this.gs.CompanyList.forEach(rec => {
      if (rec.comp_code != "ALL")
        this.locationList.push(rec);
    });
    this.errorMessage = '';
  }


  NewRecord() {
    this.mode = 'ADD'
    this.actionHandler();
  }

  actionHandler() {
    this.errorMessage = '';
    this.is_locked = false;
    if (this.mode == 'ADD') {
      this.record = <Tbl_Mast_Partym>{};
      this.records = <Tbl_Mast_Contacts[]>[];
      this.pkid = this.gs.getGuid();
      this.init();
      if (this.origin === "EXTERNAL") {
        if (this.ms_type == "AGENT") {
          this.record.gen_short_name = this.ms_name;
          this.record.gen_name = this.ms_name;
        }
        if (this.ms_type == "SHIPPER" || this.ms_type == "CONSIGNEE" || this.ms_type == "NOTIFY")
          this.LoadMissingData();
      }
    }
    if (this.mode == 'EDIT') {
      this.GetRecord();
    }
  }

  init() {
    this.record.gen_pkid = this.pkid;
    this.record.rec_created_by = this.gs.user_code;
    this.record.rec_created_date = this.gs.defaultValues.today;
    this.record.gen_code = '';
    this.record.gen_name = '';
    this.record.gen_short_name = '';
    this.record.gen_address1 = '';
    this.record.gen_address2 = '';
    this.record.gen_address3 = '';
    this.record.gen_address4 = '';
    this.record.gen_location = '';
    this.record.gen_state = '';
    this.record.gen_contact = '';
    this.record.gen_title = '';
    this.record.gen_title = '';
    this.record.gen_tel = '';
    this.record.gen_mobile = '';
    this.record.gen_fax = '';
    this.record.gen_refer_by = '';
    this.record.gen_ctpat_no = '';
    this.record.gen_web = '';
    this.record.gen_email = '';
    this.record.gen_pincode = '';
    this.record.gen_firm_code = '';
    this.record.gen_einirsno = '';
    this.record.gen_cha_code = '';
    this.record.gen_cha_id = '';
    this.record.gen_parent_name = '';
    this.record.gen_parent_id = '';
    this.record.gen_curr_code = '';
    this.record.gen_is_importer = 'N';
    this.record.gen_is_exporter = 'N';
    this.record.gen_is_terminal = 'N';
    this.record.gen_is_terminal2 = 'N';
    this.record.gen_is_shipper = 'N';
    this.record.gen_is_consignee = 'N';
    this.record.gen_is_cha = 'N';
    this.record.gen_is_forwarder = 'N';
    this.record.gen_is_agent = 'N';
    this.record.gen_is_carrier = 'N';
    this.record.gen_is_trucker = 'N';
    this.record.gen_is_vendor = 'N';
    this.record.gen_is_warehouse = 'N';
    this.record.gen_is_miscellaneous = 'N';
    this.record.gen_is_employees = 'N';
    this.record.gen_is_tbd = 'N';
    this.record.gen_is_bank = 'N';
    this.record.gen_is_carrier2_sea = 'N';
    this.record.gen_is_shipper_vendor = 'N';
    this.record.gen_is_contractor = 'N';
    this.record.gen_is_ctpat = 'N';
    this.record.gen_days = '';
    this.record.gen_nomination = 'N/A';
    this.record.gen_priority = '0';
    this.record.gen_brokers = '';
    this.record.gen_poa_customs_yn = 'N';
    this.record.gen_poa_isf_yn = 'N';
    this.record.gen_bond_yn = 'N';
    this.record.gen_purch_from = '';
    this.record.gen_bondno = '';
    this.record.gen_country_name = '';
    this.record.gen_country_id = '';
    this.record.gen_salesman_name = '';
    this.record.gen_salesman_id = '';
    this.record.gen_handled_name = '';
    this.record.gen_handled_id = '';
    this.record.gen_bond_expdt = '';
    this.record.gen_chb_name = '';
    this.record.gen_chb_add1 = '';
    this.record.gen_chb_add2 = '';
    this.record.gen_chb_add3 = '';
    this.record.gen_chb_contact = '';
    this.record.gen_chb_tel = '';
    this.record.gen_chb_fax = '';
    this.record.gen_chb_email = '';
    this.record.gen_criteria = 'NIL';
    this.record.gen_min_profit = '';
    this.record.gen_branch = 'ALL';
    this.record.gen_protected = 'N';
    this.record.gen_is_actual_vendor = 'N';
    this.record.gen_is_splac = 'N';
    this.record.gen_splac_memo = '';
    this.record.gen_is_blackac = 'N';
    this.record.gen_handled_loc_id = '';
    this.record.gen_cust_group_id = '';
    this.record.gen_is_acc_alert = 'N';
    this.record.gen_marketing_mail = 'N';

    this.gen_branch_b = false;
    this.record.gen_is_importer_b = false;
    this.record.gen_is_exporter_b = false;
    this.record.gen_is_terminal_b = false;
    this.record.gen_is_terminal2_b = false;
    this.record.gen_is_shipper_b = false;
    this.record.gen_is_consignee_b = false;
    this.record.gen_is_cha_b = false;
    this.record.gen_is_forwarder_b = false;
    this.record.gen_is_agent_b = false;
    this.record.gen_is_carrier_b = false;
    this.record.gen_is_trucker_b = false;
    this.record.gen_is_vendor_b = false;
    this.record.gen_is_warehouse_b = false;
    this.record.gen_is_miscellaneous_b = false;
    this.record.gen_is_employees_b = false;
    this.record.gen_is_tbd_b = false;
    this.record.gen_is_bank_b = false;
    this.record.gen_is_carrier2_sea_b = false;
    this.record.gen_is_shipper_vendor_b = false;
    this.record.gen_is_contractor_b = false;
    this.record.gen_is_ctpat_b = false;
    this.record.gen_poa_customs_yn_b = false;
    this.record.gen_poa_isf_yn_b = false;
    this.record.gen_bond_yn_b = false;
    this.record.gen_marketing_mail_b = false;
    // this.record.gen_carrier_email = '';
    this.gs.IsAdmin

    // if (this.gs.JOB_TYPE_AI.length > 0) {
    //   // if (JobList.Count > 0)
    //   //     Cmb_JobType.SelectedIndex = 0; 
    // }
  }

  GetRecord() {

    let profitamt: number = 0;

    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;
    SearchData.type = this.type;

    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.record = <Tbl_Mast_Partym>response.record;
        this.records = (response.records == undefined || response.records == null) ? <Tbl_Mast_Contacts[]>[] : <Tbl_Mast_Contacts[]>response.records;
        this.mode = 'EDIT';
        this.record.gen_is_shipper_b = (this.record.gen_is_shipper == "Y") ? true : false;
        this.record.gen_is_consignee_b = (this.record.gen_is_consignee == "Y") ? true : false;
        this.record.gen_is_importer_b = (this.record.gen_is_importer == "Y") ? true : false;
        this.record.gen_is_exporter_b = (this.record.gen_is_exporter == "Y") ? true : false;
        this.record.gen_is_cha_b = (this.record.gen_is_cha == "Y") ? true : false;
        this.record.gen_is_forwarder_b = (this.record.gen_is_forwarder == "Y") ? true : false;
        this.record.gen_is_agent_b = (this.record.gen_is_agent == "Y") ? true : false;
        this.record.gen_is_carrier_b = (this.record.gen_is_carrier == "Y") ? true : false;
        this.record.gen_is_carrier2_sea_b = (this.record.gen_is_carrier2_sea == "Y") ? true : false;
        this.record.gen_is_trucker_b = (this.record.gen_is_trucker == "Y") ? true : false;
        this.record.gen_is_warehouse_b = (this.record.gen_is_warehouse == "Y") ? true : false;
        this.record.gen_is_terminal_b = (this.record.gen_is_terminal == "Y") ? true : false;
        this.record.gen_is_terminal2_b = (this.record.gen_is_terminal2 == "Y") ? true : false;
        this.record.gen_is_shipper_vendor_b = (this.record.gen_is_shipper_vendor == "Y") ? true : false;
        this.record.gen_is_vendor_b = (this.record.gen_is_vendor == "Y") ? true : false;
        this.record.gen_is_employees_b = (this.record.gen_is_employees == "Y") ? true : false;
        this.record.gen_is_contractor_b = (this.record.gen_is_contractor == "Y") ? true : false;
        this.record.gen_is_miscellaneous_b = (this.record.gen_is_miscellaneous == "Y") ? true : false;
        this.record.gen_is_tbd_b = (this.record.gen_is_tbd == "Y") ? true : false;
        this.record.gen_is_bank_b = (this.record.gen_is_bank == "Y") ? true : false;
        this.record.gen_is_splac_b = (this.record.gen_is_splac == "Y") ? true : false;
        this.record.gen_is_ctpat_b = (this.record.gen_is_ctpat == "Y") ? true : false;
        this.record.gen_is_actual_vendor_b = (this.record.gen_is_actual_vendor == "Y") ? true : false;
        this.record.gen_is_blackac_b = (this.record.gen_is_blackac == "Y") ? true : false;
        this.record.gen_poa_customs_yn_b = (this.record.gen_poa_customs_yn == "Y") ? true : false;
        this.record.gen_poa_isf_yn_b = (this.record.gen_poa_isf_yn == "Y") ? true : false;
        this.record.gen_bond_yn_b = (this.record.gen_bond_yn == "Y") ? true : false;
        this.record.gen_marketing_mail_b = (this.record.gen_marketing_mail == "Y") ? true : false;

        profitamt = +this.record.gen_min_profit;
        if (profitamt <= 0)
          this.record.gen_min_profit = '';

        // this.gen_branch_b = false;
        // if (this.record.gen_branch == "" || this.record.gen_branch == "ALL") {
        //   this.gen_branch_b = false;
        //   this.record.gen_branch = '';
        // }
        // else {
        //   this.gen_branch_b = true;
        // }

        if (this.gs.isBlank(this.record.gen_branch))
          this.record.gen_branch = "ALL";


      }, error => {
        this.errorMessage = this.gs.getError(error);
      });
  }


  Save() {
    let Type2: string = "";
    let WarninMsg: string = "";

    if (!this.Allvalid()) {
      if (this.errorMessage)
        alert(this.errorMessage);
      return;
    }

    WarninMsg = this.WarningMessage();
    if (WarninMsg == "")
      WarninMsg = "Save";

    if (!confirm(WarninMsg)) {
      return;
    }
    this.record.gen_type = this.type;
    this.record.gen_is_shipper = this.record.gen_is_shipper_b ? 'Y' : 'N';
    this.record.gen_is_consignee = this.record.gen_is_consignee_b ? 'Y' : 'N';
    this.record.gen_is_importer = this.record.gen_is_importer_b ? 'Y' : 'N';
    this.record.gen_is_exporter = this.record.gen_is_exporter_b ? 'Y' : 'N';
    this.record.gen_is_cha = this.record.gen_is_cha_b ? 'Y' : 'N';
    this.record.gen_is_forwarder = this.record.gen_is_forwarder_b ? 'Y' : 'N';
    this.record.gen_is_agent = this.record.gen_is_agent_b ? 'Y' : 'N';
    this.record.gen_is_carrier = this.record.gen_is_carrier_b ? 'Y' : 'N';
    this.record.gen_is_carrier2_sea = this.record.gen_is_carrier2_sea_b ? 'Y' : 'N';
    this.record.gen_is_trucker = this.record.gen_is_trucker_b ? 'Y' : 'N';
    this.record.gen_is_warehouse = this.record.gen_is_warehouse_b ? 'Y' : 'N';
    this.record.gen_is_terminal = this.record.gen_is_terminal_b ? 'Y' : 'N';
    this.record.gen_is_terminal2 = this.record.gen_is_terminal2_b ? 'Y' : 'N';
    this.record.gen_is_shipper_vendor = this.record.gen_is_shipper_vendor_b ? 'Y' : 'N';
    this.record.gen_is_vendor = this.record.gen_is_vendor_b ? 'Y' : 'N';
    this.record.gen_is_employees = this.record.gen_is_employees_b ? 'Y' : 'N';
    this.record.gen_is_contractor = this.record.gen_is_contractor_b ? 'Y' : 'N';
    this.record.gen_is_miscellaneous = this.record.gen_is_miscellaneous_b ? 'Y' : 'N';
    this.record.gen_is_tbd = this.record.gen_is_tbd_b ? 'Y' : 'N';
    this.record.gen_is_bank = this.record.gen_is_bank_b ? 'Y' : 'N';
    this.record.gen_is_splac = this.record.gen_is_splac_b ? 'Y' : 'N';
    this.record.gen_is_ctpat = this.record.gen_is_ctpat_b ? 'Y' : 'N';
    this.record.gen_is_actual_vendor = this.record.gen_is_actual_vendor_b ? 'Y' : 'N';
    this.record.gen_is_blackac = this.record.gen_is_blackac_b ? 'Y' : 'N';
    this.record.gen_poa_customs_yn = this.record.gen_poa_customs_yn_b ? 'Y' : 'N';
    this.record.gen_poa_isf_yn = this.record.gen_poa_isf_yn_b ? 'Y' : 'N';
    this.record.gen_bond_yn = this.record.gen_bond_yn_b ? 'Y' : 'N';
    this.record.gen_marketing_mail = this.record.gen_marketing_mail_b ? 'Y' : 'N';

    if (this.record.gen_is_shipper_b)
      Type2 += "S";
    if (this.record.gen_is_consignee_b)
      Type2 += "C";
    if (this.record.gen_is_cha_b)
      Type2 += "B";
    if (this.record.gen_is_forwarder_b)
      Type2 += "F";
    if (this.record.gen_is_agent_b)
      Type2 += "A";
    if (this.record.gen_is_carrier_b)
      Type2 += "L";
    if (this.record.gen_is_carrier2_sea_b)
      Type2 += "R";
    if (this.record.gen_is_vendor_b)
      Type2 += "V";
    if (this.record.gen_is_trucker_b)
      Type2 += "T";
    if (this.record.gen_is_warehouse_b)
      Type2 += "W";
    if (this.record.gen_is_miscellaneous_b)
      Type2 += "M";
    if (this.record.gen_is_employees_b)
      Type2 += "E";
    if (this.record.gen_is_shipper_vendor_b)
      Type2 += "H";
    if (this.record.gen_is_contractor_b)
      Type2 += "O";
    if (this.record.gen_is_tbd_b)
      Type2 += "D";
    if (this.record.gen_is_importer_b)
      Type2 += "I";
    if (this.record.gen_is_exporter_b)
      Type2 += "X";
    if (this.record.gen_is_terminal_b)
      Type2 += "N";
    if (this.record.gen_is_terminal2_b)
      Type2 += "P";
    if (this.record.gen_is_bank_b)
      Type2 += "K";

    this.record.gen_type2 = Type2;

    const saveRecord = <vm_Tbl_Mast_Partym>{};
    saveRecord.record = this.record;
    saveRecord.records = this.records;
    saveRecord.mode = this.mode;
    saveRecord.userinfo = this.gs.UserInfo;

    this.mainService.Save(saveRecord)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage = response.error;
          alert(this.errorMessage);
        }
        else {
          if (this.mode == "ADD" && response.code != '')
            this.record.gen_code = response.code;
          this.mode = 'EDIT';
          // this.errorMessage = 'Save Complete';
          // alert(this.errorMessage);
          alert('Save Complete');
          this.mainService.RefreshList(this.record);
        }
      }, error => {
        this.errorMessage = this.gs.getError(error);
        alert(this.errorMessage);
      });
  }


  private Allvalid(): boolean {

    var bRet = true;
    let IsCategory: boolean = false;

    this.errorMessage = "";
    if (this.gs.isBlank(this.record.gen_short_name)) {
      bRet = false;
      this.errorMessage = "Name cannot be empty";
      return bRet;
    }
    if (this.gs.isBlank(this.record.gen_name)) {
      bRet = false;
      this.errorMessage = "Official Name cannot be empty";
      return bRet;
    }

    if (this.gs.isBlank(this.record.gen_country_id) || this.gs.isBlank(this.record.gen_country_code)) {
      bRet = false;
      this.errorMessage = "Country cannot be empty";
      return bRet;
    }

    if (this.gs.BRANCH_REGION != "USA") {
      if (this.gs.isBlank(this.record.gen_curr_code)) {
        bRet = false;
        this.errorMessage = "Currency Code Cannot Be Emty";
        return bRet;
      }

      if (!this.gs.isBlank(this.record.gen_curr_code)) {
        if (this.record.gen_curr_code != this.gs.base_cur_code && this.record.gen_curr_code != this.gs.foreign_cur_code) {
          bRet = false;
          this.errorMessage = "Invalid Currency Code";
          return bRet;
        }
      }
    }

    IsCategory = false;
    if (this.record.gen_is_shipper_b)
      IsCategory = true;
    else if (this.record.gen_is_consignee_b)
      IsCategory = true;
    else if (this.record.gen_is_cha_b)
      IsCategory = true;
    else if (this.record.gen_is_forwarder_b)
      IsCategory = true;
    else if (this.record.gen_is_agent_b)
      IsCategory = true;
    else if (this.record.gen_is_carrier_b)
      IsCategory = true;
    else if (this.record.gen_is_carrier2_sea_b)
      IsCategory = true;
    else if (this.record.gen_is_vendor_b)
      IsCategory = true;
    else if (this.record.gen_is_trucker_b)
      IsCategory = true;
    else if (this.record.gen_is_warehouse_b)
      IsCategory = true;
    else if (this.record.gen_is_miscellaneous_b)
      IsCategory = true;
    else if (this.record.gen_is_employees_b)
      IsCategory = true;
    else if (this.record.gen_is_shipper_vendor_b)
      IsCategory = true;
    else if (this.record.gen_is_contractor_b)
      IsCategory = true;
    else if (this.record.gen_is_tbd_b)
      IsCategory = true;
    else if (this.record.gen_is_importer_b)
      IsCategory = true;
    else if (this.record.gen_is_exporter_b)
      IsCategory = true;
    else if (this.record.gen_is_terminal_b)
      IsCategory = true;
    else if (this.record.gen_is_terminal2_b)
      IsCategory = true;
    else if (this.record.gen_is_bank_b)
      IsCategory = true;

    if (!IsCategory) {
      bRet = false;
      this.errorMessage = "Client Category not selected";
      return bRet;
    }

    //Email validation chked in contoller

    return bRet;
  }

  private WarningMessage(): string {
    let warningMsg: string = "";
    if (this.gs.company_code == "MNYC") {
      if (this.record.gen_is_consignee_b && this.record.gen_country_code == "US") {
        if (this.gs.isBlank(this.record.gen_chb_name) || this.gs.isBlank(this.record.gen_chb_add1)) {
          warningMsg = "CHB is blank. Please check House / Notify Party.";
        }
      }
    }
    if (warningMsg)
      warningMsg += "\nDo you want to Save ?";

    return warningMsg;
  }


  Close() {
    this.location.back();
  }

  LovSelected(_Record: SearchTable) {

    if (_Record.controlname == "PARENT") {
      this.record.gen_parent_id = _Record.id;
      this.record.gen_parent_name = _Record.name;
    }
    if (_Record.controlname == "COUNTRY") {
      this.record.gen_country_id = _Record.id;
      this.record.gen_country_name = _Record.name;
      this.record.gen_country_code = _Record.code;
    }
    if (_Record.controlname == "HANDLEDBY") {
      this.record.gen_handled_id = _Record.id;
      this.record.gen_handled_name = _Record.name;
      this.record.gen_handled_code = _Record.code;
    }
    if (_Record.controlname == "SALESMAN") {
      this.record.gen_salesman_id = _Record.id;
      this.record.gen_salesman_name = _Record.name;
      this.record.gen_salesman_code = _Record.code;
    }
    if (_Record.controlname == "CHB") {
      this.record.gen_cha_id = _Record.id;
      this.record.gen_cha_code = _Record.code;
      this.record.gen_chb_name = _Record.name;
      this.record.gen_chb_add1 = _Record.col1;
      this.record.gen_chb_add2 = _Record.col2;
      this.record.gen_chb_add3 = _Record.col3;
      this.record.gen_chb_email = _Record.col4;
      this.record.gen_chb_contact = _Record.col5;
      this.record.gen_chb_tel = _Record.col6;
      this.record.gen_chb_fax = _Record.col7;
    }



  }

  LovSelected2(_Record: SearchTable, rec: Tbl_Mast_Contacts) {
    if (_Record.controlname == "CONTACT GROUP") {
      rec.cont_group_id = _Record.id;
      rec.cont_group_name = _Record.name;
    }
  }

  onFocusout(field: string) {

    switch (field) {
      case 'mbl_no': {
        // this.IsBLDupliation('MBL', this.record.mbl_no);
        // break;
      }
    }
  }


  onBlur(field: string) {
    switch (field) {
      case 'gen_pincode': {
        this.record.gen_pincode = this.record.gen_pincode.toUpperCase();
        break;
      }
      case 'gen_short_name': {
        this.record.gen_name = this.record.gen_short_name;
        break;
      }

    }
  }

  BtnNavigation2(action: string, _type: string, attachmodal: any = null) {
    if (action == "MEMO") {
      if (_type == "L")
        return '/Silver.BusinessModule/XmlRemarksPage';
      if (_type == 'P')
        return {
          appid: this.gs.appid,
          menuid: this.menuid,
          pkid: this.pkid,
          source: 'PARTY-MEMO',
          title: 'Memo',
          origin: 'party-page'
        };
    }
    else if (action == "PARENT-MEMO") {
      if (_type == "L")
        return '/Silver.BusinessModule/XmlRemarksPage';
      if (_type == 'P')
        return {
          appid: this.gs.appid,
          menuid: this.menuid,
          pkid: this.record.gen_parent_id,
          source: 'PARENT-MEMO',
          title: 'Parent Memo',
          origin: 'party-page'
        };
    } else if (action == "SOP-MEMO") {
      if (_type == "L")
        return '/Silver.BusinessModule/XmlRemarksPage';
      if (_type == 'P')
        return {
          appid: this.gs.appid,
          menuid: this.menuid,
          pkid: this.pkid,
          source: 'SOP-MEMO',
          title: 'SOP Memo',
          origin: 'party-page'
        };
    } else if (action == "QUOTN-MEMO") {
      if (_type == "L")
        return '/Silver.BusinessModule/XmlRemarksPage';
      if (_type == 'P')
        return {
          appid: this.gs.appid,
          menuid: this.menuid,
          pkid: this.pkid,
          source: 'QUOTATION-MEMO',
          title: 'Quotation Memo',
          origin: 'party-page'
        };
    } else if (action == "ACC-ALERT") {
      if (_type == "L")
        return '/Silver.BusinessModule/XmlRemarksPage';
      if (_type == 'P')
        return {
          appid: this.gs.appid,
          menuid: this.menuid,
          pkid: this.pkid,
          source: 'ACCOUNTING-ALERT',
          title: 'Accounting Alert',
          origin: 'party-page'
        };
    } else if (action == "DELIVERY-ADDRESS") {
      if (_type == "L")
        return '/Silver.Master/DeliveryAddrPage';
      if (_type == 'P')
        return {
          appid: this.gs.appid,
          menuid: this.menuid,
          pkid: this.pkid,
          origin: 'party-page'
        };
    } else if (action == "PARTY-LOGIN") {
      if (_type == "L")
        return '/Silver.Master/PartyLoginPage';
      if (_type == 'P')
        return {
          appid: this.gs.appid,
          menuid: this.menuid,
          parentid: this.pkid,
          party_code: this.record.gen_code,
          party_name: this.record.gen_name,
          origin: 'party-page'
        };
    } else if (action == "PARTY-ADDRESS") {
      if (_type == "L")
        return '/Silver.Master/PartyAddrPage';
      if (_type == 'P')
        return {
          appid: this.gs.appid,
          menuid: this.menuid,
          parentid: this.pkid,
          party_name: this.record.gen_short_name,
          origin: 'party-page'
        };
    } else if (action == "BANK-INFO") {
      if (_type == "L")
        return '/Silver.Master/BankInfoPage';
      if (_type == 'P')
        return {
          appid: this.gs.appid,
          menuid: this.menuid,
          parentid: this.pkid,
          party_code: this.record.gen_code,
          party_name: this.record.gen_short_name,
          party_officialname: this.record.gen_name,
          party_addr1: this.record.gen_address1,
          party_addr2: this.record.gen_address2,
          party_addr3: this.record.gen_address3,
          origin: 'party-page'
        };
    }
  }

  BtnNavigation(action: string) {

    switch (action) {
      // case 'ARAP': {
      //   let prm = {
      //     menuid: this.gs.MENU_AI_MASTER_ARAP,
      //     mbl_pkid: this.pkid,
      //     mbl_refno: this.record.gen_code,
      //     mbl_type: 'AI',
      //     origin: 'airimp-master-page',
      //   };
      //   this.gs.Naviagete('Silver.USAccounts.Trans/InvoicePage', JSON.stringify(prm));
      //   break;
      // }
      // case 'PROFITREPORT': {
      //   let prm = {
      //     menuid: this.gs.MENU_AI_MASTER_PROFIT_REPORT,
      //     mbl_pkid: this.pkid,
      //     mbl_refno: this.record.gen_code,
      //     mbl_type: 'AI',
      //     origin: 'airimp-master-page',
      //   };
      //   this.gs.Naviagete('Silver.USAccounts.Trans/ProfitReportPage', JSON.stringify(prm));
      //   break;
      // }
      case 'ATTACHMENT': {
        let TypeList: any[] = [];
        this.attach_title = 'Documents';
        this.attach_parentid = this.pkid;
        this.attach_subid = '';
        this.attach_type = 'PARTYS';
        this.attach_typelist = TypeList;
        this.attach_tablename = 'mast_partysm';
        this.attach_tablepkcolumn = 'gen_pkid';
        this.attach_refno = '';
        this.attach_customername = '';
        this.attach_updatecolumn = 'REC_FILES_ATTACHED';
        this.attach_viewonlysource = '';
        this.attach_viewonlyid = '';
        this.attach_filespath = '';
        this.attach_filespath2 = '';
        this.tab = 'attachment';
        break;
      } case 'MEMO': {
        let prm = {
          appid: this.gs.appid,
          menuid: this.menuid,
          pkid: this.pkid,
          source: 'PARTY-MEMO',
          title: 'Memo',
          origin: 'party-page'
        };
        this.gs.Naviagete2('Silver.BusinessModule/XmlRemarksPage', prm);
        break;
      }
      case 'SOP-MEMO': {
        let prm = {
          appid: this.gs.appid,
          menuid: this.menuid,
          pkid: this.pkid,
          source: 'SOP-MEMO',
          title: 'SOP Memo',
          origin: 'party-page'
        };
        this.gs.Naviagete2('Silver.BusinessModule/XmlRemarksPage', prm);
        break;
      }
      case 'QUOTN-MEMO': {
        let prm = {
          appid: this.gs.appid,
          menuid: this.menuid,
          pkid: this.pkid,
          source: 'QUOTATION-MEMO',
          title: 'Quotation Memo',
          origin: 'party-page'
        };
        this.gs.Naviagete2('Silver.BusinessModule/XmlRemarksPage', prm);
        break;
      }
      case 'ACC-ALERT': {
        let prm = {
          appid: this.gs.appid,
          menuid: this.menuid,
          pkid: this.pkid,
          source: 'ACCOUNTING-ALERT',
          title: 'Accounting Alert',
          origin: 'party-page'
        };
        this.gs.Naviagete2('Silver.BusinessModule/XmlRemarksPage', prm);
        break;
      }
      case 'DELIVERY-ADDRESS': {
        let prm = {
          appid: this.gs.appid,
          menuid: this.menuid,
          pkid: this.pkid,
          origin: 'party-page'
        };
        this.gs.Naviagete2('Silver.Master/DeliveryAddrPage', prm);
        break;
      }
      case 'PARTY-LOGIN': {
        let prm = {
          appid: this.gs.appid,
          menuid: this.menuid,
          parentid: this.pkid,
          party_code: this.record.gen_code,
          party_name: this.record.gen_name,
          origin: 'party-page'
        };
        this.gs.Naviagete2('Silver.Master/PartyLoginPage', prm);
        break;
      }
      case 'PARTY-ADDRESS': {
        let prm = {
          appid: this.gs.appid,
          menuid: this.menuid,
          parentid: this.pkid,
          party_name: this.record.gen_short_name,
          origin: 'party-page'
        };
        this.gs.Naviagete2('Silver.Master/PartyAddrPage', prm);
        break;
      }
      case 'BANK-INFO': {
        let prm = {
          appid: this.gs.appid,
          menuid: this.menuid,
          parentid: this.pkid,
          party_code: this.record.gen_code,
          party_name: this.record.gen_short_name,
          party_officialname: this.record.gen_name,
          party_addr1: this.record.gen_address1,
          party_addr2: this.record.gen_address2,
          party_addr3: this.record.gen_address3,
          origin: 'party-page'
        };
        this.gs.Naviagete2('Silver.Master/BankInfoPage', prm);
        break;
      }
    }
  }

  callbackevent(event: any) {
    this.tab = 'main';
  }

  AddRow() {
    this.errorMessage = "";
    if (this.records == null)
      this.records = <Tbl_Mast_Contacts[]>[];

    let bOk: Boolean = true;
    this.records.forEach(Rec => {
      if (Rec.cont_name == null)
        bOk = false;
      if (Rec.cont_name == "")
        bOk = false;
    })
    if (bOk == false) {
      this.errorMessage = "Name Cannot Be Empty in Other Contacts";
      alert(this.errorMessage);
    }
    else {
      var rec = <Tbl_Mast_Contacts>{};
      rec.cont_pkid = this.gs.getGuid();
      rec.cont_parent_id = this.pkid;
      rec.cont_type = "PARTYS";
      rec.cont_name = '';
      rec.cont_title = '';
      rec.cont_email = '';
      rec.cont_remarks = '';
      rec.cont_tel = '';
      rec.cont_mobile = '';
      rec.cont_oth_messenger = '';
      rec.cont_group_id = '';
      rec.cont_group_name = '';
      this.records.push(rec);
    }
  }

  RemoveRow(_rec: Tbl_Mast_Contacts) {
    if (!confirm("Delete Y/N")) {
      return;
    }
    this.errorMessage = '';
    this.records.splice(this.records.findIndex(rec => rec.cont_pkid == _rec.cont_pkid), 1);
  }

  SetAddress() {
    if (this.gs.isBlank(this.record.gen_address2))
      this.SetAddressToLine = "Line2";
    else if (this.gs.isBlank(this.record.gen_address3))
      this.SetAddressToLine = "Line3";
    else
      this.SetAddressToLine = "";
    this.GetAddress2();
  }

  GetAddress2() {
    let str: string = "";
    let str1: string = "";
    let str2: string = "";
    let str3: string = "";

    str1 = this.record.gen_location;
    str2 = this.record.gen_state;
    if (str2 != "" && this.record.gen_state.trim().length > 0)
      str2 += " ";
    str2 += this.record.gen_pincode;

    str3 = this.record.gen_country_name;

    str = str1;
    if (str != "" && str2 != "")
      str += ", ";
    str += str2;
    if (str != "" && str3 != "")
      str += ", ";
    str += str3;

    str = str.trim();
    if (str.length > 60)
      str = str.substring(0, 60);

    if (this.SetAddressToLine == "Line2")
      this.record.gen_address2 = str;
    else if (this.SetAddressToLine == "Line3")
      this.record.gen_address3 = str;
  }

  LoadMissingData() {
    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.MS_TYPE = this.ms_type;
    SearchData.MS_FROM = this.ms_from;
    SearchData.MS_NAME = this.ms_name;
    this.mainService.LoadMissingData(SearchData)
      .subscribe(response => {
        let _rec = <Tbl_Mast_Partym>response.record;
        if (!this.gs.isBlank(_rec)) {
          this.record.gen_short_name = _rec.gen_name.toString();
          this.record.gen_name = _rec.gen_name.toString();
          this.record.gen_address1 = _rec.gen_address1.toString();
          this.record.gen_address2 = _rec.gen_address2.toString();
          this.record.gen_address3 = _rec.gen_address3.toString();
          this.record.gen_address4 = _rec.gen_address4.toString();
        }
      }, error => {
        this.errorMessage = this.gs.getError(error);
      });
  }

  SetRowIndex(_indx: number) {
    this.selectedRowIndex = _indx;
  }

  changePosition(thistype: string) {
    if (this.selectedRowIndex == -1)
      return;
    let _newindx: number = this.selectedRowIndex;

    if (thistype == 'UP')
      _newindx--;
    if (thistype == 'DOWN')
      _newindx++;

    if (_newindx >= 0 && _newindx < this.records.length) {
      this.swapItem(this.selectedRowIndex, _newindx);
      this.selectedRowIndex = _newindx;
    }
  }


  swapItem(slot1: number, slot2: number) {
    var tempVal = this.records[slot2];
    this.records[slot2] = this.records[slot1];
    this.records[slot1] = tempVal;
  }

  public selectRowId(id: string) {
    this.selectedId = id;
  }
  public getRowId() {
    return this.selectedId;
  }

}
