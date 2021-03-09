import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { CopyCntrPageService } from '../services/copycntrpage.service';
import { User_Menu } from '../../core/models/menum';
import { Tbl_cargo_imp_housem, Tbl_cargo_imp_container, vm_tbl_cargo_imp_housem } from '../models/tbl_cargo_imp_housem';
import { SearchTable } from '../../shared/models/searchtable';
import { strictEqual } from 'assert';

@Component({
  selector: 'app-copycntrpage',
  templateUrl: './copycntrpage.component.html'
})
export class CopyCntrPageComponent implements OnInit {

  cntrrecords: Tbl_cargo_imp_container[] = [];
  hblrecords: Tbl_cargo_imp_housem[] = [];

  // 15-07-2019 Created By Ajith  

  @ViewChild('_cntr_chked') cntr_chked_field: ElementRef;
  @ViewChildren('_cntr_sealno') cntr_sealno_field: QueryList<ElementRef>;

  pkid: string;
  menuid: string;
  mode: string;
  title: string = '';
  isAdmin: boolean;
  chkallselected_cntr: boolean = false;
  selectdeselect_cntr: boolean = false;
  chkallselected_hbl: boolean = false;
  selectdeselect_hbl: boolean = false;
  errorMessage: string;
  mbl_cntr_type: string;

  IsLocked: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: CopyCntrPageService
  ) { }

  ngOnInit() {
    const options = JSON.parse(this.route.snapshot.queryParams.parameter);
    this.pkid = options.pkid;
    this.menuid = options.menuid;
    this.mbl_cntr_type = options.mbl_cntr_type;
    this.initPage();
    this.actionHandler();
  }

  private initPage() {
    this.title = 'Copy Cntr Page';
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.errorMessage = '';
  }

  actionHandler() {
    this.errorMessage = '';
    this.List('LOAD');
  }

  List(action: string = '') {
    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.chkallselected_cntr = false;
        this.selectdeselect_cntr = false;
        this.chkallselected_hbl = false;
        this.selectdeselect_hbl = false;
        this.cntrrecords = response.cntrlist;
        this.hblrecords = response.hbllist;

        if (!this.gs.isBlank(this.cntr_chked_field))
          this.cntr_chked_field.nativeElement.focus();

      }, error => {
        this.errorMessage = this.gs.getError(error);
      });
  }

  Save() {

    this.SaveParent();
    if (!this.Allvalid())
      return;

    const saveRecord = <vm_tbl_cargo_imp_housem>{};
    saveRecord.pkid = this.pkid;
    saveRecord.cntrs = this.cntrrecords;
    saveRecord.hbls = this.hblrecords;
    saveRecord.userinfo = this.gs.UserInfo;

    this.mainService.Save(saveRecord)
      .subscribe(response => {

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
    let iCtr: number = 0;
    this.cntrrecords.forEach(Rec => {
      iCtr++;
      Rec.cntr_hblid = this.pkid.toString();
      Rec.cntr_catg = "M";
      Rec.cntr_order = iCtr;
      Rec.cntr_weight_uom = "";
      Rec.cntr_packages = 0;
      Rec.cntr_yn = Rec.cntr_selected ? "Y" : "N";
    })

    this.hblrecords.forEach(Rec => {
      Rec.hbl_yn = Rec.hbl_checked ? "Y" : "N";
    })
  }

  private Allvalid(): boolean {

    var bRet = true;
    this.errorMessage = "";
    // if (this.record.cust_parentid == "") {
    //   bRet = false;
    //   this.errorMessage = "Invalid ID";
    //   alert(this.errorMessage);
    //   return bRet;
    // }
    // if (this.record.cust_title == "") {
    //   bRet = false;
    //   this.errorMessage = "Title cannot be blank";
    //   alert(this.errorMessage);
    //   return bRet;
    // }


    this.cntrrecords.forEach(Rec => {

      if (Rec.cntr_no.length != 11) {
        bRet = false;
        this.errorMessage = "Container( " + Rec.cntr_no + " ) Invalid"
        return bRet;
      }
      if (Rec.cntr_type.length <= 0) {
        bRet = false;
        this.errorMessage = "Container( " + Rec.cntr_no + " ) type has to be selected"
        return bRet;
      }
      if (Rec.cntr_type == "LCL" || this.mbl_cntr_type.trim() == "LCL") {
        if (Rec.cntr_cbm <= 0) {
          bRet = false;
          this.errorMessage = "Container( " + Rec.cntr_no + " ) CBM cannot be zero"
          return bRet;
        }
      }
    })

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
    // Container
    if (_Record.controlname == "CONTAINER TYPE") {
      let idx: number = 0;
      this.cntrrecords.forEach(rec => {
        if (rec.cntr_pkid == _Record.uid) {
          rec.cntr_type = _Record.code;
          this.cntr_sealno_field.toArray()[idx].nativeElement.focus();
        }
        idx++;
      });
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


  onBlur(field: string, rec: Tbl_cargo_imp_container = null) {
    switch (field) {
      //   case 'cust_title': {
      //     this.record.cust_title = this.record.cust_title.toUpperCase();
      //     break;
      //   }
      //   case 'cust_comm_inv': {
      //     this.record.cust_comm_inv = this.record.cust_comm_inv.toUpperCase();
      //     break;
      //   }
      //   case 'cust_fumi_cert': {
      //     this.record.cust_fumi_cert = this.record.cust_fumi_cert.toUpperCase();
      //     break;
      //   }
      //   case 'cust_insp_chrg': {
      //     this.record.cust_insp_chrg = this.record.cust_insp_chrg.toUpperCase();
      //     break;
      //   }
      //   case 'cust_remarks': {
      //     this.record.cust_remarks = this.record.cust_remarks.toUpperCase();
      //     break;
      //   }
      //   case 'cntr_pieces': {
      //     rec.cntr_pieces = this.gs.roundNumber(rec.cntr_pieces, 0);
      //     break;
      //   }


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
      case 'cntr_weight_uom': {
        rec.cntr_weight_uom = rec.cntr_weight_uom.toUpperCase();
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
      case 'cntr_tare_weight': {
        rec.cntr_tare_weight = this.gs.roundNumber(rec.cntr_tare_weight, 0);
        break;
      }

    }
  }

  SelectDeselect(action: string) {
    if (action == 'CNTR') {
      this.selectdeselect_cntr = !this.selectdeselect_cntr;
      for (let rec of this.cntrrecords) {
        rec.cntr_selected = this.selectdeselect_cntr;
      }
      this.chkallselected_cntr = this.selectdeselect_cntr;
    }
    if (action == 'HBL') {
      this.selectdeselect_hbl = !this.selectdeselect_hbl;
      for (let rec of this.hblrecords) {
        rec.hbl_checked = this.selectdeselect_hbl;
      }
      this.chkallselected_hbl = this.selectdeselect_hbl;
    }
  }

}
