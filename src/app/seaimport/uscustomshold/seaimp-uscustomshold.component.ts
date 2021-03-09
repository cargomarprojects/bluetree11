import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { SeaImpUsCustholdService } from '../services/seaimp-uscustomshold.service';
import { User_Menu } from '../../core/models/menum';
import { Tbl_cargo_imp_custhold, vm_tbl_cargo_imp_custhold } from '../models/tbl_cargo_imp_custhold';
import { SearchTable } from '../../shared/models/searchtable';
import { strictEqual } from 'assert';

@Component({
  selector: 'app-seaimp-uscustomshold',
  templateUrl: './seaimp-uscustomshold.component.html'
})
export class SeaImpUsCustomsHoldComponent implements OnInit {

  // @ViewChild('mbl_no') mbl_no_field: ElementRef;
  @ViewChild('_cust_title') cust_title_field: ElementRef;
  record: Tbl_cargo_imp_custhold = <Tbl_cargo_imp_custhold>{};

  // 15-07-2019 Created By Ajith  

   pkid: string;
   menuid: string;
   mode: string;
   title: string='';
   isAdmin: boolean;
   houseno: string = '';
   mblrefno: string = '';

   errorMessage: string;

  tab: string = 'main';
  report_title: string = '';
  report_url: string = '';
  report_searchdata: any = {};
  report_menuid: string = '';

  IsLocked: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: SeaImpUsCustholdService,
  ) { }

  ngOnInit() {
    const options = JSON.parse(this.route.snapshot.queryParams.parameter);
    this.pkid = options.pkid;
    this.menuid = options.menuid;
    this.IsLocked = options.is_locked;
    this.mode = 'EDIT';
    this.initPage();
    this.actionHandler();
  }

  private initPage() {
    this.title = 'US Custom Hold';
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
      this.record = <Tbl_cargo_imp_custhold>{};
      this.init();
    }
    if (this.mode == 'EDIT') {
      this.GetRecord();
    }
  }

  init() {
    this.record.cust_parentid = this.pkid;
    this.record.cust_title = '';
    this.record.cust_comm_inv_yn = 'N';
    this.record.cust_comm_inv = '';
    this.record.cust_fumi_cert_yn = 'N';
    this.record.cust_fumi_cert = '';
    this.record.cust_insp_chrg_yn = 'N';
    this.record.cust_insp_chrg = '';
    this.record.cust_remarks = '';
    this.record.IS_comm_inv = false;
    this.record.IS_fumi_cert = false;
    this.record.IS_insp_chrg = false;
    this.cust_title_field.nativeElement.focus();
  }

  GetRecord() {
    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
     SearchData.pkid = this.pkid;
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.mode = response.mode;
        this.houseno = response.houseno;
        this.mblrefno = response.mblrefno;

        if (this.mode == 'ADD')
          this.actionHandler();
        else {
          this.record = <Tbl_cargo_imp_custhold>response.record;
          this.record.IS_comm_inv = (this.record.cust_comm_inv_yn == "Y") ? true : false;
          this.record.IS_fumi_cert = (this.record.cust_fumi_cert_yn == "Y") ? true : false;
          this.record.IS_insp_chrg = (this.record.cust_insp_chrg_yn == "Y") ? true : false;

          this.CheckData();
          this.cust_title_field.nativeElement.focus();
        }
      }, error => {
        this.errorMessage = this.gs.getError(error);
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



  Save() {

    if (!this.Allvalid())
      return;

    this.record.cust_comm_inv_yn = (this.record.IS_comm_inv == true) ? "Y" : "N";
    this.record.cust_fumi_cert_yn = (this.record.IS_fumi_cert == true) ? "Y" : "N";
    this.record.cust_insp_chrg_yn = (this.record.IS_insp_chrg == true) ? "Y" : "N";

    const saveRecord = <vm_tbl_cargo_imp_custhold>{};
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
          this.mode = 'EDIT';
          this.errorMessage = 'Save Complete';
          // alert(this.errorMessage);
        }
      }, error => {
        this.errorMessage = this.gs.getError(error);
        alert(this.errorMessage);
      });
  }

  private Allvalid(): boolean {

    var bRet = true;
    this.errorMessage = "";
    if (this.record.cust_parentid == "") {
      bRet = false;
      this.errorMessage = "Invalid ID";
      alert(this.errorMessage);
      return bRet;
    }
    if (this.record.cust_title == "") {
      bRet = false;
      this.errorMessage = "Title cannot be blank";
      alert(this.errorMessage);
      return bRet;
    }
    return bRet;
  }


  Close() {
    this.location.back();
  }


  LovSelected(_Record: SearchTable) {

    // if (_Record.controlname == "AGENT") {
    //   this.record.mbl_agent_id = _Record.id;
    //   this.record.mbl_agent_name = _Record.name;
    // }
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
      case 'cust_title': {
        this.record.cust_title = this.record.cust_title.toUpperCase();
        break;
      }
      case 'cust_comm_inv': {
        this.record.cust_comm_inv = this.record.cust_comm_inv.toUpperCase();
        break;
      }
      case 'cust_fumi_cert': {
        this.record.cust_fumi_cert = this.record.cust_fumi_cert.toUpperCase();
        break;
      }
      case 'cust_insp_chrg': {
        this.record.cust_insp_chrg = this.record.cust_insp_chrg.toUpperCase();
        break;
      }
      case 'cust_remarks': {
        this.record.cust_remarks = this.record.cust_remarks.toUpperCase();
        break;
      }
      //   case 'cntr_pieces': {
      //     rec.cntr_pieces = this.gs.roundNumber(rec.cntr_pieces, 0);
      //     break;
      //   }
    }
  }

  UsCustomsRptPrint() {
    this.report_title = 'US CUSTOMS HOLD';
    this.report_url = '/api/SeaImport/UsCustomshold/GetUsCustomsReport';
    this.report_searchdata = this.gs.UserInfo;
    this.report_searchdata.pkid = this.pkid;
    this.report_menuid = this.gs.MENU_SI_HOUSE_US_CUSTOM_HOLD;
    this.tab = 'report';
  }
  callbackevent(event: any) {
    this.tab = 'main';
  }
}
