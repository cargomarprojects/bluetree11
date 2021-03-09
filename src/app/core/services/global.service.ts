import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UUID } from 'angular2-uuid';

import { Router } from '@angular/router';
import { GlobalData } from '../models/globaldata';
import { GlobalVariables } from '../models/globalvariables';
import { DefaultValues } from '../models/defaultvalues';

import { User_Menu } from '../models/menum';
import { Companym } from '../models/company';

import { Modulem } from '../models/modulem';
import { gsdata } from '../models/gsdata';



@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public Token: string;

  public IsLoginSuccess: boolean = false;

  public IsAuthenticated: boolean = false;
  public Access_Token: string;

  public globalData: GlobalData;
  public globalVariables: GlobalVariables;
  public defaultValues: DefaultValues;

  public reload_url  ='';

  mRec: Modulem = null;

  public appid = '';

  public baseUrl: string = "http://localhost:5000";
  //public baseUrl: string = "";
  // change this is false in production and update

  public isolderror: boolean = false;

  public MainList: any[];
  public UserRecord: any;
  public UserInfo: any;
  public Modules: Modulem[] = [];
  public MenuList: User_Menu[] = [];
  public CompanyList: Companym[] = [];
  public YearList: any[];
  public AccGroupList: any[];
  public GSESSION = 100;


  public branch_codes: string = '';
  public history: Array<{ id: string, url: string }> = [];


  // SILVERLIGHT SOFTWARE
  public SOFTWARE_NAME = "ANGULAR";
  public DB_BACKEND = "SQLSERVER";
  public DB_USER = "DBO";
  public USER_LOCATION_ID = 0;
  public SOFTWARE_VERSION = "";
  public COMPANY_STRING_ID = "";

  public WWW_ROOT = "https://localhost/SilverApp.Web";
  public WWW_ROOT_FILE_FOLDER = "https://localhost/File_Folder";
  public FILES_FOLDER = "NewYork";
  public WWW_FILES_URL = "https://localhost/File_Folder/Newyork/Files";

  public FS_APP_FOLDER = "";
  public GLOBAL_FTP_FOLDER = "";

  public INSTANCE_ID = "";

  public GLOBAL_REPORT_FOLDER = "D://motherlines.us//ftp//reports";
  public SEARCH_DATE_DIFF = 60;

  //Normal server or cloud server ...etc
  public SERVER_CATEGORY = "NORMAL";

  public AIRPORTDISPLAYCOLUMN = "CODE";
  public IsPWdBoxDisplayed = false;
  public IsMainPageLoaded = false;

  public user_handled_id = "";
  public user_handled_code = "";
  public user_handled_name = "";


  public user_ua_pkid = "";
  public user_pkid = '';
  public user_code = '';
  public user_pwd = '';
  public user_name = '';
  public user_email = '';
  public user_email_cc = '';

  public user_email_display_name = "";
  public user_email_signature = "";

  public user_email_sign_font = "Calibri";
  public user_email_sign_color = "Black";
  public user_email_sign_size = "16";
  public user_email_sign_bold = "N";

  public PARENT_ADDRESS_REQUIRED = "Y";

  public user_islocked = "";
  public user_isadmin = "";
  public user_party_name = "";
  public user_party_type = "";
  public user_hide_payroll: string = '';

  public USER_DISABLE_EDIT_SI_MBLSTATUS: string = '';

  public user_is_external = false;
  public Confirm_On_Exit = false;

  public CAN_ACCESS_GENERAL_EXPENSE = "N";
  public CAN_ACCESS_1099_EXPENSE = "N";
  public CAN_ACCESS_PAYROLL_EXPENSE = "N";
  public CAN_ACCESS_INTERNAL_PAYMENT_SETTLEMENT = "N";

  public DEFAULT_HBL_FORMAT = "";
  public DEFAULT_HBL_DRAFTFORMAT = "";

  public GENERAL_BRANCH_CODE = "";

  public SEA_IMP_OVERRIDE_POD_ETA = "N";
  public AIR_IMP_OVERRIDE_POD_ETA = "N";

  public SHIPMENTLOG_FORMAT = "OLD";
  public MACADDRESS = "";
  public ALLOW_LOGIN_FROM_MULTIPLE_SYSTEM = "Y";

  public audit_id = '';
  public company_sow = '';
  public company_pkid = '';
  public company_parent_id = "";
  public company_code = '';
  public company_name = '';
  public company_add1 = '';
  public company_add2 = '';
  public company_add3 = '';
  public company_add4 = '';
  public company_prefix = '';

  public branch_pkid = "";
  public branch_code = "";
  public branch_name = "";
  public branch_add1 = "";
  public branch_add2 = "";
  public branch_add3 = "";
  public branch_add4 = "";
  public branch_contact = "";
  public branch_prefix = "";

  public REC_COMPANY_CODE = "";
  public REC_BRANCH_CODE = "";

  public software_start_year: number = 0;
  public SEA_ARVL_FORMAT = "1";
  public SHOW_CHECK_DATE = "Y";
  public REMOVE_ZERO_FORMAT = "N";

  public PACKAGE_TOTAL_BUTTON = "N";
  public OPTIONAL_DESCRIPTION = "N";
  public DOC_FOOTER1 = "";
  public DOC_FOOTER2 = "";


  public year_pkid = "";
  public year_code = "";
  public year_name = "";
  public year_islocked = "";
  public year_start_date = "";
  public year_end_date = "";

  public FY_START_MONTH = "1";

  public PAYROLL_INVOICE_CODE = "";
  public PAYROLL_ACC_CODE = "";
  public PAYROLL_ENABLED = "N";

  public base_cur_pkid = "";
  public base_cur_code = "INR";
  public base_cur_name = "";
  public base_cur_exrate = "1";

  public foreign_cur_pkid = "";
  public foreign_cur_code = "USD";
  public foreign_cur_name = "";
  public foreign_cur_exrate = "1";


  public foreign_amt_dec = 2;
  public exrate_dec = 5;
  public base_amt_dec = 2;

  public foreign_amt_dec_fmt = "0.00";
  public exrate_dec_fmt = "0.00000";
  public base_amt_dec_fmt = "0.00";

  public BACKEND_DATEFORMAT = "YYYY/MM/DD";
  public FRONTEND_DATEFORMAT = "MM/dd/yyyy";
  //public date_display_fmt = "MM/dd/yyyy";
  public date_display_fmt: string = ""; // System.Threading.Thread.CurrentThread.CurrentCulture.DateTimeFormat.ShortDatePattern.ToString(); 
  public date_display_fmt_with_time = "MM/dd/yyyy HH:mm:ss";

  public ROWS_TO_DISPLAY = 20;

  public LOCK_DAYS_SEA = 0;
  public LOCK_DAYS_AIR = 0;
  public LOCK_DAYS_OTHERS = 0;
  public LOCK_DAYS_ADMIN = 0;

  public ACCOUNTS_LOCKED_DATE = "2001-01-01";


  public IS_SINGLE_CURRENCY = true;
  public AUTO_CLOSE_CHECK_PRINT = "N";
  public RE_PRINT_CHECK = "N";


  public FY_MONTHS: any = [];
  public BUDGET_TYPE: any = [];
  public CHQ_FORMAT: any = [];

  public INVOICE_STAGE: any;
  public SHIPMENT_STAGE_OI: any;
  public SHIPMENT_STAGE_OE: any;
  public SHIPMENT_STAGE_AI: any;
  public SHIPMENT_STAGE_AE: any;
  public SHIPMENT_STAGE_OT: any;

  public SHIPMENT_STAGE1 = "WAITING FOR CARRIER'S A/N";
  public SHIPMENT_STAGE2 = "CARRIER A/N RECEIVED";
  public SHIPMENT_STAGE3 = "MOTHERLINES'S A/N SENT";
  public SHIPMENT_STAGE4 = "CARGO RELEASED";
  public SHIPMENT_STAGE5 = "POST RELEASED (P/U & E/R)";
  public SHIPMENT_STAGE6 = "PROBLEM";
  public SHIPMENT_STAGE7 = "FILE COMPLETED";


  public SHIPMENT_STAGE_OE1 = "";
  public SHIPMENT_STAGE_OE2 = "";
  public SHIPMENT_STAGE_OE3 = "";
  public SHIPMENT_STAGE_OE4 = "";
  public SHIPMENT_STAGE_OE5 = "";
  public SHIPMENT_STAGE_OE6 = "";
  public SHIPMENT_STAGE_OE7 = "";
  public SHIPMENT_STAGE_OE8 = "";


  public SHIPMENT_STAGE_AE1 = "";
  public SHIPMENT_STAGE_AE2 = "";
  public SHIPMENT_STAGE_AE3 = "";
  public SHIPMENT_STAGE_AE4 = "";
  public SHIPMENT_STAGE_AE5 = "";
  public SHIPMENT_STAGE_AE6 = "";
  public SHIPMENT_STAGE_AE7 = "";


  public SHIPMENT_STAGE_AI1 = "";
  public SHIPMENT_STAGE_AI2 = "";
  public SHIPMENT_STAGE_AI3 = "";
  public SHIPMENT_STAGE_AI4 = "";
  public SHIPMENT_STAGE_AI5 = "";
  public SHIPMENT_STAGE_AI6 = "";
  public SHIPMENT_STAGE_AI7 = "";


  public SHIPMENT_STAGE_OT1 = "";
  public SHIPMENT_STAGE_OT2 = "";
  public SHIPMENT_STAGE_OT3 = "";
  public SHIPMENT_STAGE_OT4 = "";
  public SHIPMENT_STAGE_OT5 = "";
  public SHIPMENT_STAGE_OT6 = "";
  public SHIPMENT_STAGE_OT7 = "";


  public SETTINGS_AC_RECEIVABLE = "";
  public SETTINGS_AC_RECEIVABLE_NAME = "";

  public SETTINGS_AC_PAYABLE = "";
  public SETTINGS_AC_PAYABLE_NAME = "";

  public SETTINGS_AC_PETTYCASH = "";


  public SETTINGS_AC_BANK_CHARGES_ID = "";
  public SETTINGS_AC_BANK_CHARGES_NAME = "";

  public SETTINGS_AC_EX_DIFF_ID = "";
  public SETTINGS_AC_EX_DIFF_NAME = "";


  public INTERNAL_PAYMENT_SETTLMENT_AR_ID = "";
  public INTERNAL_PAYMENT_SETTLMENT_AR_NAME = "";
  public INTERNAL_PAYMENT_SETTLMENT_AP_ID = "";
  public INTERNAL_PAYMENT_SETTLMENT_AP_NAME = "";


  public INCOME_AE_ID = "";
  public INCOME_AE_NAME = "";
  public INCOME_AI_ID = "";
  public INCOME_AI_NAME = "";
  public INCOME_SE_ID = "";
  public INCOME_SE_NAME = "";
  public INCOME_SI_ID = "";
  public INCOME_SI_NAME = "";
  public INCOME_OT_ID = "";
  public INCOME_OT_NAME = "";



  //EXTRA ACCOUNTS
  public INCOME_EX_ID = "BF88DD5C-61AA-42EB-9018-29D3B9D277D6";
  public INCOME_EX_NAME = "INCOME - OT";


  public EXPENSE_AE_ID = "";
  public EXPENSE_AE_NAME = "";
  public EXPENSE_AI_ID = "";
  public EXPENSE_AI_NAME = "";
  public EXPENSE_SE_ID = "";
  public EXPENSE_SE_NAME = "";
  public EXPENSE_SI_ID = "";
  public EXPENSE_SI_NAME = "";
  public EXPENSE_OT_ID = "";
  public EXPENSE_OT_NAME = "";

  // VAT INVOICE DESCRIPTION
  public VAT_INVDESC_ID = "";
  public VAT_INVDESC_CODE = "";
  public VAT_INVDESC_NAME = "";

  // VAT ACCOUNT
  public VAT_ACC_ID = "";
  public VAT_ACC_CODE = "";
  public VAT_ACC_NAME = "";

  public VAT_PER = 0;


  // RETAINED PROFIT 
  public RETAINED_PROFIT_ID = "";
  public RETAINED_PROFIT_CODE = "";
  public RETAINED_PROFIT_NAME = "";

  //EXTRA ACCOUTNS
  public EXPENSE_EX_ID = "D06826B6-DAB8-485D-897D-D9296700A542";
  public EXPENSE_EX_NAME = "EXPENSE - OT";

  public ISSUE_AGENT_ID = "";
  public ISSUE_AGENT_NAME = "";
  public ISSUE_AGENT_ADDRESS = "11 SUNRISE PLAZA, SUITE 305";
  public ISSUE_AGENT_CITY = "";
  public HBL_IATA = "0112713/0012";


  public HOME_PAGE_LOGO_DISPLAY = "Y";
  public HOME_PAGE_NAME_DISPLAY = "Y";
  public SHOW_CTPAT_LOGO = "N";

  public BOE_IMPORT_REQUIRED = "N";

  public ALLOW_ARAP_CODE_SELECTION = "N";

  public BRANCH_REGION = "";


  public HIDE_DOCTYPE_INVOICE = "N";

  public MESSENGER_PKID = "5370BBBC-FFA3-4D5B-A8DC-A57CF1B640DA";
  public MESSENGER_SLIP_DROP_AT = "Motherlines";


  public HBL_INSTR1 = "";
  public HBL_INSTR2 = "";

  public SEA_EXPORT_HOUSE_PREFIX = "";
  public SEA_EXPORT_HOUSE_PREFIX_POL = "N";
  public SEA_EXPORT_HOUSE_PREFIX_POD = "N";
  public SEA_EXPORT_HOUSE_STARTING_NO = "";
  public SEA_EXPORT_HOUSE_INCR_BY = "1";

  public AIR_EXPORT_HOUSE_PREFIX = "";
  public AIR_EXPORT_HOUSE_PREFIX_POL = "N";
  public AIR_EXPORT_HOUSE_PREFIX_POD = "N";
  public AIR_EXPORT_HOUSE_STARTING_NO = "";
  public AIR_EXPORT_HOUSE_INCR_BY = "1";


  public SEA_EXPORT_REFNO_PREFIX = "OE";
  public SEA_EXPORT_REFNO_STARTING_NO = "1001";
  public SEA_IMPORT_REFNO_PREFIX = "OI";
  public SEA_IMPORT_REFNO_STARTING_NO = "1001";
  public AIR_EXPORT_REFNO_PREFIX = "AE";
  public AIR_EXPORT_REFNO_STARTING_NO = "1001";
  public AIR_IMPORT_REFNO_PREFIX = "AI";
  public AIR_IMPORT_REFNO_STARTING_NO = "1001";
  public OTHER_OPERATION_REFNO_PREFIX = "OT";
  public OTHER_OPERATION_REFNO_STARTING_NO = "1001";



  public AR_INVOICE_PREFIX = "INY";
  public AR_INVOICE_STARTING_NO = "1001";
  public AP_INVOICE_PREFIX = "PNY";
  public AP_INVOICE_STARTING_NO = "1001";


  public DEBIT_NOTE_PREFIX = "";
  public DEBIT_NOTE_STARTING_NO = "";


  //EXTRA 
  public EXTRA_OPERATION_REFNO_PREFIX = "EX";
  public EXTRA_OPERATION_REFNO_STARTING_NO = "1001";
  public SHOW_EXTRA_OPERATION = "N";


  //public DIRECT_AGENT_NAME = "DIRECT BILL";
  //public DIRECT_AGENT_ID = "516EEFD6-73C3-4351-B88C-5E3E801EF596";

  public DIRECT_AGENT_NAME = "";
  public DIRECT_AGENT_ID = "";

  public PRINT_FIRMCODE = "Y";

  public AC_REPORT_BASED_ON = "MASTER REF DATE";

  public ADDRESS_LINE1: string = '';
  public ADDRESS_LINE2: string = '';
  public ADDRESS_LINE3: string = '';
  public ADDRESS_LINE4: string = '';
  public ADDRESS_LINE5: string = '';

  public ADDRESS_DUMMY_LINE1 = "";
  public ADDRESS_DUMMY_LINE2 = "";
  public ADDRESS_DUMMY_LINE3 = "";
  public ADDRESS_DUMMY_LINE4 = "";
  public ADDRESS_DUMMY_LINE5 = "";


  // MENU CONSTANTS

  public MENU_AR_DEPOSIT = "924E3CAF-FD14-41D9-8E75-9EA8A3FCA10E";
  public MENU_ACCOUNTS_GROUP = "3CABB599-0FE3-4120-8A14-B105356CAC07";
  public MENU_AIR_CARRIER = "07C8B41F-E1F9-42C2-954B-5DE3B44BB80A";
  public MENU_AE_HOUSE = "4456003D-C809-49E7-B0C9-65A4A7C71317";
  public MENU_AE_HOUSE_HAWB_CONSIGNEE = "32FA0FF1-C4E0-451E-87DD-B833F58AC1C4";
  public MENU_AE_HOUSE_HAWB_SHIPPER = "D87B619E-8C7B-4EFC-A4EF-70E1E3C99A8E";
  public MENU_AE_HOUSE_INVOICE = "348C6E6A-6782-4944-8B04-64DD307A5474";
  public MENU_AE_MASTER = "19470EF4-0851-454D-96DC-64896F9C68B1";
  public MENU_AE_MASTER_ARAP = "AA0029A9-F985-49C4-B209-2E0A90CDA699";
  public MENU_AE_MASTER_MANIFEST = "8BBFCFE7-84AB-4F4B-9F67-F73A9933171F";
  public MENU_AE_MASTER_PRINT_MAWB = "7F6E9224-0D51-47B0-9157-46294717D82A";
  public MENU_AE_MASTER_PROFIT_REPORT = "30AD0422-9598-4480-B736-9209398DC13F";
  public MENU_AI_HOUSE = "6A83A687-8DF3-4644-9927-4927D3BA12C3";
  public MENU_AI_HOUSE_ARRIVAL_NOTICE = "CCC5E8A2-70F8-492C-AA96-274FC4BD498B";
  public MENU_AI_HOUSE_AUTH_MAKE_ENTRY = "6A80586B-814F-461D-9975-D7A66BAC5A27";
  public MENU_AI_HOUSE_DELIVERY_ORDER = "6E0C8ABA-B376-45A0-9C9C-C6DE923D3363";
  public MENU_AI_HOUSE_INVOICE = "2B5D5919-3E79-4307-AF74-6F41A024C06F";
  public MENU_AI_HOUSE_RELEASE_ORDER = "01FCB06A-94F5-4E25-ABEB-C3DBCE47910E";
  public MENU_AI_MASTER = "5EAE5AAF-855B-4CE4-8D7A-429698F90E04";
  public MENU_AI_MASTER_ARAP = "917E2069-B12E-4264-BDCB-15E0E2956262";
  public MENU_AI_MASTER_POD = "C9EF8A00-6B04-44D3-B20B-11B6E2C832BD";
  public MENU_AI_MASTER_PROFIT_REPORT = "B5BD9EFA-FDB8-4CA9-9079-2174B697CA53";
  public MENU_AIR_PORT = "89EFE1B1-1F86-4F74-B111-543277ADE82E";
  public MENU_AIR_TONNAGE_REPORT = "83BC4B2B-6D1E-4879-A572-8F2D94C1A915";
  public MENU_BALANCE_SHEET = "92745756-FDBB-417B-9A74-326702C66CF9";
  public MENU_BANK_ENQUIRY = "7EA7778D-D8A1-4A4B-A246-799651F6C7D0";
  public MENU_BRANCH_MASTER = "B49790E9-EA24-42AA-8243-2C6127F9A110";
  public MENU_BRANCH_SETTINGS = "35390727-571C-486B-AAA1-5AAA7C7C306D";
  public MENU_CARGO_MOVEMENT = "PARAM777-AAAA-4247-958F-672BA8CBBD47";
  public MENU_CHART_OF_ACCOUNTS = "3F51C7F1-72FB-4985-91CB-7B3E0089700F";
  public MENU_CHECK_FORMAT = "3C0BD4EE-CAB0-4C51-B303-90018B10DBE7";
  public MENU_CHECK_SETTINGS = "F127116F-4585-4617-ACA4-E18F417CB558";
  public MENU_COMPANY_MASTER = "45A5DEE2-74AD-4CDD-AD8C-E95DEE6A4958";
  public MENU_COMPANY_SETTINGS = "655B999D-E52F-49EC-851B-A94A05D95F02";
  public MENU_CONTAINER_TYPE = "PARAM666-AAAA-4247-958F-672BA8CBBD47";
  public MENU_COUNTRY_MASTER = "PARAM222-AAAA-4247-958F-672BA8CBBD47";
  public MENU_CURRENCY_MASTER = "PARAM444-AAAA-4247-958F-672BA8CBBD47";
  public MENU_DAILY_TRANSACTION_REPORTS = "E85F30E7-E3CA-4FA7-96CC-E6ECE7A9DB69";
  public MENU_FREIGHT_STATUS = "PARAM555-AAAA-4247-958F-672BA8CBBD47";
  public MENU_FUND_TRANSFER = "7F587015-0E35-4235-8475-5620860251D3";
  public MENU_GENERAL_EXPENSE = "B839BE8E-1C3D-4FF8-BDC1-34E64B1C68FB";
  public MENU_GENERAL_EXPENSE_ARAP = "9D3043F9-A234-40E9-B00E-F7EEA25C92F4";
  public MENU_GENERAL_EXPENSE_PROFIT_REPORT = "AFBEA5EE-3322-4DAC-94B5-CB1198F62701";
  public MENU_GENERAL_LEDGER = "59D1233B-D311-479B-AFF1-9BF6D668F2C0";
  public MENU_GLOBAL_SETTINGS = "C5BA60F7-C4EB-464B-A628-933C96DE7E39";
  public MENU_HBL_FORMAT = "A061C2F1-6831-45BC-BF7D-0510C2655BC8";
  public MENU_HBL_SETTINGS = "D93149F1-4E90-45A4-9FB0-7A606B8F561A";
  public MENU_IMPORT_EXCEL = "5FAFF177-FC54-4C10-B088-CD7DF9C0F890";
  public MENU_IMPORT_HBL_DATA_SEA = "187D40C8-5DBE-4211-819D-2B28D582CE82";
  public MENU_INVOICE = "02A8F340-616E-4907-9E08-0EFACB9AF229";
  public MENU_INVOICE_DESCRIPTION = "8C6AE276-B8C4-4B67-8613-79B7196E222C";
  public MENU_LOG_REPORT = "B9601788-A5C0-4369-963F-E630E53DEBCD";
  public MENU_MARKETING_CONTACTS = "7E9AF89F-6A83-4DB5-904A-02FCC7C1BAED";
  public MENU_MASTER_DATA = "6727DF99-9385-4991-841B-1ECAA9E3B28A";
  public MENU_MENU_HEADING = "72E365A6-947C-4773-9346-8E8227ACB22D";
  public MENU_MENU_MASTER = "D9731B0E-5C03-402C-87DD-238E1163A1B7";
  public MENU_MODULE_MASTER = "F16F4AC9-49E1-464A-89A9-684C656DF5F4";
  public MENU_NOMINATION_STATUS = "2EFB1A9E-35D4-49E1-9CA5-4C4B604135DB";
  public MENU_SE_BOOKING = "BD8C20C8-373F-44DA-AA0D-65F4A4D300BA";
  public MENU_SE_HOUSE = "4064D888-8791-482C-9108-68F0ACFF1225";
  public MENU_SE_HOUSE_HBL_LASER = "2E44B815-D74C-4A55-956A-0274142C0409";
  public MENU_SE_HOUSE_INVOICE = "D4E496DD-8AE4-479C-B0BF-70887C96BCF4";
  public MENU_SE_HOUSE_PRINT_HBL = "037CD351-46B4-44C0-9EEF-F0D165A9B607";
  public MENU_SE_MASTER = "3782BFD0-68A9-4126-9C80-DBB5801BDBAF";
  public MENU_SE_MASTER_ARAP = "1D00C676-66FE-454B-BBFA-815660EB1C0C";
  public MENU_SE_MASTER_CONTAINER_DRAYAGE = "2ED32F9D-0848-44C7-9D85-ED72DE15FF4C";
  public MENU_SE_MASTER_MANIFEST = "28352EF9-329E-411E-8AAB-D51F7C40F41E";
  public MENU_SE_MASTER_MBL_INSTRUCTION = "350BAA21-3488-45E5-86FB-B2B8E84F3B93";
  public MENU_SE_MASTER_PROFIT_REPORT = "01F0EBF5-A60A-4281-8D25-714F117C8F1D";
  public MENU_SI_MASTER = "BF731A5F-C54F-4B41-9BAD-7F7C65EDFFCD";
  public MENU_SI_MASTER_ARAP = "9769E15C-7C78-4FB2-82B6-9936312ED721";
  public MENU_SI_MASTER_DEVANNING_INSTRUCTION = "63B5982D-8A03-4B0A-B516-279B0586CF86";
  public MENU_SI_MASTER_POD = "C4E6A124-41E6-428B-BCF9-9BAD1F34DD29";
  public MENU_SI_MASTER_PROFIT_REPORT = "48D57D23-8812-4AC7-8A6D-15B0AFD75417";
  public MENU_SI_MASTER_DELIVERY_ORDER = "7A38AA74-26B4-47B6-9BBD-467488924D8D";
  public MENU_SI_HOUSE = "1EA0649A-757F-420C-B0D6-D826884A9082";
  public MENU_SI_HOUSE_ARRIVAL_NOTICE = "838700C0-3633-4DF5-9AC1-7E0D44D4AA77";
  public MENU_SI_HOUSE_DELIVERY_ORDER = "A122070B-FDDF-4A67-A500-A64B0FCFA475";
  public MENU_SI_HOUSE_DEVAN_INSTRUCTION = "3445C3F6-AB83-4EFF-9B1B-ED4DB8863789";
  public MENU_SI_HOUSE_INVOICE = "C662E0DD-D771-4CDC-8485-BED2E61EBD5A";
  public MENU_SI_HOUSE_PRE_ADVISE = "C85363AF-2612-43C6-A19F-64006C2CC69A";
  public MENU_SI_HOUSE_TURNOVER_LETTER = "4117F2D3-DEFD-4E7C-8040-4DBAB955FEA2";
  public MENU_SI_HOUSE_US_CUSTOM_HOLD = "5582F74C-8A53-42B1-8CCC-CFC98D520E92";
  public MENU_OT_OPERATION = "491978EE-4C62-46B3-BD34-06D9382469FA";
  public MENU_OT_OPERATION_ARAP = "5B4A410A-A3B9-466E-BE06-FC526AE0682D";
  public MENU_OT_OPERATION_DELIVERY_ORDER = "756C7E38-B4CA-4CD1-B2B8-6ADEA8E25A71";
  public MENU_OT_OPERATION_PROFIT_REPORT = "165EB201-8257-4F69-9B40-0EACA8CD29F8";
  public MENU_OUTSTANDING_REPORT = "B1983040-B9F0-4AA3-B051-B32CEEA651CF";
  public MENU_P_AND_L_REPORT = "A41BEAE3-D1CA-4F90-900E-AC6CCEC740DB";
  public MENU_PAYMENT = "34931301-42BB-4516-96DA-5C969CA1D7FB";
  public MENU_PETTY_CASH = "C376875A-B947-4A53-B35B-D6F01585E29F";
  public MENU_PORT_MASTER = "PARAM111-AAAA-4247-958F-672BA8CBBD47";
  public MENU_PROFIT_REPORT = "4944350B-3392-4212-965A-0211BA3C6FC0";
  public MENU_QUOTATION_AIR = "4BFB7155-9244-4390-8D1D-FF68DDDB4B23";
  public MENU_QUOTATION_FCL = "BC7AB239-5E46-4585-8D47-0B888339FE11";
  public MENU_QUOTATION_LCL = "87D4C201-5818-42F2-9F24-E99093BF49FB";
  public MENU_SALESMAN_MASTER = "PARAM888-AAAA-4247-958F-672BA8CBBD47";
  public MENU_SEA_CARRIER = "3CEFE6FA-54DB-4A6B-BF75-EF67C3F39EA4";
  public MENU_SEA_PORT = "9E4882B1-D304-41F8-B8CD-0AC6CBFA4110";
  public MENU_SEARCH_RECORDS = "D9E746A2-EB17-4250-8D8B-6683C8763E6A";
  public MENU_SHIPMENT_HANDLED_REPORT = "DF233486-ADA2-4555-9565-BD47720BD23B";
  public MENU_SHIPMENT_LABEL = "578D602D-8C94-47FA-95E0-775C22C6C494";
  public MENU_SHIPMENT_REGISTER = "D564BA92-0F1E-4080-9EA1-7C49483CFE73";
  public MENU_STATE_MASTER = "1D4D2C56-7709-472D-86A8-D0DF83D273CD";
  public MENU_TEU_VOLUME_REPORT = "9312BBCC-F723-4B28-9231-4EC157F24743";
  public MENU_TRIAL_BALANCE = "B977F63E-D851-490B-A1CB-B356306E2D82";
  public MENU_UNIT_MASTER = "PARAM333-AAAA-4247-958F-672BA8CBBD47";
  public MENU_USER_MASTER = "45B3D6A4-DDA4-4614-9D58-B0F3A16C0A25";
  public MENU_USER_RIGHTS = "EEB9499D-22E5-46FB-BAA1-1476450BF25D";
  public MENU_INTERNAL_PAYMENT_SETTLEMENT = "CA094B5F-5831-4D9D-9FCE-58CAF7F6F1B4";
  public MENU_INTERNAL_PAYMENT_SETTLEMENT_ARAP = "12F6CF93-203D-462B-9C1F-DFE5F4EFE3F6";
  public MENU_INTERNAL_PAYMENT_SETTLEMENT_PROFIT_REPORT = "8EEE56C6-C109-4D64-AA99-4C6CF1044F77";
  public MENU_PAYROLL_EXPENSE = "0EFF5835-4256-4A49-B3AA-07EEF4D22AE9";
  public MENU_PAYROLL_EXPENSE_ARAP = "1C9A059A-A0E3-4FBA-9406-569A305E418C";
  public MENU_PAYROLL_EXPENSE_PROFIT_REPORT = "4C4DCA31-13C9-4D9B-9D00-408C8DB18233";
  public MENU_1099_EXPENSE = "AECF923D-DFFF-406C-BAF4-F45685694B89";
  public MENU_1099_EXPENSE_ARAP = "DA801C56-2D8D-4185-BF0C-A50AD96D62FC";
  public MENU_1099_EXPENSE_PROFIT_REPORT = "079F872C-FEC5-4C89-98B3-9809E53157F3";
  public MENU_SE_MASTER_DOCK_RECEIPT = "FFD480F8-1F2A-40C5-88FA-EB3C2C1554D3";
  public MENU_OT_PICKUP_DELIVERY_ORDER = "48AA2D5E-A009-488C-A96E-1422500A7F38";
  public MENU_SI_MESSENGER_SLIP = "3CD0BA60-2C28-477F-9E5F-CE2A13AC72F6";
  public MENU_SE_MESSENGER_SLIP = "3F36A13B-B170-49C6-86EA-7E8271E54ECB";
  public MENU_AI_MESSENGER_SLIP = "92334CBE-3335-4179-B374-D4A953A7CB87";
  public MENU_AE_MESSENGER_SLIP = "12353FC5-E278-4310-BE46-D32EE7F2668A";
  public MENU_OT_MESSENGER_SLIP = "9F224775-F528-4CB5-81C7-F266C3F3648B";
  public MENU_ACC_ARAP_SETTLMENT = "34931301-42BB-4516-96DA-5C969CA1D7FB";
  public MENU_FILE_ADJUSTMENT = "78B100F5-F4C8-4443-9256-9B2E1F2CE36C";
  public MENU_FILE_ADJUSTMENT_ARAP = "2CC7B1B4-F38E-4A3A-B954-D3E221DB00DA";
  public MENU_FILE_ADJUSTMENT_PROFIT_REPORT = "F9B3E50F-5445-402A-9B10-47E7268A350D";
  public MENU_SI_CONTAINER_MOVEMENT = "978A908C-684C-4C3F-874D-CF3C211DDCB7";
  public MENU_SI_SHIPMENT_MOVEMENT = "41E1522E-3821-4BCC-A4A2-B48BF09B0D3A";
  public MENU_AI_SHIPMENT_MOVEMENT = "523DAA09-3F0E-4EFC-8C12-13FDEFE0557E";
  public MENU_AI_HOUSE_NOT_RELEASE_LETTER = "43A9B23A-50CA-45D7-AD4A-BA8E017B8D63";
  public MENU_SE_MANIFEST_EDI = "8B32F917-1BB6-4B07-8D2E-88E64C38A854";
  public MENU_SI_PAYMENT_REQUEST = "7E0E576F-AF17-4E85-8511-25CA6D27AA4E";
  public MENU_SI_ATTACHMENTS = "0FB234ED-4996-4868-B27E-D49AC9928E82";
  public MENU_SE_PAYMENT_REQUEST = "8AA32201-D482-402D-A07D-8F9C7019C03F";
  public MENU_SE_ATTACHMENTS = "7FE3F949-3740-4D67-82BC-288CE5BB0F27";
  public MENU_AI_PAYMENT_REQUEST = "B438911B-1B86-4DA6-92E6-628BCA0FB7CB";
  public MENU_AI_ATTACHMENTS = "FA4FDF0A-DBF4-4592-A087-67A805ABAC00";
  public MENU_AE_PAYMENT_REQUEST = "207364DF-3A9E-43CD-867C-43EF09F72E8E";
  public MENU_AE_ATTACHMENTS = "86BC3E6F-72C3-4AC8-9BC1-8813836DD004";
  public MENU_OT_PAYMENT_REQUEST = "3E7AEE4E-D2E0-49A5-8E31-A9C4284D9762";
  public MENU_OT_ATTACHMENTS = "335F8C43-FD9B-4B46-8988-89C997FFAECC";
  public MENU_ALERT_AR_LIST = "BF01E1D2-5BFF-4F84-BCDC-8E4F97D1AD48";
  public MENU_SI_BOOKING = "55F3B27E-B9DD-4003-8379-FBAF2E4705D4";
  public MENU_OT_MASTER_INTERNAL_MEMO = "67884E37-C7C5-4D30-9AC2-854904B9ADE2";
  public MENU_SI_MASTER_INTERNAL_MEMO = "C0513EAB-53A4-41C1-902A-FECF5E1F40ED";
  public MENU_SE_MASTER_INTERNAL_MEMO = "B3E5EDD3-ECEF-4F6A-A7E3-2E323D460095";
  public MENU_AE_MASTER_INTERNAL_MEMO = "1ACE2796-712A-453D-947C-4687221ADA34";
  public MENU_AI_MASTER_INTERNAL_MEMO = "6AD0A826-5C5E-4951-9C59-ECE342489E35";
  public MENU_OT_MASTER_REQUEST_APPROVAL = "760846FD-5937-43FC-8CA9-338A88AE6232";
  public MENU_SI_MASTER_REQUEST_APPROVAL = "55C48A3C-CF6B-4A86-964E-C66108206584";
  public MENU_SE_MASTER_REQUEST_APPROVAL = "DF4DC01A-FDCD-4FEB-87E9-6991F5709ECE";
  public MENU_AE_MASTER_REQUEST_APPROVAL = "B6BC20F0-6AB4-4527-8BCB-F28026F5AC97";
  public MENU_AI_MASTER_REQUEST_APPROVAL = "791C2E89-F0F7-4132-99F7-69A17A2947F8";
  public MENU_EX_OPERATION = "DBC36B35-FEB9-4BC9-BC8E-ED5629A6AE9C";
  public MENU_EX_OPERATION_DELIVERY_ORDER = "B2A418CA-DBCD-4607-AAE8-8686CC3FB83E";
  public MENU_EX_OPERATION_PROFIT_REPORT = "9A471CE9-EE66-4A71-ADB8-BA7F92999F0F";
  public MENU_EX_OPERATION_ARAP = "5E7D2A08-2E00-4B2A-9A55-2D89727921D2";
  public MENU_EX_MESSENGER_SLIP = "F7D0B54F-D982-4CC7-BDFA-F79EC96CDB19";
  public MENU_EX_PAYMENT_REQUEST = "CCD511D5-878F-48F5-B8AD-7A965E5FC3C1";
  public MENU_EX_ATTACHMENTS = "34C21A00-45FB-46BE-ACFE-8465C1C8F45B";
  public MENU_EX_MASTER_INTERNAL_MEMO = "222BC83B-15AB-466B-912E-ADDFB9FD1528";
  public MENU_EX_MASTER_REQUEST_APPROVAL = "597B0692-F1E6-4076-B6F9-FD744B09AF31";
  public MENU_FORMS_FILE_UPLOAD = "D068821C-B6AE-47BE-A91F-83BAA2C395F5";
  public MENU_SE_MASTER_CERTIFICATE_ORIGIN = "A8F97344-12C3-44EE-A4E1-B738380ECDA5";


  // END OF SILIVERLIGHT



  public GENERALEXPENSE_INIT_GE: any;
  public GENERALEXPENSE_INIT_PR: any;
  public GENERALEXPENSE_INIT_CM: any;
  public GENERALEXPENSE_INIT_PS: any;
  public GENERALEXPENSE_INIT_FA: any;
  public PARTYPAGE_INIT_PARTYS: any;
  public PARTYPAGE_INIT_OVERSEAAGENT: any;
  public APPROVEDPAGE_INIT_APPROVED: any;
  public APPROVEDPAGE_INIT_REQUESTREPORT: any;
  public APPROVEDPAGE_INIT_APPROVEDREPORT: any;

  public JOB_TYPE_OI: any = [];
  public JOB_TYPE_OE: any = [];
  public JOB_TYPE_AI: any = [];
  public JOB_TYPE_AE: any = [];
  public JOB_TYPE_OT: any = [];

  public PARAM_FREIGHT_STATUS: any = [];
  public PARAM_CARGO_MOVEMENT: any = [];
  public PARAM_CONTAINER_TYPE: any = [];
  public PARAM_NOMINATION: any = [];
  public PARAM_COUNTRY: any = [];
  public PARAM_CURRENCY: any = [];
  public PARAM_HBL_FORMAT: any = [];
  public PARAM_HBL_FORMAT_BLANK: any = [];
  public PARAM_HBL_FORMAT_DRAFT: any = [];
  public PARAM_HAWB_FORMAT: any = [];
  public PARAM_UNIT: any = [];
  public PARAM_CUSTOMER_GROUP: any = [];
  public PARAM_FORM_CATEGORIES: any = [];
  public PARAM_COO_FORMAT_BLANK: any = [];


  public InitLogin() {

    this.BACKEND_DATEFORMAT = "YYYY/MM/DD";
    this.FRONTEND_DATEFORMAT = "YYYY/MM/DD";

    this.date_display_fmt = '';//System.Threading.Thread.CurrentThread.CurrentCulture.DateTimeFormat.ShortDatePattern.ToString(); 

    this.user_pkid = this.UserRecord.usr_pkid;
    this.user_code = this.UserRecord.usr_code;
    this.user_name = this.UserRecord.usr_name;
    this.user_islocked = "N";
    this.user_isadmin = "N";


    this.ALLOW_LOGIN_FROM_MULTIPLE_SYSTEM = this.UserRecord.ALLOW_LOGIN_FROM_MULTIPLE_SYSTEM;


    this.user_hide_payroll = this.UserRecord.usr_hide_payroll;
    this.USER_DISABLE_EDIT_SI_MBLSTATUS = this.UserRecord.usr_disable_edit_si_mblstatus;

    this.user_email_cc = this.UserRecord.usr_email_cc;
    this.user_email = this.UserRecord.usr_email;

    this.user_email_display_name = this.UserRecord.usr_email_display_name;
    this.user_email_signature = this.UserRecord.usr_email_signature;

    if (this.UserRecord.usr_email_sign_font != "")
      this.user_email_sign_font = this.UserRecord.usr_email_sign_font;
    if (this.UserRecord.usr_email_sign_color != "")
      this.user_email_sign_color = this.UserRecord.usr_email_sign_color;
    if (this.UserRecord.usr_email_sign_size != "")
      this.user_email_sign_size = this.UserRecord.usr_email_sign_size;
    if (this.UserRecord.usr_email_sign_bold != "")
      this.user_email_sign_bold = this.UserRecord.usr_email_sign_bold;

    if (this.UserRecord.usr_code == "ADMIN")
      this.user_isadmin = "Y";

    if (this.UserRecord.usr_confirm_onexit == "Y")
      this.Confirm_On_Exit = true;
    else
      this.Confirm_On_Exit = false;

    this.audit_id = this.UserRecord.AUDIT_ID;
    //gs.user_ua_pkid = gs.UserRecord.ua_pkid;
    this.company_pkid = this.UserRecord.comp_pkid;
    //gs.company_parent_id = gs.UserRecord.comp_parent_id;
    this.company_code = this.UserRecord.comp_code;
    this.company_name = this.UserRecord.comp_name;
    this.company_add1 = this.UserRecord.comp_add1;
    this.company_add2 = this.UserRecord.comp_add2;
    this.company_add3 = this.UserRecord.comp_add3;
    this.company_add4 = this.UserRecord.comp_add4;

    //gs.USER_LOCATION_ID = Lib.Convert2Integer(gs.UserRecord.comp_code);
    this.USER_LOCATION_ID = +this.UserRecord.comp_code;

    this.REC_COMPANY_CODE = this.UserRecord.REC_COMPANY_CODE;
    //gs.REC_BRANCH_CODE = gs.UserRecord.REC_BRANCH_CODE;
    this.ADDRESS_LINE1 = this.UserRecord.comp_line1;
    this.ADDRESS_LINE2 = this.UserRecord.comp_line2;
    this.ADDRESS_LINE3 = this.UserRecord.comp_line3;
    this.ADDRESS_LINE4 = this.UserRecord.comp_line4;

    this.company_sow = this.UserRecord.comp_sow;
    this.branch_pkid = "";
    this.InitUserInfo();
  }

  public InitUserInfo() {

    this.UserInfo = {
      "~USR_PKID": this.user_pkid,
      "~USR_CODE": this.user_code,
      "~USR_NAME": this.user_name,
      "~USR_ISADMIN": this.user_isadmin,
      "~USER_NAME": this.user_name,
      "~COMPANY_CODE": this.company_code,
      "~COMPANY_PKID": this.company_pkid,
      "~COMPANY_PARENT_ID": this.company_parent_id,
      "~BRANCH_PKID": this.branch_pkid,
      "~USR_LOCATION_ID": this.USER_LOCATION_ID,
      "~REC_COMPANY_CODE": this.REC_COMPANY_CODE,
      "~REC_BRANCH_CODE": this.REC_BRANCH_CODE,
      "~BRANCH_PREFIX": this.branch_prefix,
      "~YEAR_PKID": this.year_pkid,
      "~YEAR_CODE": this.year_code,
      "~YEAR_START_DATE": this.year_start_date,
      "~YEAR_END_DATE": this.year_end_date,
      "~YEAR_ISLOCKED": this.year_islocked,
      "~AUDIT_ID": this.audit_id,
      "~SERVER_CATEGORY": this.SERVER_CATEGORY,
      "~FRONTEND_DATE_FORMAT": this.FRONTEND_DATEFORMAT,
      "~BACKEND_DATE_FORMAT": this.BACKEND_DATEFORMAT,
      "~REMOVE_ZERO_FORMAT": this.REMOVE_ZERO_FORMAT,
      "~INSTANCE_ID": this.INSTANCE_ID,
      "~MACADDRESS": this.MACADDRESS,
      "~ALLOW_LOGIN_FROM_MULTIPLE_SYSTEM": this.ALLOW_LOGIN_FROM_MULTIPLE_SYSTEM,
      "~GENERAL_BRANCH_CODE": this.GENERAL_BRANCH_CODE,
      "~HIDE_PAYROLL": this.user_hide_payroll,
      "~SOFTWARE_VERSION": this.SOFTWARE_VERSION,
      "~SOFTWARE_NAME": this.SOFTWARE_NAME,

      "~ADDRESS_LINE1": this.ADDRESS_LINE1,
      "~ADDRESS_LINE2": this.ADDRESS_LINE2,
      "~ADDRESS_LINE3": this.ADDRESS_LINE3,
      "~ADDRESS_LINE4": this.ADDRESS_LINE4,
      "~ADDRESS_LINE5": this.ADDRESS_LINE5,
      "~DOC_FOOTER1": this.DOC_FOOTER1,
      "~DOC_FOOTER2": this.DOC_FOOTER2,
      "~date_display_fmt": this.date_display_fmt,
      "~BOE_IMPORT_REQUIRED": this.BOE_IMPORT_REQUIRED,
      "~FRONTEND_DATEFORMAT": this.FRONTEND_DATEFORMAT,
      "~PRINT_FIRMCODE": this.PRINT_FIRMCODE,
      "~WWW_ROOT": this.WWW_ROOT,
      "~GLOBAL_REPORT_FOLDER": this.GLOBAL_REPORT_FOLDER,
      "~AIRPORTDISPLAYCOLUMN": this.AIRPORTDISPLAYCOLUMN,
      "~BRANCH_REGION": this.BRANCH_REGION,
      "~FILES_FOLDER": this.FILES_FOLDER,
      "~SHOW_CTPAT_LOGO": this.SHOW_CTPAT_LOGO,
      "~USER_EMAIL": this.user_email,
      "~SEA_ARVL_FORMAT": this.SEA_ARVL_FORMAT,
      "~MESSENGER_SLIP_DROP_AT": this.MESSENGER_SLIP_DROP_AT,
      "~HBL_INSTR1": this.HBL_INSTR1,
      "~HBL_INSTR2": this.HBL_INSTR2,
      "~DATE_DISPLAY_FMT_WITH_TIME": this.date_display_fmt_with_time
    }

  }


  LoadSettingsApi(SearchData: any) {
    return this.http2.post<any>(this.baseUrl + "/api/Auth/LoadSettings", SearchData, this.headerparam2('anonymous'));
  }
  LoadMenuApi(SearchData: any) {
    return this.http2.post<any>(this.baseUrl + "/api/Auth/LoadMenu", SearchData, this.headerparam2('authorized'));
  }


  public async LoadSettings() : Promise<number> {
    let bRet = -1;
    var SearchData: any = {};
    SearchData = this.UserInfo;
    SearchData.PARAM_TYPE = "ALL SETTINGS";
    SearchData.SCREEN = "LOGIN2";
    SearchData["SET-LOGIN"] = "Y";
    console.log('MainList Begin 1');
    await this.http2.post<any>(this.baseUrl + "/api/Auth/LoadSettings", SearchData, this.headerparam2('anonymous')).toPromise().then((response) => {
      console.log('MainList Loaded 2');
      this.MainList = response.list;
      this.InitData();
      this.InitUserInfo();
      //this.GLOBALCONTANTS.InitMonths();
      bRet = 0;
    }, (error) => {
      bRet = -1;
      console.log('MainList Loading Error');
      const err = JSON.stringify(error);
      alert(err);
    });
    console.log('MainList End 3');
    return bRet;
  }

  public async LoadMenu(): Promise<number> {
    let bRet = -1;
    var module_name = '';
    var grpname = '';
    var SearchData: any = {};
    SearchData = this.UserInfo;
    if (this.user_isadmin == "Y")
      SearchData.UA_ID = "";
    else
      SearchData.UA_ID = this.user_ua_pkid;
    console.log('Menu Loading Begin 1');
    await this.http2.post<any>(this.baseUrl + "/api/Auth/LoadMenu", SearchData, this.headerparam2('authorized')).toPromise().then((response) => {
      console.log('Menu Loaded 2');
      this.MenuList = response.list;
      this.Modules = [];
      
      this.MenuList.forEach(element => {
        if (module_name != element.module_name) {
          this.mRec = new Modulem();
          this.mRec.module_name = element.module_name;
          this.Modules.push(this.mRec);
          module_name = element.module_name;
        }
        if ( element.menu_hiden==='N') {
        if ( grpname != element.menu_group_name) 
            grpname =  element.menu_group_name;
        else 
          element.menu_group_name = null;
        }
      });
      bRet = 0;
    }, (error) => {
      bRet = -1;
      console.log('Menu Loading Error');
      const err = JSON.stringify(error);
      alert(err);
    });
    console.log('Menu Loading End 3');
    return bRet;
  }



  public InitData() {
    this.MainList.forEach(Rec => {
      if (Rec.param_type == "BRANCH SETTINGS") {
        if (Rec.param_name1 == "A/C RECEIVABLE") {
          this.SETTINGS_AC_RECEIVABLE = Rec.param_name2;
          this.SETTINGS_AC_RECEIVABLE_NAME = Rec.param_name3;
        }
        else if (Rec.param_name1 == "A/C PAYABLE") {
          this.SETTINGS_AC_PAYABLE = Rec.param_name2;
          this.SETTINGS_AC_PAYABLE_NAME = Rec.param_name3;
        }
        else if (Rec.param_name1 == "PETTY CASH")
          this.SETTINGS_AC_PETTYCASH = Rec.param_name2;
        else if (Rec.param_name1 == "INTERNAL-PAYMENT-SETTLEMENT-AR") {
          this.INTERNAL_PAYMENT_SETTLMENT_AR_ID = Rec.param_name2;
          this.INTERNAL_PAYMENT_SETTLMENT_AR_NAME = Rec.param_name3;
        }
        else if (Rec.param_name1 == "INTERNAL-PAYMENT-SETTLEMENT-AP") {
          this.INTERNAL_PAYMENT_SETTLMENT_AP_ID = Rec.param_name2;
          this.INTERNAL_PAYMENT_SETTLMENT_AP_NAME = Rec.param_name3;
        }
        else if (Rec.param_name1 == "INCOME-AE") {
          this.INCOME_AE_ID = Rec.param_name2;
          this.INCOME_AE_NAME = Rec.param_name3;
        }
        else if (Rec.param_name1 == "INCOME-AI") {
          this.INCOME_AI_ID = Rec.param_name2;
          this.INCOME_AI_NAME = Rec.param_name3;
        }
        else if (Rec.param_name1 == "INCOME-SE") {
          this.INCOME_SE_ID = Rec.param_name2;
          this.INCOME_SE_NAME = Rec.param_name3;
        }
        else if (Rec.param_name1 == "INCOME-SI") {
          this.INCOME_SI_ID = Rec.param_name2;
          this.INCOME_SI_NAME = Rec.param_name3;
        }
        else if (Rec.param_name1 == "INCOME-OT") {
          this.INCOME_OT_ID = Rec.param_name2;
          this.INCOME_OT_NAME = Rec.param_name3;
        }
        else if (Rec.param_name1 == "INCOME-EX") {
          this.INCOME_EX_ID = Rec.param_name2;
          this.INCOME_EX_NAME = Rec.param_name3;
        }

        else if (Rec.param_name1 == "EXPENSE-AE") {
          this.EXPENSE_AE_ID = Rec.param_name2;
          this.EXPENSE_AE_NAME = Rec.param_name3;
        }
        else if (Rec.param_name1 == "EXPENSE-AI") {
          this.EXPENSE_AI_ID = Rec.param_name2;
          this.EXPENSE_AI_NAME = Rec.param_name3;
        }
        else if (Rec.param_name1 == "EXPENSE-SE") {
          this.EXPENSE_SE_ID = Rec.param_name2;
          this.EXPENSE_SE_NAME = Rec.param_name3;
        }
        else if (Rec.param_name1 == "EXPENSE-SI") {
          this.EXPENSE_SI_ID = Rec.param_name2;
          this.EXPENSE_SI_NAME = Rec.param_name3;
        }
        else if (Rec.param_name1 == "EXPENSE-OT") {
          this.EXPENSE_OT_ID = Rec.param_name2;
          this.EXPENSE_OT_NAME = Rec.param_name3;
        }
        else if (Rec.param_name1 == "EXPENSE-EX") {
          this.EXPENSE_EX_ID = Rec.param_name2;
          this.EXPENSE_EX_NAME = Rec.param_name3;
        }
        else if (Rec.param_name1 == "RETAINED-PROFIT") {
          this.RETAINED_PROFIT_ID = Rec.param_name2;
          this.RETAINED_PROFIT_CODE = "";
          this.RETAINED_PROFIT_NAME = Rec.param_name3;
        }
        else if (Rec.param_name1 == "VAT-ACCOUNT") {
          this.VAT_ACC_ID = Rec.param_name2;
          this.VAT_ACC_CODE = "";
          this.VAT_ACC_NAME = Rec.param_name3;
        }
        else if (Rec.param_name1 == "VAT-INVOICE-DESCRIPTION") {
          this.VAT_INVDESC_ID = Rec.param_name2;
          this.VAT_INVDESC_CODE = "";
          this.VAT_INVDESC_NAME = Rec.param_name3;
        }
        else if (Rec.param_name1 == "VAT-PERCENTAGE") {
          this.VAT_PER = Rec.param_name3;
        }
        else if (Rec.param_name1 == "DIRECT-BILL-AGENT") {
          this.DIRECT_AGENT_ID = Rec.param_name2;
          this.DIRECT_AGENT_NAME = Rec.param_name3;
        }

        else if (Rec.param_name1 == "BANK CHARGES") {
          this.SETTINGS_AC_BANK_CHARGES_ID = Rec.param_name2;
          this.SETTINGS_AC_BANK_CHARGES_NAME = Rec.param_name3;
        }

        else if (Rec.param_name1 == "EXCHANGE DIFFERENCE") {
          this.SETTINGS_AC_EX_DIFF_ID = Rec.param_name2;
          this.SETTINGS_AC_EX_DIFF_NAME = Rec.param_name3;
        }

        else if (Rec.param_name1 == "ISSUE-AGENT") {
          this.ISSUE_AGENT_ID = "";
          this.ISSUE_AGENT_NAME = Rec.param_name3;
        }
        else if (Rec.param_name1 == "ISSUE-AGENT-CITY") {
          this.ISSUE_AGENT_CITY = Rec.param_name3;
        }
        else if (Rec.param_name1 == "ISSUE-AGENT-ADDRESS") {
          this.ISSUE_AGENT_ADDRESS = Rec.param_name3;
        }
        else if (Rec.param_name1 == "IATA-CODE") {
          this.HBL_IATA = Rec.param_name3;
        }
        else if (Rec.param_name1 == "SHOW-LOGO-HOME-PAGE") {
          this.HOME_PAGE_LOGO_DISPLAY = Rec.param_name3;
        }
        else if (Rec.param_name1 == "SHOW-NAME-HOME-PAGE") {
          this.HOME_PAGE_NAME_DISPLAY = Rec.param_name3;
        }
        else if (Rec.param_name1 == "SHOW-CTPAT") {
          this.SHOW_CTPAT_LOGO = Rec.param_name3;
        }
        else if (Rec.param_name1 == "SHOW-EXTRA-OPTION") {
          this.SHOW_EXTRA_OPERATION = Rec.param_name3;
        }
        else if (Rec.param_name1 == "SEA-EXPORT-HOUSE-PREFIX") {
          this.SEA_EXPORT_HOUSE_PREFIX = Rec.param_name3;
        }
        else if (Rec.param_name1 == "SEA-EXPORT-HOUSE-PREFIX-POL") {
          this.SEA_EXPORT_HOUSE_PREFIX_POL = Rec.param_name3;
        }
        else if (Rec.param_name1 == "SEA-EXPORT-HOUSE-PREFIX-POD") {
          this.SEA_EXPORT_HOUSE_PREFIX_POD = Rec.param_name3;
        }

        else if (Rec.param_name1 == "SEA-EXPORT-HOUSE-STARTING-NO") {
          this.SEA_EXPORT_HOUSE_STARTING_NO = Rec.param_name3;
        }
        else if (Rec.param_name1 == "SEA-EXPORT-HOUSE-INCREMENT-BY") {
          this.SEA_EXPORT_HOUSE_INCR_BY = Rec.param_name3;
        }

        else if (Rec.param_name1 == "AIR-EXPORT-HOUSE-PREFIX") {
          this.AIR_EXPORT_HOUSE_PREFIX = Rec.param_name3;
        }
        else if (Rec.param_name1 == "AIR-EXPORT-HOUSE-PREFIX-POL") {
          this.AIR_EXPORT_HOUSE_PREFIX_POL = Rec.param_name3;
        }
        else if (Rec.param_name1 == "AIR-EXPORT-HOUSE-PREFIX-POD") {
          this.AIR_EXPORT_HOUSE_PREFIX_POD = Rec.param_name3;
        }
        else if (Rec.param_name1 == "AIR-EXPORT-HOUSE-STARTING-NO") {
          this.AIR_EXPORT_HOUSE_STARTING_NO = Rec.param_name3;
        }
        else if (Rec.param_name1 == "AIR-EXPORT-HOUSE-INCREMENT-BY") {
          this.AIR_EXPORT_HOUSE_INCR_BY = Rec.param_name3;
        }

        else if (Rec.param_name1 == "SEA-EXPORT-REFNO-PREFIX") {
          this.SEA_EXPORT_REFNO_PREFIX = Rec.param_name3;
        }
        else if (Rec.param_name1 == "SEA-EXPORT-REFNO-STARTING-NO") {
          this.SEA_EXPORT_REFNO_STARTING_NO = Rec.param_name3;
        }
        else if (Rec.param_name1 == "SEA-IMPORT-REFNO-PREFIX") {
          this.SEA_IMPORT_REFNO_PREFIX = Rec.param_name3;

        }
        else if (Rec.param_name1 == "SEA-IMPORT-REFNO-STARTING-NO") {
          this.SEA_IMPORT_REFNO_STARTING_NO = Rec.param_name3;
        }
        else if (Rec.param_name1 == "AIR-EXPORT-REFNO-PREFIX") {
          this.AIR_EXPORT_REFNO_PREFIX = Rec.param_name3;

        }
        else if (Rec.param_name1 == "AIR-EXPORT-REFNO-STARTING-NO") {
          this.AIR_EXPORT_REFNO_STARTING_NO = Rec.param_name3;
        }
        else if (Rec.param_name1 == "AIR-IMPORT-REFNO-PREFIX") {
          this.AIR_IMPORT_REFNO_PREFIX = Rec.param_name3;

        }
        else if (Rec.param_name1 == "AIR-IMPORT-REFNO-STARTING-NO") {
          this.AIR_IMPORT_REFNO_STARTING_NO = Rec.param_name3;
        }
        else if (Rec.param_name1 == "OTHER-OPERATION-REFNO-PREFIX") {
          this.OTHER_OPERATION_REFNO_PREFIX = Rec.param_name3;

        }
        else if (Rec.param_name1 == "OTHER-OPERATION-REFNO-STARTING-NO") {
          this.OTHER_OPERATION_REFNO_STARTING_NO = Rec.param_name3;
        }

        else if (Rec.param_name1 == "EXTRA-OPERATION-REFNO-PREFIX") {
          this.EXTRA_OPERATION_REFNO_PREFIX = Rec.param_name3;

        }
        else if (Rec.param_name1 == "EXTRA-OPERATION-REFNO-STARTING-NO") {
          this.EXTRA_OPERATION_REFNO_STARTING_NO = Rec.param_name3;
        }
        else if (Rec.param_name1 == "AR-INVOICE-PREFIX") {
          this.AR_INVOICE_PREFIX = Rec.param_name3;

        }
        else if (Rec.param_name1 == "AR-INVOICE-STARTING-NO") {
          this.AR_INVOICE_STARTING_NO = Rec.param_name3;
        }
        else if (Rec.param_name1 == "AP-INVOICE-PREFIX") {
          this.AP_INVOICE_PREFIX = Rec.param_name3;
        }
        else if (Rec.param_name1 == "AP-INVOICE-STARTING-NO") {
          this.AP_INVOICE_STARTING_NO = Rec.param_name3;
        }
        else if (Rec.param_name1 == "DEBIT-NOTE-PREFIX") {
          this.DEBIT_NOTE_PREFIX = Rec.param_name3;
        }
        else if (Rec.param_name1 == "DEBITE-NOTE-STARTING-NO") {
          this.DEBIT_NOTE_STARTING_NO = Rec.param_name3;
        }
        else if (Rec.param_name1 == "RESOURCE URL")
          this.WWW_ROOT = Rec.param_name3;
        else if (Rec.param_name1 == "FILES URL")
          this.WWW_ROOT_FILE_FOLDER = Rec.param_name3;
        else if (Rec.param_name1 == "FILES FOLDER")
          this.FILES_FOLDER = Rec.param_name3;
        else if (Rec.param_name1 == "BACK END DATE FORMAT")
          this.BACKEND_DATEFORMAT = Rec.param_name3;
        else if (Rec.param_name1 == "FRONT END DATE FORMAT") {
          this.FRONTEND_DATEFORMAT = Rec.param_name3;
          this.date_display_fmt = Rec.param_name3;
          this.date_display_fmt_with_time = Rec.param_name3 + " HH:mm:ss";
          //SetDateFormat();
        }
        else if (Rec.param_name1 == "BASE CURRENCY CODE")
          this.base_cur_code = Rec.param_name3;
        else if (Rec.param_name1 == "FOREIGN CURRENCY CODE")
          this.foreign_cur_code = Rec.param_name3;
        else if (Rec.param_name1 == "NO OF ROWS")
          this.ROWS_TO_DISPLAY = Rec.param_name3;
        else if (Rec.param_name1 == "HBL INSTRUCTION-1")
          this.HBL_INSTR1 = Rec.param_name3;
        else if (Rec.param_name1 == "HBL INSTRUCTION-2")
          this.HBL_INSTR2 = Rec.param_name3;
        else if (Rec.param_name1 == "PARENT-ADDRESS")
          this.PARENT_ADDRESS_REQUIRED = Rec.param_name3;
        else if (Rec.param_name1 == "AUTO-CLOSE-CHECK-PRINT")
          this.AUTO_CLOSE_CHECK_PRINT = Rec.param_name3;
        else if (Rec.param_name1 == "RE-PRINT-CHECK")
          this.RE_PRINT_CHECK = Rec.param_name3;
        else if (Rec.param_name1 == "LOCK-DAYS-SEA")
          this.LOCK_DAYS_SEA = Rec.param_name3;
        else if (Rec.param_name1 == "LOCK-DAYS-AIR")
          this.LOCK_DAYS_AIR = Rec.param_name3;
        else if (Rec.param_name1 == "LOCK-DAYS-OTHERS")
          this.LOCK_DAYS_OTHERS = Rec.param_name3;
        else if (Rec.param_name1 == "LOCK-DAYS-ADMIN")
          this.LOCK_DAYS_ADMIN = Rec.param_name3;
        else if (Rec.param_name1 == "SHOW-BOE")
          this.BOE_IMPORT_REQUIRED = Rec.param_name3;
        else if (Rec.param_name1 == "REGION")
          this.BRANCH_REGION = Rec.param_name3;
        else if (Rec.param_name1 == "ARAP-CODE-SELECTION")
          this.ALLOW_ARAP_CODE_SELECTION = Rec.param_name3;
        else if (Rec.param_name1 == "SEA_ARVL_FORMAT")
          this.SEA_ARVL_FORMAT = Rec.param_name3;
        else if (Rec.param_name1 == "SHOW-CHECK-DATE")
          this.SHOW_CHECK_DATE = Rec.param_name3;
        else if (Rec.param_name1 == "REMOVE-ZERO-FORMAT")
          this.REMOVE_ZERO_FORMAT = Rec.param_name3;
        else if (Rec.param_name1 == "PACKAGE-TOTAL-BUTTON")
          this.PACKAGE_TOTAL_BUTTON = Rec.param_name3;
        else if (Rec.param_name1 == "OPTIONAL-DESCRIPTION")
          this.OPTIONAL_DESCRIPTION = Rec.param_name3;
        else if (Rec.param_name1 == "PAYROLL-INVOICE-CODE")
          this.PAYROLL_INVOICE_CODE = Rec.param_name3;
        else if (Rec.param_name1 == "PAYROLL-ACC-CODE")
          this.PAYROLL_ACC_CODE = Rec.param_name3;
        else if (Rec.param_name1 == "PAYROLL-ENABLED")
          this.PAYROLL_ENABLED = Rec.param_name3;
        else if (Rec.param_name1 == "HIDE-DOCTYPE-INVOICE")
          this.HIDE_DOCTYPE_INVOICE = Rec.param_name3;
        else if (Rec.param_name1 == "DOC-FOOTER1")
          this.DOC_FOOTER1 = Rec.param_name3;
        else if (Rec.param_name1 == "DOC-FOOTER2")
          this.DOC_FOOTER2 = Rec.param_name3;
        else if (Rec.param_name1 == "FY-START-MONTH")
          this.FY_START_MONTH = Rec.param_name3;

        else if (Rec.param_name1 == "DEFAULT-HBL-FORMAT")
          this.DEFAULT_HBL_FORMAT = Rec.param_name2;
        else if (Rec.param_name1 == "DEFAULT-HBL-DRAFT-FORMAT")
          this.DEFAULT_HBL_DRAFTFORMAT = Rec.param_name2;
        else if (Rec.param_name1 == "AC-REPORT-BASED-ON")
          this.AC_REPORT_BASED_ON = Rec.param_name3;
        else if (Rec.param_name1 == "FS-APP-FOLDER")
          this.FS_APP_FOLDER = Rec.param_name3;
        else if (Rec.param_name1 == "GLOBAL-FTP-FOLDER") {
          this.GLOBAL_FTP_FOLDER = Rec.param_name3;
          this.GLOBAL_REPORT_FOLDER = Rec.param_name3 + "\\reports";
        }
        else if (Rec.param_name1 == "SEA-IMP-OVERRIDE-POD-ETA")
          this.SEA_IMP_OVERRIDE_POD_ETA = Rec.param_name3;
        else if (Rec.param_name1 == "AIR-IMP-OVERRIDE-POD-ETA")
          this.AIR_IMP_OVERRIDE_POD_ETA = Rec.param_name3;

        else if (Rec.param_name1 == "SHIPMENT-LOG-FORMAT")
          this.SHIPMENTLOG_FORMAT = Rec.param_name3;


        else if (Rec.param_name1 == "SHIPMENT-LOCKED-DATE") {
          if (Rec.param_name3 != "") {
            var sdata = Rec.param_name3.split('-');
            this.ACCOUNTS_LOCKED_DATE = Rec.param_name3;
          }
        }
      }
      else if (Rec.param_type == "GLOBAL SETTINGS") {
        if (Rec.param_name1 == "SOFTWARE VERSION")
          this.SOFTWARE_VERSION = Rec.param_name3;
        if (Rec.param_name1 == "COMPANY_STRING_ID")
          this.COMPANY_STRING_ID = Rec.param_name3;
        if (Rec.param_name1 == "GENERAL_BRANCH_CODE")
          this.GENERAL_BRANCH_CODE = Rec.param_name3;

      }
    });


    if (this.base_cur_code == this.foreign_cur_code)
      this.IS_SINGLE_CURRENCY = true;
    if (this.base_cur_code != this.foreign_cur_code)
      this.IS_SINGLE_CURRENCY = false;
    if (this.ROWS_TO_DISPLAY == 0)
      this.ROWS_TO_DISPLAY = 40;
    this.WWW_FILES_URL = this.WWW_ROOT_FILE_FOLDER + "/" + this.FILES_FOLDER + "/Files";



    this.SHIPMENT_STAGE_OI = [{ "code": "NIL", "name": "NIL" }];
    this.SHIPMENT_STAGE_OE = [{ "code": "NIL", "name": "NIL" }];
    this.SHIPMENT_STAGE_AI = [{ "code": "NIL", "name": "NIL" }];
    this.SHIPMENT_STAGE_AE = [{ "code": "NIL", "name": "NIL" }];
    this.SHIPMENT_STAGE_OT = [{ "code": "NIL", "name": "NIL" }];



    this.MainList.filter(a => a.param_code == 'OI').sort(function (a, b) {
      return b.param_name4 < a.param_name4 ? 1 : -1;
    }).forEach(a => {
      this.SHIPMENT_STAGE_OI.push({ "code": a.param_name4, "name": a.param_name3 })
    });


    this.MainList.filter(a => a.param_code == 'OE').sort(function (a, b) {
      return b.param_name4 < a.param_name4 ? 1 : -1;
    }).forEach(a => {
      this.SHIPMENT_STAGE_OE.push({ "code": a.param_name4, "name": a.param_name3 })
    });

    this.MainList.filter(a => a.param_code == 'AI').sort(function (a, b) {
      return b.param_name4 < a.param_name4 ? 1 : -1;
    }).forEach(a => {
      this.SHIPMENT_STAGE_AI.push({ "code": a.param_name4, "name": a.param_name3 })
    });

    this.MainList.filter(a => a.param_code == 'AE').sort(function (a, b) {
      return b.param_name4 < a.param_name4 ? 1 : -1;
    }).forEach(a => {
      this.SHIPMENT_STAGE_AE.push({ "code": a.param_name4, "name": a.param_name3 })
    });


    this.MainList.filter(a => a.param_code == 'OT').sort(function (a, b) {
      return b.param_name4 < a.param_name4 ? 1 : -1;
    }).forEach(a => {
      this.SHIPMENT_STAGE_OT.push({ "code": a.param_name4, "name": a.param_name3 })
    });


    this.MainList.filter(a => a.param_type == 'GLOBAL SETTINGS' && a.param_name1 == 'INVOICE_STAGE').sort(function (a, b) {
      return b.param_name4 < a.param_name4 ? 1 : -1;
    }).forEach(a => {
      this.INVOICE_STAGE.push({ "code": a.param_code, "name": a.param_name2 + "," + a.param_name3 })
    });


    this.MainList.filter(a => a.param_type == 'JOB-TYPE' && a.param_name2 == 'SEA IMPORT').sort(function (a, b) {
      return b.param_name3 < a.param_name3 ? 1 : -1;
    }).forEach(a => {
      this.JOB_TYPE_OI.push({ "code": a.param_pkid, "name": a.param_name1 })
    });


    this.MainList.filter(a => a.param_type == 'JOB-TYPE' && a.param_name2 == 'SEA EXPORT').sort(function (a, b) {
      return b.param_name3 < a.param_name3 ? 1 : -1;
    }).forEach(a => {
      this.JOB_TYPE_OE.push({ "code": a.param_pkid, "name": a.param_name1 })
    });


    this.MainList.filter(a => a.param_type == 'JOB-TYPE' && a.param_name2 == 'AIR EXPORT').sort(function (a, b) {
      return b.param_name3 < a.param_name3 ? 1 : -1;
    }).forEach(a => {
      this.JOB_TYPE_AE.push({ "code": a.param_pkid, "name": a.param_name1 })
    });

    this.MainList.filter(a => a.param_type == 'JOB-TYPE' && a.param_name2 == 'AIR IMPORT').sort(function (a, b) {
      return b.param_name3 < a.param_name3 ? 1 : -1;
    }).forEach(a => {
      this.JOB_TYPE_AI.push({ "code": a.param_pkid, "name": a.param_name1 })
    });

    this.MainList.filter(a => a.param_type == 'JOB-TYPE' && a.param_name2 == 'OTHERS').sort(function (a, b) {
      return b.param_name3 < a.param_name3 ? 1 : -1;
    }).forEach(a => {
      this.JOB_TYPE_OT.push({ "code": a.param_pkid, "name": a.param_name1 })
    });


    this.MainList.filter(a => a.param_type == 'FREIGHT STATUS').sort(function (a, b) {
      return b.param_name1 < a.param_name1 ? 1 : -1;
    }).forEach(a => {
      this.PARAM_FREIGHT_STATUS.push({ "code": a.param_pkid, "name": a.param_name1 })
    });

    this.MainList.filter(a => a.param_type == 'CARGO MOVEMENT').sort(function (a, b) {
      return b.param_name1 < a.param_name1 ? 1 : -1;
    }).forEach(a => {
      this.PARAM_CARGO_MOVEMENT.push({ "code": a.param_pkid, "name": a.param_name1 })
    });

    this.MainList.filter(a => a.param_type == 'CONTAINER TYPE').sort(function (a, b) {
      return b.param_name1 < a.param_name1 ? 1 : -1;
    }).forEach(a => {
      this.PARAM_CONTAINER_TYPE.push({ "code": a.param_pkid, "name": a.param_name1 })
    });

    this.MainList.filter(a => a.param_type == 'NOMINATION').sort(function (a, b) {
      return b.param_name1 < a.param_name1 ? 1 : -1;
    }).forEach(a => {
      this.PARAM_NOMINATION.push({ "code": a.param_pkid, "name": a.param_name1 })
    });

    this.MainList.filter(a => a.param_type == 'COUNTRY').sort(function (a, b) {
      return b.param_name1 < a.param_name1 ? 1 : -1;
    }).forEach(a => {
      this.PARAM_COUNTRY.push({ "code": a.param_pkid, "name": a.param_name1 })
    });

    this.MainList.filter(a => a.param_type == 'CURRENCY').sort(function (a, b) {
      return b.param_name1 < a.param_name1 ? 1 : -1;
    }).forEach(a => {
      this.PARAM_CURRENCY.push({ "code": a.param_pkid, "name": a.param_name1 })
    });

    this.MainList.filter(a => a.param_type == 'UNIT').sort(function (a, b) {
      return b.param_name1 < a.param_name1 ? 1 : -1;
    }).forEach(a => {
      this.PARAM_UNIT.push({ "code": a.param_pkid, "name": a.param_name1 })
    });

    this.MainList.filter(a => a.param_type == 'HBL-FORMAT').sort(function (a, b) {
      return b.param_name1 < a.param_name1 ? 1 : -1;
    }).forEach(a => {
      this.PARAM_HBL_FORMAT.push({ "code": a.param_pkid, "name": a.param_name1 })
    });

    this.MainList.filter(a => a.param_type == 'HBL-FORMAT' && a.param_name6 == 'BLANK').sort(function (a, b) {
      return b.param_name1 < a.param_name1 ? 1 : -1;
    }).forEach(a => {
      this.PARAM_HBL_FORMAT_BLANK.push({ "code": a.param_pkid, "name": a.param_name1 })
    });

    this.MainList.filter(a => a.param_type == 'HBL-FORMAT' && a.param_name6 == 'DRAFT').sort(function (a, b) {
      return b.param_name1 < a.param_name1 ? 1 : -1;
    }).forEach(a => {
      this.PARAM_HBL_FORMAT_DRAFT.push({ "code": a.param_pkid, "name": a.param_name1 })
    });

    this.MainList.filter(a => a.param_type == 'HAWB-FORMAT').sort(function (a, b) {
      return b.param_name1 < a.param_name1 ? 1 : -1;
    }).forEach(a => {
      this.PARAM_HAWB_FORMAT.push({ "code": a.param_pkid, "name": a.param_name1 })
    });


    this.MainList.filter(a => a.param_type == 'BUDGET-TYPE').sort(function (a, b) {
      return b.param_name1 < a.param_name1 ? 1 : -1;
    }).forEach(a => {
      this.BUDGET_TYPE.push({ "code": a.param_pkid, "name": a.param_name1 })
    });
    this.BUDGET_TYPE.push({ "code": '', "name": 'NIL' })


    this.MainList.filter(a => a.param_type == 'CHQ-FORMAT').sort(function (a, b) {
      return b.param_name1 < a.param_name1 ? 1 : -1;
    }).forEach(a => {
      this.CHQ_FORMAT.push({ "code": a.param_pkid, "name": a.param_name1 })
    });
    this.CHQ_FORMAT.push({ "code": 'NIL', "name": 'NIL' })


    this.MainList.filter(a => a.param_type == 'CUSTOMER GROUP').sort(function (a, b) {
      return b.param_name1 < a.param_name1 ? 1 : -1;
    }).forEach(a => {
      this.PARAM_CUSTOMER_GROUP.push({ "code": a.param_pkid, "name": a.param_name1 })
    });

    this.MainList.filter(a => a.param_type == 'COO-FORMAT').sort(function (a, b) {
      return b.param_name1 < a.param_name1 ? 1 : -1;
    }).forEach(a => {
      this.PARAM_COO_FORMAT_BLANK.push({ "code": a.param_pkid, "name": a.param_name1 })
    });



    this.MainList.filter(a => a.param_type == 'SALESMAN' && a.param_lookup_id == this.user_pkid).forEach(b => {
      this.user_handled_id = b.param_pkid;
      this.user_handled_code = b.param_code;
      this.user_handled_name = b.param_name1;
    });


    this.FY_MONTHS = <any[]>[];
    if (this.FY_START_MONTH == "") {
      var rec = <any>{};
      rec.code = "1";
      rec.name = this.GetMonth_Name(1);
      this.FY_MONTHS.push(rec);
    }
    else {

      var Mon = this.FY_START_MONTH.toString().split(',');
      for (let str of Object.values(Mon)) {
        var rec = <any>{};
        rec.code = str;
        rec.name = this.GetMonth_Name(+str);
        this.FY_MONTHS.push(rec);
      }
    }

    /*      public PARAM_FREIGHT_STATUS : any = [];
            public PARAM_CARGO_MOVEMENT : any = [];
            public PARAM_CONTAINER_TYPE : any = [];
            public PARAM_NOMINATION : any = [];
            public PARAM_COUNTRY : any = [];
            public PARAM_CURRENCY : any = [];
            public PARAM_HBL_FORMAT : any = [];
            public PARAM_HBL_FORMAT_DRAFT : any = [];
            public PARAM_HAWB_FORMAT : any = [];
            public PARAM_UNIT : any = [];
            public PARAM_CUSTOMER_GROUP : any = [];
            public PARAM_FORM_CATEGORIES : any = [];
     */


  }


  getLocalStorageSize = function () {
    var total = 0;
    for (var x in localStorage) {
      // Value is multiplied by 2 due to data being stored in `utf-16` format, which requires twice the space.
      var amount = (localStorage[x].length * 2) / 1024 / 1024;
      if (!isNaN(amount) && localStorage.hasOwnProperty(x)) {
        // console.log(x, localStorage.getItem(x), amount);
        total += amount;
      }
    }
    return total.toFixed(2);
  }




  Save2LocalStorage() {

    const bts_settings = new gsdata();
    bts_settings.appid = this.appid;
    bts_settings.GSession = this.GSESSION;
    bts_settings.IsLoginSuccess = this.IsLoginSuccess;
    bts_settings.IsAuthenticated = this.IsAuthenticated;
    bts_settings.access_token = this.Access_Token;
    bts_settings.user_code = this.user_code;
    bts_settings.user_name = this.user_name;
    bts_settings.user_pwd = this.user_pwd;
    bts_settings.user_ua_pkid = this.user_ua_pkid;
    bts_settings.branch_pkid = this.branch_pkid;
    bts_settings.branch_code = this.branch_code;
    bts_settings.branch_name = this.branch_name;
    bts_settings.branch_add1 = this.branch_add1;
    bts_settings.branch_add2 = this.branch_add2
    bts_settings.branch_add3 = this.branch_add3;
    bts_settings.branch_add4 = this.branch_add4
    bts_settings.branch_prefix = this.branch_prefix;
    bts_settings.USER_LOCATION_ID = this.USER_LOCATION_ID;
    bts_settings.REC_BRANCH_CODE = this.REC_BRANCH_CODE;
    bts_settings.ADDRESS_LINE1 = this.ADDRESS_LINE1;
    bts_settings.ADDRESS_LINE2 = this.ADDRESS_LINE2;
    bts_settings.ADDRESS_LINE3 = this.ADDRESS_LINE3
    bts_settings.ADDRESS_LINE4 = this.ADDRESS_LINE4;
    bts_settings.ADDRESS_LINE5 = this.ADDRESS_LINE5
    bts_settings.ADDRESS_DUMMY_LINE1 = this.ADDRESS_DUMMY_LINE1;
    bts_settings.ADDRESS_DUMMY_LINE2 = this.ADDRESS_DUMMY_LINE2;
    bts_settings.ADDRESS_DUMMY_LINE3 = this.ADDRESS_DUMMY_LINE3;
    bts_settings.ADDRESS_DUMMY_LINE4 = this.ADDRESS_DUMMY_LINE4;
    bts_settings.ADDRESS_DUMMY_LINE5 = this.ADDRESS_DUMMY_LINE5;
    bts_settings.year_pkid = this.year_pkid;
    bts_settings.year_code = this.year_code;
    bts_settings.year_name = this.year_name;
    bts_settings.year_start_date = this.year_start_date;
    bts_settings.year_end_date = this.year_end_date;
    bts_settings.year_islocked = this.year_islocked;
    bts_settings.software_start_year = this.software_start_year;

    //bts_settings.mainlist = this.MainList;
    bts_settings.userrecord = this.UserRecord;
    bts_settings.userinfo = this.UserInfo;
    //bts_settings.modules = this.Modules;
    //bts_settings.menulist = this.MenuList;
    bts_settings.companylist = this.CompanyList
    bts_settings.yearlist = this.YearList;
    localStorage.setItem(this.appid, JSON.stringify(bts_settings));

  }

  ReadLocalStorage(_appid: string) {

    const bts_settings: gsdata = JSON.parse(localStorage.getItem(_appid));

    this.UserRecord = bts_settings.userrecord;

    this.InitLogin();

    this.appid = bts_settings.appid;
    this.GSESSION = bts_settings.GSession;
    this.Access_Token = bts_settings.access_token;
 
    this.user_ua_pkid = bts_settings.user_ua_pkid;
    this.branch_pkid = bts_settings.branch_pkid;
    this.branch_code = bts_settings.branch_code;
    this.branch_name = bts_settings.branch_name;
    this.branch_add1 = bts_settings.branch_add1;
    this.branch_add2 = bts_settings.branch_add2
    this.branch_add3 = bts_settings.branch_add3;
    this.branch_add4 = bts_settings.branch_add4
    this.branch_prefix = bts_settings.branch_prefix;
    this.USER_LOCATION_ID = bts_settings.USER_LOCATION_ID;
    this.REC_BRANCH_CODE = bts_settings.REC_BRANCH_CODE;
    this.ADDRESS_LINE1 = bts_settings.ADDRESS_LINE1;
    this.ADDRESS_LINE2 = bts_settings.ADDRESS_LINE2;
    this.ADDRESS_LINE3 = bts_settings.ADDRESS_LINE3
    this.ADDRESS_LINE4 = bts_settings.ADDRESS_LINE4;
    this.ADDRESS_LINE5 = bts_settings.ADDRESS_LINE5
    this.ADDRESS_DUMMY_LINE1 = bts_settings.ADDRESS_DUMMY_LINE1;
    this.ADDRESS_DUMMY_LINE2 = bts_settings.ADDRESS_DUMMY_LINE2;
    this.ADDRESS_DUMMY_LINE3 = bts_settings.ADDRESS_DUMMY_LINE3;
    this.ADDRESS_DUMMY_LINE4 = bts_settings.ADDRESS_DUMMY_LINE4;
    this.ADDRESS_DUMMY_LINE5 = bts_settings.ADDRESS_DUMMY_LINE5;
    this.year_pkid = bts_settings.year_pkid;
    this.year_code = bts_settings.year_code;
    this.year_name = bts_settings.year_name;
    this.year_start_date = bts_settings.year_start_date;
    this.year_end_date = bts_settings.year_end_date;
    this.year_islocked = bts_settings.year_islocked;
    this.software_start_year = bts_settings.software_start_year;

    //this.MainList = bts_settings.mainlist;

    this.UserInfo = bts_settings.userinfo;
    //this.Modules = bts_settings.modules;
    //this.MenuList = bts_settings.menulist;
    this.CompanyList = bts_settings.companylist
    this.YearList = bts_settings.yearlist;

    this.InitUserInfo();

  }


  RemoveLocalStorage() {
    if (localStorage.getItem(this.appid))
      localStorage.removeItem(this.appid);
  }








  public DateFormat() {
    if (this.date_display_fmt == '')
      return '';
    else if (this.date_display_fmt.toLowerCase().startsWith('dd'))
      return 'dd';
    else if (this.date_display_fmt.toLowerCase().startsWith('mm'))
      return 'mm';
    else
      return '';
  }



  //START

  constructor(
    private http2: HttpClient,
    private location: Location,
    private router: Router) {
    this.globalVariables = new GlobalVariables;
    this.globalData = new GlobalData;
    this.InitdefaultValues();
  }

  public getGuid(): string {
    let uuid = UUID.UUID();
    return uuid.toUpperCase();
  }

  public getPagetitle(menucode: string): string {
    return this.MenuList.find(f => f.menu_name == menucode).menu_name;
  }

  public getMenu(menucode: string): User_Menu {
    return this.MenuList.find(f => f.menu_name == menucode);
  }

  public getMenuById(menuid: string): User_Menu {
    return this.MenuList.find(f => f.menu_pkid == menuid);
  }


  public getTitle(menuid: string): string {
    var itm = this.MenuList.find(f => f.menu_pkid == menuid);
    if (itm)
      return itm.menu_name;
    else
      return '';
  }

  public isNull(iData: any): boolean {
    if (iData == null || iData == undefined)
      return true;
    else
      return false;
  }

  public isBlank(iData: any): boolean {
    if (iData == null || iData == undefined || iData == '')
      return true;
    else
      return false;
  }

  public isZero(iData: any): boolean {
    if (iData == null || iData == undefined || iData == 0)
      return true;
    else
      return false;
  }

  public CompareDate(d1: string, d2: string) {
    if (this.isBlank(d1) || this.isBlank(d2))
      return "";
    var p1 = d1.split('-');
    var p2 = d2.split('-');
    var date1 = new Date(parseInt(p1[0]), parseInt(p1[1]) - 1, parseInt(p1[2]));
    var date2 = new Date(parseInt(p2[0]), parseInt(p2[1]) - 1, parseInt(p2[2]));
    if (date1 < date2)
      return "<";
    else if (date1 > date2)
      return ">";
    else
      return "=";
  }


  public canSave(menuid: string, mode: string): boolean {
    var bret: boolean = false;
    bret = this.user_isadmin == 'Y';
    var itm = this.MenuList.find(f => f.menu_pkid == menuid);
    if (itm) {
      if (mode == "ADD" && itm.rights_add == "Y")
        bret = true;
      if (mode == "EDIT" && itm.rights_edit == "Y")
        bret = true;
    }
    return bret;
  }

  public canAdd(menuid: string): boolean {
    var bret: boolean = false;
    bret = this.user_isadmin == 'Y';
    var itm = this.MenuList.find(f => f.menu_pkid == menuid && f.rights_add == "Y");
    if (itm)
      bret = true;
    return bret;
  }
  public canEdit(menuid: string): boolean {

    var bret: boolean = false;

    bret = this.user_isadmin == 'Y';

    var itm = this.MenuList.find(f => f.menu_pkid == menuid && f.rights_edit == "Y");
    if (itm)
      bret = true;

    return bret;
  }
  public canView(menuid: string): boolean {
    var bret: boolean = false;
    bret = this.user_isadmin == 'Y';
    var itm = this.MenuList.find(f => f.menu_pkid == menuid && (f.rights_edit == "Y" || f.rights_view == "Y"));
    if (itm)
      bret = true;
    return bret;
  }

  public canDelete(menuid: string): boolean {
    var bret: boolean = false;
    bret = this.user_isadmin == 'Y';
    var itm = this.MenuList.find(f => f.menu_pkid == menuid && f.rights_delete == "Y");
    if (itm)
      bret = true;
    return bret;
  }

  public canPrint(menuid: string): boolean {
    var bret: boolean = false;
    bret = this.user_isadmin == 'Y';
    var itm = this.MenuList.find(f => f.menu_pkid == menuid && f.rights_print == "Y");
    if (itm)
      bret = true;
    return bret;
  }

  public screenExists(menuid: string): boolean {
    var bret: boolean = false;
    bret = this.user_isadmin == 'Y';
    var itm = this.MenuList.find(f => f.menu_pkid == menuid && (f.rights_add == "Y" || f.rights_edit == "Y" || f.rights_view == "Y" || f.rights_print == "Y" || f.rights_delete == "Y"));
    if (itm)
      bret = true;
    return bret;
  }

  public canDownload(menuid: string): boolean {
    var bret: boolean = false;
    bret = this.user_isadmin == 'Y';
    var itm = this.MenuList.find(f => f.menu_pkid == menuid && f.rights_print == "Y");
    if (itm)
      bret = true;
    return bret;
  }


  public canEmail(menuid: string): boolean {
    var bret: boolean = false;
    bret = this.user_isadmin == 'Y';
    var itm = this.MenuList.find(f => f.menu_pkid == menuid && f.rights_email == "Y");
    if (itm)
      bret = true;
    return bret;
  }

  public canExel(menuid: string): boolean {
    var bret: boolean = false;
    bret = this.user_isadmin == 'Y';
    var itm = this.MenuList.find(f => f.menu_pkid == menuid && f.rights_print == "Y");
    if (itm)
      bret = true;
    return bret;
  }



  public IsAdmin(menuid: string): boolean {
    var bret1: boolean;
    var bret2: boolean;
    bret1 = this.user_isadmin == 'Y';
    var itm = this.MenuList.find(f => f.menu_pkid == menuid && f.rights_admin == 'Y');
    if (itm)
      bret2 = true;

    return bret1 || bret2;
  }

  public IsCompany(menuid: string): boolean {
    var bret1: boolean;
    var bret2: boolean;
    bret1 = this.user_isadmin == 'Y';
    var itm = this.MenuList.find(f => f.menu_pkid == menuid && f.rights_company == 'Y');
    if (itm)
      bret2 = true;

    return bret1 || bret2;
  }

  public getError(error: any) {
    if (this.isolderror)
      return JSON.parse(error.error).Message;
    else
      return error.error.Message;
  }

  public replaceAll(_str: any, _oldChar: string, _newChar: string) {
    while (_str.indexOf(_oldChar) > -1) {
      _str = _str.replace(_oldChar, _newChar);
    }
    return _str;
  }



  public headerparam2(type: string, company_code: string = '') {
    let headers = new HttpHeaders();

    if (type == 'login')
      headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    if (type == 'authorized') {
      headers = headers.append('Authorization', 'Bearer ' + this.Access_Token);
      headers = headers.append('Content-Type', 'application/json');
    }

    if (type == 'authorized-fileupload') {
      headers = headers.append('Authorization', 'Bearer ' + this.Access_Token);
      headers = headers.delete('Content-Type');
    }

    if (type == 'anonymous') {
      headers = headers.append('Content-Type', 'application/json');

    }
    if (type == 'excel') {
      headers = headers.append('Authorization', 'Bearer ' + this.Access_Token);
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('Accept', 'application/x-msexcel');
      //options.responseType = ResponseContentType.Blob;
    }
    if (company_code != '')
      headers = headers.append('company-code', company_code);

    const options = {
      headers: headers,
    };

    return options;
  }


  public ClosePage(sPage: string, IsCloseButton = true) {
    if (IsCloseButton)
      this.router.navigate([sPage], { replaceUrl: true });
    else
      this.location.back();
  }


  public makecall(url: string, SearchData: any) {
    return this.http2.post<any>(this.baseUrl + url, SearchData, this.headerparam2('authorized'));
  }

  public getFile(report_folder: string, filename: string, filetype: string, filedisplayname: string = 'N') {
    let body = 'report_folder=' + report_folder + '&filename=' + filename + '&filetype=' + filetype + '&filedisplayname=' + filedisplayname;
    return this.http2.get(this.baseUrl + '/api/Master/Param/DownloadFile?' + body, { responseType: 'blob' })
  }


  public SendEmail(SearchData: any) {
    return this.http2.post<any>(this.baseUrl + "/api/Email/Common", SearchData, this.headerparam2('authorized'));
  }

  public SearchRecord(SearchData: any) {
    return this.http2.post<any>(this.baseUrl + "/api/Auth/SearchRecord", SearchData, this.headerparam2('authorized'));
  }

  public DownloadFile(report_folder: string, filename: string, filetype: string, filedisplayname: string = 'N') {
    let body = 'report_folder=' + report_folder + '&filename=' + filename + '&filetype=' + filetype + '&filedisplayname=' + filedisplayname;
    window.open(this.baseUrl + '/api/Master/Param/DownloadFile?' + body, "_blank");
  }

  public ShowAccAlert(party_id: string) {
    let SearchData = {
      table: '',
      pkid: '',
      SPATH: ''
    };

    SearchData.table = 'ACCOUNTING-ALERT';
    SearchData.pkid = party_id;
    SearchData.SPATH = "..\\Files_Folder\\" + this.FILES_FOLDER + "\\xmlremarks\\";
    this.SearchRecord(SearchData)
      .subscribe(response => {
        if (response.message.length > 0)
          alert(response.message);
      },
        error => {
          let err = this.getError(error);
          alert(err);
        });
  }


  public IsDateLocked(sDate: string = '') {
    var bRet = false;
    var IsNullVal = false;
    try {
      IsNullVal = false;
      if (sDate === "")
        IsNullVal = true;
      else if (sDate == null)
        IsNullVal = true;
      if (!IsNullVal) {
        if (sDate.replace('-', '') <= this.ACCOUNTS_LOCKED_DATE.replace('-', ''))
          bRet = true;
      }
    }
    catch (Exception) {
      bRet = true;

    }
    return bRet;
  }



  public roundNumber(_number: number, _precision: number) {
    var factor = Math.pow(10, _precision);
    var tempNumber = _number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  };


  public SetupCompanyList(_companylist: Companym[]) {

    this.CompanyList = new Array<Companym>();
    var mRec: Companym = new Companym;

    this.branch_codes = '';

    if (_companylist.length > 1) {
      mRec.comp_pkid = "ALL";
      mRec.comp_code = "ALL";
      mRec.comp_name = "ALL";
      this.CompanyList.push(mRec);

    }
    _companylist.forEach(rec => {
      mRec = new Companym;
      mRec.comp_pkid = rec.comp_pkid;
      mRec.comp_code = rec.comp_code;
      mRec.comp_name = rec.comp_name;

      if (this.branch_codes != '')
        this.branch_codes += ',';
      this.branch_codes += "'" + rec.comp_code + "'";

      this.CompanyList.push(mRec);
    });
  }

  public InitdefaultValues() {

    var dt = new Date();

    this.defaultValues = new DefaultValues;
    this.defaultValues.today = dt.toISOString().slice(0, 10);

    this.defaultValues.yy = dt.getFullYear();
    this.defaultValues.mm = dt.getMonth() + 1;
    this.defaultValues.dd = dt.getDate();

    this.defaultValues.monthbegindate = this.getNewdate(0);
    this.defaultValues.lastmonthdate = this.getNewdate(30);//get today -30 days
    this.defaultValues.print_cheque_only_after_ho_approved = 'N';

    /*
    this.globalData.cost_sea_fromdate = this.defaultValues.monthbegindate;
    this.globalData.cost_sea_todate = this.defaultValues.today;
    this.globalData.cost_air_fromdate = this.defaultValues.monthbegindate;
    this.globalData.cost_air_todate = this.defaultValues.today;
    this.globalData.cost_drcr_fromdate = this.defaultValues.monthbegindate;
    this.globalData.cost_drcr_todate = this.defaultValues.today;
    this.globalData.cost_agentinvoice_fromdate = this.defaultValues.monthbegindate;
    this.globalData.cost_agentinvoice_todate = this.defaultValues.today;

    this.globalData.job_fromdate = this.defaultValues.lastmonthdate;
    this.globalData.job_todate = this.defaultValues.today;
    this.globalData.hbl_fromdate = this.defaultValues.lastmonthdate;
    this.globalData.hbl_todate = this.defaultValues.today;
    this.globalData.mbl_fromdate = this.defaultValues.lastmonthdate;
    this.globalData.mbl_todate = this.defaultValues.today;
    this.globalData.ledger_fromdate = this.defaultValues.lastmonthdate;
    this.globalData.ledger_todate = this.defaultValues.today;
    */
  }

  public getNewdate(_days: number) {
    var nDate = new Date();
    if (_days <= 0)
      nDate.setDate(1);
    else
      nDate.setDate(nDate.getDate() - _days);

    return nDate.toISOString().slice(0, 10);
  }

  public getPreviousDate(_days: number) {
    return this.getNewdate(_days);
  }

  public roundWeight(_number: number, _category: string) {

    let _precision: number;
    _precision = 0;
    if (_category == "CBM")
      _precision = 3;
    else if (_category == "NTWT")
      _precision = 3;
    else if (_category == "GRWT")
      _precision = 3;
    else if (_category == "CHWT")
      _precision = 3;
    else if (_category == "PCS")
      _precision = 3;
    else if (_category == "PKG")
      _precision = 0;
    else if (_category == "EXRATE")
      _precision = 2;
    else if (_category == "RATE")
      _precision = 2;
    else if (_category == "AMT")
      _precision = 2

    var factor = Math.pow(10, _precision);
    var tempNumber = _number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  };


  public GetMonth_Name(No: number, Abbr: boolean = true) {
    let str: string = "";
    if (No == 1) str = "JANUARY";
    else if (No == 2) str = "FEBRUARY";
    else if (No == 3) str = "MARCH";
    else if (No == 4) str = "APRIL";
    else if (No == 5) str = "MAY";
    else if (No == 6) str = "JUNE";
    else if (No == 7) str = "JULY";
    else if (No == 8) str = "AUGUST";
    else if (No == 9) str = "SEPTEMBER";
    else if (No == 10) str = "OCTOBER";
    else if (No == 11) str = "NOVEMBER";
    else if (No == 12) str = "DECEMBER";
    if (str.length >= 3 && Abbr == true)
      str = str.substring(0, 3);
    return str;
  }

  public GetMonth_Number(str: string) {
    let No: number = 0;
    if (str == "JANUARY" || str == "JAN") No = 1;
    else if (str == "FEBRUARY" || str == "FEB") No = 2;
    else if (str == "MARCH" || str == "MAR") No = 3;
    else if (str == "APRIL" || str == "APR") No = 4;
    else if (str == "MAY" || str == "MAY") No = 5;
    else if (str == "JUNE" || str == "JUN") No = 6;
    else if (str == "JULY" || str == "JUL") No = 7;
    else if (str == "AUGUST" || str == "AUG") No = 8;
    else if (str == "SEPTEMBER" || str == "SEP") No = 9;
    else if (str == "OCTOBER" || str == "OCT") No = 10;
    else if (str == "NOVEMBER" || str == "NOV") No = 11;
    else if (str == "DECEMBER" || str == "DEC") No = 12;

    return No;
  }

  Naviagete(menu_route: string, jsonstring: string, _replaceurl: boolean = false) {
    this.router.navigate([menu_route], { queryParams: { parameter: jsonstring }, replaceUrl: _replaceurl });
  }

  public GetAttention(Attention: string) {
    let str: string = "";
    if (Attention.toString().trim().length > 0)
      str = "ATTN : " + Attention.toString();
    return str;
  }

  public GetTelFax(Tel: string, Fax: string) {
    let str: string = "";
    if (Tel.toString().trim().length > 0)
      str = "TEL : " + Tel.toString();
    if (Fax.toString().trim().length > 0) {
      if (str != "")
        str += " ";
      str += "FAX : " + Fax.toString();
    }
    return str;
  }

  public Convert_Weight(sType: string, data: number, iDec: number) {
    let iData: number = 0;
    try {
      if (sType == "KG2LBS")
        iData = data * 2.2046;
      if (sType == "CBM2CFT")
        iData = data * 35.314;
      if (sType == "LBS2KG")
        iData = data / 2.2046;
      if (sType == "CFT2CBM")
        iData = data / 35.314;
    }
    catch (Exception) {
      iData = 0;
    }
    return this.roundNumber(iData, iDec);
  }



  public IsShipmentClosed(OPR_MODE: string, REF_DATE: string, LOCK_STATUS: string, UNLOCK_DATE: string = "") {
    var bRet = false;
    // var Dt_Now: string;
    var Days = 0;

    var IsNullVal = false;

    try {

      if (LOCK_STATUS == null || LOCK_STATUS == "") {
        //Days = Dt_Now.Subtract(REF_DATE).TotalDays;
        Days = this.GetDays(REF_DATE);

        if ((OPR_MODE == "SEA EXPORT" || OPR_MODE == "SEA IMPORT") && Days > this.LOCK_DAYS_SEA && this.LOCK_DAYS_SEA > 0)
          bRet = true;
        if ((OPR_MODE == "AIR EXPORT" || OPR_MODE == "AIR IMPORT") && Days > this.LOCK_DAYS_AIR && this.LOCK_DAYS_AIR > 0)
          bRet = true;
        if ((OPR_MODE == "OTHERS" || OPR_MODE == "EXTRA") && Days > this.LOCK_DAYS_OTHERS && this.LOCK_DAYS_OTHERS > 0)
          bRet = true;
        if ((OPR_MODE == "ADMIN") && Days > this.LOCK_DAYS_ADMIN && this.LOCK_DAYS_ADMIN > 0)
          bRet = true;
      }
      else if (LOCK_STATUS == "L")
        bRet = true;
      else if (LOCK_STATUS == "U") {
        bRet = false;

        //if (!UNLOCK_DATE.Equals(DBNull.Value))
        //{

        //    Dt_Now = DateTime.Now;
        //    Days = Dt_Now.Subtract((DateTime)UNLOCK_DATE).TotalDays;

        //    if (Days >= 2)
        //        bRet = true;
        //}

        IsNullVal = false;
        if (UNLOCK_DATE == "")
          IsNullVal = true;
        if (UNLOCK_DATE == undefined)
          IsNullVal = true;
        if (UNLOCK_DATE == null)
          IsNullVal = true;

        if (!IsNullVal) {
          //Dt_Now = this.defaultValues.today;
          //Days = Dt_Now.Subtract((DateTime)UNLOCK_DATE).TotalDays;
          Days = this.GetDays(UNLOCK_DATE);
          if (Days >= 2)
            bRet = true;
        }
      }
    }
    catch (Exception) {
      bRet = true;
    }

    return bRet;
  }

  GetDays(_refDate: string) {
    let nDays: number = 0;
    if (_refDate == "" || _refDate == null || _refDate == undefined)
      nDays = 0;
    else {

      let nowDate = new Date();

      var tempdt = _refDate.split('-');
      let dtyr: number = +tempdt[0];
      let dtmn: number = +tempdt[1];
      let dtdy: number = + (tempdt[2].length > 2 ? tempdt[2].substring(0, 2) : tempdt[2]);
      let refDate = new Date(dtyr, dtmn - 1, dtdy);

      nowDate.setHours(0, 0, 0, 0);
      refDate.setHours(0, 0, 0, 0);
      var diff = Math.abs(nowDate.getTime() - refDate.getTime());
      nDays = Math.floor(diff / (1000 * 3600 * 24));

    }
    return nDays;
  }

  public GetAirportCode(PortCode: string, PortName: string, CountryCode: string) {
    let str: string = "";

    if (this.AIRPORTDISPLAYCOLUMN == "CODE") {
      if (PortCode.toString().trim().length > 0)
        str = PortCode.toString();
      if (CountryCode.toString().trim().length > 0) {
        if (str.trim() != "")
          str += ", ";
        str += CountryCode.toString();
      }
    }
    else
      str = PortName;
    return str;
  }

  public ProperFileName(str: string) {
    let sRet: string = str;
    try {
      sRet = sRet.replace("\\", "");
      sRet = sRet.replace("/", "");
      sRet = sRet.replace(":", "");
      sRet = sRet.replace("*", "");
      sRet = sRet.replace("?", "");
      sRet = sRet.replace("<", "");
      sRet = sRet.replace(">", "");
      sRet = sRet.replace("|", "");
      sRet = sRet.replace("'", "");
      sRet = sRet.replace("#", "");
      sRet = sRet.replace("&", "");
      sRet = sRet.replace("%", "");
    }
    catch (Exception) {
    }
    return sRet;

  }

  public LinkPage(INVOKETYPE: string = "", MBLMODE: string = "", REFNO: string = "", MBLID: string = "", HBLID: string = "", INVID: string = "",) {
    let sType: string = "";
    let SMENU_ID: string = "";
    try {

      MBLMODE = MBLMODE.replace("OCEAN", "SEA");

      if (MBLMODE == "SEA EXPORT" || MBLMODE == "SEA IMPORT" || MBLMODE == "AIR EXPORT" || MBLMODE == "AIR IMPORT" || MBLMODE == "OTHERS" || MBLMODE == "EXTRA") {
        if (REFNO.length >= 2 && MBLID.trim().length > 0)
          sType = REFNO.substring(0, 2);
        else
          sType = "";
      }
      else if (MBLMODE == "CM" || MBLMODE == "PR" || MBLMODE == "FA" || MBLMODE == "GE" || MBLMODE == "PS")
        sType = MBLMODE.trim();
      else
        sType = "";

      if (sType.trim() == "" || INVOKETYPE.trim() == "") {
        alert("Cannot Load Details");
        return;
      }

      if (INVOKETYPE == "INVNO") {
        if (INVID.trim() == "")
          alert("Cannot Load Details");
        else if (sType == "OI")
          SMENU_ID = this.MENU_SI_MASTER_ARAP;
        else if (sType == "OE")
          SMENU_ID = this.MENU_SE_MASTER_ARAP;
        else if (sType == "AI")
          SMENU_ID = this.MENU_AI_MASTER_ARAP;
        else if (sType == "AE")
          SMENU_ID = this.MENU_AE_MASTER_ARAP;
        else if (sType == "OT")
          SMENU_ID = this.MENU_OT_OPERATION_ARAP;
        else if (sType == "EX")
          SMENU_ID = this.MENU_EX_OPERATION_ARAP;
        else if (sType == "CM")
          SMENU_ID = this.MENU_1099_EXPENSE_ARAP;
        else if (sType == "PR")
          SMENU_ID = this.MENU_PAYROLL_EXPENSE_ARAP;
        else if (sType == "FA")
          SMENU_ID = this.MENU_FILE_ADJUSTMENT_ARAP;
        else if (sType == "GE")
          SMENU_ID = this.MENU_GENERAL_EXPENSE_ARAP;
        else if (sType == "PS")
          SMENU_ID = this.MENU_INTERNAL_PAYMENT_SETTLEMENT_ARAP;
        else {
          alert("Cannot Load Invoice");
          return;
        }

        if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
          let prm = {
            menuid: SMENU_ID,
            pkid: INVID,
            mode: 'EDIT',
            mbl_pkid: MBLID,
            mbl_refno: REFNO,
            mbl_type: sType,
            inv_arap: '',
            arrival_notice: '',
            origin: INVOKETYPE
          };
          this.Naviagete('Silver.USAccounts.Trans/InvoiceEditPage', JSON.stringify(prm));
          // InvokePage("A/R & A/P", "Silver.USAccounts.Trans.xap", "Silver.USAccounts.Trans", "InvoicePage", SMENU_ID + "~" + MBLID + "~" + REFNO + "~" + sType + "~SEARCH~" + INVID);
        }
        else
          alert("Insufficient Rights");

      }
      else if (INVOKETYPE == "REFNO") {
        if (sType == "AE") {
          SMENU_ID = this.MENU_AE_MASTER;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            let prm = {
              menuid: SMENU_ID,
              mode: 'EDIT',
              pkid: MBLID,
              type: sType,
              origin: INVOKETYPE
            };
            this.Naviagete('Silver.AirExport.Trans/AirExpMasterEditPage', JSON.stringify(prm));
            // InvokePage("Air Export Master", "Silver.AirExport.Trans.xap", "Silver.AirExport.Trans", "AirExpMasterPage", SMENU_ID + "~" + MBLID);
          }
          else
            alert("Insufficient Rights");
        }
        else if (sType == "AI") {
          SMENU_ID = this.MENU_AI_MASTER;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            let prm = {
              menuid: SMENU_ID,
              mode: 'EDIT',
              pkid: MBLID,
              type: sType,
              origin: INVOKETYPE
            };
            this.Naviagete('Silver.AirImport.Trans/AirImpMasterEditPage', JSON.stringify(prm));
            // InvokePage("Air Import Master", "Silver.AirImport.Trans.xap", "Silver.AirImport.Trans", "AirImpMasterPage", SMENU_ID + "~" + MBLID);
          }
          else
            alert("Insufficient Rights");
        }
        else if (sType == "OE") {
          SMENU_ID = this.MENU_SE_MASTER;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            let prm = {
              menuid: SMENU_ID,
              mode: 'EDIT',
              pkid: MBLID,
              type: sType,
              origin: INVOKETYPE
            };
            this.Naviagete('Silver.SeaExport.Trans/SeaExpMasterEditPage', JSON.stringify(prm));
            // InvokePage("Ocean Export Master", "Silver.SeaExport.Trans.xap", "Silver.SeaExport.Trans", "SeaExpMasterPage", SMENU_ID + "~" + MBLID);
          }
          else
            alert("Insufficient Rights");
        }
        else if (sType == "OI") {
          SMENU_ID = this.MENU_SI_MASTER;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            let prm = {
              menuid: SMENU_ID,
              mode: 'EDIT',
              pkid: MBLID,
              type: sType,
              origin: INVOKETYPE
            };
            this.Naviagete('Silver.SeaImport/SeaImpMasterEditPage', JSON.stringify(prm));
            // InvokePage("Ocean Import Master", "Silver.SeaImport.xap", "Silver.SeaImport", "SeaImpMasterPage", SMENU_ID + "~" + MBLID);
          }
          else
            alert("Insufficient Rights");
        }
        else if (sType == "OT") {
          SMENU_ID = this.MENU_OT_OPERATION;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            let prm = {
              menuid: SMENU_ID,
              mode: 'EDIT',
              pkid: MBLID,
              type: sType,
              origin: INVOKETYPE
            };
            this.Naviagete('Silver.Other.Trans/OthGeneralEditPage', JSON.stringify(prm));
            //InvokePage("Other Operations", "Silver.Other.Trans.xap", "Silver.Other.Trans", "GeneralPage", SMENU_ID + "~" + MBLID + "~OTHERS");
          }
          else
            alert("Insufficient Rights");
        }
        else if (sType == "EX") {
          SMENU_ID = this.MENU_EX_OPERATION;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            let prm = {
              menuid: SMENU_ID,
              mode: 'EDIT',
              pkid: MBLID,
              type: sType,
              origin: INVOKETYPE
            };
            this.Naviagete('Silver.Other.Trans/OthGeneralEditPage', JSON.stringify(prm));
            // InvokePage("Extra Operations", "Silver.Other.Trans.xap", "Silver.Other.Trans", "GeneralPage", SMENU_ID + "~" + MBLID + "~EXTRA");
          }
          else
            alert("Insufficient Rights");
        }
        else if (sType == "GE") {
          SMENU_ID = this.MENU_GENERAL_EXPENSE;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            let prm = {
              menuid: SMENU_ID,
              mode: 'EDIT',
              pkid: MBLID,
              exptype: sType,
              origin: INVOKETYPE
            };
            this.Naviagete('Silver.Other.Trans/OthGeneralExpenseEditPage', JSON.stringify(prm));
            //InvokePage("Other Operations", "Silver.Other.Trans.xap", "Silver.Other.Trans", "GeneralExpensePage", SMENU_ID + "~" + MBLID + "~GE");
          }
          else
            alert("Insufficient Rights");
        }
        else if (sType == "CM") {
          SMENU_ID = this.MENU_1099_EXPENSE;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            let prm = {
              menuid: SMENU_ID,
              mode: 'EDIT',
              pkid: MBLID,
              exptype: sType,
              origin: INVOKETYPE
            };
            this.Naviagete('Silver.Other.Trans/OthGeneralExpenseEditPage', JSON.stringify(prm));
            // InvokePage("Other Operations", "Silver.Other.Trans.xap", "Silver.Other.Trans", "GeneralExpensePage", SMENU_ID + "~" + MBLID + "~CM");
          }
          else
            alert("Insufficient Rights");
        }
        else if (sType == "PR") {
          SMENU_ID = this.MENU_PAYROLL_EXPENSE;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            let prm = {
              menuid: SMENU_ID,
              mode: 'EDIT',
              pkid: MBLID,
              exptype: sType,
              origin: INVOKETYPE
            };
            this.Naviagete('Silver.Other.Trans/OthGeneralExpenseEditPage', JSON.stringify(prm));
            // InvokePage("Other Operations", "Silver.Other.Trans.xap", "Silver.Other.Trans", "GeneralExpensePage", SMENU_ID + "~" + MBLID + "~PR");
          }
          else
            alert("Insufficient Rights");
        }
        else if (sType == "FA") {
          SMENU_ID = this.MENU_FILE_ADJUSTMENT;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            let prm = {
              menuid: SMENU_ID,
              mode: 'EDIT',
              pkid: MBLID,
              exptype: sType,
              origin: INVOKETYPE
            };
            this.Naviagete('Silver.Other.Trans/OthGeneralExpenseEditPage', JSON.stringify(prm));
            // InvokePage("Other Operations", "Silver.Other.Trans.xap", "Silver.Other.Trans", "GeneralExpensePage", SMENU_ID + "~" + MBLID + "~FA");
          }
          else
            alert("Insufficient Rights");
        }
        else if (sType == "PS") {
          SMENU_ID = this.MENU_INTERNAL_PAYMENT_SETTLEMENT;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            let prm = {
              menuid: SMENU_ID,
              mode: 'EDIT',
              pkid: MBLID,
              exptype: sType,
              origin: INVOKETYPE
            };
            this.Naviagete('Silver.Other.Trans/OthGeneralExpenseEditPage', JSON.stringify(prm));
            // InvokePage("Other Operations", "Silver.Other.Trans.xap", "Silver.Other.Trans", "GeneralExpensePage", SMENU_ID + "~" + MBLID + "~PS");
          }
          else
            alert("Insufficient Rights");
        }
        else {
          alert("Cannot Load Details");
        }
      }
      else if (INVOKETYPE == "HOUSE") {
        if (HBLID.trim() == "")
          alert("Cannot Load Details");
        else if (sType == "AE") {
          SMENU_ID = this.MENU_AE_HOUSE;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            let prm = {
              menuid: SMENU_ID,
              mode: 'EDIT',
              pkid: HBLID,
              parentid: MBLID,
              type: sType,
              refno: '',
              origin: INVOKETYPE
            };
            this.Naviagete('Silver.AirExport.Trans/AirExpHouseEditPage', JSON.stringify(prm));
            //   InvokePage("Air Export House", "Silver.AirExport.Trans.xap", "Silver.AirExport.Trans", "AirExpHousePage", SMENU_ID + "~" + MBLID + "~" + REFNO + "~SEARCH~" + HBLID);
          }
          else
            alert("Insufficient Rights");
        }
        else if (sType == "AI") {
          SMENU_ID = this.MENU_AI_HOUSE;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            let prm = {
              menuid: SMENU_ID,
              mode: 'EDIT',
              pkid: HBLID,
              parentid: MBLID,
              type: sType,
              refno: REFNO,
              origin: INVOKETYPE
            };
            this.Naviagete('Silver.AirImport.Trans/AirImpHouseEditPage', JSON.stringify(prm));
            // InvokePage("Air Import House", "Silver.AirImport.Trans.xap", "Silver.AirImport.Trans", "AirImpHousePage", SMENU_ID + "~" + MBLID + "~" + REFNO + "~SEARCH~" + HBLID);
          }
          else
            alert("Insufficient Rights");
        }
        else if (sType == "OE") {
          SMENU_ID = this.MENU_SE_HOUSE;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {

            let prm = {
              menuid: SMENU_ID,
              mode: 'EDIT',
              pkid: HBLID,
              parentid: MBLID,
              type: sType,
              refno: REFNO,
              origin: INVOKETYPE
            };
            this.Naviagete('Silver.SeaExport.Trans/SeaExpHouseEditPage', JSON.stringify(prm));
            //InvokePage("Sea Export House", "Silver.SeaExport.Trans.xap", "Silver.SeaExport.Trans", "SeaExpHousePage", SMENU_ID + "~" + MBLID + "~" + REFNO + "~SEARCH~" + HBLID);
          }
          else
            alert("Insufficient Rights");
        }
        else if (sType == "OI") {
          SMENU_ID = this.MENU_SI_HOUSE;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            let prm = {
              menuid: SMENU_ID,
              mode: 'EDIT',
              pkid: HBLID,
              parentid: MBLID,
              type: sType,
              refno: REFNO,
              origin: INVOKETYPE
            };
            this.Naviagete('Silver.SeaImport/SeaImpHouseEditPage', JSON.stringify(prm));
            //  InvokePage("Sea Import House", "Silver.SeaImport.xap", "Silver.SeaImport", "SeaImpHousePage", SMENU_ID + "~" + MBLID + "~" + REFNO + "~SEARCH~" + HBLID);
          }
          else
            alert("Insufficient Rights");
        }
        else if (sType == "OT") {
          SMENU_ID = this.MENU_OT_OPERATION;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            let prm = {
              menuid: SMENU_ID,
              mode: 'EDIT',
              pkid: MBLID,
              type: sType,
              origin: INVOKETYPE
            };
            this.Naviagete('Silver.Other.Trans/OthGeneralEditPage', JSON.stringify(prm));
            //   InvokePage("Other Operations", "Silver.Other.Trans.xap", "Silver.Other.Trans", "GeneralPage", SMENU_ID + "~" + MBLID + "~OTHERS");
          }
          else
            alert("Insufficient Rights");
        }
        else if (sType == "EX") {
          SMENU_ID = this.MENU_EX_OPERATION;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            let prm = {
              menuid: SMENU_ID,
              mode: 'EDIT',
              pkid: MBLID,
              type: sType,
              origin: INVOKETYPE
            };
            this.Naviagete('Silver.Other.Trans/OthGeneralEditPage', JSON.stringify(prm));
            //   InvokePage("Extra Operations", "Silver.Other.Trans.xap", "Silver.Other.Trans", "GeneralPage", SMENU_ID + "~" + MBLID + "~EXTRA");
          }
          else
            alert("Insufficient Rights");
        }
        else {
          alert("Cannot Load Details");
        }
      } else if (INVOKETYPE == "ARAP") {

        if (MBLID.trim() == "")
          alert("Cannot Load ARAP List");
        else if (sType == "OI")
          SMENU_ID = this.MENU_SI_MASTER_ARAP;
        else if (sType == "OE")
          SMENU_ID = this.MENU_SE_MASTER_ARAP;
        else if (sType == "AI")
          SMENU_ID = this.MENU_AI_MASTER_ARAP;
        else if (sType == "AE")
          SMENU_ID = this.MENU_AE_MASTER_ARAP;
        else if (sType == "OT")
          SMENU_ID = this.MENU_OT_OPERATION_ARAP;
        else if (sType == "EX")
          SMENU_ID = this.MENU_EX_OPERATION_ARAP;
        else if (sType == "CM")
          SMENU_ID = this.MENU_1099_EXPENSE_ARAP;
        else if (sType == "PR")
          SMENU_ID = this.MENU_PAYROLL_EXPENSE_ARAP;
        else if (sType == "FA")
          SMENU_ID = this.MENU_FILE_ADJUSTMENT_ARAP;
        else if (sType == "GE")
          SMENU_ID = this.MENU_GENERAL_EXPENSE_ARAP;
        else if (sType == "PS")
          SMENU_ID = this.MENU_INTERNAL_PAYMENT_SETTLEMENT_ARAP;
        else {
          alert("Cannot Load ARAP ");
          return;
        }

        if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
          let prm = {
            menuid: SMENU_ID,
            mbl_pkid: MBLID,
            mbl_refno: REFNO,
            mbl_type: sType,
            origin: INVOKETYPE
          };
          this.Naviagete('Silver.USAccounts.Trans/InvoicePage', JSON.stringify(prm));
          //InvokePage("A/R & A/P", "Silver.USAccounts.Trans.xap", "Silver.USAccounts.Trans", "InvoicePage", SMENU_ID + "~" + MBLID + "~" + REFNO + "~" + sType + "~MASTER~" + MBLID);
        }
        else
          alert("Insufficient Rights");
      }

    }
    catch (Exception) {
    }
  }

  public Link2Page(INVOKETYPE: string = "", MBLMODE: string = "", REFNO: string = "", MBLID: string = "", HBLID: string = "", INVID: string = "", FORMATTYPE: string = "") {
    let sType: string = "";
    let SMENU_ID: string = "";
    try {

      MBLMODE = MBLMODE.replace("OCEAN", "SEA");

      if (MBLMODE == "SEA EXPORT" || MBLMODE == "SEA IMPORT" || MBLMODE == "AIR EXPORT" || MBLMODE == "AIR IMPORT" || MBLMODE == "OTHERS" || MBLMODE == "EXTRA") {
        if (REFNO.length >= 2 && MBLID.trim().length > 0)
          sType = REFNO.substring(0, 2);
        else
          sType = "";
      }
      else if (MBLMODE == "CM" || MBLMODE == "PR" || MBLMODE == "FA" || MBLMODE == "GE" || MBLMODE == "PS")
        sType = MBLMODE.trim();
      else
        sType = "";

      if (sType.trim() == "" || INVOKETYPE.trim() == "") {
        return null;
      }

      if (INVOKETYPE == "INVNO") {
        if (INVID.trim() == "")
          return null;
        else if (sType == "OI")
          SMENU_ID = this.MENU_SI_MASTER_ARAP;
        else if (sType == "OE")
          SMENU_ID = this.MENU_SE_MASTER_ARAP;
        else if (sType == "AI")
          SMENU_ID = this.MENU_AI_MASTER_ARAP;
        else if (sType == "AE")
          SMENU_ID = this.MENU_AE_MASTER_ARAP;
        else if (sType == "OT")
          SMENU_ID = this.MENU_OT_OPERATION_ARAP;
        else if (sType == "EX")
          SMENU_ID = this.MENU_EX_OPERATION_ARAP;
        else if (sType == "CM")
          SMENU_ID = this.MENU_1099_EXPENSE_ARAP;
        else if (sType == "PR")
          SMENU_ID = this.MENU_PAYROLL_EXPENSE_ARAP;
        else if (sType == "FA")
          SMENU_ID = this.MENU_FILE_ADJUSTMENT_ARAP;
        else if (sType == "GE")
          SMENU_ID = this.MENU_GENERAL_EXPENSE_ARAP;
        else if (sType == "PS")
          SMENU_ID = this.MENU_INTERNAL_PAYMENT_SETTLEMENT_ARAP;
        else {
          return null;
        }

        if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
          if (FORMATTYPE == "P") {
            return {
              appid: this.appid,
              menuid: SMENU_ID,
              pkid: INVID,
              mode: 'EDIT',
              mbl_pkid: MBLID,
              mbl_refno: REFNO,
              mbl_type: sType,
              inv_arap: '',
              arrival_notice: '',
              origin: INVOKETYPE
            };
          } else if (FORMATTYPE == "L") {
            return "/Silver.USAccounts.Trans/InvoiceEditPage";
          } else
            return null;
        }
        else
          return null;
      }
      else if (INVOKETYPE == "REFNO") {
        if (sType == "AE") {
          SMENU_ID = this.MENU_AE_MASTER;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            if (FORMATTYPE == "P") {
              return {
                appid: this.appid,
                menuid: SMENU_ID,
                mode: 'EDIT',
                pkid: MBLID,
                type: sType,
                origin: INVOKETYPE
              };
            } else if (FORMATTYPE == "L") {
              return "/Silver.AirExport.Trans/AirExpMasterEditPage";
            } else
              return null;
          }
          else
            return null;
        }
        else if (sType == "AI") {
          SMENU_ID = this.MENU_AI_MASTER;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            if (FORMATTYPE == "P") {
              return {
                appid: this.appid,
                menuid: SMENU_ID,
                mode: 'EDIT',
                pkid: MBLID,
                type: sType,
                origin: INVOKETYPE
              };
            } else if (FORMATTYPE == "L") {
              return "/Silver.AirImport.Trans/AirImpMasterEditPage";
            } else
              return null;
          }
          else
            return null;
        }
        else if (sType == "OE") {
          SMENU_ID = this.MENU_SE_MASTER;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            if (FORMATTYPE == "P") {
              return {
                appid: this.appid,
                menuid: SMENU_ID,
                mode: 'EDIT',
                pkid: MBLID,
                type: sType,
                origin: INVOKETYPE
              };
            } else if (FORMATTYPE == "L") {
              return "/Silver.SeaExport.Trans/SeaExpMasterEditPage";
            } else
              return null;
          }
          else
            return null;
        }
        else if (sType == "OI") {
          SMENU_ID = this.MENU_SI_MASTER;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            if (FORMATTYPE == "P") {
              return {
                appid: this.appid,
                menuid: SMENU_ID,
                mode: 'EDIT',
                pkid: MBLID,
                type: sType,
                origin: INVOKETYPE
              };
            } else if (FORMATTYPE == "L") {
              return "/Silver.SeaImport/SeaImpMasterEditPage";
            } else
              return null;
          }
          else
            return null;
        }
        else if (sType == "OT") {
          SMENU_ID = this.MENU_OT_OPERATION;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            if (FORMATTYPE == "P") {
              return {
                appid: this.appid,
                menuid: SMENU_ID,
                mode: 'EDIT',
                pkid: MBLID,
                type: sType,
                origin: INVOKETYPE
              };
            } else if (FORMATTYPE == "L") {
              return "/Silver.Other.Trans/OthGeneralEditPage";
            } else
              return null;
          }
          else
            return null;
        }
        else if (sType == "EX") {
          SMENU_ID = this.MENU_EX_OPERATION;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            if (FORMATTYPE == "P") {
              return {
                appid: this.appid,
                menuid: SMENU_ID,
                mode: 'EDIT',
                pkid: MBLID,
                type: sType,
                origin: INVOKETYPE
              };
            } else if (FORMATTYPE == "L") {
              return "/Silver.Other.Trans/OthGeneralEditPage";
            } else
              return null;
          }
          else
            return null;
        }
        else if (sType == "GE") {
          SMENU_ID = this.MENU_GENERAL_EXPENSE;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            if (FORMATTYPE == "P") {
              return {
                appid: this.appid,
                menuid: SMENU_ID,
                mode: 'EDIT',
                pkid: MBLID,
                exptype: sType,
                origin: INVOKETYPE
              };
            } else if (FORMATTYPE == "L") {
              return "/Silver.Other.Trans/OthGeneralExpenseEditPage";
            } else
              return null;
          }
          else
            return null;
        }
        else if (sType == "CM") {
          SMENU_ID = this.MENU_1099_EXPENSE;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            if (FORMATTYPE == "P") {
              return {
                appid: this.appid,
                menuid: SMENU_ID,
                mode: 'EDIT',
                pkid: MBLID,
                exptype: sType,
                origin: INVOKETYPE
              };
            } else if (FORMATTYPE == "L") {
              return "/Silver.Other.Trans/OthGeneralExpenseEditPage";
            } else
              return null;
          }
          else
            return null;
        }
        else if (sType == "PR") {
          SMENU_ID = this.MENU_PAYROLL_EXPENSE;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            if (FORMATTYPE == "P") {
              return {
                appid: this.appid,
                menuid: SMENU_ID,
                mode: 'EDIT',
                pkid: MBLID,
                exptype: sType,
                origin: INVOKETYPE
              };
            } else if (FORMATTYPE == "L") {
              return "/Silver.Other.Trans/OthGeneralExpenseEditPage";
            } else
              return null;
          }
          else
            return null;
        }
        else if (sType == "FA") {
          SMENU_ID = this.MENU_FILE_ADJUSTMENT;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            if (FORMATTYPE == "P") {
              return {
                appid: this.appid,
                menuid: SMENU_ID,
                mode: 'EDIT',
                pkid: MBLID,
                exptype: sType,
                origin: INVOKETYPE
              };
            } else if (FORMATTYPE == "L") {
              return "/Silver.Other.Trans/OthGeneralExpenseEditPage";
            } else
              return null;
          }
          else
            return null;
        }
        else if (sType == "PS") {
          SMENU_ID = this.MENU_INTERNAL_PAYMENT_SETTLEMENT;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            if (FORMATTYPE == "P") {
              return {
                appid: this.appid,
                menuid: SMENU_ID,
                mode: 'EDIT',
                pkid: MBLID,
                exptype: sType,
                origin: INVOKETYPE
              };
            } else if (FORMATTYPE == "L") {
              return "/Silver.Other.Trans/OthGeneralExpenseEditPage";
            } else
              return null;
          }
          else
            return null;
        }
        else {
          return null;
        }
      }
      else if (INVOKETYPE == "HOUSE") {
        if (HBLID.trim() == "")
          return null;
        else if (sType == "AE") {
          SMENU_ID = this.MENU_AE_HOUSE;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            if (FORMATTYPE == "P") {
              return {
                appid: this.appid,
                menuid: SMENU_ID,
                mode: 'EDIT',
                pkid: HBLID,
                parentid: MBLID,
                type: sType,
                refno: '',
                origin: INVOKETYPE
              };
            } else if (FORMATTYPE == "L") {
              return "/Silver.AirExport.Trans/AirExpHouseEditPage";
            } else
              return null;
          }
          else
            return null;
        }
        else if (sType == "AI") {
          SMENU_ID = this.MENU_AI_HOUSE;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            if (FORMATTYPE == "P") {
              return {
                appid: this.appid,
                menuid: SMENU_ID,
                mode: 'EDIT',
                pkid: HBLID,
                parentid: MBLID,
                type: sType,
                refno: REFNO,
                origin: INVOKETYPE
              };
            } else if (FORMATTYPE == "L") {
              return "/Silver.AirImport.Trans/AirImpHouseEditPage";
            } else
              return null;
          }
          else
            return null;
        }
        else if (sType == "OE") {
          SMENU_ID = this.MENU_SE_HOUSE;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            if (FORMATTYPE == "P") {
              return {
                appid: this.appid,
                menuid: SMENU_ID,
                mode: 'EDIT',
                pkid: HBLID,
                parentid: MBLID,
                type: sType,
                refno: REFNO,
                origin: INVOKETYPE
              };
            } else if (FORMATTYPE == "L") {
              return "/Silver.SeaExport.Trans/SeaExpHouseEditPage";
            } else
              return null;
          }
          else
            return null;
        }
        else if (sType == "OI") {
          SMENU_ID = this.MENU_SI_HOUSE;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            if (FORMATTYPE == "P") {
              return {
                appid: this.appid,
                menuid: SMENU_ID,
                mode: 'EDIT',
                pkid: HBLID,
                parentid: MBLID,
                type: sType,
                refno: REFNO,
                origin: INVOKETYPE
              };
            } else if (FORMATTYPE == "L") {
              return "/Silver.SeaImport/SeaImpHouseEditPage";
            } else
              return null;
          }
          else
            return null;
        }
        else if (sType == "OT") {
          SMENU_ID = this.MENU_OT_OPERATION;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            if (FORMATTYPE == "P") {
              return {
                appid: this.appid,
                menuid: SMENU_ID,
                mode: 'EDIT',
                pkid: MBLID,
                type: sType,
                origin: INVOKETYPE
              };
            } else if (FORMATTYPE == "L") {
              return "/Silver.Other.Trans/OthGeneralEditPage";
            } else
              return null;
          }
          else
            return null;
        }
        else if (sType == "EX") {
          SMENU_ID = this.MENU_EX_OPERATION;
          if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
            if (FORMATTYPE == "P") {
              return {
                appid: this.appid,
                menuid: SMENU_ID,
                mode: 'EDIT',
                pkid: MBLID,
                type: sType,
                origin: INVOKETYPE
              };
            } else if (FORMATTYPE == "L") {
              return "/Silver.Other.Trans/OthGeneralEditPage";
            } else
              return null;
          }
          else
            return null;
        }
        else {
          return null;
        }
      } else if (INVOKETYPE == "ARAP") {

        if (MBLID.trim() == "")
          return null;
        else if (sType == "OI")
          SMENU_ID = this.MENU_SI_MASTER_ARAP;
        else if (sType == "OE")
          SMENU_ID = this.MENU_SE_MASTER_ARAP;
        else if (sType == "AI")
          SMENU_ID = this.MENU_AI_MASTER_ARAP;
        else if (sType == "AE")
          SMENU_ID = this.MENU_AE_MASTER_ARAP;
        else if (sType == "OT")
          SMENU_ID = this.MENU_OT_OPERATION_ARAP;
        else if (sType == "EX")
          SMENU_ID = this.MENU_EX_OPERATION_ARAP;
        else if (sType == "CM")
          SMENU_ID = this.MENU_1099_EXPENSE_ARAP;
        else if (sType == "PR")
          SMENU_ID = this.MENU_PAYROLL_EXPENSE_ARAP;
        else if (sType == "FA")
          SMENU_ID = this.MENU_FILE_ADJUSTMENT_ARAP;
        else if (sType == "GE")
          SMENU_ID = this.MENU_GENERAL_EXPENSE_ARAP;
        else if (sType == "PS")
          SMENU_ID = this.MENU_INTERNAL_PAYMENT_SETTLEMENT_ARAP;
        else {
          return null;
        }

        if (this.canEdit(SMENU_ID) || this.canView(SMENU_ID)) {
          if (FORMATTYPE == "P") {
            return {
              appid: this.appid,
              menuid: SMENU_ID,
              mbl_pkid: MBLID,
              mbl_refno: REFNO,
              mbl_type: sType,
              origin: INVOKETYPE
            };
          } else if (FORMATTYPE == "L") {
            return "/Silver.USAccounts.Trans/InvoicePage";
          } else
            return null;
        }
        else
          return null;
      }
    }
    catch (Exception) {
      return null;
    }
  }
  public copyToClipboard(val: string) {
    try {
      const txtBox = document.createElement('textarea');
      txtBox.style.position = 'fixed';
      txtBox.style.left = '0';
      txtBox.style.top = '0';
      txtBox.style.opacity = '0';
      txtBox.value = val;
      document.body.appendChild(txtBox);
      txtBox.focus();
      txtBox.select();
      document.execCommand('copy');
      document.body.removeChild(txtBox);
    }
    catch (Exception) {
    }
  }

  public getRandomInt() {
    return Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
  }

  getURLParam(param: string) {
    return new URLSearchParams(window.location.search).get(param);
  }





}
