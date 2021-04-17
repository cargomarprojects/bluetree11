import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { User_Menu } from '../../core/models/menum';
import { SearchTable } from '../../shared/models/searchtable';
import { SettingsService } from '../services/settings.service';
import { TBL_MAST_PARAM, VM_TBL_MAST_SETTINGS } from '../models/Tbl_Mast_Param';

@Component({
  selector: 'app-branchsettings',
  templateUrl: './branchsettings.component.html'
})
export class BranchSettingsComponent implements OnInit {
  records: TBL_MAST_PARAM[] = [];
  saveList: TBL_MAST_PARAM[] = [];
  // 15-04-2021 Created By Joy  

  menuid: string;
  title: string = '';
  isAdmin: boolean;
  errorMessage: string;

  Txt_AR_id = '';
  Txt_AR = '';
  Txt_AP_id = '';
  Txt_AP = '';
  Txt_PettyCash_id = '';
  Txt_PettyCash = '';
  TXT_IPS_AR_id = '';
  TXT_IPS_AR = '';
  TXT_IPS_AP_id = '';
  TXT_IPS_AP = '';
  Txt_Inc_AE_id = '';
  Txt_Inc_AE = '';
  Txt_Inc_AI_id = '';
  Txt_Inc_AI = '';
  Txt_Inc_SE_id = '';
  Txt_Inc_SE = '';
  Txt_Inc_SI_id = '';
  Txt_Inc_SI = '';
  Txt_Inc_OT_id = '';
  Txt_Inc_OT = '';
  Txt_Inc_Ex_id = '';
  Txt_Inc_Ex = '';
  Txt_Exp_AE_id = '';
  Txt_Exp_AE = '';
  Txt_Exp_AI_id = '';
  Txt_Exp_AI = '';
  Txt_Exp_SE_id = '';
  Txt_Exp_SE = '';
  Txt_Exp_SI_id = '';
  Txt_Exp_SI = '';
  Txt_Exp_OT_id = '';
  Txt_Exp_OT = '';
  Txt_Exp_Ex_id = '';
  Txt_Exp_Ex = '';
  Txt_Profit_id = '';
  Txt_Profit = '';
  Txt_VatAccount_id = '';
  Txt_VatAccount = '';
  Txt_Code_id = '';
  Txt_Code = '';
  Txt_Direct_Agent_id = '';
  Txt_Direct_Agent = '';
  Txt_Bank_Charges_id = '';
  Txt_Bank_Charges = '';
  Txt_Ex_Diff_id = '';
  Txt_Ex_Diff = '';
  TxtImageUrl_id = '';
  TxtImageUrl = '';
  TxtFileUrl_id = '';
  TxtFileUrl = '';
  TxtFileFolder_id = '';
  TxtFileFolder = '';
  Txt_Date_Format_BackEnd_id = '';
  Txt_Date_Format_BackEnd = '';
  Txt_Date_Format_FrontEnd_id = '';
  Txt_Date_Format_FrontEnd = '';
  Txt_Base_Curr_Code_id = '';
  Txt_Base_Curr_Code = '';
  Txt_Foreign_Curr_Code_id = '';
  Txt_Foreign_Curr_Code = '';
  Txt_Rows_id = '';
  Txt_Rows = '';
  Txt_Vat_Per_id = '';
  Txt_Vat_Per = '';
  Txt_Hbl_Inst1_id = '';
  Txt_Hbl_Inst1 = '';
  Txt_Hbl_Inst2_id = '';
  Txt_Hbl_Inst2 = '';
  Txt_IssuingAgent_id = '';
  Txt_IssuingAgent = '';
  Txt_Agent_City_id = '';
  Txt_Agent_City = '';
  Txt_Agent_Address_id = '';
  Txt_Agent_Address = '';
  Txt_IATA_id = '';
  Txt_IATA = '';
  Txt_Sea_Prefix_id = '';
  Txt_Sea_Prefix = '';
  Chk_Sea_Prefix_Pol = 'Y';
  Chk_Sea_Prefix_Pod = 'Y';
  Txt_Sea_Prefix2_id = '';
  Txt_Sea_Prefix2 = '';
  Txt_Sea_Prefix3_id = '';
  Txt_Sea_Prefix3 = '';
  Txt_Air_Prefix_id = '';
  Txt_Air_Prefix = '';
  Chk_Air_Prefix_Pol = 'Y';
  Chk_Air_Prefix_Pod = 'Y';
  Txt_Air_Prefix2_id = '';
  Txt_Air_Prefix2 = '';
  Txt_Air_Prefix3_id = '';
  Txt_Air_Prefix3 = '';
  Chk_Home_Logo_id = '';
  Chk_Home_Logo = 'Y';
  Chk_Home_Name_id = '';
  Chk_Home_Name = 'Y';
  Chk_CTPAT_id = '';
  Chk_CTPAT = 'Y';
  TXT_SE_PREFIX1_id = '';
  TXT_SE_PREFIX1 = '';
  TXT_SE_PREFIX2_id = '';
  TXT_SE_PREFIX2 = '';
  TXT_SI_PREFIX1_id = '';
  TXT_SI_PREFIX1 = '';
  TXT_SI_PREFIX2_id = '';
  TXT_SI_PREFIX2 = '';
  TXT_AE_PREFIX1_id = '';
  TXT_AE_PREFIX1 = '';
  TXT_AE_PREFIX2_id = '';
  TXT_AE_PREFIX2 = '';
  TXT_AI_PREFIX1_id = '';
  TXT_AI_PREFIX1 = '';
  TXT_AI_PREFIX2_id = '';
  TXT_AI_PREFIX2 = '';
  TXT_OP_PREFIX1_id = '';
  TXT_OP_PREFIX1 = '';
  TXT_OP_PREFIX2_id = '';
  TXT_OP_PREFIX2 = '';
  TXT_EX_PREFIX1_id = '';
  TXT_EX_PREFIX1 = '';
  TXT_EX_PREFIX2_id = '';
  TXT_EX_PREFIX2 = '';
  TXT_AR_PREFIX1_id = '';
  TXT_AR_PREFIX1 = '';
  TXT_AR_PREFIX2_id = '';
  TXT_AR_PREFIX2 = '';
  TXT_AP_PREFIX1_id = '';
  TXT_AP_PREFIX1 = '';
  TXT_AP_PREFIX2_id = '';
  TXT_AP_PREFIX2 = '';
  TXT_DN_PREFIX1_id = '';
  TXT_DN_PREFIX1 = '';
  TXT_DN_PREFIX2_id = '';
  TXT_DN_PREFIX2 = '';
  Chk_Parent_Address_id = '';
  Chk_Parent_Address = 'Y';
  Txt_Auto_Bcc_id = '';
  Txt_Auto_Bcc = '';
  Chk_PrintCheck_id = '';
  Chk_PrintCheck = 'Y';
  Chk_RePrintCheck_id = '';
  Chk_RePrintCheck = 'Y';
  Txt_Lock_Sea_id = '';
  Txt_Lock_Sea = '';
  Txt_Lock_Air_id = '';
  Txt_Lock_Air = '';
  Txt_Lock_Others_id = '';
  Txt_Lock_Others = '';
  Txt_Lock_Admin_id = '';
  Txt_Lock_Admin = '';
  Chk_Boe_id = '';
  Chk_Boe = 'Y';
  Chk_Arap_Code_Selection_id = '';
  Chk_Arap_Code_Selection = 'Y';
  Chk_ShowChkDate_id = '';
  Chk_ShowChkDate = 'Y';
  Chk_Remove_Zero_Format_id = '';
  Chk_Remove_Zero_Format = 'Y';
  Chk_Extra_id = '';
  Chk_Extra = 'Y';
  Chk_Package_Total_Button_id = '';
  Chk_Package_Total_Button = 'Y';
  Chk_Description_id = '';
  Chk_Description = 'Y';
  Txt_Region_id = '';
  Txt_Region = '';
  Cmb_Sea_Arr_Format_id = '';
  Cmb_Sea_Arr_Format = '';
  Txt_Payroll_Invoice_Code_id = '';
  Txt_Payroll_Invoice_Code = '';
  Txt_Payroll_Ac_Code_id = '';
  Txt_Payroll_Ac_Code = '';
  Chk_Enable_Payroll_id = '';
  Chk_Enable_Payroll = 'Y';
  Chk_HideDocType_id = '';
  Chk_HideDocType = 'Y';
  chk_dummy_Invoice_id = '';
  chk_dummy_Invoice = 'Y';
  Txt_Terms1_id = '';
  Txt_Terms1 = '';
  Txt_Terms2_id = '';
  Txt_Terms2 = '';
  Txt_FY_Start_Month_id = '';
  Txt_FY_Start_Month = '';
  Txt_Def_Hbl_Format_id = '';
  Txt_Def_Hbl_Format = '';
  Txt_Def_Hbl_Draftformat_id = '';
  Txt_Def_Hbl_Draftformat = '';
  Cmb_Ac_Rep_Base_id = '';
  Cmb_Ac_Rep_Base = '';
  Txt_RootFolder_id = '';
  Txt_RootFolder = '';
  Txt_Ftp_Folder_id = '';
  Txt_Ftp_Folder = '';
  Chk_SI_OVERRIDE_POD_ETA_id = '';
  Chk_SI_OVERRIDE_POD_ETA = 'Y';
  Chk_AI_OVERRIDE_POD_ETA_id = '';
  Chk_AI_OVERRIDE_POD_ETA = 'Y';
  Chk_ShipLogFormat_id = '';
  Chk_ShipLogFormat = 'Y';
  Dt_Locked = "";




  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: SettingsService
  ) { }

  ngOnInit() {
    const options = this.route.snapshot.queryParams;
    this.menuid = options.menuid;

    this.initPage();
    this.List('SCREEN');
  }

  private initPage() {
    this.title = 'Company Settings';
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.errorMessage = '';
  }


  List(action: string = '') {
    var SearchData = this.gs.UserInfo;
    SearchData.PARAM_TYPE = 'BRANCH SETTINGS';
    SearchData.pkid = this.gs.getGuid();
    this.mainService.List(SearchData).subscribe(response => {
      this.records = response.list;
      this.fillRecords();
    }, error => {
      this.errorMessage = this.gs.getError(error)
    });
  }



  OnChange(field: string) {
    // if (field == 'cmbNotes') {
    //   this.record.cf_remarks = this.cmbNotes;
    // }
    // if (field == 'cf_assigned_id') {
    //   var REC = this.UserList.find(rec => rec.id == this.record.cf_assigned_id);
    //   if (REC != null) {
    //     this.record.cf_assigned_code = REC.code;
    //     this.record.cf_assigned_name = REC.name;
    //   }
    // }
  }


  fillRecords() {
    this.records.forEach(Rec => {
      if (Rec.param_name1 == "A/C RECEIVABLE") {
        this.Txt_AR_id = Rec.param_name2;
        this.Txt_AR = Rec.param_name3;
      }
      else if (Rec.param_name1 == "A/C PAYABLE") {
        this.Txt_AP_id = Rec.param_name2;
        this.Txt_AP = Rec.param_name3;
      }
      else if (Rec.param_name1 == "PETTY CASH") {
        this.Txt_PettyCash_id = Rec.param_name2;
        this.Txt_PettyCash = Rec.param_name3;
      }
      else if (Rec.param_name1 == "INTERNAL-PAYMENT-SETTLEMENT-AR") {
        this.TXT_IPS_AR_id = Rec.param_name2;
        this.TXT_IPS_AR = Rec.param_name3;
      }
      else if (Rec.param_name1 == "INTERNAL-PAYMENT-SETTLEMENT-AP") {
        this.TXT_IPS_AP_id = Rec.param_name2;
        this.TXT_IPS_AP = Rec.param_name3;
      }
      else if (Rec.param_name1 == "INCOME-AE") {
        this.Txt_Inc_AE_id = Rec.param_name2;
        this.Txt_Inc_AE = Rec.param_name3;
      }
      else if (Rec.param_name1 == "INCOME-AI") {
        this.Txt_Inc_AI_id = Rec.param_name2;
        this.Txt_Inc_AI = Rec.param_name3;
      }
      else if (Rec.param_name1 == "INCOME-SE") {
        this.Txt_Inc_SE_id = Rec.param_name2;
        this.Txt_Inc_SE = Rec.param_name3;
      }
      else if (Rec.param_name1 == "INCOME-SI") {
        this.Txt_Inc_SI_id = Rec.param_name2;
        this.Txt_Inc_SI = Rec.param_name3;
      }
      else if (Rec.param_name1 == "INCOME-OT") {
        this.Txt_Inc_OT_id = Rec.param_name2;
        this.Txt_Inc_OT = Rec.param_name3;
      }
      else if (Rec.param_name1 == "INCOME-EX") {
        this.Txt_Inc_Ex_id = Rec.param_name2;
        this.Txt_Inc_Ex = Rec.param_name3;
      }

      else if (Rec.param_name1 == "EXPENSE-AE") {
        this.Txt_Exp_AE_id = Rec.param_name2;
        this.Txt_Exp_AE = Rec.param_name3;
      }
      else if (Rec.param_name1 == "EXPENSE-AI") {
        this.Txt_Exp_AI_id = Rec.param_name2;
        this.Txt_Exp_AI = Rec.param_name3;
      }
      else if (Rec.param_name1 == "EXPENSE-SE") {
        this.Txt_Exp_SE_id = Rec.param_name2;
        this.Txt_Exp_SE = Rec.param_name3;
      }
      else if (Rec.param_name1 == "EXPENSE-SI") {
        this.Txt_Exp_SI_id = Rec.param_name2;
        this.Txt_Exp_SI = Rec.param_name3;
      }
      else if (Rec.param_name1 == "EXPENSE-OT") {
        this.Txt_Exp_OT_id = Rec.param_name2;
        this.Txt_Exp_OT = Rec.param_name3;
      }
      else if (Rec.param_name1 == "EXPENSE-EX") {
        this.Txt_Exp_Ex_id = Rec.param_name2;
        this.Txt_Exp_Ex = Rec.param_name3;
      }
      else if (Rec.param_name1 == "RETAINED-PROFIT") {
        this.Txt_Profit_id = Rec.param_name2;
        this.Txt_Profit = Rec.param_name3;
      }
      else if (Rec.param_name1 == "VAT-ACCOUNT") {
        this.Txt_VatAccount_id = Rec.param_name2;
        this.Txt_VatAccount = Rec.param_name3;
      }
      else if (Rec.param_name1 == "VAT-INVOICE-DESCRIPTION") {
        this.Txt_Code_id = Rec.param_name2;
        this.Txt_Code = Rec.param_name3;
      }
      else if (Rec.param_name1 == "DIRECT-BILL-AGENT") {
        this.Txt_Direct_Agent_id = Rec.param_name2;
        this.Txt_Direct_Agent = Rec.param_name3;
      }
      else if (Rec.param_name1 == "BANK CHARGES") {
        this.Txt_Bank_Charges_id = Rec.param_name2;
        this.Txt_Bank_Charges = Rec.param_name3;
      }
      else if (Rec.param_name1 == "EXCHANGE DIFFERENCE") {
        this.Txt_Ex_Diff_id = Rec.param_name2;
        this.Txt_Ex_Diff = Rec.param_name3;
      }
      else if (Rec.param_name1 == "RESOURCE URL") {
        this.TxtImageUrl_id = Rec.param_name2;
        this.TxtImageUrl = Rec.param_name3;
      }
      else if (Rec.param_name1 == "FILES URL") {
        this.TxtFileUrl_id = Rec.param_name2;
        this.TxtFileUrl = Rec.param_name3;
      }
      else if (Rec.param_name1 == "FILES FOLDER") {
        this.TxtFileFolder_id = Rec.param_name2;
        this.TxtFileFolder = Rec.param_name3;
      }
      else if (Rec.param_name1 == "BACK END DATE FORMAT") {
        this.Txt_Date_Format_BackEnd_id = Rec.param_name2;
        this.Txt_Date_Format_BackEnd = Rec.param_name3;
      }
      else if (Rec.param_name1 == "FRONT END DATE FORMAT") {
        this.Txt_Date_Format_FrontEnd_id = Rec.param_name2;
        this.Txt_Date_Format_FrontEnd = Rec.param_name3;
      }
      else if (Rec.param_name1 == "BASE CURRENCY CODE") {
        this.Txt_Base_Curr_Code_id = Rec.param_name2;
        this.Txt_Base_Curr_Code = Rec.param_name3;
      }
      else if (Rec.param_name1 == "FOREIGN CURRENCY CODE") {
        this.Txt_Foreign_Curr_Code_id = Rec.param_name2;
        this.Txt_Foreign_Curr_Code = Rec.param_name3;
      }
      else if (Rec.param_name1 == "NO OF ROWS") {
        this.Txt_Rows_id = Rec.param_name2;
        this.Txt_Rows = Rec.param_name3;
      }
      else if (Rec.param_name1 == "VAT-PERCENTAGE") {
        this.Txt_Vat_Per_id = Rec.param_name2;
        this.Txt_Vat_Per = Rec.param_name3;
      }
      else if (Rec.param_name1 == "HBL INSTRUCTION-1") {
        this.Txt_Hbl_Inst1_id = Rec.param_name2;
        this.Txt_Hbl_Inst1 = Rec.param_name3;
      }
      else if (Rec.param_name1 == "HBL INSTRUCTION-2") {
        this.Txt_Hbl_Inst2_id = Rec.param_name2;
        this.Txt_Hbl_Inst2 = Rec.param_name3;
      }
      else if (Rec.param_name1 == "ISSUE-AGENT") {
        this.Txt_IssuingAgent_id = Rec.param_name2;
        this.Txt_IssuingAgent = Rec.param_name3;
      }
      else if (Rec.param_name1 == "ISSUE-AGENT-CITY") {
        this.Txt_Agent_City_id = Rec.param_name2;
        this.Txt_Agent_City = Rec.param_name3;
      }
      else if (Rec.param_name1 == "ISSUE-AGENT-ADDRESS") {
        this.Txt_Agent_Address_id = Rec.param_name2;
        this.Txt_Agent_Address = Rec.param_name3;
      }
      else if (Rec.param_name1 == "IATA-CODE") {
        this.Txt_IATA_id = Rec.param_name2;
        this.Txt_IATA = Rec.param_name3;
      }
      else if (Rec.param_name1 == "SEA-EXPORT-HOUSE-PREFIX") {
        this.Txt_Sea_Prefix_id = Rec.param_name2;
        this.Txt_Sea_Prefix = Rec.param_name3;
      }
      else if (Rec.param_name1 == "SEA-EXPORT-HOUSE-PREFIX-POL") {
          this.Chk_Sea_Prefix_Pol = Rec.param_name3;
      }
      else if (Rec.param_name1 == "SEA-EXPORT-HOUSE-PREFIX-POD") {
          this.Chk_Sea_Prefix_Pod = Rec.param_name3;
      }
      else if (Rec.param_name1 == "SEA-EXPORT-HOUSE-STARTING-NO") {
        this.Txt_Sea_Prefix2_id = Rec.param_name2;
        this.Txt_Sea_Prefix2 = Rec.param_name3;
      }
      else if (Rec.param_name1 == "SEA-EXPORT-HOUSE-INCREMENT-BY") {
        this.Txt_Sea_Prefix3_id = Rec.param_name2;
        this.Txt_Sea_Prefix3 = Rec.param_name3;
      }

      else if (Rec.param_name1 == "AIR-EXPORT-HOUSE-PREFIX") {
        this.Txt_Air_Prefix_id = Rec.param_name2;
        this.Txt_Air_Prefix = Rec.param_name3;
      }
      else if (Rec.param_name1 == "AIR-EXPORT-HOUSE-PREFIX-POL") {
          this.Chk_Air_Prefix_Pol = Rec.param_name3;
      }
      else if (Rec.param_name1 == "AIR-EXPORT-HOUSE-PREFIX-POD") {
          this.Chk_Air_Prefix_Pod = Rec.param_name3;
      }
      else if (Rec.param_name1 == "AIR-EXPORT-HOUSE-STARTING-NO") {
        this.Txt_Air_Prefix2_id = Rec.param_name2;
        this.Txt_Air_Prefix2 = Rec.param_name3;
      }
      else if (Rec.param_name1 == "AIR-EXPORT-HOUSE-INCREMENT-BY") {
        this.Txt_Air_Prefix3_id = Rec.param_name2;
        this.Txt_Air_Prefix3 = Rec.param_name3;
      }
      else if (Rec.param_name1 == "SHOW-LOGO-HOME-PAGE") {
        this.Chk_Home_Logo_id = Rec.param_name2;
          this.Chk_Home_Logo = Rec.param_name3;
      }
      else if (Rec.param_name1 == "SHOW-NAME-HOME-PAGE") {
        this.Chk_Home_Name_id = Rec.param_name2;
          this.Chk_Home_Name = Rec.param_name3;
      }
      else if (Rec.param_name1 == "SHOW-CTPAT") {
          this.Chk_CTPAT_id = Rec.param_name2;
          this.Chk_CTPAT = Rec.param_name3;
      }
      else if (Rec.param_name1 == "SEA-EXPORT-REFNO-PREFIX") {
        this.TXT_SE_PREFIX1_id = Rec.param_name2;
        this.TXT_SE_PREFIX1 = Rec.param_name3;
      }
      else if (Rec.param_name1 == "SEA-EXPORT-REFNO-STARTING-NO") {
        this.TXT_SE_PREFIX2_id = Rec.param_name2;
        this.TXT_SE_PREFIX2 = Rec.param_name3;
      }
      else if (Rec.param_name1 == "SEA-IMPORT-REFNO-PREFIX") {
        this.TXT_SI_PREFIX1_id = Rec.param_name2;
        this.TXT_SI_PREFIX1 = Rec.param_name3;
      }
      else if (Rec.param_name1 == "SEA-IMPORT-REFNO-STARTING-NO") {
        this.TXT_SI_PREFIX2_id = Rec.param_name2;
        this.TXT_SI_PREFIX2 = Rec.param_name3;
      }
      else if (Rec.param_name1 == "AIR-EXPORT-REFNO-PREFIX") {
        this.TXT_AE_PREFIX1_id = Rec.param_name2;
        this.TXT_AE_PREFIX1 = Rec.param_name3;
      }

      else if (Rec.param_name1 == "AIR-EXPORT-REFNO-STARTING-NO") {
        this.TXT_AE_PREFIX2_id = Rec.param_name2;
        this.TXT_AE_PREFIX2 = Rec.param_name3;
      }
      else if (Rec.param_name1 == "AIR-IMPORT-REFNO-PREFIX") {
        this.TXT_AI_PREFIX1_id = Rec.param_name2;
        this.TXT_AI_PREFIX1 = Rec.param_name3;
      }
      else if (Rec.param_name1 == "AIR-IMPORT-REFNO-STARTING-NO") {
        this.TXT_AI_PREFIX2_id = Rec.param_name2;
        this.TXT_AI_PREFIX2 = Rec.param_name3;
      }
      else if (Rec.param_name1 == "OTHER-OPERATION-REFNO-PREFIX") {
        this.TXT_OP_PREFIX1_id = Rec.param_name2;
        this.TXT_OP_PREFIX1 = Rec.param_name3;
      }
      else if (Rec.param_name1 == "OTHER-OPERATION-REFNO-STARTING-NO") {
        this.TXT_OP_PREFIX2_id = Rec.param_name2;
        this.TXT_OP_PREFIX2 = Rec.param_name3;
      }

      else if (Rec.param_name1 == "EXTRA-OPERATION-REFNO-PREFIX") {
        this.TXT_EX_PREFIX1_id = Rec.param_name2;
        this.TXT_EX_PREFIX1 = Rec.param_name3;
      }
      else if (Rec.param_name1 == "EXTRA-OPERATION-REFNO-STARTING-NO") {
        this.TXT_EX_PREFIX2_id = Rec.param_name2;
        this.TXT_EX_PREFIX2 = Rec.param_name3;
      }


      else if (Rec.param_name1 == "AR-INVOICE-PREFIX") {
        this.TXT_AR_PREFIX1_id = Rec.param_name2;
        this.TXT_AR_PREFIX1 = Rec.param_name3;
      }
      else if (Rec.param_name1 == "AR-INVOICE-STARTING-NO") {
        this.TXT_AR_PREFIX2_id = Rec.param_name2;
        this.TXT_AR_PREFIX2 = Rec.param_name3;
      }
      else if (Rec.param_name1 == "AP-INVOICE-PREFIX") {
        this.TXT_AP_PREFIX1_id = Rec.param_name2;
        this.TXT_AP_PREFIX1 = Rec.param_name3;
      }
      else if (Rec.param_name1 == "AP-INVOICE-STARTING-NO") {
        this.TXT_AP_PREFIX2_id = Rec.param_name2;
        this.TXT_AP_PREFIX2 = Rec.param_name3;
      }
      else if (Rec.param_name1 == "DEBIT-NOTE-PREFIX") {
        this.TXT_DN_PREFIX1_id = Rec.param_name2;
        this.TXT_DN_PREFIX1 = Rec.param_name3;
      }
      else if (Rec.param_name1 == "DEBIT-NOTE-STARTING-NO") {
        this.TXT_DN_PREFIX2_id = Rec.param_name2;
        this.TXT_DN_PREFIX2 = Rec.param_name3;
      }
      else if (Rec.param_name1 == "PARENT-ADDRESS") {
        this.Chk_Parent_Address_id = Rec.param_name2;
        this.Chk_Parent_Address= Rec.param_name3;
      }
      else if (Rec.param_name1 == "AUTO-BCC-EMAIL-ID") {
        this.Txt_Auto_Bcc_id = Rec.param_name2;
        this.Txt_Auto_Bcc = Rec.param_name3;
      }
      else if (Rec.param_name1 == "AUTO-CLOSE-CHECK-PRINT") {
        this.Chk_PrintCheck_id = Rec.param_name2;
          this.Chk_PrintCheck = Rec.param_name3;
      }
      else if (Rec.param_name1 == "RE-PRINT-CHECK") {
        this.Chk_RePrintCheck_id = Rec.param_name2;
          this.Chk_RePrintCheck = Rec.param_name3;
      }
      else if (Rec.param_name1 == "LOCK-DAYS-SEA") {
        this.Txt_Lock_Sea_id = Rec.param_name2;
        this.Txt_Lock_Sea = Rec.param_name3;
      }
      else if (Rec.param_name1 == "LOCK-DAYS-AIR") {
        this.Txt_Lock_Air_id = Rec.param_name2;
        this.Txt_Lock_Air = Rec.param_name3;
      }
      else if (Rec.param_name1 == "LOCK-DAYS-OTHERS") {
        this.Txt_Lock_Others_id = Rec.param_name2;
        this.Txt_Lock_Others = Rec.param_name3;
      }
      else if (Rec.param_name1 == "LOCK-DAYS-ADMIN") {
        this.Txt_Lock_Admin_id = Rec.param_name2;
        this.Txt_Lock_Admin = Rec.param_name3;
      }
      else if (Rec.param_name1 == "SHOW-BOE") {
        this.Chk_Boe_id = Rec.param_name2;
          this.Chk_Boe= Rec.param_name3;
      }
      else if (Rec.param_name1 == "ARAP-CODE-SELECTION") {
        this.Chk_Arap_Code_Selection_id = Rec.param_name2;
          this.Chk_Arap_Code_Selection= Rec.param_name3;
      }
      else if (Rec.param_name1 == "SHOW-CHECK-DATE") {
        this.Chk_ShowChkDate_id = Rec.param_name2;
        this.Chk_ShowChkDate= Rec.param_name3;
      }
      else if (Rec.param_name1 == "REMOVE-ZERO-FORMAT") {
        this.Chk_Remove_Zero_Format_id = Rec.param_name2;
        this.Chk_Remove_Zero_Format= Rec.param_name3;
      }
      else if (Rec.param_name1 == "SHOW-EXTRA-OPTION") {
        this.Chk_Extra_id = Rec.param_name2;
        this.Chk_Extra= Rec.param_name3;
      }
      else if (Rec.param_name1 == "PACKAGE-TOTAL-BUTTON") {
        this.Chk_Package_Total_Button_id = Rec.param_name2;
        this.Chk_Package_Total_Button= Rec.param_name3;
      }
      else if (Rec.param_name1 == "OPTIONAL-DESCRIPTION") {
        this.Chk_Description_id = Rec.param_name2;
        this.Chk_Description= Rec.param_name3;
      }
      else if (Rec.param_name1 == "REGION") {
        this.Txt_Region_id = Rec.param_name2;
        this.Txt_Region = Rec.param_name3;
      }

      else if (Rec.param_name1 == "SEA_ARVL_FORMAT") {
        this.Cmb_Sea_Arr_Format_id = Rec.param_name2;
        this.Cmb_Sea_Arr_Format= Rec.param_name3;
      }
      else if (Rec.param_name1 == "PAYROLL-INVOICE-CODE") {
        this.Txt_Payroll_Invoice_Code_id = Rec.param_name2;
        this.Txt_Payroll_Invoice_Code = Rec.param_name3;
      }
      else if (Rec.param_name1 == "PAYROLL-ACC-CODE") {
        this.Txt_Payroll_Ac_Code_id = Rec.param_name2;
        this.Txt_Payroll_Ac_Code = Rec.param_name3;
      }
      else if (Rec.param_name1 == "PAYROLL-ENABLED") {
        this.Chk_Enable_Payroll_id = Rec.param_name2;
        this.Chk_Enable_Payroll= Rec.param_name3;
      }
      else if (Rec.param_name1 == "HIDE-DOCTYPE-INVOICE") {
        this.Chk_HideDocType_id = Rec.param_name2;
        this.Chk_HideDocType= Rec.param_name3;
      }
      else if (Rec.param_name1 == "DUMMY-INVOICE") {
        this.chk_dummy_Invoice_id = Rec.param_name2;
        this.chk_dummy_Invoice= Rec.param_name3;
      }

      else if (Rec.param_name1 == "DOC-FOOTER1") {
        this.Txt_Terms1_id = Rec.param_name2;
        this.Txt_Terms1 = Rec.param_name3;
      }
      else if (Rec.param_name1 == "DOC-FOOTER2") {
        this.Txt_Terms2_id = Rec.param_name2;
        this.Txt_Terms2 = Rec.param_name3;
      }
      else if (Rec.param_name1 == "FY-START-MONTH") {
        this.Txt_FY_Start_Month_id = Rec.param_name2;
        this.Txt_FY_Start_Month = Rec.param_name3;
      }

      else if (Rec.param_name1 == "DEFAULT-HBL-FORMAT") {
        this.Txt_Def_Hbl_Format_id = Rec.param_name2;
        this.Txt_Def_Hbl_Format = Rec.param_name3;
      }
      else if (Rec.param_name1 == "DEFAULT-HBL-DRAFT-FORMAT") {
        this.Txt_Def_Hbl_Draftformat_id = Rec.param_name2;
        this.Txt_Def_Hbl_Draftformat = Rec.param_name3;
      }
      else if (Rec.param_name1 == "AC-REPORT-BASED-ON") {
        this.Cmb_Ac_Rep_Base_id = Rec.param_name2;
        this.Cmb_Ac_Rep_Base = Rec.param_name3;
      }
      else if (Rec.param_name1 == "FS-APP-FOLDER") {
        this.Txt_RootFolder_id = Rec.param_name2;
        this.Txt_RootFolder = Rec.param_name3;
      }
      else if (Rec.param_name1 == "GLOBAL-FTP-FOLDER") {
        this.Txt_Ftp_Folder_id = Rec.param_name2;
        this.Txt_Ftp_Folder = Rec.param_name3;
      }
      else if (Rec.param_name1 == "SEA-IMP-OVERRIDE-POD-ETA") {
        this.Chk_SI_OVERRIDE_POD_ETA_id = Rec.param_name2;
        this.Chk_SI_OVERRIDE_POD_ETA= Rec.param_name3;
      }
      else if (Rec.param_name1 == "AIR-IMP-OVERRIDE-POD-ETA") {
        this.Chk_AI_OVERRIDE_POD_ETA_id = Rec.param_name2;
        this.Chk_AI_OVERRIDE_POD_ETA= Rec.param_name3;
      }
      else if (Rec.param_name1 == "SHIPMENT-LOG-FORMAT") {
        this.Chk_ShipLogFormat_id = Rec.param_name2;
        this.Chk_ShipLogFormat= Rec.param_name3;
      }
      else if (Rec.param_name1 == "SHIPMENT-LOCKED-DATE") {
        this.Dt_Locked = "";
        if (Rec.param_name3 != "") {
          let sdata = Rec.param_name3.toString().split('-');
          if (sdata.length == 3) {
            let yy = +sdata[0];
            let mm = +sdata[1];
            let dd = +sdata[2];
            let dt = new Date(yy, mm - 1, dd);
            let Dt_Locked = dt;
            //let Dt_Locked = dt.ToString(GLOBALCONTANTS.FRONTEND_DATEFORMAT);
          }
        }
      }




    });
  }


  Save() {
    if (!this.Allvalid())
      return;

      alert('option not completed');

      return;

    this.saveList = <TBL_MAST_PARAM[]>[];
    this.saveList.push(this.AddRecord("RESOURCE URL", this.gs.branch_pkid, this.TxtImageUrl));
    this.saveList.push(this.AddRecord("FILES URL", this.gs.branch_pkid, this.TxtFileUrl));

    const saveRecord = <VM_TBL_MAST_SETTINGS>{};
    saveRecord.userinfo = this.gs.UserInfo;
    saveRecord.records = this.saveList;
    saveRecord.userinfo.PARAM_TYPE = 'BRANCH SETTINGS';

    this.mainService.Save(saveRecord)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage = response.error;
          alert(this.errorMessage);
        }
        else {
          this.errorMessage = 'Save Complete';
        }
      }, error => {
        this.errorMessage = this.gs.getError(error);
        alert(this.errorMessage);
      });
  }

  private AddRecord(SCATG: string, SPKID: string, ACNAME: string) {
    let Rec = <TBL_MAST_PARAM>{};
    Rec.param_pkid = this.gs.getGuid();
    Rec.param_type = "COMPANY SETTINGS";
    Rec.param_code = "";
    Rec.param_name1 = SCATG;
    Rec.param_name2 = SPKID;
    Rec.param_name3 = ACNAME;
    Rec.param_value1 = 0;
    return Rec;
  }


  Allvalid(): boolean {
    var bRet = true;
    this.errorMessage = "";
    return bRet;
  }

  Close() {
    this.location.back();
  }


}
