import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { InputBoxComponent } from '../../shared/input/inputbox.component';
import { GlobalService } from '../../core/services/global.service';
import { User_Menu } from '../../core/models/menum';
import { SearchTable } from '../../shared/models/searchtable';

import { BookingService } from '../services/booking.service';
import { Tbl_cargo_exp_bookingm, vm_Tbl_cargo_exp_bookingm } from '../models/Tbl_cargo_exp_bookingm';
import { DateComponent } from '../../shared/date/date.component';
import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';


@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html'
})
export class BookingComponent implements OnInit {


  private pkid: string;
  private menuid: string;
  private mode: string;
  //private errorMessage: string;
  private errorMessage: string[] = [];

  private title: string;
  private isAdmin: boolean;

  report_url: string;
  report_searchdata: any = {};
  report_menuid: string;
  tab: string = 'main';
  is_locked: boolean = false;

  record: Tbl_cargo_exp_bookingm = <Tbl_cargo_exp_bookingm>{};


  @ViewChild('_book_shipper_name') book_shipper_name_ctrl: InputBoxComponent;
  @ViewChild('_book_date') book_date_ctrl: DateComponent;
  @ViewChild('_book_pol_etd') book_pol_etd_ctrl: DateComponent;
  @ViewChild('_book_pod_eta') book_pod_eta_ctrl: DateComponent;
  @ViewChild('_book_trucker_name') book_trucker_name_ctrl: AutoComplete2Component;
  @ViewChild('_book_cntr_pickupat1') book_cntr_pickupat1_ctrl: InputBoxComponent;
  @ViewChild('_book_location_name') book_location_name_ctrl: InputBoxComponent;
  @ViewChild('_book_cntr_returnat1') book_cntr_returnat1_ctrl: InputBoxComponent;
  @ViewChild('_book_salesman_name') book_salesman_name_ctrl: AutoComplete2Component;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: BookingService,
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
    this.record = <Tbl_cargo_exp_bookingm>{};
    this.GetRecord();

  }

  GetRecord() {

    this.errorMessage = [];
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = this.pkid;
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.record = <Tbl_cargo_exp_bookingm>response.record;
        if (this.record.book_pkid == "") {
          this.record.book_pkid = this.pkid;
          this.mode = "ADD";
        }
        else
          this.mode = "EDIT";

        if (!this.gs.isBlank(this.book_date_ctrl))
          this.book_date_ctrl.Focus();

      }, error => {
        this.errorMessage.push(this.gs.getError(error));
      });
  }


  Allvalid() {
    let bRet = true;
    this.errorMessage = [];
    if (this.gs.isBlank(this.record.book_date)) {
      bRet = false;
      this.errorMessage.push("Date cannot be Empty");
    }

    if (this.gs.isBlank(this.record.book_refno)) {
      bRet = false;
      this.errorMessage.push("Ref# cannot be Empty");
    }

    if (this.gs.isBlank(this.record.book_shipper_id)) {
      bRet = false;
      this.errorMessage.push("Shipper Code Cannot Be Empty");
    }


    if (this.gs.isBlank(this.record.book_shipper_name)) {
      bRet = false;
      this.errorMessage.push("Shipper Name Cannot Be Empty");
    }


    if (this.gs.isBlank(this.record.book_shipper_add1)) {
      bRet = false;
      this.errorMessage.push("Shipper Address1 Cannot Be Empty");
    }

    if (this.gs.isBlank(this.record.book_handled_id)) {
      bRet = false;
      this.errorMessage.push("Handled By Cannot Be Empty");
    }

    if (!bRet)
      alert('Error While Saving');

    return bRet;
  }

  onBlur(field: string) {

  }



  Save() {

    if (!this.Allvalid())
      return;

    const saverec = <vm_Tbl_cargo_exp_bookingm>{};
    saverec.mode = this.mode;
    saverec.record = this.record;
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
    }
    );

  }


  LovSelected(rec: SearchTable) {

    if (rec.controlname == "SHIPPER") {
      this.record.book_shipper_id = rec.id;
      this.record.book_shipper_name = rec.name;

      if (rec.col8 != "")
        this.record.book_shipper_name = rec.col8;

      this.record.book_shipper_add1 = rec.col1;
      this.record.book_shipper_add2 = rec.col2;
      this.record.book_shipper_add3 = rec.col3;
      this.record.book_shipper_add4 = this.gs.GetAttention(rec.col5);
      this.record.book_shipper_add5 = this.gs.GetTelFax(rec.col6, rec.col7);
      if (!this.gs.isBlank(this.book_shipper_name_ctrl))
        this.book_shipper_name_ctrl.focus();
    }

    if (rec.controlname == "FORWARDER") {
      this.record.book_forwarder_id = rec.id;
      if (!this.gs.isBlank(this.book_trucker_name_ctrl))
        this.book_trucker_name_ctrl.Focus();
    }
    if (rec.controlname == "TRUCKER") {
      this.record.book_trucker_id = rec.id;
    }
    if (rec.controlname == "POL") {

      this.record.book_pol_id = rec.id;
      if (!this.gs.isBlank(this.book_pol_etd_ctrl))
        this.book_pol_etd_ctrl.Focus();
    }

    if (rec.controlname == "POD") {
      this.record.book_pod_id = rec.id;
      if (!this.gs.isBlank(this.book_pod_eta_ctrl))
        this.book_pod_eta_ctrl.Focus();
    }

    if (rec.controlname == "PICKUPAT") {
      this.record.book_cntr_pickupat_id = rec.id;
      this.record.book_cntr_pickupat1 = rec.name;
      if (rec.col8 != "")
        this.record.book_cntr_pickupat1 = rec.col8;
      this.record.book_cntr_pickupat2 = rec.col1;
      this.record.book_cntr_pickupat3 = rec.col2;
      this.record.book_cntr_pickupat4 = rec.col1;
      if (!this.gs.isBlank(this.book_cntr_pickupat1_ctrl))
        this.book_cntr_pickupat1_ctrl.focus();
    }

    if (rec.controlname == "RETURNAT") {
      this.record.book_cntr_returnat_id = rec.id;
      this.record.book_cntr_returnat1 = rec.name;
      if (rec.col8 != "")
        this.record.book_cntr_returnat1 = rec.col8;
      this.record.book_cntr_returnat2 = rec.col1;
      this.record.book_cntr_returnat3 = rec.col2;
      this.record.book_cntr_returnat4 = rec.col1;
      if (!this.gs.isBlank(this.book_cntr_returnat1_ctrl))
        this.book_cntr_returnat1_ctrl.focus();
    }


    if (rec.controlname == "LOCATION") {
      this.record.book_location_id = rec.id;
      this.record.book_location_name = rec.name;
      if (rec.col8 != "")
        this.record.book_location_name = rec.col8;
      this.record.book_location_addr1 = rec.col1;
      this.record.book_location_addr2 = rec.col2;
      this.record.book_location_addr3 = rec.col3;
      this.record.book_location_addr4 = this.gs.GetTelFax(rec.col6, rec.col7);
      if (!this.gs.isBlank(this.book_location_name_ctrl))
        this.book_location_name_ctrl.focus();
    }

    if (rec.controlname == "HANDLEDBY") {
      this.record.book_handled_id = rec.id;
      if (!this.gs.isBlank(this.book_salesman_name_ctrl))
        this.book_salesman_name_ctrl.Focus();
    }

    if (rec.controlname == "SALEMSAN") {
      this.record.book_salesman_id = rec.id;
    }



  }




  Print() {

    this.report_url = '/api/SeaExport/Booking/BookingReport';
    this.report_searchdata = this.gs.UserInfo;
    this.report_searchdata.pkid = this.pkid;
    this.report_menuid = this.gs.MENU_SE_BOOKING;
    this.tab = 'report';
  }

  callbackevent() {
    this.tab = 'main';
  }



  Close() {
    this.location.back();
  }


}
